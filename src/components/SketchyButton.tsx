'use client';

import React from 'react';

interface SketchyButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'outline';
    className?: string;
    type?: 'button' | 'submit' | 'reset';
}

const SketchyButton: React.FC<SketchyButtonProps> = ({
    children,
    onClick,
    variant = 'primary',
    className = '',
    type = 'button'
}) => {
    const baseStyles = 'px-6 py-3 rounded-lg font-bold tracking-wide uppercase text-sm transition-all duration-200 border-2 border-ink';

    const variantStyles = {
        primary: 'bg-primary text-white hover:bg-primary/90 shadow-[shadow-sketch] hover:shadow-[shadow-sketchHover] hover:-translate-y-1',
        secondary: 'bg-secondary text-white hover:bg-secondary/90 shadow-[shadow-sketch] hover:shadow-[shadow-sketchHover] hover:-translate-y-1',
        outline: 'bg-transparent text-ink hover:bg-ink/5 shadow-none hover:shadow-[shadow-sketch]'
    };

    return (
        <button
            type={type}
            onClick={onClick}
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
        >
            {children}
        </button>
    );
};

export default SketchyButton;
