import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import AppsPage from './pages/AppsPage';
import AppDetailPage from './pages/AppDetailPage';
import Modal from './components/Modal';
import ImpressumContent from './pages/ImpressumContent';
import DatenschutzContent from './pages/DatenschutzContent';
import CookieBanner from './components/CookieBanner';
import Footer from './components/Footer';
import AdminLoginModal from './components/AdminLoginModal';
import ProjectFormModal from './components/ProjectFormModal';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';
import AdminPublishBar from './components/AdminPublishBar';
import { initialProjects, fetchProjects, invalidateProjectsCache, Project } from './data/projects';
import { isAdminLoggedIn, commitProjectsToGitHub } from './services/githubAdminService';

const DRAFT_STORAGE_KEY = 'by_dp_admin_draft_projects';

type ModalType = 'impressum' | 'datenschutz' | 'adminLogin' | 'projectForm' | 'confirmDelete' | null;
export type PageType = 'home' | 'apps';

interface RouteState {
    page: PageType;
    selectedAppId: string | null;
}

const parseHash = (): RouteState => {
    const hash = window.location.hash;
    if (hash.startsWith('#app/')) {
        const appId = hash.replace('#app/', '').split('?')[0];
        return { page: 'apps', selectedAppId: appId };
    }
    if (hash.startsWith('#apps')) {
        return { page: 'apps', selectedAppId: null };
    }
    return { page: 'home', selectedAppId: null };
};

