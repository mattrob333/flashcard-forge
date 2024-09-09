import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

const FlashcardStudy = ({ currentCard, showAnswer, toggleAnswer, toggleMissed, handlePrevCard, handleNextCard, currentIndex, totalCards, reviewingMissed }) => {
  if (!currentCard) {
    return <p className="text-xl">No cards available</p>;
  }

  return (
    <Card className="w-full max-w-md mx-auto p-6 bg-gray-800 text-white">
      <div className="text-center mb-4">
        <span className="text-sm text-gray-400">
          {reviewingMissed ? "Reviewing Missed Cards" : "All Cards"}
        </span>
        <br />
        <span className="text-sm text-gray-400">
          Card {currentIndex + 1} of {totalCards}
        </span>
      </div>
      <div className="min-h-[200px] flex items-center justify-center">
        <p className="text-xl">{showAnswer ? currentCard.answer : currentCard.question}</p>
      </div>
      <Button onClick={toggleAnswer} className="w-full mt-4">
        {showAnswer ? 'Show Question' : 'Show Answer'}
      </Button>
      <div className="flex items-center justify-between mt-4">
        <Button onClick={handlePrevCard} variant="outline" className="border-gray-600">
          <ChevronLeftIcon className="h-4 w-4 mr-2" />
          Previous
        </Button>
        <div className="flex items-center">
          <Checkbox
            id="missedCard"
            checked={currentCard.isMissed}
            onCheckedChange={() => toggleMissed(currentCard.id)}
          />
          <label htmlFor="missedCard" className="ml-2 text-sm">Mark as missed</label>
        </div>
        <Button onClick={handleNextCard} variant="outline" className="border-gray-600">
          Next
          <ChevronRightIcon className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </Card>
  );
};

export default FlashcardStudy;