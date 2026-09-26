import { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import { DEFAULT_START } from '../utils/dateHelpers';
import { ensureAnonymousUser, isFirebaseConfigured } from '../services/firebase';
import {
  buildStateSnapshot,
  clearPersistedState,
  hydrateState,
  loadCloudState,
  persistState,
  saveCloudState,
} from '../utils/storage';

const StudyContext = createContext(null);

const DEFAULT_SETTINGS = {
  startDate: DEFAULT_START,
  firstLaunchComplete: false,
  scheduleOffset: 0,
};

const initialState = {
  dailyProgress: {},
  mockScores: { wbcs: [], misc: [] },
  errorLog: { wbcs: [], misc: [] },
  missedDays: {},
  settings: DEFAULT_SETTINGS,
  isLoaded: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'HYDRATE':
      return {
        ...state,
        ...action.payload,
        settings: { ...DEFAULT_SETTINGS, ...(action.payload.settings || {}) },
        isLoaded: true,
      };
    case 'SET_DAY':
      return { ...state, dailyProgress: { ...state.dailyProgress, [action.date]: action.data } };
    case 'ADD_MOCK':
      return {
        ...state,
        mockScores: {
          ...state.mockScores,
          [action.exam]: [...state.mockScores[action.exam], action.entry],
        },
      };
    case 'DELETE_MOCK':
      return {
        ...state,
        mockScores: {
          ...state.mockScores,
          [action.exam]: state.mockScores[action.exam].filter((x) => x.id !== action.id),
        },
      };
    case 'ADD_ERROR':
      return {
        ...state,
        errorLog: {
          ...state.errorLog,
          [action.exam]: [...state.errorLog[action.exam], action.entry],
        },
      };
    case 'UPDATE_ERROR':
      return {
        ...state,
        errorLog: {
          ...state.errorLog,
          [action.exam]: state.errorLog[action.exam].map((item) => (item.id === action.id ? { ...item, ...action.updates } : item)),
        },
      };
    case 'DELETE_ERROR':
      return {
        ...state,
        errorLog: {
          ...state.errorLog,
          [action.exam]: state.errorLog[action.exam].filter((x) => x.id !== action.id),
        },
      };
    case 'SET_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.settings } };
    case 'SET_MISSED':
      return {
        ...state,
        missedDays: {
          ...state.missedDays,
          [action.date]: {
            ...(state.missedDays[action.date] || {}),
            ...action.patch,
          },
        },
      };
    case 'RESTORE':
      return {
        ...state,
        ...action.payload,
        settings: { ...DEFAULT_SETTINGS, ...(action.payload.settings || {}) },
        isLoaded: true,
      };
    case 'RESET':
      return { ...initialState, settings: { ...DEFAULT_SETTINGS }, isLoaded: true };
    default:
      return state;
  }
}

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function StudyProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [cloudUid, setCloudUid] = useState(null);
  const [cloudReady, setCloudReady] = useState(!isFirebaseConfigured);
  const [cloudBootstrapped, setCloudBootstrapped] = useState(!isFirebaseConfigured);

  useEffect(() => {
    const hydrated = hydrateState();
    dispatch({ type: 'HYDRATE', payload: hydrated });
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    let cancelled = false;
    ensureAnonymousUser()
      .then((user) => {
        if (cancelled) return;
        setCloudUid(user?.uid || null);
        setCloudReady(true);
      })
      .catch(() => {
        if (cancelled) return;
        setCloudReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!state.isLoaded || !cloudReady || !isFirebaseConfigured || !cloudUid || cloudBootstrapped) return;
    let cancelled = false;
    const sync = async () => {
      try {
        const remote = await loadCloudState(cloudUid);
        if (cancelled) return;
        if (remote) {
          dispatch({ type: 'RESTORE', payload: remote });
        } else {
          await saveCloudState(cloudUid, buildStateSnapshot(state));
        }
      } catch {
        // Keep local mode silently if cloud load fails.
      } finally {
        if (!cancelled) setCloudBootstrapped(true);
      }
    };
    sync();
    return () => {
      cancelled = true;
    };
  }, [state, cloudReady, cloudUid, cloudBootstrapped]);

  useEffect(() => {
    if (!state.isLoaded) return;
    persistState({
      dailyProgress: state.dailyProgress,
      mockScores: state.mockScores,
      errorLog: state.errorLog,
      missedDays: state.missedDays,
      settings: state.settings,
    });
  }, [state.dailyProgress, state.mockScores, state.errorLog, state.missedDays, state.settings, state.isLoaded]);

  useEffect(() => {
    if (!state.isLoaded || !isFirebaseConfigured || !cloudUid || !cloudBootstrapped) return;
    saveCloudState(cloudUid, buildStateSnapshot(state)).catch(() => {
      // Local storage is source-of-truth fallback.
    });
  }, [state.dailyProgress, state.mockScores, state.errorLog, state.missedDays, state.settings, state.isLoaded, cloudUid, cloudBootstrapped]);

  const api = useMemo(() => {
    const updateDailyBlock = (date, blockId, value) => {
      const existing = state.dailyProgress[date] || { blocks: {}, notes: '' };
      dispatch({
        type: 'SET_DAY',
        date,
        data: { ...existing, blocks: { ...existing.blocks, [blockId]: value } },
      });
    };

    const updateDailyNotes = (date, notes) => {
      const existing = state.dailyProgress[date] || { blocks: {}, notes: '' };
      dispatch({ type: 'SET_DAY', date, data: { ...existing, notes } });
    };

    const addMockScore = (exam, entry) => {
      dispatch({ type: 'ADD_MOCK', exam, entry: { id: uid(), ...entry } });
    };

    const deleteMockScore = (exam, id) => dispatch({ type: 'DELETE_MOCK', exam, id });

    const addError = (exam, entry) => {
      dispatch({
        type: 'ADD_ERROR',
        exam,
        entry: { id: uid(), date: new Date().toISOString(), resolved: false, ...entry },
      });
    };

    const updateError = (exam, id, updates) => dispatch({ type: 'UPDATE_ERROR', exam, id, updates });

    const deleteError = (exam, id) => dispatch({ type: 'DELETE_ERROR', exam, id });

    const updateSettings = (settings) => dispatch({ type: 'SET_SETTINGS', settings });

    const logMissedDay = (date, reason) => dispatch({ type: 'SET_MISSED', date, patch: { reason } });

    const scheduleCatchUp = (date, catchUpDate) => dispatch({ type: 'SET_MISSED', date, patch: { catchUpDate } });

    const setCatchUpDecision = (date, decision) => dispatch({
      type: 'SET_MISSED',
      date,
      patch: { catchUpDecision: decision, missedDate: date },
    });

    const restoreData = (payload) => dispatch({ type: 'RESTORE', payload });

    const resetAll = () => {
      clearPersistedState();
      dispatch({ type: 'RESET' });
    };

    return {
      ...state,
      cloud: {
        enabled: isFirebaseConfigured,
        status: isFirebaseConfigured ? (cloudBootstrapped ? 'connected' : 'connecting') : 'local-only',
        uid: cloudUid,
      },
      updateDailyBlock,
      updateDailyNotes,
      addMockScore,
      deleteMockScore,
      addError,
      updateError,
      deleteError,
      updateSettings,
      logMissedDay,
      scheduleCatchUp,
      setCatchUpDecision,
      restoreData,
      resetAll,
    };
  }, [state, cloudUid, cloudBootstrapped]);

  return <StudyContext.Provider value={api}>{children}</StudyContext.Provider>;
}

export function useStudy() {
  const ctx = useContext(StudyContext);
  if (!ctx) throw new Error('useStudy must be used inside StudyProvider');
  return ctx;
}
