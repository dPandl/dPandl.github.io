import React from 'react';
import { Project } from '../data/projects';
import { hexToRgba, getHexGradient } from '../utils/colorUtils';

interface AppCardProps {
    app: Project;
    onClick: () => void;
}

const AppCard: React.FC<AppCardProps> = ({ app, onClick }) => {
    const appHex = app.color || '#06b6d4';
    const platform = app.supportedPlatforms || (app.mobileCompatible ? 'both' : 'desktop');
    const [isHovered, setIsHovered] = React.useState(false);

    const glowShadow = isHovered ? `0 0 25px ${hexToRgba(appHex, 0.45)}` : undefined;
    const borderColor = isHovered ? appHex : undefined;
    const backgroundGradient = getHexGradient(appHex, 0.25);

    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
                boxShadow: glowShadow,
                borderColor: borderColor
            }}
            className="group relative bg-white dark:bg-gray-800/90 rounded-3xl p-6 border border-gray-200/80 dark:border-gray-700/80 shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between h-full hover:-translate-y-1"
        >
            <div>
                {/* Header Row: Icon & Tag (fixed height container so all cards align perfectly) */}
                <div className="flex items-start justify-between gap-4 mb-4">
                    <div 
                        style={{ background: backgroundGradient }}
                        className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-md shrink-0 group-hover:scale-105 transition-transform overflow-hidden"
                    >
                        {app.icon ? (
                            <img src={app.icon} alt={app.title} className="w-full h-full object-cover rounded-2xl" />
                        ) : (
                            app.title.substring(0, 2).toUpperCase()
                        )}
                    </div>
                    <div className="flex flex-col items-end gap-1.5 min-h-[48px] justify-start">
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                            {app.category}
                        </span>
                        {app.status ? (
                            <span className="px-2.5 py-0.5 text-[11px] font-semibold rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                {app.status}
                            </span>
                        ) : (
                            /* Invisible placeholder so single-line badge cards have identical height */
                            <div className="h-[22px]" />
                        )}
                    </div>
                </div>

                {/* Title & Tagline */}
                <h3 
                    style={{ color: isHovered ? appHex : undefined }}
                    className="text-xl font-bold text-gray-900 dark:text-white mb-2 transition-colors"
                >
                    {app.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 leading-relaxed mb-6">
                    {app.tagline || app.description}
                </p>
            </div>

            {/* Footer Row: Version & Platform Circle Indicators */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-700/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                        {app.version}
                    </span>

                    {/* Platform Circle Badges (Desktop & Smartphone) */}
                    {(() => {
                        const isDesktopSupported = platform === 'both' || platform === 'desktop';
                        const isMobileSupported = platform === 'both' || platform === 'mobile';

                        return (
                            <div className="flex items-center gap-1.5" title={`Desktop: ${isDesktopSupported ? 'Unterstützt' : 'Nicht unterstützt'} | Smartphone: ${isMobileSupported ? 'Unterstützt' : 'Nicht unterstützt'}`}>
                                {/* Desktop Circle Badge */}
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center border shadow-xs transition-transform group-hover:scale-105 ${
                                    isDesktopSupported
                                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                                        : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
                                }`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>

                                {/* Smartphone Circle Badge */}
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center border shadow-xs transition-transform group-hover:scale-105 ${
                                    isMobileSupported
                                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
                                        : 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30'
                                }`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            </div>
                        );
                    })()}
                </div>

                <span className="inline-flex items-center gap-1 text-xs font-bold text-cyan-600 dark:text-cyan-400 group-hover:translate-x-1 transition-transform">
                    Details
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </span>
            </div>
        </div>
    );
};

export default AppCard;
