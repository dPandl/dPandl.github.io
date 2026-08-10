import React from 'react';

interface FooterProps {
    onImpressumClick: () => void;
    onDatenschutzClick: () => void;
    onAdminClick: () => void;
    isAdmin: boolean;
}

const Footer: React.FC<FooterProps> = ({ onImpressumClick, onDatenschutzClick, onAdminClick, isAdmin }) => {
    const currentYear = new Date().getFullYear();
    const linkClasses = "hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors duration-300";

    return (
        <footer className="sticky bottom-0 z-30 py-4 px-4 sm:px-6 lg:px-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center text-gray-500 dark:text-gray-400 text-sm gap-2">
                <p>&copy; {currentYear} Pascal Pander. Alle Rechte vorbehalten.</p>
                <div className="flex items-center space-x-6">
                    <button onClick={onImpressumClick} className={linkClasses}>
                        Impressum
                    </button>
                    <button onClick={onDatenschutzClick} className={linkClasses}>
                        Datenschutz
                    </button>
                    <button 
                        onClick={onAdminClick} 
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                            isAdmin 
                                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20' 
                                : linkClasses
                        }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
                        </svg>
                        {isAdmin ? 'Admin-Modus Aktiv' : 'Admin Login'}
                    </button>
                </div>
            </div>
        </footer>
    );
};

export default Footer;