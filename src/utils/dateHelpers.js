import { DAY_NAMES, MOCK_WEEKS, PHASES } from '../constants/studyData';

export const DEFAULT_START = '2026-09-09';

export function localDateKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getTodayKey() {
  return localDateKey();
}

export function getCurrentWeek(startDate = DEFAULT_START, todayDate = null) {
  const start = new Date(`${startDate}T00:00:00`);
  const today = todayDate ? new Date(`${todayDate}T00:00:00`) : new Date();
  const diff = today.getTime() - start.getTime();
  if (diff < 0) return 1;
  return Math.min(Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1, 26);
}

export function getPhaseInfo(week) {
  return PHASES.find((phase) => week >= phase.weeks[0] && week <= phase.weeks[1]) || PHASES[4];
}

export function getMockTypeForWeek(week) {
  if (MOCK_WEEKS.wbcs.includes(week)) return 'WBCS';
  if (MOCK_WEEKS.misc.includes(week)) return 'Misc';
  return null;
}

export function formatDateDisplay(isoString) {
  return new Date(isoString).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateShort(isoString) {
  return new Date(isoString).toLocaleDateString('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function getWeekDateRange(week, startDate = DEFAULT_START) {
  const start = new Date(`${startDate}T00:00:00`);
  const weekStart = new Date(start.getTime() + (week - 1) * 7 * 24 * 60 * 60 * 1000);
  const weekEnd = new Date(weekStart.getTime() + 6 * 24 * 60 * 60 * 1000);
  const fmt = (d) => d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  return `${fmt(weekStart)} - ${fmt(weekEnd)}`;
}

export function getOverallProgress(week) {
  return Math.round(((week - 1) / 26) * 100);
}

export function calculateStreak(dailyProgress) {
  const today = new Date();
  let streak = 0;
  for (let i = 0; i <= 365; i += 1) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key = localDateKey(d);
    const blocks = dailyProgress[key]?.blocks || {};
    if (Object.values(blocks).some(Boolean)) {
      streak += 1;
    } else if (i > 0) {
      break;
    }
  }
  return streak;
}

export function getLast30DaysKeys(startDate = DEFAULT_START) {
  const keys = [];
  const start = new Date(`${startDate}T00:00:00`);
  const today = new Date();
  for (let i = 29; i >= 0; i -= 1) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (d >= start) keys.push(localDateKey(d));
  }
  return keys;
}

export function getDayNameFromDateKey(dateKey) {
  return DAY_NAMES[new Date(`${dateKey}T12:00:00`).getDay()];
}
