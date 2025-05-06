import React from 'react';
import { Link } from 'react-router-dom';
import { Rabbit, Rainbow, Star } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from 'lucide-react';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="w-full py-4 px-6 flex items-center justify-between bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-950 dark:to-purple-950 rounded-lg mb-4">
      <Link
        to="/"
        className="flex items-center space-x-2 transition-all duration-300 hover:opacity-80"
        fetchpriority="high"
      >
        <div className="relative w-9 h-9">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-md animate-pulse"></div>
          <Rabbit className="w-full h-full text-primary relative z-10" aria-hidden="true" />
        </div>
        <span className="font-bold text-2xl tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
          StoryLand
        </span>
      </Link>

      <div className="flex items-center space-x-3">
        <Rainbow className="w-6 h-6 text-blue-400 animate-floating" style={{ animationDelay: '0.5s' }} aria-hidden="true" />
        <Star className="w-6 h-6 text-yellow-400 animate-floating" aria-hidden="true" />
        {/* Theme toggle - visible only on desktop */}
        <div className="hidden md:block">
          <ThemeToggle />
        </div>

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <User className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={handleSignOut}
                className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 focus:bg-gradient-to-r focus:from-blue-500/10 focus:to-purple-500/10 transition-all duration-200"
              >
                <LogOut className="h-4 w-4 text-primary" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="hidden md:block">
            <Button
              onClick={() => navigate('/auth')}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 transition-all duration-300 text-white"
            >
              Get Started
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
