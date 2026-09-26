import { useRef } from 'react';
import { useStudy } from '../context/StudyContext';
import { clearPersistedState, exportStateAsFile, parseImportedBackup } from '../utils/storage';

export default function SettingsView() {
  const { settings, updateSettings, dailyProgress, mockScores, errorLog, missedDays, restoreData, resetAll, cloud } = useStudy();
  const fileInputRef = useRef(null);

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
      alert('Backup imported successfully.');
    } catch (err) {
      alert(err.message || 'Invalid backup file.');
    } finally {
      event.target.value = '';
    }
  };

  const onReset = () => {
    const ok = window.confirm('Delete all progress, mocks, and error logs? This cannot be undone.');
    if (!ok) return;
    clearPersistedState();
    resetAll();
  };

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Section 05</p>
          <h2>Settings & Data</h2>
        </div>
      </div>

      <div className="sub-header">Timeline Configuration</div>
      <table>
        <thead>
          <tr>
            <th>Setting</th>
            <th>Current Value</th>
            <th>Update</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Start date</strong></td>
            <td>{settings.startDate}</td>
            <td>
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
            <td><strong>Show onboarding on next load</strong></td>
            <td>{settings.firstLaunchComplete ? 'No' : 'Yes'}</td>
            <td>
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
            <td><strong>Cloud sync mode</strong></td>
            <td>{cloud?.status || 'local-only'}</td>
            <td>{cloud?.enabled ? 'Firebase enabled' : 'Add Firebase env keys to enable'}</td>
          </tr>
        </tbody>
      </table>

      <div className="sub-header">Backup & Restore</div>
      <table>
        <thead>
          <tr>
            <th>Action</th>
            <th>Description</th>
            <th>Execute</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Export JSON backup</strong></td>
            <td>Save all current data to a local JSON file.</td>
            <td><button className="btn btn-primary" onClick={onExport}>Export</button></td>
          </tr>
          <tr>
            <td><strong>Import JSON backup</strong></td>
            <td>Restore tracker state from a previously exported JSON file.</td>
            <td>
              <button className="btn btn-ghost" onClick={() => fileInputRef.current?.click()}>Import</button>
              <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={onImport} />
            </td>
          </tr>
          <tr>
            <td><strong>Reset all data</strong></td>
            <td>Clear progress, mock scores, and error logs permanently.</td>
            <td><button className="btn btn-danger" onClick={onReset}>Reset</button></td>
          </tr>
        </tbody>
      </table>

      <div className="note-box">
        <strong>Storage note</strong>
        <p>
          This web app uses LocalStorage by default and automatically switches to Firebase sync when valid VITE_FIREBASE_* environment keys are provided. JSON export/import remains available for backup.
        </p>
      </div>

      <div className="alert alert-info">
        <strong>Recommended:</strong> Export a JSON backup after every mock weekend to avoid accidental data loss.
      </div>
    </section>
  );
}
