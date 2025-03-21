import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from './ThemeProvider';

interface ThemeToggleProps {
    className?: string;
    showLabel?: boolean;
}

export function ThemeToggle({ className, showLabel }: ThemeToggleProps) {
    const { theme, toggleTheme } = useTheme();

    return (
        <Button
            variant="ghost"
            size={showLabel ? "default" : "icon"}
            onClick={toggleTheme}
            className={className}
        >
            {showLabel ? (
                <>
                    {theme === 'light' ? (
                        <Sun className="h-4 w-4 rotate-0 scale-100 transition-all mr-2" />
                    ) : (
                        <Moon className="h-4 w-4 rotate-0 scale-100 transition-all mr-2" />
                    )}
                    <span>{theme === 'light' ? 'Light Mode' : 'Dark Mode'}</span>
                </>
            ) : (
                <>
                    <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </>
            )}
        </Button>
    );
} 