import React, { useState } from 'react';
import './App.css';
import Sidebar from './Header/Sidebar';
import Header from './Header/Header';
import Purchaseorder from './Component/Purchaseorder';
import Inventory from './Component/Inventory';
import Payment from './Component/Payment';
import Vendorperformance from './Component/Vendorperformance';

function App() {
  const [activeTab, setActiveTab] = useState('purchaseorders');

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'purchaseorders':
        return <Purchaseorder />;
      case 'inventory':
        return <Inventory />;
      case 'payments':
        return <Payment />;
      case 'performance':
        return <Vendorperformance />;
      default:
        return (
          <div className="workspace-placeholder-card">
            <h2>
              Active Screen: <span className="screen-highlight">{activeTab}</span>
            </h2>
            <p>This module is ready to be built next.</p>
          </div>
        );
    }
  };

  return (
    <div className="crm-app-container">
      {/* 1. Left Fixed Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 2. Right Side: Header + Workspace */}
      <div className="crm-main-layout">
        <Header
          activeTab={activeTab}
          onNotificationsClick={() => setActiveTab('notifications')}
        />

        {/* 3. Main Workspace Area */}
        <main className="crm-workspace">
          {renderActiveScreen()}
        </main>
      </div>
    </div>
  );
}

export default App;
