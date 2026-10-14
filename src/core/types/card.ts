export type Suit = 'oros' | 'copas' | 'espadas' | 'bastos';
export type FactionTheme = 'medieval' | 'superheroes' | 'cavemen' | 'futuristic';
export type CardColor = 'warm' | 'cold'; // Oros + Copas = warm | Espadas + Bastos = cold (para Solitario)

export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
// 1 = As, 2-9 = Numéricas, 10 = Sota, 11 = Caballo, 12 = Rey, 13 = Comodín de Facción

export interface Card {
  id: string;           // Ejemplo: "oros-12-deck1"
  suit: Suit;
  faction: FactionTheme;
  rank: Rank;
  color: CardColor;
  faceUp: boolean;
  isJoker: boolean;     // true cuando rank === 13
}

export type GameType = 'mus' | 'klondike' | 'spider' | 'blackjack';
export type TutorialMode = 'none' | 'visual' | 'interactive';

export interface GameVariants {
  musKings?: 4 | 8;
  musSignsEnabled?: boolean;
  klondikeDraw?: 1 | 3;
  spiderSuits?: 1 | 2 | 4;
  blackjackDecks?: 1 | 2 | 4;
}

export interface GameConfig {
  gameType: GameType;
  playerCount: number;  // 1 para solitarios; 2 o 4 en Mus; 1 a 4 en Blackjack
  tutorialMode: TutorialMode;
  variants: GameVariants;
}

export interface FigureInfo {
  name: string;
  subtitle: string;
  description: string;
}

export const SUIT_FACTIONS: Record<Suit, FactionTheme> = {
  oros: 'medieval',
  copas: 'superheroes',
  espadas: 'cavemen',
  bastos: 'futuristic',
};

export const SUIT_COLORS: Record<Suit, CardColor> = {
  oros: 'warm',
  copas: 'warm',
  espadas: 'cold',
  bastos: 'cold',
};

export const SUIT_DISPLAY_NAMES: Record<Suit, string> = {
  oros: 'Oros (Medieval)',
  copas: 'Copas (Héroes)',
  espadas: 'Espadas (Cavernícolas)',
  bastos: 'Bastos (Ciber)',
};

export const FIGURE_TITLES: Record<Suit, Record<10 | 11 | 12 | 13, FigureInfo>> = {
  oros: {
    10: { name: 'Escudero', subtitle: 'Sota', description: 'Portador del escudo de bloques' },
    11: { name: 'Caballero Real', subtitle: 'Caballo', description: 'Campeón del reino dorado' },
    12: { name: 'Rey Arturo', subtitle: 'Rey', description: 'Monarca de la corona stud' },
    13: { name: 'Dragón Dorado', subtitle: 'Comodín', description: 'Guardián del tesoro de piezas' },
  },
  copas: {
    10: { name: 'Vigilante Enmascarado', subtitle: 'Sota', description: 'Centinela de la noche urbana' },
    11: { name: 'Velocista Aéreo', subtitle: 'Caballo', description: 'Héroe del reactor supersónico' },
    12: { name: 'Capitán Titán', subtitle: 'Rey', description: 'Líder de la liga de campeones' },
    13: { name: 'Guardián Cósmico', subtitle: 'Comodín', description: 'Protector de las galaxias' },
  },
  espadas: {
    10: { name: 'Cazador Tribal', subtitle: 'Sota', description: 'Rastreador de la estepa glaciar' },
    11: { name: 'Jinete de Raptor', subtitle: 'Caballo', description: 'Domador de bestias ancestrales' },
    12: { name: 'Jefe Mamut', subtitle: 'Rey', description: 'Líder del clan de piedra y hueso' },
    13: { name: 'Chamán Primigenio', subtitle: 'Comodín', description: 'Canalizador del fuego elemental' },
  },
  bastos: {
    10: { name: 'Androide Explorador', subtitle: 'Sota', description: 'Unidad de reconocimiento cuántica' },
    11: { name: 'Mecha de Asalto', subtitle: 'Caballo', description: 'Blindado cibernético de plasma' },
    12: { name: 'Emperador Ciber', subtitle: 'Rey', description: 'Soberano de la red neuronal' },
    13: { name: 'IA Suprema', subtitle: 'Comodín', description: 'Consciencia artificial omnipotente' },
  },
};
