"use client";

import { useState } from "react";
import { DialogLogin } from "./DialogLogin";
import { DialogSignup } from "./DialogSignup";

export function Header() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <>
      <header className="w-full border-b bg-background">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* LOGO */}
          <div className="font-bold text-lg">
            GameStore
          </div>

          {/* AUTH */}
          <div className="flex items-center gap-2 ">
            <button
              onClick={() => setLoginOpen(true)}
              className="text-sm px-3 py-1 rounded hover:bg-muted transition"
            >
              Login
            </button>

            <button
              onClick={() => setRegisterOpen(true)}
              className="text-sm px-3 py-1 rounded hover:bg-muted transition"
            >
              Register
            </button>
          </div>

        </div>
      </header>

      {/* MODAL */}
      <DialogLogin open={loginOpen} onOpenChange={setLoginOpen} />
      <DialogSignup open={registerOpen} onOpenChange={setRegisterOpen} />
    </>
  );
}