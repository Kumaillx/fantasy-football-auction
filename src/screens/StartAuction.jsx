import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useAppState } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { startAuction, COUNTRY_FLAGS, POSITIONS, CLUBS } from '../dataStore';

const DURATION_OPTIONS = [
  { label: '30 seconds', value: 30 },
  { label: '1 minute', value: 60 },
  { label: '2 minutes', value: 120 },
  { label: '5 minutes', value: 300 },
];

const StartAuction = () => {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const { defaultDuration } = useAppState();
  const { addToast } = useToast();

  const [playerName, setPlayerName] = useState('');
  const [position, setPosition] = useState('Forward');
  const [country, setCountry] = useState('Netherlands');
  const [club, setClub] = useState('Liverpool');
  const [startingPrice, setStartingPrice] = useState(1);
  const [duration, setDuration] = useState(defaultDuration);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!playerName.trim()) {
      addToast('Please enter a player name', 'error');
      return;
    }

    const auction = startAuction({
      playerName: playerName.trim(),
      position,
      country,
      club,
      startingPrice: Number(startingPrice),
      startedBy: currentUser,
      endsAt: Date.now() + (duration * 1000),
    });

    addToast(`Auction started for ${playerName}!`, 'success');
    navigate('/auctions');
  };

  return (
    <div className="min-h-screen bg-dark p-4 pb-24">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-8 pb-4 flex items-center gap-3"
      >
        <button onClick={() => navigate('/')} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
          <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-white">Start Auction</h1>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        {/* Player Name */}
        <div className="glass-card p-5">
          <label className="block text-white/50 text-sm font-medium mb-2">Player Name</label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="e.g. Cody Gakpo"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-neon/50 focus:ring-2 focus:ring-neon/20 transition-all"
          />
        </div>

        {/* Position & Country */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-5">
            <label className="block text-white/50 text-sm font-medium mb-2">Position</label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon/50 appearance-none"
            >
              {POSITIONS.map(p => (
                <option key={p} value={p} className="bg-dark">{p}</option>
              ))}
            </select>
          </div>
          <div className="glass-card p-5">
            <label className="block text-white/50 text-sm font-medium mb-2">Country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon/50 appearance-none"
            >
              {Object.keys(COUNTRY_FLAGS).map(c => (
                <option key={c} value={c} className="bg-dark">{COUNTRY_FLAGS[c]} {c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Club */}
        <div className="glass-card p-5">
          <label className="block text-white/50 text-sm font-medium mb-2">Club</label>
          <select
            value={club}
            onChange={(e) => setClub(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon/50 appearance-none"
          >
            {CLUBS.map(c => (
              <option key={c} value={c} className="bg-dark">{c}</option>
            ))}
          </select>
        </div>

        {/* Starting Price */}
        <div className="glass-card p-5">
          <label className="block text-white/50 text-sm font-medium mb-2">Starting Price</label>
          <div className="relative">
            <input
              type="number"
              min="1"
              value={startingPrice}
              onChange={(e) => setStartingPrice(Number(e.target.value))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-center text-2xl font-bold focus:outline-none focus:border-neon/50 focus:ring-2 focus:ring-neon/20 transition-all"
            />
            <span className="absolute right-6 top-1/2 -translate-y-1/2 text-white/30 font-medium">CR</span>
          </div>
        </div>

        {/* Duration */}
        <div className="glass-card p-5">
          <label className="block text-white/50 text-sm font-medium mb-3">Auction Duration</label>
          <div className="grid grid-cols-2 gap-3">
            {DURATION_OPTIONS.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setDuration(opt.value)}
                className={`py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                  duration === opt.value
                    ? 'bg-neon/20 text-neon border border-neon/40'
                    : 'bg-white/5 text-white/60 border border-white/10'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          className="w-full bg-gradient-to-r from-neon to-emerald-500 text-dark font-bold py-4 rounded-2xl text-lg shadow-lg shadow-neon/20 mt-4"
        >
          START AUCTION
        </motion.button>
      </motion.form>
    </div>
  );
};

export default StartAuction;
