import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ProjectCard from '../components/ProjectCard';
import { useProjects } from '../hooks/useProjects';
import {
  PageWrapper,
  PageTitle,
  GlassInput,
  GlassButton,
  EmptyState,
  EmptyTitle,
  EmptyText,
  Grid,
} from '../styles/glass';

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
  gap: 16px;
  flex-wrap: wrap;
`;

const SearchInput = styled(GlassInput)`
  width: 280px;

  @media (max-width: 600px) {
    width: 100%;
  }
`;

const ProjectsCount = styled.p`
  font-size: 14px;
  color: var(--text-muted);
  margin: -16px 0 24px;
`;

export default function Dashboard() {
  const { projects, removeProject } = useProjects();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <PageWrapper>
      <Header>
        <PageTitle>Мои проекты</PageTitle>
        {projects.length > 0 && (
          <SearchInput
            placeholder="Поиск проектов..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        )}
      </Header>

      {projects.length > 0 && (
        <ProjectsCount>
          {filtered.length} из {projects.length} проектов
        </ProjectsCount>
      )}

      {projects.length === 0 ? (
        <EmptyState>
          <EmptyTitle>У вас пока нет проектов</EmptyTitle>
          <EmptyText>
            Создайте первый проект и сгенерируйте контент с помощью AI
          </EmptyText>
          <GlassButton $variant="primary" $size="lg" onClick={() => navigate('/new')}>
            + Создать проект
          </GlassButton>
        </EmptyState>
      ) : filtered.length === 0 ? (
        <EmptyState>
          <EmptyText>Ничего не найдено по запросу "{search}"</EmptyText>
          <GlassButton $variant="secondary" onClick={() => setSearch('')}>
            Сбросить поиск
          </GlassButton>
        </EmptyState>
      ) : (
        <Grid>
          {filtered.map((project, i) => (
            <div
              key={project.id}
              style={{
                animation: `fadeIn 0.5s ease forwards`,
                animationDelay: `${i * 60}ms`,
                opacity: 0,
              }}
            >
              <ProjectCard project={project} onDelete={removeProject} />
            </div>
          ))}
        </Grid>
      )}
    </PageWrapper>
  );
}
