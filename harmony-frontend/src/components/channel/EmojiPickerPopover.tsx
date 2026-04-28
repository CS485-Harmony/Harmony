'use client';

/**
 * EmojiPickerPopover
 * Thin wrapper around emoji-mart's Picker so it can be lazy-loaded.
 * Only rendered when the user opens the emoji panel in MessageInput.
 */

import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';

export interface EmojiPickerPopoverProps {
  onEmojiSelect: (emoji: { native: string }) => void;
}

export function EmojiPickerPopover({ onEmojiSelect }: EmojiPickerPopoverProps) {
  return (
    <Picker
      data={data}
      onEmojiSelect={onEmojiSelect}
      theme='dark'
      previewPosition='none'
      skinTonePosition='none'
      maxFrequentRows={2}
    />
  );
}
