import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { toast } from "sonner";

const Flashcards = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cardsPerSet, setCardsPerSet] = useState(10);
  const [showAnswer, setShowAnswer] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [difficultCards, setDifficultCards] = useState([]);
  const [showTable, setShowTable] = useState(false);

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
      const cards = lines
        .filter(line => line.trim() !== '')
        .map((line, index) => {
          const [question, answer] = line.split(',').map(item => item?.trim());
          if (!question || !answer) {
            toast.error(`Invalid line in CSV: ${line}`);
            return null;
          }
          return { id: index, question, answer, isDifficult: false };
        })
        .filter(card => card !== null);

      if (cards.length === 0) {
        toast.error("No valid flashcards found in the CSV file.");
        return;
      }

      setFlashcards(cards);
      setCurrentCardIndex(0);
      toast.success(`Generated ${cards.length} flashcards.`);
    };
    reader.readAsText(selectedFile);
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

  const toggleDifficult = () => {
    setFlashcards(cards =>
      cards.map((card, index) =>
        index === currentCardIndex ? { ...card, isDifficult: !card.isDifficult } : card
      )
    );
  };

  const handleFileSelect = (file) => {
    setSelectedFile(file);
  };

  const toggleTableView = () => {
    setShowTable(!showTable);
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
          <Button onClick={handleGenerateFlashcards} className="w-full mt-2">Generate Flashcards</Button>
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
        <>
          <Button onClick={toggleTableView} className="mb-4">
            {showTable ? "Hide Table View" : "Show Table View"}
          </Button>
          {showTable ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Question</TableHead>
                    <TableHead>Answer</TableHead>
                    <TableHead>Difficult</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {flashcards.map((card, index) => (
                    <TableRow key={index}>
                      <TableCell>{card.question}</TableCell>
                      <TableCell>{card.answer}</TableCell>
                      <TableCell>
                        <Checkbox
                          checked={card.isDifficult}
                          onCheckedChange={() => {
                            setFlashcards(cards =>
                              cards.map((c, i) =>
                                i === index ? { ...c, isDifficult: !c.isDifficult } : c
                              )
                            );
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
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
                <div className="flex items-center justify-between mt-4">
                  <Button onClick={handlePrevCard} variant="outline" className="border-gray-600">
                    <ChevronLeftIcon className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  <div className="flex items-center">
                    <Checkbox
                      id="difficultCard"
                      checked={flashcards[currentCardIndex].isDifficult}
                      onCheckedChange={toggleDifficult}
                    />
                    <label htmlFor="difficultCard" className="ml-2 text-sm">Mark as difficult</label>
                  </div>
                  <Button onClick={handleNextCard} variant="outline" className="border-gray-600">
                    Next
                    <ChevronRightIcon className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Flashcards;