// Corre com: npm test (node --test; o Node 26 lê TypeScript sem compilar).
// Fora do tsconfig da app: o Node só tira os tipos, não os verifica.
import assert from "node:assert/strict";
import { test } from "node:test";

import { addPlayer, clampImpostors, createRound, maxImpostors } from "../src/game/logic.ts";
import type { Category, Settings } from "../src/game/types.ts";
import { en } from "../src/words/en.ts";
import { pt } from "../src/words/pt.ts";

const players = ["Ana", "Bruno", "Carla", "Duarte", "Eva", "Filipe"];

function settings(change: Partial<Settings> = {}): Settings {
  return { players, lang: "pt", mode: "classic", impostors: 1, categories: [], ...change };
}

test("os impostores são sempre minoria", () => {
  assert.equal(maxImpostors(3), 1);
  assert.equal(maxImpostors(4), 1);
  assert.equal(maxImpostors(5), 2);
  assert.equal(maxImpostors(7), 3);
  assert.equal(clampImpostors(5, 4), 1);
  assert.equal(clampImpostors(0, 6), 1);
});

test("addPlayer recusa nomes vazios e repetidos e diz porquê", () => {
  assert.deepEqual(addPlayer([], "  Ana   Maria "), { ok: true, players: ["Ana Maria"] });
  assert.deepEqual(addPlayer(["Ana"], "ana"), { ok: false, reason: "duplicate" });
  assert.deepEqual(addPlayer(["Ana"], "   "), { ok: false, reason: "empty" });
  const full = Array.from({ length: 20 }, (_, i) => `J${i}`);
  assert.deepEqual(addPlayer(full, "Zé"), { ok: false, reason: "full" });
});

test("cada modo dá ao impostor o que deve", () => {
  for (let i = 0; i < 200; i++) {
    for (const mode of ["classic", "hint", "undercover"] as const) {
      const round = createRound(settings({ mode, impostors: 2 }), pt, new Set());
      const imps = round.roles.filter((r) => r.impostor);
      const civis = round.roles.filter((r) => !r.impostor);

      assert.equal(imps.length, 2);
      assert.ok(civis.every((r) => r.word === round.civilWord && r.hint === null));
      assert.notEqual(round.civilWord, round.otherWord);
      assert.ok(players.includes(round.starter));

      for (const r of imps) {
        if (mode === "classic") assert.deepEqual([r.word, r.hint], [null, null]);
        if (mode === "hint") assert.deepEqual([r.word, r.hint], [null, round.otherWord]);
        if (mode === "undercover") assert.deepEqual([r.word, r.hint], [round.otherWord, null]);
      }
    }
  }
});

test("só sai das categorias escolhidas", () => {
  const animais = pt.find((c) => c.id === "animais")!;
  for (let i = 0; i < 100; i++) {
    const round = createRound(settings({ categories: ["animais"] }), pt, new Set());
    assert.equal(round.category, animais.name);
  }
});

test("não repete pares até se esgotarem", () => {
  const tiny: Category[] = [
    { id: "a", name: "A", pairs: [["x", "y"], ["z", "w"]] },
  ];
  const used = new Set<string>();
  const first = createRound(settings(), tiny, used);
  used.add(first.pairKey);
  const second = createRound(settings(), tiny, used);
  assert.notEqual(first.pairKey, second.pairKey);
  used.add(second.pairKey);
  // esgotados: volta a usar tudo em vez de falhar
  assert.doesNotThrow(() => createRound(settings(), tiny, used));
});

test("menos de 3 jogadores não começa", () => {
  assert.throws(() => createRound(settings({ players: ["Ana", "Bruno"] }), pt, new Set()));
});

for (const [lang, categories] of [["pt", pt], ["en", en]] as const) {
  test(`palavras ${lang}: sem repetidos nem pares iguais`, () => {
    const ids = categories.map((c) => c.id);
    assert.equal(new Set(ids).size, ids.length, "ids de categoria repetidos");

    const seen = new Map<string, string>();
    for (const c of categories) {
      assert.ok(c.pairs.length >= 15, `${c.id} tem poucos pares`);
      for (const [a, b] of c.pairs) {
        assert.notEqual(a.toLowerCase(), b.toLowerCase(), `par igual em ${c.id}`);
        for (const w of [a, b]) {
          const key = w.toLowerCase();
          assert.ok(!seen.has(key), `"${w}" aparece em ${seen.get(key)} e em ${c.id}`);
          seen.set(key, c.id);
        }
      }
    }
  });
}
