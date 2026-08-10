import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Project, PlatformSupport } from '../data/projects';

interface ProjectFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (project: Project) => Promise<void>;
    projectToEdit?: Project | null;
}

const emptyProject: Project = {
    id: '',
    title: '',
    tagline: '',
    description: '',
    longDescription: '',
    color: '#8b5cf6',
    category: 'Games',
    version: '1.0.0',
    releaseDate: new Date().toLocaleDateString('de-DE'),
    updatedDate: new Date().toLocaleDateString('de-DE'),
    supportedPlatforms: 'both',
    developer: 'by-dp',
    isFeatured: false,
    icon: '',
    openUrl: '',
    downloadUrl: '',
    downloadFilename: '',
    status: '',
    features: [],
    screenshots: []
};

const ProjectFormModal: React.FC<ProjectFormModalProps> = ({ isOpen, onClose, onSave, projectToEdit }) => {
    const [formData, setFormData] = useState<Project>(emptyProject);
    const [featureInput, setFeatureInput] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (isOpen) {
            if (projectToEdit) {
                setFormData({
                    ...emptyProject,
                    ...projectToEdit,
                    features: projectToEdit.features || [],
                    screenshots: projectToEdit.screenshots || []
                });
            } else {
                setFormData({
                    ...emptyProject,
                    id: `app-${Date.now().toString().slice(-4)}`,
                    releaseDate: new Date().toLocaleDateString('de-DE'),
                    updatedDate: new Date().toLocaleDateString('de-DE')
                });
            }
            setFeatureInput('');
            setErrorMsg('');
        }
    }, [isOpen, projectToEdit]);

    const handleChange = (field: keyof Project, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Convert image file to base64 data url
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isIcon: boolean) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64 = event.target?.result as string;
                if (isIcon) {
                    setFormData(prev => ({ ...prev, icon: base64 }));
                } else {
                    setFormData(prev => ({
                        ...prev,
                        screenshots: [...(prev.screenshots || []), base64]
                    }));
                }
            };
            reader.readAsDataURL(file);
        });

        // Reset file input
        e.target.value = '';
    };

    const handleAddFeature = () => {
        if (!featureInput.trim()) return;
        setFormData(prev => ({
            ...prev,
            features: [...(prev.features || []), featureInput.trim()]
        }));
        setFeatureInput('');
    };

    const handleRemoveFeature = (index: number) => {
        setFormData(prev => ({
            ...prev,
            features: (prev.features || []).filter((_, i) => i !== index)
        }));
    };

    const handleRemoveScreenshot = (index: number) => {
        setFormData(prev => ({
            ...prev,
            screenshots: (prev.screenshots || []).filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg('');

        if (!formData.title.trim()) {
            setErrorMsg('Bitte gib einen App-Titel ein.');
            return;
        }

        if (!formData.id.trim()) {
            setErrorMsg('Bitte gib eine App ID (Slug) ein.');
            return;
        }

        setIsSaving(true);
        try {
            await onSave(formData);
            setIsSaving(false);
            onClose();
        } catch (err: any) {
            setIsSaving(false);
            setErrorMsg(err.message || 'Fehler beim Speichern der App auf GitHub.');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={projectToEdit ? `App bearbeiten: ${projectToEdit.title}` : 'Neue App hinzufügen'}>
            <form onSubmit={handleSubmit} className="space-y-6">
                {errorMsg && (
                    <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-sm font-semibold">
                        {errorMsg}
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                            App ID (Slug)*
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="z. B. party-games"
                            value={formData.id}
                            onChange={(e) => handleChange('id', e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm font-mono"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                            Titel der App*
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="z. B. Party Games"
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                        Tagline (Slogan für Kacheln)
                    </label>
                    <input
                        type="text"
                        placeholder="Kurze Zusammenfassung in einem Satz..."
                        value={formData.tagline}
                        onChange={(e) => handleChange('tagline', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                        Kurzbeschreibung
                    </label>
                    <textarea
                        rows={2}
                        placeholder="Kurzer Beschreibungstext..."
                        value={formData.description}
                        onChange={(e) => handleChange('description', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                </div>

                <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                        Ausführliche Beschreibung (Detailseite)
                    </label>
                    <textarea
                        rows={4}
                        placeholder="Ausführliche Information zur App..."
                        value={formData.longDescription}
                        onChange={(e) => handleChange('longDescription', e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm"
                    />
                </div>

                {/* Color, Category & Platform Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                            Hex Farbcode
                        </label>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                value={formData.color || '#8b5cf6'}
                                onChange={(e) => handleChange('color', e.target.value)}
                                className="w-10 h-10 rounded-xl cursor-pointer border-0 bg-transparent shrink-0"
                            />
                            <input
                                type="text"
                                value={formData.color}
                                onChange={(e) => handleChange('color', e.target.value)}
                                className="w-full px-3 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm font-mono"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                            Kategorie (Freie Eingabe)
                        </label>
                        <input
                            type="text"
                            placeholder="z. B. Games, Tools"
                            value={formData.category}
                            onChange={(e) => handleChange('category', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                            Plattform Unterstützung
                        </label>
                        <select
                            value={formData.supportedPlatforms || 'both'}
                            onChange={(e) => handleChange('supportedPlatforms', e.target.value as PlatformSupport)}
                            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm"
                        >
                            <option value="both">Universal (Smartphone & PC)</option>
                            <option value="mobile">Nur Smartphone / Tablet</option>
                            <option value="desktop">Nur PC / Desktop</option>
                        </select>
                    </div>
                </div>

                {/* Versions & Links Row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                            Version
                        </label>
                        <input
                            type="text"
                            placeholder="1.0.0"
                            value={formData.version}
                            onChange={(e) => handleChange('version', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                            Veröffentlichung
                        </label>
                        <input
                            type="text"
                            value={formData.releaseDate}
                            onChange={(e) => handleChange('releaseDate', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                            Letztes Update
                        </label>
                        <input
                            type="text"
                            value={formData.updatedDate}
                            onChange={(e) => handleChange('updatedDate', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm"
                        />
                    </div>
                </div>

                {/* GitHub Repository & URLs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                            GitHub Repo (Auto-Sync) 🐙
                        </label>
                        <input
                            type="text"
                            placeholder="z. B. dPandl/griddly-csv"
                            value={formData.githubRepo || ''}
                            onChange={(e) => handleChange('githubRepo', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                            Web-App URL (Öffnen)
                        </label>
                        <input
                            type="text"
                            placeholder="https://by-dp.de/Party-Games"
                            value={formData.openUrl}
                            onChange={(e) => handleChange('openUrl', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                            Status (z. B. Beta)
                        </label>
                        <input
                            type="text"
                            placeholder="Freies Badge, z. B. Beta"
                            value={formData.status}
                            onChange={(e) => handleChange('status', e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-sm"
                        />
                    </div>
                </div>

                {/* Download URLs */}
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700 space-y-4">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                        Manuelle Download Links (Optional pro Betriebssystem)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                            <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                                🪟 Windows (.exe / .zip)
                            </label>
                            <input
                                type="text"
                                placeholder="https://..."
                                value={formData.downloadUrls?.windows || ''}
                                onChange={(e) => handleChange('downloadUrls', { ...formData.downloadUrls, windows: e.target.value })}
                                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-xs"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                                🤖 Android (.apk)
                            </label>
                            <input
                                type="text"
                                placeholder="https://..."
                                value={formData.downloadUrls?.android || ''}
                                onChange={(e) => handleChange('downloadUrls', { ...formData.downloadUrls, android: e.target.value })}
                                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-xs"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                                🍏 macOS (.dmg / .zip)
                            </label>
                            <input
                                type="text"
                                placeholder="https://..."
                                value={formData.downloadUrls?.mac || ''}
                                onChange={(e) => handleChange('downloadUrls', { ...formData.downloadUrls, mac: e.target.value })}
                                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-xs"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                                🐧 Linux (.AppImage / .deb)
                            </label>
                            <input
                                type="text"
                                placeholder="https://..."
                                value={formData.downloadUrls?.linux || ''}
                                onChange={(e) => handleChange('downloadUrls', { ...formData.downloadUrls, linux: e.target.value })}
                                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-xs"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <div>
                            <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                                Standard/Fallback Download URL
                            </label>
                            <input
                                type="text"
                                placeholder="https://..."
                                value={formData.downloadUrl || ''}
                                onChange={(e) => handleChange('downloadUrl', e.target.value)}
                                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-xs"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                                Download Dateiname
                            </label>
                            <input
                                type="text"
                                placeholder="App-Setup.exe"
                                value={formData.downloadFilename || ''}
                                onChange={(e) => handleChange('downloadFilename', e.target.value)}
                                className="w-full px-3.5 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-xs"
                            />
                        </div>
                    </div>
                </div>

                {/* App des Monats Schalter */}
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                    <input
                        type="checkbox"
                        id="isFeaturedToggle"
                        checked={Boolean(formData.isFeatured)}
                        onChange={(e) => handleChange('isFeatured', e.target.checked)}
                        className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                    />
                    <label htmlFor="isFeaturedToggle" className="text-sm font-bold text-amber-700 dark:text-amber-300 cursor-pointer">
                        Als "App des Monats" im Spotlight des App Hubs hervorheben 🌟
                    </label>
                </div>

                {/* App Icon Upload / Base64 */}
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                        App Icon (Datei hochladen oder URL/Base64)
                    </label>
                    <div className="flex items-center gap-4">
                        {formData.icon ? (
                            <img src={formData.icon} alt="Icon" className="w-14 h-14 rounded-2xl object-cover border border-gray-300 dark:border-gray-600 shrink-0" />
                        ) : (
                            <div className="w-14 h-14 rounded-2xl bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400 font-bold shrink-0">
                                Logo
                            </div>
                        )}
                        <div className="flex-grow space-y-2">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, true)}
                                className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/10 file:text-cyan-600 hover:file:bg-cyan-500/20 cursor-pointer"
                            />
                            <input
                                type="text"
                                placeholder="Oder Bild URL / Base64 eintragen..."
                                value={formData.icon}
                                onChange={(e) => handleChange('icon', e.target.value)}
                                className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Screenshots Upload / List */}
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                        Screenshots ({formData.screenshots?.length || 0})
                    </label>
                    
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleImageUpload(e, false)}
                        className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-500/10 file:text-cyan-600 hover:file:bg-cyan-500/20 cursor-pointer mb-4"
                    />

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {formData.screenshots?.map((src, idx) => (
                            <div key={idx} className="relative group rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700 h-24 bg-black/20">
                                <img src={src} alt={`Screenshot ${idx + 1}`} className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => handleRemoveScreenshot(idx)}
                                    className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-lg text-xs opacity-80 hover:opacity-100 transition-opacity"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Features Highlights */}
                <div className="p-3.5 sm:p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-200 dark:border-gray-700">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-2">
                        Highlights / Features
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2 mb-3">
                        <input
                            type="text"
                            placeholder="Neues Feature Stichwort..."
                            value={featureInput}
                            onChange={(e) => setFeatureInput(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddFeature(); } }}
                            className="w-full sm:flex-grow px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-white"
                        />
                        <button
                            type="button"
                            onClick={handleAddFeature}
                            className="w-full sm:w-auto px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 text-gray-800 dark:text-white font-bold rounded-xl text-sm transition-colors shrink-0"
                        >
                            + Hinzufügen
                        </button>
                    </div>
                    <ul className="space-y-2">
                        {formData.features?.map((feat, idx) => (
                            <li key={idx} className="flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xs">
                                <span className="text-gray-700 dark:text-gray-300 pr-2 break-words">✓ {feat}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveFeature(idx)}
                                    className="text-rose-500 font-bold hover:text-rose-700 p-1 shrink-0"
                                >
                                    ✕
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* GitHub Deployment Info Hint */}
                <div className="p-3.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-700 dark:text-cyan-300 flex items-start gap-2.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                        <strong>Hinweis:</strong> Nach dem Speichern wird die Änderung sofort auf GitHub committet. Es kann ca. 1–2 Minuten dauern, bis GitHub Pages die Live-Seite weltweit aktualisiert.
                    </span>
                </div>

                {/* Submit Actions */}
                <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full sm:w-auto px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-2xl text-sm"
                    >
                        Abbrechen
                    </button>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-cyan-500/25 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                        {isSaving ? (
                            <>
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Committe auf GitHub...
                            </>
                        ) : (
                            'Speichern & Veröffentlichen'
                        )}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default ProjectFormModal;
