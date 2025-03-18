// This is a simple mock implementation of a story generator
// In a real application, this would connect to an API like OpenAI or another LLM

import { aiService } from '@/services/aiService';

interface StoryData {
  childName: string;
  childAge: number;
  interests: string;
  storyType: string;
  storyLength: string;
  isAutismFriendly?: boolean;  // New option for autism-friendly mode
}

interface GeneratedStory {
  title: string;
  content: string;
}

interface StoryGenerationParams {
  childName: string;
  childAge: number;
  interests: string;
  storyType: string;
  storyLength: string;
  isAutismFriendly: boolean;
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
    "As {{name}} explored further, a magical door appeared. Behind it was a world where {{interests}} came together in the most extraordinary way.",
    "A wise old owl appeared, its eyes twinkling with knowledge about {{interests}}. It had a special mission just for {{name}}.",
    "Deep in the enchanted forest, {{name}} discovered a hidden clearing where {{interests}} transformed into pure magic.",
    "{{name}} found an ancient book whose pages revealed secrets about {{interests}} that no one had ever known before.",
  ],
  medium: [
    "In a clearing bathed in moonlight, {{name}} discovered a circle of friendly creatures. Each one represented a different aspect of {{interests}}, and together they shared ancient wisdom that had been hidden for centuries.",
    "A mysterious mentor appeared in {{name}}'s dreams, teaching wonderful secrets about {{interests}}. Each night brought new discoveries and magical revelations.",
    "{{name}} stumbled upon an enchanted workshop where master craftsmen were creating wonders related to {{interests}}. They saw great potential in {{name}} and offered to share their knowledge.",
    "During a magical sunset, {{name}} found that {{interests}} had come alive in ways never imagined. The air sparkled with possibility as new adventures unfolded.",
  ],
  long: [
    "Deep in an ancient library, {{name}} discovered a series of magical books. Each one revealed deeper mysteries about {{interests}}, leading to a grand quest that would test everything {{name}} had learned.",
    "A group of mystical beings chose {{name}} as their special student. They revealed that {{interests}} held powers beyond imagination, and {{name}} was destined to become their guardian.",
    "Through a series of magical events, {{name}} learned that {{interests}} were actually connected to an ancient power. Each discovery led to new adventures and greater understanding.",
    "{{name}} received an invitation to a secret school where {{interests}} were taught in ways that seemed impossible. Each lesson brought new wonders and opened doors to magical realms.",
  ]
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
  // Format interests to be more natural
  const formattedInterests = data.interests
    .split(',')
    .map(interest => interest.trim())
    .filter(interest => interest)
    .join(' and ');

  let result = template
    .replace(/{{name}}/g, data.childName)
    .replace(/{{age}}/g, data.childAge.toString())
    .replace(/{{interests}}/g, formattedInterests);

  // Replace any extra placeholders
  Object.entries(extras).forEach(([key, value]) => {
    result = result.replace(new RegExp(`{{${key}}}`, 'g'), value);
  });

  return result;
};

