import { useState } from 'react';

export const useFileUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles(prevFiles => [...prevFiles, ...files]);
  };

  const handleFileSelect = (file) => setSelectedFile(file);

  return {
    uploadedFiles,
    selectedFile,
    setSelectedFile,
    handleFileUpload,
    handleFileSelect
  };
};