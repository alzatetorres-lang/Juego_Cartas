export type TutorialActionType = 'PLAY_CARD' | 'CLICK_BUTTON' | 'MOVE_STACK' | 'BET' | 'PASS';

export interface TutorialAction {
  type: TutorialActionType;
  sourceId?: string;
  targetId?: string;
}

export interface TutorialStep {
  stepIndex: number;
  instructionTitle: string;
  instructionBody: string;       // Explicación didáctica del porqué de la jugada
  highlightElementId: string;    // ID del botón o carta que brilla en el DOM
  expectedAction: TutorialAction;
  positionHint?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

export interface GameTutorialScript {
  gameType: 'mus' | 'klondike' | 'spider' | 'blackjack';
  title: string;
  description: string;
  steps: TutorialStep[];
}
