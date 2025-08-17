import OpenAI from 'openai';

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

if (!API_KEY) {
    throw new Error('OpenRouter API key is not set in environment variables');
}

const openai = new OpenAI({
    apiKey: API_KEY,
    baseURL: 'https://openrouter.ai/api/v1',
    dangerouslyAllowBrowser: true,
});

interface StoryGenerationParams {
    childName: string;
    childAge: number;
    interests: string;   // Used to shape story, not mentioned directly
    storyType: string;
    storyLength: string;
}

interface Story {
    title: string;
    content: string;
    moral?: string;
}

export const aiService = {
    async generateStory({
        childName,
        childAge,
        interests,
        storyType,
        storyLength
    }: StoryGenerationParams): Promise<Story> {
        try {
            const storyPrompt = `
Write a creative children's story with these details:
- Main character's name: ${childName}
- Age of target reader: ${childAge}
- Story type: ${storyType}
- Story length: ${storyLength}
- Inspiration/theme: ${interests} 
  (IMPORTANT: Do NOT mention the word "${interests}" directly. 
  Instead, let it guide the setting, characters, or events.)

Guidelines:
1. The story must be age-appropriate for a ${childAge}-year-old.
2. Use the interests only as inspiration for the world, characters, or plot — never state them directly.
3. Use simple vocabulary and short sentences.
4. Create a clear structure: beginning, middle, and end.
5. Make it imaginative, engaging, and magical.
6. End with a clear **moral or lesson**.

Format the output like this:

Title: [Story Title]
Content:
[Story Content, split into short paragraphs]
Moral: [One-sentence moral lesson]`;

            const completion = await openai.chat.completions.create({
                model: 'deepseek/deepseek-r1:free',
                messages: [
                    {
                        role: 'system',
                        content: "You are an expert children's story writer. You create magical, engaging, and meaningful stories for kids. Always include a moral lesson."
                    },
                    {
                        role: 'user',
                        content: storyPrompt
                    }
                ],
                temperature: 0.9,
                top_p: 0.95,
                presence_penalty: 0.6,
                max_tokens: 2000,
            });

            const response = completion.choices[0].message.content;
            if (!response) {
                throw new Error('No response from AI');
            }

            // Parse response
            const titleMatch = response.match(/Title:\s*(.+)/);
            const contentMatch = response.match(/Content:\s*([\s\S]*?)(?=Moral:|$)/);
            const moralMatch = response.match(/Moral:\s*(.+)/);

            if (!titleMatch || !contentMatch) {
                throw new Error('Invalid response format from AI');
            }

            return {
                title: titleMatch[1].trim(),
                content: contentMatch[1].trim(),
                moral: moralMatch ? moralMatch[1].trim() : undefined,
            };
        } catch (error) {
            console.error('Error generating story:', error);
            throw new Error('Failed to generate story');
        }
    }
};
