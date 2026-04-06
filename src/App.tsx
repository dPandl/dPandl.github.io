import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import AppsPage from './pages/AppsPage';
import Modal from './components/Modal';
import ImpressumContent from './pages/ImpressumContent';
import DatenschutzContent from './pages/DatenschutzContent';
import CookieBanner from './components/CookieBanner';
import Footer from './components/Footer';

type ModalType = 'impressum' | 'datenschutz' | null;
export type PageType = 'home' | 'apps';

const getPageFromHash = (): PageType => {
    const hash = window.location.hash;
    if (hash.startsWith('#apps')) {
        return 'apps';
    }
    return 'home';
};

const App: React.FC = () => {
    const [activeModal, setActiveModal] = useState<ModalType>(null);
    const [page, setPage] = useState<PageType>(getPageFromHash());

    useEffect(() => {
        const handleHashChange = () => {
            setPage(getPageFromHash());
        };

        window.addEventListener('hashchange', handleHashChange);
        return () => {
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    const openModal = (modal: ModalType) => setActiveModal(modal);
    const closeModal = () => setActiveModal(null);
    const navigateTo = (targetPage: PageType) => {
        if (targetPage === 'home') {
            window.location.hash = '';
        } else {
            window.location.hash = `#${targetPage}`;
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen flex flex-col font-sans transition-colors duration-300">
            <Header
                onNavigate={navigateTo}
                activePage={page}
            />

            <main className="flex-grow">
                {page === 'home' && <HomePage />}
                {page === 'apps' && <AppsPage />}
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