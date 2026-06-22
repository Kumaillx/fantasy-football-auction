// Simulated Firestore data store with reactive subscriptions
// In production, replace with actual Firebase Firestore imports

const USERS = ['Huzaifa', 'Haider', 'Hamdan', 'Kumail', 'Wassay'];

const COUNTRY_FLAGS = {
  'Netherlands': '🇳🇱',
  'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'UK': '🇬🇧',
  'Brazil': '🇧🇷',
  'Argentina': '🇦🇷',
  'France': '🇫🇷',
  'Germany': '🇩🇪',
  'Spain': '🇪🇸',
  'Portugal': '🇵🇹',
  'Italy': '🇮🇹',
  'Belgium': '🇧🇪',
  'Croatia': '🇭🇷',
  'Norway': '🇳🇴',
  'Denmark': '🇩🇰',
  'Sweden': '🇸🇪',
  'Poland': '🇵🇱',
  'Ukraine': '🇺🇦',
  'Switzerland': '🇨🇭',
  'Austria': '🇦🇹',
  'Czech Republic': '🇨🇿',
  'Serbia': '🇷🇸',
  'Hungary': '🇭🇺',
  'Romania': '🇷🇴',
  'Bulgaria': '🇧🇬',
  'Greece': '🇬🇷',
  'Turkey': '🇹🇷',
  'Morocco': '🇲🇦',
  'Senegal': '🇸🇳',
  'Nigeria': '🇳🇬',
  'Ghana': '🇬🇭',
  'Egypt': '🇪🇬',
  'Cameroon': '🇨🇲',
  'Ivory Coast': '🇨🇮',
  'Algeria': '🇩🇿',
  'Tunisia': '🇹🇳',
  'Japan': '🇯🇵',
  'South Korea': '🇰🇷',
  'Australia': '🇦🇺',
  'USA': '🇺🇸',
  'Canada': '🇨🇦',
  'Mexico': '🇲🇽',
  'Colombia': '🇨🇴',
  'Uruguay': '🇺🇾',
  'Chile': '🇨🇱',
  'Ecuador': '🇪🇨',
  'Peru': '🇵🇪',
  'Venezuela': '🇻🇪',
  'Paraguay': '🇵🇾',
};

const COUNTRY_CODES = {
  'Netherlands': 'nl',
  'England': 'gb-eng',
  'UK': 'gb',
  'Brazil': 'br',
  'Argentina': 'ar',
  'France': 'fr',
  'Germany': 'de',
  'Spain': 'es',
  'Portugal': 'pt',
  'Italy': 'it',
  'Belgium': 'be',
  'Croatia': 'hr',
  'Norway': 'no',
  'Denmark': 'dk',
  'Sweden': 'se',
  'Poland': 'pl',
  'Ukraine': 'ua',
  'Switzerland': 'ch',
  'Austria': 'at',
  'Czech Republic': 'cz',
  'Serbia': 'rs',
  'Hungary': 'hu',
  'Romania': 'ro',
  'Bulgaria': 'bg',
  'Greece': 'gr',
  'Turkey': 'tr',
  'Morocco': 'ma',
  'Senegal': 'sn',
  'Nigeria': 'ng',
  'Ghana': 'gh',
  'Egypt': 'eg',
  'Cameroon': 'cm',
  'Ivory Coast': 'ci',
  'Algeria': 'dz',
  'Tunisia': 'tn',
  'Japan': 'jp',
  'South Korea': 'kr',
  'Australia': 'au',
  'USA': 'us',
  'Canada': 'ca',
  'Mexico': 'mx',
  'Colombia': 'co',
  'Uruguay': 'uy',
  'Chile': 'cl',
  'Ecuador': 'ec',
  'Peru': 'pe',
  'Venezuela': 've',
  'Paraguay': 'py',
  'Bolivia': 'bo'
};

export const getFlagUrl = (country) => {
  const code = COUNTRY_CODES[country];
  return code ? `https://flagcdn.com/w80/${code}.png` : null;
};

const POSITIONS = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];

const CLUBS = [
  'Liverpool', 'Man City', 'Arsenal', 'Chelsea', 'Man United', 'Tottenham',
  'Real Madrid', 'Barcelona', 'Atletico Madrid', 'Bayern Munich', 'Dortmund',
  'PSG', 'Juventus', 'Inter Milan', 'AC Milan', 'Napoli', 'Roma',
  'Ajax', 'Porto', 'Benfica', 'Sporting CP', 'Celtic', 'Rangers'
];

