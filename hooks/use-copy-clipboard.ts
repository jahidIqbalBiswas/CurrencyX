"use client";

import { useState, useCallback } from "react";

interface UseCopyClipboardReturn {
  copied: boolean;
  copy: (text: string) => Promise<void>;
}

/**
 * Hook for copying text to clipboard with a temporary "copied" state.
 * The `copied` flag resets after the specified duration.
 */
export function useCopyClipboard(
  resetDuration: number = 2000
): UseCopyClipboardReturn {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), resetDuration);
      } catch (error) {
        console.error("Failed to copy to clipboard:", error);
        setCopied(false);
      }
    },
    [resetDuration]
  );

  return { copied, copy };
}
