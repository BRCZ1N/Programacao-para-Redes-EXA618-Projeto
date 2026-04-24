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
    <div className="flex items-center justify-between group pb-3">

      <div className="flex-1 space-y-1">
        <p className="text-xs text-muted-foreground">{label}</p>

        {editing ? (
          <div className="space-y-2">
            {children}
            <div className="flex gap-2">
              <Button size="sm" onClick={onSave}>
                Salvar
              </Button>
              <Button size="sm" variant="ghost" onClick={onCancel}>
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm font-medium">{value}</p>
        )}
      </div>

      {!hideEdit && !editing && (
        <button
          onClick={onEdit}
          className=" text-sm px-3 py-1 rounded-md hover:bg-muted transition"
        >
          Editar
        </button>
      )}
    </div>
  );
}