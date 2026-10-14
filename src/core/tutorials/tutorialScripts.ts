import { GameTutorialScript } from '../types/tutorial';

export const TUTORIAL_SCRIPTS: Record<'mus' | 'klondike' | 'spider' | 'blackjack', GameTutorialScript> = {
  mus: {
    gameType: 'mus',
    title: 'Tutorial Interactivo: Fundamentos del Mus',
    description: 'Aprende los lances, el descarte y la estrategia de envites con tu mano guiada.',
    steps: [
      {
        stepIndex: 0,
        instructionTitle: 'Fase de Descarte (Mus)',
        instructionBody:
          'Al inicio de la mano, si no estás satisfecho con tus 4 cartas, puedes pedir "Mus" para descartarte. Si todos los jugadores aceptan, robáis cartas nuevas.',
        highlightElementId: 'btn-mus-action',
        expectedAction: { type: 'CLICK_BUTTON' },
        positionHint: 'bottom',
      },
      {
        stepIndex: 1,
        instructionTitle: 'Lance de Grande',
        instructionBody:
          'Se comparan las cartas más altas. Con un Rey (12) y un Caballo (11) tienes una mano fuerte. ¡Lanza un Envido (+2 piedras) para presionar!',
        highlightElementId: 'btn-envido',
        expectedAction: { type: 'CLICK_BUTTON' },
        positionHint: 'bottom',
      },
      {
        stepIndex: 2,
        instructionTitle: 'Panel de Señas (Modo 2v2)',
        instructionBody:
          'En partidas por parejas, puedes transmitir a tu compañero tus jugadas sin que los rivales lo sepan usando las señas reglamentarias (ej. morderse el labio = 2 Ases).',
        highlightElementId: 'panel-signs-toggle',
        expectedAction: { type: 'CLICK_BUTTON' },
        positionHint: 'left',
      },
    ],
  },

  blackjack: {
    gameType: 'blackjack',
    title: 'Tutorial Interactivo: Estrategia de Blackjack',
    description: 'Aprende cuándo pedir, plantarte o doblar según la carta visible del Crupier.',
    steps: [
      {
        stepIndex: 0,
        instructionTitle: 'Comprueba el valor de tu mano',
        instructionBody:
          'Tu objetivo es sumar 21 o acercarte más que el Crupier sin pasarte. Tienes un total de 11. Con 11 puntos, ¡la jugada óptima matemáticamente es Doblar la apuesta!',
        highlightElementId: 'btn-blackjack-double',
        expectedAction: { type: 'CLICK_BUTTON' },
        positionHint: 'bottom',
      },
      {
        stepIndex: 1,
        instructionTitle: 'Pedir Carta (Hit)',
        instructionBody:
          'Si tu mano es baja (menos de 12), siempre es seguro pedir carta porque no puedes pasarte de 21.',
        highlightElementId: 'btn-blackjack-hit',
        expectedAction: { type: 'CLICK_BUTTON' },
        positionHint: 'bottom',
      },
      {
        stepIndex: 2,
        instructionTitle: 'Plantarse (Stand)',
        instructionBody:
          'Cuando alcanzas 17 o más puntos, el riesgo de pasarte supera la probabilidad de mejora. Pulsa Plantarse para ceder el turno al Crupier.',
        highlightElementId: 'btn-blackjack-stand',
        expectedAction: { type: 'CLICK_BUTTON' },
        positionHint: 'bottom',
      },
    ],
  },

  klondike: {
    gameType: 'klondike',
    title: 'Tutorial: Solitario Klondike de Bloques',
    description: 'Aprende a construir columnas alternadas y llevar tus cartas a las 4 fundaciones.',
    steps: [
      {
        stepIndex: 0,
        instructionTitle: 'Robar del Mazo de Reserva',
        instructionBody:
          'Haz clic en la baraja de reserva para destapar cartas útiles cuando no haya movimientos directos en el tablero.',
        highlightElementId: 'klondike-stock-pile',
        expectedAction: { type: 'CLICK_BUTTON' },
        positionHint: 'top',
      },
      {
        stepIndex: 1,
        instructionTitle: 'Alternancia de Colores en el Tablero',
        instructionBody:
          'En el tablero debes apilar en orden descendente alternando colores: Cartas cálidas (Oros/Copas) sobre frías (Espadas/Bastos) y viceversa.',
        highlightElementId: 'klondike-col-1',
        expectedAction: { type: 'PLAY_CARD' },
        positionHint: 'bottom',
      },
      {
        stepIndex: 2,
        instructionTitle: 'Fundaciones de Palos',
        instructionBody:
          'El objetivo final es llevar todas las cartas a las 4 fundaciones superiores, comenzando por el As (1) hasta el Comodín (13) por cada palo.',
        highlightElementId: 'klondike-foundation-oros',
        expectedAction: { type: 'MOVE_STACK' },
        positionHint: 'top',
      },
    ],
  },

  spider: {
    gameType: 'spider',
    title: 'Tutorial: Solitario Spider de 10 Columnas',
    description: 'Aprende a encadenar secuencias completas del 13 (Comodín) al 1 (As).',
    steps: [
      {
        stepIndex: 0,
        instructionTitle: 'Construir Secuencias Descendentes',
        instructionBody:
          'Puedes colocar cualquier carta sobre otra de valor inmediatamente superior (por ejemplo, un 8 sobre un 9). Pero solo podrás mover la pila junta si son del mismo palo.',
        highlightElementId: 'spider-col-0',
        expectedAction: { type: 'PLAY_CARD' },
        positionHint: 'bottom',
      },
      {
        stepIndex: 1,
        instructionTitle: 'Reparto de Fila desde la Reserva',
        instructionBody:
          'Cuando te quedes sin movimientos disponibles, pulsa el mazo de reserva para repartir una nueva fila de 10 cartas (una en cada columna).',
        highlightElementId: 'spider-stock-pile',
        expectedAction: { type: 'CLICK_BUTTON' },
        positionHint: 'top',
      },
    ],
  },
};
