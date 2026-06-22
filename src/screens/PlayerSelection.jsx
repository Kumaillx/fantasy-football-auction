import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { USERS } from '../dataStore';

const PlayerSelection = () => {
  const navigate = useNavigate();
  const { login } = useUser();

  const handleSelect = (name) => {
    login(name);
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-dark p-6 flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10 mt-8"
      >
        <h1 className="text-2xl font-bold text-white mb-2">Who are you?</h1>
        <p className="text-white/40 text-sm">Select your profile to continue</p>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-4 flex-1"
      >
        {USERS.map((name, index) => (
          <motion.button
            key={name}
            variants={item}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleSelect(name)}
            className="glass-card glass-card-hover p-5 flex items-center gap-4 text-left w-full"
          >
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-neon/20 to-neon/5 flex items-center justify-center text-2xl border border-neon/20">
              ⚽
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold text-lg">{name}</h3>
              <p className="text-white/40 text-xs">Manager {index + 1}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
              <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default PlayerSelection;
