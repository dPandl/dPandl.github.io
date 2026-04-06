export type ProjectCategory = 'Games' | 'Alltagshelfer' | 'Tools' | 'Kindergarten';

export interface Project {
    title: string;
    description: string;
    glowColor: 'cyan' | 'lime' | 'violet' | 'yellow' | 'pink' | 'blue' | 'gray' | 'teal' | 'orange' | 'customTeal';
    href?: string;
    status?: string;
    category: ProjectCategory;
}

export const projects: Project[] = [
    {
        title: "Party Games",
        description: "Eine Sammlung lustiger und interaktiver Partyspiele für Freunde und Familie.",
        href: "https://by-dp.de/Party-Games",
        glowColor: "violet",
        category: "Games",
    },
    {
        title: "dePth",
        description: "Eine Tagebuch-App im Stil von Twitter für deine persönlichen Gedanken und Erlebnisse.",
        href: "https://by-dp.de/depth",
        glowColor: "gray",
        category: "Alltagshelfer",
    },
    {
        title: "Ausbildungsplaner",
        description: "Organisiere deinen Schul- oder Uni-Alltag mühelos. Erstelle Stundenpläne, verwalte Prüfungstermine, erstelle Lernsets und behalte deine Noten im Blick, um deinen Erfolg zu planen.",
        glowColor: "cyan",
        href: "https://by-dp.de/Ausbildungsplaner/",
        category: "Alltagshelfer",
    },
    {
        title: "Zeiterfassung",
        description: "Eine App die hilft, Arbeitsstunden nach Projekten zu erfassen, Berichte einzusehen und diese als PDF zu exportieren.",
        glowColor: "teal",
        href: "https://by-dp.de/Zeiterfassung/",
        category: "Alltagshelfer",
    },
    {
        title: "Dienstplan App",
        description: "Erstellen und verwalten Sie Dienstpläne für Erzieher einfach und transparent.",
        href: "https://by-dp.de/kindergarten-dienstplan-app/",
        glowColor: "pink",
        category: "Kindergarten",
    },
    {
        title: "Essensplaner App",
        description: "Als Companion-App für „Stay Informed“ wandelt der Essensplaner die Rückmeldungen aus der Kindergarten-App direkt in übersichtliche Pläne und Listen für das Personal und den Caterer um.",
        href: "https://by-dp.de/kindergarten-essensplaner/",
        glowColor: "lime",
        category: "Kindergarten",
    },
    {
        title: "Kitalytics",
        description: "Erfassen Sie Anwesenheiten, analysieren Sie die Auslastung und optimieren Sie Ihre Planung.",
        href: "https://by-dp.de/Kitalytics/",
        glowColor: "customTeal",
        category: "Kindergarten",
    },
    {
        title: "Erzieher App",
        description: "Ermöglicht Erziehern, pädagogische Angebote zu erstellen und Entwicklungsdokumentationen für ihre Bezugskinder digital auszufüllen, zu verwalten und auszudrucken.",
        href: "https://by-dp.de/erzieher-app/",
        glowColor: "blue",
        status: "In Entwicklung",
        category: "Kindergarten",
    },
    {
        title: "WebApp Sandbox",
        description: "Ein sicherer Ort, um Web-Technologien und APIs zu testen und zu experimentieren.",
        glowColor: "yellow",
        status: "In Entwicklung",
        category: "Tools",
    },
];
