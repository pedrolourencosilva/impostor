import Ionicons from "@expo/vector-icons/Ionicons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { SymbolView, type SFSymbol } from "expo-symbols";
import { Children, Fragment, useState, type ComponentProps, type ReactNode } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type TextProps,
  type TextStyle,
  type ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import * as haptics from "./haptics";
import { avatarGradient, colors, spacing, type, type Gradient } from "./theme";

// Componentes ao estilo do Apple Arcade / Game Center, com o papel e o estado
// certos para o VoiceOver (accessibility.md › Vision).

export const MARGIN = 20;

// ---------- Texto e ícones ----------

type TxtProps = TextProps & {
  variant?: keyof typeof type;
  color?: string;
  align?: TextStyle["textAlign"];
};

export function Txt({ variant = "body", color = colors.label, align, style, ...rest }: TxtProps) {
  return <Text {...rest} style={[type[variant], { color, textAlign: align }, style]} />;
}

type IonName = ComponentProps<typeof Ionicons>["name"];

// SF Symbols no iPhone; fora do iOS, o Ionicon equivalente (desenhado ao
// estilo do iOS).
const ICONS = {
  play: ["play.fill", "play"],
  eye: ["eye.fill", "eye"],
  eyeSlash: ["eye.slash.fill", "eye-off"],
  plus: ["plus", "add"],
  close: ["xmark", "close"],
  checkmark: ["checkmark", "checkmark"],
  checkCircle: ["checkmark.circle.fill", "checkmark-circle"],
  minusCircle: ["minus.circle.fill", "remove-circle"],
  chevron: ["chevron.right", "chevron-forward"],
  masks: ["theatermasks.fill", "glasses"],
  chat: ["bubble.left.and.bubble.right.fill", "chatbubbles"],
  people: ["person.3.fill", "people"],
  person: ["person.fill.questionmark", "help-circle"],
  lightbulb: ["lightbulb.fill", "bulb"],
  globe: ["globe", "globe-outline"],
  grid: ["square.grid.2x2.fill", "grid"],
  refresh: ["arrow.clockwise", "refresh"],
  sliders: ["slider.horizontal.3", "options"],
  food: ["fork.knife", "restaurant"],
  paw: ["pawprint.fill", "paw"],
  map: ["map.fill", "map"],
  briefcase: ["briefcase.fill", "briefcase"],
  sports: ["sportscourt.fill", "football"],
  house: ["house.fill", "home"],
  car: ["car.fill", "car"],
  leaf: ["leaf.fill", "leaf"],
  film: ["film.fill", "film"],
  shirt: ["tshirt.fill", "shirt"],
  laptop: ["laptopcomputer", "laptop"],
  school: ["graduationcap.fill", "school"],
} satisfies Record<string, readonly [SFSymbol, IonName]>;

export type IconName = keyof typeof ICONS;

export function Icon({ name, size = 20, color = colors.label }: { name: IconName; size?: number; color?: string }) {
  const [sf, ion] = ICONS[name];
  const fallback = <Ionicons name={ion} size={size} color={color} />;
  if (Platform.OS !== "ios") return fallback;
  return <SymbolView name={sf} size={size} tintColor={color} fallback={fallback} style={{ width: size, height: size }} />;
}

// ---------- Ecrã ----------

type ScreenProps = {
  children: ReactNode;
  // Barra de vidro fixa no fundo com o botão principal, sempre à mão
  // (designing-for-ios.md › Best practices).
  footer?: ReactNode;
  scroll?: boolean;
  // Fundo atrás de tudo (um gradiente), a ir até debaixo da barra de estado.
  backdrop?: ReactNode;
  top?: boolean; // deixar espaço para a barra de estado (falso quando há capa)
};

export function Screen({ children, footer, scroll = false, backdrop, top = true }: ScreenProps) {
  const insets = useSafeAreaInsets();
  const [footerHeight, setFooterHeight] = useState(0);
  const bottom = footer ? footerHeight : insets.bottom;
  return (
    <View style={styles.screen}>
      {backdrop}
      {scroll ? (
        <ScrollView
          style={styles.fill}
          contentContainerStyle={{ paddingTop: top ? insets.top : 0, paddingBottom: bottom + spacing.lg }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          automaticallyAdjustKeyboardInsets
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.fill, { paddingTop: top ? insets.top : 0, paddingBottom: bottom }]}>{children}</View>
      )}
      {footer && (
        <View style={styles.footerWrap} onLayout={(e) => setFooterHeight(e.nativeEvent.layout.height)}>
          <BlurView intensity={60} tint="dark" style={StyleSheet.absoluteFill} />
          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>{footer}</View>
        </View>
      )}
    </View>
  );
}

