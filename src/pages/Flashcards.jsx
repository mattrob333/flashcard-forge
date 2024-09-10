import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import FlashcardTable from '../components/FlashcardTable';
import FlashcardStudy from '../components/FlashcardStudy';
import Instructions from '../components/Instructions';
import { useFlashcards } from '../hooks/useFlashcards';
import { useFileUpload } from '../hooks/useFileUpload';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

const Flashcards = () => {
  const [showTable, setShowTable] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showCreationTools, setShowCreationTools] = useState(true);
  const { 
    flashcards, 
    setFlashcards, 
    currentCardIndex, 
    cardsPerSet, 
    setCardsPerSet, 
    randomize, 
    setRandomize, 
    reviewingMissed,
    handleGenerateFlashcards, 
    toggleMissed, 
    getCurrentCard,
    handleNextCard,
    handlePrevCard,
    toggleReviewMissed
  } = useFlashcards();
  const { uploadedFiles, selectedFile, questionCount, setSelectedFile, handleFileUpload, handleFileSelect } = useFileUpload();

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const toggleTableView = () => setShowTable(!showTable);
  const toggleCreationTools = () => setShowCreationTools(!showCreationTools);

  const handleGenerateClick = () => {
    if (selectedFile) {
      handleGenerateFlashcards(selectedFile);
      setShowCreationTools(false);
    } else {
      toast.error("Please select a file before generating flashcards.");
    }
  };

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  return (
    <div className="container mx-auto p-4 min-h-screen bg-gray-900 text-white">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Flash Card Creator</h1>
        <Instructions />
      </header>
      {flashcards.length > 0 && (
        <Button onClick={toggleCreationTools} className="mb-4 w-full">
          {showCreationTools ? 'Hide Creation Tools' : 'Show Creation Tools'}
          {showCreationTools ? <ChevronUpIcon className="ml-2" /> : <ChevronDownIcon className="ml-2" />}
        </Button>
      )}
      {(showCreationTools || flashcards.length === 0) && (
        <div className="mb-6 space-y-4">
          <div>
            <Input 
              type="file" 
              accept=".csv" 
              onChange={handleFileUpload} 
              multiple 
              className="mb-2 bg-gray-800 text-gray-300 file:text-gray-100" 
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {uploadedFiles.map((file, index) => (
                <Button
                  key={index}
                  onClick={() => handleFileSelect(file)}
                  variant={selectedFile === file ? "default" : "outline"}
                  className="text-sm"
                >
                  {file.name}
                </Button>
              ))}
            </div>
            {selectedFile && (
              <p className="mt-2 text-sm text-gray-400">
                Selected file contains {questionCount} questions.
              </p>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="cardsPerSet">Cards per set:</Label>
              <Input
                id="cardsPerSet"
                type="number"
                value={cardsPerSet}
                onChange={(e) => setCardsPerSet(parseInt(e.target.value, 10))}
                min="1"
                max={questionCount}
                className="w-20 bg-gray-800 text-white"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="randomize">Randomize:</Label>
              <Switch
                id="randomize"
                checked={randomize}
                onCheckedChange={setRandomize}
              />
            </div>
          </div>
          <Button onClick={handleGenerateClick} className="w-full">Generate Flashcards</Button>
        </div>
      )}
      {flashcards.length > 0 && (
        <>
          <div className="flex justify-between mb-4">
            <Button onClick={toggleTableView}>
              {showTable ? "Hide Table View" : "Show Table View"}
            </Button>
            <Button onClick={toggleReviewMissed} variant={reviewingMissed ? "default" : "outline"}>
              {reviewingMissed ? "Exit Missed Review" : "Review Missed"}
            </Button>
          </div>
          {showTable ? (
            <FlashcardTable flashcards={flashcards} setFlashcards={setFlashcards} />
          ) : (
            <div className="flex justify-center items-center min-h-[60vh]">
              <FlashcardStudy
                currentCard={getCurrentCard()}
                showAnswer={showAnswer}
                setShowAnswer={setShowAnswer}
                toggleAnswer={toggleAnswer}
                toggleMissed={toggleMissed}
                handlePrevCard={handlePrevCard}
                handleNextCard={handleNextCard}
                currentIndex={currentCardIndex}
                totalCards={reviewingMissed ? flashcards.filter(card => card.isMissed).length : flashcards.length}
                reviewingMissed={reviewingMissed}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Flashcards;