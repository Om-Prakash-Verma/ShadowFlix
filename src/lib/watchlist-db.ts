export type ActivityKind = "movie" | "tv" | "episode" | "person" | "company" | "collection" | "genre" | "year";
export type ActivityAction = "visited" | "played";

export interface ActivityEntry {
  id: string;
  kind: ActivityKind;
  action: ActivityAction;
  title: string;
  href: string;
  image?: string | null;
  subtitle?: string | null;
  description?: string | null;
  meta?: Record<string, string | number | boolean | null | undefined>;
  updatedAt: number;
  seenCount: number;
}

export type ActivitySeed = Omit<ActivityEntry, "updatedAt" | "seenCount">;

const DB_NAME = "FreeFlix-watchlist";
const STORE_NAME = "activity";
const DB_VERSION = 1;
const UPDATE_EVENT = "FreeFlix:watchlist-updated";

function isBrowser() {
  return typeof window !== "undefined" && typeof indexedDB !== "undefined";
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!isBrowser()) {
      reject(new Error("IndexedDB is only available in the browser."));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("updatedAt", "updatedAt", { unique: false });
        store.createIndex("kind", "kind", { unique: false });
        store.createIndex("action", "action", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("Failed to open IndexedDB."));
  });
}

function notifyUpdate() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(UPDATE_EVENT));
  }
}

export function watchlistUpdatedEventName() {
  return UPDATE_EVENT;
}

export async function saveActivity(seed: ActivitySeed) {
  if (!isBrowser()) return;

  const db = await openDatabase();

  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const getRequest = store.get(seed.id);

    getRequest.onsuccess = () => {
      const existing = getRequest.result as ActivityEntry | undefined;
      const now = Date.now();
      const nextEntry: ActivityEntry = {
        ...existing,
        ...seed,
        updatedAt: now,
        seenCount: (existing?.seenCount ?? 0) + 1,
      };
      store.put(nextEntry);
    };

    getRequest.onerror = () => reject(getRequest.error ?? new Error("Failed to read activity entry."));
    transaction.oncomplete = () => {
      db.close();
      notifyUpdate();
      resolve();
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error ?? new Error("Failed to write activity entry."));
    };
  });
}

export async function listActivity() {
  if (!isBrowser()) return [] as ActivityEntry[];

  const db = await openDatabase();

  const entries = await new Promise<ActivityEntry[]>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => resolve((request.result as ActivityEntry[]) ?? []);
    request.onerror = () => reject(request.error ?? new Error("Failed to read activity entries."));
    transaction.oncomplete = () => db.close();
    transaction.onerror = () => reject(transaction.error ?? new Error("Failed to finish reading activity entries."));
  });

  return entries.sort((left, right) => right.updatedAt - left.updatedAt);
}

export async function clearActivity() {
  if (!isBrowser()) return;

  const db = await openDatabase();

  await new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => undefined;
    request.onerror = () => reject(request.error ?? new Error("Failed to clear activity."));
    transaction.oncomplete = () => {
      db.close();
      notifyUpdate();
      resolve();
    };
    transaction.onerror = () => {
      db.close();
      reject(transaction.error ?? new Error("Failed to finish clearing activity."));
    };
  });
}