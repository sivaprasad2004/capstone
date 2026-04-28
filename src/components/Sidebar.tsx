import { motion, AnimatePresence } from 'framer-motion';
import { FileCode, FileText, FileJson, Clock, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { FileData } from '../types';

interface SidebarProps {
  isOpen: boolean;
  history: FileData[];
  onSelectFile: (file: FileData) => void;
  onDeleteFile: (id: string) => void;
  currentFileId: string | null;
}

const getFileIcon = (format: string) => {
  switch (format) {
    case 'javascript':
    case 'typescript':
    case 'python':
    case 'java':
      return <FileCode size={16} className="text-blue-500" />;
    case 'html':
    case 'css':
      return <FileCode size={16} className="text-orange-500" />;
    case 'json':
      return <FileJson size={16} className="text-yellow-500" />;
    default:
      return <FileText size={16} className="text-gray-500" />;
  }
};

export function Sidebar({ isOpen, history, onSelectFile, onDeleteFile, currentFileId }: SidebarProps) {
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="h-screen bg-background border-r border-border overflow-hidden flex flex-col relative z-10 shrink-0"
          >
            <div className="h-14 px-4 border-b border-border flex items-center justify-between min-w-[280px]">
              <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">History</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto py-2 min-w-[280px]">
              {history.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No saved files yet.
                </div>
              ) : (
                <ul className="space-y-1 px-2">
                  {history.map((file) => (
                    <li key={file.id}>
                      <button
                        onClick={() => onSelectFile(file)}
                        className={`w-full flex items-start gap-3 p-2 rounded-md text-left transition-colors group ${
                          currentFileId === file.id ? 'bg-muted/80 text-foreground' : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <div className="mt-0.5">{getFileIcon(file.format)}</div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <div className="flex items-center gap-1 text-[11px] text-muted-foreground/70 mt-1">
                            <Clock size={10} />
                            <span>{formatDistanceToNow(file.lastSaved, { addSuffix: true })}</span>
                          </div>
                        </div>
                        <div 
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-background rounded transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteFile(file.id);
                          }}
                        >
                          <Trash2 size={14} className="text-red-500/70 hover:text-red-500" />
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
