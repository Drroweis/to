import { create } from 'zustand';
import type { Prize } from '../types/game';

interface GameState {
  spinsLeft: number;
  maxSpins: number;
  isSpinning: boolean;
  recoveryTime: number | null;
  lastPrize: Prize | null;
  setSpinning: (isSpinning: boolean) => void;
  setLastPrize: (prize: Prize | null) => void;
  decrementSpins: () => void;
  setRecoveryTime: (time: number | null) => void;
  resetSpins: () => void;
}

const useGameStore = create<GameState>((set) => ({
  spinsLeft: 10,
  maxSpins: 10,
  isSpinning: false,
  recoveryTime: null,
  lastPrize: null,
  setSpinning: (isSpinning) => set({ isSpinning }),
  setLastPrize: (prize) => set({ lastPrize: prize }),
  decrementSpins: () => 
    set((state) => ({ 
      spinsLeft: Math.max(0, state.spinsLeft - 1),
      recoveryTime: state.spinsLeft <= 1 ? Date.now() + 5 * 60 * 1000 : null
    })),
  setRecoveryTime: (time) => set({ recoveryTime: time }),
  resetSpins: () => set({ spinsLeft: 10, recoveryTime: null }),
}));

export default useGameStore;