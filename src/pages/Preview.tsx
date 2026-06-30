import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PreviewRenderer from '../components/PreviewRenderer';
import { useProjects } from '../hooks/useProjects';
import { getProjectSections } from '../storage';
import { GlassButton, PageWrapper } from '../styles/glass';
import type { Section } from '../types';

const Container = styled.div`
  padding: 0;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 12px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 800;
  margin: 0;
  color: var(--text-primary);
  letter-spacing: -0.5px;
`;

const LoadingState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: var(--text-muted);
`;

export default function Preview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getProjectById } = useProjects();
  const project = id ? getProjectById(id) : undefined;
  const [sections, setSections] = useState<Section[]>([]);

  useEffect(() => {
    if (id) {
      setSections(getProjectSections(id));
    }
  }, [id]);

  if (!project) {
    return (
      <PageWrapper>
        <LoadingState>Проект не найден</LoadingState>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <Container>
        <TopBar>
          <Title>👁️ Превью: {project.title}</Title>
          <GlassButton $variant="ghost" onClick={() => navigate(`/editor/${project.id}`)}>
            ← Назад в редактор
          </GlassButton>
        </TopBar>
        <PreviewRenderer sections={sections} />
      </Container>
    </PageWrapper>
  );
}
