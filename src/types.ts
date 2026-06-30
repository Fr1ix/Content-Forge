export interface Project {
  id: string;
  title: string;
  description: string;
  toneOfVoice: string;
  status: 'draft' | 'generating' | 'complete';
  prompt: string;
  createdAt: string;
  updatedAt: string;
}

export type SectionType = 'hero' | 'text' | 'image' | 'gallery' | 'cta' | 'footer';

export interface Section {
  id: string;
  projectId: string;
  type: SectionType;
  title: string;
  content: string;
  imageUrl: string | null;
  order: number;
}

export type Provider = 'openai' | 'ollama' | 'demo';
export type OpenAiModel = 'gpt-4o' | 'gpt-3.5-turbo';

export interface UserSettings {
  openAiKey: string;
  provider: Provider;
  openAiModel: OpenAiModel;
  ollamaModel: string;
  ollamaUrl: string;
  generateImages: boolean;
}

export interface GeneratedSection {
  type: SectionType;
  title: string;
  content: string;
}
