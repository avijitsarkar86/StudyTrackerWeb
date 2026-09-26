import { useEffect, useMemo, useState } from 'react';
import {
  DAILY_BLOCKS,
  DAY_NAMES,
  NON_NEGOTIABLE_RULES,
  PHASE3_OVERRIDE,
  SATURDAY_BLOCKS,
  SUNDAY_BLOCKS,
  WEEK_PLAN,
  WEEKLY_ROTATION,
} from '../constants/studyData';
import {
  formatDateDisplay,
  getCurrentWeek,
  getDayNameFromDateKey,
  getPhaseInfo,
  getTodayKey,
} from '../utils/dateHelpers';
import { useStudy } from '../context/StudyContext';

export default function TodayView() {
  const { dailyProgress, updateDailyBlock, settings, missedDays, setCatchUpDecision } = useStudy();
  const [ruleIdx, setRuleIdx] = useState(0);

  const todayKey = getTodayKey();
  const dayName = getDayNameFromDateKey(todayKey);
  const dayIndex = DAY_NAMES.indexOf(dayName);
  const week = getCurrentWeek(settings.startDate, todayKey);
  const phase = getPhaseInfo(week);

  const blocks = dayIndex === 6 ? SATURDAY_BLOCKS : dayIndex === 0 ? SUNDAY_BLOCKS : DAILY_BLOCKS;
  const dayData = dailyProgress[todayKey] || { blocks: {}, notes: '' };

  const completedCount = blocks.filter((b) => dayData.blocks[b.id]).length;
  const completion = blocks.length ? Math.round((completedCount / blocks.length) * 100) : 0;

  const weekTopic = WEEK_PLAN.find((w) => w.week === week)?.topic || 'General Revision';
  const rotation = WEEKLY_ROTATION[dayName] || null;
  const block3 = week >= 13 && week <= 16 ? PHASE3_OVERRIDE[week] : rotation?.block3;

  useEffect(() => {
    const timer = setInterval(() => {
      setRuleIdx((current) => (current + 1) % NON_NEGOTIABLE_RULES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const todayCatchUps = useMemo(() => {
    return Object.entries(missedDays || {})
      .filter(([, value]) => value?.catchUpDate === todayKey)
      .map(([date, value]) => ({ date, ...value }));
  }, [missedDays, todayKey]);

  const pendingCatchUps = todayCatchUps.filter((item) => !item.catchUpDecision);
  const activeCatchUp = todayCatchUps.find((item) => item.catchUpDecision === 'continue') || null;

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Section 01</p>
          <h2>Today Plan</h2>
          <p className="muted">{formatDateDisplay(new Date().toISOString())}</p>
        </div>
        <div className="phase-chip" style={{ borderColor: phase.color }}>
          <strong style={{ color: phase.color }}>Week {week}</strong>
          <span>Phase {phase.phase}</span>
        </div>
      </div>

      <button className="rule-banner" onClick={() => setRuleIdx((ruleIdx + 1) % NON_NEGOTIABLE_RULES.length)}>
        <strong>Rule:</strong>
        <span>{NON_NEGOTIABLE_RULES[ruleIdx]}</span>
      </button>

      {pendingCatchUps.map((item) => (
        <div key={item.date} className="catchup-card">
          <p className="eyebrow">Catch-Up Scheduled</p>
          <h3>Choose Today&apos;s Flow</h3>
          <p className="muted">Missed date: {item.date}{item.reason ? ` · ${item.reason}` : ''}</p>
          <div className="row-actions">
            <button className="btn btn-ghost" onClick={() => setCatchUpDecision(item.date, 'skip')}>Skip Catch-Up</button>
            <button className="btn btn-primary" onClick={() => setCatchUpDecision(item.date, 'continue')}>Continue Catch-Up</button>
          </div>
        </div>
      ))}

      {activeCatchUp && (
        <div className="alert alert-info catchup-active">
          <strong>Catch-Up Mode Active:</strong> You are currently covering the missed schedule for {activeCatchUp.missedDate || activeCatchUp.date}. Continue your core blocks first.
        </div>
      )}

      <div className="sub-header">Daily Completion Snapshot</div>
      <div className="progress-strip">
        <div className="progress-fill" style={{ width: `${completion}%`, background: phase.color }} />
      </div>

      <div className="kpi-row">
        <div className="kpi"><strong>{completion}%</strong><span>Completion</span></div>
        <div className="kpi"><strong>{completedCount}/{blocks.length}</strong><span>Blocks done</span></div>
        <div className="kpi"><strong>Wk {week}</strong><span>{phase.shortName}</span></div>
      </div>

      <div className="sub-header">Weekly Rotation Context</div>
      <div className="subject-card">
        <h3>Weekly Focus</h3>
        <p>{weekTopic}</p>
        {rotation && (
          <div className="subject-grid">
            <div><span>Block 1</span><strong>{rotation.block1}</strong></div>
            <div><span>Block 3</span><strong>{block3}</strong></div>
          </div>
        )}
      </div>

      <div className="sub-header">Today's Block Checklist</div>
      <div className="task-list">
        {blocks.map((block) => {
          const checked = Boolean(dayData.blocks[block.id]);
          return (
            <button
              key={block.id}
              className={`task-row ${checked ? 'done' : ''}`}
              onClick={() => updateDailyBlock(todayKey, block.id, !checked)}
            >
              <div>
                <strong>{block.label}</strong>
                <p>{block.time}</p>
              </div>
              <div className="task-meta">
                <span>{block.hours}h</span>
                <span className={`check ${checked ? 'active' : ''}`}>{checked ? 'YES' : 'NO'}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="alert alert-info">
        <strong>Rule:</strong> Complete Block 1, Block 2, and Block 3 before marking the day as successful.
      </div>
    </section>
  );
}
