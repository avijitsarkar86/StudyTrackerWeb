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
  { key: 'today', label: 'Today', short: 'TOD' },
  { key: 'progress', label: 'Progress', short: 'PRG' },
  { key: 'mocks', label: 'Mocks', short: 'MCK' },
  { key: 'errors', label: 'Errors', short: 'ERR' },
  { key: 'settings', label: 'Settings', short: 'SET' },
];

function Shell() {
  const { isLoaded, settings, updateSettings, cloud, signInWithGoogle } = useStudy();
  const [activeTab, setActiveTab] = useState('today');
  const [startDate, setStartDate] = useState(new Date());
  const [isSigningIn, setIsSigningIn] = useState(false);

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

  const onSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signInWithGoogle();
    } catch {
      // Auth errors are already exposed by cloud.authError in context/state.
    } finally {
      setIsSigningIn(false);
    }
  };

  if (cloud?.enabled && (cloud?.status === 'connecting' || cloud?.status === 'syncing')) {
    return <div className="boot">Preparing secure Google login...</div>;
  }

  if (cloud?.enabled && !cloud?.uid) {
    return (
      <div className="container">
        <header className="cover">
          <div className="badge">Official Study Blueprint - Dual Exam Edition</div>
          <h1>
            WBCS &amp; WBPSC
            <br />
            <span>Study Tracker Web</span>
          </h1>
          <p className="cover-sub">Sign in with your Google account to start and keep your data synced across devices.</p>
          <div className="cover-divider" />
          <div className="cover-meta">
            <div className="meta-item"><div className="mlabel">Auth</div><div className="mvalue">Google Required</div></div>
            <div className="meta-item"><div className="mlabel">Storage</div><div className="mvalue">Cloud + Local</div></div>
            <div className="meta-item"><div className="mlabel">Sync</div><div className="mvalue">Per Account</div></div>
          </div>
        </header>

        <div className="page-body">
          <div className="alert alert-info">
            <strong>Login required.</strong> Please sign in with Google to continue.
            <div className="row-actions" style={{ marginTop: 8 }}>
              <button className="btn btn-primary" onClick={onSignIn} disabled={isSigningIn}>
                {isSigningIn ? 'Signing in...' : 'Continue with Google'}
              </button>
            </div>
            {cloud?.authError ? <p className="muted">{cloud.authError}</p> : null}
          </div>
        </div>
      </div>
    );
  }

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
          <div className="meta-item account-item">
            {cloud?.user?.photoURL ? (
              <img className="user-avatar" src={cloud.user.photoURL} alt="Signed-in profile" referrerPolicy="no-referrer" />
            ) : (
              <div className="user-avatar user-avatar-fallback">U</div>
            )}
            <div className="account-content">
              <div className="mlabel">Signed In Account</div>
              <div className="account-name">{cloud?.user?.displayName || 'Unknown User'}</div>
              <div className="account-email">{cloud?.user?.email || 'No email available'}</div>
            </div>
          </div>
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

      <nav className="bottom-nav" aria-label="Mobile section navigation">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            className={activeTab === item.key ? 'bottom-nav-btn active' : 'bottom-nav-btn'}
            onClick={() => setActiveTab(item.key)}
            aria-label={item.label}
          >
            <span className="bottom-nav-short">{item.short}</span>
            <span className="bottom-nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

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
