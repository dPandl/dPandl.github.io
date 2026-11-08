import React, { useState, useEffect, useMemo } from 'react';
import AppCard from '../components/AppCard';
import { fetchProjects, Project } from '../data/projects';

interface AppsPageProps {
    projects?: Project[];
    isLoading?: boolean;
    onSelectApp?: (app: Project) => void;
    isAdmin?: boolean;
    onAddNewApp?: () => void;
    onReloadProjects?: () => Promise<void> | void;
}

const AppsPage: React.FC<AppsPageProps> = ({ 
    projects: propProjects, 
    isLoading: propIsLoading, 
    onSelectApp, 
    isAdmin, 
    onAddNewApp, 
    onReloadProjects 
}) => {
    const [projectList, setProjectList] = useState<Project[]>(propProjects || []);
    const [isLoading, setIsLoading] = useState<boolean>(propIsLoading ?? (propProjects ? propProjects.length === 0 : true));
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string>('Alle');
    const [isReloading, setIsReloading] = useState(false);

    // Sync state whenever parent passes new projects
    useEffect(() => {
        if (propProjects && propProjects.length > 0) {
            setProjectList(propProjects);
            setIsLoading(false);
        }
    }, [propProjects]);

    useEffect(() => {
        if (propIsLoading !== undefined) {
            setIsLoading(propIsLoading);
        }
    }, [propIsLoading]);

    // Fallback self-fetch if opened in isolation without props
    useEffect(() => {
        if (!propProjects || propProjects.length === 0) {
            let isMounted = true;
            setIsLoading(true);
            fetchProjects().then(data => {
                if (isMounted) {
                    setProjectList(data);
                    setIsLoading(false);
                }
            }).catch(() => {
                if (isMounted) setIsLoading(false);
            });
            return () => { isMounted = false; };
        }
    }, [propProjects]);

    const handleReload = async () => {
        setIsReloading(true);
        if (onReloadProjects) {
            await onReloadProjects();
        }
        const data = await fetchProjects(true);
        setProjectList(data);
        setIsReloading(false);
    };

    const handleExportAllJson = () => {
        const jsonStr = JSON.stringify(projectList, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `projects-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

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
                                 (project.longDescription && project.longDescription.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                 (project.tagline && project.tagline.toLowerCase().includes(searchQuery.toLowerCase()));
            const matchesCategory = activeCategory === 'Alle' || project.category === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, activeCategory, projectList]);

    const featuredApp = projectList.find(p => p.isFeatured) || projectList[0];

    const handleAppClick = (project: Project) => {
        if (onSelectApp) {
            onSelectApp(project);
        } else {
            window.location.hash = `#app/${project.id}`;
        }
    };

    const searchInputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Focus search on "/" keypress when not typing in an input
            if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Category counts for pill badges
    const categoryCounts = useMemo(() => {
        const counts: Record<string, number> = { 'Alle': projectList.length };
        projectList.forEach(p => {
            if (p.category) {
                counts[p.category] = (counts[p.category] || 0) + 1;
            }
        });
        return counts;
    }, [projectList]);

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
            {!isLoading && featuredApp && activeCategory === 'Alle' && !searchQuery && (
                <div className="max-w-6xl mx-auto mb-16">
                    <div 
                        onClick={() => handleAppClick(featuredApp)}
                        className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-cyan-600 to-blue-700 p-8 sm:p-12 text-white shadow-2xl cursor-pointer group hover:scale-[1.01] transition-transform"
                    >
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
                            <div className="space-y-4 max-w-xl">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider shadow-xs">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-amber-300 fill-current" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    App des Monats
                                </span>
                                <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">{featuredApp.title}</h2>
                                <p className="text-white/90 text-lg leading-relaxed">{featuredApp.tagline}</p>
                                <div className="pt-2 flex items-center gap-4 text-sm font-semibold">
                                    <span className="px-6 py-3 bg-white text-gray-900 rounded-2xl shadow-xl group-hover:bg-gray-100 transition-colors flex items-center gap-2 font-bold">
                                        Details ansehen
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    </span>
                                </div>
                            </div>

                            <div className="w-24 h-24 sm:w-36 sm:h-36 rounded-3xl bg-white/15 backdrop-blur-md border border-white/25 flex items-center justify-center text-4xl sm:text-5xl font-extrabold shadow-2xl shrink-0 overflow-hidden ring-1 ring-white/20">
                                {featuredApp.icon ? (
                                    <img 
                                        src={featuredApp.icon} 
                                        alt={featuredApp.title} 
                                        className="w-full h-full object-cover rounded-3xl" 
                                    />
                                ) : (
                                    featuredApp.title.substring(0, 2).toUpperCase()
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Search and Filter Section */}
            <div className="max-w-4xl mx-auto mb-12 space-y-3">
                {/* Clean, right-aligned admin buttons without the bulky frame */}
                {isAdmin && (
                    <div className="flex justify-end items-center gap-2">
                        <button
                            onClick={handleReload}
                            disabled={isReloading}
                            title="projekte.json neu vom Server / GitHub laden"
                            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 transition-all flex items-center gap-1.5 shadow-xs disabled:opacity-50"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 ${isReloading ? 'animate-spin text-cyan-500' : 'text-gray-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            {isReloading ? 'Lädt...' : 'Neu laden'}
                        </button>

                        <button
                            onClick={handleExportAllJson}
                            title="Alle Apps als projects.json exportieren (für Coding-KI oder Backup)"
                            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 transition-all flex items-center gap-1.5 shadow-xs"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Alle JSON
                        </button>

                        <button
                            onClick={onAddNewApp}
                            className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white shadow-sm shadow-cyan-500/20 transition-all flex items-center gap-1.5"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                            </svg>
                            Neue App
                        </button>
                    </div>
                )}

                {/* Symmetrical, Full-Width Search Input */}
                <div className="relative w-full">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Apps durchsuchen..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-10 py-3.5 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md border border-gray-200 dark:border-gray-700/80 rounded-2xl shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all dark:text-white text-base placeholder-gray-400"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery('')}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-500 dark:text-gray-300 flex items-center justify-center text-sm font-bold transition-colors"
                            title="Suche zurücksetzen"
                        >
                            ✕
                        </button>
                    )}
                </div>

                <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5">
                    {dynamicCategories.map((cat) => {
                        const count = categoryCounts[cat] || 0;
                        const isActive = activeCategory === cat;
                        return (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-4 sm:px-5 py-2 rounded-2xl font-semibold text-sm transition-all duration-200 flex items-center gap-2 ${
                                    isActive
                                        ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/25 ring-2 ring-cyan-500/50'
                                        : 'bg-white/80 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750'
                                }`}
                            >
                                <span>{cat}</span>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                                    isActive 
                                        ? 'bg-white/20 text-white' 
                                        : 'bg-gray-100 dark:bg-gray-700/80 text-gray-500 dark:text-gray-400'
                                }`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Grid Section */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
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
                    ))}
                </div>
            ) : filteredProjects.length > 0 ? (
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
                <div className="text-center py-16 px-4">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Keine Apps gefunden</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
                        {searchQuery ? `Für "${searchQuery}" gibt es leider keine Treffer.` : 'In dieser Kategorie sind derzeit keine Apps vorhanden.'}
                    </p>
                    <button
                        onClick={() => {
                            setSearchQuery('');
                            setActiveCategory('Alle');
                        }}
                        className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-semibold text-sm shadow-sm transition-all"
                    >
                        Filter &amp; Suche zurücksetzen
                    </button>
                </div>
            )}
        </div>
    );
};

export default AppsPage;

