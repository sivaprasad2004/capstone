import MonacoEditor, { useMonaco } from '@monaco-editor/react';
import { useEffect } from 'react';
import type { ThemeType, FileFormat } from '../types';

interface EditorProps {
  content: string;
  onChange: (value: string | undefined) => void;
  format: FileFormat;
  theme: ThemeType;
}

export function Editor({ content, onChange, format, theme }: EditorProps) {
  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme('minimal-light', {
        base: 'vs',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#f8fafc',
          'editor.lineHighlightBackground': '#f1f5f9',
          'editorLineNumber.foreground': '#94a3b8',
          'editorIndentGuide.background': '#e2e8f0',
        },
      });

      monaco.editor.defineTheme('minimal-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#09090b',
          'editor.lineHighlightBackground': '#27272a',
          'editorLineNumber.foreground': '#52525b',
          'editorIndentGuide.background': '#27272a',
        },
      });
    }
  }, [monaco]);

  const editorTheme = theme === 'dark' ? 'minimal-dark' : 'minimal-light';

  return (
    <div className="w-full h-full p-4 overflow-hidden">
      <div className="w-full h-full rounded-xl overflow-hidden border border-border shadow-sm">
        <MonacoEditor
          value={content}
          onChange={onChange}
          language={format === 'plaintext' ? 'plaintext' : format}
          theme={monaco ? editorTheme : theme === 'dark' ? 'vs-dark' : 'light'}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
            lineHeight: 1.6,
            padding: { top: 16, bottom: 16 },
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            formatOnPaste: true,
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            renderLineHighlight: 'all',
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
          }}
          loading={
            <div className="flex items-center justify-center w-full h-full text-muted-foreground">
              Loading editor...
            </div>
          }
        />
      </div>
    </div>
  );
}
