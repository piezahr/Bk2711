import { Project } from "@/types/project";

const STORAGE_KEY = "lovable-book-projects";

export const saveProject = (project: Project): void => {
  try {
    const projects = getAllProjects();
    const existingIndex = projects.findIndex(p => p.id === project.id);
    
    if (existingIndex >= 0) {
      projects[existingIndex] = project;
    } else {
      projects.push(project);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error("Error saving project:", error);
    throw new Error("Projekt konnte nicht gespeichert werden");
  }
};

export const getAllProjects = (): Project[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    
    const projects = JSON.parse(data);
    return projects.map((p: any) => ({
      ...p,
      created: new Date(p.created),
      lastModified: new Date(p.lastModified)
    }));
  } catch (error) {
    console.error("Error loading projects:", error);
    return [];
  }
};

export const getProject = (id: string): Project | null => {
  const projects = getAllProjects();
  return projects.find(p => p.id === id) || null;
};

export const deleteProject = (id: string): void => {
  try {
    const projects = getAllProjects();
    const filtered = projects.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error deleting project:", error);
    throw new Error("Projekt konnte nicht gelöscht werden");
  }
};
