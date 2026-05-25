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
        display: "flex",
        flexDirection: "column",
        background: theme.bg,
        color: theme.text,
        overflow: "hidden",
      }}
    >
      <header
        style={{
          height: 64,
          flexShrink: 0,
          background: theme.surface,
          borderBottom: `1px solid ${theme.border}`,
        }}
      >
        <AppBarMenu />
      </header>

      <div
        style={{
          flex: 1,
          display: "flex",
          minHeight: 0,
        }}
      >
        <AppSidebar />

        <main
          style={{
            flex: 1,
            overflow: "auto",
            background: theme.bg,
            minWidth: 0,
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}