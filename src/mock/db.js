import { seedDatabase, MOCK_DB_VERSION } from "@/data/seeders/database";

/**
 * Simulated backend database. Persists to localStorage so demo accounts and
 * orders survive a reload. Falls back to memory when storage is unavailable.
 */
const KEY = "oriel.mockdb";
let memory = null;

function storage() {
  try {
    return typeof window !== "undefined" ? window.localStorage : null;
  } catch {
    return null;
  }
}

export function readDb() {
  if (memory) return memory;
  const store = storage();
  try {
    const raw = store?.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    memory = parsed?.version === MOCK_DB_VERSION ? parsed : seedDatabase();
  } catch {
    memory = seedDatabase();
  }
  writeDb(memory);
  return memory;
}

export function writeDb(next) {
  memory = next;
  try {
    storage()?.setItem(KEY, JSON.stringify(next));
  } catch {
    /* quota or privacy mode: keep in memory only */
  }
}

/** Re-seeds the demo database (used by the "Reset demo data" action). */
export function resetDb() {
  memory = seedDatabase();
  writeDb(memory);
}
