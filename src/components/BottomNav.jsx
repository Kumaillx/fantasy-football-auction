import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/auctions', label: 'Auctions', icon: '🔥' },
  { path: '/won', label: 'Won', icon: '🏆' },
  { path: '/squad', label: 'Squad', icon: '👥' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
];

const BottomNav = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="bg-dark/90 backdrop-blur-xl border-t border-white/5 px-2 pb-safe">
        <nav className="flex items-center justify-around py-2 max-w-lg mx-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className="relative flex flex-col items-center py-1 px-3 min-w-[60px]"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -top-2 w-8 h-1 bg-neon rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className={`text-xl mb-0.5 transition-all ${isActive ? 'scale-110' : 'opacity-50'}`}>
                  {item.icon}
                </span>
                <span className={`text-[10px] font-medium transition-colors ${
                  isActive ? 'text-neon' : 'text-white/40'
                }`}>
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default BottomNav;
