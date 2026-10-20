import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { useGame } from "@/game/GameContext";
import { addPlayer, MAX_NAME_LENGTH, maxImpostors, MIN_PLAYERS } from "@/game/logic";
import type { Lang, Mode } from "@/game/types";
import { Button, Chip, Screen, SectionTitle } from "@/ui/components";
import { colors, radius, spacing } from "@/ui/theme";

const MODES: Mode[] = ["classic", "hint", "undercover"];
const LANGS: { id: Lang; label: string }[] = [
  { id: "pt", label: "Português" },
  { id: "en", label: "English" },
];

export default function Setup() {
  const { loaded, settings, updateSettings, words, t, newRound } = useGame();
  const [name, setName] = useState("");

  if (!loaded) return <Screen>{null}</Screen>;

  const { players, mode, impostors, categories, lang } = settings;
  const canStart = players.length >= MIN_PLAYERS;
  const maxImp = maxImpostors(players.length);

  function submitName() {
    const next = addPlayer(players, name);
    if (next) updateSettings({ players: next });
    setName("");
  }

  function toggleCategory(id: string) {
    updateSettings({
      categories: categories.includes(id) ? categories.filter((c) => c !== id) : [...categories, id],
    });
  }

  function start() {
    newRound();
    router.push("/reveal");
  }

  return (
    <Screen scroll>
      <Text style={styles.title}>{t.appTitle}</Text>

      <SectionTitle>{t.language}</SectionTitle>
      <View style={styles.row}>
        {LANGS.map((l) => (
          <Chip
            key={l.id}
            label={l.label}
            selected={lang === l.id}
            onPress={() => updateSettings({ lang: l.id })}
          />
        ))}
      </View>

      <SectionTitle>
        {t.players} ({players.length})
      </SectionTitle>
      <View style={styles.inputRow}>
        <TextInput
          value={name}
          onChangeText={setName}
          onSubmitEditing={submitName}
          placeholder={t.addPlayerPlaceholder}
          placeholderTextColor={colors.muted}
          maxLength={MAX_NAME_LENGTH}
          returnKeyType="done"
          submitBehavior="submit"
          autoCapitalize="words"
          style={styles.input}
        />
        <Button label={t.add} onPress={submitName} disabled={!name.trim()} />
      </View>
      <View style={styles.row}>
        {players.map((p) => (
          <Pressable
            key={p}
            onPress={() => updateSettings({ players: players.filter((x) => x !== p) })}
            style={styles.player}
          >
            <Text style={styles.playerText}>{p}</Text>
            <Text style={styles.playerRemove}>✕</Text>
          </Pressable>
        ))}
      </View>
      {!canStart && <Text style={styles.muted}>{t.minPlayers(MIN_PLAYERS)}</Text>}

      <SectionTitle>{t.mode}</SectionTitle>
      {MODES.map((m) => (
        <Pressable
          key={m}
          onPress={() => updateSettings({ mode: m })}
          style={[styles.mode, mode === m && styles.modeSelected]}
        >
          <Text style={styles.modeName}>{t.modes[m].name}</Text>
          <Text style={styles.muted}>{t.modes[m].description}</Text>
        </Pressable>
      ))}

      <SectionTitle>{t.impostors}</SectionTitle>
      <View style={styles.stepper}>
        <Button
          label="−"
          variant="secondary"
          onPress={() => updateSettings({ impostors: impostors - 1 })}
          disabled={impostors <= 1}
        />
        <Text style={styles.stepperValue}>{impostors}</Text>
        <Button
          label="+"
          variant="secondary"
          onPress={() => updateSettings({ impostors: impostors + 1 })}
          disabled={impostors >= maxImp}
        />
      </View>

      <SectionTitle>{t.categories}</SectionTitle>
      <View style={styles.row}>
        <Chip
          label={t.allCategories}
          selected={categories.length === 0}
          onPress={() => updateSettings({ categories: [] })}
        />
        {words.map((c) => (
          <Chip
            key={c.id}
            label={c.name}
            selected={categories.includes(c.id)}
            onPress={() => toggleCategory(c.id)}
          />
        ))}
      </View>

      <Button label={t.start} onPress={start} disabled={!canStart} style={styles.start} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: { color: colors.text, fontSize: 40, fontWeight: "900", marginTop: spacing.md },
  row: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  inputRow: { flexDirection: "row", gap: spacing.sm, alignItems: "center" },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    color: colors.text,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    fontSize: 17,
  },
  player: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surfaceActive,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: radius.lg,
  },
  playerText: { color: colors.text, fontSize: 16 },
  playerRemove: { color: colors.muted, fontSize: 14 },
  muted: { color: colors.muted, fontSize: 14 },
  mode: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: colors.surface,
    padding: spacing.md,
    gap: spacing.xs,
  },
  modeSelected: { borderColor: colors.accent },
  modeName: { color: colors.text, fontSize: 18, fontWeight: "700" },
  stepper: { flexDirection: "row", alignItems: "center", gap: spacing.lg },
  stepperValue: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "800",
    minWidth: 32,
    textAlign: "center",
  },
  start: { marginTop: spacing.lg, marginBottom: spacing.xl },
});
