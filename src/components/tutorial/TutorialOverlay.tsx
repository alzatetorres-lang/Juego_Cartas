'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameType } from '@/core/types/card';
import { TUTORIAL_SCRIPTS } from '@/core/tutorials/tutorialScripts';
import { BrickButton } from '@/components/ui/BrickButton';
import { Lightbulb, ChevronRight, X, Sparkles } from 'lucide-react';
import { sfx } from '@/core/sound/sfx';

interface TutorialOverlayProps {
  gameType: GameType;
  currentStepIndex: number;
  onNextStep: () => void;
  onClose: () => void;
}

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  gameType,
  currentStepIndex,
  onNextStep,
  onClose,
}) => {
  const script = TUTORIAL_SCRIPTS[gameType];
  const currentStep = script?.steps[currentStepIndex];

  // Efecto para iluminar el elemento del DOM indicado en el paso
  useEffect(() => {
    if (!currentStep?.highlightElementId) return;

    const el = document.getElementById(currentStep.highlightElementId);
    if (el) {
      el.classList.add('tutorial-highlight');
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return () => {
      if (el) {
        el.classList.remove('tutorial-highlight');
      }
    };
  }, [currentStep?.highlightElementId]);

  if (!script || !currentStep) return null;

  const totalSteps = script.steps.length;
  const isLastStep = currentStepIndex >= totalSteps - 1;

  const handleAdvance = () => {
    sfx.playBrickSnap();
    if (isLastStep) {
      onClose();
    } else {
      onNextStep();
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4 pointer-events-none">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStepIndex}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 400, damping: 28 }}
          className="w-full max-w-xl bg-slate-900/95 border-3 border-amber-400 rounded-brick shadow-[0_12px_30px_rgba(0,0,0,0.85)] p-4 pointer-events-auto backdrop-blur-md brick-bevel relative"
        >
          {/* Fila superior: Badge de paso y botón cerrar */}
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-700/80">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-amber-500/20 text-amber-400">
                <Lightbulb size={16} />
              </span>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-400">
                Paso {currentStepIndex + 1} de {totalSteps}: {script.title}
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {/* Cuerpo de la instrucción */}
          <h4 className="text-sm md:text-base font-black text-white mb-1.5 drop-shadow-sm">
            {currentStep.instructionTitle}
          </h4>
          <p className="text-xs md:text-sm text-slate-200 leading-relaxed mb-4">
            {currentStep.instructionBody}
          </p>

          {/* Botones de acción del paso */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-amber-300/80 font-medium flex items-center gap-1">
              <Sparkles size={12} /> Observa el elemento iluminado en la mesa
            </span>
            <BrickButton variant="warning" size="sm" onClick={handleAdvance}>
              {isLastStep ? '¡Completar!' : 'Siguiente Paso'}{' '}
              <ChevronRight size={14} className="inline ml-1" />
            </BrickButton>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
