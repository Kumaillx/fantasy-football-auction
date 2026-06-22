import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
import { 
  startAuction, 
  COUNTRY_FLAGS, 
  POSITIONS, 
  getFlagUrl, 
  getCurrentTime, 
  getAuctionDayInfo, 
  getUserBidsCreatedCount 
} from '../dataStore';

const StartAuction = () => {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const { addToast } = useToast();

  const [playerName, setPlayerName] = useState('');
  const [position, setPosition] = useState('Forward');
  const [country, setCountry] = useState('Netherlands');
  const [startingPrice, setStartingPrice] = useState(1);
  const [isPositionOpen, setIsPositionOpen] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  
  // Simulated clock tick
  const [nowTime, setNowTime] = useState(getCurrentTime());

  useEffect(() => {
    const timer = setInterval(() => {
      setNowTime(getCurrentTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dayInfo = getAuctionDayInfo(nowTime);
  const bidsCreated = getUserBidsCreatedCount(currentUser, nowTime);

  const filteredCountries = Object.keys(COUNTRY_FLAGS).filter(c =>
    c.toLowerCase().includes(countrySearch.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!playerName.trim()) {
      addToast('Please enter a player name', 'error');
      return;
    }

    const result = startAuction({
      playerName: playerName.trim(),
      position,
      country,
      club: '',
      startingPrice: Number(startingPrice),
      startedBy: currentUser,
    });

    if (result && result.error) {
      addToast(result.error, 'error');
      return;
    }

    addToast(`Auction started for ${playerName}!`, 'success');
    navigate('/auctions');
  };

  return (
    <div className="min-h-screen bg-dark p-3 sm:p-4 pb-32">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-4 pb-2 sm:pt-8 sm:pb-4 flex items-center gap-3"
      >
        <button onClick={() => navigate('/')} className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/5 flex items-center justify-center">
          <svg className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg sm:text-xl font-bold text-white">Start Auction</h1>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 sm:gap-4"
      >
        {/* Player Name */}
        <div className="glass-card p-4 sm:p-5">
          <label className="block text-white/50 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">Player Name</label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="e.g. Cody Gakpo"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base text-white placeholder-white/20 focus:outline-none focus:border-neon/50 focus:ring-2 focus:ring-neon/20 transition-all"
          />
        </div>

        {/* Position & Country */}
        <div className={`grid grid-cols-2 gap-2.5 sm:gap-4 relative ${(isPositionOpen || isCountryOpen) ? 'z-50' : 'z-10'}`}>
          {/* Position Selector */}
          <div className={`glass-card p-3.5 sm:p-5 relative ${isPositionOpen ? 'z-50' : 'z-10'}`}>
            <label className="block text-white/50 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">Position</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsPositionOpen(!isPositionOpen);
                  setIsCountryOpen(false);
                }}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white flex items-center justify-between text-left focus:outline-none focus:border-neon/50 transition-all font-semibold"
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
          <div className={`glass-card p-3.5 sm:p-5 relative ${isCountryOpen ? 'z-50' : 'z-10'}`}>
            <label className="block text-white/50 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">Country</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsCountryOpen(!isCountryOpen);
                  setIsPositionOpen(false);
                }}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-white flex items-center justify-between text-left focus:outline-none focus:border-neon/50 transition-all font-semibold"
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
        <div className="glass-card p-4 sm:p-5">
          <label className="block text-white/50 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">Starting Price</label>
          <div className="relative flex items-center bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 sm:px-4 sm:py-3">
            <input
              type="number"
              min="1"
              value={startingPrice}
              onChange={(e) => setStartingPrice(Number(e.target.value))}
              className="flex-1 bg-transparent border-none text-xl sm:text-2xl font-bold text-white focus:outline-none focus:ring-0 text-center"
            />
            <div className="flex flex-col gap-0.5 mr-3 select-none">
              <button
                type="button"
                onClick={() => setStartingPrice(prev => prev + 1)}
                className="w-6 h-3.5 rounded bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 active:scale-95 transition-all text-[8px]"
              >
                ▲
              </button>
              <button
                type="button"
                onClick={() => setStartingPrice(prev => Math.max(1, prev - 1))}
                className="w-6 h-3.5 rounded bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 active:scale-95 transition-all text-[8px]"
              >
                ▼
              </button>
            </div>
            <span className="text-white/30 text-sm sm:text-base font-medium">CR</span>
          </div>
        </div>

        {/* Submit Button & Warnings */}
        {dayInfo.isCoolingPeriod && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3.5 text-center mt-1 sm:mt-2">
            <p className="text-red-400 text-xs sm:text-sm font-semibold">⚠️ Daily Closing Window (5:00 PM - 5:30 PM PKT)</p>
            <p className="text-white/60 text-[10px] sm:text-xs mt-1">Today's deadline has passed. Tomorrow's bidding period opens at 5:30 PM PKT.</p>
          </div>
        )}

        {!dayInfo.isCoolingPeriod && bidsCreated >= 3 && (
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-3.5 text-center mt-1 sm:mt-2">
            <p className="text-orange-400 text-xs sm:text-sm font-semibold">⚠️ Daily Limit Reached (3 / 3)</p>
            <p className="text-white/60 text-[10px] sm:text-xs mt-1">You have already started 3 auctions for this bidding day ({dayInfo.auctionDay}).</p>
          </div>
        )}

        {!dayInfo.isCoolingPeriod && bidsCreated < 3 && (
          <div className="bg-neon/5 border border-neon/20 rounded-xl p-3.5 text-center mt-1 sm:mt-2">
            <p className="text-neon text-xs sm:text-sm font-semibold">Ready to start auction!</p>
            <p className="text-white/60 text-[11px] sm:text-xs mt-1">
              Target Bidding Day: <span className="text-neon font-bold">{dayInfo.auctionDay}</span>
            </p>
            <p className="text-white/40 text-[10px] sm:text-[11px] mt-0.5">
              Deadline: 5:00 PM PKT • You have started {bidsCreated} / 3 auctions
            </p>
          </div>
        )}

        <motion.button
          whileTap={!(dayInfo.isCoolingPeriod || bidsCreated >= 3) ? { scale: 0.97 } : {}}
          type="submit"
          disabled={dayInfo.isCoolingPeriod || bidsCreated >= 3}
          className={`w-full font-bold py-3 sm:py-4 rounded-xl sm:rounded-2xl text-base sm:text-lg shadow-lg mt-2 sm:mt-4 transition-all ${
            dayInfo.isCoolingPeriod || bidsCreated >= 3
              ? 'bg-white/5 text-white/20 cursor-not-allowed border border-white/10'
              : 'bg-gradient-to-r from-neon to-emerald-500 text-dark shadow-neon/20'
          }`}
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
