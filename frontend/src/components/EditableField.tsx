import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

type EditableFieldProps = {
  label: string;
  field: string;
  value: string;
  form: any;
  setForm: (value: any) => void;
  onSave: (field: string, value: string) => Promise<void> | void;
  type?: string;
  hideEdit?: boolean;
};

export function EditableField({
  label,
  field,
  value,
  form,
  setForm,
  onSave,
  type = "text",
  hideEdit = false,
}: EditableFieldProps) {
  const [editing, setEditing] = useState(false);

  function handleCancel() {
    setEditing(false);
  }

  async function handleSave() {
    await onSave(field, form[field]);
    setEditing(false);
  }

  return (
    <div className="flex items-start justify-between group">
      <div className="flex-1">
        <p className="text-[11px] tracking-widest uppercase text-white/40">
          {label}
        </p>

        {editing ? (
          <div className="space-y-2 mt-1">
            <Input
              type={type}
              value={form[field]}
              onChange={(e) =>
                setForm({ ...form, [field]: e.target.value })
              }
              className="
                bg-[#121212] border border-[#2A2A2A]
                text-white placeholder:text-white/30
                hover:bg-[#161616] focus:bg-[#161616]
                focus:border-[#3A3A3A] focus:ring-0
                transition rounded-md h-8 text-sm
              "
            />

            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleSave}
                className="
                  bg-white text-black
                  hover:bg-white/90
                  transition
                  cursor-pointer
                  h-7 text-xs px-3
                "
              >
                Salvar
              </Button>

              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancel}
                className="
                  text-white/60
                  hover:text-white
                  hover:bg-[#1A1A1A]
                  transition
                  cursor-pointer
                  h-7 text-xs px-3
                "
              >
                Cancelar
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-sm font-medium text-white/80 mt-1">
            {value}
          </p>
        )}
      </div>

      {!hideEdit && !editing && (
        <button
          onClick={() => setEditing(true)}
          className="
            text-xs px-2 py-0.5 rounded-sm
            text-white/50
            border border-transparent
            hover:text-white
            hover:bg-[#1A1A1A]
            hover:border-[#2A2A2A]
            transition
            cursor-pointer
          "
        >
          Editar
        </button>
      )}
    </div>
  );
}