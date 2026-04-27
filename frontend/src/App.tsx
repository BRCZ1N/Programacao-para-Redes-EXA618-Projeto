import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { GamesGrid } from "./pages/GamesGrid";
import { PlaylistPage } from "./pages/PlaylistPage";
import { AuthProvider } from "./utils/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="games" element={<GamesGrid />} />
            <Route path="playlist/:id" element={<PlaylistPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
