import styled, { keyframes, css } from 'styled-components';

/* ─── Keyframes ─── */
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
`;

/* ─── Glass Container ─── */
export const GlassContainer = styled.div<{ $delay?: number }>`
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  animation: ${fadeIn} 0.5s ease forwards;
  animation-delay: ${({ $delay }) => $delay ?? 0}ms;
  opacity: 0;
  transition: all 0.25s ease;

  &:hover {
    border-color: var(--glass-border-hover);
    box-shadow: var(--shadow-lg);
  }
`;

/* ─── Glass Card ─── */
export const GlassCard = styled.div<{ $delay?: number; $hover?: boolean }>`
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  animation: ${fadeIn} 0.5s ease forwards;
  animation-delay: ${({ $delay }) => $delay ?? 0}ms;
  opacity: 0;
  padding: 24px;
  transition: all 0.3s ease;

  ${({ $hover }) =>
    $hover !== false &&
    css`
      cursor: pointer;
      &:hover {
        transform: translateY(-2px);
        border-color: var(--glass-border-hover);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
      }
    `}
`;

/* ─── Glass Button ─── */
export const GlassButton = styled.button<{
  $variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  $size?: 'sm' | 'md' | 'lg';
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-sm);
  font-weight: 600;
  letter-spacing: 0.01em;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  white-space: nowrap;
  position: relative;
  overflow: hidden;

  ${({ $size = 'md' }) =>
    $size === 'sm'
      ? css`padding: 8px 16px; font-size: 13px;`
      : $size === 'lg'
        ? css`padding: 14px 32px; font-size: 16px;`
        : css`padding: 10px 22px; font-size: 14px;`}

  ${({ $variant = 'primary' }) => {
    switch ($variant) {
      case 'primary':
        return css`
          background: linear-gradient(135deg, var(--accent-1), var(--accent-5));
          color: #fff;
          border-color: transparent;
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(108, 92, 231, 0.3);
          }
          &:active { transform: translateY(0); }
        `;
      case 'secondary':
        return css`
          background: rgba(255, 255, 255, 0.04);
          color: var(--text-primary);
          &:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: translateY(-2px);
            border-color: var(--glass-border-hover);
          }
        `;
      case 'danger':
        return css`
          background: rgba(225, 112, 85, 0.15);
          color: var(--danger);
          border-color: rgba(225, 112, 85, 0.2);
          &:hover {
            background: rgba(225, 112, 85, 0.25);
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(225, 112, 85, 0.2);
          }
        `;
      case 'ghost':
        return css`
          background: transparent;
          color: var(--text-secondary);
          border-color: transparent;
          &:hover {
            background: rgba(255, 255, 255, 0.06);
            color: var(--text-primary);
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%);
    background-size: 200% 100%;
    animation: ${shimmer} 3s infinite;
    pointer-events: none;
  }
`;

/* ─── Glass Input ─── */
export const GlassInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: 15px;
  transition: all 0.2s ease;
  outline: none;

  &::placeholder {
    color: var(--text-muted);
  }

  &:focus {
    border-color: var(--accent-1);
    background: rgba(108, 92, 231, 0.08);
    box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.12);
  }
`;

export const GlassTextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: 15px;
  font-family: inherit;
  transition: all 0.2s ease;
  outline: none;
  resize: vertical;
  min-height: 100px;

  &::placeholder {
    color: var(--text-muted);
  }

  &:focus {
    border-color: var(--accent-1);
    background: rgba(108, 92, 231, 0.08);
    box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.12);
  }
`;

export const GlassSelect = styled.select`
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
  outline: none;
  appearance: none;

  &:focus {
    border-color: var(--accent-1);
    box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.12);
  }

  option {
    background: var(--bg-secondary);
    color: var(--text-primary);
  }
