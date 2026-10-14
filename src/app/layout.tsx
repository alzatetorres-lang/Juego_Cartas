import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BrickDeck 2D | Baraja Española de Bloques de Construcción',
  description:
    'Juego web modular 2D de cartas de la baraja española con estética de bloques de juguete. Incluye Mus, Solitario Klondike, Solitario Spider y Blackjack con bots IA locales, tutorial guiado interactivo y economía virtual.',
  keywords: [
    'mus',
    'solitario',
    'spider',
    'blackjack',
    'baraja española',
    'bloques',
    'juegos de cartas',
    'toy brick',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-amber-500 selection:text-slate-950">
        <main className="min-h-screen flex flex-col justify-between">
          {children}
        </main>
      </body>
    </html>
  );
}
