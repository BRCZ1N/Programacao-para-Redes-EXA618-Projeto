import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
/*import { GamesGrid } from "./pages/GamesGrid";*/
import { PlaylistPage } from "./pages/PlaylistPage";
import { AuthProvider } from "./utils/AuthProvider";
import { GamesGridLegacy } from "./pages/GamesGridLegacy";
import { PrivateRoutes } from "./utils/PrivateRoutes";
import { PublicRoutes } from "./utils/PublicRoutes";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<PublicRoutes />}></Route>
          <Route path="/" element={<Home />} />
          <Route element={<PrivateRoutes />}>
            <Route path="/dashboard" element={<Dashboard />}>
              <Route index element={<GamesGridLegacy />} />
              <Route path="games" element={<GamesGridLegacy />} />
              <Route path="playlist/:id" element={<PlaylistPage />} />
            </Route>
         </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
