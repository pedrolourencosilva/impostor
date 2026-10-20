import type { Category, Pair, Role, Round, Settings } from "./types";

export const MIN_PLAYERS = 3;
export const MAX_PLAYERS = 20;
export const MAX_NAME_LENGTH = 20;

export type Random = () => number;

// Com n jogadores, os impostores têm de ser sempre minoria clara.
export function maxImpostors(playerCount: number): number {
  return Math.max(1, Math.floor((playerCount - 1) / 2));
}

export function clampImpostors(impostors: number, playerCount: number): number {
  return Math.min(Math.max(1, impostors), maxImpostors(playerCount));
}

export function normalizeName(name: string): string {
  return name.trim().replace(/\s+/g, " ").slice(0, MAX_NAME_LENGTH);
}

// Devolve a lista com o nome acrescentado, ou null se for vazio, repetido
// (sem distinguir maiúsculas) ou se já houver jogadores a mais.
export function addPlayer(players: string[], rawName: string): string[] | null {
  const name = normalizeName(rawName);
  if (!name || players.length >= MAX_PLAYERS) return null;
  if (players.some((p) => p.toLowerCase() === name.toLowerCase())) return null;
  return [...players, name];
}

export function shuffle<T>(items: readonly T[], random: Random = Math.random): T[] {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function pickIndex(length: number, random: Random): number {
  return Math.floor(random() * length);
}

export function pairKey(categoryId: string, pair: Pair): string {
  return `${categoryId}:${pair[0]}|${pair[1]}`;
}

export function selectedCategories(all: readonly Category[], ids: string[]): Category[] {
  const chosen = all.filter((c) => ids.includes(c.id));
  return chosen.length > 0 ? chosen : [...all];
}

// Sorteia uma ronda. `used` são os pares já saídos nesta sessão: evitam-se
// até se esgotarem, e então volta-se a usar tudo.
export function createRound(
  settings: Settings,
  allCategories: readonly Category[],
  used: ReadonlySet<string>,
  random: Random = Math.random,
): Round {
  const { players, mode } = settings;
  if (players.length < MIN_PLAYERS) {
    throw new Error(`São precisos pelo menos ${MIN_PLAYERS} jogadores`);
  }

  const candidates = selectedCategories(allCategories, settings.categories).flatMap((c) =>
    c.pairs.map((pair) => ({ category: c, pair, key: pairKey(c.id, pair) })),
  );
  const fresh = candidates.filter((c) => !used.has(c.key));
  const pool = fresh.length > 0 ? fresh : candidates;
  const { category, pair, key } = pool[pickIndex(pool.length, random)];

  const [civilWord, otherWord] = random() < 0.5 ? [pair[0], pair[1]] : [pair[1], pair[0]];

  const impostorCount = clampImpostors(settings.impostors, players.length);
  const impostors = new Set(shuffle(players, random).slice(0, impostorCount));

  const roles: Role[] = players.map((player) => {
    if (!impostors.has(player)) return { player, impostor: false, word: civilWord, hint: null };
    switch (mode) {
      case "classic":
        return { player, impostor: true, word: null, hint: null };
      case "hint":
        return { player, impostor: true, word: null, hint: otherWord };
      case "undercover":
        return { player, impostor: true, word: otherWord, hint: null };
    }
  });

  return {
    mode,
    roles,
    civilWord,
    otherWord,
    category: category.name,
    starter: players[pickIndex(players.length, random)],
    pairKey: key,
  };
}
