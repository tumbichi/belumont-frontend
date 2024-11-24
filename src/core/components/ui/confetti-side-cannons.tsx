'use client';
import confetti from 'canvas-confetti';
import { PropsWithChildren, useEffect } from 'react';

export function ConfettiSideCannons({ children }: PropsWithChildren) {
  const triggerConfetti = () => {
    const end = Date.now() + 2000; //ms = 7 seconds
    // Tropical
    const colors = ['#FF6B6B', '#FFD93D', '#6BCB77', '#4D96FF'];

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
