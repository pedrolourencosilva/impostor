import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { useGame } from "@/game/GameContext";
import { addPlayer, MAX_NAME_LENGTH, MAX_PLAYERS, maxImpostors, MIN_PLAYERS } from "@/game/logic";
import type { Lang, Mode } from "@/game/types";
import * as haptics from "@/ui/haptics";
import { Button, Icon, LargeTitle, Row, Screen, Section, SectionFooter, Segmented, Stepper } from "@/ui/kit";
import { spacing, type, useColors } from "@/ui/theme";

const MODES: Mode[] = ["classic", "hint", "undercover"];
const LANGS: { value: Lang; label: string }[] = [
  { value: "pt", label: "Português" },
  { value: "en", label: "English" },
];

// Quanto tempo fica o "Desfazer" depois de remover um jogador.
const UNDO_MS = 5000;

export default function Setup() {
  const { loaded, settings, updateSettings, words, t, newRound } = useGame();
  const c = useColors();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [removed, setRemoved] = useState<{ name: string; index: number } | null>(null);

  useEffect(() => {
    if (!removed) return;
    const timer = setTimeout(() => setRemoved(null), UNDO_MS);
    return () => clearTimeout(timer);
  }, [removed]);

  if (!loaded) return <Screen>{null}</Screen>;

  const { players, mode, impostors, categories, lang } = settings;
  const canStart = players.length >= MIN_PLAYERS;
  const maxImp = maxImpostors(players.length);

  function submitName() {
    const result = addPlayer(players, name);
    if (result.ok) {
      updateSettings({ players: result.players });
      setName("");
      setError(null);
    } else if (result.reason === "duplicate") {
      setError(t.nameDuplicate(name.trim()));
    } else if (result.reason === "full") {
      setError(t.nameFull(MAX_PLAYERS));
    }
  }

  function removePlayer(index: number) {
    setRemoved({ name: players[index], index });
    updateSettings({ players: players.filter((_, i) => i !== index) });
  }

  function undoRemove() {
    if (!removed) return;
    const next = [...players];
    next.splice(removed.index, 0, removed.name);
    updateSettings({ players: next });
    setRemoved(null);
  }

  function start() {
    newRound();
    router.push("/reveal");
  }

  const categoriesValue =
    categories.length === 0
      ? t.allCategories
      : categories.length === 1
        ? (words.find((w) => w.id === categories[0])?.name ?? t.categoryCount(1))
        : t.categoryCount(categories.length);

  const playersFooter = error ? (
    <SectionFooter color={c.danger}>{error}</SectionFooter>
  ) : !canStart ? (
    <SectionFooter>{t.minPlayers(MIN_PLAYERS)}</SectionFooter>
  ) : undefined;

  const footer = (
    <>
      {removed && (
        <View accessibilityRole="alert" style={[styles.toast, { backgroundColor: c.card }]}>
          <Text style={[type.subhead, styles.toastText, { color: c.label }]}>{t.playerLeft(removed.name)}</Text>
          <Pressable onPress={undoRemove} accessibilityRole="button" style={styles.toastButton}>
            <Text style={[type.headline, { color: c.tintText }]}>{t.undo}</Text>
          </Pressable>
        </View>
      )}
      <Button
        label={t.start}
        onPress={start}
        disabled={!canStart}
        accessibilityHint={canStart ? undefined : t.minPlayers(MIN_PLAYERS)}
      />
    </>
  );

  return (
    <Screen scroll footer={footer}>
      <LargeTitle>{t.appTitle}</LargeTitle>

      <Section title={`${t.players} · ${players.length}`} footer={playersFooter}>
        {players.map((p, i) => (
          <Row key={p} style={styles.playerRow}>
            <Text style={[type.body, styles.grow, { color: c.label }]} numberOfLines={1}>
              {p}
            </Text>
            <Pressable
              onPress={() => removePlayer(i)}
              accessibilityRole="button"
              accessibilityLabel={t.removePlayer(p)}
              hitSlop={4}
              style={styles.iconButton}
            >
              <Icon name="xmark.circle.fill" fallback="✕" size={22} color={c.secondary} />
            </Pressable>
          </Row>
        ))}
        <Row style={styles.playerRow}>
          <TextInput
            value={name}
            onChangeText={(text) => {
              setName(text);
              setError(null);
            }}
            onSubmitEditing={submitName}
            placeholder={t.addPlayerPlaceholder}
            placeholderTextColor={c.secondary}
            accessibilityLabel={t.addPlayerPlaceholder}
            maxLength={MAX_NAME_LENGTH}
            returnKeyType="done"
            submitBehavior="submit"
            autoCapitalize="words"
            autoCorrect={false}
            clearButtonMode="while-editing"
            style={[type.body, styles.grow, styles.input, { color: c.label }]}
          />
          <Pressable
            onPress={submitName}
            disabled={!name.trim()}
            accessibilityRole="button"
            accessibilityLabel={t.addPlayer}
            accessibilityState={{ disabled: !name.trim() }}
            style={[styles.iconButton, !name.trim() && styles.disabled]}
          >
            <Icon name="plus.circle.fill" fallback="＋" size={26} color={c.tintText} />
          </Pressable>
        </Row>
      </Section>

      <Section title={t.mode}>
        {MODES.map((m) => {
          const selected = mode === m;
          return (
            <Row
              key={m}
              role="radio"
              selected={selected}
              onPress={() => {
                if (!selected) haptics.selection();
                updateSettings({ mode: m });
              }}
              accessibilityLabel={`${t.modes[m].name}. ${t.modes[m].description}`}
            >
              <View style={styles.grow}>
                <Text style={[type.body, { color: c.label }]}>{t.modes[m].name}</Text>
                <Text style={[type.subhead, styles.description, { color: c.secondary }]}>
                  {t.modes[m].description}
                </Text>
              </View>
              <View style={styles.check}>
                {selected && <Icon name="checkmark" fallback="✓" size={20} color={c.tintText} />}
              </View>
            </Row>
          );
        })}
      </Section>

      <Section title={t.round} footer={canStart ? t.maxImpostorsNote(players.length, maxImp) : undefined}>
        <Row>
          <Text style={[type.body, styles.grow, { color: c.label }]}>{t.impostors}</Text>
          <Text style={[type.body, styles.value, { color: c.secondary }]}>{impostors}</Text>
          <Stepper
            label={t.impostors}
            value={impostors}
            min={1}
            max={maxImp}
            onChange={(value) => updateSettings({ impostors: value })}
          />
        </Row>
        <Row onPress={() => router.push("/categories")} role="link" accessibilityLabel={`${t.categories}: ${categoriesValue}`}>
          <Text style={[type.body, styles.grow, { color: c.label }]}>{t.categories}</Text>
          <Text style={[type.body, { color: c.secondary }]} numberOfLines={1}>
            {categoriesValue}
          </Text>
          <Icon name="chevron.right" fallback="›" size={16} color={c.secondary} />
        </Row>
      </Section>

      <Section title={t.language} footer={t.languageNote}>
        <Row>
          <View style={styles.grow}>
            <Segmented
              accessibilityLabel={t.language}
              options={LANGS}
              value={lang}
              onChange={(value) => updateSettings({ lang: value })}
            />
          </View>
        </Row>
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  grow: { flex: 1, minWidth: 0 },
  playerRow: { paddingVertical: 0, paddingRight: 4 },
  input: { minHeight: 44, paddingVertical: 0 },
  iconButton: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  disabled: { opacity: 0.35 },
  description: { marginTop: 2 },
  check: { width: 22, alignItems: "center" },
  value: { minWidth: 20, textAlign: "right", marginRight: spacing.xs },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingLeft: spacing.md,
    minHeight: 48,
  },
  toastText: { flex: 1 },
  toastButton: { minHeight: 48, justifyContent: "center", paddingHorizontal: spacing.md },
});
