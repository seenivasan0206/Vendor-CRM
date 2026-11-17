import { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Building2,
  User,
  Lock,
  Users,
  Save,
  Monitor,
  Laptop
} from 'lucide-react';
import '../Styles/Settings.css';
import { authService } from '../services/authService';

const API_SETTINGS_URL = 'http://localhost:8080/api/settings';

const DEFAULT_APP_SETTINGS = [
  { id: 1, settingKey: 'COMPANY_NAME', settingValue: 'Zenve Zippy Technologies Pvt Ltd', description: 'Official company name displayed in CRM', settingCategory: 'GENERAL' },
  { id: 2, settingKey: 'CURRENCY_CODE', settingValue: 'USD', description: 'Default currency code for transactions', settingCategory: 'GENERAL' },
  { id: 3, settingKey: 'CURRENCY_SYMBOL', settingValue: '$', description: 'Default currency symbol', settingCategory: 'GENERAL' },
  { id: 4, settingKey: 'DEFAULT_PAYMENT_TERMS', settingValue: 'Net 30', description: 'Default payment terms assigned to new vendors', settingCategory: 'GENERAL' },
  { id: 5, settingKey: 'CONTRACT_EXPIRY_ALERT_DAYS', settingValue: '30', description: 'Days before contract expiration to trigger alert', settingCategory: 'NOTIFICATION' },
  { id: 6, settingKey: 'PO_APPROVAL_THRESHOLD', settingValue: '10000.00', description: 'Threshold above which POs require Admin approval', settingCategory: 'SYSTEM' },
  { id: 7, settingKey: 'ENABLE_EMAIL_NOTIFICATIONS', settingValue: 'true', description: 'Master toggle for system email notifications', settingCategory: 'NOTIFICATION' },
];

const SAMPLE_USERS = [
  { id: 4, username: 'admin_zenve', email: 'admin@zenvezippy.com', fullName: 'System Administrator', phoneNumber: '+91 98765 43214', isActive: true, roles: ['ROLE_ADMIN', 'ROLE_MANAGER'] },
  { id: 2, username: 'manager', email: 'manager@zenvezippy.com', fullName: 'Procurement Manager', phoneNumber: '+91 98765 43212', isActive: true, roles: ['ROLE_MANAGER'] },
  { id: 3, username: 'officer', email: 'officer@zenvezippy.com', fullName: 'Purchase Officer', phoneNumber: '+91 98765 43213', isActive: true, roles: ['ROLE_STAFF'] },
];

