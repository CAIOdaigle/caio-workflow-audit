import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'caio-workflow-audit';

const getDefaultData = () => ({
  entries: [],
  reflections: {
    mostSurprisingCategory: null,
    surpriseExplanation: '',
    biggestOpportunity: ''
  },
  completedAt: null,
  lastUpdated: new Date().toISOString()
});

// Validate data structure to handle corrupted localStorage
const validateData = (data) => {
  if (!data || typeof data !== 'object') return false;
  if (!Array.isArray(data.entries)) return false;
  if (!data.reflections || typeof data.reflections !== 'object') return false;
  return true;
};

export const useLocalStorage = (onStorageError) => {
  const [data, setData] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (validateData(parsed)) {
          return parsed;
        }
        console.warn('Invalid localStorage data structure, using defaults');
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error);
    }
    return getDefaultData();
  });

  const [storageError, setStorageError] = useState(null);

  useEffect(() => {
    try {
      const dataToSave = JSON.stringify({
        ...data,
        lastUpdated: new Date().toISOString()
      });

      // Check approximate size before saving (localStorage limit is ~5MB)
      const sizeInMB = new Blob([dataToSave]).size / (1024 * 1024);
      if (sizeInMB > 4.5) {
        const error = new Error('Storage limit approaching. Consider exporting your data.');
        setStorageError(error);
        onStorageError?.('warning', 'Storage is almost full. Consider exporting your data to PDF or CSV.');
        return;
      }

      localStorage.setItem(STORAGE_KEY, dataToSave);
      setStorageError(null);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
      setStorageError(error);

      // Check if it's a quota exceeded error
      if (error.name === 'QuotaExceededError' ||
          error.message?.includes('quota') ||
          error.code === 22) {
        onStorageError?.('error', 'Storage is full. Please export your data and clear some entries.');
      } else {
        onStorageError?.('error', 'Failed to save data. Your changes may not persist.');
      }
    }
  }, [data, onStorageError]);

  const addEntry = useCallback((entry) => {
    setData(prev => ({
      ...prev,
      entries: [...prev.entries, entry]
    }));
  }, []);

  const updateEntry = useCallback((id, updates) => {
    setData(prev => {
      const entryExists = prev.entries.some(entry => entry.id === id);
      if (!entryExists) {
        console.warn(`Entry with id ${id} not found for update`);
        return prev;
      }
      return {
        ...prev,
        entries: prev.entries.map(entry =>
          entry.id === id ? { ...entry, ...updates } : entry
        )
      };
    });
  }, []);

  const deleteEntry = useCallback((id) => {
    setData(prev => ({
      ...prev,
      entries: prev.entries.filter(entry => entry.id !== id)
    }));
  }, []);

  const setEntries = useCallback((entries) => {
    setData(prev => ({
      ...prev,
      entries
    }));
  }, []);

  const updateReflections = useCallback((reflections) => {
    setData(prev => ({
      ...prev,
      reflections: { ...prev.reflections, ...reflections }
    }));
  }, []);

  const markComplete = useCallback(() => {
    setData(prev => ({
      ...prev,
      completedAt: new Date().toISOString()
    }));
  }, []);

  const clearAllData = useCallback(() => {
    setData(getDefaultData());
  }, []);

  return {
    entries: data.entries,
    reflections: data.reflections,
    completedAt: data.completedAt,
    lastUpdated: data.lastUpdated,
    storageError,
    addEntry,
    updateEntry,
    deleteEntry,
    setEntries,
    updateReflections,
    markComplete,
    clearAllData
  };
};
