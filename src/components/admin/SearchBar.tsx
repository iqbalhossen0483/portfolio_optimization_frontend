import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search…" }: SearchBarProps) {
  return (
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      leadingIcon={<Search className="w-4 h-4" />}
    />
  );
}
