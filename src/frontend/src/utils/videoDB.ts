// IndexedDB utility for persisting worker videos across sessions
const DB_NAME = "knot_videos";
const STORE_NAME = "videos";
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      req.result.createObjectStore(STORE_NAME);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function saveVideoBlob(
  workerId: string,
  blob: Blob,
): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put(blob, workerId);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function getVideoBlob(workerId: string): Promise<Blob | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).get(workerId);
    req.onsuccess = () => resolve(req.result ?? null);
    req.onerror = () => reject(req.error);
  });
}

export async function getVideoObjectURL(
  workerId: string,
): Promise<string | null> {
  const blob = await getVideoBlob(workerId);
  if (!blob) return null;
  return URL.createObjectURL(blob);
}

/**
 * Try IndexedDB first, then fall back to the base64 data URI stored in
 * localStorage (written at registration time so any viewer on the same
 * browser session can play the video).
 */
export async function getVideoObjectURLWithFallback(
  workerId: string,
): Promise<string | null> {
  // 1. Try IndexedDB (fastest path — same device that registered)
  try {
    const url = await getVideoObjectURL(workerId);
    if (url) return url;
  } catch {
    // IndexedDB unavailable — fall through to localStorage
  }

  // 2. Fall back to base64 data URI saved at registration time
  const b64 = localStorage.getItem(`knot_video_b64_${workerId}`);
  if (!b64) return null;

  try {
    // Convert "data:<mime>;base64,<data>" → Blob → Object URL
    const [header, data] = b64.split(",");
    const mime = header.match(/:(.*?);/)?.[1] ?? "video/mp4";
    const binary = atob(data);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: mime });
    return URL.createObjectURL(blob);
  } catch {
    return null;
  }
}
