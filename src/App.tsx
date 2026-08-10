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
import { initialProjects, fetchProjects, Project } from './data/projects';

type ModalType = 'impressum' | 'datenschutz' | null;
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
    const savedScrollPos = React.useRef<number>(0);

    useEffect(() => {
        let isMounted = true;
        fetchProjects().then(data => {
            if (isMounted) setProjectList(data);
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
    const closeModal = () => setActiveModal(null);
    
    const navigateTo = (targetPage: PageType) => {
        if (targetPage === 'home') {
            window.location.hash = '';
        } else {
            window.location.hash = '#apps';
        }
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
                        onSelectApp={(app) => {
                            window.location.hash = `#app/${app.id}`;
                        }}
                    />
                )}
                {route.page === 'apps' && selectedApp && (
                    <AppDetailPage 
                        app={selectedApp} 
                        onBack={() => {
                            window.location.hash = '#apps';
                        }}
                    />
                )}
            </main>

            <Footer 
                onImpressumClick={() => openModal('impressum')}
                onDatenschutzClick={() => openModal('datenschutz')}
            />
            
            <Modal isOpen={activeModal === 'impressum'} onClose={closeModal} title="Impressum">
                <ImpressumContent />
            </Modal>
            <Modal isOpen={activeModal === 'datenschutz'} onClose={closeModal} title="Datenschutzerklärung">
                <DatenschutzContent />
            </Modal>
            <CookieBanner onDatenschutzClick={() => openModal('datenschutz')} />
        </div>
    );
};

export default App;