/**
 * Thin wrapper around the `file-type` ESM-only package.
 * Wrapping it here lets Jest tests mock this module without needing to resolve
 * the ESM package directly (which ts-jest's CJS transform cannot do).
 */
export async function detectMimeType(buffer: Buffer): Promise<string | undefined> {
  const { fileTypeFromBuffer } = await import('file-type');
  const result = await fileTypeFromBuffer(buffer);
  return result?.mime;
}
