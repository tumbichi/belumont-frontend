'use client';
import confetti from 'canvas-confetti';
import { PropsWithChildren, useEffect } from 'react';

export function ConfettiSideCannons({ children }: PropsWithChildren) {
  const triggerConfetti = () => {
    const end = Date.now() + 2000; //ms = 7 seconds
    // const colors = ['#a786ff', '#fd8bbc', '#eca184', '#f8deb1'];
    // Pastel vibrante
    // const colors = ['#FFD7F1', '#A7E9AF', '#FFE5B4', '#C5D8FF'];
    // Tropical
    // const colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF'];
    // Calido terroso
    // const colors = ['#FFB703', '#FB8500', '#E09F3E', '#E36414'];
    // Elegancia moderna
    const colors = ['#8896F6', '#FFB4B4', '#FCE77D', '#A0E4CB'];
    // Arcoiris clasico
    // const colors = ['#FF595E', '#FFCA3A', '#8AC926', '#1982C4', '#6A4C93'];
    // Estilo marino
    // const colors = ['#56CFE1', '#72EFDD', '#F5CB5C', '#A7C4BC'];
    // Nordico pastel
    // const colors = ['#F2E9E4', '#C9ADA7', '#A44A3F', '#9A8C98'];

    const frame = () => {
      if (Date.now() > end) return;

      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.85 },
        colors: colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.85 },
        colors: colors,
      });

      requestAnimationFrame(frame);
    };

    frame();
  };

  useEffect(() => {
    triggerConfetti();
  });

  return <div className="relative">{children}</div>;
}
