import React from 'react';
import '../Styles/Header.css';

const pageTitles = {
  dashboard: 'Dashboard Overview',
  vendors: 'Vendor Management',
  contracts: 'Contract Management',
  products: 'Products & Services Catalog',
  purchaseorders: 'Purchase Orders',
  inventory: 'Inventory & Stock Management',
  payments: 'Invoices & Payments',
  performance: 'Vendor Performance & Rating',
  communication: 'Vendor Communication',
  reports: 'Reports & Analytics',
  notifications: 'Notifications & Alerts',
  settings: 'System Settings & Administration',
};

function Header({ activeTab }) {
  const currentTitle = pageTitles[activeTab] || 'Dashboard Overview';

  return (
    <header className="crm-header">
      {/* Dynamic Title */}
      <div className="header-left">
        <h1 className="header-title">{currentTitle}</h1>
      </div>

      {/* Right Side: Alerts & User Profile */}
      <div className="header-right">
        {/* Notification Bell */}
        <div className="header-action-btn" title="Notifications">
          <span className="bell-icon">🔔</span>
          <span className="notification-badge">3</span>
        </div>

        {/* User Profile Pill */}
        <div className="header-user-profile">
          <div className="user-avatar">AD</div>
          <div className="user-info">
            <span className="user-name">Admin User</span>
            <span className="user-role">Administrator</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
