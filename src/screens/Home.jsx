import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../context/AppContext';
import { useUser } from '../context/UserContext';
import { COUNTRY_FLAGS } from '../dataStore';

const Home = () => {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const { users, activityFeed, tournamentName } = useAppState();
  const [animatedBudget, setAnimatedBudget] = useState(0);

  const user = users.find(u => u.name === currentUser);
  const sortedUsers = [...users].sort((a, b) => b.budget - a.budget);

  useEffect(() => {
    if (user) {
      const target = user.budget;
      const duration = 1000;
      const start = animatedBudget;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setAnimatedBudget(Math.round(start + (target - start) * easeOut));
        if (progress < 1) requestAnimationFrame(animate);
      };

      requestAnimationFrame(animate);
    }
  }, [user?.budget]);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'auction_started': return '⚡';
      case 'bid': return '🔥';
      case 'auction_won': return '🏆';
      default: return '•';
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'auction_started': return 'text-blue-400';
      case 'bid': return 'text-orange-400';
      case 'auction_won': return 'text-neon';
      default: return 'text-white/40';
    }
  };

  if (!user) return null;

  const budgetPercent = (user.budget / 150) * 100;

  return (
    <div className="min-h-screen bg-dark p-4 pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-8 pb-4"
      >
        <h1 className="text-lg font-semibold text-white/60">{tournamentName}</h1>
      </motion.div>

      {/* User Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6 mb-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-neon/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

        <div className="relative z-10">
          <p className="text-white/50 text-sm mb-1">Welcome back,</p>
          <h2 className="text-2xl font-bold text-white mb-4">{user.name}</h2>

          <div className="flex items-end gap-2 mb-3">
            <span className="text-4xl font-bold gradient-text">{animatedBudget}</span>
            <span className="text-white/40 font-medium mb-1">CR</span>
          </div>
          <p className="text-white/30 text-xs mb-3">Budget Left</p>

          {/* Progress bar */}
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${budgetPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-neon to-emerald-400 rounded-full"
            />
          </div>
        </div>
      </motion.div>

      {/* Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">💰</span>
          <h3 className="text-white font-semibold">Budgets</h3>
        </div>

        <div className="flex flex-col gap-3">
          <AnimatePresence>
            {sortedUsers.map((u, index) => (
              <motion.div
                key={u.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`glass-card p-4 flex items-center gap-3 ${u.name === currentUser ? 'neon-border' : ''}`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold ${
                  index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                  index === 1 ? 'bg-gray-400/20 text-gray-300' :
                  index === 2 ? 'bg-amber-600/20 text-amber-500' :
                  'bg-white/5 text-white/40'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">{u.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">{u.budget} <span className="text-white/40 text-xs font-normal">CR</span></p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Activity Feed */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">📢</span>
          <h3 className="text-white font-semibold">Live Activity</h3>
        </div>

        <div className="flex flex-col gap-2">
          <AnimatePresence>
            {activityFeed.slice(0, 8).map((activity) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                exit={{ opacity: 0, x: 20, height: 0 }}
                className="glass-card p-3 flex items-center gap-3"
              >
                <span className="text-lg">{getActivityIcon(activity.type)}</span>
                <p className={`text-sm ${getActivityColor(activity.type)}`}>
                  {activity.message}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
          {activityFeed.length === 0 && (
            <div className="glass-card p-6 text-center">
              <p className="text-white/30 text-sm">No activity yet. Start an auction!</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Floating Start Auction Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate('/start-auction')}
        className="fixed bottom-24 right-4 w-14 h-14 rounded-full bg-gradient-to-r from-neon to-emerald-500 flex items-center justify-center shadow-lg shadow-neon/30 floating-btn z-40"
      >
        <svg className="w-6 h-6 text-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" />
        </svg>
      </motion.button>
    </div>
  );
};

export default Home;
