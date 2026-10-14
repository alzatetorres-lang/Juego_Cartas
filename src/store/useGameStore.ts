import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { GameStoreState, ShopItem } from '../core/types/store';
import { GameConfig } from '../core/types/card';

export const SHOP_CATALOG: ShopItem[] = [
  // Dorsos de cartas
  {
    id: 'back_brick_red',
    name: 'Rojo Bloque Clásico',
    category: 'cardBack',
    price: 0,
    description: 'El clásico color rojo de juguete con relieve de studs.',
    previewColor: '#DC2626',
    unlockedByDefault: true,
  },
  {
    id: 'back_cyber_neon',
    name: 'Ciber Neón Futurista',
    category: 'cardBack',
    price: 300,
    description: 'Circuito de plasma esmeralda con studs de luz neón.',
    previewColor: '#059669',
  },
  {
    id: 'back_gold_plate',
    name: 'Oro Real Legendario',
    category: 'cardBack',
    price: 750,
    description: 'Placa con baño de oro pulido para grandes apostadores.',
    previewColor: '#D97706',
  },
  {
    id: 'back_cave_stone',
    name: 'Piedra Glaciar Primigenia',
    category: 'cardBack',
    price: 450,
    description: 'Textura de roca tallada y runas de la edad de hielo.',
    previewColor: '#475569',
  },

  // Tapetes de juego
  {
    id: 'felt_classic_green',
    name: 'Verde Bloques Estándar',
    category: 'tableFelt',
    price: 0,
    description: 'Placa base verde esmeralda con matriz de studs conectables.',
    previewColor: '#15803D',
    unlockedByDefault: true,
  },
  {
    id: 'felt_blueprint_blue',
    name: 'Plano Técnico Azul',
    category: 'tableFelt',
    price: 350,
    description: 'Cuadrícula técnica de diseño de ingeniería modular.',
    previewColor: '#1E40AF',
  },
  {
    id: 'felt_space_arena',
    name: 'Arena Espacial Galáctica',
    category: 'tableFelt',
    price: 600,
    description: 'Hangar interestelar con nebulosas y studs estelares.',
    previewColor: '#312E81',
  },
  {
    id: 'felt_lava_cave',
    name: 'Caverna de Magma',
    category: 'tableFelt',
    price: 500,
    description: 'Rocas volcánicas ardientes con iluminación de lava.',
    previewColor: '#7F1D1D',
  },

  // Avatares de jugador
  {
    id: 'avatar_arturo',
    name: 'Rey Arturo Stud',
    category: 'avatar',
    price: 0,
    description: 'El monarca legendario de la corona dorada de bloques.',
    previewColor: '#F59E0B',
    unlockedByDefault: true,
  },
  {
    id: 'avatar_cyber_emperor',
    name: 'Emperador Ciber',
    category: 'avatar',
    price: 400,
    description: 'Cerebro cibernético con visor holográfico.',
    previewColor: '#10B981',
  },
  {
    id: 'avatar_titan',
    name: 'Capitán Titán',
    category: 'avatar',
    price: 400,
    description: 'Defensor invencible con casco reforzado de bloques.',
    previewColor: '#EF4444',
  },
  {
    id: 'avatar_mammoth',
    name: 'Jefe Mamut',
    category: 'avatar',
    price: 400,
    description: 'Gran líder chamánico con coraza de marfil.',
    previewColor: '#6B7280',
  },
];

const DEFAULT_CONFIG: GameConfig = {
  gameType: 'mus',
  playerCount: 2,
  tutorialMode: 'none',
  variants: {
    musKings: 4,
    musSignsEnabled: true,
    klondikeDraw: 1,
    spiderSuits: 1,
    blackjackDecks: 1,
  },
};

export const useGameStore = create<GameStoreState>()(
  persist(
    (set, get) => ({
      studs: 1000,
      soundEnabled: true,

      inventory: {
        selectedCardBack: 'back_brick_red',
        selectedTableFelt: 'felt_classic_green',
        selectedAvatar: 'avatar_arturo',
        unlockedItemIds: ['back_brick_red', 'felt_classic_green', 'avatar_arturo'],
      },

      activeConfig: DEFAULT_CONFIG,

      stats: {
        mus: { played: 0, won: 0, lost: 0, studsEarned: 0 },
        klondike: { played: 0, won: 0, lost: 0, studsEarned: 0 },
        spider: { played: 0, won: 0, lost: 0, studsEarned: 0 },
        blackjack: { played: 0, won: 0, lost: 0, studsEarned: 0 },
      },

      addStuds: (amount: number) => {
        set((state) => ({ studs: state.studs + Math.max(0, amount) }));
      },

      deductStuds: (amount: number) => {
        const current = get().studs;
        if (current >= amount) {
          set({ studs: current - amount });
          return true;
        }
        return false;
      },

      equipItem: (category, itemId) => {
        const { inventory } = get();
        if (inventory.unlockedItemIds.includes(itemId)) {
          if (category === 'cardBack') {
            set({ inventory: { ...inventory, selectedCardBack: itemId } });
          } else if (category === 'tableFelt') {
            set({ inventory: { ...inventory, selectedTableFelt: itemId } });
          } else if (category === 'avatar') {
            set({ inventory: { ...inventory, selectedAvatar: itemId } });
          }
        }
      },

      buyItem: (item: ShopItem) => {
        const { studs, inventory } = get();
        if (inventory.unlockedItemIds.includes(item.id)) {
          return true; // Ya adquirido
        }
        if (studs >= item.price) {
          set({
            studs: studs - item.price,
            inventory: {
              ...inventory,
              unlockedItemIds: [...inventory.unlockedItemIds, item.id],
            },
          });
          return true;
        }
        return false;
      },

      setActiveConfig: (config: GameConfig) => {
        set({ activeConfig: config });
      },

      recordGameResult: (game: string, won: boolean, studsReward: number) => {
        set((state) => {
          const currentStat = state.stats[game] || { played: 0, won: 0, lost: 0, studsEarned: 0 };
          return {
            studs: state.studs + studsReward,
            stats: {
              ...state.stats,
              [game]: {
                played: currentStat.played + 1,
                won: currentStat.won + (won ? 1 : 0),
                lost: currentStat.lost + (won ? 0 : 1),
                studsEarned: currentStat.studsEarned + studsReward,
              },
            },
          };
        });
      },

      toggleSound: () => {
        set((state) => ({ soundEnabled: !state.soundEnabled }));
      },
    }),
    {
      name: 'brickdeck_2d_store_v1',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
