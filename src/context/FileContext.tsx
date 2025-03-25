import React, { createContext, useContext, useState, useCallback } from 'react';
import toast from 'react-hot-toast';

interface FileContextType {
  // files: FileItem[];
  setFiles: React.Dispatch<React.SetStateAction<[]>>;
  addFile: (file: FileItem) => Promise<void>;
  removeFile: (id: string) => Promise<void>;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export function FileProvider({ children }: { children: React.ReactNode }) {
  const [files, setFiles] = useState<[]>([]);

  const addFile = useCallback(async (file: FileItem) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setFiles(prev => {
        // Check for duplicate files
        if (prev.some(f => f.name === file.name)) {
          throw new Error(`Eine Datei mit dem Namen "${file.name}" existiert bereits`);
        }
        return [...prev, file];
      });
    } catch (error) {
      toast.error(error, 'FileAdd');
      throw error; // Re-throw to handle in component
    }
  }, []);
  

  const removeFile = useCallback(async (id: string) => {
    // try {
    //   await retryOperation(async () => {
    //     // Simulate API call - replace with actual API call
    //     await new Promise(resolve => setTimeout(resolve, 500));
        
    //     setFiles(prev => {
    //       const file = prev.find(f => f.id === id);
    //       if (!file) {
    //         throw new Error('Datei nicht gefunden');
    //       }
          
    //       // Cleanup URL object to prevent memory leaks
    //       URL.revokeObjectURL(file.url);
          
    //       return prev.filter(f => f.id !== id);
    //     });
        
    //     toast.success('Datei wurde erfolgreich gelöscht');
    //   });
    // } catch (error) {
    //   toast.error(error, 'FileRemove');
    //   throw error;
    // }
  }, []);

  return (
    <FileContext.Provider value={{ files, setFiles, addFile, removeFile }}>
      {children}
    </FileContext.Provider>
  );
}

export function useFiles() {
  const context = useContext(FileContext);
  if (context === undefined) {
    throw new Error('useFiles must be used within a FileProvider');
  }
  return context;
}