const App: React.FC = () => {
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [route, setRoute] = useState<RouteState>(parseHash());
    const [projectList, setProjectList] = useState<Project[]>(initialProjects);
    const [originalProjects, setOriginalProjects] = useState<Project[]>(initialProjects);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isAdmin, setIsAdmin] = useState<boolean>(isAdminLoggedIn());
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [deletingProject, setDeletingProject] = useState<Project | null>(null);
    const [isPublishing, setIsPublishing] = useState<boolean>(false);
    const [publishError, setPublishError] = useState<string | null>(null);
    const [publishSuccess, setPublishSuccess] = useState<boolean>(false);
    const savedScrollPos = React.useRef<number>(0);

    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);
        fetchProjects().then(data => {
            if (isMounted) {
                setOriginalProjects(data);
                // Entwurf aus dem localStorage wiederherstellen, falls vorhanden
                const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
                if (savedDraft && isAdminLoggedIn()) {
                    try {
                        const parsed = JSON.parse(savedDraft);
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            setProjectList(parsed);
                            setIsLoading(false);
                            return;
                        }
                    } catch (e) {
                        console.warn('Fehler beim Laden des Admin-Entwurfs:', e);
                    }
                }
                setProjectList(data);
                setIsLoading(false);
            }
        }).catch(() => {
            if (isMounted) setIsLoading(false);
        });
        return () => { isMounted = false; };
    }, []);

    useEffect(() => {
        const handleHashChange = () => {
            const newRoute = parseHash();
            
            // Wenn man vom App Hub auf eine Detailseite klickt, Scroll-Position merken
            if (!route.selectedAppId && newRoute.selectedAppId) {
                savedScrollPos.current = window.scrollY;
            }

            setRoute(newRoute);

            // Wenn man von der Detailseite ZURÜCK zum Hub geht, gemerkte Scroll-Position wiederherstellen
            if (route.selectedAppId && !newRoute.selectedAppId) {
                setTimeout(() => {
                    window.scrollTo({ top: savedScrollPos.current, behavior: 'instant' });
                }, 0);
            } else if (!route.selectedAppId && newRoute.selectedAppId) {
                // Bei Öffnen einer Detailseite nach oben scrollen
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else if (newRoute.page === 'home') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        };

        window.addEventListener('hashchange', handleHashChange);
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, [route.selectedAppId]);

    const openModal = (modal: ModalType) => setActiveModal(modal);
    const closeModal = () => {
        setActiveModal(null);
        setEditingProject(null);
        setDeletingProject(null);
    };
    
    const navigateTo = (targetPage: PageType) => {
        if (targetPage === 'home') {
            window.location.hash = '';
        } else {
            window.location.hash = '#apps';
        }
    };

    // Berechne Anzahl der ungespeicherten Entwurfs-Änderungen
    const pendingCount = React.useMemo(() => {
        if (!isAdmin) return 0;
        let count = 0;
        projectList.forEach(p => {
            const orig = originalProjects.find(o => o.id === p.id);
            if (!orig || JSON.stringify(orig) !== JSON.stringify(p)) {
                count++;
            }
        });
        originalProjects.forEach(o => {
            if (!projectList.some(p => p.id === o.id)) {
                count++;
            }
        });
        return count;
    }, [projectList, originalProjects, isAdmin]);

    // Vor unbeabsichtigtem Schließen/Neuladen des Tabs warnen
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (pendingCount > 0 && isAdmin) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [pendingCount, isAdmin]);

    // Admin Handlers (Sofortige lokale Speicherung ohne Netzwerkblockade)
    const handleSaveProject = (projectToSave: Project) => {
        let updatedList: Project[] = [];
        
        // Wenn isFeatured aktiv ist, bei allen anderen deaktivieren
        if (projectToSave.isFeatured) {
            projectList.forEach(p => { p.isFeatured = false; });
        }

        const existingIdx = projectList.findIndex(p => p.id === projectToSave.id);
        if (existingIdx >= 0) {
            updatedList = [...projectList];
            updatedList[existingIdx] = projectToSave;
        } else {
            updatedList = [projectToSave, ...projectList];
        }

        setProjectList(updatedList);
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(updatedList));
        setPublishError(null);
        setPublishSuccess(false);
    };

    const handleDeleteProject = () => {
        if (!deletingProject) return;
        const updatedList = projectList.filter(p => p.id !== deletingProject.id);
        setProjectList(updatedList);
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(updatedList));
        setPublishError(null);
        setPublishSuccess(false);
        if (route.selectedAppId === deletingProject.id) {
            window.location.hash = '#apps';
        }
    };

    const handlePublishToGitHub = async () => {
        setIsPublishing(true);
        setPublishError(null);
        try {
            const changedNames: string[] = [];
            projectList.forEach(p => {
                const orig = originalProjects.find(o => o.id === p.id);
                if (!orig) {
                    changedNames.push(`Neu: ${p.title}`);
                } else if (JSON.stringify(orig) !== JSON.stringify(p)) {
                    changedNames.push(`Update: ${p.title}`);
                }
            });
            originalProjects.forEach(o => {
                if (!projectList.some(p => p.id === o.id)) {
                    changedNames.push(`Entfernt: ${o.title}`);
                }
            });

            const summary = changedNames.slice(0, 3).join(', ') + (changedNames.length > 3 ? ` (+${changedNames.length - 3})` : '');
            const commitMessage = `Web Admin: ${summary || `${pendingCount} Änderungen`}`;
            
            await commitProjectsToGitHub(projectList, commitMessage);
            setOriginalProjects(projectList);
            localStorage.removeItem(DRAFT_STORAGE_KEY);
            invalidateProjectsCache();
            setPublishSuccess(true);
            setTimeout(() => setPublishSuccess(false), 5000);
        } catch (err: any) {
            setPublishError(err.message || 'Veröffentlichung auf GitHub fehlgeschlagen.');
        } finally {
            setIsPublishing(false);
        }
    };

    const handleDiscardChanges = () => {
        if (window.confirm('Möchtest du wirklich alle ungespeicherten Entwurfs-Änderungen verwerfen? Alle Apps werden auf den Stand von GitHub zurückgesetzt.')) {
            setProjectList(originalProjects);
            localStorage.removeItem(DRAFT_STORAGE_KEY);
            setPublishError(null);
            setPublishSuccess(false);
        }
    };

    const handleReloadProjects = async () => {
        if (pendingCount > 0) {
            const confirmed = window.confirm('Du hast noch ungespeicherte Entwürfe. Wenn du die Daten von GitHub neu lädst, gehen diese verloren. Fortfahren?');
            if (!confirmed) return;
        }
        invalidateProjectsCache();
        const data = await fetchProjects(true);
        setOriginalProjects(data);
        setProjectList(data);
        localStorage.removeItem(DRAFT_STORAGE_KEY);
        setPublishError(null);
    };

    const selectedApp: Project | undefined = route.selectedAppId 
        ? projectList.find(p => p.id === route.selectedAppId)
        : undefined;

    return (
        <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen flex flex-col font-sans transition-colors duration-300">
            <Header
                onNavigate={navigateTo}
                activePage={route.page}
            />

            {isAdmin && (
                <AdminPublishBar
                    pendingCount={pendingCount}
                    isPublishing={isPublishing}
                    publishError={publishError}
                    publishSuccess={publishSuccess}
                    onPublish={handlePublishToGitHub}
                    onDiscard={handleDiscardChanges}
                />
            )}

            <main className="flex-grow">
                {route.page === 'home' && <HomePage />}
                {route.page === 'apps' && !selectedApp && (
                    <AppsPage 
                        projects={projectList}
                        isLoading={isLoading}
                        isAdmin={isAdmin}
                        onAddNewApp={() => {
                            setEditingProject(null);
                            openModal('projectForm');
                        }}
                        onReloadProjects={handleReloadProjects}
                        onSelectApp={(app) => {
                            window.location.hash = `#app/${app.id}`;
                        }}
                    />
                )}
                {route.page === 'apps' && selectedApp && (
                    <AppDetailPage 
                        app={selectedApp} 
                        isAdmin={isAdmin}
                        onEditApp={(app) => {
                            setEditingProject(app);
                            openModal('projectForm');
                        }}
                        onDeleteApp={(app) => {
                            setDeletingProject(app);
                            openModal('confirmDelete');
                        }}
                        onBack={() => {
                            window.location.hash = '#apps';
                        }}
                    />
                )}
            </main>

            <Footer 
                onImpressumClick={() => openModal('impressum')}
                onDatenschutzClick={() => openModal('datenschutz')}
                onAdminClick={() => openModal('adminLogin')}
                isAdmin={isAdmin}
            />
            
            {/* Modals */}
            <Modal isOpen={activeModal === 'impressum'} onClose={closeModal} title="Impressum">
                <ImpressumContent />
            </Modal>
            <Modal isOpen={activeModal === 'datenschutz'} onClose={closeModal} title="Datenschutzerklärung">
                <DatenschutzContent />
            </Modal>
            <AdminLoginModal
                isOpen={activeModal === 'adminLogin'}
                onClose={closeModal}
                onLoginSuccess={() => setIsAdmin(true)}
                onLogout={() => setIsAdmin(false)}
            />
            <ProjectFormModal
                isOpen={activeModal === 'projectForm'}
                onClose={closeModal}
                onSave={handleSaveProject}
                projectToEdit={editingProject}
            />
            <ConfirmDeleteModal
                isOpen={activeModal === 'confirmDelete'}
                onClose={closeModal}
                onConfirm={handleDeleteProject}
                appTitle={deletingProject?.title || ''}
            />
            <CookieBanner onDatenschutzClick={() => openModal('datenschutz')} />
        </div>
    );
};

export default App;