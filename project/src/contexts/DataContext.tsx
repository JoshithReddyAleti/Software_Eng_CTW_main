import React, { createContext, useContext, useState, useEffect } from 'react';
import { Property, Message } from '../types';
import { mockProperties, mockMessages } from '../data/mockData';

interface DataContextType {
  properties: Property[];
  messages: Message[];
  addProperty: (property: Omit<Property, 'id' | 'createdAt'>) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  toggleFavorite: (userId: string, propertyId: string) => void;
  getUserFavorites: (userId: string) => string[];
  getPropertyById: (id: string) => Property | undefined;
  getMessagesByProperty: (propertyId: string) => Message[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [favorites, setFavorites] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const storedFavorites = localStorage.getItem('userFavorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  const addProperty = (propertyData: Omit<Property, 'id' | 'createdAt'>) => {
    const newProperty: Property = {
      ...propertyData,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    setProperties(prev => [newProperty, ...prev]);
  };

  const addMessage = (messageData: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...messageData,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const toggleFavorite = (userId: string, propertyId: string) => {
    setFavorites(prev => {
      const userFavorites = prev[userId] || [];
      const isCurrentlyFavorite = userFavorites.includes(propertyId);
      
      const newFavorites = {
        ...prev,
        [userId]: isCurrentlyFavorite
          ? userFavorites.filter(id => id !== propertyId)
          : [...userFavorites, propertyId]
      };
      
      localStorage.setItem('userFavorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const getUserFavorites = (userId: string): string[] => {
    return favorites[userId] || [];
  };

  const getPropertyById = (id: string): Property | undefined => {
    return properties.find(property => property.id === id);
  };

  const getMessagesByProperty = (propertyId: string): Message[] => {
    return messages.filter(message => message.propertyId === propertyId);
  };

  const value: DataContextType = {
    properties,
    messages,
    addProperty,
    addMessage,
    toggleFavorite,
    getUserFavorites,
    getPropertyById,
    getMessagesByProperty,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};