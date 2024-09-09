import { useState, useCallback } from 'react';
import { toast } from "sonner";

export const useFlashcards = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cardsPerSet, setCardsPerSet] = useState(10);
  const [randomize, setRandomize] = useState(false);
  const [reviewingMissed, setReviewingMissed] = useState(false);

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
          const [question, answer] = line.split(',').map(part => part.trim());
          if (!question || !answer) {
            console.warn(`Invalid line in CSV: ${line}`);
            return null;
          }
          return { 
            id: index, 
            question, 
            answer, 
            isMissed: false
          };
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
      setReviewingMissed(false);
      toast.success(`Generated ${cards.length} flashcards.`);
    };
    reader.onerror = (error) => {
      toast.error("Error reading file: " + error);
    };
    reader.readAsText(selectedFile);
  };

  const toggleMissed = useCallback((cardId) => {
    setFlashcards(cards =>
      cards.map(card =>
        card.id === cardId ? { ...card, isMissed: !card.isMissed } : card
      )
    );
  }, []);

  const getCurrentCard = useCallback(() => {
    const currentCards = reviewingMissed ? flashcards.filter(card => card.isMissed) : flashcards;
    return currentCards[currentCardIndex] || null;
  }, [flashcards, currentCardIndex, reviewingMissed]);

  const handleNextCard = useCallback(() => {
    const currentCards = reviewingMissed ? flashcards.filter(card => card.isMissed) : flashcards;
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % currentCards.length);
  }, [flashcards, reviewingMissed]);

  const handlePrevCard = useCallback(() => {
    const currentCards = reviewingMissed ? flashcards.filter(card => card.isMissed) : flashcards;
    setCurrentCardIndex((prevIndex) => (prevIndex - 1 + currentCards.length) % currentCards.length);
  }, [flashcards, reviewingMissed]);

  const toggleReviewMissed = useCallback(() => {
    const missedCards = flashcards.filter(card => card.isMissed);
    if (missedCards.length === 0) {
      toast.error("No missed cards to review.");
      return;
    }
    setReviewingMissed(prev => !prev);
    setCurrentCardIndex(0);
  }, [flashcards]);

  return {
    flashcards,
    setFlashcards,
    currentCardIndex,
    setCurrentCardIndex,
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
  };
};