"use client";

import { useState } from "react";
import { DialogLogin } from "./DialogLogin";
import { DialogSignup } from "./DialogSignup";

export function Header() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);

  return (
    <>
      <header className="w-full border-b border-slate-800 bg-slate-950">
        <div className="max-w-6xl mx-auto px-8 h-16 flex items-center justify-between">

          <div className="font-black text-xl text-white">
            PlaylistDiscovery
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setLoginOpen(true)}
              className="text-sm px-4 py-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800 transition-colors duration-300"
            >
              Login
            </button>

            <button
              onClick={() => setRegisterOpen(true)}
              className="text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300 font-semibold"
            >
              Registro
            </button>
          </div>

        </div>
      </header>

      <DialogLogin open={loginOpen} onOpenChange={setLoginOpen} />
      <DialogSignup open={registerOpen} onOpenChange={setRegisterOpen} />
    </>
  );
}