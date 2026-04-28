import { useState, useEffect } from 'react';
import type { FileData } from '../types';

export function useHistory() {
  const [history, setHistory] = useState<FileData[]>(() => {
    try {
      const saved = localStorage.getItem('editor-history');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to parse history', e);
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('editor-history', JSON.stringify(history));
  }, [history]);

  const saveToHistory = (file: FileData) => {
    setHistory((prev) => {
      const existing = prev.findIndex((f) => f.id === file.id);
      if (existing >= 0) {
        const next = [...prev];
        next[existing] = file;
        return next;
      }
      return [file, ...prev];
    });
  };

  const deleteFromHistory = (id: string) => {
    setHistory((prev) => prev.filter((f) => f.id !== id));
  };

  return { history, saveToHistory, deleteFromHistory };
}
