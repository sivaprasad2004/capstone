import { Sun, Moon, Save, Download, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import type { ThemeType } from '../types';

interface TopbarProps {
  theme: ThemeType;
  toggleTheme: () => void;
  fileName: string;
  isUnsaved: boolean;
  onSave: () => void;
  onSaveAs: () => void;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

export function Topbar({ theme, toggleTheme, fileName, isUnsaved, onSave, onSaveAs, isSidebarOpen, setIsSidebarOpen }: TopbarProps) {
  return (
    <header className="h-14 border-b border-border flex items-center justify-between px-4 bg-background/50 backdrop-blur-md sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
        </button>
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm font-medium text-foreground">{fileName}</span>
          {isUnsaved && (
            <span className="flex items-center gap-1 text-[11px] font-medium text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block animate-pulse"></span>
              Unsaved
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onSave}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title="Save (Ctrl+S)"
        >
          <Save size={16} />
          <span>Save</span>
        </button>
        <button
          onClick={onSaveAs}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title="Save As (Ctrl+Shift+S)"
        >
          <Download size={16} />
          <span>Save As</span>
        </button>
        <div className="w-px h-4 bg-border mx-2"></div>
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </header>
  );
}
