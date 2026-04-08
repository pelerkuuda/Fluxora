export async function createDemoSignature(message: string, walletAddress: string) {
  if (typeof window !== "undefined" && window.crypto?.subtle) {
    const encoded = new TextEncoder().encode(`${message}:${walletAddress}`);
    const hash = await window.crypto.subtle.digest("SHA-256", encoded);
    return Array.from(new Uint8Array(hash))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  }

  return btoa(`${message}:${walletAddress}`);
}
