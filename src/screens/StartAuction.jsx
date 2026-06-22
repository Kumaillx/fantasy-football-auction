import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useAppState } from '../context/AppContext';
import { useToast } from '../context/ToastContext';
import { startAuction, COUNTRY_FLAGS, POSITIONS, getFlagUrl } from '../dataStore';

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
  const [startingPrice, setStartingPrice] = useState(1);
  const [isPositionOpen, setIsPositionOpen] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [duration, setDuration] = useState(defaultDuration);

  const filteredCountries = Object.keys(COUNTRY_FLAGS).filter(c =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );

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
      club: '',
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
        <div className={`grid grid-cols-2 gap-4 relative ${(isPositionOpen || isCountryOpen) ? 'z-50' : 'z-10'}`}>
          {/* Position Selector */}
          <div className={`glass-card p-4 sm:p-5 relative ${isPositionOpen ? 'z-50' : 'z-10'}`}>
            <label className="block text-white/50 text-sm font-medium mb-2">Position</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsPositionOpen(!isPositionOpen);
                  setIsCountryOpen(false);
                }}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white flex items-center justify-between text-left focus:outline-none focus:border-neon/50 transition-all text-sm font-semibold"
              >
                <span>{position}</span>
                <span className="text-white/30 text-[10px] transition-transform duration-200" style={{ transform: isPositionOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
              </button>
              
              <AnimatePresence>
                {isPositionOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute left-0 right-0 mt-2 z-50 glass-card border border-white/15 max-h-60 overflow-y-auto p-1.5 shadow-2xl backdrop-blur-2xl overscroll-contain touch-pan-y"
                    style={{ WebkitOverflowScrolling: 'touch' }}
                  >
                    {POSITIONS.map(p => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => {
                          setPosition(p);
                          setIsPositionOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
                          position === p ? 'bg-neon/20 text-neon' : 'hover:bg-white/5 text-white/80'
                        }`}
                      >
                        <span className="text-sm">{p === 'Goalkeeper' ? '🧤' : p === 'Defender' ? '🛡️' : p === 'Midfielder' ? '🧠' : '⚡'}</span>
                        <span>{p}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Country Selector */}
          <div className={`glass-card p-4 sm:p-5 relative ${isCountryOpen ? 'z-50' : 'z-10'}`}>
            <label className="block text-white/50 text-sm font-medium mb-2">Country</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsCountryOpen(!isCountryOpen);
                  setIsPositionOpen(false);
                }}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white flex items-center justify-between text-left focus:outline-none focus:border-neon/50 transition-all text-sm font-semibold"
              >
                <span className="flex items-center gap-2 max-w-[85%] truncate">
                  {getFlagUrl(country) ? (
                    <img 
                      src={getFlagUrl(country)} 
                      alt={country} 
                      className="w-5 h-3.5 object-cover rounded-xs border border-white/10 shrink-0" 
                    />
                  ) : (
                    <span className="text-xs">🏳️</span>
                  )}
                  <span className="truncate">{country}</span>
                </span>
                <span className="text-white/30 text-[10px] transition-transform duration-200" style={{ transform: isCountryOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
              </button>
              
              <AnimatePresence>
                {isCountryOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute left-0 right-0 mt-2 z-50 glass-card border border-white/15 max-h-56 overflow-y-auto p-1.5 shadow-2xl backdrop-blur-2xl overscroll-contain touch-pan-y"
                    style={{ WebkitOverflowScrolling: 'touch' }}
                  >
                    <div className="sticky top-0 bg-dark/95 backdrop-blur-md p-1 pb-2 mb-1 border-b border-white/5 z-20">
                      <input
                        type="text"
                        placeholder="Search country..."
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/20 focus:outline-none focus:border-neon/50 focus:ring-1 focus:ring-neon/20 transition-all font-semibold"
                        autoFocus
                      />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      {filteredCountries.map(c => (
                        <button
                          key={c}
                          type="button"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setCountry(c);
                          setIsCountryOpen(false);
                          setCountrySearch('');
                        }}
                          className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors flex items-center justify-between ${
                            country === c ? 'bg-neon/20 text-neon' : 'hover:bg-white/5 text-white/80'
                          }`}
                        >
                          <span className="flex items-center gap-2 truncate">
                            {getFlagUrl(c) ? (
                              <img 
                                src={getFlagUrl(c)} 
                                alt={c} 
                                className="w-5 h-3.5 object-cover rounded-xs border border-white/10 shrink-0" 
                              />
                            ) : (
                              <span className="text-xs">🏳️</span>
                            )}
                            <span>{c}</span>
                          </span>
                          {country === c && <span className="text-neon text-[10px] font-bold">✓</span>}
                        </button>
                      ))}
                      {filteredCountries.length === 0 && (
                        <p className="text-center text-white/30 text-xs py-4">No countries found</p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>


        {/* Starting Price */}
        <div className="glass-card p-5">
          <label className="block text-white/50 text-sm font-medium mb-2">Starting Price</label>
          <div className="relative flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3">
            <input
              type="number"
              min="1"
              value={startingPrice}
              onChange={(e) => setStartingPrice(Number(e.target.value))}
              className="flex-1 bg-transparent border-none text-2xl font-bold text-white focus:outline-none focus:ring-0 text-center"
            />
            <div className="flex flex-col gap-0.5 mr-3 select-none">
              <button
                type="button"
                onClick={() => setStartingPrice(prev => prev + 1)}
                className="w-7 h-4 rounded bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 active:scale-95 transition-all text-[8px]"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => setStartingPrice(prev => Math.max(1, prev - 1))}
                className="w-7 h-4 rounded bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 active:scale-95 transition-all text-[8px]"
              >
                ▼
              </button>
            </div>
            <span className="text-white/30 font-medium">CR</span>
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
      {/* Backdrop for closing open dropdowns when clicking outside */}
      {(isPositionOpen || isCountryOpen) && (
        <div 
          className="fixed inset-0 z-40 bg-transparent" 
          onClick={() => {
            setIsPositionOpen(false);
            setIsCountryOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default StartAuction;
