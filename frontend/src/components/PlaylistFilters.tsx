import { SliderBlock } from "./SliderBlock";
import { TagsInput } from "./TagsInput";

type FormType = {
  tag: string[];
  rating: number[];
  price: number[];
  reviews: number[];
};

type Props = {
  form: FormType;
  setForm: React.Dispatch<React.SetStateAction<any>>;
};

export function PlaylistFilters({ form, setForm }: Props) {
  return (
    <div className="space-y-5">
      <h3 className="text-sm font-medium">Filtros</h3>

      <TagsInput
        value={form.tag}
        onChange={(tag) =>
          setForm((prev: any) => ({
            ...prev,
            tag,
          }))
        }
      />

      <SliderBlock
        label="Rating mínimo"
        value={form.rating}
        onChange={(value) =>
          setForm((prev: any) => ({ ...prev, rating: value }))
        }
        min={0}
        max={10}
      />

      <SliderBlock
        label="Preço mínimo"
        value={form.price}
        onChange={(value) =>
          setForm((prev: any) => ({ ...prev, price: value }))
        }
        min={0}
        max={1000}
        step={1}
        prefix="R$"
      />
      <SliderBlock
        label="Reviews mínimo"
        value={form.reviews}
        onChange={(value) =>
          setForm((prev: any) => ({ ...prev, reviews: value }))
        }
        min={0}
        max={100000}
        step={1}
      />
    </div>
  );
}
