import { Redirect, router } from "expo-router";
import { StyleSheet, View } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { useGame } from "@/game/GameContext";
import { categoryStyle } from "@/ui/categories";
import { Avatar, Backdrop, Button, Group, MARGIN, Row, RowIcon, Screen, Txt } from "@/ui/kit";
import { colors, spacing } from "@/ui/theme";

export default function Result() {
  const { round, t, newRound, words } = useGame();

  if (!round) return <Redirect href="/" />;

  const impostors = round.roles.filter((r) => r.impostor).map((r) => r.player);
  const category = words.find((w) => w.name === round.category);
  const categoryLook = categoryStyle(category?.id ?? "");

  function playAgain() {
    newRound();
    router.replace("/reveal");
  }

  const footer = (
    <>
      <Button label={t.newRound} icon="refresh" onPress={playAgain} />
      <Button label={t.changeSettings} variant="plain" onPress={() => router.dismissAll()} />
    </>
  );

  return (
    <Screen scroll footer={footer} backdrop={<Backdrop gradient={["#6B0F0A", "#2A0603", colors.background]} height={480} />}>
      <Animated.View entering={FadeInDown.duration(350)} style={styles.hero}>
        <Txt variant="caption" color="rgba(255,255,255,0.7)" align="center">
          {t.revealTitle(impostors.length)}
        </Txt>
        <View style={styles.impostors}>
          {impostors.map((name) => (
            <View key={name} style={styles.impostor}>
              <View style={styles.ring}>
                <Avatar name={name} size={impostors.length > 2 ? 72 : 104} />
              </View>
              <Txt variant={impostors.length > 2 ? "headline" : "title"} align="center" numberOfLines={1}>
                {name}
              </Txt>
            </View>
          ))}
        </View>
      </Animated.View>

      <Group style={styles.details}>
        <Row>
          <RowIcon name="eye" color="#5E5CE6" />
          <Txt color={colors.secondary} style={styles.grow}>
            {t.theWordWas}
          </Txt>
          <Txt variant="headline">{round.civilWord}</Txt>
        </Row>
        {round.mode !== "classic" && (
          <Row>
            <RowIcon name={round.mode === "undercover" ? "masks" : "lightbulb"} color="#FF453A" />
            <Txt color={colors.secondary} style={styles.grow}>
              {round.mode === "undercover" ? t.impostorHad : t.impostorHint}
            </Txt>
            <Txt variant="headline">{round.otherWord}</Txt>
          </Row>
        )}
        <Row>
          <RowIcon name={categoryLook.icon} color={categoryLook.color} />
          <Txt color={colors.secondary} style={styles.grow}>
            {t.category}
          </Txt>
          <Txt>{round.category}</Txt>
        </Row>
      </Group>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { alignItems: "center", gap: spacing.lg, paddingTop: spacing.xl + spacing.md, paddingHorizontal: MARGIN },
  impostors: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: spacing.lg },
  impostor: { alignItems: "center", gap: spacing.md, maxWidth: 160 },
  ring: { padding: 5, borderRadius: 60, borderWidth: 2, borderColor: "rgba(255,69,58,0.7)" },
  details: { marginTop: spacing.xl + spacing.md },
  grow: { flex: 1, minWidth: 0 },
});