export function Backdrop({ gradient, height = 420 }: { gradient: Gradient; height?: number }) {
  return <LinearGradient colors={gradient} style={[styles.backdrop, { height }]} pointerEvents="none" />;
}

// ---------- Secções e linhas ----------

export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionHeader}>
      <Txt variant="title2" accessibilityRole="header" style={styles.fill}>
        {title}
      </Txt>
      {action && onAction && (
        <Pressable onPress={onAction} accessibilityRole="button" hitSlop={10}>
          <Txt variant="callout" color={colors.link}>
            {action}
          </Txt>
        </Pressable>
      )}
    </View>
  );
}

// Grupo de linhas num cartão, com separadores entre elas.
export function Group({ children, footer, style }: { children: ReactNode; footer?: ReactNode; style?: StyleProp<ViewStyle> }) {
  const rows = Children.toArray(children).filter(Boolean);
  return (
    <View style={[styles.groupWrap, style]}>
      <View style={styles.group}>
        {rows.map((row, i) => (
          <Fragment key={i}>
            {i > 0 && <View style={styles.separator} />}
            {row}
          </Fragment>
        ))}
      </View>
      {typeof footer === "string" ? (
        <Txt variant="footnote" color={colors.secondary} style={styles.groupFooter}>
          {footer}
        </Txt>
      ) : (
        footer
      )}
    </View>
  );
}

type RowProps = {
  children: ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
  selected?: boolean;
  role?: "button" | "radio" | "link" | "checkbox";
  style?: StyleProp<ViewStyle>;
};

export function Row({ children, onPress, accessibilityLabel, selected, role, style }: RowProps) {
  if (!onPress) return <View style={[styles.row, style]}>{children}</View>;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole={role ?? "button"}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={
        selected === undefined ? undefined : role === "radio" || role === "checkbox" ? { checked: selected } : { selected }
      }
      style={({ pressed }) => [styles.row, pressed && { backgroundColor: colors.cardRaised }, style]}
    >
      {children}
    </Pressable>
  );
}

// O quadradinho colorido com ícone à esquerda das linhas, como nos Ajustes.
export function RowIcon({ name, color }: { name: IconName; color: string }) {
  return (
    <View style={[styles.rowIcon, { backgroundColor: color }]}>
      <Icon name={name} size={17} color="#FFFFFF" />
    </View>
  );
}

// ---------- Botões ----------

type ButtonProps = {
  label: string;
  onPress: () => void;
  // primary: cápsula branca, a ação principal (uma por ecrã, buttons.md ›
  // Style); secondary: cápsula escura; plain: só texto.
  variant?: "primary" | "secondary" | "plain";
  icon?: IconName;
  disabled?: boolean;
  accessibilityHint?: string;
};

export function Button({ label, onPress, variant = "primary", icon, disabled, accessibilityHint }: ButtonProps) {
  const background = variant === "primary" ? colors.label : variant === "secondary" ? colors.cardRaised : "transparent";
  const color = variant === "primary" ? colors.onButton : variant === "secondary" ? colors.label : colors.link;
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: !!disabled }}
      accessibilityHint={accessibilityHint}
      style={({ pressed }) => [
        styles.button,
        variant === "plain" && styles.buttonPlain,
        { backgroundColor: background },
        pressed && { opacity: 0.75, transform: [{ scale: 0.98 }] },
        disabled && styles.disabled,
      ]}
    >
      {icon && <Icon name={icon} size={17} color={color} />}
      <Txt variant="headline" color={color}>
        {label}
      </Txt>
    </Pressable>
  );
}

// Botão redondo pequeno (fechar), como o ✕ das folhas do iOS.
export function CircleButton({ icon, onPress, label, size = 30 }: { icon: IconName; onPress: () => void; label: string; size?: number }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={Math.max(0, (44 - size) / 2)}
      style={({ pressed }) => [
        styles.circleButton,
        { width: size, height: size, borderRadius: size / 2 },
        pressed && { opacity: 0.7 },
      ]}
    >
      <Icon name={icon} size={size * 0.5} color={colors.secondary} />
    </Pressable>
  );
}

// ---------- Avatares ----------

export function Avatar({ name, size = 56 }: { name: string; size?: number }) {
  const initial = name.trim().charAt(0).toUpperCase();
  return (
    <LinearGradient
      colors={avatarGradient(name)}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ width: size, height: size, borderRadius: size / 2, alignItems: "center", justifyContent: "center" }}
    >
      <Txt variant="title" color="#FFFFFF" style={{ fontSize: size * 0.42, lineHeight: size * 0.52 }}>
        {initial}
      </Txt>
    </LinearGradient>
  );
}

