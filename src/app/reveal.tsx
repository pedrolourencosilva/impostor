import { Redirect, router } from "expo-router";
import { useEffect, useState } from "react";
import { AppState, StyleSheet, Text, View } from "react-native";

import { useGame } from "@/game/GameContext";
import * as haptics from "@/ui/haptics";
import { Button, confirmDestructive, Icon, Screen, TopBar } from "@/ui/kit";
import { spacing, type, useColors } from "@/ui/theme";

// Passar o telemóvel: cada jogador, à vez, vê a sua palavra e esconde-a.
export default function Reveal() {
  const { round, t } = useGame();
  const c = useColors();
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState(false);

  // Se a app for para segundo plano com a palavra à vista, esconde-a: ao
  // voltar, quem pegar no telemóvel não a vê sem tocar em "ver".
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

  function hide() {
    if (isLast) {
      router.replace("/discuss");
      return;
    }
    setShown(false);
    setIndex(index + 1);
  }

  if (!shown) {
    return (
      <Screen footer={<Button
          label={t.tapToSee}
          onPress={() => {
            haptics.tap();
            setShown(true);
          }}
        />}>
        <TopBar title={t.revealProgress(index + 1, round.roles.length)} onClose={endRound} closeLabel={t.endRound} />
        <View style={styles.center}>
          <Icon name="hand.raised.fill" fallback="✋" size={56} color={c.tintText} />
          <Text style={[type.title2, styles.centerText, { color: c.secondary, fontWeight: "400" }]}>{t.passTo}</Text>
          <Text style={[styles.name, { color: c.label }]} numberOfLines={2} adjustsFontSizeToFit>
            {role.player}
          </Text>
        </View>
      </Screen>
    );
  }

  // No undercover o impostor vê uma palavra como toda a gente.
  const seesWord = role.word !== null;

  return (
    <Screen footer={<Button label={isLast ? t.hideAndStart : t.hideAndPass} variant="bordered" onPress={hide} />}>
      <TopBar title={role.player} onClose={endRound} closeLabel={t.endRound} />
      <View style={styles.center}>
        <View style={[styles.card, { backgroundColor: c.card }]}>
          {seesWord ? (
            <>
              <Text style={[type.subhead, { color: c.secondary }]}>{t.yourWord}</Text>
              <Text style={[styles.word, { color: c.label }]} adjustsFontSizeToFit numberOfLines={2}>
                {role.word}
              </Text>
              {round.mode === "undercover" && (
                <Text style={[type.subhead, styles.centerText, { color: c.secondary }]}>{t.civilTip}</Text>
              )}
            </>
          ) : (
            <>
              <Icon name="theatermasks.fill" fallback="🎭" size={48} color={c.danger} />
              <Text style={[styles.word, { color: c.danger }]} adjustsFontSizeToFit numberOfLines={2}>
                {t.youAreImpostor}
              </Text>
              {role.hint && (
                <View style={styles.hint}>
                  <Text style={[type.subhead, { color: c.secondary }]}>{t.yourHint}</Text>
                  <Text style={[type.title2, styles.centerText, { color: c.label }]}>{role.hint}</Text>
                </View>
              )}
              <Text style={[type.subhead, styles.centerText, { color: c.secondary }]}>{t.impostorTip[round.mode]}</Text>
            </>
          )}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center", gap: spacing.md },
  centerText: { textAlign: "center" },
  name: { fontSize: 44, fontWeight: "800", textAlign: "center", letterSpacing: 0.3 },
  card: {
    alignSelf: "stretch",
    alignItems: "center",
    gap: spacing.md,
    borderRadius: 22,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  word: { fontSize: 40, fontWeight: "800", textAlign: "center" },
  hint: { alignItems: "center", gap: spacing.xs },
});
