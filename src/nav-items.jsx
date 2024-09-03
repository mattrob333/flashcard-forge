import { HomeIcon, BookOpenIcon } from "lucide-react";
import Index from "./pages/Index.jsx";
import Flashcards from "./pages/Flashcards.jsx";

export const navItems = [
  {
    title: "Home",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Flashcards",
    to: "/flashcards",
    icon: <BookOpenIcon className="h-4 w-4" />,
    page: <Flashcards />,
  },
];