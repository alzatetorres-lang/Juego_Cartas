import { GameConfig } from './card';

export interface ShopItem {
  id: string;
  name: string;
  category: 'cardBack' | 'tableFelt' | 'avatar';
  price: number;
  description: string;
  previewColor: string;
  iconName?: string;
  unlockedByDefault?: boolean;
}

export interface GameStats {
  played: number;
  won: number;
  lost: number;
  studsEarned: number;
}

export interface UserInventory {
  selectedCardBack: string;
  selectedTableFelt: string;
  selectedAvatar: string;
  unlockedItemIds: string[];
}

export interface GameStoreState {
  // Economía
  studs: number;
  addStuds: (amount: number) => void;
  deductStuds: (amount: number) => boolean;

  // Inventario y Cosméticos
  inventory: UserInventory;
  equipItem: (category: 'cardBack' | 'tableFelt' | 'avatar', itemId: string) => void;
  buyItem: (item: ShopItem) => boolean;

  // Configuración de juego activo
  activeConfig: GameConfig;
  setActiveConfig: (config: GameConfig) => void;

  // Estadísticas
  stats: Record<string, GameStats>;
  recordGameResult: (game: string, won: boolean, studsReward: number) => void;

  // Audio / FX Settings
  soundEnabled: boolean;
  toggleSound: () => void;
}
