import { Redirect, router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { useGame } from "@/game/GameContext";
import { Button, Icon, Row, Screen, Section } from "@/ui/kit";
import { spacing, type, useColors } from "@/ui/theme";

export default function Result() {
  const { round, t, newRound } = useGame();
  const c = useColors();

  if (!round) return <Redirect href="/" />;

  const impostors = round.roles.filter((r) => r.impostor).map((r) => r.player);

  function playAgain() {
    newRound();
    router.replace("/reveal");
  }

  const footer = (
    <>
      <Button label={t.newRound} onPress={playAgain} />
      <Button label={t.changeSettings} variant="plain" onPress={() => router.dismissAll()} />
    </>
  );

  return (
    <Screen scroll footer={footer}>
      <View style={styles.hero}>
        <Icon name="theatermasks.fill" fallback="🎭" size={52} color={c.danger} />
        <Text style={[type.title2, styles.centerText, { color: c.secondary, fontWeight: "400" }]}>
          {t.revealTitle(impostors.length)}
        </Text>
        <Text style={[styles.impostors, { color: c.danger }]} adjustsFontSizeToFit numberOfLines={3}>
          {impostors.join(", ")}
        </Text>
      </View>

      <Section>
        <Row>
          <Text style={[type.body, styles.grow, { color: c.label }]}>{t.theWordWas}</Text>
          <Text style={[type.headline, { color: c.label }]}>{round.civilWord}</Text>
        </Row>
        {round.mode !== "classic" && (
          <Row>
            <Text style={[type.body, styles.grow, { color: c.label }]}>
              {round.mode === "undercover" ? t.impostorHad : t.impostorHint}
            </Text>
            <Text style={[type.headline, { color: c.danger }]}>{round.otherWord}</Text>
          </Row>
        )}
        <Row>
          <Text style={[type.body, styles.grow, { color: c.label }]}>{t.category}</Text>
          <Text style={[type.body, { color: c.secondary }]}>{round.category}</Text>
        </Row>
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: "center", gap: spacing.sm, marginTop: spacing.xl },
  centerText: { textAlign: "center" },
  impostors: { fontSize: 40, fontWeight: "800", textAlign: "center" },
  grow: { flex: 1, minWidth: 0 },
});
