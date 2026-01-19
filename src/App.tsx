import { Routes, Route } from 'react-router-dom';
import { HomePage } from './components/HomePage';
import { AboutPage } from './components/AboutPage';
import { EmbedPage } from './components/EmbedPage';
import { EmbedGeneratorPage } from './components/EmbedGeneratorPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/widget" element={<EmbedPage />} />
      <Route path="/embed" element={<EmbedGeneratorPage />} />
      <Route path="/meet/:cities/:hours/:duration/:date" element={<HomePage />} />
    </Routes>
  );
}

export default App;
