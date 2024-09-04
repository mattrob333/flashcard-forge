import { useState } from 'react';
import { toast } from "sonner";

export const useFlashcards = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cardsPerSet, setCardsPerSet] = useState(10);
  const [randomize, setRandomize] = useState(false);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleGenerateFlashcards = (selectedFile) => {
    if (!selectedFile || !(selectedFile instanceof File)) {
      toast.error("Please select a valid file to study.");
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
            console.warn(`Invalid line in CSV: ${line}`);
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
      toast.success(`Generated ${cards.length} flashcards.`);
    };
    reader.onerror = (error) => {
      toast.error("Error reading file: " + error);
    };
    reader.readAsText(selectedFile);
  };

  const toggleDifficult = () => {
    setFlashcards(cards =>
      cards.map((card, index) =>
        index === currentCardIndex ? { ...card, isDifficult: !card.isDifficult } : card
      )
    );
  };

  const getCurrentCard = () => flashcards[currentCardIndex] || null;

  return {
    flashcards,
    setFlashcards,
    currentCardIndex,
    setCurrentCardIndex,
    cardsPerSet,
    setCardsPerSet,
    randomize,
    setRandomize,
    handleGenerateFlashcards,
    toggleDifficult,
    getCurrentCard
  };
};