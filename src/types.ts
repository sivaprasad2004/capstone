export type FileFormat = 'javascript' | 'typescript' | 'python' | 'java' | 'html' | 'css' | 'plaintext';

export interface FileData {
  id: string;
  name: string;
  format: FileFormat;
  content: string;
  lastSaved: number;
}

export type ThemeType = 'light' | 'dark';
