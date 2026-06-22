import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../context/AppContext';
import { useUser } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
import { 
  resetLeague, 
  updateTournamentName, 
  updateDefaultDuration, 
  updateBudget,
  getCurrentTime,
  getPKTTime,
  setMockTimeOffset
} from '../dataStore';

const Settings = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useUser();
  const { tournamentName, users, mockTimeOffset } = useAppState();
  const { addToast } = useToast();

  const [newTournamentName, setNewTournamentName] = useState(tournamentName);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const [simTime, setSimTime] = useState(getCurrentTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setSimTime(getCurrentTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pktDate = getPKTTime(simTime);
  const formattedPktTime = pktDate.toLocaleTimeString('en-US', {
    timeZone: 'UTC',
    hour12: true,
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit'
  });
  const formattedPktDate = pktDate.toLocaleDateString('en-US', {
    timeZone: 'UTC',
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });

  const warpToTodayTime = (hours, minutes, seconds = 0) => {
    const nowReal = Date.now();
    const pktNow = getPKTTime(nowReal);
    const targetPkt = Date.UTC(
      pktNow.getUTCFullYear(),
      pktNow.getUTCMonth(),
      pktNow.getUTCDate(),
      hours - 5,
      minutes,
      seconds,
      0
    );
    const offset = targetPkt - nowReal;
    setMockTimeOffset(offset);
    addToast(`Time warped to ${hours > 12 ? hours - 12 : hours}:${String(minutes).padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'} PKT today!`, 'success');
  };

  const handleResetTime = () => {
    setMockTimeOffset(0);
    addToast('Simulated clock reset to local system time!', 'info');
  };

  const user = users.find(u => u.name === currentUser);

  const handleUpdateTournamentName = () => {
    updateTournamentName(newTournamentName);
    addToast('Tournament name updated!', 'success');
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
    <div className="min-h-screen bg-dark p-3 sm:p-4 pb-32 overflow-x-hidden">
      <div className="max-w-md mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-4 pb-2 sm:pt-8 sm:pb-4"
        >
          <h1 className="text-xl sm:text-2xl font-bold text-white">⚙️ Settings</h1>
          <p className="text-white/40 text-xs sm:text-sm mt-1">Manage your league</p>
        </motion.div>

        <div className="flex flex-col gap-3 sm:gap-4">
        {/* Time Simulation Panel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card p-4 sm:p-5 border-neon/30 bg-neon/5 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-neon/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div>
              <h2 className="text-white font-bold text-base flex items-center gap-2">
                ⏳ Time Travel Simulator
              </h2>
              <p className="text-white/40 text-xs mt-0.5">Test deadline, extension & limit rules</p>
            </div>
            {mockTimeOffset !== 0 && (
              <button
                onClick={handleResetTime}
                className="bg-white/10 text-white/80 hover:bg-white/20 px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all border border-white/15 active:scale-95"
              >
                Reset Clock
              </button>
            )}
          </div>

          <div className="bg-dark/60 rounded-xl p-4 border border-white/5 mb-4 text-center relative z-10">
            <p className="text-white/30 text-[10px] uppercase font-bold tracking-wider">Simulated Pakistan Time (PKT)</p>
            <p className="text-neon font-mono font-bold text-3xl my-1">{formattedPktTime}</p>
            <p className="text-white/60 text-xs font-semibold">{formattedPktDate}</p>
            {mockTimeOffset !== 0 && (
              <span className="inline-block mt-2 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[9px] font-bold uppercase tracking-wide">
                Clock Manipulated (Time Travel Mode)
              </span>
            )}
          </div>

          <p className="text-white/50 text-xs font-semibold mb-2 relative z-10">Warp Presets (Today):</p>
          <div className="grid grid-cols-2 gap-2 relative z-10">
            <button
              onClick={() => warpToTodayTime(10, 0)}
              className="py-2.5 px-3 rounded-lg text-left bg-white/5 hover:bg-white/10 text-xs font-medium text-white border border-white/5 transition-all active:scale-95 whitespace-normal break-words"
            >
              ☀️ 10:00 AM PKT
              <span className="block text-[9px] text-white/40 font-normal mt-0.5">Regular bidding opens</span>
            </button>
            <button
              onClick={() => warpToTodayTime(16, 45)}
              className="py-2.5 px-3 rounded-lg text-left bg-white/5 hover:bg-white/10 text-xs font-medium text-white border border-white/5 transition-all active:scale-95 whitespace-normal break-words"
            >
              ⏳ 4:45 PM PKT
              <span className="block text-[9px] text-white/40 font-normal mt-0.5">Extension window (20m left)</span>
            </button>
            <button
              onClick={() => warpToTodayTime(17, 15)}
              className="py-2.5 px-3 rounded-lg text-left bg-white/5 hover:bg-white/10 text-xs font-medium text-white border border-white/5 transition-all active:scale-95 whitespace-normal break-words"
            >
              🛑 5:15 PM PKT
              <span className="block text-[9px] text-white/40 font-normal mt-0.5">Cooling period (starts blocked)</span>
            </button>
            <button
              onClick={() => warpToTodayTime(17, 19, 30)}
              className="py-2.5 px-3 rounded-lg text-left bg-white/5 hover:bg-white/10 text-xs font-medium text-white border border-white/5 transition-all active:scale-95 whitespace-normal break-words"
            >
              🚨 5:19:30 PM PKT
              <span className="block text-[9px] text-white/40 font-normal mt-0.5">Last-Minute Protection</span>
            </button>
            <button
              onClick={() => warpToTodayTime(17, 35)}
              className="col-span-2 py-2.5 px-3 rounded-lg text-left bg-white/5 hover:bg-white/10 text-xs font-medium text-white border border-white/5 transition-all active:scale-95 whitespace-normal break-words"
            >
              ➡️ 5:35 PM PKT (Next-Day Cutoff)
              <span className="block text-[9px] text-white/40 font-normal mt-0.5">Starts count towards tomorrow's limit</span>
            </button>
          </div>
        </motion.div>

        {/* Tournament Name */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 sm:p-5"
        >
          <label className="block text-white/50 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">Tournament Name</label>
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={newTournamentName}
              onChange={(e) => setNewTournamentName(e.target.value)}
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-white focus:outline-none focus:border-neon/50"
            />
            <button
              onClick={handleUpdateTournamentName}
              className="bg-neon/10 text-neon px-4 rounded-xl font-medium text-sm border border-neon/30 shrink-0"
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
            className="w-full glass-card p-4 sm:p-5 flex items-center gap-3 text-left hover:bg-white/5 transition-all"
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
            className="w-full glass-card p-4 sm:p-5 flex items-center gap-3 text-left border-red-500/20 hover:bg-red-500/5 transition-all"
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
            className="w-full glass-card p-4 sm:p-5 flex items-center gap-3 text-left hover:bg-white/5 transition-all"
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
    </div>
  );
};

export default Settings;
