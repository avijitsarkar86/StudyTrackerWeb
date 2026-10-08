import { useRef } from 'react';
import { Bell, Briefcase, Calendar, Cloud, Download, GitBranch, HardDrive, LogOut, Settings, Shield, Trash2, Upload } from 'lucide-react';
import { NON_NEGOTIABLE_RULES } from '../constants/studyData';
import { useStudy } from '../context/StudyContext';
import { getCurrentWeek, getWeekDateRange } from '../utils/dateHelpers';
import { clearPersistedState, exportStateAsFile, parseImportedBackup } from '../utils/storage';
import { useDialog } from '../hooks/useDialog';

export default function SettingsView() {
  const {
    settings,
    updateSettings,
    dailyProgress,
    mockScores,
    errorLog,
    missedDays,
    restoreData,
    resetAll,
    cloud,
    signInWithGoogle,
    signOutFromCloud,
  } = useStudy();
  const fileInputRef = useRef(null);
  const { confirm, showToast, Dialog } = useDialog();
  const week = getCurrentWeek(settings.startDate);
  const weekRange = getWeekDateRange(week, settings.startDate);
  const notifications = settings.notifications || {
    enabled: false,
    mockDayAlert: true,
    morningTime: '06:00',
    eveningTime: '22:00',
  };

  const onExport = () => {
    exportStateAsFile({ dailyProgress, mockScores, errorLog, missedDays, settings });
  };

  const onImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    try {
      const parsed = parseImportedBackup(text);
      restoreData(parsed);
      showToast('Backup imported successfully.');
    } catch (err) {
      showToast(err.message || 'Invalid backup file.', 'error');
    } finally {
      event.target.value = '';
    }
  };

  const onReset = async () => {
    const ok = await confirm('Delete all progress, mocks, and error logs? This cannot be undone.', { title: 'Reset all data', dangerous: true });
    if (!ok) return;
    clearPersistedState();
    resetAll();
  };

  const onConnectGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch {
      // Auth error is surfaced in cloud.authError.
    }
  };

  const onSignOutGoogle = async () => {
    const ok = await confirm('Sign out from Google cloud sync on this browser? Local data will remain available.', { title: 'Sign out' });
    if (!ok) return;
    try {
      await signOutFromCloud();
    } catch {
      // Auth error is surfaced in cloud.authError.
    }
  };

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Section 05</p>
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 7 }}><Settings size={18} color="#3182ce" /> Settings &amp; Data</h2>
        </div>
      </div>

      <div className="sub-header"><Calendar size={13} /> Study Period</div>
      <div className="settings-card">
        <div className="settings-row"><span>Start Date</span><strong>{settings.startDate}</strong></div>
        <div className="settings-row"><span>Current Week</span><strong>Week {week} of 26</strong></div>
        <div className="settings-row"><span>Week Range</span><strong>{weekRange}</strong></div>
      </div>

      <div className="sub-header"><Briefcase size={13} /> Schedule Mode</div>
      <div className="settings-card">
        <div className="toggle-row">
          <div>
            <strong>Working Professional Mode</strong>
            <p className="muted">Shifts to a 8.75h study plan with a 4h work window (10:30–14:30). Math extended to 1h/day. Block 1, 2 &amp; 3 trimmed to fit.</p>
          </div>
          <input
            type="checkbox"
            checked={Boolean(settings.workingProfMode)}
            onChange={(e) => updateSettings({ workingProfMode: e.target.checked })}
          />
        </div>
      </div>

      <div className="sub-header"><Bell size={13} /> Reminder Preferences (Web)</div>
      <div className="settings-card">
        <div className="toggle-row">
          <div>
            <strong>Enable reminders</strong>
            <p className="muted">Stores your reminder preferences in profile settings.</p>
          </div>
          <input
            type="checkbox"
            checked={Boolean(notifications.enabled)}
            onChange={(e) => updateSettings({ notifications: { ...notifications, enabled: e.target.checked } })}
          />
        </div>
        <div className="toggle-row">
          <div>
            <strong>Mock Saturday alerts</strong>
            <p className="muted">Flag mock-day reminder preference.</p>
          </div>
          <input
            type="checkbox"
            checked={Boolean(notifications.mockDayAlert)}
            onChange={(e) => updateSettings({ notifications: { ...notifications, mockDayAlert: e.target.checked } })}
          />
        </div>
        <div className="time-grid">
          <label className="time-field">
            <span className="label">Morning reminder</span>
            <input
              className="input"
              type="time"
              value={notifications.morningTime || '06:00'}
              onChange={(e) => updateSettings({ notifications: { ...notifications, morningTime: e.target.value } })}
            />
          </label>
          <label className="time-field">
            <span className="label">Evening reminder</span>
            <input
              className="input"
              type="time"
              value={notifications.eveningTime || '22:00'}
              onChange={(e) => updateSettings({ notifications: { ...notifications, eveningTime: e.target.value } })}
            />
          </label>
        </div>
      </div>

      <div className="sub-header"><GitBranch size={13} /> Timeline Configuration</div>
      <table className="responsive-table">
        <thead>
          <tr>
            <th>Setting</th>
            <th>Current Value</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td data-label="Setting"><strong>Start date</strong></td>
            <td data-label="Current Value">{settings.startDate}</td>
            <td data-label="Update">
              <input
                id="start-date-settings"
                className="input"
                type="date"
                value={settings.startDate}
                onChange={(e) => updateSettings({ startDate: e.target.value })}
              />
            </td>
          </tr>
          <tr>
            <td data-label="Setting"><strong>Show onboarding on next load</strong></td>
            <td data-label="Current Value">{settings.firstLaunchComplete ? 'No' : 'Yes'}</td>
            <td data-label="Update">
              <select
                id="first-launch"
                className="input"
                value={settings.firstLaunchComplete ? 'yes' : 'no'}
                onChange={(e) => updateSettings({ firstLaunchComplete: e.target.value === 'yes' })}
              >
                <option value="yes">No</option>
                <option value="no">Yes</option>
              </select>
            </td>
          </tr>
          <tr>
            <td data-label="Setting"><strong>Cloud sync mode</strong></td>
            <td data-label="Current Value">{cloud?.status || 'local-only'}</td>
            <td data-label="Update">{cloud?.enabled ? 'Firebase enabled' : 'Add Firebase env keys to enable'}</td>
          </tr>
        </tbody>
      </table>

      <div className="sub-header"><Cloud size={13} /> Google Cloud Sync</div>
      <div className="settings-card">
        <div className="settings-row">
          <span>Connection</span>
          <strong>{cloud?.status || 'local-only'}</strong>
        </div>
        <div className="settings-row">
          <span>Profile photo</span>
          {cloud?.user?.photoURL ? (
            <img className="user-avatar" src={cloud.user.photoURL} alt="Signed-in profile" referrerPolicy="no-referrer" />
          ) : (
            <strong>Not available</strong>
          )}
        </div>
        <div className="settings-row">
          <span>Display name</span>
          <strong>{cloud?.user?.displayName || 'Not available'}</strong>
        </div>
        <div className="settings-row">
          <span>Email address</span>
          <strong>{cloud?.user?.email || 'Not available'}</strong>
        </div>
        {cloud?.authError ? <p className="muted">Auth error: {cloud.authError}</p> : null}
        <div className="table-actions" style={{ marginTop: 12 }}>
          {cloud?.enabled ? (
            cloud?.uid ? (
              <button className="btn btn-ghost" onClick={onSignOutGoogle}><LogOut size={13} /> Sign Out</button>
            ) : (
              <button className="btn btn-primary" onClick={onConnectGoogle}>Sign In with Google</button>
            )
          ) : (
            <p className="muted">Add Firebase env keys to enable Google sync.</p>
          )}
        </div>
      </div>

      <div className="sub-header"><HardDrive size={13} /> Backup &amp; Restore</div>
      <table className="responsive-table">
        <thead>
          <tr>
            <th>Action</th>
            <th>Description</th>
            <th>Execute</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td data-label="Action"><strong>Export JSON backup</strong></td>
            <td data-label="Description">Save all current data to a local JSON file.</td>
            <td data-label="Execute"><button className="btn btn-primary" onClick={onExport}>Export</button></td>
          </tr>
          <tr>
            <td data-label="Action"><strong>Import JSON backup</strong></td>
            <td data-label="Description">Restore tracker state from a previously exported JSON file.</td>
            <td data-label="Execute">
              <button className="btn btn-ghost" onClick={() => fileInputRef.current?.click()}><Upload size={13} /> Import</button>
              <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={onImport} />
            </td>
          </tr>
          <tr>
            <td data-label="Action"><strong>Reset all data</strong></td>
            <td data-label="Description">Clear progress, mock scores, and error logs permanently.</td>
            <td data-label="Execute"><button className="btn btn-danger" onClick={onReset}>Reset</button></td>
          </tr>
        </tbody>
      </table>

      <div className="note-box">
        <strong>Storage note</strong>
        <p>
          This web app always stores data in LocalStorage. When you sign in with Google and Firebase is configured, the same state is also synced to Firestore so your data aligns across devices for that account.
        </p>
      </div>

      <div className="sub-header"><Shield size={13} /> Non-Negotiable Rules</div>
      <div className="settings-card">
        <ol className="rules-list">
          {NON_NEGOTIABLE_RULES.map((rule) => (
            <li key={rule}>{rule}</li>
          ))}
        </ol>
      </div>

      <div className="settings-foot muted">
        <p>WBCS & WBPSC Study Tracker Web</p>
        <p>Dual Exam Edition • 26-week cycle</p>
      </div>

      <div className="alert alert-info">
        <strong>Recommended:</strong> Export a JSON backup after every mock weekend to avoid accidental data loss.
      </div>
      {Dialog}
    </section>
  );
}
