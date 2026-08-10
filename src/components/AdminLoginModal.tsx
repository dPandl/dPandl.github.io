import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { getAdminToken, setAdminToken, removeAdminToken, getFileFromGitHub } from '../services/githubAdminService';

interface AdminLoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: () => void;
    onLogout: () => void;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onLoginSuccess, onLogout }) => {
    const [tokenInput, setTokenInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [currentToken, setCurrentToken] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            const saved = getAdminToken();
            setCurrentToken(saved);
            setTokenInput(saved || '');
            setErrorMsg('');
            setSuccessMsg('');
        }
    }, [isOpen]);

    const handleSaveToken = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');
        setIsLoading(true);

        const cleanToken = tokenInput.trim();
        if (!cleanToken) {
            setErrorMsg('Bitte gib einen GitHub Access Token ein.');
            setIsLoading(false);
            return;
        }

        try {
            // Validate token against GitHub API
            await getFileFromGitHub(cleanToken);
            setAdminToken(cleanToken);
            setCurrentToken(cleanToken);
            setSuccessMsg('Erfolgreich angemeldet! Der Admin-Modus ist nun aktiv.');
            setIsLoading(false);
            onLoginSuccess();
            setTimeout(() => {
                onClose();
            }, 1200);
        } catch (err: any) {
            setIsLoading(false);
            setErrorMsg(err.message || 'Verbindung fehlgeschlagen. Überprüfe deinen Token.');
        }
    };

    const handleLogoutClick = () => {
        removeAdminToken();
        setCurrentToken(null);
        setTokenInput('');
        setSuccessMsg('');
        setErrorMsg('');
        onLogout();
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Admin Login">
            <div className="space-y-6">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 text-xs sm:text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <div>
                        <p className="font-bold">Direkte GitHub API Anbindung</p>
                        <p className="text-gray-600 dark:text-gray-400 mt-0.5">
                            Gib hier deinen GitHub Personal Access Token (PAT) ein, um Apps direkt im Browser zu erstellen, zu bearbeiten oder zu löschen.
                        </p>
                    </div>
                </div>

                {errorMsg && (
                    <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-sm font-semibold flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{errorMsg}</span>
                    </div>
                )}

                {successMsg && (
                    <div className="p-4 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-sm font-semibold flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{successMsg}</span>
                    </div>
                )}

                <form onSubmit={handleSaveToken} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                            GitHub Personal Access Token (PAT)
                        </label>
                        <input
                            type="password"
                            placeholder="ghp_..."
                            value={tokenInput}
                            onChange={(e) => setTokenInput(e.target.value)}
                            className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-mono text-sm focus:ring-2 focus:ring-cyan-500 outline-none transition-all"
                        />
                        <p className="text-[11px] text-gray-400 mt-2">
                            Der Token benötigt <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">repo</code> Schreibrechte für <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">dPandl/dPandl.github.io</code>. Er wird ausschließlich lokal auf deinem Gerät im Browser gespeichert.
                        </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                        {currentToken ? (
                            <button
                                type="button"
                                onClick={handleLogoutClick}
                                className="px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold transition-colors"
                            >
                                Abmelden / Token löschen
                            </button>
                        ) : <div />}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-cyan-500/25 transition-all text-sm flex items-center gap-2 disabled:opacity-50"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Prüfe Token...
                                </>
                            ) : (
                                'Anmelden & Speichern'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    );
};

export default AdminLoginModal;
