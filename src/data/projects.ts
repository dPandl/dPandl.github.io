export type ProjectCategory = string;

export type PlatformSupport = 'mobile' | 'desktop' | 'both';

export interface Project {
    id: string;
    title: string;
    tagline: string;
    description: string;
    longDescription?: string;
    color: string; // Hex Farbcode (z. B. "#8b5cf6")
    glowColor?: string; // Abwärtskompatibilität
    isFeatured?: boolean; // Kennzeichnung als App des Monats / Spotlight App
    openUrl?: string;
    downloadUrl?: string;
    downloadFilename?: string;
    status?: string;
    category: ProjectCategory;
    version: string;
    releaseDate: string;
    updatedDate: string;
    supportedPlatforms?: PlatformSupport; // 'mobile' (nur Smartphone), 'desktop' (nur PC), 'both' (beide)
    mobileCompatible?: boolean; // Abwärtskompatibilität
    icon?: string;
    screenshots?: string[];
    features?: string[];
    developer?: string;
}

export const initialProjects: Project[] = [
    {
        id: "party-games",
        title: "Party Games",
        tagline: "Die ultimative Spielesammlung für Partys und Abende mit Freunden.",
        description: "Eine Sammlung lustiger und interaktiver Partyspiele für Freunde und Familie.",
        longDescription: "Party Games bringt Schwung in jede Feier! Mit einer vielfältigen Auswahl an Kategorien, Minispielen und interaktiven Aufgaben ist für jeden Geschmack etwas dabei. Die App läuft direkt im Browser, ohne Download oder Installation, und eignet sich hervorragend für spontane Spieleabende.",
        openUrl: "https://by-dp.de/Party-Games",
        color: "#8b5cf6",
        category: "Games",
        version: "2.1.0",
        releaseDate: "15.01.2024",
        updatedDate: "10.05.2024",
        supportedPlatforms: "mobile",
        developer: "by-dp",
        features: [
            "Vielzahl an unterschiedlichen Partyspielen",
            "Kein Account erforderlich – sofort startklar",
            "Optimiert für Smartphone & Tablet",
            "Dunkles & helles Design"
        ],
        screenshots: [
            "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80"
        ]
    },
    {
        id: "depth",
        title: "dePth",
        tagline: "Persönliches Mikro-Tagebuch im Timeline-Format.",
        description: "Eine Tagebuch-App im Stil von Twitter für deine persönlichen Gedanken und Erlebnisse.",
        longDescription: "dePth ermöglicht es dir, Gedanken, Erinnerungen und Meilensteine schnell und unkompliziert festzuhalten. Die Benutzeroberfläche orientiert sich an vertrauten Social-Media-Timelines, speichert jedoch alle Daten 100% lokal auf deinem Gerät für maximale Privatsphäre.",
        openUrl: "https://by-dp.de/depth",
        color: "#64748b",
        category: "Alltagshelfer",
        version: "1.4.2",
        releaseDate: "01.03.2024",
        updatedDate: "22.06.2024",
        supportedPlatforms: "both",
        developer: "by-dp",
        features: [
            "Twitter/X-ähnlicher Feed für eigene Einträge",
            "Lokale Datenspeicherung – 100% Datenschutz",
            "Export- und Backup-Funktion",
            "Volltextsuche & Datumsfilter"
        ],
        screenshots: [
            "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1000&q=80"
        ]
    },
    {
        id: "ausbildungsplaner",
        title: "Ausbildungsplaner",
        tagline: "Stundenpläne, Prüfungen & Noten perfekt organisiert.",
        description: "Organisiere deinen Schul- oder Uni-Alltag mühelos. Erstelle Stundenpläne, verwalte Prüfungstermine, erstelle Lernsets und behalte deine Noten im Blick.",
        longDescription: "Der Ausbildungsplaner ist der digitale Assistent für Schüler, Azubis und Studierende. Verwalte Stundenpläne, Termine, Noten und Lernkarteikarten an einem zentralen Ort. Dank übersichtlicher Statistiken hast du deinen aktuellen Notenschnitt und anstehende Fristen stets im Blick.",
        color: "#06b6d4",
        openUrl: "https://by-dp.de/Ausbildungsplaner/",
        category: "Alltagshelfer",
        version: "3.0.1",
        releaseDate: "10.09.2023",
        updatedDate: "12.07.2024",
        supportedPlatforms: "both",
        developer: "by-dp",
        features: [
            "Interaktiver Stunden- & Vorlesungsplan",
            "Notenrechner mit Gewichtungsoptionen",
            "Lernset- & Karteikarten-System",
            "Erinnerungsfunktion für Prüfungen"
        ],
        screenshots: [
            "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1000&q=80",
            "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=1000&q=80"
        ]
    },
    {
        id: "zeiterfassung",
        title: "Zeiterfassung",
        tagline: "Arbeitszeiten erfassen, auswerten & als PDF exportieren.",
        description: "Eine App die hilft, Arbeitsstunden nach Projekten zu erfassen, Berichte einzusehen und diese als PDF zu exportieren.",
        longDescription: "Professionelle Zeiterfassung ohne Cloud-Zwang. Erfasse Stempelzeiten oder projektspezifische Stunden direkt im Browser. Generiere mit einem Klick übersichtliche Monatsberichte und exportiere diese als druckfertiges PDF.",
        color: "#14b8a6",
        openUrl: "https://by-dp.de/Zeiterfassung/",
        category: "Alltagshelfer",
        version: "1.8.0",
        releaseDate: "20.11.2023",
        updatedDate: "05.08.2024",
        supportedPlatforms: "both",
        developer: "by-dp",
        features: [
            "Projekt- & Kundenbezogene Stundenerfassung",
            "Automatische Pausenberechnung",
            "PDF- & CSV-Export für die Buchhaltung",
            "Offline nutzbar (Progressive Web App)"
        ],
        screenshots: [
            "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?auto=format&fit=crop&w=1000&q=80"
        ]
    },
    {
        id: "kindergarten-dienstplan",
        title: "Dienstplan App",
        tagline: "Schichtpläne für Kitas einfach & transparent erstellen.",
        description: "Erstellen und verwalten Sie Dienstpläne für Erzieher einfach und transparent.",
        longDescription: "Speziell entwickelt für die Anforderungen in Kindergärten und Kitas. Erstellen Sie Schichtmodelle, verwalte Abwesenheiten und behalte die Soll-Stunden des Teams stets übersichtlich im Auge.",
        openUrl: "https://by-dp.de/kindergarten-dienstplan-app/",
        color: "#ec4899",
        category: "Kindergarten",
        version: "2.0.4",
        releaseDate: "05.02.2024",
        updatedDate: "01.08.2024",
        supportedPlatforms: "desktop",
        developer: "by-dp",
        features: [
            "Vorlagen für Früh-, Mittel- und Spätschichten",
            "Urlaubs- & Krankheitsverwaltung",
            "Export als Wochen- & Monatsübersicht",
            "DSGVO-konform ohne Cloud-Speicherung"
        ],
        screenshots: [
            "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1000&q=80"
        ]
    },
    {
        id: "kindergarten-essensplaner",
        title: "Essensplaner App",
        tagline: "Rückmeldungen in übersichtliche Caterer-Listen verwandeln.",
        description: "Als Companion-App für „Stay Informed“ wandelt der Essensplaner die Rückmeldungen aus der Kindergarten-App direkt in übersichtliche Pläne und Listen um.",
        longDescription: "Der Essensplaner vereinfacht die tägliche Essensbestellung in Kindertagesstätten. Er verarbeitet Abmeldungen und Essenswünsche und erstellt automatisch präzise Bestelllisten für den Caterer und die Küchenkräfte.",
        openUrl: "https://by-dp.de/kindergarten-essensplaner/",
        color: "#84cc16",
        category: "Kindergarten",
        version: "1.3.1",
        releaseDate: "14.04.2024",
        updatedDate: "19.07.2024",
        supportedPlatforms: "desktop",
        developer: "by-dp",
        features: [
            "Kopplung mit 'Stay Informed' Daten",
            "Automatische Aggregation der Essenszahlen",
            "Allergie- & Unverträglichkeitsübersicht",
            "Schnell-Export für Catering-Partner"
        ],
        screenshots: [
            "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1000&q=80"
        ]
    },
    {
        id: "kitalytics",
        title: "Kitalytics",
        tagline: "Anwesenheiten erfassen & Auslastung optimal analysieren.",
        description: "Erfassen Sie Anwesenheiten, analysieren Sie die Auslastung und optimieren Sie Ihre Planung.",
        longDescription: "Kitalytics bringt datengestützte Einblicke in den Kita-Alltag. Erfassen Sie Anwesenheitszeiten, Betreuungsschlüssel und Auslastungen, um Personalressourcen vorausschauend und bedarfsgerecht zu planen.",
        openUrl: "https://by-dp.de/Kitalytics/",
        color: "#0d9488",
        category: "Kindergarten",
        version: "1.1.0",
        releaseDate: "01.06.2024",
        updatedDate: "02.08.2024",
        supportedPlatforms: "desktop",
        developer: "by-dp",
        features: [
            "Echtzeit-Statistiken zur Kita-Auslastung",
            "Betreuungsschlüssel-Rechner",
            "Graphische Auswertungen & Berichte",
            "Lokale Datenspeicherung auf dem Einrichtungsgerät"
        ],
        screenshots: [
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80"
        ]
    },
    {
        id: "erzieher-app",
        title: "Erzieher App",
        tagline: "Pädagogische Angebote & Entwicklungsberichte digital verwalten.",
        description: "Ermöglicht Erziehern, pädagogische Angebote zu erstellen und Entwicklungsdokumentationen digital auszufüllen und zu verwalten.",
        longDescription: "Die Erzieher App unterstützt pädagogisches Fachpersonal bei der täglichen Entwicklungsdokumentation, Portfolioarbeit und Angebotsplanung. Sparen Sie wertvolle Zeit bei Verwaltungsaufgaben.",
        openUrl: "https://by-dp.de/erzieher-app/",
        color: "#3b82f6",
        status: "In Entwicklung",
        category: "Kindergarten",
        version: "0.9.0 (Beta)",
        releaseDate: "Demnächst",
        updatedDate: "08.08.2024",
        supportedPlatforms: "both",
        developer: "by-dp",
        features: [
            "Vorlagen für Entwicklungsberichte",
            "Angebots- & Wochenplanung",
            "Druck- und PDF-Export für Elterngeschpräche",
            "Offline-First Architektur"
        ]
    },
    {
        id: "webapp-sandbox",
        title: "WebApp Sandbox",
        tagline: "Experimentelle Web-Technologien & APIs testen.",
        description: "Ein sicherer Ort, um Web-Technologien und APIs zu testen und zu experimentieren.",
        longDescription: "Die WebApp Sandbox ist eine Spielwiese für moderne Web-APIs (Web Bluetooth, Web Share, Service Worker, WebGL). Entwickler und Interessierte können hier experimentelle Features ausprobieren.",
        color: "#f59e0b",
        status: "In Entwicklung",
        category: "Tools",
        version: "0.5.0",
        releaseDate: "In Kürze",
        updatedDate: "01.08.2024",
        supportedPlatforms: "desktop",
        developer: "by-dp",
        features: [
            "Live Code Editor & Preview",
            "Zugriff auf moderne Browser APIs",
            "Performance Benchmark-Tools"
        ]
    }
];

export async function fetchProjects(): Promise<Project[]> {
    try {
        // Option 1: Live fetch via relative URL or GitHub raw JSON
        const response = await fetch('./projects.json?t=' + Date.now());
        if (response.ok) {
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                return data;
            }
        }
    } catch (e) {
        console.warn('Live fetch via projects.json failed, falling back to static data:', e);
    }
    return initialProjects;
}

export const projects = initialProjects;
