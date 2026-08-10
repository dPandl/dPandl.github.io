import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Project } from '../data/projects';
import { useDeviceType } from '../hooks/useDeviceType';
import { getHexGradient } from '../utils/colorUtils';

interface AppDetailPageProps {
    app: Project;
    onBack: () => void;
}

const AppDetailPage: React.FC<AppDetailPageProps> = ({ app, onBack }) => {
    const { isMobile } = useDeviceType();
    const [selectedScreenshotIndex, setSelectedScreenshotIndex] = useState<number | null>(null);

    const screenshots = app.screenshots || [];

    const handlePrevScreenshot = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (selectedScreenshotIndex !== null && screenshots.length > 0) {
            setSelectedScreenshotIndex((selectedScreenshotIndex - 1 + screenshots.length) % screenshots.length);
        }
    };

    const handleNextScreenshot = (e?: React.MouseEvent) => {
        if (e) e.stopPropagation();
        if (selectedScreenshotIndex !== null && screenshots.length > 0) {
            setSelectedScreenshotIndex((selectedScreenshotIndex + 1) % screenshots.length);
        }
    };

    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedScreenshotIndex === null) return;
            if (e.key === 'ArrowRight') {
                handleNextScreenshot();
            } else if (e.key === 'ArrowLeft') {
                handlePrevScreenshot();
            } else if (e.key === 'Escape') {
                setSelectedScreenshotIndex(null);
            }
        };

        if (selectedScreenshotIndex !== null) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedScreenshotIndex, screenshots.length]);

    const appHex = app.color || '#06b6d4';
    const backgroundGradient = getHexGradient(appHex, 0.25);

    return (
        <div className="container mx-auto px-4 py-8 sm:py-12 max-w-5xl animate-reveal">
            {/* Back Button */}
            <button
                onClick={onBack}
                className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all font-medium text-sm shadow-sm"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Zurück zum App Hub
            </button>

            {/* Main Header / Card */}
            <div className="bg-white dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700/80 rounded-3xl p-6 sm:p-10 shadow-xl mb-10">
                <div className="flex flex-col md:flex-row gap-6 sm:gap-8 items-start md:items-center">
                    {/* App Icon */}
                    <div 
                        style={{ background: backgroundGradient }}
                        className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl flex items-center justify-center text-white text-4xl sm:text-5xl font-extrabold shadow-lg shrink-0 overflow-hidden"
                    >
                        {app.icon ? (
                            <img src={app.icon} alt={app.title} className="w-full h-full object-cover rounded-3xl" />
                        ) : (
                            app.title.substring(0, 2).toUpperCase()
                        )}
                    </div>

                    {/* App Header Info */}
                    <div className="flex-grow space-y-3">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                                {app.category}
                            </span>
                            {app.status && (
                                <span className="px-3 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                                    {app.status}
                                </span>
                            )}
                        </div>

                        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            {app.title}
                        </h1>

                        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 font-medium">
                            {app.tagline || app.description}
                        </p>

                        <p className="text-xs text-gray-400 dark:text-gray-500">
                            Entwickelt von <span className="font-semibold text-gray-700 dark:text-gray-300">{app.developer || 'by-dp'}</span>
                        </p>
                    </div>

                    {/* Action Buttons ("Öffnen", "Herunterladen") & Compatibility Badge */}
                    <div className="flex flex-col gap-3 w-full md:w-auto shrink-0 pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 dark:border-gray-700 items-stretch md:items-end">
                        {app.openUrl && (
                            <a
                                href={app.openUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-8 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-cyan-500/25 transition-all text-center flex items-center justify-center gap-2 hover:scale-[1.02]"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                App Öffnen
                            </a>
                        )}

                        {app.downloadUrl && (
                            <a
                                href={app.downloadUrl}
                                download={app.downloadFilename || true}
                                className="px-8 py-3.5 bg-gray-900 hover:bg-black dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-bold rounded-2xl shadow-md transition-all text-center flex items-center justify-center gap-2 hover:scale-[1.02]"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Herunterladen
                            </a>
                        )}

                        {!app.openUrl && !app.downloadUrl && (
                            <span className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-2xl text-sm font-semibold text-center">
                                Bald verfügbar
                            </span>
                        )}

                        {/* Device Compatibility Status Badge directly under Action Buttons */}
                        {(() => {
                            const platform = app.supportedPlatforms || (app.mobileCompatible ? 'both' : 'desktop');
                            const isSupportedOnCurrentDevice = 
                                platform === 'both' || 
                                (platform === 'mobile' && isMobile) || 
                                (platform === 'desktop' && !isMobile);

                            // Desktop Symbol SVG
                            const DesktopIcon = (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            );

                            // Smartphone/Phone Symbol SVG
                            const PhoneIcon = (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            );

                            const currentDeviceIcon = isMobile ? PhoneIcon : DesktopIcon;

                            if (isSupportedOnCurrentDevice) {
                                return (
                                    <div className="mt-1 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold flex items-center justify-center gap-2 shadow-sm">
                                        {currentDeviceIcon}
                                        <span>Unterstützt</span>
                                    </div>
                                );
                            } else {
                                return (
                                    <div className="mt-1 px-4 py-2 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-bold flex items-center justify-center gap-2 shadow-sm">
                                        {currentDeviceIcon}
                                        <span>Nicht unterstützt</span>
                                    </div>
                                );
                            }
                        })()}
                    </div>
                </div>

                {/* Metadata Stats Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-gray-100 dark:border-gray-700/60 text-center">
                    <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-900/40">
                        <span className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">Version</span>
                        <span className="text-base font-bold text-gray-900 dark:text-white">{app.version}</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-900/40">
                        <span className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">Kategorie</span>
                        <span className="text-base font-bold text-gray-900 dark:text-white">{app.category}</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-900/40">
                        <span className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">Veröffentlichung</span>
                        <span className="text-base font-bold text-gray-900 dark:text-white">{app.releaseDate}</span>
                    </div>
                    <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-900/40">
                        <span className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">Letztes Update</span>
                        <span className="text-base font-bold text-gray-900 dark:text-white">{app.updatedDate}</span>
                    </div>
                </div>
            </div>

            {/* Screenshots Grid Gallery */}
            {screenshots.length > 0 && (
                <div className="mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Vorschau & Screenshots</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {screenshots.map((src, idx) => (
                            <div
                                key={idx}
                                onClick={() => setSelectedScreenshotIndex(idx)}
                                className="group relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md cursor-pointer bg-gray-100 dark:bg-gray-800 transition-all hover:scale-[1.02]"
                            >
                                <img
                                    src={src}
                                    alt={`${app.title} Screenshot ${idx + 1}`}
                                    className="w-full h-48 object-cover object-top transition-transform duration-300 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-semibold text-sm gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                                    </svg>
                                    Vergrößern
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* App Description & Features Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Long Description */}
                <div className="lg:col-span-2 bg-white dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700/80 rounded-3xl p-8 shadow-md">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Über diese App</h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line text-base">
                        {app.longDescription || app.description}
                    </p>
                </div>

                {/* Features Highlights */}
                {app.features && app.features.length > 0 && (
                    <div className="bg-white dark:bg-gray-800/80 backdrop-blur-xl border border-gray-200 dark:border-gray-700/80 rounded-3xl p-8 shadow-md">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Highlights</h2>
                        <ul className="space-y-3">
                            {app.features.map((feat, idx) => (
                                <li key={idx} className="flex items-start gap-3 text-gray-700 dark:text-gray-300 text-sm">
                                    <span className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-500 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                                        ✓
                                    </span>
                                    <span>{feat}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Fullscreen Lightbox for Screenshot Preview with Navigation */}
            {selectedScreenshotIndex !== null && screenshots[selectedScreenshotIndex] && ReactDOM.createPortal(
                <div
                    className="fixed inset-0 z-[99999] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-4 animate-reveal"
                    onClick={() => setSelectedScreenshotIndex(null)}
                >
                    {/* Top Bar: Counter & Close Button */}
                    <div className="fixed top-6 left-6 right-6 z-[100001] flex justify-between items-center pointer-events-none">
                        <span className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                            Screenshot {selectedScreenshotIndex + 1} von {screenshots.length}
                        </span>
                        <button
                            onClick={() => setSelectedScreenshotIndex(null)}
                            className="pointer-events-auto px-5 py-2.5 rounded-full bg-white/20 hover:bg-white/30 text-white text-sm font-bold border border-white/30 backdrop-blur-md shadow-2xl transition-all hover:scale-105 flex items-center gap-2 cursor-pointer"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Schließen
                        </button>
                    </div>

                    {/* Previous Button (Left Arrow) */}
                    {screenshots.length > 1 && (
                        <button
                            onClick={handlePrevScreenshot}
                            className="fixed left-4 sm:left-8 top-1/2 -translate-y-1/2 z-[100001] p-4 rounded-full bg-white/10 hover:bg-white/25 text-white border border-white/20 backdrop-blur-md shadow-2xl transition-all hover:scale-110 cursor-pointer"
                            aria-label="Vorheriger Screenshot"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}

                    {/* Next Button (Right Arrow) */}
                    {screenshots.length > 1 && (
                        <button
                            onClick={handleNextScreenshot}
                            className="fixed right-4 sm:right-8 top-1/2 -translate-y-1/2 z-[100001] p-4 rounded-full bg-white/10 hover:bg-white/25 text-white border border-white/20 backdrop-blur-md shadow-2xl transition-all hover:scale-110 cursor-pointer"
                            aria-label="Nächster Screenshot"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    )}

                    {/* Fullscreen Image Container */}
                    <div 
                        className="relative w-full h-full flex items-center justify-center p-2 sm:p-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            key={selectedScreenshotIndex}
                            src={screenshots[selectedScreenshotIndex]}
                            alt={`Screenshot ${selectedScreenshotIndex + 1}`}
                            className="max-w-[92vw] max-h-[88vh] object-contain rounded-2xl shadow-2xl animate-reveal"
                        />
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default AppDetailPage;
