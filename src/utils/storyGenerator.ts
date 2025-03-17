
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

// Helper function to get multiple random unique items from array
const getRandomUniqueItems = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, array.length));
};

// Enhanced story titles with more variety
const storyTemplates = {
  adventure: [
    "{{name}}'s Epic Treasure Hunt",
    "The Mysterious Map of {{name}}",
    "{{name}} and the Secret Island",
    "The Incredible Journey of {{name}}",
    "{{name}}'s Quest for the Golden Key",
    "{{name}} Explores the Hidden Cave",
    "The Daring Adventure of {{name}}",
    "{{name}} and the Time Machine",
  ],
  fantasy: [
    "{{name}} and the Enchanted Wand",
    "The Magical Kingdom of {{name}}",
    "{{name}} and the Talking Dragon",
    "{{name}}'s Fairy Friends",
    "The Wizard's Apprentice {{name}}",
    "{{name}} and the Invisible Castle",
    "The Magic Mirror of {{name}}",
    "{{name}} and the Midnight Spell",
  ],
  animals: [
    "{{name}} and the Whispering Zoo",
    "The Secret Life of {{name}}'s Pet",
    "{{name}} Saves the Wild Animals",
    "{{name}}'s Underwater Friends",
    "The Jungle Adventures of {{name}}",
    "{{name}} and the Dancing Dolphins",
    "{{name}} and the Clever Fox",
    "The Tiny Elephant Friend of {{name}}",
  ],
  educational: [
    "{{name}}'s Journey Through Space",
    "{{name}} Discovers Dinosaurs",
    "The Time Machine of {{name}}",
    "{{name}} and the Body Explorers",
    "{{name}}'s Weather Adventure",
    "{{name}} Visits the Ancient Pyramids",
    "The Science Lab of {{name}}",
    "{{name}} and the Ocean Mysteries",
  ],
};

// Expanded and more creative story beginnings
const storyBeginnings = [
  "Once upon a time, in a world full of wonder, there lived a child named {{name}} who absolutely loved {{interests}}.",
  "In a colorful town nestled between rainbow mountains lived {{name}}, a {{age}}-year-old with sparkling eyes and a love for {{interests}}.",
  "The sun had just painted the sky with shades of orange and pink when {{name}} woke up with an amazing idea about {{interests}}.",
  "It all began on a Tuesday morning, which was unusual because magical things rarely happen on Tuesdays. But for {{name}}, today was different.",
  "Stars twinkled like diamonds in the night sky as {{name}} made a special wish about {{interests}} before drifting off to sleep.",
  "In a house that sometimes seemed ordinary but was actually quite extraordinary, lived {{name}}, who was about to discover something amazing about {{interests}}.",
  "The school bell had just rung for the last time that day when {{name}} noticed something unusual happening near the {{interests}} section.",
  "If you believed in magic, you would have seen it sparkle around {{name}} that morning as they prepared for a day filled with {{interests}}.",
];

