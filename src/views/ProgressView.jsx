import { useMemo, useState } from 'react';
import { DAILY_BLOCKS, DAY_NAMES, MILESTONES, PHASES, SATURDAY_BLOCKS, SUNDAY_BLOCKS } from '../constants/studyData';
import {
  calculateStreak,
  getCurrentWeek,
  getLast30DaysKeys,
  getOverallProgress,
  getPhaseInfo,
  getWeekDateRange,
  getTodayKey,
  localDateKey,
} from '../utils/dateHelpers';
import { useStudy } from '../context/StudyContext';

function dayBlockTemplate(dateKey) {
  const day = DAY_NAMES[new Date(`${dateKey}T12:00:00`).getDay()];
  if (day === 'Saturday') return SATURDAY_BLOCKS;
  if (day === 'Sunday') return SUNDAY_BLOCKS;
  return DAILY_BLOCKS;
}

export default function ProgressView() {
  const { dailyProgress, settings, missedDays, logMissedDay, scheduleCatchUp } = useStudy();
  const [showWeekHistory, setShowWeekHistory] = useState(false);
  const [reasonDrafts, setReasonDrafts] = useState({});
  const [catchUpDrafts, setCatchUpDrafts] = useState({});

  const week = getCurrentWeek(settings.startDate);
  const phase = getPhaseInfo(week);
  const overall = getOverallProgress(week);
  const streak = calculateStreak(dailyProgress);

  const daysStudied = Object.values(dailyProgress).filter((d) => Object.values(d.blocks || {}).some(Boolean)).length;
  const studyBlockMap = new Map(DAILY_BLOCKS.map((b) => [b.id, b]));
  const totalHours = Object.values(dailyProgress).reduce((sum, day) => {
    return sum + Object.entries(day.blocks || {}).reduce((inDay, [id, done]) => {
      if (!done) return inDay;
      const block = studyBlockMap.get(id);
      return block && block.category === 'study' ? inDay + block.hours : inDay;
    }, 0);
  }, 0);

  const last30 = getLast30DaysKeys(settings.startDate);
  const today = getTodayKey();
  const milestone = MILESTONES.find((m) => m.week >= week);

  const autoMissedDays = useMemo(() => {
    const start = new Date(`${settings.startDate}T00:00:00`);
    const end = new Date(`${today}T00:00:00`);
    end.setDate(end.getDate() - 1);

    const list = [];
    const current = new Date(start);
    while (current <= end) {
      const key = localDateKey(current);
      const blocks = dailyProgress[key]?.blocks || {};
      if (!Object.values(blocks).some(Boolean)) list.push(key);
      current.setDate(current.getDate() + 1);
    }
    return list.sort((a, b) => b.localeCompare(a));
  }, [dailyProgress, settings.startDate, today]);

  const missedRows = useMemo(() => {
    return autoMissedDays.map((dateKey) => {
      const weekNum = getCurrentWeek(settings.startDate, dateKey);
      return {
        date: dateKey,
        week: weekNum,
        reason: missedDays[dateKey]?.reason || '',
        catchUpDate: missedDays[dateKey]?.catchUpDate || '',
      };
    });
  }, [autoMissedDays, missedDays, settings.startDate]);

  const missedByWeek = useMemo(() => {
    const grouped = new Map();
    missedRows.forEach((item) => {
      const bucket = grouped.get(item.week) || [];
      bucket.push(item);
      grouped.set(item.week, bucket);
    });
    return [...grouped.entries()].sort((a, b) => b[0] - a[0]);
  }, [missedRows]);

  const weekSummaries = useMemo(() => {
    const start = new Date(`${settings.startDate}T00:00:00`);
    const rows = [];
    for (let w = 1; w < week; w += 1) {
      const weekStart = new Date(start);
      weekStart.setDate(weekStart.getDate() + (w - 1) * 7);
      const keys = [];
      for (let i = 0; i < 7; i += 1) {
        const d = new Date(weekStart);
        d.setDate(weekStart.getDate() + i);
        keys.push(localDateKey(d));
      }

      const studiedDays = keys.filter((key) => Object.values(dailyProgress[key]?.blocks || {}).some(Boolean)).length;
      const completion = keys.length ? Math.round((studiedDays / keys.length) * 100) : 0;
      const hours = keys.reduce((sum, key) => {
        const blocks = dailyProgress[key]?.blocks || {};
        const template = dayBlockTemplate(key);
        const studyMap = new Map(template.map((b) => [b.id, b]));
        return sum + Object.entries(blocks).reduce((inDay, [id, done]) => {
          if (!done) return inDay;
          const block = studyMap.get(id);
          return block && block.category === 'study' ? inDay + block.hours : inDay;
        }, 0);
      }, 0);

      rows.push({
        week: w,
        range: getWeekDateRange(w, settings.startDate),
        completion,
        studiedDays,
        hours: Math.round(hours * 10) / 10,
      });
    }
    return rows.reverse();
  }, [dailyProgress, settings.startDate, week]);

  const totalMissed = missedRows.length;
  const plannedCatchups = missedRows.filter((item) => item.catchUpDate).length;

  const saveMissedMeta = (dateKey) => {
    const reason = (reasonDrafts[dateKey] ?? missedDays[dateKey]?.reason ?? '').trim();
    const catchUpDate = (catchUpDrafts[dateKey] ?? missedDays[dateKey]?.catchUpDate ?? '').trim();

    if (reason) logMissedDay(dateKey, reason);
    if (catchUpDate) {
      if (catchUpDate <= today) {
        window.alert('Catch-up date must be in the future.');
        return;
      }
      scheduleCatchUp(dateKey, catchUpDate);
    }
  };

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Section 02</p>
          <h2>Progress Dashboard</h2>
        </div>
        <div className="week-range">{getWeekDateRange(week, settings.startDate)}</div>
      </div>

      <div className="sub-header">Performance Summary</div>
      <div className="kpi-row four">
        <div className="kpi"><strong>{daysStudied}</strong><span>Days studied</span></div>
        <div className="kpi"><strong>{streak}</strong><span>Streak</span></div>
        <div className="kpi"><strong>{Math.round(totalHours * 10) / 10}h</strong><span>Study hours</span></div>
        <div className="kpi"><strong>{overall}%</strong><span>Overall progress</span></div>
      </div>

      <div className="sub-header">26-Week Master Timeline</div>
      <div className="timeline-card">
        <h3>26-Week Timeline</h3>
        <div className="progress-strip">
          <div className="progress-fill" style={{ width: `${overall}%`, background: 'var(--ink-blue)' }} />
        </div>
        <div className="phase-list">
          {PHASES.map((p) => {
            const active = week >= p.weeks[0] && week <= p.weeks[1];
            return (
              <div key={p.phase} className={`phase-item ${active ? 'active' : ''}`}>
                <span className="phase-dot" style={{ background: p.color }} />
                <div>
                  <strong>Phase {p.phase}: {p.shortName}</strong>
                  <p>Weeks {p.weeks[0]}-{p.weeks[1]} | {p.period}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="sub-header">Last 30 Days Activity</div>
      <div className="heat-wrap">
        <h3>Last 30 Days Activity</h3>
        <div className="heat-grid">
          {last30.map((key) => {
            const blocks = dailyProgress[key]?.blocks || {};
            const count = Object.values(blocks).filter(Boolean).length;
            const future = key > today;
            const cls = future ? 'future' : count >= 7 ? 'high' : count >= 1 ? 'mid' : 'low';
            return <span title={`${key}: ${count} blocks`} key={key} className={`heat ${cls}`} />;
          })}
        </div>
      </div>

      <div className="sub-header">Week-by-Week Summary</div>
      <div className="timeline-card">
        <button className="accordion-toggle" onClick={() => setShowWeekHistory((v) => !v)}>
          <strong>{showWeekHistory ? 'Hide Weekly History' : 'Show Weekly History'}</strong>
          <span>{showWeekHistory ? '▲' : '▼'}</span>
        </button>
        {showWeekHistory && (
          <div className="week-history-list">
            {weekSummaries.map((row) => (
              <div key={row.week} className="week-history-row">
                <div>
                  <strong>Week {row.week}</strong>
                  <p className="muted">{row.range}</p>
                </div>
                <div className="week-history-kpis">
                  <span>{row.completion}%</span>
                  <span>{row.studiedDays}/7 days</span>
                  <span>{row.hours}h</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="sub-header">Missed Days & Catch-Up</div>
      <div className="timeline-card">
        <div className="kpi-row">
          <div className="kpi"><strong>{totalMissed}</strong><span>Missed</span></div>
          <div className="kpi"><strong>{plannedCatchups}</strong><span>Planned</span></div>
          <div className="kpi"><strong>{Math.max(totalMissed - plannedCatchups, 0)}</strong><span>Pending</span></div>
        </div>

        {missedByWeek.length === 0 ? (
          <div className="empty-card muted" style={{ marginTop: 10 }}>No missed days detected yet.</div>
        ) : (
          <div className="missed-week-list">
            {missedByWeek.map(([weekNum, rows]) => (
              <div key={weekNum} className="missed-week-group">
                <div className="missed-week-head">
                  <strong>Week {weekNum}</strong>
                  <span className="muted">{getWeekDateRange(weekNum, settings.startDate)}</span>
                </div>
                {rows.map((item) => {
                  const reasonValue = reasonDrafts[item.date] ?? item.reason;
                  const catchUpValue = catchUpDrafts[item.date] ?? item.catchUpDate;
                  return (
                    <div key={item.date} className="missed-item-row">
                      <p><strong>{item.date}</strong></p>
                      <div className="missed-controls">
                        <input
                          className="input"
                          placeholder="Reason"
                          value={reasonValue}
                          onChange={(e) => setReasonDrafts((prev) => ({ ...prev, [item.date]: e.target.value }))}
                        />
                        <input
                          className="input"
                          type="date"
                          value={catchUpValue}
                          min={today}
                          onChange={(e) => setCatchUpDrafts((prev) => ({ ...prev, [item.date]: e.target.value }))}
                        />
                        <button className="btn btn-primary" onClick={() => saveMissedMeta(item.date)}>Save</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>

      {milestone && (
        <div className="milestone">
          <h3>Next Milestone: Week {milestone.week}</h3>
          <strong>{milestone.title}</strong>
          <p>{milestone.body}</p>
          <p className="muted">Current phase: {phase.name}</p>
        </div>
      )}

      <div className="alert alert-success">
        <strong>Key Insight:</strong> Consistent weekly execution is more important than isolated high-score days.
      </div>
    </section>
  );
}
