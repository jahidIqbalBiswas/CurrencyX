"use client";

import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SwapButtonProps {
  onSwap: () => void;
}

export function SwapButton({ onSwap }: SwapButtonProps) {
  const [isRotated, setIsRotated] = useState(false);

  const handleSwap = () => {
    setIsRotated((prev) => !prev);
    onSwap();
  };

  return (
    <div className="flex items-center justify-center py-1">
      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={handleSwap}
        className="h-10 w-10 rounded-full border-2 border-primary/20 bg-background shadow-md transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:scale-110 active:scale-95"
        aria-label="Swap currencies"
      >
        <ArrowUpDown
          className="h-4 w-4 text-primary transition-transform duration-300"
          style={{
            transform: isRotated ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </Button>
    </div>
  );
}
