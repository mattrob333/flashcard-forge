import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import FlashcardTable from '../components/FlashcardTable';
import FlashcardStudy from '../components/FlashcardStudy';

const Flashcards = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cardsPerSet, setCardsPerSet] = useState(10);
  const [showAnswer, setShowAnswer] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [reviewingDifficult, setReviewingDifficult] = useState(false);
  const [randomize, setRandomize] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles(prevFiles => [...prevFiles, ...files]);
  };

  const handleGenerateFlashcards = () => {
    if (!selectedFile) {
      toast.error("Please select a file to study.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const lines = content.split('\n');
      let cards = lines
        .filter(line => line.trim() !== '')
        .map((line, index) => {
          const [question, ...answerParts] = line.split(',');
          const answer = answerParts.join(',').trim();
          
          if (!question || !answer) {
            toast.error(`Invalid line in CSV: ${line}`);
            return null;
          }
          return { id: index, question: question.trim(), answer, isDifficult: false };
        })
        .filter(card => card !== null);

      if (cards.length === 0) {
        toast.error("No valid flashcards found in the CSV file.");
        return;
      }

      if (randomize) {
        cards = shuffleArray(cards);
      }

      cards = cards.slice(0, cardsPerSet);

      setFlashcards(cards);
      setCurrentCardIndex(0);
      setReviewingDifficult(false);
      toast.success(`Generated ${cards.length} flashcards.`);
    };
    reader.readAsText(selectedFile);
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleCardsPerSetChange = (event) => {
    setCardsPerSet(parseInt(event.target.value, 10));
  };

  const handleNextCard = () => {
    const currentSet = reviewingDifficult ? flashcards.filter(card => card.isDifficult) : flashcards;
    if (currentSet.length === 0) {
      toast.error("No cards to review.");
      return;
    }
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % currentSet.length);
    setShowAnswer(false);
  };

  const handlePrevCard = () => {
    const currentSet = reviewingDifficult ? flashcards.filter(card => card.isDifficult) : flashcards;
    if (currentSet.length === 0) {
      toast.error("No cards to review.");
      return;
    }
    setCurrentCardIndex((prevIndex) => (prevIndex - 1 + currentSet.length) % currentSet.length);
    setShowAnswer(false);
  };

  const toggleAnswer = () => setShowAnswer(!showAnswer);

  const toggleDifficult = () => {
    setFlashcards(cards =>
      cards.map((card, index) =>
        index === currentCardIndex ? { ...card, isDifficult: !card.isDifficult } : card
      )
    );
  };

  const handleFileSelect = (file) => setSelectedFile(file);

  const toggleTableView = () => setShowTable(!showTable);

  const toggleReviewDifficult = () => {
    const difficultCards = flashcards.filter(card => card.isDifficult);
    if (difficultCards.length === 0) {
      toast.error("No difficult cards to review.");
      return;
    }
    setReviewingDifficult(!reviewingDifficult);
    setCurrentCardIndex(0);
    setShowAnswer(false);
  };

  const getCurrentCard = () => {
    const currentSet = reviewingDifficult ? flashcards.filter(card => card.isDifficult) : flashcards;
    return currentSet[currentCardIndex] || null;
  };

  return (
    <div className="container mx-auto p-4 min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Flashcard App</h1>
      <div className="mb-6 space-y-4">
        <div>
          <Input type="file" accept=".csv" onChange={handleFileUpload} multiple className="mb-2 bg-gray-800 text-white" />
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
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="cardsPerSet">Cards per set:</Label>
            <Input
              id="cardsPerSet"
              type="number"
              value={cardsPerSet}
              onChange={handleCardsPerSetChange}
              min="1"
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
        <Button onClick={handleGenerateFlashcards} className="w-full">Generate Flashcards</Button>
      </div>
      {flashcards.length > 0 && (
        <>
          <div className="flex justify-between mb-4">
            <Button onClick={toggleTableView}>
              {showTable ? "Hide Table View" : "Show Table View"}
            </Button>
            <Button onClick={toggleReviewDifficult} variant={reviewingDifficult ? "default" : "outline"}>
              {reviewingDifficult ? "Exit Difficult Review" : "Review Difficult"}
            </Button>
          </div>
          {showTable ? (
            <FlashcardTable flashcards={flashcards} setFlashcards={setFlashcards} />
          ) : (
            <FlashcardStudy
              currentCard={getCurrentCard()}
              showAnswer={showAnswer}
              toggleAnswer={toggleAnswer}
              toggleDifficult={toggleDifficult}
              handlePrevCard={handlePrevCard}
              handleNextCard={handleNextCard}
              currentIndex={currentCardIndex}
              totalCards={reviewingDifficult ? flashcards.filter(card => card.isDifficult).length : flashcards.length}
              reviewingDifficult={reviewingDifficult}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Flashcards;