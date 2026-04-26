import { Button } from "./ui/button";

const theme = {
  text: "#FFFFFF",
  muted: "rgba(255,255,255,0.55)",
  border: "#2A2A2A",
  hover: "#1A1A1A",
  accent: "#FFFFFF",
};

export function EditableField({
  label,
  value,
  editing,
  onEdit,
  onCancel,
  onSave,
  children,
  hideEdit = false,
}: any) {
  return (
    <div className="flex items-start justify-between group pb-4 border-b border-[#2A2A2A]">

      {/* LABEL + VALUE */}
      <div className="flex-1 space-y-1">
        <p className="text-[11px] tracking-widest uppercase text-white/40">
          {label}
        </p>

        {editing ? (
          <div className="space-y-3">
            {children}

            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={onSave}
                className="
                  bg-white text-black
                  hover:bg-white/90
                  transition
                "
              >
                Salvar
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={onCancel}
                className="
                  text-white/60
                  hover:text-white
                  hover:bg-[#1A1A1A]
                  transition
                "
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm font-medium text-white/80">
            {value}
          </p>
        )}
      </div>

      {/* EDIT BUTTON */}
      {!hideEdit && !editing && (
        <button
          onClick={onEdit}
          className="
            text-xs px-3 py-1 rounded-md
            text-white/50
            border border-transparent
            hover:text-white
            hover:bg-[#1A1A1A]
            hover:border-[#2A2A2A]
            transition
          "
        >
          Editar
        </button>
      )}
    </div>
  );
}