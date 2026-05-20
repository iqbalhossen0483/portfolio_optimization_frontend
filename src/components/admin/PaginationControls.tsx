import { Button } from "@/components/ui/Button";
import { Typography } from "@/components/ui/Typography";

interface PaginationControlsProps {
  total: number;
  shown: number;
  hasPrev: boolean;
  hasNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export function PaginationControls({
  total,
  shown,
  hasPrev,
  hasNext,
  onPrev,
  onNext,
}: PaginationControlsProps) {
  return (
    <div className="flex items-center justify-between pt-4">
      <Typography variant="caption">
        Showing {shown} of {total} assets
      </Typography>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" disabled={!hasPrev} onClick={onPrev}>
          Previous
        </Button>
        <Button variant="secondary" size="sm" disabled={!hasNext} onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  );
}
