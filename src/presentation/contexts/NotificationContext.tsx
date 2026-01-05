import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { container } from '../../infrastructure/di/container';

interface NotificationContextType {
  notificationCount: number;
  incrementCount: () => void;
  decrementCount: () => void;
  resetCount: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notificationCount, setNotificationCount] = useState(0);

  const incrementCount = () => setNotificationCount(prev => prev + 1);
  const decrementCount = () => setNotificationCount(prev => Math.max(0, prev - 1));
  const resetCount = () => setNotificationCount(0);

  useEffect(() => {
    try {
      container.liveTrackingService.onNewAlert(() => {
        incrementCount();
      });
    } catch (error) {
      console.error('Error setting up notification context listener:', error);
    }
  }, []);

  return (
    <NotificationContext.Provider value={{
      notificationCount,
      incrementCount,
      decrementCount,
      resetCount
    }}>
      {children}
    </NotificationContext.Provider>
  );
};