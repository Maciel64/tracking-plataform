export class Crypto {
  static ALGORITHM = "AES-CBC";
  static SALT_LENGTH = 16;
  static IV_LENGTH = 16;
  static KEY_LENGTH = 32;
  static ITERATIONS = 100000;
  static DIGEST = "SHA-256";

  static async deriveKey(password: string, salt: ArrayBuffer) {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      { name: "PBKDF2" },
      false,
      ["deriveBits", "deriveKey"]
    );

    return crypto.subtle.deriveKey(
      {
        name: "PBKDF2",
        salt,
        iterations: this.ITERATIONS,
        hash: this.DIGEST,
      },
      keyMaterial,
      { name: this.ALGORITHM, length: this.KEY_LENGTH * 8 },
      false,
      ["encrypt", "decrypt"]
    );
  }

  static async encrypt(text: string, password: string) {
    const encoder = new TextEncoder();
    const salt = crypto.getRandomValues(new Uint8Array(this.SALT_LENGTH));
    const iv = crypto.getRandomValues(new Uint8Array(this.IV_LENGTH));

    const key = await this.deriveKey(password, salt.buffer);
    const encrypted = await crypto.subtle.encrypt(
      {
        name: this.ALGORITHM,
        iv,
      },
      key,
      encoder.encode(text)
    );

    const result = new Uint8Array(
      salt.length + iv.length + encrypted.byteLength
    );
    result.set(salt, 0);
    result.set(iv, salt.length);
    result.set(new Uint8Array(encrypted), salt.length + iv.length);

    return btoa(String.fromCharCode(...result));
  }

  static async decrypt(encryptedBase64: string, password: string) {
    const decoder = new TextDecoder();
    const data = Uint8Array.from(atob(encryptedBase64), (c) => c.charCodeAt(0));

    const salt = data.slice(0, this.SALT_LENGTH);
    const iv = data.slice(this.SALT_LENGTH, this.SALT_LENGTH + this.IV_LENGTH);
    const encrypted = data.slice(this.SALT_LENGTH + this.IV_LENGTH);

    const key = await this.deriveKey(password, salt.buffer);
    const decrypted = await crypto.subtle.decrypt(
      {
        name: this.ALGORITHM,
        iv,
      },
      key,
      encrypted
    );

    return decoder.decode(decrypted);
  }
}
