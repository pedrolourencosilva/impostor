# Impostor (nome provisório)

Jogo de festa para telemóvel, para jogar presencialmente com amigos: um
telemóvel passa de mão em mão, cada um vê a sua palavra, e o grupo tenta
descobrir o impostor. Projeto decidido a 2026-10-20.

O nome "impostor" (pasta, `app.json`, título) é provisório: o Pedro ainda não
escolheu o nome. Quando escolher, mudar a pasta, o `name`/`slug` do
`app.json` e o `appTitle` em `src/i18n/strings.ts`.

## Modo de trabalho: DIFERENTE dos outros projetos

**O código é escrito por mim (Claude).** Decisão dele a 2026-10-20: "eu nao
vou escrever codigo nenhum". O Pedro **decide** (regras, modos, ecrãs,
palavras, o que entra) e **testa** com os amigos. Não há notas de estudo nem
pistas socráticas aqui. Se ele quiser perceber uma parte específica do
código, pede na altura, e aí explico essa parte.

Continua a valer: decisões de produto são dele. Perguntar com o
`AskUserQuestion` em vez de assumir regras do jogo.

## Porquê existe (contexto da decisão)

Ideia dele, anterior a esta conversa. As apps de impostor que encontrou ou
têm muitos anúncios, ou só têm um modo (só dica, só undercover), ou poucas
palavras, ou má UI. O objetivo é ter "a app que o grupo dele prefere usar",
não ser a primeira. Uso real à frente dele conta mais do que originalidade.

## Stack e porquê

- **Expo (SDK 58) + React Native 0.88 + React 19.3 + TypeScript**, rotas
  com **expo-router** (ficheiros em `src/app/`).
- Escolhido em vez do Flutter porque **ele tem iPhone e não tem Mac**: o
  Expo Go (App Store) corre o projeto no iPhone sem compilar nada; o Flutter
  só correria no iPhone como versão web. App nativa a sério, mais tarde,
  pelo EAS Build (nuvem, sem Mac), que exige a conta Apple Developer paga.
- O Expo Go exige login numa conta Expo desde 2026-09-03.
- `@react-native-async-storage/async-storage` guarda as definições
  (jogadores, modo, língua, categorias) no telemóvel.

## Estrutura

```text
src/app/          ecrãs (expo-router): index (configuração, com categories
                  à parte) → reveal (passar o telemóvel) → discuss (quem
                  começa) → result (revelação)
src/game/         types.ts, logic.ts (funções puras, testadas),
                  GameContext.tsx (estado + AsyncStorage)
src/words/        pt.ts, en.ts: pares por categoria, um ficheiro por língua
src/i18n/         strings.ts: textos da interface em PT e EN
src/ui/           theme.ts (cores claro/escuro estilo iOS, useColors, type),
                  kit.tsx (Screen, Section, Row, Button, Segmented, Stepper, Icon)
tests/            logic.test.mts: node --test, sem bibliotecas
```

## Regras do jogo já decididas (2026-10-20)

- **Três modos, todos na 1.ª versão:**
  - `classic`: o impostor só vê "És o impostor".
  - `hint`: o impostor sabe que é impostor e recebe uma pista. **A pista é a
    outra palavra do par** (decisão minha, por confirmar com ele).
  - `undercover`: o impostor recebe a outra palavra do par e não sabe que é
    impostor.
- Um par serve os três modos; a ordem é sorteada em cada ronda.
- Impostores: 1 até `floor((n-1)/2)` (sempre minoria). Mínimo 3 jogadores,
  máximo 20, nomes únicos (sem distinguir maiúsculas), até 20 caracteres.
- Quem começa a falar é sorteado entre **todos** (pode calhar o impostor).
- Pares não se repetem na mesma sessão até se esgotarem.
- **Uma língua por jogo**, e a interface segue a língua das palavras.
- 1.ª versão = **passar o telemóvel**, sem servidor. Salas online ficam
  para depois.

## Interface (2026-10-20)

- **Estilo iOS**, pedido dele: listas agrupadas como nos Ajustes, botão
  principal em cápsula fixo no fundo, claro e escuro a seguir o telemóvel.
  Cor de destaque índigo (`tint` em `theme.ts`), vermelho só para o impostor.
- Regra dele: avisar quando uma sugestão quebra uma regra de interface, com
  a regra e a razão. Rever com a skill `apple-design` (HIG da Apple).
- Ícones: SF Symbols no iOS (`expo-symbols`); na web e Android aparece o
  `fallback` de texto de cada `Icon`.
- Design no canvas: https://claude.ai/artifact/XfQKeywJj8c2yegCYdjBgz

## Palavras

- 1.ª versão: **listas escritas à mão** (por mim, para ele rever), dez
  categorias por língua, ~20 pares cada.
- PT é português de Portugal; **nunca traduzir pares entre línguas**: cada
  língua tem os seus pares (a semelhança não sobrevive à tradução).
- Evitar pares em que uma palavra contém a outra (hiperónimos: "sopa" /
  "caldo verde") e palavras repetidas entre categorias (o teste apanha).
- Mais tarde, para ter milhares: pipeline offline (WordNet / OpenWordNet-PT +
  modelo local via Ollama + revisão dele). Ideia vinda de uma conversa
  anterior no claude.ai; não começado.

## Comandos

```bash
npx expo start          # servidor; ler o QR com o Expo Go no iPhone
npm test                # testes da lógica e das listas de palavras
npx tsc --noEmit        # tipos (os testes estão fora do tsconfig da app)
npx expo lint
```

## Armadilhas já encontradas

- `create-expo-app` mete um `LICENSE` MIT com copyright da Expo (é do
  template). A licença do projeto é decisão dele, ainda não tomada.
- O `node --test` lê `.ts` diretamente (Node 26), mas não verifica tipos.
  Os testes ficam em `.mts` e com `--disable-warning=MODULE_TYPELESS_PACKAGE_JSON`
  para não encher o ecrã de avisos.
- `npx expo lint` da primeira vez instala o ESLint e falha; à segunda corre.
- Web com `"output": "single"` no `app.json`: com `"server"` havia aviso de
  hidratação no modo escuro (o servidor desenha em claro).
- O remote `origin` é HTTPS com o `gh` como credential helper (config local
  do repo): o push por SSH falha nas sessões do Claude (chave sem agente).
