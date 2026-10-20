import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { GameProvider } from "@/game/GameContext";
import { colors } from "@/ui/theme";

export default function RootLayout() {
  return (
    <GameProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          // Durante a ronda não se pode voltar atrás com o gesto: quem tem o
          // telemóvel podia ver a palavra de quem veio antes.
          gestureEnabled: false,
        }}
      />
    </GameProvider>
  );
}
