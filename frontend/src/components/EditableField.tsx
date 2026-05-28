import { Button } from "./ui/button";

export function EditableField({
  label,
  value,
  editing,
  onEdit,
  onCancel,
  onSave,
  children,
  hideEdit = false,
  canSave = true,
}: any) {
  return (
    <div className="flex items-start justify-between group">
      <div className="flex-1">
        <p className="text-[11px] tracking-widest uppercase text-white/40">
          {label}
        </p>

        {editing ? (
          <div className="space-y-2">
            <div className="[&>*]:h-8 [&>*]:text-sm">{children}</div>

            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={onSave}
                disabled={!canSave}
                className="bg-white text-black hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer h-7 text-xs px-3"
              >
                Salvar
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={onCancel}
                className="text-white/60 hover:text-white hover:bg-[#1A1A1A] transition cursor-pointer h-7 text-xs px-3"
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm font-medium text-white/80">{value}</p>
        )}
      </div>

      {!hideEdit && !editing && (
        <button
          onClick={onEdit}
          className="text-xs px-2 py-0.5 rounded-sm text-white/50 border border-transparent hover:text-white hover:bg-[#1A1A1A] hover:border-[#2A2A2A] transition cursor-pointer"
        >
          Editar
        </button>
      )}
    </div>
  );
}