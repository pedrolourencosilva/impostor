import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

// Vibração curta, só com o significado que o iOS lhe dá (playing-haptics.md):
// "selection" quando muda uma escolha, "tap" ao mostrar a palavra. A mesma
// para toda a gente: se o impostor vibrasse diferente, quem está ao lado
// percebia. O iOS desliga-as sozinho se o telemóvel tiver as vibrações do
// sistema desligadas.
export function selection() {
  if (Platform.OS !== "web") Haptics.selectionAsync().catch(() => {});
}

export function tap() {
  if (Platform.OS !== "web") Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}
