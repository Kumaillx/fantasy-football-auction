import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppState } from '../context/AppContext';
import { useUser } from '../context/UserContext';
import { useToast } from '../context/ToastContext';
import { placeBid, endAuction, COUNTRY_FLAGS, getFlagUrl, getCurrentTime } from '../dataStore';

const Auctions = () => {
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const { users, auctions } = useAppState();
  const { addToast } = useToast();
  const [now, setNow] = useState(getCurrentTime());
  const [customBidAmount, setCustomBidAmount] = useState({});
  const [showCustomBid, setShowCustomBid] = useState({});
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'history'
  const intervalRef = useRef(null);
  const prevAuctionsRef = useRef([]);

  // Transition detector to toast the winner when an active auction transitions to ended
  useEffect(() => {
    prevAuctionsRef.current.forEach(prevA => {
      const currentA = auctions.find(a => a.id === prevA.id);
      if (prevA.status === 'active' && currentA && currentA.status === 'ended') {
        if (currentA.highestBidder) {
          addToast(`🎉 ${currentA.highestBidder} won ${currentA.playerName} for ${currentA.currentBid} CR!`, 'success');
        } else {
          addToast(`⚽ Auction ended for ${currentA.playerName} (Unsold)`, 'info');
        }
      }
    });
    prevAuctionsRef.current = auctions;
  }, [auctions, addToast]);

  const user = users.find(u => u.name === currentUser);
  const activeAuctions = auctions.filter(a => a.status === 'active');
  const endedAuctions = auctions.filter(a => a.status === 'ended');

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const currentTime = getCurrentTime();
      setNow(currentTime);

      // Check for expired auctions
      activeAuctions.forEach(auction => {
        if (currentTime >= auction.endsAt) {
          endAuction(auction.id);
        }
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [activeAuctions]);

  const formatTime = (ms) => {
    const totalSeconds = Math.max(0, Math.floor((ms - now) / 1000));
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleBid = (auctionId, amount) => {
    const success = placeBid(auctionId, currentUser, amount);
    if (success) {
      addToast(`Bid ${amount} CR placed!`, 'success');
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50);
      }
    } else {
      addToast('Bid failed! Check your budget or bid amount.', 'error');
    }
  };

  const handleCustomBid = (auctionId) => {
    const amount = customBidAmount[auctionId];
    if (!amount || amount <= 0) return;
    handleBid(auctionId, Number(amount));
    setShowCustomBid(prev => ({ ...prev, [auctionId]: false }));
    setCustomBidAmount(prev => ({ ...prev, [auctionId]: '' }));
  };

  const getTimeColor = (endsAt) => {
    const timeLeft = endsAt - now;
    if (timeLeft < 10000) return 'text-red-400';
    if (timeLeft < 30000) return 'text-orange-400';
    return 'text-neon';
  };

  const getTimeBg = (endsAt) => {
    const timeLeft = endsAt - now;
    if (timeLeft < 10000) return 'bg-red-500/10 border-red-500/30';
    if (timeLeft < 30000) return 'bg-orange-500/10 border-orange-500/30';
    return 'bg-neon/10 border-neon/30';
  };

  return (
    <div className="min-h-screen bg-dark p-3 sm:p-4 pb-32 overflow-x-hidden">
      <div className="max-w-md mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pt-4 pb-2 sm:pt-8 sm:pb-4"
        >
          <h1 className="text-xl sm:text-2xl font-bold text-white">🔥 Auctions</h1>
          <p className="text-white/40 text-xs sm:text-sm mt-1">{activeAuctions.length} active, {endedAuctions.length} completed</p>
        </motion.div>

        {/* Tab Headers */}
        <div className="flex bg-white/5 p-1 rounded-xl mb-6 border border-white/10 w-full">
          <button
            onClick={() => setActiveTab('active')}
            type="button"
            className={`flex-1 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'active'
                ? 'bg-neon text-dark shadow-md font-bold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Active Auctions ({activeAuctions.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            type="button"
            className={`flex-1 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'history'
                ? 'bg-neon text-dark shadow-md font-bold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            History ({endedAuctions.length})
          </button>
        </div>

      {/* Active Auctions Tab */}
      {activeTab === 'active' && (
        <div className="flex flex-col gap-4 mb-8">
        <AnimatePresence>
          {activeAuctions.map((auction) => {
            const timeLeft = auction.endsAt - now;
            const isEndingSoon = timeLeft < 10000 && timeLeft > 0;
            const isHighestBidder = auction.highestBidder === currentUser;
            const canBid = user && user.budget > auction.currentBid;
            const ownsPlayer = user?.playersOwned?.some(p => p.playerName === auction.playerName);

            return (
              <motion.div
                key={auction.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: -20 }}
                transition={{ type: 'spring', stiffness: 100 }}
                className={`glass-card p-5 relative overflow-hidden ${isEndingSoon ? 'neon-border' : ''}`}
              >
                {isEndingSoon && (
                  <motion.div
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="absolute inset-0 bg-red-500/5"
                  />
                )}

                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-2xl border border-white/10 overflow-hidden">
                        {getFlagUrl(auction.country) ? (
                          <img 
                            src={getFlagUrl(auction.country)} 
                            alt={auction.country} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <span>{COUNTRY_FLAGS[auction.country] || '🏳️'}</span>
                        )}
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg">{auction.playerName}</h3>
                        <p className="text-white/40 text-sm">{auction.position} • {auction.country}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getTimeBg(auction.endsAt)}`}>
                      <span className={isEndingSoon ? 'countdown-pulse' : ''}>
                        {formatTime(auction.endsAt)}
                      </span>
                    </div>
                  </div>

                  {/* Auction Info */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white/5 rounded-xl p-3">
                      <p className="text-white/40 text-xs mb-1">Current Bid</p>
                      <p className="text-white font-bold text-xl">{auction.currentBid} <span className="text-white/40 text-sm font-normal">CR</span></p>
                    </div>
                    <div className="bg-white/5 rounded-xl p-3">
                      <p className="text-white/40 text-xs mb-1">Highest Bidder</p>
                      <p className={`font-bold text-sm ${isHighestBidder ? 'text-neon' : 'text-white'}`}>
                        {auction.highestBidder || 'No bids yet'}
                      </p>
                    </div>
                  </div>

                  {/* Extension Indicator */}
                  {(() => {
                    if (!auction.auctionDay) return null;
                    const [y, m, d] = auction.auctionDay.split('-').map(Number);
                    const baseDeadline = Date.UTC(y, m - 1, d, 12, 0, 0, 0);
                    if (auction.endsAt > baseDeadline) {
                      return (
                        <div className="bg-neon/5 border border-neon/20 rounded-xl p-3 mb-4 flex items-center justify-between text-xs">
                          <span className="text-white/50">🔥 Extension Active</span>
                          <span className="text-neon font-bold font-mono">
                            {auction.extensionCount > 0 ? `LMP Protection: ${auction.extensionCount}/10` : '20-min extension'}
                          </span>
                        </div>
                      );
                    }
                    return null;
                  })()}

                  <p className="text-white/30 text-xs mb-4">Started by {auction.startedBy}</p>

                  {/* Bid Buttons */}
                  {!ownsPlayer && canBid && !isHighestBidder && (
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleBid(auction.id, auction.currentBid + 1)}
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 text-sm font-semibold text-white hover:bg-neon/10 hover:border-neon/30 transition-all"
                        >
                          +1 CR
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleBid(auction.id, auction.currentBid + 2)}
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl py-3 text-sm font-semibold text-white hover:bg-neon/10 hover:border-neon/30 transition-all"
                        >
                          +2 CR
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowCustomBid(prev => ({ ...prev, [auction.id]: !prev[auction.id] }))}
                          className="flex-1 bg-neon/10 border border-neon/30 rounded-xl py-3 text-sm font-semibold text-neon"
                        >
                          Custom
                        </motion.button>
                      </div>

                      <AnimatePresence>
                        {showCustomBid[auction.id] && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="flex gap-2 mt-2">
                              <input
                                type="number"
                                placeholder="Amount"
                                value={customBidAmount[auction.id] || ''}
                                onChange={(e) => setCustomBidAmount(prev => ({ ...prev, [auction.id]: e.target.value }))}
                                className="w-full min-w-0 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-center focus:outline-none focus:border-neon/50"
                              />
                              <button
                                onClick={() => handleCustomBid(auction.id)}
                                className="bg-neon text-dark font-bold px-4 rounded-xl shrink-0"
                              >
                                Bid
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {isHighestBidder && (
                    <div className="bg-neon/10 border border-neon/30 rounded-xl p-3 text-center">
                      <p className="text-neon text-sm font-medium">You are the highest bidder! 🎉</p>
                    </div>
                  )}

                  {ownsPlayer && (
                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 text-center">
                      <p className="text-yellow-400 text-sm font-medium">You already own this player</p>
                    </div>
                  )}

                  {!canBid && !isHighestBidder && !ownsPlayer && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-center">
                      <p className="text-red-400 text-sm font-medium">Insufficient budget</p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {activeAuctions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-8 text-center"
          >
            <div className="text-4xl mb-3">⚽</div>
            <p className="text-white/40 text-sm">No active auctions</p>
            <p className="text-white/20 text-xs mt-1">Start one from the Home screen!</p>
          </motion.div>
        )}
      </div>
      )}

      {/* Auction History Tab */}
      {activeTab === 'history' && (
        <div className="flex flex-col gap-4 mb-8">
          <AnimatePresence>
            {endedAuctions.slice().reverse().map(auction => {
              const isWinner = auction.highestBidder === currentUser;
              return (
                <motion.div
                  key={auction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-4 flex items-center gap-3 relative overflow-hidden border-white/5"
                >
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl border border-white/10 overflow-hidden shrink-0">
                    {getFlagUrl(auction.country) ? (
                      <img 
                        src={getFlagUrl(auction.country)} 
                        alt={auction.country} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <span>{COUNTRY_FLAGS[auction.country] || '🏳️'}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-sm truncate">{auction.playerName}</h3>
                    <p className="text-white/40 text-xs mt-0.5">{auction.position} • {auction.country}</p>
                    
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      {auction.highestBidder ? (
                        <>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            isWinner 
                              ? 'bg-neon/20 text-neon border border-neon/30' 
                              : 'bg-white/5 text-white/70 border border-white/10'
                          }`}>
                            Won by {auction.highestBidder}
                          </span>
                          <span className="text-[10px] text-white/50 font-semibold font-mono">
                            Price: {auction.currentBid} CR
                          </span>
                          {isWinner && (
                            <span className="text-xs">🎉</span>
                          )}
                        </>
                      ) : (
                        <span className="px-2 py-0.5 rounded-md bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-bold uppercase tracking-wide">
                          Unsold
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {endedAuctions.length === 0 && (
            <div className="glass-card p-8 text-center">
              <div className="text-3xl mb-2">📜</div>
              <p className="text-white/40 text-sm">No auction history yet</p>
              <p className="text-white/20 text-xs mt-1">Completed auctions will appear here.</p>
            </div>
          )}
        </div>
      )}

      </div>

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

export default Auctions;
