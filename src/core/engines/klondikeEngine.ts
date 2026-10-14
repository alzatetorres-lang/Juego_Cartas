import { Card, Suit, Rank } from '../types/card';
import { create52Deck, shuffleDeck } from '../deck/deckFactory';

export interface KlondikeGameState {
  stock: Card[];              // Mazo de reserva boca abajo
  waste: Card[];              // Pila de descarte boca arriba
  foundations: Record<Suit, Card[]>; // 4 fundaciones por palo (1 al 13)
  tableau: Card[][];          // 7 columnas del tablero
  drawCount: 1 | 3;
  movesCount: number;
  score: number;
  isWon: boolean;
}

/**
 * Inicializa una partida de Solitario Klondike con 52 cartas adaptadas
 */
export function initKlondikeGame(drawCount: 1 | 3 = 1): KlondikeGameState {
  const deck = shuffleDeck(create52Deck(0, false));

  const tableau: Card[][] = [[], [], [], [], [], [], []];

  // Repartir en cascada: col 0 tiene 1 carta, col 6 tiene 7
  for (let col = 0; col < 7; col++) {
    for (let r = 0; r <= col; r++) {
      const card = deck.pop()!;
      // La última carta de cada columna se coloca boca arriba
      card.faceUp = r === col;
      tableau[col].push(card);
    }
  }

  const foundations: Record<Suit, Card[]> = {
    oros: [],
    copas: [],
    espadas: [],
    bastos: [],
  };

  return {
    stock: deck,
    waste: [],
    foundations,
    tableau,
    drawCount,
    movesCount: 0,
    score: 0,
    isWon: false,
  };
}

/**
 * Roba 1 o 3 cartas del mazo de reserva hacia el descarte
 */
export function drawFromStock(state: KlondikeGameState): KlondikeGameState {
  const stock = [...state.stock];
  const waste = [...state.waste];

  if (stock.length === 0) {
    // Si la reserva está vacía, reciclamos el descarte
    if (waste.length === 0) return state;
    const recycledStock = waste.reverse().map((c) => ({ ...c, faceUp: false }));
    return {
      ...state,
      stock: recycledStock,
      waste: [],
      movesCount: state.movesCount + 1,
    };
  }

  const countToDraw = Math.min(state.drawCount, stock.length);
  for (let i = 0; i < countToDraw; i++) {
    const card = stock.pop()!;
    card.faceUp = true;
    waste.push(card);
  }

  return {
    ...state,
    stock,
    waste,
    movesCount: state.movesCount + 1,
  };
}

/**
 * Valida si una carta puede colocarse en una columna del tableau
 * Regla: color alterno (cálido vs frío) y rango estrictamente decreciente en 1
 * O si la columna está vacía: debe ser rango 13 (Comodín) o 12 (Rey)
 */
export function canPlaceOnTableau(card: Card, targetColumn: Card[]): boolean {
  if (targetColumn.length === 0) {
    // En espacio vacío solo puede colocarse la carta más alta (13 o 12)
    return card.rank === 13 || card.rank === 12;
  }

  const topCard = targetColumn[targetColumn.length - 1];
  if (!topCard.faceUp) return false;

  // Alternancia de color: cálido (oros, copas) vs frío (espadas, bastos)
  const isColorAlternated = card.color !== topCard.color;
  const isRankDescending = topCard.rank === card.rank + 1;

  return isColorAlternated && isRankDescending;
}

/**
 * Valida si una carta puede colocarse en su fundación correspondiente
 * Regla: mismo palo y rango ascendente (1 a 13)
 */
export function canPlaceOnFoundation(card: Card, foundation: Card[]): boolean {
  if (foundation.length === 0) {
    // En fundación vacía solo puede colocarse el As (rango 1)
    return card.rank === 1;
  }

  const topCard = foundation[foundation.length - 1];
  return topCard.suit === card.suit && card.rank === topCard.rank + 1;
}

/**
 * Intenta mover automáticamente una carta a su fundación
 */
export function tryAutoMoveToFoundation(
  card: Card,
  state: KlondikeGameState,
  sourceLocation: { type: 'waste' } | { type: 'tableau'; colIndex: number }
): KlondikeGameState | null {
  const foundation = state.foundations[card.suit];
  if (!canPlaceOnFoundation(card, foundation)) {
    return null;
  }

  const newFoundations = {
    ...state.foundations,
    [card.suit]: [...foundation, { ...card, faceUp: true }],
  };

  let newWaste = [...state.waste];
  const newTableau = state.tableau.map((col) => [...col]);

  if (sourceLocation.type === 'waste') {
    newWaste.pop();
  } else {
    const col = newTableau[sourceLocation.colIndex];
    col.pop();
    if (col.length > 0) {
      col[col.length - 1].faceUp = true; // Revelar la carta inferior
    }
  }

  // Verificar condición de victoria
  const totalInFoundations = Object.values(newFoundations).reduce(
    (acc, pile) => acc + pile.length,
    0
  );
  const isWon = totalInFoundations === 52;

  return {
    ...state,
    foundations: newFoundations,
    waste: newWaste,
    tableau: newTableau,
    movesCount: state.movesCount + 1,
    score: state.score + 10,
    isWon,
  };
}
