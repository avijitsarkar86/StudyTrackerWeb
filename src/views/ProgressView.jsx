import { DAILY_BLOCKS, MILESTONES, PHASES } from '../constants/studyData';
import { calculateStreak, getCurrentWeek, getLast30DaysKeys, getOverallProgress, getPhaseInfo, getWeekDateRange, getTodayKey } from '../utils/dateHelpers';
import { useStudy } from '../context/StudyContext';

export default function ProgressView() {
  const { dailyProgress, settings } = useStudy();
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
