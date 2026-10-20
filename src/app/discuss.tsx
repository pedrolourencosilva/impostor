import { Redirect, router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { useGame } from "@/game/GameContext";
import { Button, Screen } from "@/ui/components";
import { colors, spacing } from "@/ui/theme";

export default function Discuss() {
  const { round, t } = useGame();

  if (!round) return <Redirect href="/" />;

  return (
    <Screen>
      <View style={styles.center}>
        <Text style={styles.label}>{t.everyoneSaw}</Text>
        <Text style={styles.starter}>{t.starts(round.starter)}</Text>
        <Text style={styles.rules}>{t.discussRules[round.mode]}</Text>
      </View>
      <Button label={t.reveal} onPress={() => router.replace("/result")} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center", gap: spacing.lg },
  label: { color: colors.muted, fontSize: 18, textAlign: "center" },
  starter: { color: colors.text, fontSize: 36, fontWeight: "900", textAlign: "center" },
  rules: { color: colors.muted, fontSize: 16, textAlign: "center", lineHeight: 23 },
});
