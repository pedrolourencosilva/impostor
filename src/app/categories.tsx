import { Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

import { useGame } from "@/game/GameContext";
import { categoryStyle } from "@/ui/categories";
import * as haptics from "@/ui/haptics";
import { Group, Icon, Row, RowIcon, Screen, Txt } from "@/ui/kit";
import { colors, spacing } from "@/ui/theme";

// Escolher as categorias: uma lista com ✓, como as listas de escolha dos
// Ajustes do iPhone. Nenhuma escolhida = todas.
export default function Categories() {
  const { settings, updateSettings, words, t } = useGame();
  const { categories } = settings;

  function toggle(id: string) {
    haptics.selection();
    updateSettings({
      categories: categories.includes(id) ? categories.filter((x) => x !== id) : [...categories, id],
    });
  }

  return (
    <Screen scroll top={false}>
      <Stack.Screen options={{ title: t.categories, headerBackTitle: t.back }} />

      <Group style={styles.first} footer={t.categoriesNote}>
        <Row
          role="radio"
          selected={categories.length === 0}
          onPress={() => {
            haptics.selection();
            updateSettings({ categories: [] });
          }}
        >
          <RowIcon name="grid" color="#636366" />
          <Txt style={styles.grow}>{t.allCategories}</Txt>
          <Check visible={categories.length === 0} />
        </Row>
      </Group>

      <Group style={styles.list}>
        {words.map((w) => {
          const selected = categories.includes(w.id);
          const { icon, color } = categoryStyle(w.id);
          return (
            <Row key={w.id} role="checkbox" selected={selected} onPress={() => toggle(w.id)}>
              <RowIcon name={icon} color={color} />
              <Txt style={styles.grow}>{w.name}</Txt>
              <Txt variant="subhead" color={colors.secondary}>
                {t.pairCount(w.pairs.length)}
              </Txt>
              <Check visible={selected} />
            </Row>
          );
        })}
      </Group>
    </Screen>
  );
}

function Check({ visible }: { visible: boolean }) {
  return <View style={styles.check}>{visible && <Icon name="checkmark" size={18} color={colors.link} />}</View>;
}

const styles = StyleSheet.create({
  first: { marginTop: spacing.md },
  list: { marginTop: spacing.lg },
  grow: { flex: 1, minWidth: 0 },
  check: { width: 20, alignItems: "center" },
});
