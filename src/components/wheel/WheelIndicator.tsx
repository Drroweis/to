import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const WheelIndicator: React.FC = () => {
  return (
    <motion.div
      className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-20"
      animate={{ y: [0, 5, 0] }}
      transition={{ 
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <div className="relative">
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-8">
          <div className="w-full h-full bg-gradient-to-b from-green-500 to-green-600 rounded-full shadow-lg flex items-center justify-center">
            <ChevronDown className="w-5 h-5 text-white" />
          </div>
        </div>
        <div className="w-4 h-4 bg-green-500 rotate-45 transform origin-center shadow-lg" />
      </div>
    </motion.div>
  );
};

export default WheelIndicator;