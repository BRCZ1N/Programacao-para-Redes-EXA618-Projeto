import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
/*import { GamesGrid } from "./pages/GamesGrid";*/
import { PlaylistPage } from "./pages/PlaylistPage";
import { GamesGridLegacy } from "./pages/GamesGridLegacy";
import { PrivateRoute } from "./components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <PrivateRoute>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<GamesGridLegacy />} />
            <Route path="games" element={<GamesGridLegacy />} />
            <Route path="playlist/:id" element={<PlaylistPage />} />
          </Route>
        </PrivateRoute>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
