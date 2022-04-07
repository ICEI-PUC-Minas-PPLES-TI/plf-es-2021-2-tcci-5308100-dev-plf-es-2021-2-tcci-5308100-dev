import { useCallback, useEffect, useRef, useState } from 'react';
import ReactCanvasConfetti from 'react-canvas-confetti';

const useFireworksAnimation = () => {
  const refAnimationInstance = useRef<confetti.CreateTypes | null>(null);

  const getAnimationSettings = (originXA: number, originXB: number) => {
    return {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 0,
      particleCount: 150,
      origin: {
        x: randomInRange(originXA, originXB),
        y: Math.random() - 0.2,
      },
    };
  };

  const randomInRange = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  };

  const getInstance = useCallback((instance: confetti.CreateTypes | null) => {
    refAnimationInstance.current = instance;
  }, []);

  const nextTickAnimation = useCallback(() => {
    if (refAnimationInstance.current) {
      // refAnimationInstance.current(getAnimationSettings(0.5, 0.5));
      refAnimationInstance.current(getAnimationSettings(0.1, 0.3));
      refAnimationInstance.current(getAnimationSettings(0.7, 0.9));
    }
  }, []);

  const startAnimation = useCallback(() => {
    nextTickAnimation();
    setTimeout(nextTickAnimation, 200);

    setTimeout(nextTickAnimation, 800);
    setTimeout(nextTickAnimation, 1000);

    setTimeout(nextTickAnimation, 1600);
    setTimeout(nextTickAnimation, 1800);
  }, [nextTickAnimation]);

  return {
    fire: startAnimation,
    ReactCanvasConfetti: (
      <ReactCanvasConfetti
        refConfetti={getInstance}
        style={{
          position: 'fixed',
          pointerEvents: 'none',
          width: '100%',
          height: '100%',
          top: 0,
          left: 0,
        }}
      />
    ),
  };
};

export default useFireworksAnimation;
