import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    return localStorage.getItem('ff_current_user') || null;
  });
  
  const [firstTimeSetup, setFirstTimeSetup] = useState(() => {
    const user = localStorage.getItem('ff_current_user');
    if (!user) return true;
    const completed = localStorage.getItem(`ff_setup_completed_${user}`);
    return completed !== 'true';
  });

  const login = (name) => {
    setCurrentUser(name);
    localStorage.setItem('ff_current_user', name);
    
    const completed = localStorage.getItem(`ff_setup_completed_${name}`);
    const needsSetup = completed !== 'true';
    setFirstTimeSetup(needsSetup);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ff_current_user');
    setFirstTimeSetup(true);
  };

  const completeSetup = () => {
    setFirstTimeSetup(false);
    if (currentUser) {
      localStorage.setItem(`ff_setup_completed_${currentUser}`, 'true');
    }
  };

  return (
    <UserContext.Provider value={{ currentUser, firstTimeSetup, login, logout, completeSetup }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};

export default UserContext;
