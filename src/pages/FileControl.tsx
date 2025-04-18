import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiFolder, FiFile, FiUpload, FiDownload, FiTrash2, FiFolderPlus } from 'react-icons/fi';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: string;
  modified: string;
}

const mockFiles: FileItem[] = [
  { id: '1', name: 'Documents', type: 'folder', modified: '2024-01-20 10:00' },
  { id: '2', name: 'report.pdf', type: 'file', size: '2.5 MB', modified: '2024-01-19 15:30' },
  { id: '3', name: 'Images', type: 'folder', modified: '2024-01-18 09:45' },
  { id: '4', name: 'data.xlsx', type: 'file', size: '1.8 MB', modified: '2024-01-17 14:20' }
];

const FileControl = () => {
  const [files] = useState<FileItem[]>(mockFiles);
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);

  const toggleFileSelection = (id: string) => {
    setSelectedFiles(prev => 
      prev.includes(id) 
        ? prev.filter(fileId => fileId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="content-panel">
      <div className="content-panel-header">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-white">File Manager</h1>
          <div className="flex gap-2">
            <button className="btn-ghost">
              <FiUpload className="mr-2" />
              Upload
            </button>
            <button className="btn-ghost">
              <FiFolderPlus className="mr-2" />
              New Folder
            </button>
            <button 
              className="btn-ghost text-red-500"
              disabled={selectedFiles.length === 0}
            >
              <FiTrash2 className="mr-2" />
              Delete
            </button>
          </div>
        </div>

        <div className="flex items-center text-sm text-slate-400">
          <span>Home</span>
          <span className="mx-2">/</span>
          <span>Documents</span>
        </div>
      </div>

      <div className="content-panel-body">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {files.map((file) => (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`bg-slate-800 rounded-lg p-4 cursor-pointer transition-colors ${
                selectedFiles.includes(file.id) ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => toggleFileSelection(file.id)}
            >
              <div className="flex items-start">
                {file.type === 'folder' ? (
                  <FiFolder className="text-3xl text-blue-500" />
                ) : (
                  <FiFile className="text-3xl text-slate-400" />
                )}
                <div className="ml-3 flex-1">
                  <p className="text-white font-medium truncate">{file.name}</p>
                  <p className="text-sm text-slate-400">
                    {file.type === 'folder' ? (
                      'Folder'
                    ) : (
                      file.size
                    )}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">{file.modified}</p>
                </div>
                {file.type === 'file' && (
                  <button 
                    className="ml-2 p-2 hover:bg-slate-700 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle download
                    }}
                  >
                    <FiDownload className="text-slate-400" />
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FileControl;