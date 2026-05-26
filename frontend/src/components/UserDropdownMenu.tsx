import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

import { Button } from "../components/ui/button";
import { User, Settings, LogOut } from "lucide-react";
import { DialogConfiguration } from "../components/DialogConfiguration";
import { useAuth } from "../utils/AuthProvider";

export function UserDropdownMenu() {
  const [openConfig, setOpenConfig] = useState(false);
  const navigate = useNavigate();
  const { setUser} = useAuth();

  async function handleLogout() {
    try {
      await fetch("https://programacao-para-redes-exa618-projeto.onrender.com/api/auth/logout/", {
        method: "POST",
        credentials: "include",
      });
      navigate("/");
      setUser(null)
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
    }
  }
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              borderColor: "rgba(255,255,255,0.12)",
              background: "#111",
              color: "#fff",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#1A1A1A";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
              e.currentTarget.style.transform = "scale(1.08)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#111";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <User size={18} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          style={{
            background: "#121212",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#fff",
            width: 200,
          }}
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel>Minha conta</DropdownMenuLabel>

            <DropdownMenuItem
              className="flex items-center cursor-pointer text-[#b3b3b3] data-[highlighted]:bg-[#1a1a1a] data-[highlighted]:text-white"
              onClick={() => setOpenConfig(true)}
            >
              <Settings size={14} style={{ marginRight: 8 }} />
              Configurações
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleLogout}
            className="flex items-center cursor-pointer text-[#b3b3b3] data-[highlighted]:bg-[#1a1a1a] data-[highlighted]:text-white"
          >
            <LogOut size={14} className="mr-2" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DialogConfiguration open={openConfig} onOpenChange={setOpenConfig} />
    </>
  );
}
