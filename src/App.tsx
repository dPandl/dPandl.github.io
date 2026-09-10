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
import { initialProjects, fetchProjects, invalidateProjectsCache, Project } from './data/projects';
import { isAdminLoggedIn, commitProjectsToGitHub } from './services/githubAdminService';

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
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isAdmin, setIsAdmin] = useState<boolean>(isAdminLoggedIn());
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [deletingProject, setDeletingProject] = useState<Project | null>(null);
    const savedScrollPos = React.useRef<number>(0);

    useEffect(() => {
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

    // Admin Handlers
    const handleSaveProject = async (projectToSave: Project) => {
        let updatedList: Project[] = [];
        
        // If isFeatured is set to true for projectToSave, set it to false for all other projects
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

        await commitProjectsToGitHub(updatedList, `App updated/created: ${projectToSave.title}`);
        invalidateProjectsCache();
        const freshList = await fetchProjects(true);
        setProjectList(freshList.length > 0 ? freshList : updatedList);
    };

    const handleDeleteProject = async () => {
        if (!deletingProject) return;
        const updatedList = projectList.filter(p => p.id !== deletingProject.id);
        await commitProjectsToGitHub(updatedList, `App deleted: ${deletingProject.title}`);
        invalidateProjectsCache();
        const freshList = await fetchProjects(true);
        setProjectList(freshList.length > 0 ? freshList : updatedList);
        if (route.selectedAppId === deletingProject.id) {
            window.location.hash = '#apps';
        }
    };

    const handleReloadProjects = async () => {
        invalidateProjectsCache();
        const data = await fetchProjects(true);
        setProjectList(data);
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