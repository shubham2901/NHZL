import { Routes, Route } from 'react-router-dom';
import ListPage from './pages/ListPage';
import DetailPage from './pages/DetailPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ListPage />} />
      <Route path="/orphaned" element={<ListPage initialQuickFilter="Orphaned" />} />
      <Route path="/detail/:id" element={<DetailPage />} />
    </Routes>
  );
}
