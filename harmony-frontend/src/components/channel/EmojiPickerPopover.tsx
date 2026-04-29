'use client';

/**
 * EmojiPickerPopover
 * Mounts the vanilla emoji-mart Picker into a div ref so it works with
 * React 19 without the @emoji-mart/react wrapper (which only supports React ≤18).
 * Only rendered client-side via next/dynamic { ssr: false }.
 */

import { useEffect, useRef } from 'react';
import { Picker } from 'emoji-mart';
import data from '@emoji-mart/data';

export interface EmojiPickerPopoverProps {
  onEmojiSelect: (emoji: { native: string }) => void;
}

export function EmojiPickerPopover({ onEmojiSelect }: EmojiPickerPopoverProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const picker = new (Picker as any)({
      data,
      onEmojiSelect,
      theme: 'dark',
      previewPosition: 'none',
      skinTonePosition: 'none',
      maxFrequentRows: 2,
    });

    el.appendChild(picker);

    return () => {
      if (el.contains(picker)) el.removeChild(picker);
    };
    // onEmojiSelect is stable (useCallback in parent) — intentionally omitted
    // from deps to avoid remounting the picker on every keystroke.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div ref={containerRef} />;
}
