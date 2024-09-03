import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

const Flashcards = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cardsPerSet, setCardsPerSet] = useState(10);
  const [showAnswer, setShowAnswer] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);

  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setUploadedFile(file);
  };

  const handleGenerateFlashcards = () => {
    if (!uploadedFile) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const lines = content.split('\n');
      const cards = lines.map(line => {
        const [question, answer] = line.split(',');
        return { question: question.trim(), answer: answer.trim() };
      });
      setFlashcards(cards);
    };
    reader.readAsText(uploadedFile);
  };

  const handleCardsPerSetChange = (event) => {
    setCardsPerSet(parseInt(event.target.value, 10));
  };

  const handleNextCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
    setShowAnswer(false);
  };

  const handlePrevCard = () => {
    setCurrentCardIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
    setShowAnswer(false);
  };

  const toggleAnswer = () => {
    setShowAnswer(!showAnswer);
  };

  return (
    <div className="container mx-auto p-4 min-h-screen bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Flashcard App</h1>
      <div className="mb-6 space-y-4">
        <div>
          <Input type="file" accept=".csv" onChange={handleFileUpload} className="mb-2 bg-gray-800 text-white" />
          <Button onClick={handleGenerateFlashcards} className="w-full">Generate Flashcards</Button>
        </div>
        <div className="flex items-center space-x-2">
          <Input
            type="number"
            value={cardsPerSet}
            onChange={handleCardsPerSetChange}
            min="1"
            className="w-20 bg-gray-800 text-white"
          />
          <span>Cards per set</span>
        </div>
      </div>
      {flashcards.length > 0 && (
        <div className="mt-8">
          <Card className="w-full max-w-md mx-auto p-6 bg-gray-800 text-white">
            <div className="text-center mb-4">
              <span className="text-sm text-gray-400">
                Card {currentCardIndex + 1} of {flashcards.length}
              </span>
            </div>
            <div className="min-h-[200px] flex items-center justify-center">
              {showAnswer ? (
                <p className="text-xl">{flashcards[currentCardIndex].answer}</p>
              ) : (
                <p className="text-xl">{flashcards[currentCardIndex].question}</p>
              )}
            </div>
            <Button onClick={toggleAnswer} className="w-full mt-4">
              {showAnswer ? 'Show Question' : 'Show Answer'}
            </Button>
            <div className="flex justify-between mt-4">
              <Button onClick={handlePrevCard} variant="outline" className="border-gray-600">
                <ChevronLeftIcon className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <Button onClick={handleNextCard} variant="outline" className="border-gray-600">
                Next
                <ChevronRightIcon className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Flashcards;