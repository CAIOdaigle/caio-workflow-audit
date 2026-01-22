import { useState, useEffect } from 'react';

const STORAGE_KEY = 'caio-workflow-audit';

export const useLocalStorage = () => {
  const [data, setData] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }
    return {
      entries: [],
      reflections: {
        mostSurprisingCategory: null,
        surpriseExplanation: '',
        biggestOpportunity: ''
      },
      completedAt: null,
      lastUpdated: new Date().toISOString()
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        ...data,
        lastUpdated: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, [data]);

  const addEntry = (entry) => {
    setData(prev => ({
      ...prev,
      entries: [...prev.entries, entry]
    }));
  };

  const updateEntry = (id, updates) => {
    setData(prev => ({
      ...prev,
      entries: prev.entries.map(entry =>
        entry.id === id ? { ...entry, ...updates } : entry
      )
    }));
  };

  const deleteEntry = (id) => {
    setData(prev => ({
      ...prev,
      entries: prev.entries.filter(entry => entry.id !== id)
    }));
  };

  const setEntries = (entries) => {
    setData(prev => ({
      ...prev,
      entries
    }));
  };

  const updateReflections = (reflections) => {
    setData(prev => ({
      ...prev,
      reflections: { ...prev.reflections, ...reflections }
    }));
  };

  const markComplete = () => {
    setData(prev => ({
      ...prev,
      completedAt: new Date().toISOString()
    }));
  };

  const clearAllData = () => {
    setData({
      entries: [],
      reflections: {
        mostSurprisingCategory: null,
        surpriseExplanation: '',
        biggestOpportunity: ''
      },
      completedAt: null,
      lastUpdated: new Date().toISOString()
    });
  };

  return {
    entries: data.entries,
    reflections: data.reflections,
    completedAt: data.completedAt,
    lastUpdated: data.lastUpdated,
    addEntry,
    updateEntry,
    deleteEntry,
    setEntries,
    updateReflections,
    markComplete,
    clearAllData
  };
};
