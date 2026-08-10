import React, { useState } from 'react';
import Modal from './Modal';

interface ConfirmDeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    appTitle: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm, appTitle }) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const handleDelete = async () => {
        setIsDeleting(true);
        setErrorMsg('');
        try {
            await onConfirm();
            setIsDeleting(false);
            onClose();
        } catch (err: any) {
            setIsDeleting(false);
            setErrorMsg(err.message || 'Löschen fehlgeschlagen.');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="App wirklich entfernen?">
            <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-start gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                        <h4 className="font-bold text-base">Achtung: unwiderrufliche Aktion!</h4>
                        <p className="text-sm mt-1 leading-relaxed text-gray-700 dark:text-gray-300">
                            Möchtest du die App <span className="font-extrabold text-gray-900 dark:text-white">"{appTitle}"</span> wirklich aus dem App Hub entfernen? 
                            Diese Änderung wird direkt als Commit auf GitHub ausgeführt.
                        </p>
                    </div>
                </div>

                {errorMsg && (
                    <div className="p-3 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-semibold">
                        {errorMsg}
                    </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold text-sm"
                    >
                        Abbrechen
                    </button>

                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-lg shadow-rose-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {isDeleting ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Lösche von GitHub...
                            </>
                        ) : (
                            'Ja, App definitiv entfernen'
                        )}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmDeleteModal;
