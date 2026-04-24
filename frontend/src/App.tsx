import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { ForgotPassword } from "./pages/ForgotPassword";
import { Dashboard } from './pages/Dashboard';
import { GamesGrid } from "./pages/GamesGrid";
import { PlaylistGrid } from './pages/PlaylistGrid';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="games" element={<GamesGrid />} />
          <Route path="playlists" element={<PlaylistGrid />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

