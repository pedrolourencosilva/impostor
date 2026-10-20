import type { Lang, Mode } from "@/game/types";

// A língua da interface é a mesma das palavras: uma sala, uma língua.
export type Strings = {
  appTitle: string;
  language: string;
  players: string;
  addPlayerPlaceholder: string;
  add: string;
  minPlayers: (min: number) => string;
  mode: string;
  modes: Record<Mode, { name: string; description: string }>;
  impostors: string;
  categories: string;
  allCategories: string;
  start: string;
  passTo: string;
  tapToSee: string;
  hideAndPass: string;
  hideAndStart: string;
  yourWord: string;
  youAreImpostor: string;
  yourHint: string;
  impostorTip: Record<Mode, string>;
  civilTip: string;
  everyoneSaw: string;
  starts: (name: string) => string;
  discussRules: Record<Mode, string>;
  reveal: string;
  revealTitle: (count: number) => string;
  theWordWas: string;
  impostorHad: string;
  impostorHint: string;
  category: string;
  newRound: string;
  changeSettings: string;
  playerCount: (n: number) => string;
  addPlayer: string;
  removePlayer: (name: string) => string;
  nameDuplicate: (name: string) => string;
  nameFull: (max: number) => string;
  playerLeft: (name: string) => string;
  undo: string;
  round: string;
  maxImpostorsNote: (players: number, max: number) => string;
  categoryCount: (n: number) => string;
  categoriesNote: string;
  pairCount: (n: number) => string;
  languageNote: string;
  back: string;
  revealProgress: (current: number, total: number) => string;
  endRound: string;
  endRoundTitle: string;
  endRoundMessage: string;
  cancel: string;
};

const pt: Strings = {
  appTitle: "Impostor",
  language: "Língua",
  players: "Jogadores",
  addPlayerPlaceholder: "Nome do jogador",
  add: "Juntar",
  minPlayers: (min) => `São precisos pelo menos ${min} jogadores.`,
  mode: "Modo",
  modes: {
    classic: {
      name: "Clássico",
      description: "O impostor só sabe que é o impostor. Tem de fingir.",
    },
    hint: {
      name: "Com pista",
      description: "O impostor sabe que é o impostor e recebe uma palavra relacionada.",
    },
    undercover: {
      name: "Undercover",
      description: "O impostor recebe uma palavra parecida e não sabe que é o impostor.",
    },
  },
  impostors: "Impostores",
  categories: "Categorias",
  allCategories: "Todas",
  start: "Começar",
  passTo: "Passa o telemóvel a",
  tapToSee: "Sou eu, ver",
  hideAndPass: "Esconder e passar",
  hideAndStart: "Esconder e começar",
  yourWord: "A tua palavra é",
  youAreImpostor: "És o impostor",
  yourHint: "A tua pista",
  impostorTip: {
    classic: "Ouve os outros e tenta adivinhar a palavra sem te denunciares.",
    hint: "Usa a pista para disfarçar, mas não a digas tal e qual.",
    undercover: "",
  },
  civilTip: "Dá pistas sem a dizeres. Um de vocês pode ter outra palavra.",
  everyoneSaw: "Toda a gente já viu.",
  starts: (name) => `Começa ${name}`,
  discussRules: {
    classic:
      "À vez, cada um diz uma palavra ou frase sobre a palavra secreta. Depois discutam e votem em quem acham que é o impostor.",
    hint: "À vez, cada um diz uma palavra ou frase sobre a palavra secreta. O impostor tem uma pista. Depois discutam e votem.",
    undercover:
      "À vez, cada um diz uma palavra ou frase sobre a sua palavra. Alguém tem uma palavra diferente e nem sabe. Depois discutam e votem.",
  },
  reveal: "Revelar",
  revealTitle: (count) => (count === 1 ? "O impostor era" : "Os impostores eram"),
  theWordWas: "A palavra era",
  impostorHad: "O impostor tinha",
  impostorHint: "A pista do impostor era",
  category: "Categoria",
  newRound: "Nova ronda",
  changeSettings: "Mudar jogadores ou modo",
  playerCount: (n) => (n === 1 ? "1 jogador" : `${n} jogadores`),
  addPlayer: "Juntar jogador",
  removePlayer: (name) => `Remover ${name}`,
  nameDuplicate: (name) => `Já há um jogador com o nome “${name}”.`,
  nameFull: (max) => `Já estão ${max} jogadores, o máximo.`,
  playerLeft: (name) => `${name} saiu do jogo`,
  undo: "Desfazer",
  round: "Ronda",
  maxImpostorsNote: (players, max) =>
    `Com ${players} jogadores, no máximo ${max === 1 ? "1 impostor" : `${max} impostores`}.`,
  categoryCount: (n) => (n === 1 ? "1 categoria" : `${n} categorias`),
  categoriesNote: "Escolhe uma ou mais. Sem nenhuma escolhida, entram todas.",
  pairCount: (n) => `${n} pares`,
  languageNote: "As palavras e a interface mudam com a língua.",
  back: "Voltar",
  revealProgress: (current, total) => `${current} de ${total}`,
  endRound: "Terminar ronda",
  endRoundTitle: "Terminar a ronda?",
  endRoundMessage: "Voltas à configuração e esta ronda perde-se.",
  cancel: "Cancelar",
};

