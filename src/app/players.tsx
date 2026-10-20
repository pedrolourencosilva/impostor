import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { useGame } from "@/game/GameContext";
import { addPlayer, MAX_NAME_LENGTH, MAX_PLAYERS, MIN_PLAYERS } from "@/game/logic";
import { Avatar, Group, Icon, MARGIN, Row, Screen, Txt } from "@/ui/kit";
import { colors, spacing, type } from "@/ui/theme";

// Quanto tempo fica o "Desfazer" depois de remover um jogador.
const UNDO_MS = 5000;

// Folha (modal) para juntar e remover jogadores.
export default function Players() {
  const { settings, updateSettings, t } = useGame();
  const { players } = settings;
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [removed, setRemoved] = useState<{ name: string; index: number } | null>(null);

  useEffect(() => {
    if (!removed) return;
    const timer = setTimeout(() => setRemoved(null), UNDO_MS);
    return () => clearTimeout(timer);
  }, [removed]);

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

  const footerNote = error ? (
    <Txt variant="footnote" color={colors.danger} style={styles.note}>
      {error}
    </Txt>
  ) : players.length < MIN_PLAYERS ? (
    <Txt variant="footnote" color={colors.secondary} style={styles.note}>
      {t.noPlayers(MIN_PLAYERS)}
    </Txt>
  ) : undefined;

  return (
    <Screen scroll top={false}>
      <Stack.Screen
        options={{
          title: `${t.players} · ${players.length}`,
          headerRight: () => (
            <Pressable onPress={() => router.back()} accessibilityRole="button" hitSlop={10}>
              <Txt variant="headline" color={colors.link}>
                {t.done}
              </Txt>
            </Pressable>
          ),
        }}
      />

      <Group style={styles.first} footer={footerNote}>
        <Row style={styles.inputRow}>
          <View style={styles.addIcon}>
            <Icon name="plus" size={20} color={colors.link} />
          </View>
          <TextInput
            value={name}
            onChangeText={(text) => {
              setName(text);
              setError(null);
            }}
            onSubmitEditing={submitName}
            placeholder={t.addPlayerPlaceholder}
            placeholderTextColor={colors.secondary}
            accessibilityLabel={t.addPlayerPlaceholder}
            maxLength={MAX_NAME_LENGTH}
            returnKeyType="done"
            submitBehavior="submit"
            autoCapitalize="words"
            autoCorrect={false}
            autoFocus={players.length === 0}
            clearButtonMode="while-editing"
            keyboardAppearance="dark"
            style={[type.body, styles.input]}
          />
          {name.trim() !== "" && (
            <Pressable onPress={submitName} accessibilityRole="button" accessibilityLabel={t.addPlayer} hitSlop={8}>
              <Txt variant="headline" color={colors.link}>
                {t.add}
              </Txt>
            </Pressable>
          )}
        </Row>
      </Group>

      {players.length > 0 && (
        <Group style={styles.list}>
          {players.map((p, i) => (
            <Row key={p}>
              <Avatar name={p} size={36} />
              <Txt style={styles.grow} numberOfLines={1}>
                {p}
              </Txt>
              <Pressable
                onPress={() => removePlayer(i)}
                accessibilityRole="button"
                accessibilityLabel={t.removePlayer(p)}
                style={styles.remove}
              >
                <Icon name="minusCircle" size={22} color={colors.danger} />
              </Pressable>
            </Row>
          ))}
        </Group>
      )}

      {removed && (
        <View accessibilityRole="alert" style={styles.toast}>
          <Txt variant="subhead" style={styles.grow}>
            {t.playerLeft(removed.name)}
          </Txt>
          <Pressable onPress={undoRemove} accessibilityRole="button" style={styles.toastButton}>
            <Txt variant="headline" color={colors.link}>
              {t.undo}
            </Txt>
          </Pressable>
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  first: { marginTop: spacing.md },
  list: { marginTop: spacing.lg },
  note: { marginHorizontal: spacing.md, marginTop: spacing.sm },
  inputRow: { paddingVertical: 0 },
  addIcon: { width: 36, alignItems: "center" },
  input: { flex: 1, minHeight: 52, color: colors.label, paddingVertical: 0 },
  grow: { flex: 1, minWidth: 0 },
  remove: { width: 44, height: 44, alignItems: "center", justifyContent: "center", marginRight: -10 },
  toast: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: MARGIN,
    marginTop: spacing.lg,
    borderRadius: 14,
    paddingLeft: spacing.md,
    minHeight: 50,
    backgroundColor: colors.cardRaised,
  },
  toastButton: { minHeight: 50, justifyContent: "center", paddingHorizontal: spacing.md },
});
