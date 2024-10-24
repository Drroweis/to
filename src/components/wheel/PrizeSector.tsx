import React from 'react';
import { motion } from 'framer-motion';
import type { Prize } from '../../types/game';

interface PrizeSectorProps {
  prize: Prize;
  index: number;
  totalPrizes: number;
}

const PrizeSector: React.FC<PrizeSectorProps> = ({ prize, index, totalPrizes }) => {
  const IconComponent = prize.icon;
  const angle = 360 / totalPrizes;
  const rotation = angle * index;

  return (
    <div
      className="absolute w-full h-full"
      style={{
        transform: `rotate(${rotation}deg)`,
        transformOrigin: '50% 50%',
      }}
    >
      <div className="relative h-full">
        <motion.div 
          className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center 
                     bg-gray-800/90 backdrop-blur-sm px-3 py-2 rounded-xl shadow-lg transform -rotate-90
                     border border-gray-700/50"
          whileHover={{ scale: 1.1 }}
        >
          <div className={`p-1.5 rounded-lg ${prize.color.replace('text-', 'bg-').replace('500', '500/20')}`}>
            <IconComponent className={`w-5 h-5 ${prize.color}`} />
          </div>
          <span className="text-sm font-bold mt-1">{prize.symbol}</span>
        </motion.div>
      </div>
    </div>
  );
};

export default PrizeSector;