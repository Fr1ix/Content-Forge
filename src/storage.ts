import type { Project, Section, UserSettings } from './types';

const PROJECTS_KEY = 'content-forge-projects';
const defaultSettings: UserSettings = {
  openAiKey: '',
  provider: 'demo',
  openAiModel: 'gpt-4o',
  ollamaModel: 'llama3',
  ollamaUrl: 'http://localhost:11434',
  generateImages: false,
};
const SECTIONS_KEY = 'content-forge-sections';
const SETTINGS_KEY = 'content-forge-settings';

export function getProjects(): Project[] {
  try {
    const data = localStorage.getItem(PROJECTS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getProject(id: string): Project | undefined {
  return getProjects().find((p) => p.id === id);
}

export function saveProject(project: Project): void {
  const projects = getProjects();
  const index = projects.findIndex((p) => p.id === project.id);
  if (index >= 0) {
    projects[index] = project;
  } else {
    projects.push(project);
  }
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

export function deleteProject(id: string): void {
  const projects = getProjects().filter((p) => p.id !== id);
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  const sections = getSections().filter((s) => s.projectId !== id);
  localStorage.setItem(SECTIONS_KEY, JSON.stringify(sections));
}

export function getSections(): Section[] {
  try {
    const data = localStorage.getItem(SECTIONS_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function getProjectSections(projectId: string): Section[] {
  return getSections()
    .filter((s) => s.projectId === projectId)
    .sort((a, b) => a.order - b.order);
}

export function saveSection(section: Section): void {
  const sections = getSections();
  const index = sections.findIndex((s) => s.id === section.id);
  if (index >= 0) {
    sections[index] = section;
  } else {
    sections.push(section);
  }
  localStorage.setItem(SECTIONS_KEY, JSON.stringify(sections));
}

export function saveSections(sections: Section[]): void {
  localStorage.setItem(SECTIONS_KEY, JSON.stringify(sections));
}

export function deleteSection(id: string): void {
  const sections = getSections().filter((s) => s.id !== id);
  localStorage.setItem(SECTIONS_KEY, JSON.stringify(sections));
}

export function getSettings(): UserSettings {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    return data
      ? { ...defaultSettings, ...JSON.parse(data) }
      : { ...defaultSettings };
  } catch {
    return { ...defaultSettings };
  }
}

export function saveSettings(settings: UserSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
