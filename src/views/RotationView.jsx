import { BLOCK2_ROTATION, WEEKLY_ROTATION, WEEK_PLAN } from '../constants/studyData';

const weekPairs = [
  { weeks: '1-4', block1: 'History + Polity', block2: 'Polity booster' },
  { weeks: '5-8', block1: 'Geography + Economy', block2: 'Geography / Economy drill' },
  { weeks: '9-10', block1: 'Science + Environment', block2: 'Science / Environment recall' },
  { weeks: '11-12', block1: '2nd read cycle', block2: 'PYQ correction' },
  { weeks: '19-24', block1: 'Revision cycle', block2: 'Timed practice + review' },
];

export default function RotationView() {
  const block1Rows = Object.entries(WEEKLY_ROTATION);
  const block2Rows = Object.entries(BLOCK2_ROTATION);

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Section 08</p>
          <h2>Weekly Subject-Rotation Matrix</h2>
          <p className="muted">Block 1 and Block 2 are paired here so you can see the weekly subject flow in one place.</p>
        </div>
      </div>

      <div className="sub-header">Rotation Map</div>
      <div className="subject-grid" style={{ marginBottom: 14 }}>
        <div>
          <span>Block 1</span>
          <strong>Primary GS rotation</strong>
          <p className="muted">Use this for the main reading block from Monday to Friday.</p>
        </div>
        <div>
          <span>Block 2</span>
          <strong>Compulsory subject booster</strong>
          <p className="muted">Use this for the daily paired revision and practice slot.</p>
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
        <strong>Math note:</strong> Block 4 is 45 minutes on weekdays, with extra math boosters on Saturday and Sunday.
      </div>
    </section>
  );
}