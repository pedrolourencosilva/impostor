import { SymbolView, type SFSymbol } from "expo-symbols";
import { Children, Fragment, type ReactNode } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import * as haptics from "./haptics";
import { spacing, type, useColors } from "./theme";

// Componentes ao estilo do iOS: listas agrupadas como nos Ajustes, botões em
// cápsula, controlo segmentado e stepper. Tudo com o papel e o estado certos
// para o VoiceOver (accessibility.md › Vision).

type ScreenProps = {
  children: ReactNode;
  // Fica fixo no fundo, por cima do conteúdo que faz scroll: o botão
  // principal está sempre à mão (designing-for-ios.md › Best practices).
  footer?: ReactNode;
  scroll?: boolean;
};

export function Screen({ children, footer, scroll = false }: ScreenProps) {
  const c = useColors();
  return (
    <SafeAreaView style={[styles.screen, { backgroundColor: c.background }]} edges={["top", "bottom"]}>
      {scroll ? (
        <ScrollView
          style={styles.fill}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          automaticallyAdjustKeyboardInsets
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.fill, styles.content]}>{children}</View>
      )}
      {footer && <View style={styles.footer}>{footer}</View>}
    </SafeAreaView>
  );
}

export function LargeTitle({ children }: { children: ReactNode }) {
  const c = useColors();
  return (
    <Text accessibilityRole="header" style={[type.largeTitle, styles.largeTitle, { color: c.label }]}>
      {children}
    </Text>
  );
}

type SectionProps = {
  title?: string;
  footer?: ReactNode;
  children: ReactNode;
};

// Uma secção de lista agrupada: título pequeno em cima, linhas num cartão
// com separadores entre elas, nota opcional por baixo.
export function Section({ title, footer, children }: SectionProps) {
  const c = useColors();
  const rows = Children.toArray(children).filter(Boolean);
  return (
    <View style={styles.section}>
      {title && (
        <Text accessibilityRole="header" style={[type.footnote, styles.sectionTitle, { color: c.secondary }]}>
          {title.toUpperCase()}
        </Text>
      )}
      <View style={[styles.card, { backgroundColor: c.card }]}>
        {rows.map((row, i) => (
          <Fragment key={i}>
            {i > 0 && <View style={[styles.separator, { backgroundColor: c.separator }]} />}
            {row}
          </Fragment>
        ))}
      </View>
      {typeof footer === "string" ? <SectionFooter>{footer}</SectionFooter> : footer}
    </View>
  );
}

export function SectionFooter({ children, color }: { children: ReactNode; color?: string }) {
  const c = useColors();
  return <Text style={[type.footnote, styles.sectionFooter, { color: color ?? c.secondary }]}>{children}</Text>;
}

type RowProps = {
  children: ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  selected?: boolean;
  role?: "button" | "radio" | "link" | "checkbox";
  style?: StyleProp<ViewStyle>;
};

export function Row({ children, onPress, accessibilityLabel, accessibilityHint, selected, role, style }: RowProps) {
  const c = useColors();
  if (!onPress) return <View style={[styles.row, style]}>{children}</View>;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={role ?? "button"}
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      accessibilityState={
        selected === undefined
          ? undefined
          : role === "radio" || role === "checkbox"
            ? { checked: selected }
            : { selected }
      }
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: c.pressed }, style]}
    >
      {children}
    </Pressable>
  );
}

type IconProps = {
  name: SFSymbol;
  // O que aparece fora do iOS (web, Android), onde não há SF Symbols.
  fallback: string;
  size?: number;
  color: string;
};

export function Icon({ name, fallback, size = 22, color }: IconProps) {
  const glyph = (
    <Text style={{ color, fontSize: size * 0.8, lineHeight: size, width: size, textAlign: "center" }}>{fallback}</Text>
  );
  if (Platform.OS !== "ios") return glyph;
  return (
    <SymbolView name={name} size={size} tintColor={color} fallback={glyph} style={{ width: size, height: size }} />
  );
}

type ButtonProps = {
  label: string;
  onPress: () => void;
  // prominent: a ação principal do ecrã (uma por ecrã, buttons.md › Style);
  // bordered: secundária; plain: só texto.
  variant?: "prominent" | "bordered" | "plain";
  disabled?: boolean;
  accessibilityHint?: string;
};

export function Button({ label, onPress, variant = "prominent", disabled, accessibilityHint }: ButtonProps) {
  const c = useColors();
  const background = variant === "prominent" ? c.tint : variant === "bordered" ? c.fill : "transparent";
  const color = variant === "prominent" ? c.onTint : c.tintText;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: background },
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Text style={[styles.buttonText, { color }]}>{label}</Text>
    </Pressable>
  );
}

type SegmentedProps<T extends string> = {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  accessibilityLabel: string;
};

