import { useMemo, useState } from 'react';
import { ERROR_TYPES } from '../constants/studyData';
import { formatDateShort } from '../utils/dateHelpers';
import { useStudy } from '../context/StudyContext';

export default function ErrorsView() {
  const { errorLog, addError, updateError, deleteError } = useStudy();
  const [tab, setTab] = useState('wbcs');
  const [filter, setFilter] = useState('open');
  const [topic, setTopic] = useState('');
  const [type, setType] = useState('A');
  const [description, setDescription] = useState('');

  const entries = errorLog[tab] || [];
  const filtered = useMemo(() => {
    return entries
      .filter((e) => {
        if (filter === 'all') return true;
        if (filter === 'open') return !e.resolved;
        return e.resolved;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [entries, filter]);

  const onAdd = () => {
    if (!topic.trim()) {
      alert('Topic is required.');
      return;
    }
    addError(tab, { topic: topic.trim(), type, description: description.trim(), exam: tab });
    setTopic('');
    setDescription('');
    setType('A');
  };

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Section 04</p>
          <h2>Error Log</h2>
        </div>
        <div className="tab-group">
          <button className={tab === 'wbcs' ? 'tab active' : 'tab'} onClick={() => setTab('wbcs')}>WBCS</button>
          <button className={tab === 'misc' ? 'tab active' : 'tab'} onClick={() => setTab('misc')}>Misc</button>
        </div>
      </div>

      <div className="sub-header">Log New Error</div>
      <div className="form-grid triple">
        <input className="input" placeholder="Topic" value={topic} onChange={(e) => setTopic(e.target.value)} />
        <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
          {Object.entries(ERROR_TYPES).map(([k, v]) => <option value={k} key={k}>{k} - {v.label}</option>)}
        </select>
        <input className="input" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <button className="btn btn-primary" onClick={onAdd}>Add error</button>

      <div className="sub-header">Filter Error Entries</div>
      <div className="filter-row">
        <button className={filter === 'open' ? 'tab active' : 'tab'} onClick={() => setFilter('open')}>Open</button>
        <button className={filter === 'resolved' ? 'tab active' : 'tab'} onClick={() => setFilter('resolved')}>Resolved</button>
        <button className={filter === 'all' ? 'tab active' : 'tab'} onClick={() => setFilter('all')}>All</button>
      </div>

      <div className="sub-header">Error Register</div>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Topic</th>
            <th>Type</th>
            <th>Description</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={6} className="muted">No entries for this filter.</td>
            </tr>
          ) : filtered.map((entry) => (
            <tr key={entry.id}>
              <td>{formatDateShort(entry.date)}</td>
              <td><strong>{entry.topic}</strong></td>
              <td>
                <span className="tag tag-yellow">{entry.type} - {ERROR_TYPES[entry.type].label}</span>
              </td>
              <td>{entry.description || 'No description'}</td>
              <td>
                <span className={entry.resolved ? 'tag tag-green' : 'tag tag-red'}>
                  {entry.resolved ? 'Resolved' : 'Open'}
                </span>
              </td>
              <td>
                <div className="row-actions">
                  <button className={entry.resolved ? 'btn btn-good' : 'btn btn-ghost'} onClick={() => updateError(tab, entry.id, { resolved: !entry.resolved })}>
                    {entry.resolved ? 'Reopen' : 'Resolve'}
                  </button>
                  <button className="btn btn-ghost" onClick={() => deleteError(tab, entry.id)}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="alert alert-warning">
        <strong>Rule:</strong> Maintain strict separation of WBCS and Misc error logs for accurate pattern tracking.
      </div>
    </section>
  );
}
