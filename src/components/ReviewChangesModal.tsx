import React from 'react';
import Modal from './Modal';
import { Project } from '../data/projects';

interface ChangedField {
    key: string;
    label: string;
    oldVal: any;
    newVal: any;
}

export interface AppChangeItem {
    type: 'added' | 'deleted' | 'modified';
    project: Project;
    originalProject?: Project;
    changedFields: ChangedField[];
}

interface ReviewChangesModalProps {
    isOpen: boolean;
    onClose: () => void;
    originalProjects: Project[];
    currentProjects: Project[];
    onPublish: () => void;
    isPublishing: boolean;
    onRevertSingleApp: (appId: string) => void;
}

export function computeAppChanges(originalList: Project[], currentList: Project[]): AppChangeItem[] {
    const changes: AppChangeItem[] = [];

    const fieldLabels: Record<string, string> = {
        title: 'Titel',
        tagline: 'Untertitel',
        description: 'Kurzbeschreibung',
        longDescription: 'Ausführliche Beschreibung',
        version: 'Version',
        category: 'Kategorie',
        color: 'Farbe',
        isFeatured: 'App des Monats / Spotlight',
        openUrl: 'Web-Link / Open URL',
        downloadUrl: 'Download Link',
        supportedPlatforms: 'Plattform-Support',
        status: 'Status',
        features: 'Highlights / Features',
        screenshots: 'Screenshots'
    };

    // 1. Neu hinzugefügte & Geänderte Apps
    currentList.forEach(curr => {
        const orig = originalList.find(o => o.id === curr.id);
        if (!orig) {
            changes.push({
                type: 'added',
                project: curr,
                changedFields: []
            });
        } else if (JSON.stringify(orig) !== JSON.stringify(curr)) {
            const changedFields: ChangedField[] = [];
            const allKeys = new Set([...Object.keys(orig), ...Object.keys(curr)]);
            
            allKeys.forEach(k => {
                const oldVal = (orig as any)[k];
                const newVal = (curr as any)[k];
                if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
                    changedFields.push({
                        key: k,
                        label: fieldLabels[k] || k,
                        oldVal,
                        newVal
                    });
                }
            });

            changes.push({
                type: 'modified',
                project: curr,
                originalProject: orig,
                changedFields
            });
        }
    });

    // 2. Gelöschte Apps
    originalList.forEach(orig => {
        if (!currentList.some(c => c.id === orig.id)) {
            changes.push({
                type: 'deleted',
                project: orig,
                changedFields: []
            });
        }
    });

    return changes;
}

const ReviewChangesModal: React.FC<ReviewChangesModalProps> = ({
    isOpen,
    onClose,
    originalProjects,
    currentProjects,
    onPublish,
    isPublishing,
    onRevertSingleApp
}) => {
    const changes = computeAppChanges(originalProjects, currentProjects);

    const renderValue = (val: any) => {
        if (val === undefined || val === null || val === '') {
            return <em className="text-gray-400">leer</em>;
        }
        if (typeof val === 'boolean') {
            return val ? 'Ja' : 'Nein';
        }
        if (Array.isArray(val)) {
            return `${val.length} Eintrag/Einträge`;
        }
        const str = String(val);
        if (str.length > 60) {
            return str.slice(0, 57) + '...';
        }
        return str;
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Entwurfs-Änderungen überprüfen">
            <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        Überprüfe alle Änderungen vor dem Committen auf GitHub:
                    </p>
                    <span className="text-xs font-bold px-3 py-1 bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded-full border border-amber-500/30">
                        {changes.length} {changes.length === 1 ? 'betroffene App' : 'betroffene Apps'}
                    </span>
                </div>

                {changes.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        Keine Änderungen im Entwurf vorhanden.
                    </div>
                ) : (
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                        {changes.map(item => (
                            <div 
                                key={item.project.id}
                                className="p-4 rounded-2xl bg-white dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700/80 shadow-sm space-y-3"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2.5">
                                        {item.type === 'added' && (
                                            <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                                                + NEU
                                            </span>
                                        )}
                                        {item.type === 'deleted' && (
                                            <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                                                - GELÖSCHT
                                            </span>
                                        )}
                                        {item.type === 'modified' && (
                                            <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                                                ✎ GEÄNDERT
                                            </span>
                                        )}
                                        <h4 className="font-bold text-base text-gray-900 dark:text-white">
                                            {item.project.title}
                                        </h4>
                                        <span className="text-xs text-gray-400 font-mono">
                                            ({item.project.id})
                                        </span>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => onRevertSingleApp(item.project.id)}
                                        className="text-xs text-gray-500 hover:text-rose-500 dark:text-gray-400 dark:hover:text-rose-400 px-2.5 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                        title="Nur die Änderungen dieser App zurücksetzen"
                                    >
                                        ↩ Zurücksetzen
                                    </button>
                                </div>

                                {item.type === 'modified' && item.changedFields.length > 0 && (
                                    <div className="bg-gray-50 dark:bg-gray-900/60 rounded-xl p-3 border border-gray-100 dark:border-gray-800 space-y-2 text-xs">
                                        {item.changedFields.map(f => (
                                            <div key={f.key} className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-2 items-start py-1 border-b border-gray-100 dark:border-gray-800/60 last:border-0">
                                                <span className="font-semibold text-gray-700 dark:text-gray-300">
                                                    {f.label}:
                                                </span>
                                                <div className="line-through text-rose-500/80 truncate">
                                                    {renderValue(f.oldVal)}
                                                </div>
                                                <div className="font-medium text-emerald-600 dark:text-emerald-400 truncate">
                                                    ➔ {renderValue(f.newVal)}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {item.type === 'added' && (
                                    <p className="text-xs text-gray-500">
                                        Wird als neue App in Kategorie <strong>{item.project.category}</strong> (Version {item.project.version}) hinzugefügt.
                                    </p>
                                )}

                                {item.type === 'deleted' && (
                                    <p className="text-xs text-rose-500/90 font-medium">
                                        Diese App wird vollständig aus der Liste auf GitHub gelöscht.
                                    </p>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full sm:w-auto px-6 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-xl text-sm"
                    >
                        Schließen & Weiterbearbeiten
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            onClose();
                            onPublish();
                        }}
                        disabled={isPublishing || changes.length === 0}
                        className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold rounded-xl shadow-lg shadow-cyan-500/25 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        Alles jetzt auf GitHub veröffentlichen
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ReviewChangesModal;
