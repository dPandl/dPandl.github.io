import React, { useRef, KeyboardEvent, useState, useEffect } from 'react';

interface Card3DProps {
    title: string;
    description: string;
    href?: string;
    onClick?: () => void;
    glowColor: 'cyan' | 'lime' | 'violet' | 'yellow' | 'pink' | 'blue' | 'gray' | 'teal' | 'orange' | 'customTeal';
    status?: string;
}

const Card3D: React.FC<Card3DProps> = ({ title, description, href, glowColor, onClick, status }) => {
    const containerRef = useRef<HTMLDivElement | HTMLAnchorElement>(null);
    const rotatableRef = useRef<HTMLDivElement>(null);
    const [isTapped, setIsTapped] = useState(false);
    const [supportsHover, setSupportsHover] = useState(true);
    const isComingSoon = !!status;

    useEffect(() => {
        // More reliable detection for touch devices (pointer: coarse means finger/touch)
        const hoverMedia = window.matchMedia('(hover: hover)');
        const touchMedia = window.matchMedia('(pointer: coarse)');
        
        // We want the two-tap logic if it's a touch device OR if it doesn't support hover
        const isTouch = touchMedia.matches || !hoverMedia.matches;
        setSupportsHover(!isTouch);

        const handleGlobalClick = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsTapped(false);
            }
        };

        if (isTouch) {
            document.addEventListener('mousedown', handleGlobalClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleGlobalClick);
        };
    }, []);

    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        if (!supportsHover || !rotatableRef.current) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        const rotateY = (x / (rect.width / 2)) * 15;
        const rotateX = -(y / (rect.height / 2)) * 15;

        rotatableRef.current.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
        if (!rotatableRef.current) return;
        rotatableRef.current.style.transform = 'rotateX(0deg) rotateY(0deg)';
    };

    const handleClick = (e: React.MouseEvent<HTMLElement>) => {
        // If device doesn't support hover (touch device)
        if (!supportsHover) {
            if (!isTapped) {
                // First tap: reveal info
                e.preventDefault();
                setIsTapped(true);
                return;
            }
            // Second tap: let it navigate or click
        }
        
        if (onClick) onClick();
    };
    
    const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onClick();
        }
    };

    const activeStyles = {
        cyan: {
            shadow: isTapped ? 'shadow-[0_0_25px_5px] shadow-cyan-500/40' : 'group-hover:shadow-[0_0_25px_5px] group-hover:shadow-cyan-500/30 dark:group-hover:shadow-cyan-500/40',
            border: isTapped ? 'border-cyan-500' : 'group-hover:border-cyan-500 dark:group-hover:border-cyan-400',
            bg: 'bg-gradient-to-br from-white to-cyan-50 dark:from-cyan-900/70 dark:to-gray-800'
        },
        lime: {
            shadow: isTapped ? 'shadow-[0_0_25px_5px] shadow-lime-500/40' : 'group-hover:shadow-[0_0_25px_5px] group-hover:shadow-lime-500/30 dark:group-hover:shadow-lime-500/40',
            border: isTapped ? 'border-lime-500' : 'group-hover:border-lime-500 dark:group-hover:border-lime-400',
            bg: 'bg-gradient-to-br from-white to-lime-50 dark:from-lime-900/70 dark:to-gray-800'
        },
        violet: {
            shadow: isTapped ? 'shadow-[0_0_25px_5px] shadow-violet-500/40' : 'group-hover:shadow-[0_0_25px_5px] group-hover:shadow-violet-500/30 dark:group-hover:shadow-violet-500/40',
            border: isTapped ? 'border-violet-500' : 'group-hover:border-violet-500 dark:group-hover:border-violet-400',
            bg: 'bg-gradient-to-br from-white to-violet-50 dark:from-violet-900/70 dark:to-gray-800'
        },
        yellow: {
            shadow: isTapped ? 'shadow-[0_0_25px_5px] shadow-yellow-500/40' : 'group-hover:shadow-[0_0_25px_5px] group-hover:shadow-yellow-500/30 dark:group-hover:shadow-yellow-500/40',
            border: isTapped ? 'border-yellow-500' : 'group-hover:border-yellow-500 dark:group-hover:border-yellow-400',
            bg: 'bg-gradient-to-br from-white to-yellow-50 dark:from-yellow-900/70 dark:to-gray-800'
        },
        pink: {
            shadow: isTapped ? 'shadow-[0_0_25px_5px] shadow-pink-500/40' : 'group-hover:shadow-[0_0_25px_5px] group-hover:shadow-pink-500/30 dark:group-hover:shadow-pink-500/40',
            border: isTapped ? 'border-pink-500' : 'group-hover:border-pink-500 dark:group-hover:border-pink-400',
            bg: 'bg-gradient-to-br from-white to-pink-50 dark:from-pink-900/70 dark:to-gray-800'
        },
        blue: {
            shadow: isTapped ? 'shadow-[0_0_25px_5px] shadow-blue-500/40' : 'group-hover:shadow-[0_0_25px_5px] group-hover:shadow-blue-500/30 dark:group-hover:shadow-blue-500/40',
            border: isTapped ? 'border-blue-500' : 'group-hover:border-blue-500 dark:group-hover:border-blue-400',
            bg: 'bg-gradient-to-br from-white to-blue-50 dark:from-blue-900/70 dark:to-gray-800'
        },
        gray: {
            shadow: isTapped ? 'shadow-[0_0_25px_5px] shadow-gray-500/40' : 'group-hover:shadow-[0_0_25px_5px] group-hover:shadow-gray-500/30 dark:group-hover:shadow-gray-500/40',
            border: isTapped ? 'border-gray-500' : 'group-hover:border-gray-400 dark:group-hover:border-gray-500',
            bg: 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800/70 dark:to-gray-900'
        },
        teal: {
            shadow: isTapped ? 'shadow-[0_0_25px_5px] shadow-teal-500/40' : 'group-hover:shadow-[0_0_25px_5px] group-hover:shadow-teal-500/30 dark:group-hover:shadow-teal-500/40',
            border: isTapped ? 'border-teal-500' : 'group-hover:border-teal-500 dark:group-hover:border-teal-400',
            bg: 'bg-gradient-to-br from-white to-teal-50 dark:from-teal-900/70 dark:to-gray-800'
        },
        orange: {
            shadow: isTapped ? 'shadow-[0_0_25px_5px] shadow-orange-500/40' : 'group-hover:shadow-[0_0_25px_5px] group-hover:shadow-orange-500/30 dark:group-hover:shadow-orange-500/40',
            border: isTapped ? 'border-orange-500' : 'group-hover:border-orange-500 dark:group-hover:border-orange-400',
            bg: 'bg-gradient-to-br from-white to-orange-50 dark:from-orange-900/70 dark:to-gray-800'
        },
        customTeal: {
            shadow: isTapped ? 'shadow-[0_0_25px_5px] shadow-[#00BCD4]/40' : 'group-hover:shadow-[0_0_25px_5px] group-hover:shadow-[#00BCD4]/30 dark:group-hover:shadow-[#00BCD4]/40',
            border: isTapped ? 'border-[#00BCD4]' : 'group-hover:border-[#00BCD4] dark:group-hover:border-[#26c6da]',
            bg: 'bg-gradient-to-br from-white to-[#e0f7fa] dark:from-[#006064]/70 dark:to-gray-800'
        }
    };

    const cardContent = (
        <div 
            className={`w-full h-full transition-all duration-300 ease-in-out ${isTapped ? 'scale-105' : 'group-hover:scale-105'}`}
            style={{ transformStyle: 'preserve-3d' }}
        >
            <div 
                ref={rotatableRef} 
                className={`w-full h-full`} 
                style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
            >
                <div className={`w-full h-full rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 ${activeStyles[glowColor].border} ${activeStyles[glowColor].shadow} transition-all duration-300 flex flex-col items-center justify-center p-6 text-center ${activeStyles[glowColor].bg} relative`}>
                    
                    <div className={`flex-grow flex flex-col justify-center transition-[flex-grow] duration-700 ease-in-out ${isTapped ? 'flex-grow-0' : 'group-hover:flex-grow-0'}`}>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
                            {title}
                        </h3>
                    </div>

                    <div className={`w-full overflow-hidden transition-all duration-700 ease-in-out ${isTapped ? 'max-h-48 opacity-100' : 'max-h-0 group-hover:max-h-48 opacity-0 group-hover:opacity-100'}`}>
                         <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed pt-2">
                            {description}
                        </p>
                    </div>

                    {isComingSoon && (
                        <div className={`absolute bottom-6 left-1/2 -translate-x-1/2 transition-opacity duration-300 ease-in-out ${isTapped ? 'opacity-0' : 'group-hover:opacity-0'}`}>
                            <div className="px-3 py-1 text-sm font-semibold text-yellow-800 bg-yellow-400/20 dark:text-yellow-300 dark:bg-yellow-900/50 rounded-full border border-yellow-400/30 dark:border-yellow-700/50">
                                {status}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    const isClickable = (!!href || !!onClick) && !isComingSoon;

    return React.createElement(
        href ? 'a' : 'div',
        {
            ref: containerRef as any,
            href: href,
            onClick: handleClick,
            onKeyDown: isClickable ? handleKeyDown : undefined,
            onMouseMove: handleMouseMove,
            onMouseLeave: handleMouseLeave,
            role: href ? undefined : (isClickable ? 'button' : undefined),
            tabIndex: isClickable ? 0 : -1,
            className: `group block aspect-[16/9] ${isClickable ? 'cursor-pointer' : 'cursor-default'} outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-gray-900 rounded-2xl`,
            style: { perspective: '1000px' }
        },
        cardContent
    );
};

export default Card3D;