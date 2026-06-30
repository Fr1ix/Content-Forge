import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useProjects } from '../hooks/useProjects';
import { useGeneration } from '../hooks/useGeneration';
import { getSettings } from '../storage';
import {
  PageWrapper,
  GlassButton,
  ErrorBlock,
  Spinner,
  ProgressBar,
  ProgressFill,
} from '../styles/glass';

const Container = styled.div`
  text-align: center;
  padding: 60px 32px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  max-width: 540px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--accent-1), transparent);
    opacity: 0.5;
  }
`;

const Title = styled.h1`
  font-size: 26px;
  font-weight: 800;
  margin: 0 0 8px;
  color: var(--text-primary);
  letter-spacing: -0.5px;
`;

const Subtitle = styled.p`
  font-size: 15px;
  color: var(--text-secondary);
  margin: 0 0 40px;
`;

const ProgressText = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  margin: 16px 0 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 24px;
`;

export default function Generate() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProjectById } = useProjects();
  const { loading, error, progress, generate, setError } = useGeneration();
  const project = id ? getProjectById(id) : undefined;

  useEffect(() => {
    if (!project || project.status === 'complete') return;

    if (project.status === 'draft' && !loading) {
      const settings = getSettings();
      generate(project, project.toneOfVoice, settings.generateImages);
    }
  }, [project?.id]);

  if (!project) {
    return (
      <PageWrapper>
        <Container>
          <Title>Проект не найден</Title>
          <Subtitle>Возможно, он был удалён</Subtitle>
          <GlassButton $variant="primary" onClick={() => navigate('/')}>
            На дашборд
          </GlassButton>
        </Container>
      </PageWrapper>
    );
  }

  if (project.status === 'complete') {
    return (
      <PageWrapper>
        <Container>
          <Title>✅ Готово!</Title>
          <Subtitle>Контент для «{project.title}» сгенерирован</Subtitle>
          <ButtonGroup>
            <GlassButton $variant="primary" $size="lg" onClick={() => navigate(`/editor/${project.id}`)}>
              ✏️ Открыть редактор
            </GlassButton>
            <GlassButton $variant="secondary" onClick={() => navigate('/')}>
              На дашборд
            </GlassButton>
          </ButtonGroup>
        </Container>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Container>
        <Title>⚒️ Генерация контента</Title>
        <Subtitle>«{project.title}»</Subtitle>

        {error && (
          <>
            <ErrorBlock>
              ❌ {error}
            </ErrorBlock>
            <ButtonGroup>
              <GlassButton
                $variant="primary"
                onClick={() => {
                  setError(null);
                  const settings = getSettings();
                  generate(project, project.toneOfVoice, settings.generateImages);
                }}
              >
                🔄 Повторить
              </GlassButton>
              <GlassButton $variant="secondary" onClick={() => navigate(`/editor/${project.id}`)}>
                ✏️ Редактор (пустой)
              </GlassButton>
              <GlassButton $variant="ghost" onClick={() => navigate('/')}>
                На дашборд
              </GlassButton>
            </ButtonGroup>
          </>
        )}

        {!error && (
          <>
            <Spinner $size={52} style={{ margin: '0 auto 24px' }} />
            <ProgressBar style={{ maxWidth: 320, margin: '0 auto' }}>
              <ProgressFill $progress={progress} />
            </ProgressBar>
            <ProgressText>
              {progress < 10
                ? 'Подготовка...'
                : progress < 50
                  ? 'Генерирую структуру...'
                  : progress < 90
                    ? 'Создаю секции...'
                    : 'Финализация...'}
            </ProgressText>
            <GlassButton $variant="ghost" onClick={() => navigate('/')} style={{ marginTop: 24 }}>
              Отмена
            </GlassButton>
          </>
        )}
      </Container>
    </PageWrapper>
  );
}
