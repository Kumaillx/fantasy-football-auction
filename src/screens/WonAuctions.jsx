import React from 'react';
import { motion } from 'framer-motion';
import { useAppState } from '../context/AppContext';
import { useUser } from '../context/UserContext';
import { COUNTRY_FLAGS, getFlagUrl } from '../dataStore';

const WonAuctions = () => {
  const { currentUser } = useUser();
  const { users, playersWon } = useAppState();

  const user = users.find(u => u.name === currentUser);
  const myPlayers = playersWon.filter(p => p.owner === currentUser);
  const totalSpent = myPlayers.reduce((sum, p) => sum + p.price, 0);

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-dark p-4 pb-24">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-8 pb-4"
      >
        <h1 className="text-2xl font-bold text-white">🏆 Won</h1>
        <p className="text-white/40 text-sm mt-1">Your purchased players</p>
      </motion.div>

      {/* Stats Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-3 mb-6"
      >
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-white">{myPlayers.length}</p>
          <p className="text-white/40 text-xs mt-1">Players</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-neon">{totalSpent}</p>
          <p className="text-white/40 text-xs mt-1">Spent</p>
        </div>
        <div className="glass-card p-4 text-center">
          <p className="text-2xl font-bold text-white">{user?.budget || 0}</p>
          <p className="text-white/40 text-xs mt-1">Left</p>
        </div>
      </motion.div>

      {/* Players List */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-3"
      >
        {myPlayers.map((player) => (
          <motion.div
            key={player.id}
            variants={item}
            whileTap={{ scale: 0.98 }}
            className="glass-card p-4 flex items-center gap-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-2xl border border-white/10 overflow-hidden">
              {getFlagUrl(player.country) ? (
                <img 
                  src={getFlagUrl(player.country)} 
                  alt={player.country} 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <span>{COUNTRY_FLAGS[player.country] || '🏳️'}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold truncate">{player.playerName}</h3>
              <p className="text-white/40 text-sm">{player.position} • {player.country}</p>
            </div>
            <div className="text-right">
              <p className="text-neon font-bold text-lg">{player.price} <span className="text-white/40 text-xs font-normal">CR</span></p>
              <p className="text-white/30 text-xs">Bought</p>
            </div>
          </motion.div>
        ))}

        {myPlayers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-8 text-center"
          >
            <div className="text-4xl mb-3">🛒</div>
            <p className="text-white/40 text-sm">No players won yet</p>
            <p className="text-white/20 text-xs mt-1">Win auctions to build your squad!</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default WonAuctions;
