import React, { useState, useEffect } from 'react';
import AppCard from '../components/AppCard';
import { Project, fetchProjects } from '../data/projects';

// Helper to parse German date string "DD.MM.YYYY" to timestamp for sorting
function parseGermanDate(dateStr: string): number {
    if (!dateStr) return 0;
    const parts = dateStr.split('.');
    if (parts.length !== 3) return 0;
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day).getTime();
}

const HomePage: React.FC = () => {
    const [recentlyUpdatedProjects, setRecentlyUpdatedProjects] = useState<Project[]>([]);

    useEffect(() => {
        let isMounted = true;
        fetchProjects().then(data => {
            if (!isMounted) return;
            // Sort by updatedDate descending (newest first)
            const sorted = [...data].sort((a, b) => {
                const timeA = parseGermanDate(a.updatedDate || a.releaseDate);
                const timeB = parseGermanDate(b.updatedDate || b.releaseDate);
                return timeB - timeA;
            });
            // Pick top 3
            setRecentlyUpdatedProjects(sorted.slice(0, 3));
        });
        return () => { isMounted = false; };
    }, []);

    const handleSelectApp = (appId: string) => {
        window.location.hash = `#app/${appId}`;
    };

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative py-20 sm:py-28 overflow-hidden">
                {/* Subtle Ambient Radial Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/15 via-blue-500/10 to-indigo-500/15 blur-3xl pointer-events-none rounded-full -z-10" />

                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6">
                        Projekte, Apps &amp; <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600">
                            Digitale Welten
                        </span>
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
                        Entdecke nützliche, datenschutzfreundliche Web-Anwendungen und Werkzeuge – schnell, intuitiv und direkt im Browser nutzbar.
                    </p>
                    <div className="flex justify-center animate-reveal delay-300">
                        <a 
                            href="#apps" 
                            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-cyan-500/30 transition-all hover:scale-105 flex items-center justify-center gap-2"
                        >
                            App Hub entdecken
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </a>
                    </div>
                </div>
            </section>

            {/* Recently Updated Section */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Zuletzt aktualisiert</h2>
                            <p className="text-gray-600 dark:text-gray-400">Die neuesten Updates & Web Apps auf einen Blick.</p>
                        </div>
                        <a href="#apps" className="text-cyan-500 font-semibold hover:underline flex items-center gap-2">
                            Alle Web-Apps ansehen
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {recentlyUpdatedProjects.length === 0 ? (
                            [1, 2, 3].map((i) => (
                                <div key={i} className="bg-white dark:bg-gray-800/90 rounded-3xl p-6 border border-gray-200/80 dark:border-gray-700/80 shadow-lg animate-pulse h-64 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-start justify-between gap-4 mb-4">
                                            <div className="w-16 h-16 rounded-2xl bg-gray-200 dark:bg-gray-700" />
                                            <div className="w-20 h-6 rounded-full bg-gray-200 dark:bg-gray-700" />
                                        </div>
                                        <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded-lg mb-2" />
                                        <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded-lg mb-2" />
                                        <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded-lg" />
                                    </div>
                                    <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-gray-700/50">
                                        <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
                                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                                    </div>
                                </div>
                            ))
                        ) : (
                            recentlyUpdatedProjects.map((project) => (
                                <AppCard
                                    key={project.id}
                                    app={project}
                                    onClick={() => handleSelectApp(project.id)}
                                />
                            ))
                        )}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl p-8 sm:p-12 border border-gray-200/80 dark:border-gray-700/80 shadow-xl">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-lg border border-cyan-500/20">
                                ✦
                            </div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Über by-dp<span className="text-cyan-500 dark:text-cyan-400">.de</span>
                            </h2>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 text-gray-600 dark:text-gray-400">
                            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800">
                                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-2">Web Apps &amp; Tools</h3>
                                <p className="text-sm leading-relaxed">Nützliche, datenschutzfreundliche Web-Apps, die ohne Account und komplett lokal im Browser funktionieren.</p>
                            </div>

                            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                                    </svg>
                                </div>
                                <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-2">Community &amp; Gaming</h3>
                                <p className="text-sm leading-relaxed">Werkzeuge, Modpacks und Tools für Spiele-Server und Community-Gruppen.</p>
                            </div>

                            <div className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                    </svg>
                                </div>
                                <h3 className="text-gray-900 dark:text-white font-bold text-lg mb-2">Eigene Software</h3>
                                <p className="text-sm leading-relaxed">Moderne Softwareentwicklung mit Fokus auf Privatsphäre, Performance und echtem Nutzen im Alltag.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;