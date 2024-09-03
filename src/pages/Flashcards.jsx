import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

const Flashcards = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cardsPerSet, setCardsPerSet] = useState(10);
  const [showAnswer, setShowAnswer] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
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
    reader.readAsText(file);
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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Flashcard App</h1>
      <div className="mb-4">
        <Input type="file" accept=".csv" onChange={handleFileUpload} className="mb-2" />
        <div className="flex items-center">
          <Input
            type="number"
            value={cardsPerSet}
            onChange={handleCardsPerSetChange}
            min="1"
            className="w-20 mr-2"
          />
          <span>Cards per set</span>
        </div>
      </div>
      {flashcards.length > 0 && (
        <div className="mt-8">
          <Card className="w-full max-w-md mx-auto p-6">
            <div className="text-center mb-4">
              <span className="text-sm text-gray-500">
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
              <Button onClick={handlePrevCard} variant="outline">
                <ChevronLeftIcon className="h-4 w-4 mr-2" />
                Previous
              </Button>
              <Button onClick={handleNextCard} variant="outline">
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