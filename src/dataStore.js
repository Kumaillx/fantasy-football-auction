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
  'Bolivia': '🇧🇴',
};

const POSITIONS = ['Goalkeeper', 'Defender', 'Midfielder', 'Forward'];

const CLUBS = [
  'Liverpool', 'Man City', 'Arsenal', 'Chelsea', 'Man United', 'Tottenham',
  'Real Madrid', 'Barcelona', 'Atletico Madrid', 'Bayern Munich', 'Dortmund',
  'PSG', 'Juventus', 'Inter Milan', 'AC Milan', 'Napoli', 'Roma',
  'Ajax', 'Porto', 'Benfica', 'Sporting CP', 'Celtic', 'Rangers'
];

// Initial state
let state = {
  users: USERS.map(name => ({
    id: name.toLowerCase(),
    name,
    budget: 150,
    spent: 0,
    playersOwned: []
  })),
  auctions: [],
  bids: [],
  playersWon: [],
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
      club: auction.club || CLUBS[Math.floor(Math.random() * CLUBS.length)],
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
  updateState(s => ({
    ...s,
    users: USERS.map(name => ({
      id: name.toLowerCase(),
      name,
      budget: s.defaultBudget,
      spent: 0,
      playersOwned: []
    })),
    auctions: [],
    bids: [],
    playersWon: [],
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
