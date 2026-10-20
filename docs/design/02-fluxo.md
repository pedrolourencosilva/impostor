# 2. Fluxo

Decidido com o Pedro a 2026-10-20. Regras inspiradas nas oficiais do
Undercover (Yanstar Studio), o jogo de referência do género.

## Papéis (misturáveis no mesmo jogo)

| Papel | O que vê | Sabe que é infiltrado? |
|---|---|---|
| Civil | A palavra | — |
| Undercover | A outra palavra do par | Não |
| Impostor | Nada ("És o impostor") | Sim |

- Na configuração escolhe-se **quantos impostores e quantos Undercovers**
  (em vez de um modo). Pelo menos 1 infiltrado; os infiltrados são sempre
  minoria.
- Todos os cartões têm o **mesmo aspeto**; só o texto muda.
- Pista para o impostor: **por decidir** (a outra palavra é óbvia demais, a
  categoria é difícil demais; o meio-termo exige trios de palavras). Até lá,
  sem pista ou a outra palavra, como agora.

## Ciclo de jogo

```text
Configurar ──► Ver a palavra (passa por todos) ──► Discussão ◄─────────────┐
                                                    │                      │
                                                    ▼                      │
                                           Quem foi expulso? (o grupo      │
                                           vota fora da app; aqui só se    │
                                           escolhe o expulso)              │
                                                    │                      │
                                                    ▼                      │
                                           "Bruno era civil / Undercover   │
                                            / impostor"                    │
                                                    │                      │
                                  era impostor? ──► Adivinhar a palavra    │
                                                    │  acertou ─► Fim      │
                                                    │  falhou ─┐           │
                                                    ▼          ▼           │
                                           Alguém ganhou? ── não ──────────┘
                                                    │ sim
                                                    ▼
                                                   Fim
```

- **Discussão**: quem começa é sorteado entre os jogadores ainda em jogo
  (pode ser um infiltrado, como no Undercover).
- **Adivinhar**: no próprio ecrã que diz "Carla era impostor" (não há ecrã
  à parte); passa-se-lhe o telemóvel e ele escreve. A app
  ignora maiúsculas, acentos e um erro de escrita, e diz só "Acertou" ou
  "Falhou", **sem mostrar a palavra** (um Undercover ainda em jogo não a
  pode ver).

## Quem ganha

- **Civis**: expulsaram todos os infiltrados.
- **Infiltrados**: só resta 1 civil.
- **Impostor**: acerta na palavra quando é expulso (ganha logo).

## Fim

- Mostra quem ganhou, o papel de cada um e as duas palavras.
- **Jogar outra vez** com os mesmos jogadores, num toque.
- **Mudar jogadores** dali mesmo, sem voltar a escrever todos (juntar quem
  chegou, tirar quem saiu), e jogar.

## Wireframes

A cinzento, clicáveis no modo Play: https://claude.ai/artifact/2otwdfbmtxRgihEXUZYNvF
