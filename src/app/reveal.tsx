import { Redirect, router } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useGame } from "@/game/GameContext";
import { Button, Screen } from "@/ui/components";
import { colors, spacing } from "@/ui/theme";

// Passar o telemóvel: cada jogador, à vez, vê a sua palavra e esconde-a.
export default function Reveal() {
  const { round, t } = useGame();
  const [index, setIndex] = useState(0);
  const [shown, setShown] = useState(false);

  if (!round) return <Redirect href="/" />;

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
      <Screen>
        <View style={styles.center}>
          <Text style={styles.progress}>
            {index + 1} / {round.roles.length}
          </Text>
          <Text style={styles.label}>{t.passTo}</Text>
          <Text style={styles.name}>{role.player}</Text>
        </View>
        <Button label={t.tapToSee} onPress={() => setShown(true)} />
      </Screen>
    );
  }

  // No undercover o impostor vê uma palavra como toda a gente.
  const seesWord = role.word !== null;

  return (
    <Screen>
      <View style={styles.center}>
        <Text style={styles.label}>{role.player}</Text>
        {seesWord ? (
          <>
            <Text style={styles.label}>{t.yourWord}</Text>
            <Text style={[styles.word, { color: colors.civil }]}>{role.word}</Text>
            <Text style={styles.tip}>
              {round.mode === "undercover" ? t.civilTip : ""}
            </Text>
          </>
        ) : (
          <>
            <Text style={[styles.word, { color: colors.accent }]}>{t.youAreImpostor}</Text>
            {role.hint && (
              <>
                <Text style={styles.label}>{t.yourHint}</Text>
                <Text style={styles.hint}>{role.hint}</Text>
              </>
            )}
            <Text style={styles.tip}>{t.impostorTip[round.mode]}</Text>
          </>
        )}
      </View>
      <Button
        label={isLast ? t.hideAndStart : t.hideAndPass}
        variant="secondary"
        onPress={hide}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center", gap: spacing.md },
  progress: { color: colors.muted, fontSize: 15 },
  label: { color: colors.muted, fontSize: 18, textAlign: "center" },
  name: { color: colors.text, fontSize: 44, fontWeight: "900", textAlign: "center" },
  word: { fontSize: 40, fontWeight: "900", textAlign: "center" },
  hint: { color: colors.text, fontSize: 30, fontWeight: "800", textAlign: "center" },
  tip: { color: colors.muted, fontSize: 15, textAlign: "center", marginTop: spacing.md },
});
