import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Flashcard App</h1>
        <p className="text-xl text-gray-600 mb-8">Create and study flashcards easily!</p>
        <Link to="/flashcards">
          <Button>Get Started</Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;