import React from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { MenuIcon } from 'lucide-react';

const Instructions = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <MenuIcon className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Instructions</SheetTitle>
          <SheetDescription>
            <ul className="list-disc pl-5 space-y-2">
              <li>Upload CSV files with question and answer pairs. Multiple files can be uploaded.</li>
              <li>Choose the file to make flash cards from.</li>
              <li>Decide the cards per set.</li>
              <li>Choose to randomize or not.</li>
              <li>Hit generate flashcards.</li>
              <li>Open the table view to see the question and answer pairs.</li>
              <li>You can edit and correct them if they are incorrect.</li>
              <li>Export the CSV as a new and corrected version to study next time.</li>
              <li>Note: The files do not get stored in the app.</li>
            </ul>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default Instructions;