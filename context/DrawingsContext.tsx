// Global context for historical Powerball drawings data
// Loads CSV once and provides to all components

'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Drawing } from '@/lib/types';
import { loadDrawings } from '@/lib/csv-loader';

interface DrawingsContextType {
  drawings: Drawing[];
  loading: boolean;
  error: string | null;
}

const DrawingsContext = createContext<DrawingsContextType>({
  drawings: [],
  loading: true,
  error: null
});

export function DrawingsProvider({ children }: { children: ReactNode }) {
  const [drawings, setDrawings] = useState<Drawing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDrawings()
      .then(data => {
        setDrawings(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Failed to load drawings');
        setLoading(false);
      });
  }, []);

  return (
    <DrawingsContext.Provider value={{ drawings, loading, error }}>
      {children}
    </DrawingsContext.Provider>
  );
}

export function useDrawings() {
  return useContext(DrawingsContext);
}
