import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import AnimatedTransition from './AnimatedTransition';
import { cn } from '@/lib/utils';
import { Sparkles, Star } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface OnboardingFormProps {
  className?: string;
}

const OnboardingForm: React.FC<OnboardingFormProps> = ({ className }): JSX.Element => {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState({
    childName: '',
    childAge: 5,
    interests: '',
    storyType: 'adventure',
    storyLength: 'medium',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInterestsKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && formData.interests.trim()) {
      e.preventDefault();
      const currentValue = formData.interests.trim();
      if (!currentValue.endsWith(',')) {
        setFormData(prev => ({ ...prev, interests: currentValue + ', ' }));
      }
    }
  };

  const handleAgeChange = (value: number[]) => {
    setFormData(prev => ({ ...prev, childAge: value[0] }));
  };

  const handleStoryTypeSelect = (type: string) => {
    setFormData(prev => ({ ...prev, storyType: type }));
  };

  const handleStoryLengthSelect = (length: string) => {
    setFormData(prev => ({ ...prev, storyLength: length }));
  };

  const handleNext = () => {
    if (step === 1 && !formData.childName.trim()) {
      toast.error("Please enter your child's name");
      return;
    }

    if (step === 2 && !formData.interests.trim()) {
      toast.error("Please enter some interests");
      return;
    }

    if (step < 3) {
      setStep(step + 1);
    } else {
      navigate('/story', { state: formData });
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const storyTypes = [
    { id: 'adventure', label: 'Adventure', icon: '🚀' },
    { id: 'fantasy', label: 'Fantasy', icon: '🧙‍♂️' },
    { id: 'animals', label: 'Animals', icon: '🐼' },
    { id: 'educational', label: 'Educational', icon: '📚' },
  ];

  const storyLengths = [
    { id: 'short', label: 'Short (3 min)' },
    { id: 'medium', label: 'Medium (5 min)' },
    { id: 'long', label: 'Long (10 min)' },
  ];

  return (
    <div className={cn("w-full max-w-md mx-auto", className)}>
      <div className="relative overflow-hidden glass-card rounded-2xl p-8">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {step === 1 && (
          <AnimatedTransition>
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <div className="inline-block mb-2">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg"></div>
                    <Sparkles className="w-10 h-10 text-primary relative z-10" />
                  </div>
                </div>
                <h1 className="text-2xl font-medium tracking-tight">Welcome to StoryLand</h1>
                <p className="text-muted-foreground">Let's create a magical story for your child</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="childName">Child's Name</Label>
                  <Input
                    id="childName"
                    name="childName"
                    className="floating-input"
                    placeholder="Enter your child's name"
                    value={formData.childName}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="childAge">Child's Age: {formData.childAge}</Label>
                  <Slider
                    id="childAge"
                    min={2}
                    max={12}
                    step={1}
                    value={[formData.childAge]}
                    onValueChange={handleAgeChange}
                    className="py-4"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>2</span>
                    <span>12</span>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedTransition>
        )}

        {step === 2 && (
          <AnimatedTransition>
            <div className="space-y-6 w-full">
              <div className="space-y-2 text-center">
                <h1 className="text-2xl font-medium tracking-tight">What does {formData.childName} enjoy?</h1>
                <p className="text-muted-foreground">Tell us about their interests and preferences</p>
              </div>

              <div className="space-y-2 w-full">
                <Label htmlFor="interests">Interests & Favorites</Label>
                <div className="w-full">
                  <Input
                    id="interests"
                    name="interests"
                    className="floating-input bg-primary/5 w-full px-4 py-2 min-h-[42px] text-base md:text-sm"
                    placeholder="E.g., dinosaurs, space, princesses..."
                    value={formData.interests}
                    onChange={handleChange}
                    onKeyDown={handleInterestsKeyDown}
                  />
                </div>
                <p className="text-xs text-muted-foreground pt-1">
                  Like favorite animals, characters, places, or activities
                </p>
              </div>
            </div>
          </AnimatedTransition>
        )}

        {step === 3 && (
          <AnimatedTransition>
            <div className="space-y-6">
              <div className="space-y-2 text-center">
                <h1 className="text-2xl font-medium tracking-tight">Story Preferences</h1>
                <p className="text-muted-foreground">Customize the story type and length</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Story Type</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {storyTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => handleStoryTypeSelect(type.id)}
                        className={cn(
                          "flex items-center justify-center space-x-2 rounded-xl p-3 border transition-all duration-300",
                          formData.storyType === type.id
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        <span className="text-xl">{type.icon}</span>
                        <span>{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Story Length</Label>
                  <div className="flex gap-2">
                    {storyLengths.map((length) => (
                      <button
                        key={length.id}
                        onClick={() => handleStoryLengthSelect(length.id)}
                        className={cn(
                          "flex-1 py-2 px-3 rounded-lg border text-sm transition-all duration-300",
                          formData.storyLength === length.id
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50"
                        )}
                      >
                        {length.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </AnimatedTransition>
        )}

        <div className="flex justify-between mt-8">
          {step > 1 ? (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          ) : (
            <div></div>
          )}

          <Button onClick={handleNext} className="group">
            {step < 3 ? 'Next' : 'Create Story'}
            <Star className="w-4 h-4 ml-2 group-hover:animate-floating" />
          </Button>
        </div>

        <div className="flex justify-center mt-6">
          <div className="flex space-x-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  step === i ? "bg-primary scale-125" : "bg-muted"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingForm;
