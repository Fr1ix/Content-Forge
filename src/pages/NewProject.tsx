import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useProjects } from '../hooks/useProjects';
import { getSettings } from '../storage';
import {
  PageWrapper,
  PageTitle,
  GlassInput,
  GlassTextArea,
  GlassSelect,
  GlassButton,
  WarningBlock,
  Field,
  Label,
  Hint,
} from '../styles/glass';

const Form = styled.form`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  padding: 32px;
  max-width: 640px;
`;

export default function NewProject() {
  const navigate = useNavigate();
  const { createProject } = useProjects();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [toneOfVoice, setToneOfVoice] = useState('формальный');
  const [prompt, setPrompt] = useState('');

  const settings = getSettings();
  const hasKey = !!settings.openAiKey;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !prompt.trim()) return;
    const project = createProject(
      title.trim(),
      description.trim(),
      toneOfVoice,
      prompt.trim()
    );
    navigate(`/project/${project.id}/generate`);
  };

  return (
    <PageWrapper>
      <PageTitle>Новый проект</PageTitle>

      {!hasKey && (
        <WarningBlock>
          ⚠️ API-ключ OpenAI не настроен.
          <br />
          <span style={{ fontSize: 12, fontWeight: 400 }}>
            Перейдите в настройки и добавьте ключ, иначе генерация не будет работать.
          </span>
        </WarningBlock>
      )}

      <Form onSubmit={handleSubmit}>
        <Field>
          <Label>Название проекта</Label>
          <GlassInput
            placeholder="Например: Лендинг для кофейни"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Field>

        <Field>
          <Label>Описание</Label>
          <GlassInput
            placeholder="Для чего эта страница?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>

        <Field>
          <Label>Tone of Voice</Label>
          <GlassSelect
            value={toneOfVoice}
            onChange={(e) => setToneOfVoice(e.target.value)}
          >
            <option value="формальный">Формальный</option>
            <option value="дружеский">Дружеский</option>
            <option value="продающий">Продающий</option>
            <option value="экспертный">Экспертный</option>
          </GlassSelect>
        </Field>

        <Field>
          <Label>Промпт</Label>
          <GlassTextArea
            placeholder="Опишите, что нужно сгенерировать. Например: Одностраничный сайт для уютной кофейни в центре города. Расскажите о меню, атмосфере и специальных предложениях."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
            style={{ minHeight: 120 }}
          />
          <Hint>Чем подробнее опишете, тем качественнее будет результат</Hint>
        </Field>

        <GlassButton
          type="submit"
          $variant="primary"
          $size="lg"
          disabled={!title.trim() || !prompt.trim()}
        >
          ⚡ Создать и генерировать
        </GlassButton>
      </Form>
    </PageWrapper>
  );
}
