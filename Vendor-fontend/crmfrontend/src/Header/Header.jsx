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

function Header({ activeTab, user, onLogout, onNotificationsClick, onSettingsClick }) {
  const currentTitle = pageTitles[activeTab] || 'Dashboard Overview';
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const displayName = user?.fullName || user?.username || 'Admin User';
  const displayRole = user?.activeRole ? user.activeRole.replace('_', ' ') : 'Administrator';
  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'AD';

  return (
    <header className="crm-header">
      {/* Dynamic Title */}
      <div className="header-left">
        <h1 className="header-title">{currentTitle}</h1>
      </div>

      {/* Right Side: Alerts & User Profile */}
      <div className="header-right">
        {/* Notification Bell */}
        <button
          type="button"
          className="header-action-btn"
          title="View Notifications"
          onClick={onNotificationsClick}
        >
          <span className="bell-icon">🔔</span>
          <span className="notification-badge">3</span>
        </button>

        {/* User Profile Pill */}
        <div
          className="header-user-profile"
          onClick={onSettingsClick}
          title="Click to open Settings"
        >
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <span className="user-name">{displayName}</span>
            <span className="user-role">{displayRole}</span>
          </div>
        </div>

        {/* Logout Button */}
        {onLogout && (
          <button
            type="button"
            className="header-signout-btn"
            onClick={() => setShowLogoutConfirm(true)}
            title="Logout of Vendor CRM"
          >
            <span className="signout-icon">⏻</span>
            <span className="signout-label">Logout</span>
          </button>
        )}
      </div>

      {/* Sign Out Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="logout-modal-overlay">
          <div className="logout-modal" role="dialog" aria-modal="true" aria-labelledby="logout-title">
            <div className="logout-modal-icon">🚪</div>
            <h3 id="logout-title" className="logout-modal-title">
              Do you want to sign out?
            </h3>
            <p className="logout-modal-text">
              You will be signed out of Vendor CRM and returned to the login screen.
            </p>
            <div className="logout-modal-actions">
              <button
                type="button"
                className="logout-btn-cancel"
                onClick={() => setShowLogoutConfirm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="logout-btn-confirm"
                onClick={() => {
                  setShowLogoutConfirm(false);
                  onLogout();
                }}
              >
                Yes, Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
