import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save } from 'lucide-react';
import type { FileFormat } from '../types';

interface SaveAsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (fileName: string, format: FileFormat) => void;
  defaultName: string;
  defaultFormat: FileFormat;
}

const FORMATS: { value: FileFormat; label: string; ext: string }[] = [
  { value: 'javascript', label: 'JavaScript', ext: '.js' },
  { value: 'typescript', label: 'TypeScript', ext: '.ts' },
  { value: 'python', label: 'Python', ext: '.py' },
  { value: 'java', label: 'Java', ext: '.java' },
  { value: 'html', label: 'HTML', ext: '.html' },
  { value: 'css', label: 'CSS', ext: '.css' },
  { value: 'plaintext', label: 'Plain Text', ext: '.txt' },
];

export function SaveAsModal({ isOpen, onClose, onSave, defaultName, defaultFormat }: SaveAsModalProps) {
  const [fileName, setFileName] = useState('');
  const [format, setFormat] = useState<FileFormat>(defaultFormat);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const nameWithoutExt = defaultName.includes('.') 
        ? defaultName.substring(0, defaultName.lastIndexOf('.'))
        : defaultName;
      setFileName(nameWithoutExt);
      setFormat(defaultFormat);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, defaultName, defaultFormat]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim()) return;
    onSave(fileName.trim(), format);
    onClose();
  };

  const selectedExt = FORMATS.find(f => f.value === format)?.ext || '.txt';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-background border border-border shadow-2xl rounded-xl z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h3 className="text-lg font-semibold">Save File As</h3>
              <button
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-muted"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">File Name</label>
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="untitled"
                    className="flex-1 bg-muted border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    required
                  />
                  <span className="text-muted-foreground font-mono bg-muted border border-border rounded-md px-3 py-2 text-sm">
                    {selectedExt}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Format</label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as FileFormat)}
                  className="w-full bg-muted border border-border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
                >
                  {FORMATS.map((f) => (
                    <option key={f.value} value={f.value}>
                      {f.label} ({f.ext})
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-foreground text-background hover:opacity-90 transition-opacity"
                >
                  <Save size={16} />
                  <span>Save File</span>
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
