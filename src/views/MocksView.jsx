import { useMemo, useState } from 'react';
import { SCORE_TARGETS } from '../constants/studyData';
import { formatDateShort, getCurrentWeek, getPhaseInfo } from '../utils/dateHelpers';
import { useStudy } from '../context/StudyContext';

export default function MocksView() {
  const { mockScores, addMockScore, deleteMockScore, settings } = useStudy();
  const [tab, setTab] = useState('wbcs');
  const [score, setScore] = useState('');
  const [weakArea, setWeakArea] = useState('');

  const week = getCurrentWeek(settings.startDate);
  const phase = getPhaseInfo(week);
  const target = SCORE_TARGETS[phase.phase] || SCORE_TARGETS[4];
  const [minTarget, maxTarget] = target[tab] || [0, 200];
  const entries = mockScores[tab] || [];

  const sortedEntries = useMemo(() => [...entries].sort((a, b) => new Date(b.date) - new Date(a.date)), [entries]);

  const onAdd = () => {
    const parsed = Number(score);
    if (!Number.isFinite(parsed) || parsed < 0 || parsed > 200) {
      alert('Enter a valid score between 0 and 200.');
      return;
    }
    addMockScore(tab, {
      week,
      date: new Date().toISOString(),
      score: parsed,
      total: 200,
      percentage: Math.round((parsed / 200) * 100),
      weakArea: weakArea.trim() || 'Not noted',
      exam: tab,
    });
    setScore('');
    setWeakArea('');
  };

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Section 03</p>
          <h2>Mock Tracker</h2>
        </div>
        <div className="tab-group">
          <button className={tab === 'wbcs' ? 'tab active' : 'tab'} onClick={() => setTab('wbcs')}>WBCS</button>
          <button className={tab === 'misc' ? 'tab active' : 'tab'} onClick={() => setTab('misc')}>Misc</button>
        </div>
      </div>

      <div className="sub-header">Score Target Progression</div>
      <div className="target-card">
        <h3>Phase {phase.phase} target</h3>
        <p className="target-score">{minTarget}-{maxTarget}<span>/200</span></p>
        <p className="muted">{target.label}</p>
      </div>

      <div className="sub-header">Add New Mock Entry</div>
      <div className="form-grid">
        <input className="input" type="number" min="0" max="200" placeholder="Score / 200" value={score} onChange={(e) => setScore(e.target.value)} />
        <input className="input" placeholder="Top weak area" value={weakArea} onChange={(e) => setWeakArea(e.target.value)} />
        <button className="btn btn-primary" onClick={onAdd}>Add score</button>
      </div>

      <div className="sub-header">Mock Score Tracker</div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Week</th>
            <th>Score / 200</th>
            <th>%</th>
            <th>Top Weak Area</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedEntries.length === 0 ? (
            <tr>
              <td colSpan={7} className="muted">No scores logged yet.</td>
            </tr>
          ) : (
            sortedEntries.map((entry) => (
              <tr key={entry.id}>
                <td>{formatDateShort(entry.date)}</td>
                <td>{entry.week}</td>
                <td><strong>{entry.score}</strong></td>
                <td>{entry.percentage}%</td>
                <td>{entry.weakArea}</td>
                <td>
                  <span className={entry.score >= minTarget ? 'tag tag-green' : 'tag tag-red'}>
                    {entry.score >= minTarget ? 'On Target' : 'Below Target'}
                  </span>
                </td>
                <td>
                  <button className="btn btn-ghost" onClick={() => deleteMockScore(tab, entry.id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="alert alert-info">
        <strong>Dual Strategy:</strong> Keep WBCS and Misc score patterns separate and compare trends after every 4 mocks.
      </div>
    </section>
  );
}
