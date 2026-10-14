import React from 'react';

interface AdminPublishBarProps {
    pendingCount: number;
    isPublishing: boolean;
    publishError: string | null;
    publishSuccess: boolean;
    onPublish: () => void;
    onDiscard: () => void;
    onOpenReview: () => void;
}

const AdminPublishBar: React.FC<AdminPublishBarProps> = ({
    pendingCount,
    isPublishing,
    publishError,
    publishSuccess,
    onPublish,
    onDiscard,
    onOpenReview
}) => {
    if (pendingCount === 0 && !publishSuccess && !publishError) {
        return null;
    }

    return (
        <aside 
            aria-label="Admin Statusleiste für ungespeicherte Änderungen"
            className="sticky top-0 z-40 w-full bg-gradient-to-r from-amber-500/95 via-orange-500/95 to-amber-600/95 text-white shadow-xl backdrop-blur-md border-b border-amber-300/30 transition-all duration-300"
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-center sm:text-left">
                    <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 shadow-inner">
                        {publishSuccess ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <span className="text-lg">⚡</span>
                        )}
                    </div>
                    <div>
                        {publishSuccess ? (
                            <p className="font-bold text-sm sm:text-base text-white">
                                Alle Änderungen wurden erfolgreich auf GitHub committet!
                            </p>
                        ) : (
                            <>
                                <p className="font-bold text-sm sm:text-base leading-tight">
                                    {pendingCount} ungespeicherte {pendingCount === 1 ? 'Änderung' : 'Änderungen'} im Entwurf
                                </p>
                                <p className="text-xs text-amber-100 opacity-90">
                                    Änderungen sind sofort sichtbar. Klicke auf Veröffentlichen, um sie als einen Commit auf GitHub zu sichern.
                                </p>
                            </>
                        )}
                        {publishError && (
                            <p className="text-xs text-red-100 font-semibold mt-0.5 bg-red-900/40 px-2 py-0.5 rounded">
                                Fehler: {publishError}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                    {!publishSuccess && (
                        <>
                            <button
                                onClick={onOpenReview}
                                disabled={isPublishing}
                                className="px-3.5 py-1.5 text-xs sm:text-sm font-semibold text-white bg-black/25 hover:bg-black/35 rounded-xl border border-white/20 transition-all flex items-center gap-1.5"
                                title="Genaue Liste aller geänderten Apps und Felder anzeigen"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                Änderungen ansehen ({pendingCount})
                            </button>

                            <button
                                onClick={onDiscard}
                                disabled={isPublishing}
                                className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-white/80 hover:text-white bg-black/20 hover:bg-black/30 rounded-xl transition-all disabled:opacity-50"
                                title="Entwürfe verwerfen und Stand von GitHub wiederherstellen"
                            >
                                Verwerfen
                            </button>
                        </>
                    )}
                    
                    {!publishSuccess && (
                        <button
                            onClick={onPublish}
                            disabled={isPublishing}
                            className="px-4 py-2 text-xs sm:text-sm font-bold bg-white text-orange-600 hover:bg-orange-50 rounded-xl shadow-md shadow-black/10 hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-60 active:scale-95"
                        >
                            {isPublishing ? (
                                <>
                                    <svg className="animate-spin h-4 w-4 text-orange-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Veröffentliche auf GitHub...
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                    </svg>
                                    Auf GitHub veröffentlichen
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default AdminPublishBar;
