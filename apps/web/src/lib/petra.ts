export function isPetraInstalled() {
  if (typeof window === "undefined") return false;
  return Boolean((window as Window & { aptos?: { isPetra?: boolean } }).aptos?.isPetra);
}

declare global {
  interface Window {
    aptos?: {
      isPetra?: boolean;
    };
  }
}
