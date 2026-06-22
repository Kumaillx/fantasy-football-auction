import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppState } from '../context/AppContext';
import { useUser } from '../context/UserContext';
import { COUNTRY_FLAGS, getFlagUrl } from '../dataStore';

const PLAYER_ROLES = {
  // Huzaifa
  'Mike Maignan': 'GK',
  'Pau Cubarsí': 'CB',
  'Marc Cucurella': 'LB',
  'Cristian Romero': 'CB',
  'Nahuel Molina': 'RB',
  'João Neves': 'CM',
  'Enzo Fernández': 'CM',
  'Aleksandar Pavlović': 'CM',
  'Michael Olise': 'LW',
  'Lamine Yamal': 'RW',
  'Kai Havertz': 'ST',
  'Nico Williams': 'LW',
  'Ryan Gravenberch': 'CM',
  // Hamdan
  'Diogo Costa': 'GK',
  'Gabriel Magalhães': 'CB',
  'Achraf Hakimi': 'RB',
  'Lisandro Martínez': 'CB',
  'William Saliba': 'CB',
  'Pedri': 'CM',
  'Bruno Fernandes': 'CM',
  'Vitinha': 'CM',
  'Erling Haaland': 'RW',
  'Marcus Rashford': 'LW',
  'Romelu Lukaku': 'ST',
  'Elliot Anderson': 'CM',
  'Marcos Llorente': 'CB',
  // Haider
  'Yassine Bounou': 'GK',
  'Dayot Upamecano': 'CB',
  'Joško Gvardiol': 'CB',
  'João Cancelo': 'RB',
  'Micky van de Ven': 'LB',
  'Rodri': 'CM',
  'Florian Wirtz': 'CM',
  'Lionel Messi': 'CAM',
  'Vinícius Júnior': 'LW',
  'Harry Kane': 'ST',
  'Raphinha': 'RW',
  'João Félix': 'ST',
  'Kevin De Bruyne': 'CM',
  // Wassay
  'Emiliano Martínez': 'GK',
  'Joshua Kimmich': 'RB',
  'Virgil van Dijk': 'CB',
  'Jonathan Tah': 'CB',
  'Theo Hernández': 'LB',
  'Jude Bellingham': 'CM',
  'Declan Rice': 'CM',
  'Federico Valverde': 'CM',
  'Kylian Mbappé': 'ST',
  'Luis Díaz': 'LW',
  'Julián Álvarez': 'RW',
  'Matheus Nunes': 'CB',
  'Ferran Torres': 'ST',
  // Kumail
  'Alisson': 'GK',
  'Nico Schlotterbeck': 'CB',
  'Jules Koundé': 'CB',
  'Nuno Mendes': 'LB',
  'Nico O\'Reilly': 'RB',
  'Frenkie de Jong': 'CM',
  'Jamal Musiala': 'CAM',
  'Alexis Mac-Allister': 'CM',
  'Mikel Oyarzabal': 'ST',
  'Cristiano Ronaldo': 'ST',
  'Ousmane Dembélé': 'RW',
  'Désiré Doué': 'RW',
  'Fabián Ruiz': 'CM'
};

