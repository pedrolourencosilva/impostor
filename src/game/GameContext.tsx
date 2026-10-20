import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, use, useEffect, useRef, useState, type ReactNode } from "react";

import { STRINGS, type Strings } from "@/i18n/strings";
import { WORDS } from "@/words";

import { clampImpostors, createRound } from "./logic";
import type { Category, Round, Settings } from "./types";

const STORAGE_KEY = "impostor:settings";

const DEFAULT_SETTINGS: Settings = {
  players: [],
  lang: "pt",
  mode: "classic",
  impostors: 1,
  categories: [],
};

type GameContextValue = {
  loaded: boolean;
  settings: Settings;
  updateSettings: (change: Partial<Settings>) => void;
  words: Category[];
  t: Strings;
  round: Round | null;
  newRound: () => void;
};

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [round, setRound] = useState<Round | null>(null);
  // Pares já saídos nesta sessão, por língua; não precisam de causar render.
  const used = useRef(new Set<string>());

  // As definições (jogadores, modo, língua) ficam guardadas no telemóvel, para
  // o grupo não ter de escrever os nomes todas as vezes.
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(raw) });
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (loaded) AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(settings)).catch(() => {});
  }, [loaded, settings]);

  function updateSettings(change: Partial<Settings>) {
    setSettings((prev) => {
      const next = { ...prev, ...change };
      if (change.lang && change.lang !== prev.lang) next.categories = [];
      next.impostors = clampImpostors(next.impostors, next.players.length);
      return next;
    });
  }

  const words = WORDS[settings.lang];

  function newRound() {
    const next = createRound(settings, words, used.current);
    used.current.add(next.pairKey);
    setRound(next);
  }

  return (
    <GameContext
      value={{ loaded, settings, updateSettings, words, t: STRINGS[settings.lang], round, newRound }}
    >
      {children}
    </GameContext>
  );
}

export function useGame(): GameContextValue {
  const value = use(GameContext);
  if (!value) throw new Error("useGame tem de estar dentro de <GameProvider>");
  return value;
}
