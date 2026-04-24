import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { X } from "lucide-react";

type Props = {
  value: string[];
  onChange: (tag: string[]) => void;
};

export function TagsInput({ value, onChange }: Props) {
  const [input, setInput] = useState("");

  function addTag() {
    const formatted = input.trim();

    if (!formatted || value.includes(formatted)) return;

    onChange([...value, formatted]);
    setInput("");
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag));
  }

  return (
    <div className="space-y-3">

      {/* INPUT + BOTÃO */}
      <div className="flex gap-2">
        <Input
          placeholder="Digite uma tag (ex: RPG)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <Button type="button" onClick={addTag}>
          Adicionar
        </Button>
      </div>

      {/* CHIPS */}
      <div className="flex flex-wrap gap-2">
        {value.map((tag) => (
          <div
            key={tag}
            className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-sm"
          >
            <span>{tag}</span>

            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="opacity-70 hover:opacity-100"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}