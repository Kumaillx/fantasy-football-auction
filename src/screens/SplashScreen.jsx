import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const SplashScreen = () => {
  const navigate = useNavigate();
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300);
    const navTimer = setTimeout(() => navigate('/select'), 3500);
    return () => {
      clearTimeout(timer);
      clearTimeout(navTimer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon/3 rounded-full blur-3xl" />
      </div>

      {/* Animated football */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 1, type: 'spring', stiffness: 100 }}
        className="relative z-10 mb-8"
      >
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center shadow-2xl shadow-neon/20">
            <span className="text-6xl">⚽</span>
          </div>
        </motion.div>
        {/* Glow ring */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 rounded-full border border-neon/30"
        />
      </motion.div>

      {/* Text content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={showContent ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center z-10 px-6"
      >
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          <span className="gradient-text">Fantasy Football</span>
          <br />
          <span className="text-white">Auction</span>
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={showContent ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-white/50 text-sm font-medium mt-3"
        >
          Build your dream squad.
        </motion.p>
      </motion.div>

      {/* Loading bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={showContent ? { opacity: 1 } : {}}
        transition={{ delay: 1 }}
        className="absolute bottom-16 left-8 right-8"
      >
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.5, ease: 'easeInOut' }}
            className="h-full bg-gradient-to-r from-neon to-emerald-400 rounded-full"
          />
        </div>
      </motion.div>
    </div>
  );
};

export default SplashScreen;
