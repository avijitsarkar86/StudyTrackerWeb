import { BLOCK2_ROTATION, PHASE3_OVERRIDE, WEEKLY_ROTATION, WEEK_PLAN } from '../constants/studyData';
import { useStudy } from '../context/StudyContext';

const weekPairs = [
  { weeks: '1-4', block1: 'History + Polity', block2: 'Polity booster' },
  { weeks: '5-8', block1: 'Geography + Economy', block2: 'Geography / Economy drill' },
  { weeks: '9-10', block1: 'Science + Environment', block2: 'Science / Environment recall' },
  { weeks: '11-12', block1: '2nd read cycle', block2: 'PYQ correction' },
  { weeks: '19-24', block1: 'Revision cycle', block2: 'Timed practice + review' },
];

export default function RotationView() {
  const { settings } = useStudy();
  const proMode = Boolean(settings.workingProfMode);
  const block1Rows = Object.entries(WEEKLY_ROTATION);
  const block2Rows = Object.entries(BLOCK2_ROTATION);

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Section 08</p>
          <h2>Weekly Subject-Rotation Matrix</h2>
          <p className="muted">Block 1, Block 2, and Block 3 are shown here so you can see the full daily subject flow in one place.</p>
        </div>
      </div>

      {proMode && (
        <div className="alert alert-warning">
          <strong>Working Professional Mode active.</strong> Schedule differences vs standard:
          <ul style={{ margin: '6px 0 0 16px', lineHeight: 1.7 }}>
            <li>Block 1: 2h (08:00–10:00) · Block 2: 1.5h (15:00–16:30) · Block 3: 1.5h (16:30–18:00)</li>
            <li>Work window: 10:30–14:30 (4h) between B1 Consolidation and Block 2</li>
            <li>Block 4 Math: 1h (18:30–19:30) · Static GK (Block 5) removed</li>
          </ul>
          Subject rotation below is unchanged — only the hours and timings differ.
        </div>
      )}

      <div className="sub-header">Rotation Map</div>
      <div className="subject-grid" style={{ marginBottom: 14, gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div>
          <span>Block 1</span>
          <strong>Primary GS rotation</strong>
          <p className="muted">Main reading block, Mon–Fri.</p>
        </div>
        <div>
          <span>Block 2</span>
          <strong>Compulsory subject booster</strong>
          <p className="muted">Daily paired revision and practice slot.</p>
        </div>
        <div>
          <span>Block 3</span>
          <strong>Secondary GS rotation</strong>
          <p className="muted">Different subject from Block 1. Weeks 13–16 overridden by Misc-only topics.</p>
        </div>
      </div>

      <div className="two-col">
        <div>
          <div className="sub-header">Block 1 Rotation</div>
          <table>
            <thead>
              <tr>
                <th>Day</th>
                <th>Primary GS</th>
                <th>Paired Focus</th>
              </tr>
            </thead>
            <tbody>
              {block1Rows.map(([day, rotation]) => (
                <tr key={day}>
                  <td><strong>{day}</strong></td>
                  <td>{rotation.block1}</td>
                  <td>{rotation.block3}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          <div className="sub-header">Block 2 Rotation</div>
          <table>
            <thead>
              <tr>
                <th>Day</th>
                <th>Module</th>
                <th>30-min Practice</th>
              </tr>
            </thead>
            <tbody>
              {block2Rows.map(([day, rotation]) => (
                <tr key={day}>
                  <td><strong>{day}</strong></td>
                  <td>{rotation.module}</td>
                  <td>{rotation.practice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="sub-header">Block 3 Rotation</div>
      <table>
        <thead>
          <tr>
            <th>Day</th>
            <th>Secondary GS Subject</th>
          </tr>
        </thead>
        <tbody>
          {block1Rows.map(([day, rotation]) => (
            <tr key={day}>
              <td><strong>{day}</strong></td>
              <td>{rotation.block3}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="note-box">
        <strong>Weeks 13–16 override (Misc-only)</strong>
        <p className="muted" style={{ marginTop: 6 }}>During weeks 13–16 Block 3 is replaced daily with a fixed Misc-only topic regardless of the day-of-week rotation above.</p>
        <table style={{ marginTop: 10 }}>
          <thead><tr><th>Week</th><th>Block 3 Topic</th></tr></thead>
          <tbody>
            {Object.entries(PHASE3_OVERRIDE).map(([week, topic]) => (
              <tr key={week}>
                <td><strong>Week {week}</strong></td>
                <td>{topic}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="sub-header">How the Phases Use This Matrix</div>
      <div className="timeline-card">
        <div className="phase-list">
          {weekPairs.map((item) => (
            <div key={item.weeks} className="phase-item active">
              <span className="phase-dot" style={{ background: 'var(--ink-blue)' }} />
              <div>
                <strong>Weeks {item.weeks}</strong>
                <p>{item.block1} + {item.block2}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="sub-header">Week-by-Week Topic List</div>
      <div className="week-history-list">
        {WEEK_PLAN.map((item) => (
          <div key={item.week} className="week-history-row">
            <div>
              <strong>Week {item.week}</strong>
              <p className="muted">{item.topic}</p>
            </div>
            <div className="week-history-kpis">
              <span>{item.week <= 4 ? 'History/Polity' : item.week <= 8 ? 'Geography/Economy' : item.week <= 10 ? 'Science/Env' : 'Revision'}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="alert alert-info">
        <strong>Math note:</strong> Block 4 is {proMode ? '1 hour (18:30–19:30)' : '45 minutes (17:00–17:45)'} on weekdays, with extra math boosters on Saturday and Sunday.
      </div>
    </section>
  );
}