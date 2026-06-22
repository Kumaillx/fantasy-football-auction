import React, { createContext, useContext, useState, useEffect } from 'react';
import { subscribe, getState } from '../dataStore';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [appState, setAppState] = useState(getState());

  useEffect(() => {
    const unsubscribe = subscribe((newState) => {
      setAppState({ ...newState });
    });
    return unsubscribe;
  }, []);

  return (
    <AppContext.Provider value={appState}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppState must be used within AppProvider');
  }
  return context;
};

export default AppContext;
