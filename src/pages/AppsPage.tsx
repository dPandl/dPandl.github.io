import React, { useState, useMemo } from 'react';
import Card3D from '../components/Card3D';
import { projects, ProjectCategory } from '../data/projects';

const categories: (ProjectCategory | 'Alle')[] = ['Alle', 'Kindergarten', 'Games', 'Alltagshelfer', 'Tools'];

const AppsPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<(ProjectCategory | 'Alle')>('Alle');

    React.useEffect(() => {
        const hash = window.location.hash;
        if (hash.includes('filter=')) {
            const filterName = hash.split('filter=')[1];
            const foundCategory = categories.find(c => c.toLowerCase() === filterName.toLowerCase());
            if (foundCategory) {
                setActiveCategory(foundCategory);
            }
        }
    }, []);

    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                 project.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = activeCategory === 'Alle' || project.category === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, activeCategory]);

    return (
        <div className="container mx-auto px-4 py-12 sm:py-20">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-4">
                    Apps & Projekte
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Entdecke meine Sammlung von digitalen Lösungen. Nutze die Suche oder Filter, um das passende Projekt zu finden.
                </p>
            </div>

            {/* Search and Filter Section */}
            <div className="max-w-4xl mx-auto mb-16 space-y-8">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Nach Apps suchen..."
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

                <div className="flex flex-wrap justify-center gap-3">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                                activeCategory === cat
                                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30 scale-105'
                                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-cyan-500/50 hover:text-cyan-500'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid Section */}
            {filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto">
                    {filteredProjects.map((project) => (
                        <div key={project.title} className="animate-reveal">
                            <Card3D
                                title={project.title}
                                description={project.description}
                                href={project.href}
                                glowColor={project.glowColor}
                                status={project.status}
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
                    <p className="text-xl text-gray-500 dark:text-gray-400">Keine Projekte gefunden, die deiner Suche entsprechen.</p>
                </div>
            )}
        </div>
    );
};

export default AppsPage;
