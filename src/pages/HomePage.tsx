import React from 'react';
import Card3D from '../components/Card3D';
import { projects } from '../data/projects';

const HomePage: React.FC = () => {
    // Pick 3 featured apps
    const featuredProjects = projects.filter(p => 
        ['Kitalytics', 'Party Games', 'Ausbildungsplaner'].includes(p.title)
    );

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative py-24 sm:py-32 overflow-hidden">
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-8">
                        Digitale Lösungen für <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600">
                            Alltag & Beruf
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                        Entdecke innovative Web-Apps, die komplexe Aufgaben vereinfachen. 
                        Von der Kindergarten-Organisation bis hin zu interaktiven Party-Spielen.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 animate-reveal delay-300">
                        <a 
                            href="#apps" 
                            className="px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-2xl shadow-lg shadow-cyan-500/30 transition-all hover:scale-105"
                        >
                            Alle Apps entdecken
                        </a>
                        <a 
                            href="#apps?filter=Kindergarten" 
                            className="px-8 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                        >
                            Für Kindergärten
                        </a>
                    </div>
                </div>
            </section>

            {/* Featured Section */}
            <section className="py-20 bg-white/30 dark:bg-black/10 backdrop-blur-3xl">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Highlights</h2>
                            <p className="text-gray-600 dark:text-gray-400">Ein kleiner Einblick in meine populärsten Projekte.</p>
                        </div>
                        <a href="#apps" className="text-cyan-500 font-semibold hover:underline flex items-center gap-2">
                            Alle Projekte ansehen
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {featuredProjects.map((project) => (
                            <Card3D
                                key={project.title}
                                title={project.title}
                                description={project.description}
                                href={project.href}
                                glowColor={project.glowColor}
                                status={project.status}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* About Section */}
            <section className="py-24">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-3xl p-10 border border-gray-100 dark:border-gray-700 shadow-xl">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                            Warum by-dp<span className="text-cyan-500 dark:text-cyan-400">.de</span>?
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 text-gray-600 dark:text-gray-400">
                            <div>
                                <h3 className="text-gray-900 dark:text-white font-bold mb-2">Lokale Unabhängigkeit</h3>
                                <p>Meine Apps laufen vollständig auf deinem Gerät. Das ermöglicht volle Kontrolle und Unabhängigkeit von externen Servern – ideal für Team-Lösungen ohne Cloud-Zwang.</p>
                            </div>
                            <div>
                                <h3 className="text-gray-900 dark:text-white font-bold mb-2">Datenschutz durch Design</h3>
                                <p>Keine Kontenerstellung, keine Datenbanken im Netz. Da alles lokal verarbeitet wird, bleiben deine Daten genau dort, wo sie hingehören: auf deinem eigenen System.</p>
                            </div>
                            <div>
                                <h3 className="text-gray-900 dark:text-white font-bold mb-2">Digitale Werkzeuge</h3>
                                <p>Ich entwickle Web-Apps, die komplexe Abläufe digitalisieren, ohne dass du eine teure IT-Infrastruktur oder Abos benötigst.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;