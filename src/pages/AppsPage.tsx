import React, { useState, useEffect, useMemo } from 'react';
import AppCard from '../components/AppCard';
import { projects as fallbackProjects, fetchProjects, Project } from '../data/projects';

interface AppsPageProps {
    onSelectApp?: (app: Project) => void;
    isAdmin?: boolean;
    onAddNewApp?: () => void;
}

const AppsPage: React.FC<AppsPageProps> = ({ onSelectApp, isAdmin, onAddNewApp }) => {
    const [projectList, setProjectList] = useState<Project[]>(fallbackProjects);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string>('Alle');

    useEffect(() => {
        let isMounted = true;
        fetchProjects().then(data => {
            if (isMounted) setProjectList(data);
        });
        return () => { isMounted = false; };
    }, []);

    // Automatically extract all unique categories present in the projects list
    const dynamicCategories = useMemo(() => {
        const set = new Set<string>();
        projectList.forEach(p => {
            if (p.category) set.add(p.category);
        });
        return ['Alle', ...Array.from(set)];
    }, [projectList]);

    useEffect(() => {
        const hash = window.location.hash;
        if (hash.includes('filter=')) {
            const filterName = hash.split('filter=')[1];
            const foundCategory = dynamicCategories.find(c => c.toLowerCase() === filterName.toLowerCase());
            if (foundCategory) {
                setActiveCategory(foundCategory);
            }
        }
    }, [dynamicCategories]);

    const filteredProjects = useMemo(() => {
        return projectList.filter(project => {
            const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 project.tagline.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = activeCategory === 'Alle' || project.category === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, activeCategory, projectList]);

    const featuredApp = projectList.find(p => p.isFeatured) || projectList.find(p => p.id === 'ausbildungsplaner') || projectList[0];

    const handleAppClick = (project: Project) => {
        if (onSelectApp) {
            onSelectApp(project);
        } else {
            window.location.hash = `#app/${project.id}`;
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 sm:py-14">
            {/* Header Banner */}
            <div className="text-center mb-12">
                <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 uppercase tracking-widest inline-block mb-4">
                    Web App Hub
                </span>
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-6xl mb-4">
                    Entdecke moderne Web Apps
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Kostenlos, ohne Registrierung & 100% lokal nutzbar. Wähle eine App aus, um Screenshots, Details und Links zu sehen.
                </p>
            </div>

            {/* Featured App Spotlight Banner */}
            {activeCategory === 'Alle' && !searchQuery && (
                <div className="max-w-6xl mx-auto mb-16">
                    <div 
                        onClick={() => handleAppClick(featuredApp)}
                        className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-cyan-600 to-blue-700 p-8 sm:p-12 text-white shadow-2xl cursor-pointer group hover:scale-[1.01] transition-transform"
                    >
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                            <div className="space-y-4 max-w-xl">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    App des Monats
                                </span>
                                <h2 className="text-3xl sm:text-4xl font-extrabold">{featuredApp.title}</h2>
                                <p className="text-cyan-100 text-lg">{featuredApp.tagline}</p>
                                <div className="pt-2 flex items-center gap-4 text-sm font-semibold">
                                    <span className="px-5 py-2.5 bg-white text-cyan-900 rounded-2xl shadow-lg group-hover:bg-cyan-50 transition-colors">
                                        Details im App Hub ansehen
                                    </span>
                                </div>
                            </div>

                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-4xl sm:text-5xl font-extrabold shadow-xl shrink-0">
                                {featuredApp.title.substring(0, 2).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Search and Filter Section */}
            <div className="max-w-4xl mx-auto mb-12 space-y-6">
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                    <div className="relative flex-grow w-full">
                        <input
                            type="text"
                            placeholder="Nach Apps, Kategorien oder Funktionen suchen..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-6 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all dark:text-white text-lg placeholder-gray-400"
                        />
                        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {isAdmin && (
                        <button
                            onClick={onAddNewApp}
                            className="w-full sm:w-auto px-6 py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/25 transition-all shrink-0 flex items-center justify-center gap-2 text-base"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                            </svg>
                            Neue App hinzufügen
                        </button>
                    )}
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                    {dynamicCategories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2.5 rounded-2xl font-semibold transition-all duration-300 ${
                                activeCategory === cat
                                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/25 scale-105'
                                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid Section */}
            {filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {filteredProjects.map((project) => (
                        <div key={project.id} className="animate-reveal">
                            <AppCard
                                app={project}
                                onClick={() => handleAppClick(project)}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <div className="text-gray-400 mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <p className="text-xl text-gray-500 dark:text-gray-400">Keine Apps gefunden, die deiner Suche entsprechen.</p>
                </div>
            )}
        </div>
    );
};

export default AppsPage;

