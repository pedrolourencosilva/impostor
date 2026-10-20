import { Redirect, router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { useGame } from "@/game/GameContext";
import { Button, Icon, Screen } from "@/ui/kit";
import { spacing, type, useColors } from "@/ui/theme";

export default function Discuss() {
  const { round, t } = useGame();
  const c = useColors();

  if (!round) return <Redirect href="/" />;

  return (
    <Screen footer={<Button label={t.reveal} onPress={() => router.replace("/result")} />}>
      <View style={styles.center}>
        <Icon name="bubble.left.and.bubble.right.fill" fallback="💬" size={52} color={c.tintText} />
        <Text style={[type.title2, styles.centerText, { color: c.secondary, fontWeight: "400" }]}>{t.everyoneSaw}</Text>
        <Text style={[styles.starter, { color: c.label }]} numberOfLines={2} adjustsFontSizeToFit>
          {t.starts(round.starter)}
        </Text>
        <View style={[styles.card, { backgroundColor: c.card }]}>
          <Text style={[type.body, styles.centerText, { color: c.secondary, lineHeight: 24 }]}>
            {t.discussRules[round.mode]}
          </Text>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center", gap: spacing.md },
  centerText: { textAlign: "center" },
  starter: { fontSize: 38, fontWeight: "800", textAlign: "center" },
  card: { alignSelf: "stretch", borderRadius: 22, padding: spacing.lg, marginTop: spacing.sm },
});
