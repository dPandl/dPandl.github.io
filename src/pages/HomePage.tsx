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
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-8">
                        Projekte, Apps & <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
                            Digitale Welten
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Willkommen auf meiner persönlichen Plattform. Hier erstelle und teile ich nützliche Web-Apps, Community-Server & Modpacks sowie Gedanken in meinem Blog.
                    </p>
                    <div className="flex justify-center animate-reveal delay-300">
                        <a 
                            href="#apps" 
                            className="px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-2xl shadow-lg shadow-cyan-500/30 transition-all hover:scale-105 flex items-center justify-center gap-2"
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
                        {recentlyUpdatedProjects.map((project) => (
                            <AppCard
                                key={project.id}
                                app={project}
                                onClick={() => handleSelectApp(project.id)}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-3xl p-10 border border-gray-100 dark:border-gray-700 shadow-xl">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                            Über by-dp<span className="text-cyan-500 dark:text-cyan-400">.de</span>
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-gray-600 dark:text-gray-400">
                            <div>
                                <h3 className="text-gray-900 dark:text-white font-bold mb-2">Web Apps & Tools</h3>
                                <p>Nützliche, datenschutzfreundliche Web-Apps, die ohne Account und komplett lokal im Browser funktionieren.</p>
                            </div>
                            <div>
                                <h3 className="text-gray-900 dark:text-white font-bold mb-2">Community & Gaming</h3>
                                <p>Informationen, Modpacks und Tools für Games-Server für Freundeskreise und Gruppen.</p>
                            </div>
                            <div>
                                <h3 className="text-gray-900 dark:text-white font-bold mb-2">Blog & Artikel</h3>
                                <p>Erfahrungsberichte, Entwicklungsfortschritte und Tutorials rund um Softwareentwicklung.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;