import React, { ReactNode } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    React.useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-gray-900/60 backdrop-blur-md z-50 flex justify-center items-center p-2 sm:p-4 transition-opacity duration-300 overflow-hidden"
            onClick={onClose}
        >
            <div 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-3xl max-h-[92vh] flex flex-col transition-colors duration-300 overflow-hidden border border-gray-200 dark:border-gray-700"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white pr-2 truncate">{title}</h2>
                    <button onClick={onClose} className="p-1 rounded-xl text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-3 sm:p-6 overflow-y-auto text-gray-600 dark:text-gray-300">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