// Helper function to format text for autism-friendly reading
const formatAutismFriendly = (text: string): string => {
  // Break down complex sentences into shorter ones
  let formatted = text
    .replace(/,\s+(?=[^,]*$)/, '. ')  // Replace last comma with period
    .replace(/\band\b(?=[^.]*$)/, '. '); // Replace last "and" with period

  // Add visual breaks between sentences with clear sequencing
  const sentences = formatted.split(/(?<=[.!?])\s+/).filter(s => s.trim());

  // Add emojis and visual cues based on content
  const formattedSentences = sentences.map((sentence, index) => {
    // Add sequence markers
    let prefix = '';
    if (index === 0) prefix = '📖 First: ';
    else if (index === sentences.length - 1) prefix = '🎯 Finally: ';
    else prefix = `${index + 1}️⃣ Then: `;

    // Add contextual emojis based on content
    let enhancedSentence = sentence;
    if (sentence.match(/happy|smile|laugh|joy|fun/i)) enhancedSentence += ' 😊';
    if (sentence.match(/sad|cry|tear|upset/i)) enhancedSentence += ' 😢';
    if (sentence.match(/surprise|shock|amaze/i)) enhancedSentence += ' 😮';
    if (sentence.match(/friend|together|help/i)) enhancedSentence += ' 🤝';
    if (sentence.match(/think|wonder|realize/i)) enhancedSentence += ' 💭';
    if (sentence.match(/see|look|watch/i)) enhancedSentence += ' 👀';
    if (sentence.match(/hear|listen|sound/i)) enhancedSentence += ' 👂';
    if (sentence.match(/feel|touch/i)) enhancedSentence += ' 🤚';

    return prefix + enhancedSentence;
  });

  // Add visual separators between major story sections
  return `👤 Story for young readers!\n\n` +
    formattedSentences.join('\n\n') +
    '\n\n📚 The End!';
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

      if (data.isAutismFriendly) {
        content = `📖 Our Story Map
=================

👤 Who's in the Story:
• Main Character: ${data.childName} (${data.childAge} years old)
• Special Interests: ${data.interests}
• Story Type: ${data.storyType}

📝 Story Parts:
1️⃣ The Beginning: Meeting ${data.childName}
2️⃣ The Adventure: Magical Discoveries
3️⃣ The Challenge: Solving Problems
4️⃣ The Happy Ending: What We Learned

🎯 Reading Goals:
• Follow the story step by step (look for →)
• Use your imagination to picture each scene
• Think about how ${data.childName} feels
• Guess what might happen next

-------------------
📚 Let's Start Our Adventure!
-------------------\n\n`;
      }

      // Add personalized beginning with sensory details
      const beginning = fillTemplate(getRandomItem(storyBeginnings), data, {
        trait: characterTrait
      });
      content += data.isAutismFriendly ?
        "🌅 The Beginning: A New Day\n-------------------\n\n" + formatAutismFriendly(beginning) :
        beginning;
      content += "\n\n";

      // Add character introduction with natural trait blending
      let traitIntro = `${data.childName} was a ${characterTrait} ${data.childAge}-year-old who loved ${data.interests}. Their eyes sparkled with excitement whenever they talked about their interests.`;
      content += data.isAutismFriendly ? formatAutismFriendly(traitIntro) : traitIntro;
      content += "\n\n";

      if (data.isAutismFriendly) {
        content += `🎯 Our Goal: Join ${data.childName} on a magical adventure!\n\n`;
      }

      // Add enhanced helper/tool introduction with sensory details
      let helperIntro = `One special morning, while exploring a secret corner of their world, ${data.childName} discovered ${storyHelper}. It seemed to glow with magical energy, promising to help with ${data.interests} in ways they never imagined.`;
      content += data.isAutismFriendly ?
        "🔮 The Magical Discovery\n-------------------\n\n" + formatAutismFriendly(helperIntro) :
        helperIntro;
      content += "\n\n";

      if (data.isAutismFriendly) {
        content += "-------------------\n";
        content += "🌟 The Adventure Begins!\n";
        content += "-------------------\n\n";
      }

      // Add middle parts
      const middleTemplates = storyMiddles[data.storyLength as keyof typeof storyMiddles] || storyMiddles.medium;
      const middleCount = data.storyLength === 'short' ? 1 : (data.storyLength === 'medium' ? 2 : 3);
      const selectedMiddles = getRandomUniqueItems(middleTemplates, middleCount);

      for (let i = 0; i < selectedMiddles.length; i++) {
        const filledMiddle = fillTemplate(selectedMiddles[i], data, {
          helper: storyHelper,
          challenge: challenge,
          trait: characterTrait
        });
        content += data.isAutismFriendly ? formatAutismFriendly(filledMiddle) : filledMiddle;
        content += "\n\n";
      }

      if (data.isAutismFriendly) {
        content += "-------------------\n";
        content += "⭐ The Big Challenge\n";
        content += "-------------------\n\n";
      }

      // Enhanced challenge section with emotional journey
      let challengeText = `${data.childName} faced their biggest challenge yet: ${challenge}. Drawing upon their ${characterTrait} nature and their love for ${data.interests}, they felt determined to find a solution. Step by step, with courage and creativity, ${data.childName} worked through the problem.`;
      content += data.isAutismFriendly ? formatAutismFriendly(challengeText) : challengeText;
      content += "\n\n";

      if (data.isAutismFriendly) {
        content += "-------------------\n";
        content += "🌈 The Happy Ending\n";
        content += "-------------------\n\n";
      }

      // Enhanced ending with clear lesson
      const ending = fillTemplate(getRandomItem(storyEndings), data, {
        helper: storyHelper,
        trait: characterTrait
      });
      content += data.isAutismFriendly ? formatAutismFriendly(ending) : ending;

      if (data.isAutismFriendly) {
        content += `\n\n📝 Story Review
=================

🔄 What Happened (In Order):
1. ${data.childName} started their day loving ${data.interests}
2. Found a magical ${storyHelper}
3. Faced the challenge: ${challenge}
4. Used their ${characterTrait} qualities to succeed

🎭 How ${data.childName} Felt:
• At Start → Excited about their interests
• During Challenge → Determined to succeed
• At End → Proud of their accomplishment

💫 What We Learned:
${data.childName} discovered that being ${characterTrait} and loving ${data.interests} 
makes them special and helps them solve any challenge!

❓ Think About:
• What would you do if you found ${storyHelper}?
• How would you solve the challenge?
• What adventure would you like to have next?

-------------------
🌟 Remember: Every adventure is special when you stay true to yourself!
-------------------`;
      }

      resolve({ title, content });
    }, 1500); // Simulate loading time
  });
};
