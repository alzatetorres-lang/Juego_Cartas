export type Suit = 'oros' | 'copas' | 'espadas' | 'bastos';
export type FactionTheme = 'medieval' | 'superheroes' | 'cavemen' | 'futuristic';
export type CardColor = 'warm' | 'cold'; // Oros + Copas = warm | Espadas + Bastos = cold (para Solitario)

export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13; 
// 10 = Sota, 11 = Caballo, 12 = Rey, 13 = Comodín de Facción

export interface Card {
  id: string;           // Ejemplo: "oros-12-deck1"
  suit: Suit;
  faction: FactionTheme;
  rank: Rank;
  color: CardColor;
  faceUp: boolean;
  isJoker: boolean;     // true cuando rank === 13
}

export interface GameConfig {
  gameType: 'mus' | 'klondike' | 'spider' | 'blackjack';
  playerCount: number;  // 1 para solitarios; 2 o 4 en Mus; 1 a 4 en Blackjack
  tutorialMode: 'none' | 'visual' | 'interactive';
  variants: {
    musKings?: 4 | 8;
    musSignsEnabled?: boolean;
    klondikeDraw?: 1 | 3;
    spiderSuits?: 1 | 2 | 4;
    blackjackDecks?: 1 | 2 | 4;
  };
}