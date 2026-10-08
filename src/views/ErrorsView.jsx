import { useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, CircleDot, ClipboardX, List, PlusCircle, RefreshCw, Trash2, X } from 'lucide-react';
import { ERROR_TYPES } from '../constants/studyData';
import { formatDateShort } from '../utils/dateHelpers';
import { useStudy } from '../context/StudyContext';
import { useDialog } from '../hooks/useDialog';

export default function ErrorsView() {
  const { errorLog, addError, updateError, deleteError } = useStudy();
  const { confirm, showToast, Dialog } = useDialog();
  const [tab, setTab] = useState('wbcs');
  const [filter, setFilter] = useState('open');
  const [showForm, setShowForm] = useState(false);
  const [topic, setTopic] = useState('');
  const [type, setType] = useState('A');
  const [description, setDescription] = useState('');
  const tabColor = tab === 'wbcs' ? '#2c5282' : '#276749';

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
      showToast('Topic is required.', 'error');
      return;
    }
    addError(tab, { topic: topic.trim(), type, description: description.trim(), exam: tab });
    setTopic('');
    setDescription('');
    setType('A');
    setShowForm(false);
  };

  const onDelete = async (id) => {
    const ok = await confirm('Remove this error log entry?', { dangerous: true });
    if (!ok) return;
    deleteError(tab, id);
  };

  const counts = {
    total: entries.length,
    open: entries.filter((item) => !item.resolved).length,
    resolved: entries.filter((item) => item.resolved).length,
  };

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Section 04</p>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 7 }}><AlertCircle size={18} color="#3182ce" /> Error Log</h2>
        </div>
        <div className="tab-group">
          <button className={tab === 'wbcs' ? 'tab active' : 'tab'} onClick={() => setTab('wbcs')}>WBCS</button>
          <button className={tab === 'misc' ? 'tab active' : 'tab'} onClick={() => setTab('misc')}>Misc</button>
        </div>
      </div>

      <div className="kpi-row" style={{ marginBottom: 8 }}>
        <div className="kpi">
          <div className="kpi-head"><List size={12} color="#718096" /><strong>{counts.total}</strong></div>
          <span>Total</span>
        </div>
        <div className="kpi">
          <div className="kpi-head"><CircleDot size={12} color="#e53e3e" /><strong>{counts.open}</strong></div>
          <span>Open</span>
        </div>
        <div className="kpi">
          <div className="kpi-head"><CheckCircle2 size={12} color="#38a169" /><strong>{counts.resolved}</strong></div>
          <span>Resolved</span>
        </div>
      </div>

      <div className="sub-header">Log New Error</div>
      <div className="row-actions" style={{ marginBottom: 12 }}>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}><PlusCircle size={13} /> Add Error</button>
      </div>

      <div className="sub-header">Filter Error Entries</div>
      <div className="filter-row">
        <button className={filter === 'open' ? 'tab active' : 'tab'} onClick={() => setFilter('open')}><CircleDot size={11} /> Open</button>
        <button className={filter === 'resolved' ? 'tab active' : 'tab'} onClick={() => setFilter('resolved')}><CheckCircle2 size={11} /> Resolved</button>
        <button className={filter === 'all' ? 'tab active' : 'tab'} onClick={() => setFilter('all')}><List size={11} /> All</button>
      </div>

      <div className="list-stack">
        {filtered.length === 0 ? (
          <div className="empty-card">
            <ClipboardX size={36} color="#cbd5e0" />
            <p className="muted">No entries for this filter.</p>
          </div>
        ) : (
          filtered.map((entry) => (
            <div key={entry.id} className="error-card" style={{ borderLeft: `4px solid ${ERROR_TYPES[entry.type].color}` }}>
              <div className="score-main">
                <div>
                  <p className="error-topic">{entry.topic}</p>
                  <p className="muted">{formatDateShort(entry.date)}</p>
                </div>
                <span className="tag tag-yellow">{entry.type} - {ERROR_TYPES[entry.type].label}</span>
              </div>
              <p className="muted">{entry.description || 'No description'}</p>
              <div className="row-actions">
                <button
                  className={entry.resolved ? 'btn btn-good' : 'btn btn-ghost'}
                  onClick={() => updateError(tab, entry.id, { resolved: !entry.resolved })}
                >
                  {entry.resolved ? <><RefreshCw size={11} /> Reopen</> : <><CheckCircle2 size={11} /> Resolve</>}
                </button>
                <span className={entry.resolved ? 'tag tag-green' : 'tag tag-red'}>
                  {entry.resolved ? 'Resolved' : 'Open'}
                </span>
                <button className="btn btn-ghost" onClick={() => onDelete(entry.id)}><Trash2 size={12} /> Delete</button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="alert alert-warning">
        <strong>Rule:</strong> Maintain strict separation of WBCS and Misc error logs for accurate pattern tracking.
      </div>

      {showForm && (
        <div className="overlay" onClick={() => setShowForm(false)}>
          <div className="modal quick-modal" onClick={(e) => e.stopPropagation()}>
            <div className="panel-header" style={{ marginBottom: 12 }}>
              <div>
                <p className="eyebrow">New Error</p>
                <h3 style={{ color: tabColor }}>{tab === 'wbcs' ? 'WBCS Log' : 'Misc Log'}</h3>
              </div>
              <button className="btn btn-ghost" onClick={() => setShowForm(false)}><X size={13} /></button>
            </div>

            <div className="form-grid triple">
              <input className="input" placeholder="Topic" value={topic} onChange={(e) => setTopic(e.target.value)} />
              <select className="input" value={type} onChange={(e) => setType(e.target.value)}>
                {Object.entries(ERROR_TYPES).map(([k, v]) => <option value={k} key={k}>{k} - {v.label}</option>)}
              </select>
              <input className="input" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <button className="btn btn-primary" onClick={onAdd}>Save Error</button>
          </div>
        </div>
      )}
      {Dialog}
    </section>
  );
}
