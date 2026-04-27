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
      <div className="flex gap-2">
        <Input
          placeholder="Digite uma tag (ex: RPG)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="
    bg-[#121212]
    text-white

    placeholder:text-[#b3b3b3]

    focus:outline-none
    focus:ring-0
  "
        />

        <Button
          type="button"
          onClick={addTag}
          className="
            bg-white
            text-black
            hover:bg-gray-200
            font-medium
          "
        >
          Adicionar
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {value.map((tag) => (
          <div
            key={tag}
            className="
              flex items-center gap-2
              px-3 py-1
              bg-[#121212]
              text-[#b3b3b3]
              text-xs

              hover:bg-white
              hover:text-black
              transition
            "
          >
            <span className="truncate max-w-[120px]">{tag}</span>

            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="opacity-60 hover:opacity-100 transition"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
