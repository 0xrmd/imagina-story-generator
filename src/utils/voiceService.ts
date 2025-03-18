const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1';
export const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;

// Voice IDs from ElevenLabs (free voices)
const VOICES = {
    rachel: '21m00Tcm4TlvDq8ikWAM', // Rachel - Friendly young American female
    antoni: 'ErXwobaYiN019PkySvjV',  // Antoni - Warm male voice
    bella: 'EXAVITQu4vr4xnSDxMaL',   // Bella - Gentle female voice
    josh: 'TxGEqnHWrfWFTfGW9XjX'     // Josh - Young male voice
};

export interface VoiceOption {
    id: string;
    name: string;
    description: string;
}

export const availableVoices: VoiceOption[] = [
    { id: VOICES.rachel, name: 'Rachel', description: 'Friendly young female voice' },
    { id: VOICES.antoni, name: 'Antoni', description: 'Warm male voice' },
    { id: VOICES.bella, name: 'Bella', description: 'Gentle female voice' },
    { id: VOICES.josh, name: 'Josh', description: 'Young male voice' }
];

export const synthesizeSpeech = async (
    text: string,
    voiceId: string = VOICES.rachel
): Promise<ArrayBuffer> => {
    try {
        if (!ELEVENLABS_API_KEY) {
            throw new Error('Missing API key');
        }

        // Validate text length (ElevenLabs has a limit of 2500 characters)
        if (text.length > 2500) {
            throw new Error('Text is too long. Maximum length is 2500 characters.');
        }

        // Clean the text of any special characters that might cause issues
        const cleanedText = text
            .replace(/[^\p{L}\p{N}\p{P}\p{Z}]/gu, '') // Remove non-printable characters
            .trim();

        if (!cleanedText) {
            throw new Error('Text is empty after cleaning');
        }

        // Verify voice ID is valid
        const validVoiceIds = Object.values(VOICES);
        if (!validVoiceIds.includes(voiceId)) {
            throw new Error('Invalid voice ID');
        }

        const response = await fetch(
            `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}/stream`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'xi-api-key': ELEVENLABS_API_KEY,
                },
                body: JSON.stringify({
                    text: cleanedText,
                    model_id: 'eleven_monolingual_v1',
                    voice_settings: {
                        stability: 0.75,
                        similarity_boost: 0.75,
                        style: 0.5,
                        use_speaker_boost: true
                    }
                }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.detail?.message || errorData?.detail || response.statusText;

            // Handle specific API error cases
            if (response.status === 429) {
                throw new Error('API rate limit exceeded. Please try again later.');
            } else if (response.status === 401) {
                throw new Error('Invalid API key or unauthorized access.');
            }

            throw new Error(errorMessage || `API Error (${response.status})`);
        }

        const buffer = await response.arrayBuffer();
        if (!buffer || buffer.byteLength === 0) {
            throw new Error('Received empty audio data from the API');
        }

        return buffer;
    } catch (error) {
        console.error('Error synthesizing speech:', error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Failed to synthesize speech');
    }
};

// Cache for audio buffers
const audioCache = new Map<string, ArrayBuffer>();

export const getCachedAudio = (text: string, voiceId: string): ArrayBuffer | undefined => {
    const key = `${voiceId}-${text}`;
    return audioCache.get(key);
};

export const setCachedAudio = (text: string, voiceId: string, audio: ArrayBuffer) => {
    const key = `${voiceId}-${text}`;
    audioCache.set(key, audio);
}; 