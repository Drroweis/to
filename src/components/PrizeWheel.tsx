import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bitcoin, DollarSign, Star, Wallet } from 'lucide-react';
import useGameStore from '../store/gameStore';
import useAuthStore from '../store/authStore';
import { endpoints } from '../config/api';
import SpinCounter from './SpinCounter';
import WheelIndicator from './wheel/WheelIndicator';
import PrizeSector from './wheel/PrizeSector';
import type { Prize } from '../types/game';

const PRIZES: Prize[] = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', color: 'text-orange-500', icon: Bitcoin },
  { id: 'major', name: 'Major', symbol: 'MAJOR', color: 'text-yellow-500', icon: Star },
  { id: 'usdt', name: 'Tether', symbol: 'USDT', color: 'text-green-500', icon: DollarSign },
  { id: 'usdc', name: 'USD Coin', symbol: 'USDC', color: 'text-blue-500', icon: DollarSign },
  { id: 'star', name: 'Star', symbol: 'STAR', color: 'text-purple-500', icon: Star },
  { id: 'gbd', name: 'GBD', symbol: 'GBD', color: 'text-red-500', icon: DollarSign },
  { id: 'not', name: 'NOT', symbol: 'NOT', color: 'text-gray-500', icon: Star },
];

const PrizeWheel: React.FC = () => {
  const { user } = useAuthStore();
  const { spinsLeft, isSpinning, setSpinning, decrementSpins, setLastPrize } = useGameStore();
  const [rotation, setRotation] = useState(0);
  const [showWallet, setShowWallet] = useState(false);
  const [winAmount, setWinAmount] = useState<number | null>(null);
  const [winSymbol, setWinSymbol] = useState<string | null>(null);

  const spinWheel = async () => {
    if (isSpinning || spinsLeft <= 0) return;
    
    setSpinning(true);
    setWinAmount(null);
    setWinSymbol(null);
    
    const randomRotations = Math.floor(Math.random() * 8) + 8;
    const randomPrizeIndex = Math.floor(Math.random() * PRIZES.length);
    const finalRotation = rotation + (360 * randomRotations) + (360 / PRIZES.length * randomPrizeIndex);
    
    setRotation(finalRotation);
    
    try {
      const response = await fetch(endpoints.game.spin, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) throw new Error('Spin failed');
      
      const data = await response.json();
      decrementSpins();
      
      setTimeout(() => {
        setSpinning(false);
        setLastPrize(PRIZES[randomPrizeIndex]);
        setWinAmount(data.prize.amount);
        setWinSymbol(data.prize.type);
      }, 5000);
    } catch (error) {
      setSpinning(false);
      console.error('Spin error:', error);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 px-4 max-w-7xl mx-auto w-full">
      {/* Wallet Toggle */}
      <motion.button
        onClick={() => setShowWallet(!showWallet)}
        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-gray-800 to-gray-700 rounded-full hover:from-gray-700 hover:to-gray-600 transition-all shadow-lg"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Wallet className="w-5 h-5" />
        <span className="font-medium">{showWallet ? 'Hide Wallet' : 'Show Wallet'}</span>
      </motion.button>

      {/* Wallet Display */}
      <AnimatePresence>
        {showWallet && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl w-full backdrop-blur-lg border border-gray-700/50"
          >
            {Object.entries(user?.walletBalances || {}).map(([symbol, balance]) => {
              const prize = PRIZES.find(p => p.symbol === symbol);
              if (!prize) return null;
              
              const IconComponent = prize.icon;
              return (
                <motion.div
                  key={symbol}
                  className="flex items-center space-x-3 p-4 bg-gray-800/50 rounded-xl backdrop-blur-sm border border-gray-700/30 hover:border-gray-600/50 transition-all"
                  whileHover={{ scale: 1.02, translateY: -2 }}
                >
                  <div className={`p-2 rounded-lg ${prize.color.replace('text-', 'bg-').replace('500', '500/20')}`}>
                    <IconComponent className={`w-6 h-6 ${prize.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 font-medium">{symbol}</p>
                    <p className="font-bold text-white">{Number(balance).toFixed(8)}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prize Wheel Container */}
      <div className="relative w-full max-w-[min(80vmin,600px)] aspect-square">
        <WheelIndicator />
        
        {/* Wheel */}
        <motion.div
          className="absolute w-full h-full rounded-full bg-gradient-to-br from-gray-800 to-gray-900 shadow-2xl border-4 border-gray-700/50 backdrop-blur-sm"
          animate={{ rotate: rotation }}
          transition={{ 
            duration: 5,
            ease: "easeOut",
            type: "spring",
            damping: 20
          }}
        >
          {PRIZES.map((prize, index) => (
            <PrizeSector 
              key={prize.id}
              prize={prize}
              index={index}
              totalPrizes={PRIZES.length}
            />
          ))}
        </motion.div>
        
        {/* Spin Button */}
        <motion.button
          onClick={spinWheel}
          disabled={isSpinning || spinsLeft <= 0}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                   bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-8 rounded-full
                   hover:from-green-600 hover:to-green-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed
                   z-10 transition-all shadow-lg hover:shadow-xl min-w-[120px]
                   disabled:opacity-50"
          whileHover={{ scale: spinsLeft > 0 && !isSpinning ? 1.1 : 1 }}
          whileTap={{ scale: spinsLeft > 0 && !isSpinning ? 0.9 : 1 }}
        >
          {isSpinning ? 'Spinning...' : 'SPIN'}
        </motion.button>
      </div>

      {/* Prize Reveal */}
      <AnimatePresence>
        {winAmount !== null && winSymbol !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mt-8 p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-xl text-center max-w-md w-full backdrop-blur-lg border border-gray-700/50"
          >
            <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
              Congratulations! 🎉
            </h3>
            <p className="text-lg">
              You won{' '}
              <span className="font-bold text-green-400">{winAmount}</span>{' '}
              <span className={`font-bold ${PRIZES.find(p => p.symbol === winSymbol)?.color || ''}`}>
                {winSymbol}
              </span>
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spins Counter */}
      <SpinCounter />
    </div>
  );
};

export default PrizeWheel;