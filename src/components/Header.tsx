import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Rabbit, Star, Rainbow, User, LogOut, Bookmark } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const Header: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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

        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full hover:bg-primary/10 transition-colors">
                <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900">
                    {user.user_metadata?.display_name?.charAt(0) || user.email.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 rounded-xl border-white/20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-xl p-2"
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="font-normal p-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">{user.user_metadata?.display_name || 'User'}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
              <DropdownMenuItem
                onClick={() => navigate('/profile')}
                className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 focus:bg-gradient-to-r focus:from-blue-500/10 focus:to-purple-500/10 transition-all duration-200"
              >
                <User className="h-4 w-4 text-primary" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate('/saved-stories')}
                className="flex items-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 focus:bg-gradient-to-r focus:from-blue-500/10 focus:to-purple-500/10 transition-all duration-200"
              >
                <Bookmark className="h-4 w-4 text-primary" />
                <span>Saved Stories</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
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
          <div className="flex items-center space-x-2">
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