// Expanded story middles with creative scenarios
const storyMiddles = {
  short: [
    "{{name}} discovered a mysterious glowing object related to {{interests}}. Upon closer inspection, it revealed a hidden message!",
    "While exploring the backyard, {{name}} met a talking butterfly who knew everything about {{interests}} and offered to share its knowledge.",
    "A strange package arrived at {{name}}'s doorstep. Inside was a map with clues all related to {{interests}}!",
    "{{name}} found a secret door behind the bookshelf that led to a magical world where {{interests}} came to life in extraordinary ways.",
  ],
  medium: [
    "{{name}} discovered a tiny door at the base of an old tree. Behind it was a miniature world where tiny creatures were creating amazing things related to {{interests}}. They invited {{name}} to join their crafting session.",
    "A shooting star fell right into {{name}}'s backyard! But it wasn't a star at all - it was a visitor from another planet who needed help learning about {{interests}} before returning home.",
    "While reading a book about {{interests}}, {{name}} noticed the pictures beginning to move. Suddenly, the book pulled {{name}} inside its pages for an interactive adventure!",
    "{{name}}'s grandmother revealed a family secret: their family had special powers related to {{interests}}. Now it was time for {{name}} to learn how to use these abilities responsibly.",
    "At the local museum, the exhibits about {{interests}} mysteriously came to life at night. The security guard invited {{name}} to help keep this special magic a secret while learning from the living exhibits.",
  ],
  long: [
    "{{name}} received an invitation to a special school where students learned all about {{interests}} in magical ways. After passing the entrance test by showing knowledge of {{interests}}, {{name}} was introduced to classmates who would become lifelong friends. Together, they embarked on their first class project that involved solving real-world problems using their knowledge.",
    "A peculiar old map found in the attic led {{name}} to a hidden cave near town. Inside the cave was an ancient society of explorers who had been studying {{interests}} for centuries. They were impressed by {{name}}'s enthusiasm and invited them to join their next expedition. During training, {{name}} learned skills that even adults found challenging.",
    "When {{name}}'s family moved to a new neighborhood, the house they moved into seemed ordinary at first. But soon {{name}} discovered that the house responded to thoughts about {{interests}}. Rooms would transform, objects would appear, and sometimes even helpful creatures would materialize to teach {{name}} more. As {{name}} mastered this strange connection, the house revealed its true purpose.",
    "During a family camping trip, {{name}} wandered off the trail and encountered a family of magical forest creatures who needed help. Their forest was in danger, and they believed {{name}}'s knowledge of {{interests}} might save their home. After meeting the forest council, {{name}} was granted temporary woodland magic to help solve the mystery of the dying trees. With new forest friends and growing confidence, {{name}} discovered that the problem was more complicated than anyone realized.",
    "On a rainy afternoon, {{name}} built a fort out of blankets and pillows, but this was no ordinary fort. Once inside, {{name}} realized it had become a portal to different worlds, each one connected to different aspects of {{interests}}. In one world, {{name}} met a wise teacher who explained that these worlds were in danger of disappearing if children stopped being curious about {{interests}}. {{name}} accepted the mission to become an ambassador between worlds, learning deeper secrets with each journey.",
  ],
};

// Expanded and more varied story endings
const storyEndings = [
  "As the adventure came to an end, {{name}} realized that the greatest treasure wasn't what was found, but the journey itself and the new understanding of {{interests}} that would last forever.",
  "{{name}} returned home with a heart full of stories and a mind full of new ideas about {{interests}}. Sometimes the greatest adventures happen when you least expect them.",
  "That night, as {{name}} drifted off to sleep, the memories of the day's adventure sparkled like stars in the imagination. And somewhere, in the world of {{interests}}, new adventures were waiting for tomorrow.",
  "With a newfound confidence and knowledge about {{interests}}, {{name}} couldn't wait to share these discoveries with friends at school. Some might not believe it, but the best stories are often the ones that seem impossible.",
  "{{name}}'s parents were amazed at how much their child had learned about {{interests}} in just one day. Little did they know that this was just the beginning of many magical adventures to come.",
  "The experience taught {{name}} that curiosity about {{interests}} could open doors to worlds never imagined. With a smile and a heart full of courage, {{name}} was ready for whatever tomorrow might bring.",
  "And so, with new friends made and new knowledge of {{interests}} tucked safely in heart and mind, {{name}} knew that the end of this story was just the beginning of many more.",
  "As the sun set on this wonderful day, {{name}} made a special wish upon the first evening star – to have many more adventures involving {{interests}} and to never lose the sense of wonder that made today so special.",
];

// Character traits to personalize stories
const characterTraits = [
  "brave and curious",
  "kind and thoughtful",
  "clever and resourceful",
  "imaginative and creative",
  "determined and persistent",
  "cheerful and optimistic",
  "quiet but observant",
  "energetic and enthusiastic"
];

// Story helpers based on story type
const storyHelpers = {
  adventure: [
    "a treasure map",
    "a mysterious compass",
    "a magical backpack",
    "special binoculars",
    "a helpful explorer's guide"
  ],
  fantasy: [
    "a magical wand",
    "a talking animal companion",
    "a book of spells",
    "enchanted shoes",
    "a wise wizard mentor"
  ],
  animals: [
    "a special way to talk to animals",
    "animal friends with unique abilities",
    "a book about animal secrets",
    "a gentle forest guardian",
    "a magical pet"
  ],
  educational: [
    "a time-traveling watch",
    "a microscope with magic powers",
    "a talking encyclopedia",
    "a robot assistant",
    "special glasses that reveal hidden facts"
  ]
};

