import React, { useState } from 'react';
import '../Styles/Sidebar.css';

const menuSections = [
  {
    category: 'OVERVIEW',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: '📊' }
    ]
  },
  {
    category: 'PROCUREMENT',
    items: [
      { id: 'vendors', label: 'Vendors', icon: '🏢' },
      { id: 'contracts', label: 'Contracts', icon: '📜' },
      { id: 'products', label: 'Products & Services', icon: '📦' },
      { id: 'purchaseorders', label: 'Purchase Orders', icon: '🛒' }
    ]
  },
  {
    category: 'OPERATIONS & FINANCE',
    items: [
      { id: 'inventory', label: 'Inventory', icon: '🏭' },
      { id: 'payments', label: 'Invoices & Payments', icon: '💳' }
    ]
  },
  {
    category: 'PERFORMANCE & CHAT',
    items: [
      { id: 'performance', label: 'Vendor Performance', icon: '⭐' },
      { id: 'communication', label: 'Communication', icon: '💬' },
      { id: 'reports', label: 'Reports & Analytics', icon: '📈' }
    ]
  },
  {
    category: 'SYSTEM',
    items: [
      { id: 'notifications', label: 'Notifications', icon: '🔔' },
      { id: 'settings', label: 'Settings', icon: '⚙️' }
    ]
  }
];

function Sidebar({ activeTab, setActiveTab }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`crm-sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="crm-brand">
        <div className="crm-brand-left">
          <span className="brand-icon">⚡</span>
          {!isCollapsed && <span className="brand-title">VendorCRM</span>}
        </div>
        <button
          type="button"
          className="sidebar-toggle-btn"
          onClick={() => setIsCollapsed((prev) => !prev)}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? '»' : '«'}
        </button>
      </div>

      <nav className="crm-nav">
        {menuSections.map((section, idx) => (
          <div key={idx} className="nav-group">
            {!isCollapsed && (
              <span className="nav-group-title">{section.category}</span>
            )}
            <div className="nav-group-items">
              {section.items.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`nav-btn ${activeTab === item.id ? 'active' : ''}`}
                >
                  <span className="nav-icon">{item.icon}</span>
                  {!isCollapsed && (
                    <span className="nav-label">{item.label}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
