
import React from 'react';
import OnboardingForm from '@/components/OnboardingForm';
import Header from '@/components/Header';
import AnimatedTransition from '@/components/AnimatedTransition';
import { Star } from 'lucide-react';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col p-4 md:p-6">
      <Header />
      
      <main className="flex-1 w-full max-w-4xl mx-auto flex flex-col items-center justify-center py-10">
        <AnimatedTransition delay={100} className="text-center mb-8">
          <h1 className="text-4xl font-medium tracking-tight mb-3">
            Create magical stories
            <br />
            for your child
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Personalized tales that spark imagination and joy,
            <br />
            crafted with love for bedtime, learning, and fun.
          </p>
        </AnimatedTransition>
        
        <div className="relative w-full">
          {/* Decorative elements */}
          <div className="absolute -top-12 -left-12 w-24 h-24 text-primary/10 opacity-70">
            <Star className="w-full h-full animate-floating" />
          </div>
          <div className="absolute -bottom-8 -right-8 w-16 h-16 text-primary/10 opacity-70">
            <Star className="w-full h-full animate-floating" style={{ animationDelay: '1s' }} />
          </div>
          
          <AnimatedTransition delay={300}>
            <OnboardingForm />
          </AnimatedTransition>
        </div>
      </main>
      
      <footer className="w-full max-w-4xl mx-auto py-6 text-center text-sm text-muted-foreground">
        <p>StoryWonder • Crafting magical stories for children</p>
      </footer>
    </div>
  );
};

export default Index;
