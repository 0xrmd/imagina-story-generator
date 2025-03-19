import React from 'react';
import { Link } from 'react-router-dom';
import { Rabbit, Star, Rainbow } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const Header: React.FC = () => {
  return (
    <header className="w-full py-4 px-6 flex items-center justify-between bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-950 dark:to-purple-950 rounded-lg mb-4">
      <Link
        to="/"
        className="flex items-center space-x-2 transition-all duration-300 hover:opacity-80"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-md animate-pulse"></div>
          <Rabbit className="w-9 h-9 text-primary relative z-10" />
        </div>
        <span className="font-bold text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">StoryLand</span>
      </Link>

      <div className="flex items-center space-x-3">
        <Rainbow className="w-6 h-6 text-blue-400 animate-floating" style={{ animationDelay: '0.5s' }} />
        <Star className="w-6 h-6 text-yellow-400 animate-floating" />
        <ThemeToggle />
      </div>
    </header>
  );
};

export default Header;
