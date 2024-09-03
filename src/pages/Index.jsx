import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';

const Index = () => {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to Flashcard App</h1>
        <p className="text-xl text-gray-400 mb-8">Create and study flashcards easily!</p>
        <Link to="/flashcards">
          <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;