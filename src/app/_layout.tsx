import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";

import { GameProvider } from "@/game/GameContext";
import { colors, type } from "@/ui/theme";

// A Inter só faz falta na web (no iPhone usa-se a SF Pro do sistema).
const WEB_FONTS =
  Platform.OS === "web" ? { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } : {};

export default function RootLayout() {
  useFonts(WEB_FONTS);
  return (
    <GameProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.link,
          headerTitleStyle: { ...type.headline, color: colors.label },
          headerShadowVisible: false,
          // Durante a ronda não se pode voltar atrás com o gesto: quem tem o
          // telemóvel podia ver a palavra de quem veio antes.
          gestureEnabled: false,
        }}
      >
        {/* Fora da ronda, voltar atrás é normal: barra com "Voltar" e gesto. */}
        <Stack.Screen name="categories" options={{ headerShown: true, gestureEnabled: true }} />
        <Stack.Screen name="players" options={{ headerShown: true, gestureEnabled: true, presentation: "modal" }} />
      </Stack>
    </GameProvider>
  );
}