// Challenges based on story type
const challengesByType = {
  adventure: [
    "crossing a rickety bridge",
    "finding the right path in a maze",
    "decoding a secret message",
    "climbing a tall mountain",
    "navigating through fog"
  ],
  fantasy: [
    "solving a magical riddle",
    "helping magical creatures in trouble",
    "finding ingredients for a special potion",
    "breaking an enchantment",
    "restoring balance to a magical realm"
  ],
  animals: [
    "helping animals work together",
    "finding a lost animal baby",
    "creating peace between animal groups",
    "understanding a new animal language",
    "caring for a rare animal"
  ],
  educational: [
    "solving a scientific puzzle",
    "explaining a natural phenomenon",
    "discovering historical artifacts",
    "conducting a safe experiment",
    "teaching others about an important discovery"
  ]
};

// Fill template with data
const fillTemplate = (template: string, data: StoryData, extras: Record<string, string> = {}): string => {
  let result = template
    .replace(/{{name}}/g, data.childName)
    .replace(/{{age}}/g, data.childAge.toString())
    .replace(/{{interests}}/g, data.interests);
  
  // Replace any extra placeholders
  Object.entries(extras).forEach(([key, value]) => {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });
  
  return result;
};

// Generate story based on data
export const generateStory = (data: StoryData): Promise<GeneratedStory> => {
  return new Promise((resolve) => {
    // Simulate API call with timeout
    setTimeout(() => {
      // Select story elements based on child's data
      const storyType = data.storyType as keyof typeof storyTemplates;
      const characterTrait = getRandomItem(characterTraits);
      const storyHelper = getRandomItem(storyHelpers[storyType] || storyHelpers.adventure);
      const challenge = getRandomItem(challengesByType[storyType] || challengesByType.adventure);
      
      // Get title template based on story type
      const titleTemplates = storyTemplates[storyType] || storyTemplates.adventure;
      const titleTemplate = getRandomItem(titleTemplates);
      const title = fillTemplate(titleTemplate, data);
      
      // Build the story with more personalization
      let content = "";
      
      // Add personalized beginning
      const beginning = fillTemplate(getRandomItem(storyBeginnings), data, {
        trait: characterTrait
      });
      content += beginning;
      content += "\n\n";
      
      // Add intro to the character's trait
      content += `${data.childName} was known for being ${characterTrait}, especially when it came to ${data.interests}.`;
      content += "\n\n";
      
      // Add helper/tool introduction based on story type
      content += `One day, ${data.childName} discovered ${storyHelper} that would help with an exciting adventure related to ${data.interests}.`;
      content += "\n\n";
      
      // Add middle parts based on length with more personalized content
      const middleTemplates = storyMiddles[data.storyLength as keyof typeof storyMiddles] || storyMiddles.medium;
      const middleCount = data.storyLength === 'short' ? 1 : (data.storyLength === 'medium' ? 2 : 3);
      
      // Get unique middle sections to avoid repetition
      const selectedMiddles = getRandomUniqueItems(middleTemplates, middleCount);
      
      for (let i = 0; i < selectedMiddles.length; i++) {
        const filledMiddle = fillTemplate(selectedMiddles[i], data, {
          helper: storyHelper,
          challenge: challenge,
          trait: characterTrait
        });
        content += filledMiddle;
        content += "\n\n";
      }
      
      // Add a challenge appropriate to the story type
      content += `Soon, ${data.childName} faced the challenge of ${challenge}. Using ${characterTrait} qualities and knowledge about ${data.interests}, ${data.childName} found a creative solution.`;
      content += "\n\n";
      
      // Add personalized ending
      content += fillTemplate(getRandomItem(storyEndings), data, {
        helper: storyHelper,
        trait: characterTrait
      });
      
      resolve({ title, content });
    }, 1500); // Simulate loading time
  });
};
