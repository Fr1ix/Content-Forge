import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Project } from '../types';
import {
  getProjects,
  getProject,
  saveProject,
  deleteProject,
} from '../storage';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(() => getProjects());

  const refresh = useCallback(() => {
    setProjects(getProjects());
  }, []);

  const createProject = useCallback(
    (
      title: string,
      description: string,
      toneOfVoice: string,
      prompt: string
    ): Project => {
      const now = new Date().toISOString();
      const project: Project = {
        id: uuidv4(),
        title,
        description,
        toneOfVoice,
        status: 'draft',
        prompt,
        createdAt: now,
        updatedAt: now,
      };
      saveProject(project);
      setProjects(getProjects());
      return project;
    },
    []
  );

  const updateProject = useCallback((project: Project) => {
    saveProject({ ...project, updatedAt: new Date().toISOString() });
    setProjects(getProjects());
  }, []);

  const removeProject = useCallback((id: string) => {
    deleteProject(id);
    setProjects(getProjects());
  }, []);

  const getProjectById = useCallback((id: string): Project | undefined => {
    return getProject(id);
  }, []);

  return {
    projects,
    createProject,
    updateProject,
    removeProject,
    getProjectById,
    refresh,
  };
}