// Initial squads mapping
const INITIAL_SQUADS = {
  Huzaifa: [
    { name: 'Mike Maignan', pos: 'Goalkeeper', country: 'France', club: 'AC Milan' },
    { name: 'Pau Cubarsí', pos: 'Defender', country: 'Spain', club: 'Barcelona' },
    { name: 'Marc Cucurella', pos: 'Defender', country: 'Spain', club: 'Chelsea' },
    { name: 'Cristian Romero', pos: 'Defender', country: 'Argentina', club: 'Tottenham' },
    { name: 'Nahuel Molina', pos: 'Defender', country: 'Argentina', club: 'Atletico Madrid' },
    { name: 'João Neves', pos: 'Midfielder', country: 'Portugal', club: 'PSG' },
    { name: 'Enzo Fernández', pos: 'Midfielder', country: 'Argentina', club: 'Chelsea' },
    { name: 'Aleksandar Pavlović', pos: 'Midfielder', country: 'Germany', club: 'Bayern Munich' },
    { name: 'Michael Olise', pos: 'Forward', country: 'France', club: 'Bayern Munich' },
    { name: 'Lamine Yamal', pos: 'Forward', country: 'Spain', club: 'Barcelona' },
    { name: 'Kai Havertz', pos: 'Forward', country: 'Germany', club: 'Arsenal' },
    { name: 'Nico Williams', pos: 'Forward', country: 'Spain', club: 'Athletic Bilbao' },
    { name: 'Ryan Gravenberch', pos: 'Midfielder', country: 'Netherlands', club: 'Liverpool' }
  ],
  Hamdan: [
    { name: 'Diogo Costa', pos: 'Goalkeeper', country: 'Portugal', club: 'Porto' },
    { name: 'Gabriel Magalhães', pos: 'Defender', country: 'Brazil', club: 'Arsenal' },
    { name: 'Achraf Hakimi', pos: 'Defender', country: 'Morocco', club: 'PSG' },
    { name: 'Lisandro Martínez', pos: 'Defender', country: 'Argentina', club: 'Man United' },
    { name: 'William Saliba', pos: 'Defender', country: 'France', club: 'Arsenal' },
    { name: 'Pedri', pos: 'Midfielder', country: 'Spain', club: 'Barcelona' },
    { name: 'Bruno Fernandes', pos: 'Midfielder', country: 'Portugal', club: 'Man United' },
    { name: 'Vitinha', pos: 'Midfielder', country: 'Portugal', club: 'PSG' },
    { name: 'Erling Haaland', pos: 'Forward', country: 'Norway', club: 'Man City' },
    { name: 'Marcus Rashford', pos: 'Forward', country: 'England', club: 'Man United' },
    { name: 'Romelu Lukaku', pos: 'Forward', country: 'Belgium', club: 'Napoli' },
    { name: 'Elliot Anderson', pos: 'Midfielder', country: 'England', club: 'Nottingham Forest' },
    { name: 'Marcos Llorente', pos: 'Defender', country: 'Spain', club: 'Atletico Madrid' }
  ],
  Haider: [
    { name: 'Yassine Bounou', pos: 'Goalkeeper', country: 'Morocco', club: 'Al Hilal' },
    { name: 'Dayot Upamecano', pos: 'Defender', country: 'France', club: 'Bayern Munich' },
    { name: 'Joško Gvardiol', pos: 'Defender', country: 'Croatia', club: 'Man City' },
    { name: 'João Cancelo', pos: 'Defender', country: 'Portugal', club: 'Barcelona' },
    { name: 'Micky van de Ven', pos: 'Defender', country: 'Netherlands', club: 'Tottenham' },
    { name: 'Rodri', pos: 'Midfielder', country: 'Spain', club: 'Man City' },
    { name: 'Florian Wirtz', pos: 'Midfielder', country: 'Germany', club: 'Leverkusen' },
    { name: 'Lionel Messi', pos: 'Midfielder', country: 'Argentina', club: 'Inter Miami' },
    { name: 'Vinícius Júnior', pos: 'Forward', country: 'Brazil', club: 'Real Madrid' },
    { name: 'Harry Kane', pos: 'Forward', country: 'England', club: 'Bayern Munich' },
    { name: 'Raphinha', pos: 'Forward', country: 'Brazil', club: 'Barcelona' },
    { name: 'João Félix', pos: 'Forward', country: 'Portugal', club: 'Chelsea' },
    { name: 'Kevin De Bruyne', pos: 'Midfielder', country: 'Belgium', club: 'Man City' }
  ],
  Wassay: [
    { name: 'Emiliano Martínez', pos: 'Goalkeeper', country: 'Argentina', club: 'Aston Villa' },
    { name: 'Joshua Kimmich', pos: 'Defender', country: 'Germany', club: 'Bayern Munich' },
    { name: 'Virgil van Dijk', pos: 'Defender', country: 'Netherlands', club: 'Liverpool' },
    { name: 'Jonathan Tah', pos: 'Defender', country: 'Germany', club: 'Leverkusen' },
    { name: 'Theo Hernández', pos: 'Defender', country: 'France', club: 'AC Milan' },
    { name: 'Jude Bellingham', pos: 'Midfielder', country: 'England', club: 'Real Madrid' },
    { name: 'Declan Rice', pos: 'Midfielder', country: 'England', club: 'Arsenal' },
    { name: 'Federico Valverde', pos: 'Midfielder', country: 'Uruguay', club: 'Real Madrid' },
    { name: 'Kylian Mbappé', pos: 'Forward', country: 'France', club: 'Real Madrid' },
    { name: 'Luis Díaz', pos: 'Forward', country: 'Colombia', club: 'Liverpool' },
    { name: 'Julián Álvarez', pos: 'Forward', country: 'Argentina', club: 'Atletico Madrid' },
    { name: 'Matheus Nunes', pos: 'Defender', country: 'Portugal', club: 'Man City' },
    { name: 'Ferran Torres', pos: 'Forward', country: 'Spain', club: 'Barcelona' }
  ],
  Kumail: [
    { name: 'Alisson', pos: 'Goalkeeper', country: 'Brazil', club: 'Liverpool' },
    { name: 'Nico Schlotterbeck', pos: 'Defender', country: 'Germany', club: 'Dortmund' },
    { name: 'Jules Koundé', pos: 'Defender', country: 'France', club: 'Barcelona' },
    { name: 'Nuno Mendes', pos: 'Defender', country: 'Portugal', club: 'PSG' },
    { name: 'Nico O\'Reilly', pos: 'Defender', country: 'England', club: 'Man City' },
    { name: 'Frenkie de Jong', pos: 'Midfielder', country: 'Netherlands', club: 'Barcelona' },
    { name: 'Jamal Musiala', pos: 'Midfielder', country: 'Germany', club: 'Bayern Munich' },
    { name: 'Alexis Mac-Allister', pos: 'Midfielder', country: 'Argentina', club: 'Liverpool' },
    { name: 'Mikel Oyarzabal', pos: 'Forward', country: 'Spain', club: 'Real Sociedad' },
    { name: 'Cristiano Ronaldo', pos: 'Forward', country: 'Portugal', club: 'Al Nassr' },
    { name: 'Ousmane Dembélé', pos: 'Forward', country: 'France', club: 'PSG' },
    { name: 'Désiré Doué', pos: 'Forward', country: 'France', club: 'PSG' },
    { name: 'Fabián Ruiz', pos: 'Midfielder', country: 'Spain', club: 'PSG' }
  ]
};