// ---------- Controlos ----------

type SegmentedProps<T extends string> = {
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  accessibilityLabel: string;
};

export function Segmented<T extends string>({ options, value, onChange, accessibilityLabel }: SegmentedProps<T>) {
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel={accessibilityLabel} style={styles.segmented}>
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
            accessibilityState={{ checked: selected }}
            style={[styles.segment, selected && styles.segmentSelected]}
          >
            <Txt variant={selected ? "subheadBold" : "subhead"}>{o.label}</Txt>
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
  label: string;
};

// O stepper do iOS. Para o VoiceOver é um "ajustável": desliza para cima ou
// para baixo para mudar o valor.
export function Stepper({ value, min, max, onChange, label }: StepperProps) {
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
      style={styles.stepper}
    >
      <Pressable onPress={() => canDec && change(value - 1)} style={[styles.stepperHalf, !canDec && styles.disabled]}>
        <Txt variant="title3">−</Txt>
      </Pressable>
      <View style={styles.stepperDivider} />
      <Pressable onPress={() => canInc && change(value + 1)} style={[styles.stepperHalf, !canInc && styles.disabled]}>
        <Txt variant="title3">+</Txt>
      </Pressable>
    </View>
  );
}

// ---------- Ronda ----------

type ConfirmOptions = { title: string; message: string; confirm: string; cancel: string };

// Pergunta antes de uma ação que não se desfaz, com Cancelar (alerts.md).
// Na web o Alert do React Native não faz nada: usa o do browser.
export function confirmDestructive({ title, message, confirm, cancel }: ConfirmOptions): Promise<boolean> {
  if (Platform.OS === "web") return Promise.resolve(window.confirm(`${title}\n\n${message}`));
  return new Promise((resolve) =>
    Alert.alert(title, message, [
      { text: cancel, style: "cancel", onPress: () => resolve(false) },
      { text: confirm, style: "destructive", onPress: () => resolve(true) },
    ]),
  );
}

// Barra de cima durante a ronda: ✕ para sair à esquerda, título ao centro.
export function TopBar({ title, onClose, closeLabel }: { title?: string; onClose: () => void; closeLabel: string }) {
  return (
    <View style={styles.topBar}>
      <CircleButton icon="close" onPress={onClose} label={closeLabel} />
      <Txt variant="subheadBold" color={colors.secondary} align="center" numberOfLines={1} style={styles.fill}>
        {title}
      </Txt>
      <View style={styles.topBarSpacer} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  fill: { flex: 1, minWidth: 0 },
  backdrop: { position: "absolute", top: 0, left: 0, right: 0 },
  footerWrap: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "rgba(255,255,255,0.08)",
    backgroundColor: Platform.OS === "android" ? "rgba(0,0,0,0.9)" : "rgba(0,0,0,0.35)",
  },
  footer: { paddingHorizontal: MARGIN, paddingTop: 12, gap: spacing.sm },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    paddingHorizontal: MARGIN,
    marginTop: spacing.xl,
    marginBottom: 12,
  },
  groupWrap: { paddingHorizontal: MARGIN },
  group: { backgroundColor: colors.card, borderRadius: 16, overflow: "hidden" },
  groupFooter: { marginHorizontal: spacing.md, marginTop: spacing.sm },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: colors.separator, marginLeft: 60 },
  row: { minHeight: 52, paddingHorizontal: spacing.md, paddingVertical: 10, flexDirection: "row", alignItems: "center", gap: 14 },
  rowIcon: { width: 30, height: 30, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  button: {
    minHeight: 54,
    borderRadius: 27,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  buttonPlain: { minHeight: 44 },
  disabled: { opacity: 0.35 },
  circleButton: { backgroundColor: colors.cardRaised, alignItems: "center", justifyContent: "center" },
  segmented: { flexDirection: "row", borderRadius: 10, padding: 2, backgroundColor: colors.cardRaised },
  segment: { flex: 1, minHeight: 34, alignItems: "center", justifyContent: "center", borderRadius: 8, paddingHorizontal: 12 },
  segmentSelected: { backgroundColor: "#636366" },
  stepper: { flexDirection: "row", alignItems: "center", borderRadius: 10, height: 36, backgroundColor: colors.cardRaised },
  stepperHalf: { width: 48, height: 36, alignItems: "center", justifyContent: "center" },
  stepperDivider: { width: StyleSheet.hairlineWidth, height: 18, backgroundColor: colors.fill },
  topBar: { flexDirection: "row", alignItems: "center", minHeight: 52, paddingHorizontal: MARGIN - 4 },
  topBarSpacer: { width: 30 },
});
