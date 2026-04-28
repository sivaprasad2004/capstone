import { useState, useCallback, useRef } from 'react';
import { useTheme } from './hooks/useTheme';
import { useHistory } from './hooks/useHistory';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Editor } from './components/Editor';
import { SaveAsModal } from './components/SaveAsModal';
import type { FileData, FileFormat } from './types';

const getExtension = (format: FileFormat) => {
  const map: Record<FileFormat, string> = {
    javascript: '.js',
    typescript: '.ts',
    python: '.py',
    java: '.java',
    html: '.html',
    css: '.css',
    plaintext: '.txt',
  };
  return map[format] || '.txt';
};

const getFormatFromExtension = (ext: string): FileFormat => {
  const map: Record<string, FileFormat> = {
    'js': 'javascript',
    'ts': 'typescript',
    'py': 'python',
    'java': 'java',
    'html': 'html',
    'css': 'css',
    'txt': 'plaintext',
  };
  return map[ext] || 'plaintext';
};

function App() {
  const { theme, toggleTheme } = useTheme();
  const { history, saveToHistory, deleteFromHistory } = useHistory();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const [currentFile, setCurrentFile] = useState<FileData>({
    id: crypto.randomUUID(),
    name: 'untitled.js',
    format: 'javascript',
    content: '// Start coding here...',
    lastSaved: Date.now(),
  });
  
  const [isUnsaved, setIsUnsaved] = useState(false);
  
  const fileContentRef = useRef(currentFile.content);

  const handleEditorChange = useCallback((value: string | undefined) => {
    const val = value || '';
    fileContentRef.current = val;
    setIsUnsaved(true);
  }, []);

  const triggerDownload = (fileName: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSave = useCallback(() => {
    const updatedFile = {
      ...currentFile,
      content: fileContentRef.current,
      lastSaved: Date.now(),
    };
    setCurrentFile(updatedFile);
    saveToHistory(updatedFile);
    triggerDownload(updatedFile.name, fileContentRef.current);
    setIsUnsaved(false);
  }, [currentFile, saveToHistory]);

  const handleSaveAs = useCallback(() => {
    setIsSaveModalOpen(true);
  }, []);

  useKeyboardShortcuts({
    onSave: handleSave,
    onSaveAs: handleSaveAs,
  });

  const handleSaveModalConfirm = (name: string, format: FileFormat) => {
    const ext = getExtension(format);
    const finalName = name.endsWith(ext) ? name : `${name}${ext}`;
    
    const newFile: FileData = {
      id: crypto.randomUUID(),
      name: finalName,
      format,
      content: fileContentRef.current,
      lastSaved: Date.now(),
    };
    
    setCurrentFile(newFile);
    saveToHistory(newFile);
    triggerDownload(newFile.name, fileContentRef.current);
    setIsUnsaved(false);
  };

  const handleSelectHistoryItem = (file: FileData) => {
    if (isUnsaved) {
      if (!window.confirm('You have unsaved changes. Do you want to load another file anyway?')) {
        return;
      }
    }
    setCurrentFile(file);
    fileContentRef.current = file.content;
    setIsUnsaved(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      const format = getFormatFromExtension(ext);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        if (content) {
          if (isUnsaved) {
            if (!window.confirm('You have unsaved changes. Do you want to load the dropped file anyway?')) {
              return;
            }
          }
          
          const newFile: FileData = {
            id: crypto.randomUUID(),
            name: file.name,
            format,
            content,
            lastSaved: Date.now(),
          };
          setCurrentFile(newFile);
          fileContentRef.current = content;
          setIsUnsaved(false);
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div 
      className="flex h-screen w-full bg-background text-foreground overflow-hidden"
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <Sidebar 
        isOpen={isSidebarOpen} 
        history={history}
        onSelectFile={handleSelectHistoryItem}
        onDeleteFile={deleteFromHistory}
        currentFileId={currentFile.id}
      />
      
      <main className="flex-1 min-w-0 flex flex-col relative h-full w-full">
        <Topbar 
          theme={theme} 
          toggleTheme={toggleTheme}
          fileName={currentFile.name}
          isUnsaved={isUnsaved}
          onSave={handleSave}
          onSaveAs={handleSaveAs}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        
        <Editor 
          content={currentFile.content}
          onChange={handleEditorChange}
          format={currentFile.format}
          theme={theme}
        />
        
        {isDragging && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center border-4 border-dashed border-primary/50 m-4 rounded-2xl pointer-events-none">
            <div className="text-center">
              <div className="text-primary text-6xl mb-4 opacity-50">+</div>
              <h2 className="text-2xl font-semibold text-foreground">Drop file to open</h2>
              <p className="text-muted-foreground mt-2">Loads file content into the editor</p>
            </div>
          </div>
        )}
      </main>

      <SaveAsModal 
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onSave={handleSaveModalConfirm}
        defaultName={currentFile.name}
        defaultFormat={currentFile.format}
      />
    </div>
  );
}

export default App;
