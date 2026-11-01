// src/lib/recordingsDb.ts
// Recitation recordings, kept only on this device (IndexedDB — localStorage is
// too small for audio). Session metadata lives in the session store.

const DB_NAME = "tilawah-recordings";
const STORE = "audio";

export interface StoredRecording {
  id: string;
  blob: Blob;
  createdAt: number;
}

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE, { keyPath: "id" });
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function run<T>(mode: IDBTransactionMode, fn: (store: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await open();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(STORE, mode);
    const req = fn(tx.objectStore(STORE));
    tx.oncomplete = () => {
      db.close();
      resolve(req.result);
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

export function saveRecording(id: string, blob: Blob): Promise<IDBValidKey> {
  return run("readwrite", (s) => s.put({ id, blob, createdAt: Date.now() } satisfies StoredRecording));
}

export async function getRecording(id: string): Promise<Blob | null> {
  const row = (await run("readonly", (s) => s.get(id))) as StoredRecording | undefined;
  return row?.blob ?? null;
}

export function deleteRecording(id: string): Promise<undefined> {
  return run("readwrite", (s) => s.delete(id));
}

export function clearRecordings(): Promise<undefined> {
  return run("readwrite", (s) => s.clear());
}

/** Total bytes of all stored recordings */
export async function recordingsSize(): Promise<number> {
  const rows = (await run("readonly", (s) => s.getAll())) as StoredRecording[];
  return rows.reduce((sum, r) => sum + (r.blob?.size ?? 0), 0);
}
