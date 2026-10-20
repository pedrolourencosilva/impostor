import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { GameProvider } from "@/game/GameContext";
import { useColors } from "@/ui/theme";

export default function RootLayout() {
  const c = useColors();
  return (
    <GameProvider>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: c.background },
          headerStyle: { backgroundColor: c.background },
          headerTintColor: c.tintText,
          headerTitleStyle: { color: c.label },
          headerShadowVisible: false,
          // Durante a ronda não se pode voltar atrás com o gesto: quem tem o
          // telemóvel podia ver a palavra de quem veio antes.
          gestureEnabled: false,
        }}
      >
        {/* Fora da ronda, voltar atrás é normal: barra com "Voltar" e gesto. */}
        <Stack.Screen name="categories" options={{ headerShown: true, gestureEnabled: true }} />
      </Stack>
    </GameProvider>
  );
}
