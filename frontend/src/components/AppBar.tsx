import { Menu } from "lucide-react";

export function AppBarMenu({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <div className="h-16 flex items-center justify-between px-4 text-white">

     
      <button
        className="md:hidden"
        onClick={onMenuClick}
      >
        <Menu />
      </button>

      <div className="font-semibold">
        Dashboard
      </div>

    </div>
  );
}