import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useGame } from "@/game/GameContext";
import { maxImpostors, MIN_PLAYERS } from "@/game/logic";
import type { Lang, Mode } from "@/game/types";
import * as haptics from "@/ui/haptics";
import {
  Avatar,
  Button,
  Group,
  Icon,
  MARGIN,
  Row,
  RowIcon,
  Screen,
  SectionHeader,
  Segmented,
  Stepper,
  Txt,
  type IconName,
} from "@/ui/kit";
import { colors, gradients, spacing } from "@/ui/theme";

const MODES: { id: Mode; icon: IconName }[] = [
  { id: "classic", icon: "masks" },
  { id: "hint", icon: "lightbulb" },
  { id: "undercover", icon: "eyeSlash" },
];
const LANGS: { value: Lang; label: string }[] = [
  { value: "pt", label: "Português" },
  { value: "en", label: "English" },
];

const CARD_WIDTH = 248;
const CARD_GAP = 12;

export default function Home() {
  const { loaded, settings, updateSettings, words, t, newRound } = useGame();
  const insets = useSafeAreaInsets();

  if (!loaded) return <Screen>{null}</Screen>;

  const { players, mode, impostors, categories, lang } = settings;
  const canStart = players.length >= MIN_PLAYERS;
  const maxImp = maxImpostors(players.length);

  function start() {
    haptics.tap();
    newRound();
    router.push("/reveal");
  }

  const categoriesValue =
    categories.length === 0
      ? t.allCategories
      : categories.length === 1
        ? (words.find((w) => w.id === categories[0])?.name ?? t.categoryCount(1))
        : t.categoryCount(categories.length);

  const footer = (
    <Button
      label={t.start}
      icon="play"
      onPress={start}
      disabled={!canStart}
      accessibilityHint={canStart ? undefined : t.noPlayers(MIN_PLAYERS)}
    />
  );

  return (
    <Screen scroll top={false} footer={footer}>
      {/* Capa, como a de um jogo no Apple Arcade */}
      <LinearGradient colors={gradients.hero} style={[styles.hero, { paddingTop: insets.top + spacing.xl }]}>
        <View style={styles.heroArt} pointerEvents="none">
          <Icon name="masks" size={220} color="rgba(255,255,255,0.07)" />
        </View>
        <View style={styles.heroBadge}>
          <Icon name="masks" size={30} color="#FFFFFF" />
        </View>
        <Txt variant="display" accessibilityRole="header" style={styles.heroTitle}>
          {t.appTitle}
        </Txt>
        <Txt variant="callout" color="rgba(255,255,255,0.75)">
          {t.tagline}
        </Txt>
      </LinearGradient>

      <SectionHeader title={t.players} action={t.edit} onAction={() => router.push("/players")} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.avatars}>
        <Pressable
          onPress={() => router.push("/players")}
          accessibilityRole="button"
          accessibilityLabel={t.addPlayer}
          style={styles.avatarItem}
        >
          <View style={styles.addCircle}>
            <Icon name="plus" size={26} color={colors.link} />
          </View>
          <Txt variant="footnote" color={colors.link} numberOfLines={1}>
            {t.add}
          </Txt>
        </Pressable>
        {players.map((p) => (
          <Pressable
            key={p}
            onPress={() => router.push("/players")}
            accessibilityRole="button"
            accessibilityLabel={p}
            style={styles.avatarItem}
          >
            <Avatar name={p} size={64} />
            <Txt variant="footnote" color={colors.secondary} numberOfLines={1} style={styles.avatarName}>
              {p}
            </Txt>
          </Pressable>
        ))}
      </ScrollView>
      {!canStart && (
        <Txt variant="footnote" color={colors.secondary} style={styles.note}>
          {t.noPlayers(MIN_PLAYERS)}
        </Txt>
      )}

      <SectionHeader title={t.mode} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + CARD_GAP}
        decelerationRate="fast"
        contentContainerStyle={styles.modes}
        accessibilityRole="radiogroup"
      >
        {MODES.map(({ id, icon }) => {
          const selected = mode === id;
          return (
            <Pressable
              key={id}
              onPress={() => {
                if (!selected) haptics.selection();
                updateSettings({ mode: id });
              }}
              accessibilityRole="radio"
              accessibilityState={{ checked: selected }}
              accessibilityLabel={`${t.modes[id].name}. ${t.modes[id].description}`}
              style={({ pressed }) => [pressed && { transform: [{ scale: 0.98 }] }]}
            >
              <LinearGradient
                colors={gradients[id]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0.6, y: 1 }}
                style={[styles.modeCard, selected ? styles.modeSelected : styles.modeIdle]}
              >
                <View style={styles.modeTop}>
                  <View style={styles.modeIcon}>
                    <Icon name={icon} size={22} color="#FFFFFF" />
                  </View>
                  {selected && <Icon name="checkCircle" size={26} color="#FFFFFF" />}
                </View>
                <View>
                  <Txt variant="title3">{t.modes[id].name}</Txt>
                  <Txt variant="footnote" color="rgba(255,255,255,0.85)" numberOfLines={3}>
                    {t.modes[id].description}
                  </Txt>
                </View>
              </LinearGradient>
            </Pressable>
          );
        })}
      </ScrollView>

      <SectionHeader title={t.round} />
      <Group footer={canStart ? t.maxImpostorsNote(players.length, maxImp) : undefined}>
        <Row>
          <RowIcon name="person" color="#FF453A" />
          <Txt style={styles.grow}>{t.impostors}</Txt>
          <Txt variant="headline" style={styles.value}>
            {impostors}
          </Txt>
          <Stepper
            label={t.impostors}
            value={impostors}
            min={1}
            max={maxImp}
            onChange={(value) => updateSettings({ impostors: value })}
          />
        </Row>
        <Row
          onPress={() => router.push("/categories")}
          role="link"
          accessibilityLabel={`${t.categories}: ${categoriesValue}`}
        >
          <RowIcon name="grid" color="#0A84FF" />
          <Txt style={styles.grow}>{t.categories}</Txt>
          <Txt color={colors.secondary} numberOfLines={1} style={styles.rowValue}>
            {categoriesValue}
          </Txt>
          <Icon name="chevron" size={15} color={colors.tertiary} />
        </Row>
      </Group>

      <SectionHeader title={t.language} />
      <Group footer={t.languageNote}>
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
      </Group>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { paddingHorizontal: MARGIN, paddingBottom: spacing.xl, overflow: "hidden" },
  heroArt: { position: "absolute", right: -40, bottom: -50, transform: [{ rotate: "-12deg" }] },
  heroBadge: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.14)",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  heroTitle: { marginBottom: spacing.xs },
  avatars: { paddingHorizontal: MARGIN, gap: spacing.md },
  avatarItem: { width: 68, alignItems: "center", gap: 6 },
  avatarName: { maxWidth: 68 },
  addCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.card,
    borderWidth: 1.5,
    borderColor: colors.separator,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  note: { paddingHorizontal: MARGIN, marginTop: spacing.md },
  modes: { paddingHorizontal: MARGIN, gap: CARD_GAP },
  modeCard: {
    width: CARD_WIDTH,
    height: 168,
    borderRadius: 20,
    padding: spacing.md,
    justifyContent: "space-between",
    borderWidth: 2.5,
  },
  modeSelected: { borderColor: "#FFFFFF" },
  modeIdle: { borderColor: "transparent", opacity: 0.85 },
  modeTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  modeIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  grow: { flex: 1, minWidth: 0 },
  value: { minWidth: 20, textAlign: "right" },
  rowValue: { maxWidth: 150 },
});
