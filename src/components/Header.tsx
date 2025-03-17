
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="w-full py-4 px-6 flex items-center justify-between">
      <Link 
        to="/" 
        className="flex items-center space-x-2 transition-all duration-300 hover:opacity-80"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-md animate-pulse"></div>
          <BookOpen className="w-8 h-8 text-primary relative z-10" />
        </div>
        <span className="font-medium text-xl tracking-tight">StoryWonder</span>
      </Link>
      
      <div className="flex items-center space-x-1">
        <div className="tag-chip">
          For Kids
        </div>
      </div>
    </header>
  );
};

export default Header;
