import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ParticleBackground from './components/ParticleBackground';
import Dashboard from './pages/Dashboard';
import NewProject from './pages/NewProject';
import Generate from './pages/Generate';
import Editor from './pages/Editor';
import Preview from './pages/Preview';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <ParticleBackground />
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/new" element={<NewProject />} />
          <Route path="/project/:id/generate" element={<Generate />} />
          <Route path="/editor/:id" element={<Editor />} />
          <Route path="/preview/:id" element={<Preview />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