const getInitialData = (defaultBudget) => {
  const playersWon = [];
  const users = USERS.map(name => {
    const squadPlayers = INITIAL_SQUADS[name] || [];
    const playersOwned = squadPlayers.map((p, index) => {
      const playerObj = {
        id: `${name.toLowerCase()}_${p.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
        playerName: p.name,
        owner: name,
        price: 0,
        country: p.country,
        position: p.pos,
        club: p.club,
        wonAt: Date.now() - (1000 * 60 * 60 * 24) + index
      };
      playersWon.push(playerObj);
      return playerObj;
    });

    return {
      id: name.toLowerCase(),
      name,
      budget: defaultBudget,
      spent: 0,
      playersOwned
    };
  });
  return { users, playersWon };
};

const initialData = getInitialData(150);

// Initial state
let state = {
  users: initialData.users,
  auctions: [],
  bids: [],
  playersWon: initialData.playersWon,
  activityFeed: [],
  tournamentName: 'Fantasy Football Auction',
  defaultBudget: 150,
  defaultDuration: 60,
};

let listeners = [];

const notifyListeners = () => {
  listeners.forEach(cb => cb(state));
};

export const subscribe = (callback) => {
  listeners.push(callback);
  callback(state); // Initial call
  return () => {
    listeners = listeners.filter(l => l !== callback);
  };
};

export const getState = () => ({ ...state });

export const updateState = (updater) => {
  state = typeof updater === 'function' ? updater(state) : { ...state, ...updater };
  notifyListeners();
};

// Actions
export const startAuction = (auctionData) => {
  const auction = {
    id: Date.now().toString(),
    ...auctionData,
    currentBid: auctionData.startingPrice || 1,
    highestBidder: null,
    status: 'active',
    createdAt: Date.now(),
  };

  updateState(s => ({
    ...s,
    auctions: [...s.auctions, auction],
    activityFeed: [
      {
        id: Date.now().toString(),
        type: 'auction_started',
        message: `${auctionData.startedBy} started auction for ${auctionData.playerName}`,
        timestamp: Date.now(),
      },
      ...s.activityFeed
    ].slice(0, 50)
  }));

  return auction;
};

export const placeBid = (auctionId, bidder, amount) => {
  const auction = state.auctions.find(a => a.id === auctionId);
  if (!auction || auction.status !== 'active') return false;

  const user = state.users.find(u => u.name === bidder);
  if (!user || user.budget < amount) return false;

  if (amount <= auction.currentBid) return false;

  // Anti-sniping: extend if bid in last 5 seconds
  const now = Date.now();
  const endsAt = auction.endsAt;
  const timeLeft = endsAt - now;
  let newEndsAt = endsAt;
  if (timeLeft < 5000 && timeLeft > 0) {
    newEndsAt = endsAt + 10000;
  }

  updateState(s => ({
    ...s,
    auctions: s.auctions.map(a => 
      a.id === auctionId 
        ? { ...a, currentBid: amount, highestBidder: bidder, endsAt: newEndsAt }
        : a
    ),
    bids: [...s.bids, { auctionId, bidder, amount, timestamp: Date.now() }],
    activityFeed: [
      {
        id: Date.now().toString(),
        type: 'bid',
        message: `${bidder} bid ${amount} CR on ${auction.playerName}`,
        timestamp: Date.now(),
      },
      ...s.activityFeed
    ].slice(0, 50)
  }));

  return true;
};

export const endAuction = (auctionId) => {
  const auction = state.auctions.find(a => a.id === auctionId);
  if (!auction || auction.status !== 'active') return;

  const winner = auction.highestBidder;

  if (winner) {
    const wonPlayer = {
      id: Date.now().toString(),
      playerName: auction.playerName,
      owner: winner,
      price: auction.currentBid,
      country: auction.country,
      position: auction.position,
      club: '',
      wonAt: Date.now(),
    };

    updateState(s => ({
      ...s,
      users: s.users.map(u => 
        u.name === winner 
          ? { 
              ...u, 
              budget: u.budget - auction.currentBid,
              spent: u.spent + auction.currentBid,
              playersOwned: [...u.playersOwned, wonPlayer]
            }
          : u
      ),
      auctions: s.auctions.map(a => 
        a.id === auctionId ? { ...a, status: 'ended' } : a
      ),
      playersWon: [...s.playersWon, wonPlayer],
      activityFeed: [
        {
          id: Date.now().toString(),
          type: 'auction_won',
          message: `${winner} won ${auction.playerName} for ${auction.currentBid} CR`,
          timestamp: Date.now(),
        },
        ...s.activityFeed
      ].slice(0, 50)
    }));

    return wonPlayer;
  } else {
    updateState(s => ({
      ...s,
      auctions: s.auctions.map(a => 
        a.id === auctionId ? { ...a, status: 'ended' } : a
      ),
    }));
    return null;
  }
};

export const resetLeague = () => {
  const resetData = getInitialData(state.defaultBudget);
  updateState(s => ({
    ...s,
    users: resetData.users,
    auctions: [],
    bids: [],
    playersWon: resetData.playersWon,
    activityFeed: [],
  }));
};

export const updateBudget = (userName, newBudget) => {
  updateState(s => ({
    ...s,
    users: s.users.map(u => 
      u.name === userName ? { ...u, budget: newBudget } : u
    ),
    defaultBudget: newBudget,
  }));
};

export const updateTournamentName = (name) => {
  updateState(s => ({ ...s, tournamentName: name }));
};

export const updateDefaultDuration = (seconds) => {
  updateState(s => ({ ...s, defaultDuration: seconds }));
};

export { USERS, COUNTRY_FLAGS, POSITIONS, CLUBS };
export default state;
