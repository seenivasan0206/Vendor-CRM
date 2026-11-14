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

  return (
    <div className="crm-app-container">
      {/* 1. Full Sidebar with all items preserved */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* 2. Header */}
      <div className="crm-main-layout">
        <Header
          activeTab={activeTab}
          onNotificationsClick={() => setActiveTab('notifications')}
        />

        {/* 3. Main Workspace Area: Shows only your 4 modules, nothing for other tabs */}
        <main className="crm-workspace">
          {activeTab === 'purchaseorders' && <Purchaseorder />}
          {activeTab === 'inventory' && <Inventory />}
          {activeTab === 'payments' && <Payment />}
          {activeTab === 'performance' && <Vendorperformance />}
        </main>
      </div>
    </div>
  );
}

export default App;
