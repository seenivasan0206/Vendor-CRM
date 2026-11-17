import { useState, useEffect } from 'react';
import '../Styles/Notification.css';
import { authService } from '../services/authService';

const API_BASE_URL = 'http://localhost:8080/api/notifications';

const SAMPLE_NOTIFICATIONS = [
  {
    id: 101,
    title: 'Critical Low Stock: Brass Fittings (1/2")',
    message: 'Current stock is 8 units, which is below the minimum reorder threshold of 25 units. Immediate reorder required.',
    notificationType: 'ALERT',
    referenceType: 'INVENTORY',
    referenceId: 2,
    isRead: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: 102,
    title: 'PO Approval Required: PO-2026-9024',
    message: 'Purchase order for Apex Industrial Supplies totaling $12,450.00 requires Administrator sign-off.',
    notificationType: 'WARNING',
    referenceType: 'PURCHASE_ORDER',
    referenceId: 9024,
    isRead: false,
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: 103,
    title: 'Invoice Payment Overdue: INV-2026-041',
    message: 'Payment of $4,800.00 to Global Fasteners Corp was due yesterday. Please review status.',
    notificationType: 'ALERT',
    referenceType: 'PAYMENT',
    referenceId: 41,
    isRead: false,
    createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
  },
  {
    id: 104,
    title: 'Vendor Performance Score Updated',
    message: 'Alpha Star Logistics achieved a quarterly KPI score of 94/100 (Grade A+ Tier 1 Partner).',
    notificationType: 'SUCCESS',
    referenceType: 'VENDOR',
    referenceId: 12,
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
  {
    id: 105,
    title: 'System Security: Scheduled Backup Complete',
    message: 'Automated nightly MySQL database backup finished successfully at 02:00 AM (Checksum verified).',
    notificationType: 'INFO',
    referenceType: 'SYSTEM',
    referenceId: null,
    isRead: true,
    createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
  },
];

function formatTimeAgo(isoString) {
  if (!isoString) return 'Recently';
  const now = new Date();
  const past = new Date(isoString);
  const diffSec = Math.floor((now - past) / 1000);

  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} min${diffMin > 1 ? 's' : ''} ago`;
  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

function getTypeIcon(type) {
  switch (type) {
    case 'ALERT':
      return '🚨';
    case 'WARNING':
      return '⚠️';
    case 'SUCCESS':
      return '✅';
    case 'INFO':
    default:
      return 'ℹ️';
  }
}

function getTypeBadgeClass(type) {
  switch (type) {
    case 'ALERT':
      return 'badge-alert';
    case 'WARNING':
      return 'badge-warning';
    case 'SUCCESS':
      return 'badge-success';
    case 'INFO':
    default:
      return 'badge-info';
  }
}

function Notification() {
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State for new notification
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newType, setNewType] = useState('ALERT');
  const [newCategory, setNewCategory] = useState('INVENTORY');

  const showToast = (msg) => {
    setToastMessage(msg);
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

  // Fetch from backend
  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(API_BASE_URL, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const payload = await res.json();
        const serverList = payload?.data?.content || payload?.data || [];
        if (Array.isArray(serverList) && serverList.length > 0) {
          setNotifications(serverList);
        }
      }
    } catch (err) {
      console.warn('Backend notifications endpoint unreachable, using local cache:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const res = await fetch(API_BASE_URL, {
          headers: getAuthHeaders(),
        });
        if (res.ok) {
          const payload = await res.json();
          const serverList = payload?.data?.content || payload?.data || [];
          if (!ignore && Array.isArray(serverList) && serverList.length > 0) {
            setNotifications(serverList);
          }
        }
      } catch (err) {
        console.warn('Backend notifications endpoint unreachable, using local cache:', err);
      }
    };
    load();
    return () => {
      ignore = true;
    };
  }, []);

  // Mark single notification read / unread
  const handleToggleRead = async (id, currentIsRead) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, isRead: !currentIsRead } : n
    );
    setNotifications(updated);

    try {
      const endpoint = currentIsRead ? `${API_BASE_URL}/${id}/unread` : `${API_BASE_URL}/${id}/read`;
      await fetch(endpoint, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
      showToast(!currentIsRead ? 'Marked as read' : 'Marked as unread');
    } catch (err) {
      console.warn('Backend update failed, kept local state', err);
    }
  };

  // Mark all as read
  const handleMarkAllRead = async () => {
    const updated = notifications.map((n) => ({ ...n, isRead: true }));
    setNotifications(updated);

    try {
      await fetch(`${API_BASE_URL}/read-all`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });
      showToast('All notifications marked as read');
    } catch {
      showToast('Marked all as read (offline sync)');
    }
  };

  // Clear all read notifications
  const handleClearRead = async () => {
    const filtered = notifications.filter((n) => !n.isRead);
    setNotifications(filtered);

    try {
      await fetch(`${API_BASE_URL}/read`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      showToast('Cleared read notifications');
    } catch {
      showToast('Cleared read notifications (offline sync)');
    }
  };

  // Delete single notification
  const handleDelete = async (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));

    try {
      await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      showToast('Notification deleted');
    } catch {
      showToast('Notification removed');
    }
  };

  // Submit new notification / broadcast
  const handleCreateNotification = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newMessage.trim()) return;

    const user = authService.getCurrentUser();
    const newEntry = {
      id: Date.now(),
      userId: user?.id || null,
      title: newTitle.trim(),
      message: newMessage.trim(),
      notificationType: newType,
      referenceType: newCategory,
      referenceId: null,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    setNotifications((prev) => [newEntry, ...prev]);
    setShowCreateModal(false);
    setNewTitle('');
    setNewMessage('');
    showToast('New alert broadcast successfully!');

    // Try sending to backend
    try {
      await fetch(API_BASE_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          userId: user?.id || 4,
          title: newEntry.title,
          message: newEntry.message,
          notificationType: newEntry.notificationType,
          referenceType: newEntry.referenceType,
          referenceId: null,
        }),
      });
    } catch (err) {
      console.warn('Backend broadcast failed, saved in local view', err);
    }
  };

  // Filtered List
  const filteredNotifications = notifications.filter((item) => {
    // Search query check
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.referenceType && item.referenceType.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    // Tab filter check
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'UNREAD') return !item.isRead;
    if (activeFilter === 'ALERT') return item.notificationType === 'ALERT';
    if (activeFilter === 'INVENTORY') return item.referenceType === 'INVENTORY';
    if (activeFilter === 'PURCHASE_ORDER') return item.referenceType === 'PURCHASE_ORDER';
    if (activeFilter === 'PAYMENT') return item.referenceType === 'PAYMENT';
    if (activeFilter === 'SYSTEM') return item.referenceType === 'SYSTEM';

    return true;
  });

  // KPI Metrics
  const totalCount = notifications.length;
  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const alertCount = notifications.filter((n) => n.notificationType === 'ALERT').length;
  const systemCount = notifications.filter((n) => n.referenceType === 'SYSTEM').length;

  return (
    <div className="notification-page-container">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="notif-toast">
          <span>🔔</span> {toastMessage}
        </div>
      )}

      {/* Header & Title */}
      <div className="notif-header">
        <div>
          <h2>System Notifications & Alerts</h2>
          <p>Real-time procurement alerts, inventory shortages, invoice tracking, and system updates.</p>
        </div>
        <div className="notif-header-actions">
          <button
            type="button"
            className="notif-btn-secondary"
            onClick={fetchNotifications}
            disabled={isLoading}
            title="Refresh notifications"
          >
            {isLoading ? '⟳ Refreshing...' : '⟳ Refresh'}
          </button>
          <button
            type="button"
            className="notif-btn-create"
            onClick={() => setShowCreateModal(true)}
          >
            <span>➕</span> Broadcast Alert
          </button>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="notif-kpi-grid">
        <div className="notif-kpi-card" onClick={() => setActiveFilter('ALL')}>
          <div className="kpi-icon-box blue">📬</div>
          <div className="kpi-content">
            <span className="kpi-label">Total Notifications</span>
            <span className="kpi-value">{totalCount}</span>
          </div>
        </div>

        <div className="notif-kpi-card" onClick={() => setActiveFilter('UNREAD')}>
          <div className="kpi-icon-box orange">🔔</div>
          <div className="kpi-content">
            <span className="kpi-label">Unread Alerts</span>
            <span className="kpi-value highlight-orange">{unreadCount}</span>
          </div>
        </div>

        <div className="notif-kpi-card" onClick={() => setActiveFilter('ALERT')}>
          <div className="kpi-icon-box red">🚨</div>
          <div className="kpi-content">
            <span className="kpi-label">Critical Alerts</span>
            <span className="kpi-value highlight-red">{alertCount}</span>
          </div>
        </div>

        <div className="notif-kpi-card" onClick={() => setActiveFilter('SYSTEM')}>
          <div className="kpi-icon-box purple">⚙️</div>
          <div className="kpi-content">
            <span className="kpi-label">System Logs</span>
            <span className="kpi-value">{systemCount}</span>
          </div>
        </div>
      </div>

      {/* Filter and Action Controls */}
      <div className="notif-controls-bar">
        {/* Left Filter Tabs */}
        <div className="notif-filter-tabs">
          <button
            type="button"
            className={`filter-tab ${activeFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setActiveFilter('ALL')}
          >
            All ({totalCount})
          </button>
          <button
            type="button"
            className={`filter-tab ${activeFilter === 'UNREAD' ? 'active' : ''}`}
            onClick={() => setActiveFilter('UNREAD')}
          >
            Unread ({unreadCount})
          </button>
          <button
            type="button"
            className={`filter-tab ${activeFilter === 'ALERT' ? 'active' : ''}`}
            onClick={() => setActiveFilter('ALERT')}
          >
            Critical
          </button>
          <button
            type="button"
            className={`filter-tab ${activeFilter === 'INVENTORY' ? 'active' : ''}`}
            onClick={() => setActiveFilter('INVENTORY')}
          >
            Inventory
          </button>
          <button
            type="button"
            className={`filter-tab ${activeFilter === 'PURCHASE_ORDER' ? 'active' : ''}`}
            onClick={() => setActiveFilter('PURCHASE_ORDER')}
          >
            Orders
          </button>
          <button
            type="button"
            className={`filter-tab ${activeFilter === 'PAYMENT' ? 'active' : ''}`}
            onClick={() => setActiveFilter('PAYMENT')}
          >
            Payments
          </button>
        </div>

        {/* Right Search & Batch Buttons */}
        <div className="notif-actions-cluster">
          <div className="notif-search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="notif-search-input"
            />
          </div>

          <button
            type="button"
            className="notif-btn-secondary"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            title="Mark all notifications as read"
          >
            ✓ Mark All Read
          </button>

          <button
            type="button"
            className="notif-btn-secondary text-danger"
            onClick={handleClearRead}
            title="Delete all read notifications"
          >
            🗑️ Clear Read
          </button>
        </div>
      </div>

      {/* Notification Items List */}
      <div className="notif-list-container">
        {isLoading && (
          <div className="notif-empty-state">
            <span className="spinner">⏳</span>
            <p>Syncing notifications from server...</p>
          </div>
        )}

        {!isLoading && filteredNotifications.length === 0 && (
          <div className="notif-empty-state">
            <span className="empty-icon">🎉</span>
            <h3>All caught up!</h3>
            <p>No notifications match your current filter criteria.</p>
          </div>
        )}

        {!isLoading &&
          filteredNotifications.map((item) => (
            <div
              key={item.id}
              className={`notif-card ${!item.isRead ? 'unread' : 'read'}`}
            >
              {/* Status Indicator Bar */}
              <div className={`notif-status-bar ${getTypeBadgeClass(item.notificationType)}`} />

              {/* Type Icon */}
              <div className="notif-icon-col">
                <span className="notif-type-icon">{getTypeIcon(item.notificationType)}</span>
              </div>

              {/* Body */}
              <div className="notif-body-col">
                <div className="notif-title-row">
                  <h4 className="notif-title">{item.title}</h4>
                  <div className="notif-badges-group">
                    {item.referenceType && (
                      <span className="notif-category-badge">{item.referenceType}</span>
                    )}
                    <span className={`notif-type-badge ${getTypeBadgeClass(item.notificationType)}`}>
                      {item.notificationType}
                    </span>
                    {!item.isRead && <span className="unread-dot" title="Unread" />}
                  </div>
                </div>

                <p className="notif-message-text">{item.message}</p>

                <div className="notif-footer-row">
                  <span className="notif-time">{formatTimeAgo(item.createdAt)}</span>
                  {item.referenceId && (
                    <span className="notif-ref-id">Ref #{item.referenceId}</span>
                  )}
                </div>
              </div>

              {/* Card Actions */}
              <div className="notif-actions-col">
                <button
                  type="button"
                  className="card-action-btn"
                  onClick={() => handleToggleRead(item.id, item.isRead)}
                  title={item.isRead ? 'Mark as unread' : 'Mark as read'}
                >
                  {item.isRead ? '✉️ Unread' : '✔️ Read'}
                </button>
                <button
                  type="button"
                  className="card-action-btn delete"
                  onClick={() => handleDelete(item.id)}
                  title="Delete notification"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Broadcast Alert Modal */}
      {showCreateModal && (
        <div className="notif-modal-backdrop">
          <div className="notif-modal">
            <div className="modal-header">
              <h3>Create & Broadcast Alert</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setShowCreateModal(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNotification} className="modal-form">
              <div className="form-group">
                <label>Alert Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Critical Storage Capacity Warning"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Severity Level</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                  >
                    <option value="ALERT">🚨 ALERT (Critical)</option>
                    <option value="WARNING">⚠️ WARNING (Attention Needed)</option>
                    <option value="INFO">ℹ️ INFO (Informational)</option>
                    <option value="SUCCESS">✅ SUCCESS (Positive Update)</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Module / Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                  >
                    <option value="INVENTORY">Inventory & Stock</option>
                    <option value="PURCHASE_ORDER">Purchase Orders</option>
                    <option value="PAYMENT">Invoices & Payments</option>
                    <option value="VENDOR">Vendors</option>
                    <option value="SYSTEM">System & Security</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Notification Message *</label>
                <textarea
                  rows="4"
                  required
                  placeholder="Provide detailed description of the alert, impacted items or required action..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Broadcast Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Notification;
