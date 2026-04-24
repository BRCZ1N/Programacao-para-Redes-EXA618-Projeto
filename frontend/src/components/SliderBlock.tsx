import { Label } from "./ui/label";
import { Slider } from "./ui/slider";

type Props = {
  label: string;
  value: number[];
  onChange: (value: number[]) => void;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
};

export function SliderBlock({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  prefix = "",
}: Props) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <Label>{label}</Label>
        <span className="text-sm text-muted-foreground">
          {prefix} {value[0]}
        </span>
      </div>

      <Slider
        value={value}
        onValueChange={onChange}
        min={min}
        max={max}
        step={step}
      />
    </div>
  );
}