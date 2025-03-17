
// This is a simple mock implementation of a story generator
// In a real application, this would connect to an API like OpenAI or another LLM

interface StoryData {
  childName: string;
  childAge: number;
  interests: string;
  storyType: string;
  storyLength: string;
}

interface GeneratedStory {
  title: string;
  content: string;
}

// Helper function to get random item from array
const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Mock story templates
const storyTemplates = {
  adventure: [
    "{{name}} Goes on a Treasure Hunt",
    "{{name}}'s Jungle Expedition",
    "{{name}} and the Lost Map",
    "{{name}}'s Underwater Adventure",
  ],
  fantasy: [
    "{{name}} and the Magic Wand",
    "{{name}}'s Dragon Friend",
    "{{name}} in Fairy Kingdom",
    "{{name}} and the Enchanted Forest",
  ],
  animals: [
    "{{name}} and the Talking Animals",
    "{{name}}'s Day at the Zoo",
    "{{name}} Saves the Puppies",
    "{{name}} and the Friendly Dinosaur",
  ],
  educational: [
    "{{name}} Learns About Space",
    "{{name}}'s Science Adventure",
    "{{name}} and the History Mystery",
    "{{name}} Explores Nature",
  ],
};

// Mock story beginnings
const storyBeginnings = [
  "Once upon a time, there was a wonderful child named {{name}} who loved {{interests}}.",
  "In a beautiful land not so far away, lived a child named {{name}} who was {{age}} years old.",
  "It was a bright and sunny day when {{name}} decided to go on an adventure.",
  "{{name}} woke up feeling very excited. Today was going to be special!",
];

// Mock story middles
const storyMiddles = {
  short: [
    "{{name}} discovered something amazing about {{interests}}. It was so exciting!",
    "While exploring, {{name}} made a new friend who also liked {{interests}}.",
  ],
  medium: [
    "{{name}} discovered something amazing about {{interests}}. It was so exciting! After looking closer, {{name}} realized there was even more to discover.",
    "While exploring, {{name}} made a new friend who also liked {{interests}}. Together, they decided to embark on a small adventure.",
    "{{name}} faced a small challenge but remembered what they learned about {{interests}} and found a clever solution.",
  ],
  long: [
    "{{name}} discovered something amazing about {{interests}}. It was so exciting! After looking closer, {{name}} realized there was even more to discover. This led to a series of wonderful surprises.",
    "While exploring, {{name}} made a new friend who also liked {{interests}}. Together, they decided to embark on an adventure. Along the way, they encountered various challenges that tested their friendship.",
    "{{name}} faced a challenge but remembered what they learned about {{interests}} and found a clever solution. This success gave {{name}} confidence to tackle even bigger challenges.",
    "As {{name}} continued the journey, they met several interesting characters who each taught {{name}} something valuable about {{interests}} and life in general.",
  ],
};

// Mock story endings
const storyEndings = [
  "In the end, {{name}} learned that friendship and courage are very important.",
  "{{name}} returned home with amazing stories to tell and couldn't wait for the next adventure.",
  "{{name}} felt very proud for being brave and smart during the whole adventure.",
  "And so, {{name}} went to sleep that night dreaming about {{interests}} and all the wonderful adventures still to come.",
];

// Fill template with data
const fillTemplate = (template: string, data: StoryData): string => {
  return template
    .replace(/{{name}}/g, data.childName)
    .replace(/{{age}}/g, data.childAge.toString())
    .replace(/{{interests}}/g, data.interests);
};

// Generate story based on data
export const generateStory = (data: StoryData): Promise<GeneratedStory> => {
  return new Promise((resolve) => {
    // Simulate API call with timeout
    setTimeout(() => {
      // Get title template based on story type
      const titleTemplates = storyTemplates[data.storyType as keyof typeof storyTemplates] || storyTemplates.adventure;
      const titleTemplate = getRandomItem(titleTemplates);
      const title = fillTemplate(titleTemplate, data);
      
      // Build the story
      let content = "";
      
      // Add beginning
      content += fillTemplate(getRandomItem(storyBeginnings), data);
      content += "\n\n";
      
      // Add middle parts based on length
      const middleTemplates = storyMiddles[data.storyLength as keyof typeof storyMiddles] || storyMiddles.medium;
      const middleCount = data.storyLength === 'short' ? 1 : (data.storyLength === 'medium' ? 2 : 4);
      
      for (let i = 0; i < middleCount; i++) {
        content += fillTemplate(getRandomItem(middleTemplates), data);
        content += "\n\n";
      }
      
      // Add ending
      content += fillTemplate(getRandomItem(storyEndings), data);
      
      resolve({ title, content });
    }, 1500); // Simulate loading time
  });
};
