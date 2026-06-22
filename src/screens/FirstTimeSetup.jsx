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
          <div className="relative">
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-3xl font-bold text-white text-center focus:outline-none focus:border-neon/50 focus:ring-2 focus:ring-neon/20 transition-all"
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-white/30 font-medium">CR</span>
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
