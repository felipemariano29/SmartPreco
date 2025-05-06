import React, { createContext, useState, useContext, ReactNode } from "react";

interface NotificationContextType {
  pendingCount: number;
  setPendingCount: (count: number) => void;
}

const NotificationContext = createContext<NotificationContextType>({
  pendingCount: 0,
  setPendingCount: () => {},
});

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [pendingCount, setPendingCount] = useState(0);

  return (
    <NotificationContext.Provider value={{ pendingCount, setPendingCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