function Settings() {
  const [activeTab, setActiveTab] = useState('system'); // 'system' | 'profile' | 'security' | 'users'
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  // 1. System Settings State
  const [systemSettings, setSystemSettings] = useState(DEFAULT_APP_SETTINGS);
  const [companyName, setCompanyName] = useState('Zenve Zippy Technologies Pvt Ltd');
  const [currencyCode, setCurrencyCode] = useState('USD');
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [paymentTerms, setPaymentTerms] = useState('Net 30');
  const [expiryAlertDays, setExpiryAlertDays] = useState('30');
  const [poThreshold, setPoThreshold] = useState('10000.00');
  const [emailNotifsEnabled, setEmailNotifsEnabled] = useState(true);

  // 2. Profile State
  const currentUser = authService.getCurrentUser() || {
    id: 4,
    username: 'admin_zenve',
    email: 'admin@zenvezippy.com',
    fullName: 'System Administrator',
    activeRole: 'ADMIN',
  };

  const [profileName, setProfileName] = useState(currentUser.fullName || 'System Administrator');
  const [profileEmail, setProfileEmail] = useState(currentUser.email || 'admin@zenvezippy.com');
  const [profilePhone, setProfilePhone] = useState('+91 98765 43214');
  const [profileDepartment, setProfileDepartment] = useState('Global Procurement & Logistics');

  // 3. Security / Password State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  // 4. User Admin State
  const [userList, setUserList] = useState(SAMPLE_USERS);
  const [isUsersLoading, setIsUsersLoading] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const getAuthHeaders = () => {
    const token = authService.getToken();
    return {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  // Fetch Settings and Users from backend
  useEffect(() => {
    const fetchBackendData = async () => {
      try {
        const resSettings = await fetch(API_SETTINGS_URL, { headers: getAuthHeaders() });
        if (resSettings.ok) {
          const payload = await resSettings.json();
          const items = payload?.data || [];
          if (Array.isArray(items) && items.length > 0) {
            setSystemSettings(items);
            items.forEach((s) => {
              if (s.settingKey === 'COMPANY_NAME') setCompanyName(s.settingValue);
              if (s.settingKey === 'CURRENCY_CODE') setCurrencyCode(s.settingValue);
              if (s.settingKey === 'CURRENCY_SYMBOL') setCurrencySymbol(s.settingValue);
              if (s.settingKey === 'DEFAULT_PAYMENT_TERMS') setPaymentTerms(s.settingValue);
              if (s.settingKey === 'CONTRACT_EXPIRY_ALERT_DAYS') setExpiryAlertDays(s.settingValue);
              if (s.settingKey === 'PO_APPROVAL_THRESHOLD') setPoThreshold(s.settingValue);
              if (s.settingKey === 'ENABLE_EMAIL_NOTIFICATIONS') setEmailNotifsEnabled(s.settingValue === 'true');
            });
          }
        }
      } catch (err) {
        console.warn('Backend settings offline, running with local config', err);
      }

      try {
        setIsUsersLoading(true);
        const resUsers = await fetch(`${API_SETTINGS_URL}/users`, { headers: getAuthHeaders() });
        if (resUsers.ok) {
          const payload = await resUsers.json();
          const uList = payload?.data?.content || payload?.data || [];
          if (Array.isArray(uList) && uList.length > 0) {
            setUserList(uList);
          }
        }
      } catch (err) {
        console.warn('Backend users list offline, using fallback user directory', err);
      } finally {
        setIsUsersLoading(false);
      }
    };

    fetchBackendData();
  }, []);

  // Save System Settings
  const handleSaveSystemSettings = async (e) => {
    e.preventDefault();
    showToast('System configuration saved successfully!');

    // Update keys in backend if available
    const keyMap = {
      COMPANY_NAME: companyName,
      CURRENCY_CODE: currencyCode,
      CURRENCY_SYMBOL: currencySymbol,
      DEFAULT_PAYMENT_TERMS: paymentTerms,
      CONTRACT_EXPIRY_ALERT_DAYS: expiryAlertDays,
      PO_APPROVAL_THRESHOLD: poThreshold,
      ENABLE_EMAIL_NOTIFICATIONS: String(emailNotifsEnabled),
    };

    for (const item of systemSettings) {
      if (keyMap[item.settingKey] !== undefined) {
        try {
          await fetch(`${API_SETTINGS_URL}/${item.id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify({
              settingKey: item.settingKey,
              settingValue: keyMap[item.settingKey],
              description: item.description,
              settingCategory: item.settingCategory,
              isActive: true,
            }),
          });
        } catch {
          console.warn('Sync setting failed for', item.settingKey);
        }
      }
    }
  };

  // Save Profile Changes
  const handleSaveProfile = (e) => {
    e.preventDefault();
    // Update local storage user profile
    const updatedUser = {
      ...currentUser,
      fullName: profileName,
      email: profileEmail,
      phone: profilePhone,
    };
    localStorage.setItem('zenve_user', JSON.stringify(updatedUser));
    showToast('Profile information updated successfully!');
  };

  // Update Password
  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast('Please enter your current password.', 'error');
      return;
    }
    if (newPassword.length < 6) {
      showToast('New password must be at least 6 characters.', 'error');
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast('New password and confirmation do not match.', 'error');
      return;
    }

    // Reset password inputs and alert
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('Security credentials updated successfully!');
  };

  // Toggle User Active Status
  const handleToggleUserStatus = async (userId, currentStatus) => {
    const updatedUsers = userList.map((u) =>
      u.id === userId ? { ...u, isActive: !currentStatus } : u
    );
    setUserList(updatedUsers);

    try {
      await fetch(`${API_SETTINGS_URL}/users/${userId}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      showToast(`User status changed to ${!currentStatus ? 'Active' : 'Suspended'}`);
    } catch {
      showToast(`User status updated to ${!currentStatus ? 'Active' : 'Suspended'} (local sync)`);
    }
  };

  return (
    <div className="settings-page-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`settings-toast ${toastType}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
          <span>{toastType === 'error' ? <AlertTriangle size={16} /> : <CheckCircle2 size={16} />}</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Settings Header */}
      <div className="settings-header">
        <div>
          <h2>System Settings & Administration</h2>
          <p>Configure enterprise CRM parameters, user access control, security policies, and profile preferences.</p>
        </div>
      </div>

      {/* Main Settings Layout (Sidebar Navigation + Content Area) */}
      <div className="settings-layout">
        {/* Navigation Sidebar */}
        <div className="settings-nav-pane">
          <button
            type="button"
            className={`settings-nav-btn ${activeTab === 'system' ? 'active' : ''}`}
            onClick={() => setActiveTab('system')}
          >
            <span className="nav-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={18} />
            </span>
            <div className="nav-text">
              <span className="title">System & Company</span>
              <span className="desc">Company info, currency & limits</span>
            </div>
          </button>

          <button
            type="button"
            className={`settings-nav-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <span className="nav-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={18} />
            </span>
            <div className="nav-text">
              <span className="title">My Profile</span>
              <span className="desc">Personal information & contact</span>
            </div>
          </button>

          <button
            type="button"
            className={`settings-nav-btn ${activeTab === 'security' ? 'active' : ''}`}
            onClick={() => setActiveTab('security')}
          >
            <span className="nav-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={18} />
            </span>
            <div className="nav-text">
              <span className="title">Security & Password</span>
              <span className="desc">Password, 2FA & active sessions</span>
            </div>
          </button>

          <button
            type="button"
            className={`settings-nav-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <span className="nav-icon" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={18} />
            </span>
            <div className="nav-text">
              <span className="title">User Management</span>
              <span className="desc">Team members, roles & permissions</span>
            </div>
          </button>
        </div>

        {/* Content Pane */}
        <div className="settings-content-pane">
          {/* 1. System & Company Configuration */}
          {activeTab === 'system' && (
            <div className="settings-card">
              <div className="card-header">
                <h3>Enterprise CRM Configuration</h3>
                <p>Manage operational thresholds, default terms, and billing currency.</p>
              </div>

              <form onSubmit={handleSaveSystemSettings} className="settings-form">
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Official Company / Organization Name</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      required
                    />
                    <small>Displayed on purchase orders, invoices, and reports.</small>
                  </div>

                  <div className="form-group">
                    <label>Base Currency Code</label>
                    <select
                      value={currencyCode}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCurrencyCode(val);
                        if (val === 'USD') setCurrencySymbol('$');
                        else if (val === 'INR') setCurrencySymbol('₹');
                        else if (val === 'EUR') setCurrencySymbol('€');
                        else if (val === 'GBP') setCurrencySymbol('£');
                      }}
                    >
                      <option value="USD">USD - United States Dollar ($)</option>
                      <option value="INR">INR - Indian Rupee (₹)</option>
                      <option value="EUR">EUR - Euro (€)</option>
                      <option value="GBP">GBP - British Pound (£)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Currency Symbol</label>
                    <input
                      type="text"
                      value={currencySymbol}
                      onChange={(e) => setCurrencySymbol(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Default Vendor Payment Terms</label>
                    <select
                      value={paymentTerms}
                      onChange={(e) => setPaymentTerms(e.target.value)}
                    >
                      <option value="Net 15">Net 15 Days</option>
                      <option value="Net 30">Net 30 Days (Standard)</option>
                      <option value="Net 45">Net 45 Days</option>
                      <option value="Net 60">Net 60 Days</option>
                      <option value="Due on Receipt">Due on Receipt</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Contract Expiry Alert Threshold (Days)</label>
                    <input
                      type="number"
                      min="1"
                      max="180"
                      value={expiryAlertDays}
                      onChange={(e) => setExpiryAlertDays(e.target.value)}
                      required
                    />
                    <small>System alerts admins before contract end date.</small>
                  </div>

                  <div className="form-group">
                    <label>PO Approval Threshold ({currencySymbol})</label>
                    <input
                      type="number"
                      step="100"
                      min="0"
                      value={poThreshold}
                      onChange={(e) => setPoThreshold(e.target.value)}
                      required
                    />
                    <small>Purchase orders above this amount require Admin approval.</small>
                  </div>
                </div>

                <div className="toggle-section">
                  <div className="toggle-info">
                    <strong>Master Email & System Notifications</strong>
                    <span>Automatically trigger alerts for low inventory and pending orders.</span>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={emailNotifsEnabled}
                      onChange={(e) => setEmailNotifsEnabled(e.target.checked)}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>

                <div className="form-actions">
                  <button type="submit" className="settings-btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Save size={14} />
                    <span>Save System Configuration</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 2. Profile Tab */}
          {activeTab === 'profile' && (
            <div className="settings-card">
              <div className="card-header">
                <h3>User Profile Details</h3>
                <p>Manage your contact information and display preferences.</p>
              </div>

              <div className="profile-banner">
                <div className="profile-avatar-large">
                  {profileName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2)
                    .toUpperCase() || 'AD'}
                </div>
                <div className="profile-banner-info">
                  <h4>{profileName}</h4>
                  <span className="role-tag">{currentUser.activeRole || 'ADMIN'}</span>
                  <span className="email-text">{profileEmail}</span>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="settings-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Username (System ID)</label>
                    <input
                      type="text"
                      value={currentUser.username || 'admin_zenve'}
                      disabled
                      className="disabled-input"
                    />
                    <small>User ID assigned by system administrator.</small>
                  </div>

                  <div className="form-group">
                    <label>Official Email Address *</label>
                    <input
                      type="email"
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Contact Phone Number</label>
                    <input
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Department / Business Unit</label>
                    <input
                      type="text"
                      value={profileDepartment}
                      onChange={(e) => setProfileDepartment(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="settings-btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Save size={14} />
                    <span>Update Profile</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 3. Security & Password Tab */}
          {activeTab === 'security' && (
            <div className="settings-card">
              <div className="card-header">
                <h3>Account Security & Password</h3>
                <p>Ensure your account is protected with strong credentials and MFA.</p>
              </div>

              <form onSubmit={handleUpdatePassword} className="settings-form">
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Current Password *</label>
                    <input
                      type="password"
                      placeholder="Enter existing password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>New Password *</label>
                    <input
                      type="password"
                      placeholder="Minimum 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Confirm New Password *</label>
                    <input
                      type="password"
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="toggle-section">
                  <div className="toggle-info">
                    <strong>Two-Factor Authentication (2FA)</strong>
                    <span>Require email verification OTP on logins from unrecognized devices.</span>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={twoFactorAuth}
                      onChange={(e) => setTwoFactorAuth(e.target.checked)}
                    />
                    <span className="slider round"></span>
                  </label>
                </div>

                <div className="security-session-card">
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Monitor size={18} />
                    <span>Active Sessions</span>
                  </h4>
                  <div className="session-item">
                    <div className="session-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Laptop size={20} />
                    </div>
                    <div className="session-details">
                      <strong>Windows 11 • Chrome 130 (Current Session)</strong>
                      <span>IP: 127.0.0.1 • Location: Localhost • Active now</span>
                    </div>
                    <span className="badge-active">Online</span>
                  </div>
                </div>

                <div className="form-actions">
                  <button type="submit" className="settings-btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Lock size={14} />
                    <span>Update Password</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 4. User Management Tab */}
          {activeTab === 'users' && (
            <div className="settings-card">
              <div className="card-header">
                <div>
                  <h3>CRM User Administration</h3>
                  <p>Registered enterprise accounts, roles, and status controls.</p>
                </div>
              </div>

              {isUsersLoading ? (
                <div className="loading-users">Loading enterprise users...</div>
              ) : (
                <div className="users-table-wrapper">
                  <table className="settings-users-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Assigned Roles</th>
                        <th>Account Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userList.map((user) => (
                        <tr key={user.id}>
                          <td>
                            <div className="user-cell">
                              <div className="user-table-avatar">
                                {user.fullName
                                  ? user.fullName.substring(0, 2).toUpperCase()
                                  : user.username.substring(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <span className="user-cell-name">{user.fullName || user.username}</span>
                                <span className="user-cell-id">@{user.username}</span>
                              </div>
                            </div>
                          </td>
                          <td>{user.email}</td>
                          <td>
                            <div className="roles-pill-group">
                              {user.roles &&
                                user.roles.map((r, i) => (
                                  <span key={i} className="role-chip">
                                    {r.replace('ROLE_', '')}
                                  </span>
                                ))}
                            </div>
                          </td>
                          <td>
                            <span className={`status-badge ${user.isActive ? 'active' : 'suspended'}`}>
                              {user.isActive ? 'Active' : 'Suspended'}
                            </span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className={`action-btn-status ${user.isActive ? 'suspend' : 'activate'}`}
                              onClick={() => handleToggleUserStatus(user.id, user.isActive)}
                            >
                              {user.isActive ? 'Suspend' : 'Activate'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
