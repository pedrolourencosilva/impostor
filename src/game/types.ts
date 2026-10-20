export type Lang = "pt" | "en";

// classic: o impostor só sabe que é impostor.
// hint: o impostor sabe que é impostor e recebe uma palavra relacionada como pista.
// undercover: o impostor recebe uma palavra parecida e não sabe que é impostor.
export type Mode = "classic" | "hint" | "undercover";

// Duas palavras parecidas mas distinguíveis. Uma é a dos civis, a outra a do
// impostor (no undercover) ou a pista (no modo com dica); a ordem é sorteada.
export type Pair = readonly [string, string];

export type Category = {
  id: string;
  name: string;
  pairs: readonly Pair[];
};

export type Settings = {
  players: string[];
  lang: Lang;
  mode: Mode;
  impostors: number;
  // ids das categorias escolhidas; vazio = todas
  categories: string[];
};

export type Role = {
  player: string;
  impostor: boolean;
  // a palavra que este jogador vê; null = "és o impostor" (classic e hint)
  word: string | null;
  // só para o impostor no modo hint
  hint: string | null;
};

export type Round = {
  mode: Mode;
  roles: Role[];
  civilWord: string;
  otherWord: string;
  category: string;
  starter: string;
  pairKey: string;
};
