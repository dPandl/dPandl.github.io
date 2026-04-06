import React, { useState, useEffect } from 'react';

const COOKIE_CONSENT_KEY = 'by-dp-cookie-consent';

interface CookieBannerProps {
    onDatenschutzClick: () => void;
}

const CookieBanner: React.FC<CookieBannerProps> = ({ onDatenschutzClick }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
        if (consent !== 'accepted') {
            setIsVisible(true);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
        setIsVisible(false);
    };

    const handleDecline = () => {
        setIsVisible(false);
    };

    if (!isVisible) {
        return null;
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-gray-900/80 backdrop-blur-md p-4 z-50 animate-fade-in-up border-t border-gray-200 dark:border-gray-800 transition-colors duration-300">
            <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
                <p className="text-sm text-gray-700 dark:text-gray-300 text-center sm:text-left">
                    Die Website nutzet den lokalen Speicher Ihres Browsers, um die Benutzerfreundlichkeit zu verbessern. Mit Ihrer Zustimmung speichern sie Ihre Auswahl für dieses Banner und das gewählte Farbschema (Hell/Dunkel). Bei Ablehnung werden keine Daten gespeichert. Mehr erfahren Sie in der{' '}
                    <button onClick={onDatenschutzClick} className="underline hover:text-cyan-500 dark:hover:text-cyan-400 transition-colors duration-150">Datenschutzerklärung</button>.
                </p>
                <div className="flex items-center gap-3 flex-shrink-0">
                    <button 
                        onClick={handleDecline}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white rounded-md transition-colors"
                    >
                        Ablehnen
                    </button>
                    <button 
                        onClick={handleAccept}
                        className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 hover:bg-cyan-700 dark:bg-cyan-500 dark:hover:bg-cyan-600 rounded-md transition-colors"
                    >
                        Akzeptieren
                    </button>
                </div>
            </div>
            <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default CookieBanner;
