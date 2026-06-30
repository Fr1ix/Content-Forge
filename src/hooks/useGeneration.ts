import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Section, GeneratedSection, Project } from '../types';
import { getSettings } from '../storage';
import * as openai from '../api/openai';
import * as ollama from '../api/ollama';
import * as demo from '../api/demo';
import { saveSection, saveProject } from '../storage';

function getProvider() {
  const settings = getSettings();
  switch (settings.provider) {
    case 'openai':
      return { generate: openai.generateContent, generateImage: openai.generateImage };
    case 'ollama':
      return { generate: ollama.generateContent, generateImage: null };
    case 'demo':
      return { generate: demo.generateContent, generateImage: demo.generateImage };
    default:
      return { generate: demo.generateContent, generateImage: demo.generateImage };
  }
}

export function useGeneration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const generate = useCallback(
    async (
      project: Project,
      toneOfVoice: string,
      generateImagesEnabled: boolean
    ) => {
      setLoading(true);
      setError(null);
      setProgress(0);

      try {
        project.status = 'generating';
        saveProject(project);
        setProgress(10);

        const provider = getProvider();
        const result = await provider.generate(project.prompt, toneOfVoice);
        setProgress(50);

        if (
          !result.sections ||
          !Array.isArray(result.sections) ||
          result.sections.length === 0
        ) {
          throw new Error('Провайдер вернул пустой ответ. Попробуйте изменить промпт.');
        }

        const sections: Section[] = [];

        for (let i = 0; i < result.sections.length; i++) {
          const gs: GeneratedSection = result.sections[i];
          let imageUrl: string | null = null;

          if (
            generateImagesEnabled &&
            provider.generateImage &&
            (gs.type === 'hero' || gs.type === 'image' || gs.type === 'gallery')
          ) {
            try {
              const imgPrompt = `Сайт: ${project.title}. Секция: ${gs.title}. ${gs.content.slice(0, 200)}`;
              imageUrl = await provider.generateImage(imgPrompt);
            } catch {
              // image generation is optional
            }
          }

          sections.push({
            id: uuidv4(),
            projectId: project.id,
            type: gs.type,
            title: gs.title,
            content: gs.content,
            imageUrl,
            order: i,
          });

          setProgress(50 + Math.round(((i + 1) / result.sections.length) * 40));
        }

        for (const section of sections) {
          saveSection(section);
        }

        project.status = 'complete';
        saveProject(project);
        setProgress(100);
      } catch (err: any) {
        const message = err?.message || 'Произошла ошибка при генерации';
        setError(message);
        project.status = 'draft';
        saveProject(project);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { loading, error, progress, generate, setError };
}
