import { Platform, type TextStyle } from "react-native";

// Visual ao estilo do Apple Arcade / Game Center: sempre escuro (um jogo é o
// caso "imersivo" em que dark-mode.md aceita só o escuro), cartões com
// gradiente, botão principal em cápsula branca.
export const colors = {
  background: "#000000",
  card: "#1C1C1E",
  cardRaised: "#2C2C2E",
  fill: "#3A3A3C",
  label: "#FFFFFF",
  secondary: "#A1A1A8", // 7,8:1 no preto, 6,3:1 nos cartões
  tertiary: "#636366", // só decoração, nunca texto
  separator: "#38383A",
  link: "#0A84FF", // azul do sistema (escuro): 5,0:1 no preto
  danger: "#FF453A",
  onButton: "#000000", // texto no botão branco
};

export type Gradient = readonly [string, string, ...string[]];

// Gradientes: a ponta escura fica onde está o texto, para o branco por cima
// passar os 4,5:1.
export const gradients = {
  hero: ["#2A1468", "#140A33", "#000000"],
  classic: ["#8E7CFF", "#3B2A9E", "#1E1557"],
  hint: ["#FF9F5A", "#B24A12", "#5A2208"],
  undercover: ["#4FE0D2", "#147A85", "#083A42"],
  word: ["#5E5CE6", "#2D2A8C", "#15134A"],
  impostor: ["#FF5A4E", "#A3150D", "#4A0805"],
} satisfies Record<string, Gradient>;

// Cores dos avatares; cada jogador fica sempre com a mesma (pelo nome).
const AVATARS: Gradient[] = [
  ["#FF6B6B", "#C2185B"],
  ["#FFB347", "#E8590C"],
  ["#FFD93D", "#F08C00"],
  ["#6BCB77", "#2B8A3E"],
  ["#4DD4E8", "#1971C2"],
  ["#748FFC", "#5F3DC4"],
  ["#DA77F2", "#9C36B5"],
  ["#F783AC", "#D6336C"],
];

export function avatarGradient(name: string): Gradient {
  let hash = 0;
  for (const ch of name.toLowerCase()) hash = (hash * 31 + ch.charCodeAt(0)) >>> 0;
  return AVATARS[hash % AVATARS.length];
}

// No iPhone usa-se a letra do sistema (SF Pro). Na web não há SF fora dos
// Mac: usa-se a Inter, a mais parecida, com o espaçamento apertado da SF.
const WEB_FONTS = {
  "400": "Inter_400Regular",
  "500": "Inter_500Medium",
  "600": "Inter_600SemiBold",
  "700": "Inter_700Bold",
  "800": "Inter_800ExtraBold",
} as const;

function font(size: number, weight: keyof typeof WEB_FONTS, tracking: number): TextStyle {
  if (Platform.OS === "web") {
    return { fontSize: size, fontFamily: WEB_FONTS[weight], letterSpacing: tracking };
  }
  return { fontSize: size, fontWeight: weight };
}

export const type = {
  display: { ...font(40, "800", -1.2), lineHeight: 46 },
  largeTitle: { ...font(34, "800", -0.9), lineHeight: 40 },
  title: { ...font(28, "700", -0.6), lineHeight: 34 },
  title2: { ...font(22, "700", -0.4), lineHeight: 28 },
  title3: { ...font(20, "600", -0.3), lineHeight: 25 },
  headline: { ...font(17, "600", -0.3), lineHeight: 22 },
  body: { ...font(17, "400", -0.3), lineHeight: 22 },
  callout: { ...font(16, "400", -0.2), lineHeight: 21 },
  subhead: { ...font(15, "400", -0.2), lineHeight: 20 },
  subheadBold: { ...font(15, "600", -0.2), lineHeight: 20 },
  footnote: { ...font(13, "400", -0.1), lineHeight: 18 },
  caption: { ...font(12, "600", 0.4), lineHeight: 16, textTransform: "uppercase" },
} satisfies Record<string, TextStyle>;

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
