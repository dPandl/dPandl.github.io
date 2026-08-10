import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { SunIcon, MoonIcon, HamburgerIcon, XIcon } from './Icons';
import { PageType } from '../App';

interface HeaderProps {
    onNavigate: (page: PageType) => void;
    activePage: PageType;
}

const navItems: { page: PageType; label: string }[] = [
    { page: 'home', label: 'Startseite' },
    { page: 'apps', label: 'App Hub' },
];

const Header: React.FC<HeaderProps> = ({ onNavigate, activePage }) => {
    const { theme, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) { // md breakpoint
                setIsMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);

    const handleNavClick = (page: PageType) => {
        onNavigate(page);
        setIsMenuOpen(false);
    };

    const navButtonBaseClasses = "px-3 py-1.5 rounded-md font-medium transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900";
    const navButtonActiveClasses = "bg-cyan-500 text-white shadow-sm";
    const navButtonInactiveClasses = "text-gray-600 dark:text-gray-300 hover:bg-gray-200/60 dark:hover:bg-gray-700/60";

    const mobileNavButtonBaseClasses = "w-full text-left p-3 rounded-lg text-lg font-medium transition-colors duration-200";
    const mobileNavButtonActiveClasses = "bg-cyan-500 text-white";
    const mobileNavButtonInactiveClasses = "text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800";


    return (
        <>
            <header className="py-4 px-4 sm:px-6 lg:px-8 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-40 border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
                <div className="container mx-auto flex justify-between items-center">
                    <button 
                        onClick={() => handleNavClick('home')} 
                        className="focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-lg -m-2 p-2"
                        aria-label="Zurück zur Startseite"
                    >
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                            by-dp<span className="text-cyan-500 dark:text-cyan-400">.de</span>
                        </h1>
                    </button>
                    
                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-2 sm:space-x-4 text-sm sm:text-base">
                        {navItems.map(item => (
                             <button 
                                key={item.page}
                                onClick={() => onNavigate(item.page)} 
                                className={`${navButtonBaseClasses} ${activePage === item.page ? navButtonActiveClasses : navButtonInactiveClasses}`}
                            >
                                {item.label}
                            </button>
                        ))}
                        <div className="h-4 w-px bg-gray-200 dark:bg-gray-700" aria-hidden="true"></div>
                        <button
                            onClick={toggleTheme}
                            className="text-gray-600 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-full transition-colors duration-300 p-2"
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
                        </button>
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="text-gray-600 dark:text-gray-300 hover:text-cyan-500 dark:hover:text-cyan-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-md transition-colors duration-300 p-2 -mr-2"
                            aria-label="Menü öffnen"
                            aria-expanded={isMenuOpen}
                            aria-controls="mobile-menu"
                        >
                            <HamburgerIcon className="h-6 w-6" />
                        </button>
                    </div>
                </div>
            </header>
            
            {/* Mobile Menu Panel */}
            <div
                id="mobile-menu"
                role="dialog"
                aria-modal="true"
                aria-hidden={!isMenuOpen}
                aria-labelledby="mobile-menu-title"
                className={`fixed inset-0 z-50 md:hidden ${!isMenuOpen ? 'pointer-events-none' : ''}`}
            >
                {/* Backdrop */}
                <div 
                    className={`fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`} 
                    onClick={() => setIsMenuOpen(false)}
                    aria-hidden="true"
                ></div>
                
                {/* Panel */}
                <div className={`fixed top-0 right-0 bottom-0 w-full max-w-xs bg-white dark:bg-gray-900 p-6 flex flex-col transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`} onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-8">
                        <h2 id="mobile-menu-title" className="text-xl font-bold text-gray-900 dark:text-white">Menü</h2>
                         <button onClick={() => setIsMenuOpen(false)} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors p-1 -mr-1 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500" aria-label="Menü schließen">
                            <XIcon className="h-6 w-6" />
                         </button>
                    </div>

                    <nav className="flex flex-col space-y-2">
                         {navItems.map(item => (
                            <button 
                                key={item.page}
                                onClick={() => handleNavClick(item.page)}
                                className={`${mobileNavButtonBaseClasses} ${activePage === item.page ? mobileNavButtonActiveClasses : mobileNavButtonInactiveClasses}`}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    <div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
                         <div className="flex justify-between items-center">
                             <span className="text-gray-600 dark:text-gray-300 text-sm font-medium">Farbschema</span>
                             <button onClick={toggleTheme} className="relative inline-flex items-center h-6 rounded-full w-11 transition-colors bg-gray-200 dark:bg-gray-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900">
                                 <span className="sr-only">Farbschema wechseln</span>
                                 <span className={`inline-flex items-center justify-center w-4 h-4 transform transition-transform rounded-full bg-white dark:bg-gray-50 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`}>
                                    {theme === 'dark' 
                                        ? <SunIcon className="h-3 w-3 text-yellow-400" /> 
                                        : <MoonIcon className="h-3 w-3 text-slate-500" />
                                    }
                                 </span>
                             </button>
                         </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;