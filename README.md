# 🃏 BrickDeck 2D

> **Baraja Española de Bloques de Construcción**  
> Videojuego web 2D modular, responsivo y listo para producción. Combina la baraja tradicional española adaptada a 52 cartas con una estética de bloques plásticos de construcción (piezas encajables, studs, biseles y figuras vectoriales 100% libres de derechos de autor).

---

## 🎮 Modalidades de Juego Incluidas

1. **El Gran Mus:**
   - 40 cartas (sin 8, 9 ni comodines).
   - Modos 1 vs 1 (Mano a Mano) o 2 vs 2 (Jugador + Compañero IA vs 2 Rivales IA).
   - Variantes configurables: **4 Reyes** (estándar) y **8 Reyes** (3s como Reyes, 2s como Ases).
   - Lances completos: Grande, Chica, Pares y Juego / Punto.
   - Panel de señas reglamentarias en partidas 2v2 (guiños, labios, lengua, etc.) con reacciones de tu compañero.

2. **Solitario Klondike:**
   - 52 cartas (1 al 13 por cada palo).
   - Alternancia de colores en las 7 columnas del tablero: palos cálidos (Oros / Copas) sobre palos fríos (Espadas / Bastos).
   - 4 fundaciones superiores del As al Comodín.
   - Modos de robo: 1 carta o 3 cartas.

3. **Solitario Spider:**
   - 104 cartas (2 barajas completas) distribuidas en 10 columnas y 5 tandas de reserva de 10 cartas.
   - Dificultades personalizables: **1 Palo** (Oros), **2 Palos** (Oros y Espadas) o **4 Palos**.
   - Detección y retiro automático de escaleras completas del 13 (Comodín) al 1 (As).

4. **Blackjack 21:**
   - Sabot de 1 a 4 barajas (52 cartas cada una).
   - Mesa de casino con Crupier IA y opción de 1 a 3 bots adicionales.
   - Acciones: Pedir (Hit), Plantarse (Stand) y Doblar (Double). Ases blandos y duros.

---

## ✨ Características Principales

- **Facciones Temáticas Originales (IP Propia):**
  - **Oros (Medieval):** Monedas con stud dorado. Figuras: Escudero (10), Caballero (11), Rey Arturo (12), Dragón Dorado (13).
  - **Copas (Superhéroes):** Trofeo y reactor de energía. Figuras: Vigilante (10), Velocista (11), Capitán Titán (12), Guardián Cósmico (13).
  - **Espadas (Cavernícolas):** Hoja de piedra y hueso. Figuras: Cazador (10), Jinete Raptor (11), Jefe Mamut (12), Chamán Primigenio (13).
  - **Bastos (Futurista):** Cilindro de plasma neón. Figuras: Androide (10), Mecha (11), Emperador Ciber (12), IA Suprema (13).
- **Sistema de Tutorial Dual:**
  - **Guía Visual Rápida:** Resumen gráfico con reglas, palos y valores antes de jugar.
  - **Tutorial Guiado Paso a Paso:** Escenario interactivo preconfigurado con spotlight en el DOM que resalta la carta o botón exacto a pulsar.
- **Economía Virtual ("Piezas / Studs"):** Saldo inicial de 1.000 piezas, apuestas en Mus y Blackjack, recompensas en Solitarios y tienda de cosméticos (*Brick Shop*) para desbloquear dorsos, tapetes y aspectos.
- **Sintetizador de Audio Web Audio API:** Efectos nativos de encaje de bloques plásticos (*clack*), cartas y fanfarrias.
- **Zero-Placeholders:** Todo el código y los gráficos vectoriales SVG están completamente implementados.

---

## 🛠️ Stack Tecnológico

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router) + [React 19](https://react.dev/)
- **Lenguaje:** TypeScript estricto
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/) con tokens de texturas plásticas, biseles y studs
- **Animaciones:** [Framer Motion](https://www.framer.com/motion/) + `canvas-confetti`
- **Estado Global:** [Zustand](https://github.com/pmndrs/zustand) con persistencia en `localStorage`
- **Iconos:** Lucide Icons + Iconografía SVG personalizada

---

## 🚀 Instalación y Ejecución Local

1. Clonar el repositorio:
   ```bash
   git clone git@github.com:alzatetorres-lang/Juego_Cartas.git
   cd Juego_Cartas
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Abrir en el navegador:
   ```
   http://localhost:3000
   ```

5. Para compilar la versión de producción:
   ```bash
   npm run build
   npm start
   ```

---

## 📄 Licencia

Este proyecto y todo su arte gráfico vectorial son originales y 100% libres de derechos de autor.