const Squad = () => {
  const { currentUser } = useUser();
  const { users } = useAppState();
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const user = users.find(u => u.name === currentUser);
  const players = user?.playersOwned || [];
  const starters = players.slice(0, 11);
  const subs = players.slice(11);

  const getPlayersByPosition = (position) => {
    return starters.filter(p => p.position === position);
  };

  const gk = getPlayersByPosition('Goalkeeper');
  const defs = getPlayersByPosition('Defender');
  const mids = getPlayersByPosition('Midfielder');
  const fwds = getPlayersByPosition('Forward');

  const getRole = (player) => {
    return PLAYER_ROLES[player.playerName] || (
      player.position === 'Goalkeeper' ? 'GK' :
      player.position === 'Defender' ? 'DEF' :
      player.position === 'Midfielder' ? 'MID' :
      player.position === 'Forward' ? 'FWD' : 'PLR'
    );
  };

  const PlayerNode = ({ player, delay }) => {
    const role = getRole(player);
    const lastName = player.playerName.split(' ').pop();
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.7, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay, type: 'spring', stiffness: 120, damping: 14 }}
        onClick={() => setSelectedPlayer(player)}
        className="flex flex-col items-center cursor-pointer group"
      >
        <div className="relative">
          {/* Active Glow */}
          <div className="absolute -inset-1 bg-neon/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Circular Badge */}
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-white/12 to-white/5 border border-white/20 shadow-lg flex items-center justify-center relative z-10 overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:border-neon/40">
            {getFlagUrl(player.country) ? (
              <img 
                src={getFlagUrl(player.country)} 
                alt={player.country} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <span className="text-xl sm:text-2xl filter drop-shadow-md select-none">
                {COUNTRY_FLAGS[player.country] || '⚽'}
              </span>
            )}
            
            {/* Tactical Role Pill */}
            <div className="absolute -bottom-1 -right-1 bg-dark/95 border border-white/10 px-1 rounded text-[7px] sm:text-[8px] font-black text-white scale-90 tracking-tight z-15">
              {role}
            </div>
          </div>
        </div>

        {/* Player Name and Price */}
        <div className="text-center mt-1 max-w-[72px] sm:max-w-[80px] z-10">
          <p className="text-white text-[9px] sm:text-[10px] font-bold tracking-tight truncate filter drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.85)]">
            {lastName}
          </p>
          <p className="text-neon text-[8px] sm:text-[9px] font-extrabold tracking-wide filter drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.85)]">
            {player.price > 0 ? `${player.price} CR` : 'FREE'}
          </p>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-dark p-4 pb-24 text-white">
      {/* Title Header */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="pt-6 pb-3 flex items-center justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">👥 My Squad</h1>
          <p className="text-white/40 text-xs mt-0.5">Tactics: 4-3-3 Formation</p>
        </div>
        <div className="glass-card px-3 py-1.5 border border-white/10 text-xs font-semibold flex items-center gap-1.5">
          <span className="text-neon">⚽</span>
          <span>{starters.length + subs.length} Players</span>
        </div>
      </motion.div>

      {/* Football Pitch */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative w-full aspect-[3/3.8] max-w-[420px] mx-auto bg-gradient-to-b from-[#1b431e] to-[#102b12] rounded-[32px] border border-white/10 shadow-2xl p-4 overflow-hidden flex flex-col justify-between"
      >
        {/* Grass mowing stripes */}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, #fff, #fff 40px, transparent 40px, transparent 80px)'
        }} />

        {/* Pitch Lines */}
        <div className="absolute inset-3 border border-white/15 rounded-[26px] pointer-events-none">
          {/* Halfway line */}
          <div className="absolute top-1/2 left-0 right-0 h-px bg-white/15" />
          
          {/* Center Circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 border border-white/15 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white/20 rounded-full" />

          {/* Goal top */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-10 border-b border-l border-r border-white/15 rounded-b-lg" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-3 border-b border-l border-r border-white/15 rounded-b-md" />

          {/* Goal bottom */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-10 border-t border-l border-r border-white/15 rounded-t-lg" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-3 border-t border-l border-r border-white/15 rounded-t-md" />
        </div>

        {/* Pitch Content / Player rows */}
        <div className="relative z-10 h-full flex flex-col justify-between py-1">
          {/* Forwards Row */}
          <div className="flex justify-around items-center w-full px-2 pt-2">
            {fwds.length > 0 ? (
              fwds.map((p, i) => <PlayerNode key={p.id} player={p} delay={0.15 + i * 0.08} />)
            ) : (
              <span className="text-white/10 text-xs">No Forwards</span>
            )}
          </div>

          {/* Midfielders Row */}
          <div className="flex justify-around items-center w-full px-4">
            {mids.length > 0 ? (
              mids.map((p, i) => <PlayerNode key={p.id} player={p} delay={0.35 + i * 0.08} />)
            ) : (
              <span className="text-white/10 text-xs">No Midfielders</span>
            )}
          </div>

          {/* Defenders Row */}
          <div className="flex justify-around items-center w-full px-1">
            {defs.length > 0 ? (
              defs.map((p, i) => <PlayerNode key={p.id} player={p} delay={0.55 + i * 0.08} />)
            ) : (
              <span className="text-white/10 text-xs">No Defenders</span>
            )}
          </div>

          {/* Goalkeeper Row */}
          <div className="flex justify-center items-center w-full pb-1">
            {gk.length > 0 ? (
              gk.map((p) => <PlayerNode key={p.id} player={p} delay={0.75} />)
            ) : (
              <span className="text-white/10 text-xs">No GK</span>
            )}
          </div>
        </div>
      </motion.div>

      {/* Bench (Substitutes) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6"
      >
        <div className="flex items-center gap-2 mb-3 px-1">
          <span className="text-lg">🪑</span>
          <h3 className="text-white font-bold tracking-tight text-sm">Substitutes & Bench</h3>
          <span className="text-white/30 text-xs font-medium">({subs.length} players)</span>
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-2 px-1">
          {subs.length > 0 ? (
            subs.map((p, i) => {
              const role = getRole(p);
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                  onClick={() => setSelectedPlayer(p)}
                  className="glass-card p-3 min-w-[110px] flex flex-col items-center border border-white/5 cursor-pointer hover:border-white/20 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-lg mb-1.5 border border-white/10 relative overflow-hidden">
                    {getFlagUrl(p.country) ? (
                      <img 
                        src={getFlagUrl(p.country)} 
                        alt={p.country} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <span>{COUNTRY_FLAGS[p.country] || '⚽'}</span>
                    )}
                    <span className="absolute -bottom-1 -right-1 bg-dark border border-white/10 px-1 rounded text-[6px] font-black text-white z-10">
                      {role}
                    </span>
                  </div>
                  <p className="text-white text-xs font-semibold text-center truncate w-full">{p.playerName.split(' ').pop()}</p>
                  <p className="text-neon text-[10px] font-black mt-0.5">{p.price > 0 ? `${p.price} CR` : 'FREE'}</p>
                </motion.div>
              );
            })
          ) : (
            <div className="w-full glass-card p-4 text-center border-dashed border-white/5">
              <p className="text-white/20 text-xs">No substitutes on the bench</p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Player Detail Modal */}
      <AnimatePresence>
        {selectedPlayer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPlayer(null)}
            className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass-card p-6 w-full max-w-sm border border-white/15 relative overflow-hidden"
            >
              {/* Glow corner */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-neon/10 rounded-full blur-2xl" />

              <button 
                onClick={() => setSelectedPlayer(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:text-white"
              >
                ✕
              </button>

              <div className="text-center mt-2 mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-white/10 to-white/5 flex items-center justify-center text-4xl mx-auto mb-4 border border-white/20 shadow-2xl overflow-hidden">
                  {getFlagUrl(selectedPlayer.country) ? (
                    <img 
                      src={getFlagUrl(selectedPlayer.country)} 
                      alt={selectedPlayer.country} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <span>{COUNTRY_FLAGS[selectedPlayer.country] || '⚽'}</span>
                  )}
                </div>
                <h3 className="text-white font-black text-xl mb-1">{selectedPlayer.playerName}</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-neon/10 border border-neon/30 text-neon font-black text-[10px] tracking-wide uppercase">
                  {getRole(selectedPlayer)} • {selectedPlayer.position}
                </span>
              </div>

              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-white/40">Country</span>
                  <span className="text-white font-semibold flex items-center gap-2">
                    {getFlagUrl(selectedPlayer.country) ? (
                      <img 
                        src={getFlagUrl(selectedPlayer.country)} 
                        alt={selectedPlayer.country} 
                        className="w-5 h-3.5 object-cover rounded shadow-sm border border-white/10" 
                      />
                    ) : (
                      <span>{COUNTRY_FLAGS[selectedPlayer.country] || '🏳️'}</span>
                    )}
                    <span>{selectedPlayer.country}</span>
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/5">
                  <span className="text-white/40">Value</span>
                  <span className="text-neon font-black">{selectedPlayer.price > 0 ? `${selectedPlayer.price} CR` : 'FREE'}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-white/40">Squad Status</span>
                  <span className={`font-semibold ${
                    starters.some(p => p.id === selectedPlayer.id) ? 'text-emerald-400' : 'text-orange-400'
                  }`}>
                    {starters.some(p => p.id === selectedPlayer.id) ? 'Starting XI' : 'Substitute'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedPlayer(null)}
                className="w-full bg-white/5 border border-white/10 text-white font-bold py-3 rounded-xl text-sm mt-6 hover:bg-white/10 transition-colors"
              >
                Close Details
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Squad;
