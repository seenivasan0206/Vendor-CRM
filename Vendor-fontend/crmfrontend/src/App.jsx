import React, { useState } from 'react';
import './App.css';
import Sidebar from './Header/Sidebar';
import Header from './Header/Header';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="crm-app-container">
      {/* 1. Left Fixed Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 2. Right Side: Header + Workspace */}
      <div className="crm-main-layout">
        <Header activeTab={activeTab} />

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
