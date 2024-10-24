export interface Prize {
  id: string;
  name: string;
  symbol: string;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface UserState {
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