import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import type { Project } from '../types';
import { GlassCard, Badge } from '../styles/glass';

const CardBody = styled(GlassCard)`
  display: flex;
  flex-direction: column;
  gap: 12px;
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
    opacity: 0.4;
  }
`;

const Title = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  letter-spacing: -0.3px;
`;

const Description = styled.p`
  font-size: 14px;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: auto;
`;

const DateText = styled.span`
  font-size: 12px;
  color: var(--text-muted);
`;

const DeleteBtn = styled.button`
  background: rgba(225, 112, 85, 0.1);
  border: 1px solid rgba(225, 112, 85, 0.15);
  border-radius: 6px;
  width: 30px;
  height: 30px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--danger);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(225, 112, 85, 0.2);
    transform: scale(1.05);
  }
`;

interface ProjectCardProps {
  project: Project;
  onDelete: (id: string) => void;
}

export default function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (project.status === 'complete') {
      navigate(`/editor/${project.id}`);
    } else {
      navigate(`/project/${project.id}/generate`);
    }
  };

  const statusBadge = () => {
    switch (project.status) {
      case 'draft':
        return { label: 'Черновик', variant: 'default' as const };
      case 'generating':
        return { label: 'Генерация...', variant: 'warning' as const };
      case 'complete':
        return { label: 'Готов', variant: 'success' as const };
    }
  };

  const badge = statusBadge();

  return (
    <CardBody onClick={handleClick} $delay={0}>
      <Title>{project.title}</Title>
      <Description>{project.description}</Description>
      <Meta>
        <Badge $variant={badge.variant}>{badge.label}</Badge>
        <DateText>{new Date(project.createdAt).toLocaleDateString('ru')}</DateText>
        <DeleteBtn
          onClick={(e) => {
            e.stopPropagation();
            if (confirm('Удалить проект?')) onDelete(project.id);
          }}
        >
          ✕
        </DeleteBtn>
      </Meta>
    </CardBody>
  );
}
