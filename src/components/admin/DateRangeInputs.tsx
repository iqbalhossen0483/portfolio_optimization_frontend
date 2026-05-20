import { Input } from "@/components/ui/Input";
import { Typography } from "@/components/ui/Typography";

interface DateRangeInputsProps {
  trainStart: string;
  trainEnd: string;
  valStart: string;
  valEnd: string;
  onChange: (field: string, value: string) => void;
}

export function DateRangeInputs({
  trainStart,
  trainEnd,
  valStart,
  valEnd,
  onChange,
}: DateRangeInputsProps) {
  return (
    <div className="flex flex-col gap-3">
      <Typography variant="label">Training Period</Typography>
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Train Start"
          type="date"
          value={trainStart}
          onChange={(e) => onChange("trainStart", e.target.value)}
        />
        <Input
          label="Train End"
          type="date"
          value={trainEnd}
          onChange={(e) => onChange("trainEnd", e.target.value)}
        />
      </div>
      <Typography variant="label">Validation Period</Typography>
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Val Start"
          type="date"
          value={valStart}
          onChange={(e) => onChange("valStart", e.target.value)}
        />
        <Input
          label="Val End"
          type="date"
          value={valEnd}
          onChange={(e) => onChange("valEnd", e.target.value)}
        />
      </div>
    </div>
  );
}
