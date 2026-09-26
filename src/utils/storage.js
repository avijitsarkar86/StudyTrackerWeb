import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '../services/firebase';

const STORAGE_KEY = 'wbcs-study-tracker-web-v1';

const emptyState = {
  dailyProgress: {},
  mockScores: { wbcs: [], misc: [] },
  errorLog: { wbcs: [], misc: [] },
  missedDays: {},
  settings: null,
};

function isObject(v) {
  return typeof v === 'object' && v !== null;
}

export function buildStateSnapshot(data) {
  return {
    dailyProgress: isObject(data.dailyProgress) ? data.dailyProgress : {},
    mockScores: isObject(data.mockScores)
      ? {
        wbcs: Array.isArray(data.mockScores.wbcs) ? data.mockScores.wbcs : [],
        misc: Array.isArray(data.mockScores.misc) ? data.mockScores.misc : [],
      }
      : { wbcs: [], misc: [] },
    errorLog: isObject(data.errorLog)
      ? {
        wbcs: Array.isArray(data.errorLog.wbcs) ? data.errorLog.wbcs : [],
        misc: Array.isArray(data.errorLog.misc) ? data.errorLog.misc : [],
      }
      : { wbcs: [], misc: [] },
    missedDays: isObject(data.missedDays) ? data.missedDays : {},
    settings: isObject(data.settings) ? data.settings : null,
  };
}

export function hydrateState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...emptyState };
    const parsed = JSON.parse(raw);
    if (!isObject(parsed)) return { ...emptyState };
    return buildStateSnapshot(parsed);
  } catch {
    return { ...emptyState };
  }
}

export function persistState(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function clearPersistedState() {
  localStorage.removeItem(STORAGE_KEY);
}

function cloudDoc(uid) {
  return doc(db, 'users', uid, 'private', 'studyTracker');
}

export async function loadCloudState(uid) {
  if (!isFirebaseConfigured || !db || !uid) return null;
  const snap = await getDoc(cloudDoc(uid));
  if (!snap.exists()) return null;
  return buildStateSnapshot(snap.data());
}

export async function saveCloudState(uid, data) {
  if (!isFirebaseConfigured || !db || !uid) return;
  const payload = {
    ...buildStateSnapshot(data),
    updatedAt: serverTimestamp(),
    schemaVersion: 1,
  };
  await setDoc(cloudDoc(uid), payload, { merge: true });
}

export function exportStateAsFile(data) {
  const payload = {
    ...data,
    metadata: {
      exportedAt: new Date().toISOString(),
      version: '1.0.0-web',
    },
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `wbcs-study-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function parseImportedBackup(text) {
  const parsed = JSON.parse(text);
  if (!isObject(parsed)) throw new Error('Invalid backup format');
  if (!isObject(parsed.dailyProgress) || !isObject(parsed.mockScores) || !isObject(parsed.errorLog)) {
    throw new Error('Backup is missing required fields');
  }
  return buildStateSnapshot(parsed);
}
