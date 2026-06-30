import { useState } from 'react';
import styled from 'styled-components';
import type { Section } from '../types';
import { saveSection } from '../storage';
import { GlassInput, GlassTextArea, Badge } from '../styles/glass';

const Block = styled.div`
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius);
  margin-bottom: 12px;
  overflow: hidden;
  transition: all 0.25s ease;

  &:hover {
    border-color: var(--glass-border-hover);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  }
`;

const BlockHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  cursor: grab;
  user-select: none;

  &:active {
    cursor: grabbing;
  }
`;

const BlockTitle = styled.input`
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 6px 10px;
  color: var(--text-primary);
  outline: none;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
  }

  &:focus {
    border-color: rgba(108, 92, 231, 0.3);
    background: rgba(108, 92, 231, 0.06);
  }
`;

const MoveBtn = styled.button`
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 6px;
  width: 28px;
  height: 28px;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.1);
    color: var(--text-primary);
  }

  &:disabled {
    opacity: 0.2;
    cursor: not-allowed;
  }
`;

const BlockContent = styled.div`
  padding: 18px;
`;

const ImageInput = styled(GlassInput)`
  margin-top: 12px;
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 200px;
  border-radius: var(--radius-sm);
  margin-top: 12px;
  display: block;
  border: 1px solid var(--glass-border);
`;

interface SectionBlockProps {
  section: Section;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}

export default function SectionBlock({
  section,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: SectionBlockProps) {
  const [title, setTitle] = useState(section.title);
  const [content, setContent] = useState(section.content);
  const [imageUrl, setImageUrl] = useState(section.imageUrl || '');

  const handleBlur = () => {
    saveSection({ ...section, title, content, imageUrl: imageUrl || null });
  };

  const typeVariant = () => {
    switch (section.type) {
      case 'hero': return 'info' as const;
      case 'cta': return 'success' as const;
      case 'footer': return 'default' as const;
      case 'gallery': return 'warning' as const;
      default: return 'default' as const;
    }
  };

  return (
    <Block>
      <BlockHeader>
        <Badge $variant={typeVariant()}>{section.type}</Badge>
        <BlockTitle
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleBlur}
        />
        <MoveBtn onClick={onMoveUp} disabled={isFirst} title="Вверх">
          ↑
        </MoveBtn>
        <MoveBtn onClick={onMoveDown} disabled={isLast} title="Вниз">
          ↓
        </MoveBtn>
      </BlockHeader>
      <BlockContent>
        <GlassTextArea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onBlur={handleBlur}
        />
        {(section.type === 'hero' ||
          section.type === 'image' ||
          section.type === 'gallery') && (
          <>
            <ImageInput
              placeholder="URL изображения"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              onBlur={handleBlur}
            />
            {imageUrl && <ImagePreview src={imageUrl} alt={title} />}
          </>
        )}
      </BlockContent>
    </Block>
  );
}
