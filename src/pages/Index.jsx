import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import Instructions from '../components/Instructions';

const Index = () => {
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white">
      <header className="p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Endeavor Flash Cards Creator</h1>
        <Instructions />
      </header>
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Welcome to Endeavor Flash Cards Creator</h2>
          <p className="text-xl text-gray-400 mb-8">Create and study flashcards easily!</p>
          <Link to="/flashcards">
            <Button className="bg-blue-600 hover:bg-blue-700">Get Started</Button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Index;