`;

/* ─── Title Styles ─── */
export const PageTitle = styled.h1`
  font-size: 32px;
  font-weight: 800;
  margin: 0 0 24px;
  background: linear-gradient(135deg, var(--text-primary) 30%, var(--accent-5) 70%, var(--accent-2) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;
`;

export const SectionTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 8px;
  letter-spacing: -0.3px;
`;

export const Label = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-secondary);
  margin-bottom: 8px;
`;

/* ─── Badge ─── */
export const Badge = styled.span<{ $variant?: 'success' | 'warning' | 'info' | 'default' }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  border: 1px solid var(--glass-border);

  ${({ $variant = 'default' }) => {
    switch ($variant) {
      case 'success':
        return css`
          background: rgba(0, 184, 148, 0.12);
          color: var(--success);
          border-color: rgba(0, 184, 148, 0.2);
        `;
      case 'warning':
        return css`
          background: rgba(253, 203, 110, 0.12);
          color: var(--warning);
          border-color: rgba(253, 203, 110, 0.2);
        `;
      case 'info':
        return css`
          background: rgba(108, 92, 231, 0.12);
          color: var(--accent-5);
          border-color: rgba(108, 92, 231, 0.2);
        `;
      default:
        return css`
          background: rgba(255, 255, 255, 0.04);
          color: var(--text-secondary);
        `;
    }
  }}
`;

/* ─── Message blocks ─── */
export const ErrorBlock = styled.div`
  background: rgba(225, 112, 85, 0.12);
  border: 1px solid rgba(225, 112, 85, 0.2);
  border-radius: var(--radius-sm);
  color: var(--danger);
  padding: 14px 18px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 16px;
`;

export const SuccessBlock = styled.div`
  background: rgba(0, 184, 148, 0.12);
  border: 1px solid rgba(0, 184, 148, 0.2);
  border-radius: var(--radius-sm);
  color: var(--success);
  padding: 14px 18px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 16px;
`;

export const WarningBlock = styled.div`
  background: rgba(253, 203, 110, 0.12);
  border: 1px solid rgba(253, 203, 110, 0.2);
  border-radius: var(--radius-sm);
  color: var(--warning);
  padding: 14px 18px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 16px;
`;

/* ─── Empty state ─── */
export const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius);
`;

export const EmptyTitle = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 8px;
`;

export const EmptyText = styled.p`
  font-size: 15px;
  color: var(--text-secondary);
  margin: 0 0 24px;
  line-height: 1.6;
`;

/* ─── Animated background particles ─── */
export const ParticlesBg = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
`;

export const Particle = styled.div<{ $size: number; $x: number; $y: number; $delay: number; $duration: number }>`
  position: absolute;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  left: ${({ $x }) => $x}%;
  top: ${({ $y }) => $y}%;
  border-radius: 50%;
  background: radial-gradient(circle at center, rgba(108, 92, 231, 0.15), transparent);
  animation: ${float} ${({ $duration }) => $duration}s ease-in-out infinite;
  animation-delay: ${({ $delay }) => $delay}s;
`;

/* ─── Spinner ─── */
export const Spinner = styled.div<{ $size?: number }>`
  width: ${({ $size }) => $size ?? 48}px;
  height: ${({ $size }) => $size ?? 48}px;
  border: 2px solid rgba(255, 255, 255, 0.06);
  border-top-color: var(--accent-1);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
`;

/* ─── Progress ─── */
export const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 2px;
  overflow: hidden;
  margin: 12px 0;
`;

export const ProgressFill = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${({ $progress }) => $progress}%;
  background: linear-gradient(90deg, var(--accent-1), var(--accent-2));
  border-radius: 2px;
  transition: width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
`;

/* ─── Form layout ─── */
export const Field = styled.div`
  margin-bottom: 20px;
`;

export const Hint = styled.p`
  font-size: 12px;
  color: var(--text-muted);
  margin: 6px 0 0;
  line-height: 1.4;
`;

/* ─── Page wrapper ─── */
export const PageWrapper = styled.div`
  animation: ${fadeIn} 0.4s ease forwards;
  max-width: 1200px;
  margin: 0 auto;
`;

/* ─── Grid ─── */
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
`;