export function Segmented<T extends string>({ options, value, onChange, accessibilityLabel }: SegmentedProps<T>) {
  const c = useColors();
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel={accessibilityLabel} style={[styles.segmented, { backgroundColor: c.fill }]}>
      {options.map((o) => {
        const selected = o.value === value;
        return (
          <Pressable
            key={o.value}
            onPress={() => {
              if (!selected) haptics.selection();
              onChange(o.value);
            }}
            accessibilityRole="radio"
            accessibilityState={{ selected, checked: selected }}
            style={[styles.segment, selected && [styles.segmentSelected, { backgroundColor: c.fillSelected }]]}
          >
            <Text style={[type.subhead, { color: c.label, fontWeight: selected ? "600" : "400" }]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

type StepperProps = {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  label: string; // para o VoiceOver: "Impostores"
};

// O stepper do iOS: − e + lado a lado. Para o VoiceOver é um único
// "ajustável": desliza para cima ou para baixo para mudar o valor.
export function Stepper({ value, min, max, onChange, label }: StepperProps) {
  const c = useColors();
  const canDec = value > min;
  const canInc = value < max;
  function change(next: number) {
    haptics.selection();
    onChange(next);
  }
  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ min, max, now: value }}
      accessibilityActions={[{ name: "increment" }, { name: "decrement" }]}
      onAccessibilityAction={(e) => {
        if (e.nativeEvent.actionName === "increment" && canInc) change(value + 1);
        if (e.nativeEvent.actionName === "decrement" && canDec) change(value - 1);
      }}
      style={[styles.stepper, { backgroundColor: c.fill }]}
    >
      <Pressable onPress={() => canDec && change(value - 1)} style={[styles.stepperHalf, !canDec && styles.disabled]}>
        <Text style={[styles.stepperGlyph, { color: c.label }]}>−</Text>
      </Pressable>
      <View style={[styles.stepperDivider, { backgroundColor: c.separator }]} />
      <Pressable onPress={() => canInc && change(value + 1)} style={[styles.stepperHalf, !canInc && styles.disabled]}>
        <Text style={[styles.stepperGlyph, { color: c.label }]}>+</Text>
      </Pressable>
    </View>
  );
}

type ConfirmOptions = {
  title: string;
  message: string;
  confirm: string; // ação destrutiva, a vermelho
  cancel: string;
};

// Pergunta antes de uma ação que não se desfaz, com Cancelar
// (alerts.md). Na web o Alert do React Native não faz nada: usa o do browser.
export function confirmDestructive({ title, message, confirm, cancel }: ConfirmOptions): Promise<boolean> {
  if (Platform.OS === "web") return Promise.resolve(window.confirm(`${title}\n\n${message}`));
  return new Promise((resolve) =>
    Alert.alert(title, message, [
      { text: cancel, style: "cancel", onPress: () => resolve(false) },
      { text: confirm, style: "destructive", onPress: () => resolve(true) },
    ]),
  );
}

type TopBarProps = {
  title?: string;
  onClose: () => void;
  closeLabel: string;
};

// Barra de cima durante a ronda: ✕ para sair à esquerda, título ao centro.
export function TopBar({ title, onClose, closeLabel }: TopBarProps) {
  const c = useColors();
  return (
    <View style={styles.topBar}>
      <Pressable onPress={onClose} accessibilityRole="button" accessibilityLabel={closeLabel} hitSlop={8} style={styles.topBarButton}>
        <Icon name="xmark" fallback="✕" size={18} color={c.secondary} />
      </Pressable>
      <Text style={[type.footnote, styles.topBarTitle, { color: c.secondary }]} numberOfLines={1}>
        {title}
      </Text>
      <View style={styles.topBarButton} />
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: "row", alignItems: "center", minHeight: 44 },
  topBarButton: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  topBarTitle: { flex: 1, textAlign: "center" },
  screen: { flex: 1 },
  fill: { flex: 1 },
  content: { paddingHorizontal: spacing.md, paddingBottom: spacing.md },
  scrollContent: { paddingHorizontal: spacing.md, paddingBottom: spacing.xl },
  footer: { paddingHorizontal: spacing.md, paddingTop: spacing.sm, paddingBottom: spacing.sm, gap: spacing.sm },
  largeTitle: { marginTop: spacing.md, marginBottom: spacing.sm, marginLeft: spacing.xs },
  section: { marginTop: spacing.lg },
  sectionTitle: { marginLeft: spacing.md, marginBottom: 6 },
  sectionFooter: { marginHorizontal: spacing.md, marginTop: 6 },
  card: { borderRadius: 12, overflow: "hidden" },
  separator: { height: StyleSheet.hairlineWidth, marginLeft: spacing.md },
  row: {
    minHeight: 44,
    paddingHorizontal: spacing.md,
    paddingVertical: 11,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  button: { minHeight: 52, borderRadius: 26, alignItems: "center", justifyContent: "center", paddingHorizontal: spacing.lg },
  buttonText: { fontSize: 17, fontWeight: "700" },
  pressed: { opacity: 0.7 },
  disabled: { opacity: 0.35 },
  segmented: { flexDirection: "row", borderRadius: 9, padding: 2 },
  segment: { flex: 1, minHeight: 32, alignItems: "center", justifyContent: "center", borderRadius: 7, paddingHorizontal: 12 },
  segmentSelected: {
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  stepper: { flexDirection: "row", alignItems: "center", borderRadius: 9, height: 36 },
  stepperHalf: { width: 48, height: 36, alignItems: "center", justifyContent: "center" },
  stepperDivider: { width: StyleSheet.hairlineWidth, height: 18 },
  stepperGlyph: { fontSize: 22, fontWeight: "500", lineHeight: 26 },
});
