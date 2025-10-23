/**
 * useCelebration Hook
 * Provides easy access to celebration animations for achievements
 * 
 * Usage:
 * const { celebrate } = useCelebration();
 * celebrate('Achievement Unlocked!', 'You completed your first match');
 */

import { useState, useCallback } from 'react';

interface CelebrationState {
  visible: boolean;
  title: string;
  message?: string;
}

export const useCelebration = () => {
  const [celebration, setCelebration] = useState<CelebrationState>({
    visible: false,
    title: '',
    message: undefined,
  });

  const celebrate = useCallback((title: string, message?: string, duration?: number) => {
    setCelebration({
      visible: true,
      title,
      message,
    });

    // Auto-hide after duration (default 3 seconds)
    const timeout = setTimeout(() => {
      setCelebration(prev => ({ ...prev, visible: false }));
    }, duration || 3000);

    return () => clearTimeout(timeout);
  }, []);

  const hideCelebration = useCallback(() => {
    setCelebration(prev => ({ ...prev, visible: false }));
  }, []);

  return {
    celebration,
    celebrate,
    hideCelebration,
  };
};