const en: Strings = {
  appTitle: "Impostor",
  language: "Language",
  players: "Players",
  addPlayerPlaceholder: "Player name",
  add: "Add",
  minPlayers: (min) => `You need at least ${min} players.`,
  mode: "Mode",
  modes: {
    classic: {
      name: "Classic",
      description: "The impostor only knows they're the impostor. They have to bluff.",
    },
    hint: {
      name: "With a hint",
      description: "The impostor knows they're the impostor and gets a related word.",
    },
    undercover: {
      name: "Undercover",
      description: "The impostor gets a similar word and doesn't know they're the impostor.",
    },
  },
  impostors: "Impostors",
  categories: "Categories",
  allCategories: "All",
  start: "Start",
  passTo: "Pass the phone to",
  tapToSee: "It's me, show",
  hideAndPass: "Hide and pass",
  hideAndStart: "Hide and start",
  yourWord: "Your word is",
  youAreImpostor: "You're the impostor",
  yourHint: "Your hint",
  impostorTip: {
    classic: "Listen to the others and try to guess the word without giving yourself away.",
    hint: "Use the hint to blend in, but don't say it as is.",
    undercover: "",
  },
  civilTip: "Give clues without saying it. One of you might have a different word.",
  everyoneSaw: "Everyone has seen their word.",
  starts: (name) => `${name} goes first`,
  discussRules: {
    classic:
      "Take turns saying one word or phrase about the secret word. Then discuss and vote for who you think the impostor is.",
    hint: "Take turns saying one word or phrase about the secret word. The impostor has a hint. Then discuss and vote.",
    undercover:
      "Take turns saying one word or phrase about your word. Someone has a different word and doesn't know it. Then discuss and vote.",
  },
  reveal: "Reveal",
  revealTitle: (count) => (count === 1 ? "The impostor was" : "The impostors were"),
  theWordWas: "The word was",
  impostorHad: "The impostor had",
  impostorHint: "The impostor's hint was",
  category: "Category",
  newRound: "New round",
  changeSettings: "Change players or mode",
  playerCount: (n) => (n === 1 ? "1 player" : `${n} players`),
  addPlayer: "Add player",
  removePlayer: (name) => `Remove ${name}`,
  nameDuplicate: (name) => `There's already a player called “${name}”.`,
  nameFull: (max) => `That's ${max} players, the maximum.`,
  playerLeft: (name) => `${name} left the game`,
  undo: "Undo",
  round: "Round",
  maxImpostorsNote: (players, max) =>
    `With ${players} players, at most ${max === 1 ? "1 impostor" : `${max} impostors`}.`,
  categoryCount: (n) => (n === 1 ? "1 category" : `${n} categories`),
  categoriesNote: "Pick one or more. With none picked, all of them are used.",
  pairCount: (n) => `${n} pairs`,
  languageNote: "The words and the interface follow the language.",
  back: "Back",
  revealProgress: (current, total) => `${current} of ${total}`,
  endRound: "End round",
  endRoundTitle: "End this round?",
  endRoundMessage: "You'll go back to the setup and this round will be lost.",
  cancel: "Cancel",
};

export const STRINGS: Record<Lang, Strings> = { pt, en };
