import { useEffect, useMemo, useState } from 'react';
import { BookMarked, BookOpen, Briefcase, CheckCircle2, Circle, Flame, Layers2, ShieldAlert, TrendingUp } from 'lucide-react';
import {
  BLOCK2_ROTATION,
  DAILY_BLOCKS,
  DAILY_BLOCKS_WORKING,
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

  const weekdayBlocks = settings.workingProfMode ? DAILY_BLOCKS_WORKING : DAILY_BLOCKS;
  const rawBlocks = dayIndex === 6 ? SATURDAY_BLOCKS : dayIndex === 0 ? SUNDAY_BLOCKS : weekdayBlocks;
  // Work block is informational only — excluded from completion metrics
  const blocks = rawBlocks.filter((b) => b.category !== 'work');
  const dayData = dailyProgress[todayKey] || { blocks: {}, notes: '' };

  const completedCount = blocks.filter((b) => dayData.blocks[b.id]).length;
  const completion = blocks.length ? Math.round((completedCount / blocks.length) * 100) : 0;

  const weekTopic = WEEK_PLAN.find((w) => w.week === week)?.topic || 'General Revision';
  const rotation = WEEKLY_ROTATION[dayName] || null;
  // Weeks 1-10: Block 1 is dedicated to the week's chapter target (matches mobile app logic)
  const block1 = week <= 10 ? weekTopic : rotation?.block1;
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
        <ShieldAlert size={14} style={{ flexShrink: 0, marginTop: 1 }} />
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
        <div className="kpi">
          <div className="kpi-head"><TrendingUp size={13} color="#3182ce" /><strong>{completion}%</strong></div>
          <span>Completion</span>
        </div>
        <div className="kpi">
          <div className="kpi-head"><Layers2 size={13} color="#805ad5" /><strong>{completedCount}/{blocks.length}</strong></div>
          <span>Blocks done</span>
        </div>
        <div className="kpi">
          <div className="kpi-head"><Flame size={13} color={phase.color} /><strong>Wk {week}</strong></div>
          <span>{phase.shortName}</span>
        </div>
      </div>

      <div className="sub-header"><BookOpen size={13} /> This Week's Chapter Goal</div>
      <div className="subject-card week-goal-card">
        <div className="week-goal-header">
          <div>
            <p className="eyebrow">Week {week} · {phase.shortName}</p>
            <p className="week-goal-topic">{weekTopic}</p>
          </div>
          <span className={`tag ${week <= 10 ? 'tag-blue' : 'tag-yellow'}`}>
            {week <= 10 ? 'Deep Read' : 'Revision'}
          </span>
        </div>
        <p className="week-goal-note muted">
          {week <= 10
            ? 'Block 1 is dedicated to this chapter every day this week.'
            : 'Chapter complete — Block 1 now follows the daily rotation.'}
        </p>
      </div>

      {rotation && (
        <>
          <div className="sub-header"><BookMarked size={13} /> Today’s Subjects — {dayName}</div>
          <div className="subject-card">
            <div className="block-subject-row">
              <span className="block-badge b1">B1</span>
              <div>
                <strong>{block1}</strong>
                {week <= 10 && <span className="small muted"> · chapter deep-read</span>}
              </div>
            </div>
            <div className="block-subject-divider" />
            <div className="block-subject-row">
              <span className="block-badge b2">B2</span>
              <div>
                <strong>{BLOCK2_ROTATION[dayName]?.module}</strong>
                <p className="small muted">{BLOCK2_ROTATION[dayName]?.practice}</p>
              </div>
            </div>
            <div className="block-subject-divider" />
            <div className="block-subject-row">
              <span className="block-badge b3">B3</span>
              <div>
                <strong>{block3}</strong>
                {week >= 13 && week <= 16 && <span className="small muted"> · Misc-only block</span>}
              </div>
            </div>
          </div>
        </>
      )}

      <div className="sub-header">Today's Block Checklist</div>
      <div className="task-list">
        {rawBlocks.map((block) => {
          if (block.category === 'work') {
            return (
              <div key={block.id} className="task-row work-block-row">
                <div>
                  <strong>{block.label}</strong>
                  <p>{block.time}</p>
                </div>
                <div className="task-meta">
                  <span>{block.hours}h</span>
                  <Briefcase size={18} color="#d69e2e" />
                </div>
              </div>
            );
          }
          const checked = Boolean(dayData.blocks[block.id]);
          const blockSubject =
            block.id === 'block1' ? block1 :
            block.id === 'block2' ? BLOCK2_ROTATION[dayName]?.module :
            block.id === 'block3' ? block3 :
            null;
          return (
            <button
              key={block.id}
              className={`task-row ${checked ? 'done' : ''}`}
              onClick={() => updateDailyBlock(todayKey, block.id, !checked)}
            >
              <div>
                <strong>{block.label}</strong>
                {blockSubject && <p className="block-subject-inline">{blockSubject}</p>}
                <p>{block.time}</p>
              </div>
              <div className="task-meta">
                <span>{block.hours}h</span>
                {checked
                  ? <CheckCircle2 size={18} color="#38a169" />
                  : <Circle size={18} color="#cbd5e0" />}
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
