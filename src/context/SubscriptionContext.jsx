import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const SubscriptionContext = createContext();

export const useSubscriptions = () => useContext(SubscriptionContext);

const LOCAL_STORAGE_KEY = 'submanager_data_v1';

export const SubscriptionProvider = ({ children }) => {
  const [subscriptions, setSubscriptions] = useState(() => {
    try {
      const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedData) {
        return JSON.parse(savedData);
      }
    } catch (e) {
      console.error("Failed to load subs", e);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(subscriptions));
  }, [subscriptions]);

  const addSubscription = (sub) => {
    setSubscriptions([...subscriptions, { ...sub, id: uuidv4(), createdAt: new Date().toISOString() }]);
  };

  const updateSubscription = (updatedSub) => {
    setSubscriptions(subscriptions.map(sub => sub.id === updatedSub.id ? updatedSub : sub));
  };

  const deleteSubscription = (id) => {
    setSubscriptions(subscriptions.filter(sub => sub.id !== id));
  };

  const getTotalMonthlySpend = () => {
    return subscriptions.reduce((total, sub) => {
      let monthlyCost = 0;
      const amount = parseFloat(sub.amount) || 0;
      
      if (sub.cycleType === 'monthly') {
        monthlyCost = amount;
      } else if (sub.cycleType === 'yearly') {
        monthlyCost = amount / 12;
      } else if (sub.cycleType === 'custom-months' && sub.cycleCount) {
        monthlyCost = amount / parseInt(sub.cycleCount, 10);
      }
      
      return total + monthlyCost;
    }, 0);
  };

  return (
    <SubscriptionContext.Provider value={{
      subscriptions,
      addSubscription,
      updateSubscription,
      deleteSubscription,
      getTotalMonthlySpend
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};
