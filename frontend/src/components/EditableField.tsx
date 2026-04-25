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
}: any) {
  return (
    <div className="flex items-start justify-between group pb-4 border-b border-slate-800/60">

      
      <div className="flex-1 space-y-1">
        <p className="text-xs text-slate-500 uppercase tracking-wide">
          {label}
        </p>

        {editing ? (
          <div className="space-y-3">
            {children}

            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={onSave}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Salvar
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={onCancel}
                className="text-slate-400 hover:text-white hover:bg-slate-900"
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm font-medium text-slate-200">
            {value}
          </p>
        )}
      </div>

      
      {!hideEdit && !editing && (
        <button
          onClick={onEdit}
          className="
            text-sm px-3 py-1 rounded-md
            text-slate-400
            hover:text-white
            hover:bg-slate-900/60
            transition
          "
        >
          Editar
        </button>
      )}
    </div>
  );
}