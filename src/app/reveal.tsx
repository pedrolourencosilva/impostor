import { Redirect, router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { AppState, StyleSheet, View } from "react-native";
import Animated, { FadeIn, ZoomIn } from "react-native-reanimated";

import { useGame } from "@/game/GameContext";
import * as haptics from "@/ui/haptics";
import { Avatar, Backdrop, Button, confirmDestructive, Icon, MARGIN, Screen, TopBar, Txt } from "@/ui/kit";
import { avatarGradient, colors, gradients, spacing } from "@/ui/theme";

// Passar o telemóvel: cada jogador, à vez, vê a sua palavra e esconde-a.
export default function Reveal() {
  const { round, t } = useGame();
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState(false);

  // Se a app for para segundo plano com a palavra à vista, esconde-a: ao
  // voltar, quem pegar no telemóvel não a vê sem tocar em "mostrar".
  useEffect(() => {
    const sub = AppState.addEventListener("change", (state) => {
      if (state !== "active") setShown(false);
    });
    return () => sub.remove();
  }, []);

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

  const role = round.roles[index];
  const isLast = index === round.roles.length - 1;
  const progress = t.revealProgress(index + 1, round.roles.length);

  function hide() {
    if (isLast) {
      router.replace("/discuss");
      return;
    }
    setShown(false);
    setIndex(index + 1);
  }

  if (!shown) {
    const tint = avatarGradient(role.player)[1];
    return (
      <Screen
        backdrop={<Backdrop gradient={[`${tint}66`, `${tint}14`, colors.background]} height={560} />}
        footer={
          <Button
            label={t.tapToSee}
            icon="eye"
            onPress={() => {
              haptics.tap();
              setShown(true);
            }}
          />
        }
      >
        <TopBar title={progress} onClose={endRound} closeLabel={t.endRound} />
        <Animated.View key={index} entering={FadeIn.duration(250)} style={styles.center}>
          <View style={[styles.avatarRing, { borderColor: `${tint}88` }]}>
            <Avatar name={role.player} size={128} />
          </View>
          <Txt variant="caption" color={colors.secondary} align="center">
            {t.passTo}
          </Txt>
          <Txt variant="display" align="center" numberOfLines={2} adjustsFontSizeToFit>
            {role.player}
          </Txt>
        </Animated.View>
      </Screen>
    );
  }

  // No undercover o impostor vê uma palavra como toda a gente.
  const seesWord = role.word !== null;

  return (
    <Screen footer={<Button label={isLast ? t.hideAndStart : t.hideAndPass} icon="eyeSlash" variant="secondary" onPress={hide} />}>
      <TopBar title={role.player} onClose={endRound} closeLabel={t.endRound} />
      <Animated.View entering={ZoomIn.duration(220)} style={styles.cardWrap}>
        <LinearGradient
          colors={seesWord ? gradients.word : gradients.impostor}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.4, y: 1 }}
          style={styles.card}
        >
          {seesWord ? (
            <>
              <Txt variant="caption" color="rgba(255,255,255,0.75)">
                {t.wordCaption}
              </Txt>
              <View style={styles.cardCenter}>
                <Txt variant="display" align="center" style={styles.word} numberOfLines={2} adjustsFontSizeToFit>
                  {role.word}
                </Txt>
              </View>
              {round.mode === "undercover" && (
                <Txt variant="subhead" color="rgba(255,255,255,0.85)" align="center">
                  {t.civilTip}
                </Txt>
              )}
            </>
          ) : (
            <>
              <View style={styles.cardCenter}>
                <View style={styles.masks}>
                  <Icon name="masks" size={44} color="#FFFFFF" />
                </View>
                <Txt variant="largeTitle" align="center" numberOfLines={2} adjustsFontSizeToFit>
                  {t.youAreImpostor}
                </Txt>
                {role.hint && (
                  <View style={styles.hint}>
                    <Txt variant="caption" color="rgba(255,255,255,0.75)" align="center">
                      {t.yourHint}
                    </Txt>
                    <Txt variant="title2" align="center">
                      {role.hint}
                    </Txt>
                  </View>
                )}
              </View>
              <Txt variant="subhead" color="rgba(255,255,255,0.85)" align="center">
                {t.impostorTip[round.mode]}
              </Txt>
            </>
          )}
        </LinearGradient>
      </Animated.View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center", gap: spacing.md, paddingHorizontal: MARGIN },
  avatarRing: { padding: 6, borderRadius: 80, borderWidth: 2, marginBottom: spacing.md },
  cardWrap: { flex: 1, paddingHorizontal: MARGIN, paddingTop: spacing.sm, paddingBottom: spacing.lg },
  card: { flex: 1, borderRadius: 28, padding: spacing.lg, gap: spacing.md },
  cardCenter: { flex: 1, justifyContent: "center", alignItems: "center", gap: spacing.md },
  word: { fontSize: 52, lineHeight: 58 },
  masks: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  hint: {
    alignSelf: "stretch",
    gap: spacing.xs,
    padding: spacing.md,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
});
