// Project Types
export interface Project {
    id: string;
    title: string;
    description: string;
    image: string;
    videoUrl?: string;
    tags: string[];
    demoLink?: string;
    githubLink?: string;
}

export interface ProjectsContent {
    pageTitle: string;
    pageDescription: string;
    projects: Project[];
}

// Home Page Types
export interface Feature {
    icon: string;
    title: string;
    desc: string;
}

export interface HomeContent {
    subtitle: string;
    titleLine1: string;
    titleLine2: string;
    description: string;
    features: Feature[];
}

// About Page Types
export interface SkillCategory {
    name: string;
    icon: string;
    items: string[];
}

export interface AboutContent {
    bio1: string;
    bio2: string;
    yearsExp: string;
    shippedGames: string;
    coffeeConsumed: string;
    skills: SkillCategory[];
}
