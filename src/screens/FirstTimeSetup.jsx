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
          <label className="block text-white/60 text-sm font-medium mb-3 text-center">
            Enter your starting budget
          </label>
          <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-2">
            <button
              type="button"
              onClick={() => setBudget(prev => Math.max(50, prev - 10))}
              className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 active:scale-95 transition-all text-xl font-bold select-none shrink-0"
            >
              −
            </button>
            <div className="flex items-baseline justify-center gap-1 min-w-0 flex-1">
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-24 bg-transparent border-none text-3xl font-black text-white focus:outline-none focus:ring-0 text-center p-0"
              />
              <span className="text-white/30 font-bold text-sm select-none">CR</span>
            </div>
            <button
              type="button"
              onClick={() => setBudget(prev => prev + 10)}
              className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 active:scale-95 transition-all text-xl font-bold select-none shrink-0"
            >
              +
            </button>
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
