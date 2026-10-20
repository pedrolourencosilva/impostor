import { useColorScheme } from "react-native";

// Cores no estilo das cores de sistema do iOS (fundo agrupado, etiqueta,
// separador...), em claro e escuro: a app segue o aspeto escolhido no
// telemóvel, como pedem as Human Interface Guidelines (dark-mode.md).
// Alguns tons estão mais escuros/claros que os do iOS para o texto passar
// os 4,5:1 de contraste.
export type Palette = {
  scheme: "light" | "dark";
  background: string; // fundo do ecrã (atrás das secções)
  card: string; // fundo das linhas agrupadas
  fill: string; // controlos dentro das linhas (stepper, segmentos)
  fillSelected: string; // segmento escolhido
  pressed: string; // linha a ser tocada
  label: string;
  secondary: string;
  separator: string;
  tint: string; // fundo do botão principal
  onTint: string; // texto em cima do tint
  tintText: string; // tint usado como cor de texto (ligações, ✓)
  danger: string; // o impostor, apagar
};

const light: Palette = {
  scheme: "light",
  background: "#F2F2F7",
  card: "#FFFFFF",
  fill: "#E9E9EE",
  fillSelected: "#FFFFFF",
  pressed: "#E5E5EA",
  label: "#000000",
  secondary: "#6C6C70", // 5,2:1 no branco, 4,7:1 no fundo
  separator: "#C6C6C8",
  tint: "#4B49C8", // branco por cima: 6,8:1
  onTint: "#FFFFFF",
  tintText: "#4B49C8",
  danger: "#D70015", // 5,4:1 no branco
};

const dark: Palette = {
  scheme: "dark",
  background: "#000000",
  card: "#1C1C1E",
  fill: "#2C2C2E",
  fillSelected: "#636366",
  pressed: "#2C2C2E",
  label: "#FFFFFF",
  secondary: "#98989F", // 5,9:1 no cartão
  separator: "#38383A",
  tint: "#5E5CE6", // branco por cima: 5,1:1
  onTint: "#FFFFFF",
  tintText: "#7D7AFF", // 4,9:1 no cartão
  danger: "#FF453A", // 5,0:1 no cartão
};

export function useColors(): Palette {
  return useColorScheme() === "dark" ? dark : light;
}

// Estilos de texto do iOS (Dynamic Type, tamanho "Large", o padrão).
export const type = {
  largeTitle: { fontSize: 34, fontWeight: "700", letterSpacing: 0.4 },
  title: { fontSize: 28, fontWeight: "700", letterSpacing: 0.4 },
  title2: { fontSize: 22, fontWeight: "700" },
  headline: { fontSize: 17, fontWeight: "600" },
  body: { fontSize: 17 },
  subhead: { fontSize: 15 },
  footnote: { fontSize: 13 },
} as const;

export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
