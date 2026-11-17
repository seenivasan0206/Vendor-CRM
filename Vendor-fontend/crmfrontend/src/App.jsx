import { useState } from 'react';
import './App.css';
import Sidebar from './Header/Sidebar';
import Header from './Header/Header';

function App() {
  const [activeTab, setActiveTab] = useState('purchaseorders');
  const [currentUser, setCurrentUser] = useState(() => authService.getCurrentUser());

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  if (!currentUser) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  const isModuleActive = [
    'purchaseorders',
    'inventory',
    'payments',
    'performance',
    'communication',
    'reports',
    'notifications',
    'settings',
  ].includes(activeTab);

  return (
    <div className="crm-app-container">
      {/* 1. Full Sidebar with all items preserved */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 2. Header */}
      <div className="crm-main-layout">
        <Header
          activeTab={activeTab}
          user={currentUser}
          onLogout={handleLogout}
          onNotificationsClick={() => setActiveTab('notifications')}
          onSettingsClick={() => setActiveTab('settings')}
        />

        {/* 3. Main Workspace Area */}
        <main className="crm-workspace">
          <div className="workspace-placeholder-card">
            <h2>Current Active Screen: <span className="screen-highlight">{activeTab.toUpperCase()}</span></h2>
            <p>Header and Sidebar setup complete! Select any menu item from the sidebar to switch views.</p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
