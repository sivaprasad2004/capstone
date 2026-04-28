import { useEffect } from 'react';

interface ShortcutsHandlers {
  onSave: () => void;
  onSaveAs: () => void;
}

export function useKeyboardShortcuts({ onSave, onSaveAs }: ShortcutsHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (e.shiftKey) {
          onSaveAs();
        } else {
          onSave();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onSave, onSaveAs]);
}
