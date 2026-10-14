'use client';

import React, { useState } from 'react';
import { Modal } from './Modal';
import { BrickButton } from './BrickButton';
import { useGameStore, SHOP_CATALOG } from '@/store/useGameStore';
import { ShopItem } from '@/core/types/store';
import { sfx } from '@/core/sound/sfx';
import { ShoppingBag, Check, Lock, Palette } from 'lucide-react';

interface ShopModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShopModal: React.FC<ShopModalProps> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<'cardBack' | 'tableFelt' | 'avatar'>(
    'cardBack'
  );

  const studs = useGameStore((s) => s.studs);
  const inventory = useGameStore((s) => s.inventory);
  const buyItem = useGameStore((s) => s.buyItem);
  const equipItem = useGameStore((s) => s.equipItem);

  const categories = [
    { key: 'cardBack', label: 'Dorsos de Cartas' },
    { key: 'tableFelt', label: 'Tapetes de Juego' },
    { key: 'avatar', label: 'Minifiguras y Avatares' },
  ] as const;

  const currentItems = SHOP_CATALOG.filter((item) => item.category === selectedCategory);

  const isEquipped = (item: ShopItem) => {
    if (item.category === 'cardBack') return inventory.selectedCardBack === item.id;
    if (item.category === 'tableFelt') return inventory.selectedTableFelt === item.id;
    if (item.category === 'avatar') return inventory.selectedAvatar === item.id;
    return false;
  };

  const isUnlocked = (item: ShopItem) => {
    return inventory.unlockedItemIds.includes(item.id);
  };

  const handleAction = (item: ShopItem) => {
    if (isEquipped(item)) return;

    if (isUnlocked(item)) {
      sfx.playBrickSnap();
      equipItem(item.category, item.id);
    } else {
      if (studs >= item.price) {
        sfx.playCoinJingle();
        buyItem(item);
        equipItem(item.category, item.id);
      } else {
        alert('¡No tienes suficientes Piezas para desbloquear este artículo!');
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tienda de Bloques (Brick Shop)" maxWidth="lg">
      <div className="space-y-4">
        {/* Selector de Categorías */}
        <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-700">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => {
                sfx.playBrickSnap();
                setSelectedCategory(cat.key);
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                selectedCategory === cat.key
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid de Artículos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {currentItems.map((item) => {
            const unlocked = isUnlocked(item);
            const equipped = isEquipped(item);

            return (
              <div
                key={item.id}
                className={`p-3 rounded-xl border-2 transition-all flex flex-col justify-between ${
                  equipped
                    ? 'border-amber-400 bg-amber-950/20 shadow-lg'
                    : unlocked
                    ? 'border-slate-700 bg-slate-850 hover:border-slate-600'
                    : 'border-slate-800 bg-slate-900/60 opacity-85'
                }`}
              >
                <div>
                  {/* Vista Previa de Color/Aspecto */}
                  <div
                    style={{ backgroundColor: item.previewColor }}
                    className="w-full h-16 rounded-lg mb-2 shadow-inner border border-white/20 flex items-center justify-center relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-stud-pattern-dense opacity-40" />
                    {equipped ? (
                      <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full z-10 shadow">
                        EQUIPADO
                      </span>
                    ) : !unlocked ? (
                      <Lock className="text-white drop-shadow z-10" size={20} />
                    ) : (
                      <Palette className="text-white drop-shadow z-10" size={20} />
                    )}
                  </div>

                  <h4 className="font-extrabold text-sm text-white mb-0.5">{item.name}</h4>
                  <p className="text-xs text-slate-400 leading-snug mb-3">{item.description}</p>
                </div>

                {/* Botón de Comprar / Equipar */}
                <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between">
                  {equipped ? (
                    <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                      <Check size={14} /> En Uso
                    </span>
                  ) : unlocked ? (
                    <BrickButton
                      variant="primary"
                      size="sm"
                      onClick={() => handleAction(item)}
                      className="w-full"
                    >
                      Equipar
                    </BrickButton>
                  ) : (
                    <BrickButton
                      variant="warning"
                      size="sm"
                      onClick={() => handleAction(item)}
                      disabled={studs < item.price}
                      className="w-full"
                    >
                      Desbloquear ({item.price} Piezas)
                    </BrickButton>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
