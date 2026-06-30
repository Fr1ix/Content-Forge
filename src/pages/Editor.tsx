import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import SectionBlock from '../components/SectionBlock';
import { useProjects } from '../hooks/useProjects';
import { getProjectSections, saveSections } from '../storage';
import { GlassButton, EmptyState, EmptyText, PageWrapper } from '../styles/glass';
import type { Section } from '../types';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
`;

const Title = styled.h1`
  font-size: 26px;
  font-weight: 800;
  margin: 0;
  color: var(--text-primary);
  letter-spacing: -0.5px;
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const SectionsList = styled.div`
  margin-top: 8px;
`;

export default function Editor() {
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
        <Container>
          <EmptyState>
            <EmptyText>Проект не найден</EmptyText>
            <GlassButton $variant="primary" onClick={() => navigate('/')}>
              На дашборд
            </GlassButton>
          </EmptyState>
        </Container>
      </PageWrapper>
    );
  }

  const moveUp = (index: number) => {
    if (index === 0) return;
    const updated = [...sections];
    const temp = updated[index];
    updated[index] = { ...updated[index - 1], order: index };
    updated[index - 1] = { ...temp, order: index - 1 };
    updated.sort((a, b) => a.order - b.order);
    setSections(updated);
    saveSections(updated);
  };

  const moveDown = (index: number) => {
    if (index === sections.length - 1) return;
    const updated = [...sections];
    const temp = updated[index];
    updated[index] = { ...updated[index + 1], order: index };
    updated[index + 1] = { ...temp, order: index + 1 };
    updated.sort((a, b) => a.order - b.order);
    setSections(updated);
    saveSections(updated);
  };

  const exportHtml = () => {
    let html = `<!DOCTYPE html><html lang="ru"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"><title>${project.title}</title><style>body{font-family:system-ui,sans-serif;margin:0;padding:0;background:#0a0a0f;color:#fff}.section{padding:40px 32px;max-width:900px;margin:0 auto;background:rgba(255,255,255,0.03);backdrop-filter:blur(24px);border-bottom:1px solid rgba(255,255,255,0.04)}.hero{text-align:center;padding:80px 40px;background:radial-gradient(ellipse at 50% 0%,rgba(108,92,231,0.1),transparent 70%)}.hero h1{font-size:56px;font-weight:900;margin:0 0 20px;background:linear-gradient(135deg,#fff 30%,#a29bfe 70%,#00cec9 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}.cta{text-align:center;background:linear-gradient(135deg,rgba(108,92,231,0.08),rgba(0,206,201,0.08))}.cta-btn{display:inline-block;padding:16px 48px;background:linear-gradient(135deg,#6c5ce7,#a29bfe);color:#fff;font-size:16px;font-weight:700;border-radius:8px;margin-top:20px;text-decoration:none}.footer{text-align:center;color:rgba(255,255,255,0.35);font-size:14px}.section-title{font-size:28px;font-weight:800;margin:0 0 16px;color:#fff}.section-content{font-size:16px;line-height:1.8;color:rgba(255,255,255,0.65)}.section-content p{margin:0 0 12px}img{max-width:100%;border-radius:8px;margin-top:20px;border:1px solid rgba(255,255,255,0.08)}</style></head><body>`;

    for (const section of sections) {
      const cls =
        section.type === 'hero'
          ? 'section hero'
          : section.type === 'cta'
            ? 'section cta'
            : section.type === 'footer'
              ? 'section footer'
              : 'section';
      html += `<div class="${cls}">`;
      if (section.type !== 'footer') {
        html += `<h2 class="section-title">${section.title}</h2>`;
      }
      html += `<div class="section-content">${section.content}</div>`;
      if (section.imageUrl) {
        html += `<img src="${section.imageUrl}" alt="${section.title}" />`;
      }
      if (section.type === 'cta') {
        html += `<a href="#" class="cta-btn">${section.title}</a>`;
      }
      html += `</div>`;
    }

    html += `</body></html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PageWrapper>
      <Container>
        <Header>
          <Title>✏️ {project.title}</Title>
          <Actions>
            <GlassButton $variant="secondary" $size="sm" onClick={() => navigate(`/preview/${project.id}`)}>
              👁️ Превью
            </GlassButton>
            <GlassButton $variant="primary" $size="sm" onClick={exportHtml}>
              📦 Экспорт HTML
            </GlassButton>
            <GlassButton $variant="ghost" $size="sm" onClick={() => navigate('/')}>
              ← Назад
            </GlassButton>
          </Actions>
        </Header>

        {sections.length === 0 ? (
          <EmptyState>
            <EmptyText>У этого проекта пока нет секций</EmptyText>
            <GlassButton $variant="primary" onClick={() => navigate(`/project/${project.id}/generate`)}>
              ⚡ Сгенерировать контент
            </GlassButton>
          </EmptyState>
        ) : (
          <SectionsList>
            {sections.map((section, index) => (
              <SectionBlock
                key={section.id}
                section={section}
                onMoveUp={() => moveUp(index)}
                onMoveDown={() => moveDown(index)}
                isFirst={index === 0}
                isLast={index === sections.length - 1}
              />
            ))}
          </SectionsList>
        )}
      </Container>
    </PageWrapper>
  );
}
