export interface TutorialStep {
  stepIndex: number;
  instructionTitle: string;
  instructionBody: string;       // Explicación del porqué de la jugada
  highlightElementId: string;    // ID del botón o carta que brilla en el DOM
  expectedAction: {
    type: 'PLAY_CARD' | 'CLICK_BUTTON' | 'MOVE_STACK';
    sourceId?: string;
    targetId?: string;
  };
}