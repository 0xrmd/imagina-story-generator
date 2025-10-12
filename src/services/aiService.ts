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
    interests: string;
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
Write a ${storyType} story for a child who is ${childAge} years old.
The main character’s name is ${childName}.
The story length should match: ${storyLength}.
Use the theme of "${interests}" as inspiration for the setting, characters, or events 
Do not directly say "${interests}" in the story — let it shape the world and plot naturally.

Guidelines:
1. Use simple, age-appropriate language for a ${childAge}-year-old.
2. Make ${childName} the central character of the story.
3. Ensure a clear structure with beginning, middle, and end.
4. Keep the story engaging, imaginative, and fun.
5. End with a clear **moral or lesson**.

Format strictly like this:

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
