import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Play, Pause, RotateCcw, Volume2, Mic2, Loader2 } from 'lucide-react';
import { availableVoices, synthesizeSpeech, getCachedAudio, setCachedAudio, VoiceOption, ELEVENLABS_API_KEY } from '@/utils/voiceService';

interface ReadTogetherProps {
    content: string;
    isVisible: boolean;
    onFinish?: () => void;
}

const ReadTogether: React.FC<ReadTogetherProps> = ({ content, isVisible, onFinish }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
    const [readingSpeed, setReadingSpeed] = useState(1);
    const [sentences, setSentences] = useState<string[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<string>(availableVoices[0].id);
    const [error, setError] = useState<string | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
    const [audioStartTime, setAudioStartTime] = useState<number>(0);
    const [audioPauseTime, setAudioPauseTime] = useState<number>(0);
    const [nextAudioBuffer, setNextAudioBuffer] = useState<ArrayBuffer | null>(null);

    // Initialize audio context
    const initAudioContext = () => {
        if (!audioContextRef.current) {
            try {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
                // Resume audio context if it's suspended (needed for some browsers)
                if (audioContextRef.current.state === 'suspended') {
                    audioContextRef.current.resume();
                }
            } catch (err) {
                console.error('Failed to initialize audio context:', err);
                setError('Failed to initialize audio. Please try refreshing the page.');
            }
        }
    };

    useEffect(() => {
        // Split content into sentences and clean up formatting characters
        const cleanContent = content
            .replace(/👤[^]*?📚.*?!/s, '') // Remove the entire header section including emojis and metadata
            .replace(/[📖👤📝🎯•→]/g, '') // Remove specific emojis
            .replace(/\d️⃣/g, '') // Remove numbered emojis
            .replace(/={3,}|-{3,}|_{3,}/g, '') // Remove separator lines
            .replace(/\([^)]*\)/g, '') // Remove parenthetical content
            .trim();

        // Split into sentences and then break long sentences at natural break points
        const initialSentences = cleanContent
            .split(/(?<=[.!?])\s+/)
            .map(sentence => sentence.trim())
            .filter(sentence =>
                sentence.length > 0 &&
                !sentence.match(/^[\s\-=_]*$/) &&
                !sentence.match(/^[•:,]/) // Filter out bullet points and incomplete phrases
            );

        // Break long sentences at natural break points
        const processedSentences = initialSentences.flatMap(sentence => {
            if (sentence.length <= 200) return [sentence];

            // Break at commas, semicolons, or other natural pause points
            return sentence
                .split(/(?<=[,;])\s+/)
                .map(part => part.trim())
                .filter(part => part.length > 0);
        });

        setSentences(processedSentences);

        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
                audioContextRef.current = null;
            }
        };
    }, [content]);

    useEffect(() => {
        if (!isVisible && isPlaying) {
            // Only stop the audio if it's playing, don't reset the position
            handlePauseOnly();
        }
    }, [isVisible]);

    // Preload next sentence audio
    const preloadNextSentence = async () => {
        if (currentSentenceIndex >= sentences.length - 1) return;

        const nextSentence = sentences[currentSentenceIndex + 1];
        if (!nextSentence || nextSentence.trim().length === 0) return;

        try {
            // Check cache first
            let audioBuffer = getCachedAudio(nextSentence, selectedVoice);

            if (!audioBuffer) {
                // If not in cache, synthesize new speech
                audioBuffer = await synthesizeSpeech(nextSentence, selectedVoice);
                if (audioBuffer) {
                    setCachedAudio(nextSentence, selectedVoice, audioBuffer);
                }
            }
            setNextAudioBuffer(audioBuffer);
        } catch (error) {
            console.error('Error preloading next sentence:', error);
        }
    };

    const playAudioBuffer = async (audioBuffer: ArrayBuffer) => {
        try {
            // Initialize audio context if not already done
            initAudioContext();
            if (!audioContextRef.current) return;

            // Stop any currently playing audio
            if (sourceNodeRef.current) {
                sourceNodeRef.current.stop();
                sourceNodeRef.current.disconnect();
            }

            const buffer = await audioContextRef.current.decodeAudioData(audioBuffer.slice(0));
            sourceNodeRef.current = audioContextRef.current.createBufferSource();
            sourceNodeRef.current.buffer = buffer;
            sourceNodeRef.current.playbackRate.value = readingSpeed;
            sourceNodeRef.current.connect(audioContextRef.current.destination);

            // Add onended handler to notify when playback is complete
            sourceNodeRef.current.onended = () => {
                onFinish?.();
            };

            // Start preloading next sentence when this one starts playing
            if (currentSentenceIndex < sentences.length - 1) {
                preloadNextSentence();
            }

            // Create a promise that resolves when the audio ends
            const playbackPromise = new Promise<void>((resolve) => {
                if (sourceNodeRef.current) {
                    sourceNodeRef.current.onended = () => {
                        setAudioStartTime(0);
                        setAudioPauseTime(0);
                        // Move to next sentence when current one ends
                        if (isPlaying && currentSentenceIndex < sentences.length - 1) {
                            setCurrentSentenceIndex(prev => prev + 1);
                            if (nextAudioBuffer) {
                                playAudioBuffer(nextAudioBuffer);
                                setNextAudioBuffer(null);
                            } else {
                                speakCurrentSentence();
                            }
                        } else {
                            setIsPlaying(false);
                            if (currentSentenceIndex >= sentences.length - 1) {
                                setCurrentSentenceIndex(0);
                            }
                        }
                        resolve();
                    };
                }
            });

            // If we're resuming from a pause
            const offset = audioPauseTime > 0 ? (audioPauseTime - audioStartTime) / 1000 : 0;
            sourceNodeRef.current.start(0, offset);
            setAudioStartTime(audioContextRef.current.currentTime * 1000 - offset * 1000);
            setIsPlaying(true);
            setIsLoading(false);
            setError(null);

            // Wait for the audio to finish
            await playbackPromise;
        } catch (error) {
            console.error('Error playing audio:', error);
            setIsPlaying(false);
            setIsLoading(false);
            setError('Failed to play audio. Please try again.');
        }
    };

    const speakCurrentSentence = async () => {
        if (currentSentenceIndex >= sentences.length) {
            setIsLoading(false);
            setIsPlaying(false);
            return;
        }

        const currentSentence = sentences[currentSentenceIndex];
        if (!currentSentence || currentSentence.trim().length === 0) {
            if (currentSentenceIndex < sentences.length - 1) {
                setCurrentSentenceIndex(prev => prev + 1);
                return speakCurrentSentence();
            }
            setIsLoading(false);
            setIsPlaying(false);
            return;
        }

        setError(null);
        setIsLoading(true);

        try {
            // Check cache first
            let audioBuffer = getCachedAudio(currentSentence, selectedVoice);

            if (!audioBuffer) {
                // If not in cache, synthesize new speech
                audioBuffer = await synthesizeSpeech(currentSentence, selectedVoice);
                if (audioBuffer) {
                    setCachedAudio(currentSentence, selectedVoice, audioBuffer);
                } else {
                    throw new Error('Failed to synthesize speech');
                }
            }

            await playAudioBuffer(audioBuffer);
        } catch (error) {
            console.error('Error speaking sentence:', error);
            setIsPlaying(false);
            setIsLoading(false);
            if (error instanceof Error) {
                if (!ELEVENLABS_API_KEY) {
                    setError('Missing API key. Please check your environment variables.');
                } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                    setError('Network error. Please check your internet connection.');
                } else {
                    setError(`Speech generation failed: ${error.message}`);
                }
            } else {
                setError('Failed to generate speech. Please try again.');
            }
        }
    };

    const handlePlay = async () => {
        if (isPlaying) {
            handlePauseOnly();
        } else {
            setIsPlaying(true);
            setIsLoading(true);
            try {
                await speakCurrentSentence();
            } catch (error) {
                console.error('Error starting playback:', error);
                setIsPlaying(false);
                setIsLoading(false);
                setError('Failed to start playback. Please try again.');
            }
        }
    };

    const handlePauseOnly = () => {
        if (sourceNodeRef.current && audioContextRef.current) {
            try {
                setAudioPauseTime(audioContextRef.current.currentTime * 1000);
                sourceNodeRef.current.stop();
                sourceNodeRef.current.disconnect();
            } catch (err) {
                console.error('Error pausing audio:', err);
            }
        }
        setIsPlaying(false);
        setIsLoading(false);
    };

    const handleReset = () => {
        handleStop();
        setCurrentSentenceIndex(0);
        setError(null);
        setIsLoading(false);
        setAudioStartTime(0);
        setAudioPauseTime(0);
    };

    const handleStop = () => {
        if (sourceNodeRef.current) {
            try {
                sourceNodeRef.current.stop();
                sourceNodeRef.current.disconnect();
            } catch (err) {
                console.error('Error stopping audio:', err);
            }
        }
        setIsPlaying(false);
        setIsLoading(false);
        setAudioStartTime(0);
        setAudioPauseTime(0);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t p-4 shadow-lg z-50">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col gap-4">
                    {/* Error message */}
                    {error && (
                        <div className="bg-destructive/10 text-destructive p-2 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    {/* Current sentence display */}
                    <div className="bg-secondary/20 p-4 rounded-lg min-h-[100px] text-lg">
                        {sentences[currentSentenceIndex]}
                    </div>

                    {/* Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handlePlay}
                                disabled={isLoading}
                                className="w-12 h-12"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                ) : isPlaying ? (
                                    <Pause className="h-6 w-6" />
                                ) : (
                                    <Play className="h-6 w-6" />
                                )}
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleReset}
                                disabled={isLoading}
                                className="w-12 h-12"
                            >
                                <RotateCcw className="h-6 w-6" />
                            </Button>
                        </div>

                        <div className="flex items-center gap-4 flex-1 max-w-[300px]">
                            <Volume2 className="h-5 w-5 flex-shrink-0" />
                            <Slider
                                value={[readingSpeed]}
                                onValueChange={([value]) => setReadingSpeed(value)}
                                min={0.5}
                                max={2}
                                step={0.1}
                                disabled={isLoading}
                                className="flex-1"
                            />
                            <span className="text-sm whitespace-nowrap">
                                {readingSpeed.toFixed(1)}x
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Mic2 className="h-5 w-5" />
                            <Select
                                value={selectedVoice}
                                onValueChange={setSelectedVoice}
                                disabled={isLoading}
                            >
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select voice" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableVoices.map((voice) => (
                                        <SelectItem
                                            key={voice.id}
                                            value={voice.id}
                                        >
                                            {voice.name} - {voice.description}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="text-sm text-muted-foreground whitespace-nowrap">
                            {currentSentenceIndex + 1} / {sentences.length}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReadTogether; 