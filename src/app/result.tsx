import { Redirect, router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { useGame } from "@/game/GameContext";
import { Button, Screen } from "@/ui/components";
import { colors, spacing } from "@/ui/theme";

export default function Result() {
  const { round, t, newRound } = useGame();

  if (!round) return <Redirect href="/" />;

  const impostors = round.roles.filter((r) => r.impostor).map((r) => r.player);

  function playAgain() {
    newRound();
    router.replace("/reveal");
  }

  return (
    <Screen>
      <View style={styles.center}>
        <Text style={styles.label}>{t.revealTitle(impostors.length)}</Text>
        <Text style={styles.impostors}>{impostors.join(", ")}</Text>

        <View style={styles.block}>
          <Text style={styles.label}>{t.theWordWas}</Text>
          <Text style={styles.word}>{round.civilWord}</Text>
        </View>

        {round.mode !== "classic" && (
          <View style={styles.block}>
            <Text style={styles.label}>
              {round.mode === "undercover" ? t.impostorHad : t.impostorHint}
            </Text>
            <Text style={[styles.word, { color: colors.accent }]}>{round.otherWord}</Text>
          </View>
        )}

        <Text style={styles.category}>
          {t.category}: {round.category}
        </Text>
      </View>

      <Button label={t.newRound} onPress={playAgain} />
      <Button label={t.changeSettings} variant="secondary" onPress={() => router.dismissAll()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center", gap: spacing.lg },
  label: { color: colors.muted, fontSize: 18, textAlign: "center" },
  impostors: { color: colors.accent, fontSize: 38, fontWeight: "900", textAlign: "center" },
  block: { alignItems: "center", gap: spacing.xs },
  word: { color: colors.civil, fontSize: 30, fontWeight: "800", textAlign: "center" },
  category: { color: colors.muted, fontSize: 15 },
});
