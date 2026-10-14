import { Card, Suit, Rank, FactionTheme, CardColor, SUIT_FACTIONS, SUIT_COLORS } from '../types/card';

const ALL_SUITS: Suit[] = ['oros', 'copas', 'espadas', 'bastos'];
const ALL_RANKS_52: Rank[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
const MUS_RANKS: Rank[] = [1, 2, 3, 4, 5, 6, 7, 10, 11, 12]; // 40 cartas (sin 8, 9 ni 13)

/**
 * Barajado Fisher-Yates sin sesgo probabilístico
 */
export function shuffleDeck<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Crea una carta individual con todas sus propiedades de facción y color
 */
export function createCard(
  suit: Suit,
  rank: Rank,
  deckIndex: number = 0,
  faceUp: boolean = false
): Card {
  const faction: FactionTheme = SUIT_FACTIONS[suit];
  const color: CardColor = SUIT_COLORS[suit];
  const isJoker = rank === 13;

  return {
    id: `${suit}-${rank}-d${deckIndex}-${Math.random().toString(36).substring(2, 7)}`,
    suit,
    faction,
    rank,
    color,
    faceUp,
    isJoker,
  };
}

/**
 * Crea un mazo de 52 cartas adaptadas (1-12 estándar + 13 comodín de facción)
 */
export function create52Deck(deckIndex: number = 0, faceUp: boolean = false): Card[] {
  const deck: Card[] = [];
  for (const suit of ALL_SUITS) {
    for (const rank of ALL_RANKS_52) {
      deck.push(createCard(suit, rank, deckIndex, faceUp));
    }
  }
  return deck;
}

/**
 * Crea el mazo tradicional de Mus: 40 cartas (sin 8, 9 ni comodines 13)
 */
export function createMusDeck(deckIndex: number = 0, faceUp: boolean = false): Card[] {
  const deck: Card[] = [];
  for (const suit of ALL_SUITS) {
    for (const rank of MUS_RANKS) {
      deck.push(createCard(suit, rank, deckIndex, faceUp));
    }
  }
  return deck;
}

/**
 * Crea el sabot de Blackjack (de 1 a 4 barajas de 52 cartas)
 */
export function createBlackjackShoe(deckCount: number = 1): Card[] {
  const shoe: Card[] = [];
  for (let d = 0; d < deckCount; d++) {
    shoe.push(...create52Deck(d, false));
  }
  return shuffleDeck(shoe);
}

/**
 * Crea el mazo de Spider: 104 cartas (2 barajas completas)
 * Permite variantes de 1 palo, 2 palos o 4 palos
 */
export function createSpiderDeck(suitsCount: 1 | 2 | 4 = 1): Card[] {
  const deck: Card[] = [];
  let allowedSuits: Suit[];

  if (suitsCount === 1) {
    allowedSuits = ['oros']; // Solo Oros (Medieval)
  } else if (suitsCount === 2) {
    allowedSuits = ['oros', 'espadas']; // Oros (Cálido) y Espadas (Frío)
  } else {
    allowedSuits = ALL_SUITS; // Los 4 palos
  }

  const totalCardsNeeded = 104;
  const cardsPerSuit = ALL_RANKS_52.length; // 13 cartas
  const totalRuns = totalCardsNeeded / (allowedSuits.length * cardsPerSuit); // repeticiones necesarias

  let deckCounter = 0;
  for (let r = 0; r < totalRuns; r++) {
    for (const suit of allowedSuits) {
      for (const rank of ALL_RANKS_52) {
        deck.push(createCard(suit, rank, deckCounter++, false));
      }
    }
  }

  return shuffleDeck(deck);
}

/**
 * Obtiene el valor numérico en el juego de Mus considerando la variante de 4 u 8 Reyes
 * En 8 Reyes:
 * - Los 3 cuentan como Reyes (12)
 * - Los 2 cuentan como Ases (1)
 */
export function getMusCardEffectiveValue(rank: Rank, kingsCount: 4 | 8 = 4): number {
  if (kingsCount === 8) {
    if (rank === 3) return 12; // Cuenta como Rey
    if (rank === 2) return 1;  // Cuenta como As
  }
  return rank;
}

/**
 * Puntos para el Lance de Juego en Mus (Figuras = 10, resto su valor nominal)
 */
export function getMusGamePoints(rank: Rank, kingsCount: 4 | 8 = 4): number {
  const effective = getMusCardEffectiveValue(rank, kingsCount);
  if (effective >= 10) return 10;
  return effective;
}
