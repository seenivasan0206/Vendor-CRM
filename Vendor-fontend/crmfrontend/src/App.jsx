import { useState } from 'react';
import './App.css';
import Sidebar from './Header/Sidebar';
import Header from './Header/Header';
import Login from './Auth/Login';
import { authService } from './services/authService';
import Dashboard from './Component/Dashboard';
import Vendor from './Component/Vendor';
import Contractmanage from './Component/Contractmanage';
import ProductService from './Component/ProductService';
import Purchaseorder from './Component/Purchaseorder';
import Inventory from './Component/Inventory';
import Payment from './Component/Payment';
import Vendorperformance from './Component/Vendorperformance';
import Vendorcommunication from './Component/Vendorcommunication';
import Reports from './Component/Reports';
import Notification from './Component/Notification';
import Settings from './Component/Settings';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
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
    'dashboard',
    'vendors',
    'contracts',
    'products',
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
          {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
          {activeTab === 'vendors' && <Vendor setActiveTab={setActiveTab} />}
          {activeTab === 'contracts' && <Contractmanage />}
          {activeTab === 'products' && <ProductService />}
          {activeTab === 'purchaseorders' && <Purchaseorder />}
          {activeTab === 'inventory' && <Inventory />}
          {activeTab === 'payments' && <Payment />}
          {activeTab === 'performance' && <Vendorperformance />}
          {activeTab === 'communication' && <Vendorcommunication />}
          {activeTab === 'reports' && <Reports />}
          {activeTab === 'notifications' && <Notification />}
          {activeTab === 'settings' && <Settings />}

          {!isModuleActive && (
            <div className="workspace-placeholder-card">
              <h2>Coming Soon</h2>
              <p>
                The {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} module is not available yet.
                Please select another menu item from the sidebar.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
