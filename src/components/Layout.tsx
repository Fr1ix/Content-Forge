import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(10, 10, 15, 0.85);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding: 0 24px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Logo = styled(Link)`
  font-size: 20px;
  font-weight: 800;
  text-decoration: none;
  color: var(--text-primary);
  display: flex;
  align-items: center;
  gap: 10px;
  letter-spacing: -0.3px;

  &:hover {
    color: var(--accent-5);
  }
`;

const LogoIcon = styled.span`
  font-size: 22px;
  filter: drop-shadow(0 0 8px rgba(108, 92, 231, 0.3));
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const NavButton = styled(Link)<{ $active?: boolean }>`
  text-decoration: none;
  font-weight: 600;
  font-size: 13px;
  padding: 8px 18px;
  border-radius: 8px;
  background: ${({ $active }) =>
    $active ? 'rgba(108, 92, 231, 0.15)' : 'transparent'};
  color: ${({ $active }) =>
    $active ? 'var(--accent-5)' : 'var(--text-secondary)'};
  border: 1px solid ${({ $active }) =>
    $active ? 'rgba(108, 92, 231, 0.2)' : 'transparent'};
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.06);
    color: var(--text-primary);
  }
`;

const IconButton = styled.button`
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  width: 38px;
  height: 38px;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: var(--text-primary);
    transform: translateY(-1px);
  }
`;

const Main = styled.main`
  flex: 1;
  padding: 32px 24px;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;
`;

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Wrapper>
      <Header>
        <Logo to="/">
          <LogoIcon>⚒️</LogoIcon>
          Content Forge
        </Logo>
        <Nav>
          <NavButton to="/new" $active={location.pathname === '/new'}>
            + Новый проект
          </NavButton>
          <IconButton onClick={() => navigate('/settings')} title="Настройки">
            ⚙️
          </IconButton>
        </Nav>
      </Header>
      <Main>{children}</Main>
    </Wrapper>
  );
}
