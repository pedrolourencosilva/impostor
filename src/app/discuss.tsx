import { Redirect, router } from "expo-router";
import { StyleSheet, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { useGame } from "@/game/GameContext";
import { Avatar, Backdrop, Button, confirmDestructive, MARGIN, Screen, TopBar, Txt } from "@/ui/kit";
import { colors, gradients, spacing } from "@/ui/theme";

export default function Discuss() {
  const { round, t } = useGame();

  if (!round) return <Redirect href="/" />;

  async function endRound() {
    const ok = await confirmDestructive({
      title: t.endRoundTitle,
      message: t.endRoundMessage,
      confirm: t.endRound,
      cancel: t.cancel,
    });
    if (ok) router.dismissAll();
  }

  return (
    <Screen
      backdrop={<Backdrop gradient={gradients.hero} height={520} />}
      footer={<Button label={t.reveal} icon="eye" onPress={() => router.replace("/result")} />}
    >
      <TopBar onClose={endRound} closeLabel={t.endRound} />
      <Animated.View entering={FadeIn.duration(250)} style={styles.center}>
        <Txt variant="subhead" color={colors.secondary} align="center">
          {t.everyoneSaw}
        </Txt>
        <Avatar name={round.starter} size={112} />
        <Txt variant="largeTitle" align="center" numberOfLines={2} adjustsFontSizeToFit>
          {t.starts(round.starter)}
        </Txt>
      </Animated.View>
      <View style={styles.card}>
        <Txt variant="caption" color={colors.secondary}>
          {t.howToPlay}
        </Txt>
        <Txt variant="callout" color="rgba(255,255,255,0.85)">
          {t.discussRules[round.mode]}
        </Txt>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center", gap: spacing.md, paddingHorizontal: MARGIN },
  card: {
    marginHorizontal: MARGIN,
    marginBottom: spacing.lg,
    padding: spacing.lg - 4,
    borderRadius: 20,
    gap: spacing.sm,
    backgroundColor: colors.card,
  },
});
