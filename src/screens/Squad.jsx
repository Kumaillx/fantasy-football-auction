import React from 'react';
import { motion } from 'framer-motion';
import { useAppState } from '../context/AppContext';
import { useUser } from '../context/UserContext';
import { COUNTRY_FLAGS } from '../dataStore';

const Squad = () => {
  const { currentUser } = useUser();
  const { users } = useAppState();

  const user = users.find(u => u.name === currentUser);
  const players = user?.playersOwned || [];

  const getPlayersByPosition = (position) => {
    return players.filter(p => p.position === position);
  };

  const PlayerCard = ({ player, delay }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: 'spring', stiffness: 150 }}
      className="flex flex-col items-center"
    >
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/15 to-white/5 flex items-center justify-center text-xl border border-white/15 shadow-lg mb-2">
        {COUNTRY_FLAGS[player.country] || '⚽'}
      </div>
      <p className="text-white text-xs font-medium text-center truncate w-20">{player.playerName}</p>
      <p className="text-neon text-xs font-bold">{player.price} CR</p>
    </motion.div>
  );

  const EmptySlot = () => (
    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-dashed border-white/10 flex items-center justify-center mb-2">
      <span className="text-white/20 text-xs">+</span>
    </div>
  );

  const PositionRow = ({ title, players, position, delayStart = 0 }) => (
    <div className="mb-6">
      <div className="flex items-center justify-center gap-2 mb-3">
        <div className="h-px flex-1 bg-white/10" />
        <p className="text-white/40 text-xs font-medium uppercase tracking-wider">{title}</p>
        <div className="h-px flex-1 bg-white/10" />
      </div>
      <div className="flex justify-center gap-4 flex-wrap">
        {players.length > 0 ? (
          players.map((p, i) => <PlayerCard key={p.id} player={p} delay={delayStart + i * 0.1} />)
        ) : (
          <EmptySlot />
        )}
      </div>
    </div>
  );

  const gk = getPlayersByPosition('Goalkeeper');
  const defs = getPlayersByPosition('Defender');
  const mids = getPlayersByPosition('Midfielder');
  const fwds = getPlayersByPosition('Forward');

  return (
    <div className="min-h-screen bg-dark p-4 pb-24">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-8 pb-4"
      >
        <h1 className="text-2xl font-bold text-white">👥 Squad</h1>
        <p className="text-white/40 text-sm mt-1">Formation: 4-3-3</p>
      </motion.div>

      {/* Pitch Background */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative pitch-bg rounded-3xl border border-white/5 p-6 overflow-hidden"
      >
        {/* Pitch markings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-full h-px bg-white/5" />
        </div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-16 border-b border-l border-r border-white/10 rounded-b-full" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-16 border-t border-l border-r border-white/10 rounded-t-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border border-white/10 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white/20 rounded-full" />

        {/* Players */}
        <div className="relative z-10">
          <PositionRow title="Forwards" players={fwds} position="Forward" delayStart={0.3} />
          <PositionRow title="Midfielders" players={mids} position="Midfielder" delayStart={0.6} />
          <PositionRow title="Defenders" players={defs} position="Defender" delayStart={0.9} />
          <PositionRow title="Goalkeeper" players={gk} position="Goalkeeper" delayStart={1.2} />
        </div>
      </motion.div>

      {/* Bench */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-6"
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🪑</span>
          <h3 className="text-white font-semibold">Bench</h3>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {players.length > 11 ? (
            players.slice(11).map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="glass-card p-3 min-w-[120px] flex flex-col items-center"
              >
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-lg mb-2">
                  {COUNTRY_FLAGS[p.country] || '⚽'}
                </div>
                <p className="text-white text-xs font-medium text-center truncate w-full">{p.playerName}</p>
                <p className="text-neon text-xs">{p.price} CR</p>
              </motion.div>
            ))
          ) : (
            <p className="text-white/20 text-sm">No players on bench</p>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Squad;
