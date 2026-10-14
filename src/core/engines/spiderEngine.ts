import { Card, Suit } from '../types/card';
import { createSpiderDeck } from '../deck/deckFactory';

export interface SpiderGameState {
  tableau: Card[][];            // 10 columnas
  stockDealsRemaining: Card[][]; // 5 tandas de 10 cartas cada una
  completedRunsCount: number;   // Objetivo: 8 escaleras completas (104 cartas / 13 = 8)
  suitsCount: 1 | 2 | 4;
  movesCount: number;
  score: number;
  isWon: boolean;
}

/**
 * Inicializa una partida de Solitario Spider
 */
export function initSpiderGame(suitsCount: 1 | 2 | 4 = 1): SpiderGameState {
  const allCards = createSpiderDeck(suitsCount);

  const tableau: Card[][] = [[], [], [], [], [], [], [], [], [], []];

  // Las primeras 4 columnas reciben 6 cartas (5 ocultas + 1 visible) = 24 cartas
  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 6; r++) {
      const card = allCards.pop()!;
      card.faceUp = r === 5;
      tableau[c].push(card);
    }
  }

  // Las 6 columnas restantes reciben 5 cartas (4 ocultas + 1 visible) = 30 cartas
  for (let c = 4; c < 10; c++) {
    for (let r = 0; r < 5; r++) {
      const card = allCards.pop()!;
      card.faceUp = r === 4;
      tableau[c].push(card);
    }
  }

  // Quedan 50 cartas para la reserva, divididas en 5 tandas de 10 cartas
  const stockDealsRemaining: Card[][] = [];
  for (let d = 0; d < 5; d++) {
    const deal: Card[] = [];
    for (let c = 0; c < 10; c++) {
      deal.push(allCards.pop()!);
    }
    stockDealsRemaining.push(deal);
  }

  return {
    tableau,
    stockDealsRemaining,
    completedRunsCount: 0,
    suitsCount,
    movesCount: 0,
    score: 500,
    isWon: false,
  };
}

/**
 * Reparte una ronda de 10 cartas desde la reserva (1 a cada columna)
 */
export function dealFromSpiderStock(state: SpiderGameState): SpiderGameState {
  if (state.stockDealsRemaining.length === 0) return state;

  const deals = [...state.stockDealsRemaining];
  const currentDeal = deals.pop()!;
  const newTableau = state.tableau.map((col) => [...col]);

  for (let i = 0; i < 10; i++) {
    const card = currentDeal[i];
    card.faceUp = true;
    newTableau[i].push(card);
  }

  // Verificar si alguna columna formó una escalera completa tras el reparto
  let completedRuns = state.completedRunsCount;
  for (let i = 0; i < 10; i++) {
    const checked = checkAndRemoveSpiderRun(newTableau[i]);
    if (checked.removed) {
      completedRuns++;
    }
  }

  return {
    ...state,
    tableau: newTableau,
    stockDealsRemaining: deals,
    completedRunsCount: completedRuns,
    movesCount: state.movesCount + 1,
    isWon: completedRuns === 8,
  };
}

/**
 * Valida si un subconjunto de cartas de una columna puede moverse como pila continua
 * Regla: Todas las cartas del bloque deben ser del MISMO palo y en secuencia estrictamente decreciente
 */
export function isValidMovableSpiderStack(cards: Card[]): boolean {
  if (cards.length === 0) return false;
  if (!cards[0].faceUp) return false;

  const suit = cards[0].suit;
  for (let i = 1; i < cards.length; i++) {
    if (!cards[i].faceUp) return false;
    if (cards[i].suit !== suit) return false;
    if (cards[i - 1].rank !== cards[i].rank + 1) return false;
  }
  return true;
}

/**
 * Valida si una carta o bloque puede colocarse sobre una columna destino
 * Regla: La carta destino debe tener rango +1 que la primera carta del bloque (cualquier palo),
 * o la columna destino está vacía.
 */
export function canPlaceOnSpiderColumn(cardsToMove: Card[], targetColumn: Card[]): boolean {
  if (cardsToMove.length === 0) return false;
  if (targetColumn.length === 0) return true; // Columna vacía acepta cualquier bloque válido

  const targetTop = targetColumn[targetColumn.length - 1];
  if (!targetTop.faceUp) return false;

  return targetTop.rank === cardsToMove[0].rank + 1;
}

/**
 * Detecta y retira una escalera completa del 13 (Comodín) al 1 (As) del mismo palo
 */
export function checkAndRemoveSpiderRun(column: Card[]): { removed: boolean } {
  if (column.length < 13) return { removed: false };

  // Comprobar las últimas 13 cartas
  const slice = column.slice(column.length - 13);
  const suit = slice[0].suit;

  for (let i = 0; i < 13; i++) {
    const expectedRank = 13 - i; // de 13 hacia 1
    if (!slice[i].faceUp || slice[i].suit !== suit || slice[i].rank !== expectedRank) {
      return { removed: false };
    }
  }

  // Eliminar la escalera completada de la columna
  column.splice(column.length - 13, 13);

  // Destapar la nueva carta superior si estaba boca abajo
  if (column.length > 0) {
    column[column.length - 1].faceUp = true;
  }

  return { removed: true };
}
