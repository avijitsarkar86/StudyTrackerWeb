import { CalendarClock, ArrowRight } from 'lucide-react';
import { PHASES } from '../constants/studyData';
import { getWeekDateRange, localDateKey } from '../utils/dateHelpers';

export default function OnboardingModal({ selectedDate, onDateChange, onStart }) {
  const phaseRows = PHASES.map((phase) => {
    const phaseStart = new Date(`${localDateKey(selectedDate)}T00:00:00`);
    phaseStart.setDate(phaseStart.getDate() + (phase.weeks[0] - 1) * 7);
    const syntheticWeek = phase.weeks[0];
    return {
      ...phase,
      dateRange: getWeekDateRange(syntheticWeek, localDateKey(selectedDate)),
    };
  });

  return (
    <div className="overlay">
      <div className="modal onboarding">
        <div className="cover-ribbon">WBCS + WBPSC Misc 2026-27</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '12px 0 4px' }}>
          <CalendarClock size={28} color="#3182ce" />
          <h1 style={{ margin: 0 }}>Study Tracker Web</h1>
        </div>
        <p className="muted">Set your preparation start date to generate the 26-week schedule.</p>

        <label className="label" htmlFor="start-date">Preparation start date</label>
        <input
          id="start-date"
          className="input"
          type="date"
          value={localDateKey(selectedDate)}
          onChange={(e) => onDateChange(new Date(`${e.target.value}T00:00:00`))}
        />

        <div className="phase-preview">
          {phaseRows.map((phase) => (
            <div key={phase.phase} className="phase-row">
              <span className="phase-dot" style={{ background: phase.color }} />
              <div>
                <strong>Phase {phase.phase}: {phase.shortName}</strong>
                <p className="muted small">Weeks {phase.weeks[0]}-{phase.weeks[1]} | starts near {phase.dateRange}</p>
              </div>
            </div>
          ))}
        </div>

        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', gap: 8, marginTop: 4, padding: '12px 20px', fontSize: 14 }} onClick={onStart}>
          <ArrowRight size={16} />
          Generate My Timeline
        </button>
      </div>
    </div>
  );
}
