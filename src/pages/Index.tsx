
import React from 'react';
import OnboardingForm from '@/components/OnboardingForm';
import Header from '@/components/Header';
import AnimatedTransition from '@/components/AnimatedTransition';
import { Star, Rabbit, ToyBrick, Cloud, Rainbow } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col p-4 md:p-6 bg-gradient-to-b from-blue-50 to-purple-50">
      <Header />
      
      <main className="flex-1 w-full max-w-4xl mx-auto flex flex-col items-center justify-center py-10 relative">
        {/* Decorative elements */}
        <div className="absolute -top-12 -right-8 w-20 h-20 text-blue-300 opacity-70">
          <Cloud className="w-full h-full animate-floating" style={{ animationDelay: '0.7s' }} />
        </div>
        <div className="absolute top-1/3 -left-12 w-16 h-16 text-green-300 opacity-70">
          <ToyBrick className="w-full h-full animate-floating" style={{ animationDelay: '1.5s' }} />
        </div>
        <div className="absolute bottom-1/4 -right-10 w-16 h-16 text-purple-300 opacity-70">
          <Rainbow className="w-full h-full animate-floating" style={{ animationDelay: '1.2s' }} />
        </div>
        
        <AnimatedTransition delay={100} className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500">
            Create magical stories
            <br />
            for your child
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto text-lg">
            Personalized tales that spark imagination and joy,
            <br />
            crafted with love for bedtime, learning, and fun.
          </p>
        </AnimatedTransition>
        
        <div className="relative w-full">
          {/* Decorative elements */}
          <div className="absolute -top-12 -left-12 w-24 h-24 text-yellow-300 opacity-70">
            <Star className="w-full h-full animate-floating" />
          </div>
          <div className="absolute -bottom-8 -right-8 w-16 h-16 text-pink-300 opacity-70">
            <Star className="w-full h-full animate-floating" style={{ animationDelay: '1s' }} />
          </div>
          <div className="absolute -bottom-16 left-1/4 w-14 h-14 text-blue-300 opacity-70">
            <Rabbit className="w-full h-full animate-floating" style={{ animationDelay: '0.5s' }} />
          </div>
          
          <AnimatedTransition delay={300}>
            <OnboardingForm />
          </AnimatedTransition>
        </div>
      </main>
      
      <footer className="w-full max-w-4xl mx-auto py-6 text-center text-sm text-muted-foreground">
        <p className="flex items-center justify-center gap-2">
          <Star className="w-4 h-4 text-yellow-400" />
          StoryLand • Crafting magical stories for children
          <Star className="w-4 h-4 text-yellow-400" />
        </p>
      </footer>
    </div>
  );
};

export default Index;
