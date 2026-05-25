import { Outlet } from "react-router-dom";
import { AppSidebar } from "../components/AppSidebar";
import { Header } from "../components/Header";

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
      <Header />

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
