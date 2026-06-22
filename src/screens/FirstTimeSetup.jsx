import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useAppState } from '../context/AppContext';
import { updateBudget } from '../dataStore';

const FirstTimeSetup = () => {
  const navigate = useNavigate();
  const { currentUser, completeSetup } = useUser();
  const { users } = useAppState();
  const [budget, setBudget] = useState(150);

  const user = users.find(u => u.name === currentUser);

  const handleSubmit = () => {
    updateBudget(currentUser, budget);
    completeSetup();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-dark p-6 flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 100 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-neon/20 to-neon/5 flex items-center justify-center text-4xl mx-auto mb-4 border border-neon/20">
            💰
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Welcome, {currentUser}!</h1>
          <p className="text-white/40 text-sm">Set up your league</p>
        </div>

        <div className="glass-card p-6 mb-6">
          <label className="block text-white/60 text-sm font-medium mb-3">
            Enter your starting budget
          </label>
          <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="flex-1 bg-transparent border-none text-3xl font-bold text-white focus:outline-none focus:ring-0 text-center"
            />
            <div className="flex flex-col gap-1 mr-3 select-none">
              <button
                type="button"
                onClick={() => setBudget(prev => prev + 10)}
                className="w-8 h-5 rounded bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 active:scale-95 transition-all text-[8px]"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => setBudget(prev => Math.max(50, prev - 10))}
                className="w-8 h-5 rounded bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 active:scale-95 transition-all text-[8px]"
              >
                ▼
              </button>
            </div>
            <span className="text-white/30 font-medium">CR</span>
          </div>
          <p className="text-center text-white/30 text-xs mt-3">Default: 150 CR</p>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          className="w-full bg-gradient-to-r from-neon to-emerald-500 text-dark font-bold py-4 rounded-2xl text-lg shadow-lg shadow-neon/20"
        >
          Start League
        </motion.button>
      </motion.div>
    </div>
  );
};

export default FirstTimeSetup;
