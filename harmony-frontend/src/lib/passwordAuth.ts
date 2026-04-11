const PASSWORD_VERIFIER_ITERATIONS = 310000;
const PASSWORD_VERIFIER_LENGTH = 32;

function decodeHex(hex: string): ArrayBuffer {
  if (hex.length % 2 !== 0) {
    throw new Error('Invalid password salt');
  }

  const bytes = new Uint8Array(hex.length / 2);
  for (let index = 0; index < hex.length; index += 2) {
    bytes[index / 2] = Number.parseInt(hex.slice(index, index + 2), 16);
  }

  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}

function encodeBase64(bytes: Uint8Array): string {
  if (typeof window === 'undefined') {
    return Buffer.from(bytes).toString('base64');
  }

  let binary = '';
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return window.btoa(binary);
}

export async function derivePasswordVerifier(
  password: string,
  passwordSalt: string,
): Promise<string> {
  const cryptoApi = globalThis.crypto?.subtle;
  if (!cryptoApi) {
    throw new Error('Web Crypto is unavailable');
  }

  const passwordKey = await cryptoApi.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );

  const derivedBits = await cryptoApi.deriveBits(
    {
      name: 'PBKDF2',
      salt: decodeHex(passwordSalt),
      iterations: PASSWORD_VERIFIER_ITERATIONS,
      hash: 'SHA-256',
    },
    passwordKey,
    PASSWORD_VERIFIER_LENGTH * 8,
  );

  return encodeBase64(new Uint8Array(derivedBits));
}
