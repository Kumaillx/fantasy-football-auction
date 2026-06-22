import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../context/AppContext';
import { useUser } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
import { resetLeague, updateTournamentName, updateDefaultDuration, updateBudget } from '../dataStore';

const Settings = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useUser();
  const { tournamentName, defaultDuration, users } = useAppState();
  const { addToast } = useToast();

  const [newTournamentName, setNewTournamentName] = useState(tournamentName);
  const [newDuration, setNewDuration] = useState(defaultDuration);
  const [newBudget, setNewBudget] = useState(150);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const user = users.find(u => u.name === currentUser);

  const handleUpdateTournamentName = () => {
    updateTournamentName(newTournamentName);
    addToast('Tournament name updated!', 'success');
  };

  const handleUpdateDuration = () => {
    updateDefaultDuration(newDuration);
    addToast('Default duration updated!', 'success');
  };

  const handleUpdateBudget = () => {
    updateBudget(currentUser, newBudget);
    addToast('Starting budget updated!', 'success');
  };

  const handleReset = () => {
    resetLeague();
    addToast('League has been reset!', 'warning');
    setShowResetConfirm(false);
    logout();
    navigate('/');
  };

  const handleExport = () => {
    const data = {
      users,
      tournamentName,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fantasy-football-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Results exported!', 'success');
  };

  return (
    <div className="min-h-screen bg-dark p-4 pb-24">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-8 pb-4"
      >
        <h1 className="text-2xl font-bold text-white">⚙️ Settings</h1>
        <p className="text-white/40 text-sm mt-1">Manage your league</p>
      </motion.div>

      <div className="flex flex-col gap-4">
        {/* Tournament Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-5"
        >
          <label className="block text-white/50 text-sm font-medium mb-2">Tournament Name</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newTournamentName}
              onChange={(e) => setNewTournamentName(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon/50"
            />
            <button
              onClick={handleUpdateTournamentName}
              className="bg-neon/10 text-neon px-4 rounded-xl font-medium text-sm border border-neon/30"
            >
              Save
            </button>
          </div>
        </motion.div>

        {/* Default Duration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card p-5"
        >
          <label className="block text-white/50 text-sm font-medium mb-2">Default Auction Duration (seconds)</label>
          <div className="flex gap-2 w-full">
            <div className="flex-1 relative flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-2">
              <input
                type="number"
                value={newDuration}
                onChange={(e) => setNewDuration(Number(e.target.value))}
                className="flex-1 bg-transparent border-none text-white focus:outline-none focus:ring-0"
              />
              <div className="flex flex-col gap-0.5 mr-2 select-none">
                <button
                  type="button"
                  onClick={() => setNewDuration(prev => Math.min(600, prev + 10))}
                  className="w-6 h-3.5 rounded bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 active:scale-95 transition-all text-[6px]"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => setNewDuration(prev => Math.max(10, prev - 10))}
                  className="w-6 h-3.5 rounded bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 active:scale-95 transition-all text-[6px]"
                >
                  ▼
                </button>
              </div>
              <span className="text-white/30 text-xs font-medium">sec</span>
            </div>
            <button
              onClick={handleUpdateDuration}
              className="bg-neon/10 text-neon px-4 rounded-xl font-medium text-sm border border-neon/30"
            >
              Save
            </button>
          </div>
        </motion.div>

        {/* Starting Budget */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-5"
        >
          <label className="block text-white/50 text-sm font-medium mb-2">Starting Budget (CR)</label>
          <div className="flex gap-2 w-full">
            <div className="flex-1 relative flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-2">
              <input
                type="number"
                value={newBudget}
                onChange={(e) => setNewBudget(Number(e.target.value))}
                className="flex-1 bg-transparent border-none text-white focus:outline-none focus:ring-0"
              />
              <div className="flex flex-col gap-0.5 mr-2 select-none">
                <button
                  type="button"
                  onClick={() => setNewBudget(prev => Math.min(500, prev + 10))}
                  className="w-6 h-3.5 rounded bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 active:scale-95 transition-all text-[6px]"
                >
                  ▲
                </button>
                <button
                  type="button"
                  onClick={() => setNewBudget(prev => Math.max(50, prev - 10))}
                  className="w-6 h-3.5 rounded bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 active:scale-95 transition-all text-[6px]"
                >
                  ▼
                </button>
              </div>
              <span className="text-white/30 text-xs font-medium">CR</span>
            </div>
            <button
              onClick={handleUpdateBudget}
              className="bg-neon/10 text-neon px-4 rounded-xl font-medium text-sm border border-neon/30"
            >
              Save
            </button>
          </div>
        </motion.div>

        {/* Export Results */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <button
            onClick={handleExport}
            className="w-full glass-card p-5 flex items-center gap-3 text-left hover:bg-white/5 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-neon/10 flex items-center justify-center text-lg border border-neon/20">
              📊
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">Export Results</p>
              <p className="text-white/40 text-xs">Download league data as JSON</p>
            </div>
            <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </motion.div>

        {/* Reset League */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full glass-card p-5 flex items-center gap-3 text-left border-red-500/20 hover:bg-red-500/5 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-lg border border-red-500/20">
              🔄
            </div>
            <div className="flex-1">
              <p className="text-red-400 font-medium">Reset League</p>
              <p className="text-white/40 text-xs">Clear all data and start fresh</p>
            </div>
            <svg className="w-5 h-5 text-red-400/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full glass-card p-5 flex items-center gap-3 text-left hover:bg-white/5 transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg border border-white/10">
              👋
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">Switch User</p>
              <p className="text-white/40 text-xs">Log out and select another profile</p>
            </div>
            <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </motion.div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card p-6 w-full max-w-sm"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-3xl mx-auto mb-4 border border-red-500/20">
                ⚠️
              </div>
              <h3 className="text-white font-bold text-lg mb-2">Reset League?</h3>
              <p className="text-white/40 text-sm">This will erase all players, auctions, and budgets. This cannot be undone.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-3 rounded-xl bg-white/5 text-white font-medium border border-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-3 rounded-xl bg-red-500/20 text-red-400 font-medium border border-red-500/30"
              >
                Reset
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Settings;
