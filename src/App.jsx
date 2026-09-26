import { useMemo, useState } from 'react';
import './index.css';
import OnboardingModal from './components/OnboardingModal';
import { StudyProvider, useStudy } from './context/StudyContext';
import ErrorsView from './views/ErrorsView';
import MocksView from './views/MocksView';
import ProgressView from './views/ProgressView';
import SettingsView from './views/SettingsView';
import TodayView from './views/TodayView';

const NAV_ITEMS = [
  { key: 'today', label: 'Today' },
  { key: 'progress', label: 'Progress' },
  { key: 'mocks', label: 'Mocks' },
  { key: 'errors', label: 'Errors' },
  { key: 'settings', label: 'Settings' },
];

function Shell() {
  const { isLoaded, settings, updateSettings } = useStudy();
  const [activeTab, setActiveTab] = useState('today');
  const [startDate, setStartDate] = useState(new Date());

  const view = useMemo(() => {
    if (activeTab === 'progress') return <ProgressView />;
    if (activeTab === 'mocks') return <MocksView />;
    if (activeTab === 'errors') return <ErrorsView />;
    if (activeTab === 'settings') return <SettingsView />;
    return <TodayView />;
  }, [activeTab]);

  if (!isLoaded) {
    return <div className="boot">Loading Study Tracker...</div>;
  }

  const showOnboarding = !settings.firstLaunchComplete;

  return (
    <div className="container">
      <header className="cover">
        <div className="badge">Official Study Blueprint - Dual Exam Edition</div>
        <h1>
          WBCS &amp; WBPSC
          <br />
          <span>Study Tracker Web</span>
        </h1>
        <p className="cover-sub">Integrated routine, mocks, errors, progress, and data backup</p>
        <div className="cover-divider" />
        <div className="cover-meta">
          <div className="meta-item"><div className="mlabel">Duration</div><div className="mvalue">26 Weeks</div></div>
          <div className="meta-item"><div className="mlabel">Phases</div><div className="mvalue">4 + Buffer</div></div>
          <div className="meta-item"><div className="mlabel">Storage</div><div className="mvalue">Local + JSON</div></div>
        </div>
      </header>

      <div className="page-body">
        <div className="section-header nav-section">
          <span className="sec-num">Navigate</span>
          <h2>Study Tracker Modules</h2>
        </div>

        <nav className="main-nav">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={activeTab === item.key ? 'nav-btn active' : 'nav-btn'}
              onClick={() => setActiveTab(item.key)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <main>{view}</main>
      </div>

      {showOnboarding && (
        <OnboardingModal
          selectedDate={startDate}
          onDateChange={setStartDate}
          onStart={() =>
            updateSettings({
              startDate: `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-${String(startDate.getDate()).padStart(2, '0')}`,
              firstLaunchComplete: true,
            })
          }
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <StudyProvider>
      <Shell />
    </StudyProvider>
  );
}
