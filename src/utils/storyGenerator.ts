// This is a simple mock implementation of a story generator
// In a real application, this would connect to an API like OpenAI or another LLM

import { aiService } from '@/services/aiService';
import { supabase } from '@/lib/supabase';

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

interface StoryGenerationParams {
  childName: string;
  childAge: number;
  interests: string;
  storyType: string;
  storyLength: string;
}

interface StoryParams {
  childName: string;
  childAge: number;
  storyType: string;
  interests: string;
}

interface StoryInsights {
  moral: string;
  vocabulary: string[];
  readingTime: string;
  sequence: {
    order: number;
    event: string;
    importance: 'high' | 'medium' | 'low';
    relatedEvents: string[];
  }[];
  visualElements: {
    scene: string;
    description: string;
    keyObjects: string[];
    emotions: string[];
  }[];
  suggestedQuestions: {
    type: 'prediction' | 'analysis' | 'empathy' | 'problem-solving';
    question: string;
    context: string;
    difficulty: 'easy' | 'medium' | 'hard';
    options: string[];
    hints: string[];
  }[];
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

const storyElements = {
  characters: [
    'wise wizard', 'friendly dragon', 'clever fox', 'brave knight',
    'magical fairy', 'helpful robot', 'mysterious cat', 'playful dolphin',
    'kind giant', 'smart owl', 'courageous lion', 'gentle unicorn',
    'funny monkey', 'loyal dog', 'curious rabbit'
  ],
  magicalItems: [
    'glowing crystal', 'magical map', 'enchanted book', 'flying carpet',
    'invisible cloak', 'time-turning key', 'wishing stone', 'magical wand',
    'talking mirror', 'lucky charm', 'magical compass', 'enchanted flute',
    'magical paintbrush', 'flying broom', 'magical lantern'
  ],
  challenges: [
    'solve a riddle', 'find a hidden path', 'break a spell', 'save a friend',
    'discover a secret', 'fix a broken magic', 'find lost treasure', 'help someone in need',
    'learn a new skill', 'make new friends', 'overcome a fear', 'solve a puzzle',
    'find a way home', 'help others', 'discover a new world'
  ],
  lessons: [
    'the power of friendship', 'believing in yourself', 'helping others',
    'being brave', 'working together', 'never giving up', 'being kind',
    'sharing with others', 'being patient', 'being creative', 'being honest',
    'being helpful', 'being determined', 'being caring', 'being curious'
  ]
};

const storyTypes = {
  adventure: {
    settings: [
      'enchanted forest', 'magical castle', 'underwater city', 'floating islands',
      'crystal caves', 'time-traveling train', 'cloud kingdom', 'robot city',
      'dragons lair', 'pirate ship', 'space station', 'fairy garden',
      'underground tunnels', 'volcano island', 'ice palace'
    ],
    conflicts: [
      'lost treasure', 'mysterious map', 'ancient prophecy', 'magical curse',
      'time portal', 'missing friend', 'broken spell', 'stolen artifact',
      'hidden kingdom', 'forgotten memory', 'magical illness', 'broken promise',
      'lost power', 'mysterious message', 'ancient secret'
    ],
    resolutions: [
      'discovered new power', 'found true friendship', 'solved ancient puzzle',
      'broke the curse', 'restored balance', 'found inner strength',
      'discovered family secret', 'saved the day', 'made new friends',
      'learned valuable lesson', 'found lost treasure', 'restored peace',
      'discovered hidden talent', 'solved mystery', 'helped others'
    ]
  },
  fantasy: {
    settings: [
      'magical academy', 'dragons realm', 'fairy kingdom', 'wizards tower',
      'enchanted garden', 'mystic valley', 'crystal palace', 'magical market',
      'wizards library', 'dragons nest', 'fairy ring', 'magical forest',
      'wizards workshop', 'dragons lair', 'fairy village'
    ],
    conflicts: [
      'lost magic', 'broken spell', 'missing ingredient', 'cursed object',
      'forgotten spell', 'magical illness', 'stolen power', 'broken promise',
      'lost wand', 'mysterious potion', 'magical accident', 'forgotten memory',
      'cursed friend', 'lost book', 'broken magic'
    ],
    resolutions: [
      'mastered new spell', 'found true magic', 'broke the curse',
      'discovered power', 'restored magic', 'found inner strength',
      'learned new spell', 'saved the day', 'made magical friends',
      'discovered talent', 'found lost magic', 'restored peace',
      'mastered craft', 'solved mystery', 'helped others'
    ]
  },
  animals: {
    settings: [
      'friendly zoo', 'wild jungle', 'ocean depths', 'forest home',
      'savanna plains', 'mountain den', 'riverbank', 'desert oasis',
      'arctic tundra', 'rainforest canopy', 'meadow field', 'coastal beach',
      'prairie land', 'woodland grove', 'tropical island'
    ],
    conflicts: [
      'lost animal friend', 'habitat in danger', 'new animal in town',
      'missing food source', 'unusual weather', 'strange visitors',
      'forest changes', 'ocean pollution', 'migration challenges',
      'new neighbors', 'unusual behavior', 'missing family',
      'environmental changes', 'new territory', 'unfamiliar sounds'
    ],
    resolutions: [
      'found new friends', 'saved the habitat', 'helped each other',
      'shared resources', 'adapted together', 'worked as a team',
      'protected home', 'cleaned environment', 'found safe path',
      'made peace', 'understood differences', 'reunited family',
      'adapted to changes', 'shared territory', 'learned to communicate'
    ]
  },
  educational: {
    settings: [
      'science lab', 'history museum', 'space station', 'art gallery',
      'music school', 'math classroom', 'nature center', 'library',
      'weather station', 'geology site', 'botanical garden', 'aquarium',
      'planetarium', 'archaeological dig', 'conservation center'
    ],
    conflicts: [
      'scientific mystery', 'historical puzzle', 'mathematical challenge',
      'artistic block', 'musical problem', 'environmental issue',
      'research question', 'learning obstacle', 'experiment gone wrong',
      'discovery needed', 'pattern to solve', 'theory to test',
      'project deadline', 'knowledge gap', 'skill to master'
    ],
    resolutions: [
      'solved the problem', 'discovered new knowledge', 'learned new skill',
      'created something new', 'helped others learn', 'made new discovery',
      'completed project', 'shared knowledge', 'fixed experiment',
      'found answer', 'solved pattern', 'proved theory',
      'met deadline', 'filled knowledge gap', 'mastered skill'
    ]
  },
  mystery: {
    settings: [
      'detectives office', 'haunted house', 'secret library', 'mysterious mansion',
      'hidden laboratory', 'ancient ruins', 'secret garden', 'mysterious island',
      'underground tunnel', 'abandoned factory', 'mysterious school', 'secret room',
      'hidden passage', 'mysterious cave', 'secret workshop'
    ],
    conflicts: [
      'missing object', 'mysterious note', 'strange sound', 'hidden message',
      'disappearing items', 'mysterious mark', 'secret code', 'strange event',
      'missing friend', 'mysterious light', 'hidden clue', 'strange noise',
      'mysterious shadow', 'secret map', 'strange smell'
    ],
    resolutions: [
      'solved the case', 'found the truth', 'discovered secret',
      'uncovered mystery', 'found missing item', 'solved puzzle',
      'discovered truth', 'found answer', 'solved riddle',
      'uncovered plot', 'found evidence', 'solved problem',
      'discovered clue', 'found solution', 'solved mystery'
    ]
  }
};

const generateRandomElement = (array: string[]) => {
  return array[Math.floor(Math.random() * array.length)];
};

const generateUniqueElements = (array: string[], count: number) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Generate story based on data
export const generateStory = async (params: StoryParams): Promise<{ title: string; content: string; insights: StoryInsights }> => {
  const { childName, childAge, storyType, interests } = params;

  // Get story type specific elements
  const typeElements = storyTypes[storyType as keyof typeof storyTypes];
  const setting = generateRandomElement(typeElements.settings);
  const conflict = generateRandomElement(typeElements.conflicts);
  const resolution = generateRandomElement(typeElements.resolutions);

  // Generate random story elements
  const character = generateRandomElement(storyElements.characters);
  const magicalItem = generateRandomElement(storyElements.magicalItems);
  const challenge = generateRandomElement(storyElements.challenges);
  const lesson = generateRandomElement(storyElements.lessons);

  // Generate unique vocabulary based on story type and interests
  const vocabulary = generateUniqueElements([
    ...typeElements.settings,
    ...typeElements.conflicts,
    ...typeElements.resolutions,
    ...interests.split(',').map(i => i.trim()),
    character,
    magicalItem,
    challenge,
    lesson
  ], 8);

  // Generate story title with more variety
  const titleTemplates = [
    `${childName}'s ${storyType.charAt(0).toUpperCase() + storyType.slice(1)}: The ${conflict}`,
    `${childName} and the ${magicalItem}`,
    `${childName}'s Journey to ${setting}`,
    `${childName} and the ${character}'s ${challenge}`,
    `${childName}'s ${storyType.charAt(0).toUpperCase() + storyType.slice(1)}: A Tale of ${lesson}`
  ];
  const title = generateRandomElement(titleTemplates);

  // Generate story content with more creative elements
  const content = `
Once upon a time, in a ${setting}, there lived a young adventurer named ${childName}. 
${childName} was ${childAge} years old and loved ${interests}.

One day, while exploring the ${setting}, ${childName} met a ${character} who had a ${magicalItem}. 
The ${character} told ${childName} about a ${conflict} that needed to be solved.

Determined to help, ${childName} and the ${character} began an exciting journey to ${challenge}. 
Along the way, they discovered that their love for ${interests} helped them overcome obstacles.

As they ventured deeper into the ${setting}, they faced many challenges but learned about ${lesson}. 
Together, they worked to find a solution to the ${conflict}.

Finally, after many exciting adventures, ${childName} and the ${character} ${resolution}. 
This experience taught them that with determination and the help of friends, anything is possible.

From that day forward, ${childName} knew that every adventure, no matter how challenging, could lead to amazing discoveries and new friendships.
`;

  // Generate story insights with more variety
  const insights: StoryInsights = {
    moral: `The importance of ${lesson}`,
    vocabulary: vocabulary,
    readingTime: "5-7 minutes",
    sequence: [
      {
        order: 1,
        event: `Meeting the ${character}`,
        importance: 'high',
        relatedEvents: [`Discovering the ${magicalItem}`, `Learning about the ${conflict}`]
      },
      {
        order: 2,
        event: `Starting the journey to ${challenge}`,
        importance: 'high',
        relatedEvents: [`Using the ${magicalItem}`, `Facing obstacles`]
      },
      {
        order: 3,
        event: "Facing challenges together",
        importance: 'medium',
        relatedEvents: [`Learning about ${lesson}`, `Working as a team`]
      },
      {
        order: 4,
        event: `Solving the ${conflict}`,
        importance: 'high',
        relatedEvents: [`Using their skills`, `Helping others`]
      },
      {
        order: 5,
        event: "Learning valuable lessons",
        importance: 'medium',
        relatedEvents: [`Making new friends`, `Growing stronger`]
      }
    ],
    visualElements: [
      {
        scene: `The ${setting}`,
        description: `A magical place filled with wonder and mystery`,
        keyObjects: [setting.split(' ')[0], magicalItem, character],
        emotions: ['excited', 'curious', 'determined']
      },
      {
        scene: "The Challenge",
        description: `Working together to ${challenge}`,
        keyObjects: [magicalItem, character, 'friends'],
        emotions: ['brave', 'confident', 'happy']
      }
    ],
    suggestedQuestions: [
      {
        type: 'prediction',
        question: `What do you think ${childName} will discover with the ${magicalItem}?`,
        context: "At the beginning of the story",
        difficulty: 'easy',
        options: ['A new friend', 'A secret path', 'A magical power'],
        hints: ['Think about what you would do with this magical item', 'What might it help you find?']
      },
      {
        type: 'empathy',
        question: `How do you think ${childName} felt when they met the ${character}?`,
        context: "When meeting their new friend",
        difficulty: 'medium',
        options: ['Excited', 'Nervous', 'Curious'],
        hints: ['Think about how you would feel meeting a magical character', 'What would make you feel this way?']
      }
    ]
  };

  return { title, content, insights };
};
