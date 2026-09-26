import { useMemo, useState } from 'react';
import { SCORE_TARGETS } from '../constants/studyData';
import { formatDateShort, getCurrentWeek, getPhaseInfo } from '../utils/dateHelpers';
import { useStudy } from '../context/StudyContext';

export default function MocksView() {
  const { mockScores, addMockScore, deleteMockScore, settings } = useStudy();
  const [tab, setTab] = useState('wbcs');
  const [showForm, setShowForm] = useState(false);
  const [score, setScore] = useState('');
  const [weakArea, setWeakArea] = useState('');

  const week = getCurrentWeek(settings.startDate);
  const phase = getPhaseInfo(week);
  const target = SCORE_TARGETS[phase.phase] || SCORE_TARGETS[4];
  const [minTarget, maxTarget] = target[tab] || [0, 200];
  const entries = mockScores[tab] || [];
  const tabColor = tab === 'wbcs' ? '#2c5282' : '#276749';
  const lastScore = entries.length ? entries[entries.length - 1] : null;

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
    setShowForm(false);
  };

  const onDelete = (id) => {
    const ok = window.confirm('Remove this mock score entry?');
    if (!ok) return;
    deleteMockScore(tab, id);
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
      <div className="target-card" style={{ borderLeft: `4px solid ${tabColor}` }}>
        <h3>Phase {phase.phase} target</h3>
        <p className="target-score">{minTarget}-{maxTarget}<span>/200</span></p>
        <p className="muted">{target.label}</p>
        {lastScore && (
          <p className="muted" style={{ marginTop: 6 }}>
            Last score: <strong>{lastScore.score}/200 ({lastScore.percentage}%)</strong>
          </p>
        )}
      </div>

      <div className="sub-header">Score History ({entries.length})</div>
      <div className="row-actions" style={{ marginBottom: 10 }}>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          Add Score
        </button>
      </div>

      <div className="list-stack">
        {sortedEntries.length === 0 ? (
          <div className="empty-card muted">No scores logged yet. Add your first mock score.</div>
        ) : (
          sortedEntries.map((entry) => (
            <div key={entry.id} className="score-card">
              <div className="score-main">
                <div>
                  <p className="score-value">{entry.score}<span>/200</span></p>
                  <p className="muted">{entry.percentage}% · Week {entry.week}</p>
                </div>
                <span className={entry.score >= minTarget ? 'tag tag-green' : 'tag tag-red'}>
                  {entry.score >= minTarget ? 'On Target' : 'Below Target'}
                </span>
              </div>
              <p className="muted">{formatDateShort(entry.date)}</p>
              <p className="score-weak">Weak area: {entry.weakArea}</p>
              <div className="row-actions">
                <button className="btn btn-ghost" onClick={() => onDelete(entry.id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="alert alert-info">
        <strong>Dual Strategy:</strong> Keep WBCS and Misc score patterns separate and compare trends after every 4 mocks.
      </div>

      {showForm && (
        <div className="overlay" onClick={() => setShowForm(false)}>
          <div className="modal quick-modal" onClick={(e) => e.stopPropagation()}>
            <div className="panel-header" style={{ marginBottom: 12 }}>
              <div>
                <p className="eyebrow">New Mock</p>
                <h3>{tab === 'wbcs' ? 'WBCS Prelims' : 'Misc Prelims'} · Week {week}</h3>
              </div>
              <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Close</button>
            </div>
            <div className="form-grid">
              <input className="input" type="number" min="0" max="200" placeholder="Score / 200" value={score} onChange={(e) => setScore(e.target.value)} />
              <input className="input" placeholder="Top weak area" value={weakArea} onChange={(e) => setWeakArea(e.target.value)} />
              <button className="btn btn-primary" onClick={onAdd}>Save Score</button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
