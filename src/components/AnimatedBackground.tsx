import React from 'react';

const AnimatedBackground: React.FC = () => {
    return (
        <div className="fixed inset-0 overflow-hidden bg-gradient-to-b from-blue-50 to-purple-50 dark:from-slate-900 dark:to-slate-800">
            {/* Floating clouds with faces */}
            <div className="absolute top-10 left-10 animate-float-slow">
                <div className="relative w-24 h-12">
                    <div className="absolute inset-0 bg-white/80 rounded-full shadow-lg" />
                    <div className="absolute top-1/2 left-1/4 w-2 h-2 bg-blue-400 rounded-full" /> {/* Eye */}
                    <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-blue-400 rounded-full" /> {/* Eye */}
                    <div className="absolute bottom-1/4 left-1/2 w-4 h-2 bg-pink-300 rounded-full transform -translate-x-1/2" /> {/* Smile */}
                </div>
            </div>
            <div className="absolute top-20 right-20 animate-float">
                <div className="relative w-32 h-16">
                    <div className="absolute inset-0 bg-white/80 rounded-full shadow-lg" />
                    <div className="absolute top-1/2 left-1/3 w-2 h-2 bg-blue-400 rounded-full" />
                    <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-blue-400 rounded-full" />
                    <div className="absolute bottom-1/4 left-1/2 w-4 h-2 bg-pink-300 rounded-full transform -translate-x-1/2" />
                </div>
            </div>

            {/* Cute bunnies with more details */}
            <div className="absolute bottom-10 left-1/3 animate-bounce">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 bg-white/90 rounded-full shadow-lg" />
                    {/* Ears */}
                    <div className="absolute -top-2 left-1/4 w-4 h-6 bg-pink-300 rounded-full transform -rotate-12" />
                    <div className="absolute -top-2 right-1/4 w-4 h-6 bg-pink-300 rounded-full transform rotate-12" />
                    {/* Inner ears */}
                    <div className="absolute -top-1 left-1/4 w-3 h-4 bg-pink-200 rounded-full transform -rotate-12" />
                    <div className="absolute -top-1 right-1/4 w-3 h-4 bg-pink-200 rounded-full transform rotate-12" />
                    {/* Eyes */}
                    <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-black rounded-full" />
                    <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-black rounded-full" />
                    {/* Nose */}
                    <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1 bg-pink-400 rounded-full transform -translate-x-1/2" />
                    {/* Cheeks */}
                    <div className="absolute bottom-1/4 left-1/4 w-1.5 h-1 bg-pink-200 rounded-full" />
                    <div className="absolute bottom-1/4 right-1/4 w-1.5 h-1 bg-pink-200 rounded-full" />
                </div>
            </div>

            <div className="absolute bottom-20 right-1/3 animate-bounce-delayed">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 bg-white/90 rounded-full shadow-lg" />
                    {/* Ears */}
                    <div className="absolute -top-2 left-1/4 w-4 h-6 bg-pink-300 rounded-full transform -rotate-12" />
                    <div className="absolute -top-2 right-1/4 w-4 h-6 bg-pink-300 rounded-full transform rotate-12" />
                    {/* Inner ears */}
                    <div className="absolute -top-1 left-1/4 w-3 h-4 bg-pink-200 rounded-full transform -rotate-12" />
                    <div className="absolute -top-1 right-1/4 w-3 h-4 bg-pink-200 rounded-full transform rotate-12" />
                    {/* Eyes */}
                    <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-black rounded-full" />
                    <div className="absolute bottom-1/4 right-1/3 w-2 h-2 bg-black rounded-full" />
                    {/* Nose */}
                    <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1 bg-pink-400 rounded-full transform -translate-x-1/2" />
                    {/* Cheeks */}
                    <div className="absolute bottom-1/4 left-1/4 w-1.5 h-1 bg-pink-200 rounded-full" />
                    <div className="absolute bottom-1/4 right-1/4 w-1.5 h-1 bg-pink-200 rounded-full" />
                </div>
            </div>

            {/* Stars with sparkles */}
            <div className="absolute top-1/4 left-1/2 animate-twinkle">
                <div className="relative w-4 h-4">
                    <div className="absolute inset-0 bg-yellow-300 rounded-full" />
                    <div className="absolute inset-0 bg-yellow-200 rounded-full transform rotate-45" />
                    <div className="absolute inset-0 bg-yellow-100 rounded-full transform rotate-90" />
                </div>
            </div>
            <div className="absolute top-1/3 right-1/4 animate-twinkle-delayed">
                <div className="relative w-4 h-4">
                    <div className="absolute inset-0 bg-yellow-300 rounded-full" />
                    <div className="absolute inset-0 bg-yellow-200 rounded-full transform rotate-45" />
                    <div className="absolute inset-0 bg-yellow-100 rounded-full transform rotate-90" />
                </div>
            </div>

            {/* Flowers with more petals and details */}
            <div className="absolute top-1/2 left-1/4 animate-float">
                <div className="relative w-10 h-10">
                    {/* Center */}
                    <div className="absolute inset-0 bg-yellow-300 rounded-full" />
                    {/* Petals */}
                    <div className="absolute inset-0 bg-pink-400 rounded-full transform rotate-0" />
                    <div className="absolute inset-0 bg-pink-300 rounded-full transform rotate-45" />
                    <div className="absolute inset-0 bg-pink-200 rounded-full transform rotate-90" />
                    <div className="absolute inset-0 bg-pink-100 rounded-full transform rotate-[135deg]" />
                    {/* Stem */}
                    <div className="absolute bottom-0 left-1/2 w-1 h-6 bg-green-400 transform -translate-x-1/2" />
                    {/* Leaves */}
                    <div className="absolute bottom-4 left-1/2 w-3 h-2 bg-green-400 rounded-full transform -translate-x-1/2 rotate-12" />
                    <div className="absolute bottom-4 left-1/2 w-3 h-2 bg-green-400 rounded-full transform -translate-x-1/2 -rotate-12" />
                </div>
            </div>

            <div className="absolute top-1/3 right-1/3 animate-float-slow">
                <div className="relative w-10 h-10">
                    {/* Center */}
                    <div className="absolute inset-0 bg-yellow-300 rounded-full" />
                    {/* Petals */}
                    <div className="absolute inset-0 bg-purple-400 rounded-full transform rotate-0" />
                    <div className="absolute inset-0 bg-purple-300 rounded-full transform rotate-45" />
                    <div className="absolute inset-0 bg-purple-200 rounded-full transform rotate-90" />
                    <div className="absolute inset-0 bg-purple-100 rounded-full transform rotate-[135deg]" />
                    {/* Stem */}
                    <div className="absolute bottom-0 left-1/2 w-1 h-6 bg-green-400 transform -translate-x-1/2" />
                    {/* Leaves */}
                    <div className="absolute bottom-4 left-1/2 w-3 h-2 bg-green-400 rounded-full transform -translate-x-1/2 rotate-12" />
                    <div className="absolute bottom-4 left-1/2 w-3 h-2 bg-green-400 rounded-full transform -translate-x-1/2 -rotate-12" />
                </div>
            </div>

            {/* Added cute hearts */}
            <div className="absolute top-1/4 left-1/4 animate-float">
                <div className="relative w-6 h-6">
                    <div className="absolute inset-0 bg-red-400 transform rotate-45" />
                    <div className="absolute inset-0 bg-red-300 transform -rotate-45" />
                </div>
            </div>
            <div className="absolute bottom-1/4 right-1/4 animate-float-slow">
                <div className="relative w-6 h-6">
                    <div className="absolute inset-0 bg-red-400 transform rotate-45" />
                    <div className="absolute inset-0 bg-red-300 transform -rotate-45" />
                </div>
            </div>
        </div>
    );
};

export default AnimatedBackground; 