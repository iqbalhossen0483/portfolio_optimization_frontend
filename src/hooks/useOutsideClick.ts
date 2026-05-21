import { RefObject, useEffect } from "react";

type UseOutsideClickOptions = {
  ref: RefObject<HTMLElement | null>;
  onOutsideClick?: (event: MouseEvent | KeyboardEvent) => void;
};

export const useOutsideClick = ({
  ref,
  onOutsideClick,
}: UseOutsideClickOptions) => {
  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (!ref.current || ref.current.contains(target)) return;

      onOutsideClick?.(event);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOutsideClick?.(event);
      }
    };

    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [ref, onOutsideClick]);
};
