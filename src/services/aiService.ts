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
    isAutismFriendly?: boolean;
}

interface Story {
    title: string;
    content: string;
}

export const aiService = {
    async generateStory({ childName, childAge, interests, storyType, storyLength, isAutismFriendly = false }: StoryGenerationParams): Promise<Story> {
        try {
            const storyPrompt = `Create a children's story with the following details:
            - Child's name: ${childName}
            - Age: ${childAge}
            - Interests: ${interests}
            - Story type: ${storyType}
            - Length: ${storyLength}
            ${isAutismFriendly ? `
            - Make the story autism-friendly:
              * Use clear, simple language
              * Break complex ideas into smaller parts
              * Include sensory details
              * Add emotional context
              * Make sequences clear
              * Use repetitive patterns when appropriate
              * Include visual cues in text (will be formatted later)` : ''}

            Please create a story that is:
            1. Age-appropriate for a ${childAge}-year-old
            2. Incorporates the child's interests naturally
            3. Has a clear moral or learning outcome
            4. Is engaging and imaginative
            5. Uses simple language appropriate for the age group
            6. Has a clear structure with beginning, middle, and end

            Format the response as follows:
            Title: [Story Title]
            Content: [Story Content]`;

            const completion = await openai.chat.completions.create({
                model: 'deepseek/deepseek-r1:free',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a creative children\'s story writer who creates engaging, age-appropriate stories with positive messages.'
                    },
                    {
                        role: 'user',
                        content: storyPrompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 2000,
            });

            const response = completion.choices[0].message.content;
            if (!response) {
                throw new Error('No response from AI');
            }

            // Parse the response to extract title and content
            const titleMatch = response.match(/Title:\s*(.+)/);
            const contentMatch = response.match(/Content:\s*([\s\S]+)/);

            if (!titleMatch || !contentMatch) {
                throw new Error('Invalid response format from AI');
            }

            return {
                title: titleMatch[1].trim(),
                content: contentMatch[1].trim()
            };
        } catch (error) {
            console.error('Error generating story:', error);
            throw new Error('Failed to generate story');
        }
    }
}; 