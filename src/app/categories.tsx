import { Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import { useGame } from "@/game/GameContext";
import * as haptics from "@/ui/haptics";
import { Icon, Row, Screen, Section } from "@/ui/kit";
import { type, useColors } from "@/ui/theme";

// Escolher as categorias: uma lista com ✓, como as listas de escolha dos
// Ajustes do iPhone. Nenhuma escolhida = todas.
export default function Categories() {
  const { settings, updateSettings, words, t } = useGame();
  const c = useColors();
  const { categories } = settings;

  function toggle(id: string) {
    haptics.selection();
    updateSettings({
      categories: categories.includes(id) ? categories.filter((x) => x !== id) : [...categories, id],
    });
  }

  return (
    <Screen scroll>
      <Stack.Screen options={{ title: t.categories, headerBackTitle: t.back }} />

      <Section footer={t.categoriesNote}>
        <Row role="radio" selected={categories.length === 0} onPress={() => {
            haptics.selection();
            updateSettings({ categories: [] });
          }}>
          <Text style={[type.body, styles.grow, { color: c.label }]}>{t.allCategories}</Text>
          <Check visible={categories.length === 0} color={c.tintText} />
        </Row>
      </Section>

      <Section>
        {words.map((w) => {
          const selected = categories.includes(w.id);
          return (
            <Row key={w.id} role="checkbox" selected={selected} onPress={() => toggle(w.id)}>
              <Text style={[type.body, styles.grow, { color: c.label }]}>{w.name}</Text>
              <Text style={[type.subhead, { color: c.secondary }]}>{t.pairCount(w.pairs.length)}</Text>
              <Check visible={selected} color={c.tintText} />
            </Row>
          );
        })}
      </Section>
    </Screen>
  );
}

function Check({ visible, color }: { visible: boolean; color: string }) {
  return <View style={styles.check}>{visible && <Icon name="checkmark" fallback="✓" size={20} color={color} />}</View>;
}

const styles = StyleSheet.create({
  grow: { flex: 1, minWidth: 0 },
  check: { width: 22, alignItems: "center" },
});
