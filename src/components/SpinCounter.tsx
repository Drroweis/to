import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../store/gameStore';

const SpinCounter: React.FC = () => {
  const { spinsLeft, maxSpins, recoveryTime, resetSpins } = useGameStore();
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (recoveryTime && spinsLeft === 0) {
      interval = setInterval(() => {
        const now = Date.now();
        const remaining = Math.max(0, recoveryTime - now);

        if (remaining <= 0) {
          resetSpins();
          setTimeLeft('');
        } else {
          const minutes = Math.floor(remaining / 60000);
          const seconds = Math.floor((remaining % 60000) / 1000);
          setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [recoveryTime, spinsLeft, resetSpins]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center space-y-2 bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-xl shadow-lg backdrop-blur-sm border border-gray-700/50"
    >
      <motion.div 
        className="flex items-center justify-center space-x-2"
        animate={{ scale: spinsLeft === 0 ? [1, 1.1, 1] : 1 }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-lg font-semibold text-gray-400">Lucky Draw:</span>
        <div className="flex items-center space-x-1">
          <span className="text-lg font-bold text-green-400">{spinsLeft}</span>
          <span className="text-gray-500">/</span>
          <span className="text-lg font-bold text-gray-500">{maxSpins}</span>
        </div>
      </motion.div>
      
      <AnimatePresence>
        {timeLeft && spinsLeft === 0 && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-yellow-400 text-sm font-medium"
          >
            Recharging in {timeLeft}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SpinCounter;