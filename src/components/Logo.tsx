'use client';

import React from 'react';

const Logo: React.FC = () => {
    return (
        <div className="flex items-center gap-2">
            <div className="relative">
                <div className="w-10 h-10 bg-primary rounded-full border-2 border-ink flex items-center justify-center transform rotate-6">
                    <span className="text-2xl">❤️</span>
                </div>
            </div>
            <div className="flex flex-col">
                <span className="text-2xl font-bold text-ink leading-none">
                    How<span className="text-primary">To</span>Help
                </span>
                <span className="text-xs text-ink/60 italic">Empowering Communities</span>
            </div>
        </div>
    );
};

export default Logo;
