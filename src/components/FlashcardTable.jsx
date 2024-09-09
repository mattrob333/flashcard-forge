import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

const FlashcardTable = ({ flashcards, setFlashcards }) => {
  const [editingIndex, setEditingIndex] = useState(null);

  const handleEdit = (index) => {
    setEditingIndex(index);
  };

  const handleSave = (index) => {
    setEditingIndex(null);
  };

  const handleChange = (index, field, value) => {
    const updatedFlashcards = [...flashcards];
    updatedFlashcards[index][field] = value;
    setFlashcards(updatedFlashcards);
  };

  const exportCSV = () => {
    const csvContent = flashcards.map(card => `${card.question},${card.answer}`).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "flashcards.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      <Button onClick={exportCSV} className="mb-4">Export CSV</Button>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Question</TableHead>
              <TableHead>Answer</TableHead>
              <TableHead>Missed</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flashcards.map((card, index) => (
              <TableRow key={card.id}>
                <TableCell>
                  {editingIndex === index ? (
                    <Input
                      value={card.question}
                      onChange={(e) => handleChange(index, 'question', e.target.value)}
                      className="bg-gray-800 text-white"
                    />
                  ) : (
                    card.question
                  )}
                </TableCell>
                <TableCell>
                  {editingIndex === index ? (
                    <Input
                      value={card.answer}
                      onChange={(e) => handleChange(index, 'answer', e.target.value)}
                      className="bg-gray-800 text-white"
                    />
                  ) : (
                    card.answer
                  )}
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={card.isMissed}
                    onCheckedChange={(checked) => handleChange(index, 'isMissed', checked)}
                  />
                </TableCell>
                <TableCell>
                  {editingIndex === index ? (
                    <Button onClick={() => handleSave(index)}>Save</Button>
                  ) : (
                    <Button onClick={() => handleEdit(index)}>Edit</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FlashcardTable;