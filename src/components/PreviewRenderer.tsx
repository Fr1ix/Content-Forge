import styled from 'styled-components';
import type { Section } from '../types';

const Page = styled.div`
  max-width: 900px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  box-shadow: 0 16px 64px rgba(0, 0, 0, 0.3);
  overflow: hidden;
`;

const SectionBlock = styled.section<{ $inverted?: boolean }>`
  padding: 48px 40px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  background: ${({ $inverted }) =>
    $inverted ? 'rgba(108, 92, 231, 0.04)' : 'transparent'};

  &:last-child {
    border-bottom: none;
  }
`;

const HeroBlock = styled(SectionBlock)`
  text-align: center;
  padding: 80px 40px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 50% 0%, rgba(108, 92, 231, 0.1), transparent 70%);
    pointer-events: none;
  }
`;

const HeroTitle = styled.h1`
  font-size: 56px;
  font-weight: 900;
  margin: 0 0 20px;
  background: linear-gradient(135deg, #fff 30%, var(--accent-5) 70%, var(--accent-2) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -2px;
  line-height: 1.1;
  position: relative;
`;

const CtaBlock = styled(SectionBlock)`
  text-align: center;
  background: linear-gradient(135deg, rgba(108, 92, 231, 0.08), rgba(0, 206, 201, 0.08));
`;

const CtaButton = styled.div`
  display: inline-block;
  padding: 16px 48px;
  background: linear-gradient(135deg, var(--accent-1), var(--accent-5));
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  border-radius: var(--radius-sm);
  margin-top: 20px;
  transition: all 0.3s ease;
  cursor: default;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(108, 92, 231, 0.3);
  }
`;

const FooterBlock = styled(SectionBlock)`
  text-align: center;
  font-size: 14px;
  color: var(--text-muted);
`;

const TextContent = styled.div`
  font-size: 16px;
  line-height: 1.8;
  color: var(--text-secondary);

  p {
    margin: 0 0 12px;

    &:last-child {
      margin: 0;
    }
  }
`;

const SectionTitle = styled.h2`
  font-size: 28px;
  font-weight: 800;
  margin: 0 0 16px;
  color: var(--text-primary);
  letter-spacing: -0.5px;
`;

const Image = styled.img`
  max-width: 100%;
  border-radius: var(--radius-sm);
  margin-top: 20px;
  border: 1px solid var(--glass-border);
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 20px;
`;

const GalleryImage = styled.img`
  width: 100%;
  border-radius: var(--radius-sm);
  border: 1px solid var(--glass-border);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.02);
    border-color: var(--accent-1);
  }
`;

interface PreviewRendererProps {
  sections: Section[];
}

export default function PreviewRenderer({ sections }: PreviewRendererProps) {
  if (sections.length === 0) {
    return (
      <Page style={{ padding: '40px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', margin: 0 }}>Нет секций для отображения</p>
      </Page>
    );
  }

  return (
    <Page>
      {sections.map((section, i) => {
        switch (section.type) {
          case 'hero':
            return (
              <HeroBlock key={section.id}>
                <HeroTitle>{section.title}</HeroTitle>
                <TextContent
                  style={{ maxWidth: 700, margin: '0 auto' }}
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
                {section.imageUrl && (
                  <Image src={section.imageUrl} alt={section.title} />
                )}
              </HeroBlock>
            );
          case 'cta':
            return (
              <CtaBlock key={section.id}>
                <SectionTitle>{section.title}</SectionTitle>
                <TextContent
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
                <CtaButton>{section.title}</CtaButton>
              </CtaBlock>
            );
          case 'footer':
            return (
              <FooterBlock key={section.id}>
                <TextContent
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </FooterBlock>
            );
          case 'gallery':
            return (
              <SectionBlock key={section.id} $inverted={i % 2 === 0}>
                <SectionTitle>{section.title}</SectionTitle>
                <TextContent
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
                <GalleryGrid>
                  {section.imageUrl && (
                    <>
                      <GalleryImage src={section.imageUrl} alt="" />
                      <GalleryImage src={section.imageUrl} alt="" />
                      <GalleryImage src={section.imageUrl} alt="" />
                    </>
                  )}
                </GalleryGrid>
              </SectionBlock>
            );
          case 'image':
            return (
              <SectionBlock key={section.id} $inverted={i % 2 === 0}>
                <SectionTitle>{section.title}</SectionTitle>
                {section.imageUrl && (
                  <Image src={section.imageUrl} alt={section.title} />
                )}
                <TextContent
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </SectionBlock>
            );
          default:
            return (
              <SectionBlock key={section.id} $inverted={i % 2 === 0}>
                <SectionTitle>{section.title}</SectionTitle>
                <TextContent
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </SectionBlock>
            );
        }
      })}
    </Page>
  );
}
