import React from 'react';

interface FooterProps {
    onImpressumClick: () => void;
    onDatenschutzClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onImpressumClick, onDatenschutzClick }) => {
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
                </div>
            </div>
        </footer>
    );
};

export default Footer;