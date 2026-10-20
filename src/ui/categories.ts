import type { IconName } from "./kit";

// Ícone e cor de cada categoria (os ids PT e EN), para as linhas ao estilo
// dos Ajustes. Uma categoria nova sem entrada aqui usa o ícone genérico.
const BY_ID: Record<string, { icon: IconName; color: string }> = {
  comida: { icon: "food", color: "#FF9F0A" },
  food: { icon: "food", color: "#FF9F0A" },
  animais: { icon: "paw", color: "#AC8E68" },
  animals: { icon: "paw", color: "#AC8E68" },
  lugares: { icon: "map", color: "#30B0C7" },
  places: { icon: "map", color: "#30B0C7" },
  profissoes: { icon: "briefcase", color: "#8E8E93" },
  jobs: { icon: "briefcase", color: "#8E8E93" },
  desporto: { icon: "sports", color: "#34C759" },
  sports: { icon: "sports", color: "#34C759" },
  casa: { icon: "house", color: "#FF6482" },
  home: { icon: "house", color: "#FF6482" },
  transportes: { icon: "car", color: "#0A84FF" },
  transport: { icon: "car", color: "#0A84FF" },
  natureza: { icon: "leaf", color: "#30D158" },
  nature: { icon: "leaf", color: "#30D158" },
  cultura: { icon: "film", color: "#BF5AF2" },
  pop: { icon: "film", color: "#BF5AF2" },
  corpo: { icon: "shirt", color: "#FF375F" },
  body: { icon: "shirt", color: "#FF375F" },
  tecnologia: { icon: "laptop", color: "#5E5CE6" },
  tech: { icon: "laptop", color: "#5E5CE6" },
  escola: { icon: "school", color: "#FFD60A" },
  school: { icon: "school", color: "#FFD60A" },
};

export function categoryStyle(id: string): { icon: IconName; color: string } {
  return BY_ID[id] ?? { icon: "grid", color: "#8E8E93" };
}
