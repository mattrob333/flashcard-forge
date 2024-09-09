import { useState } from 'react';

export const useFileUpload = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [questionCount, setQuestionCount] = useState(0);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles(prevFiles => [...prevFiles, ...files]);
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    countQuestions(file);
  };

  const countQuestions = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const lines = content.split('\n').filter(line => line.trim() !== '');
      setQuestionCount(lines.length);
    };
    reader.readAsText(file);
  };

  return {
    uploadedFiles,
    selectedFile,
    questionCount,
    setSelectedFile,
    handleFileUpload,
    handleFileSelect
  };
};