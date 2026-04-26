import { Outlet } from "react-router-dom";
import { AppBarMenu } from "../components/AppBarMenu";
import { AppSidebar } from "../components/AppSidebar";

const theme = {
  bg: "#000000",
  surface: "#121212",
  border: "#2A2A2A",
  text: "#FFFFFF",
};

export function Dashboard() {
  return (
    <div
      style={{
        height: "100vh",
        display: "grid",
        gridTemplateRows: "64px 1fr",
        gridTemplateColumns: "260px 1fr",
        gridTemplateAreas: `
          "header header"
          "sidebar content"
        `,
        background: theme.bg,
        color: theme.text,
        overflow: "hidden",
      }}
    >

      <header
        style={{
          gridArea: "header",
          background: theme.surface,
          borderBottom: `1px solid ${theme.border}`,
        }}
      >
        <AppBarMenu />
      </header>

      <aside
        style={{
          gridArea: "sidebar",
          background: theme.surface,
          borderRight: `1px solid ${theme.border}`,
          overflow: "hidden",
        }}
      >
        <AppSidebar />
      </aside>

      <main
        style={{
          gridArea: "content",
          background: theme.bg,
          overflow: "auto",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}