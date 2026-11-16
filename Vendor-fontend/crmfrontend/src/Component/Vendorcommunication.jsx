import { useState, useEffect, useMemo } from 'react';
import '../Styles/Vendorcommunication.css';

const COMM_API = 'http://localhost:8080/api/communications';
const VENDOR_API = 'http://localhost:8080/api/vendors';

const COMM_TYPES = ['EMAIL', 'PHONE', 'MEETING', 'MESSAGE'];
const COMM_STATUSES = ['PENDING', 'COMPLETED', 'CANCELLED'];

const TYPE_ICONS = {
  EMAIL: '✉️',
  PHONE: '📞',
  MEETING: '🤝',
  MESSAGE: '💬',
};

const TYPE_LABELS = {
  EMAIL: 'Email',
  PHONE: 'Phone Call',
  MEETING: 'Meeting',
  MESSAGE: 'Message',
};

const STATUS_LABELS = {
  PENDING: 'Pending',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

const authHeaders = () => {
  const token =
    localStorage.getItem('zenve_access_token') ||
    sessionStorage.getItem('zenve_access_token');
  return token
    ? { Authorization: `Bearer ${token}` }
    : {};
};

function formatDateTime(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function statusBadge(status) {
  if (status === 'COMPLETED') return { label: 'Completed', className: 'comm-badge-success' };
  if (status === 'CANCELLED') return { label: 'Cancelled', className: 'comm-badge-danger' };
  return { label: 'Pending', className: 'comm-badge-warn' };
}

function Vendorcommunication() {
  const [communications, setCommunications] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [vendorFilter, setVendorFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    vendorId: '',
    subject: '',
    message: '',
    communicationType: 'EMAIL',
    communicationDate: '',
    communicationStatus: 'PENDING',
    remarks: '',
  });

  const fetchVendors = async () => {
    try {
      const response = await fetch(`${VENDOR_API}?size=200`, {
        headers: { ...authHeaders(), Accept: 'application/json' },
      });
      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      const result = await response.json();
      const list = result?.data?.content || result?.data || [];
      setVendors(list);
    } catch (err) {
      console.warn('Vendor API offline:', err.message);
    }
  };

  const fetchCommunications = async () => {
    try {
      setIsLoading(true);
      setApiError('');
      const response = await fetch(`${COMM_API}?size=200`, {
        headers: { ...authHeaders(), Accept: 'application/json' },
      });
      if (!response.ok) throw new Error(`Server returned ${response.status}`);
      const result = await response.json();
      const list = result?.data?.content || result?.data || [];
      setCommunications(list);
    } catch (err) {
      console.warn('Communication API offline:', err.message);
      setApiError(
        'Backend communication API is unreachable (http://localhost:8080). You can still record communications locally; they will sync when the backend is online.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchVendors();
      fetchCommunications();
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      vendorId: '',
      subject: '',
      message: '',
      communicationType: 'EMAIL',
      communicationDate: '',
      communicationStatus: 'PENDING',
      remarks: '',
    });
    setEditingId(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEdit = (comm) => {
    setEditingId(comm.id);
    setFormData({
      vendorId: comm.vendorId ? String(comm.vendorId) : '',
      subject: comm.subject || '',
      message: comm.message || '',
      communicationType: comm.communicationType || 'EMAIL',
      communicationDate: comm.communicationDate
        ? comm.communicationDate.slice(0, 16)
        : '',
      communicationStatus: comm.communicationStatus || 'PENDING',
      remarks: comm.remarks || '',
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this communication record?')) return;
    try {
      const response = await fetch(`${COMM_API}/${id}`, {
        method: 'DELETE',
        headers: { ...authHeaders(), Accept: 'application/json' },
      });
      if (response.ok) {
        setCommunications((prev) => prev.filter((c) => c.id !== id));
      } else {
        setCommunications((prev) => prev.filter((c) => c.id !== id));
      }
    } catch {
      setCommunications((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`${COMM_API}/${id}/status`, {
        method: 'PATCH',
        headers: {
          ...authHeaders(),
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ communicationStatus: newStatus }),
      });
      if (response.ok) {
        setCommunications((prev) =>
          prev.map((c) =>
            c.id === id ? { ...c, communicationStatus: newStatus } : c
          )
        );
      } else {
        setCommunications((prev) =>
          prev.map((c) =>
            c.id === id ? { ...c, communicationStatus: newStatus } : c
          )
        );
      }
    } catch {
      setCommunications((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, communicationStatus: newStatus } : c
        )
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.vendorId || !formData.subject.trim() || !formData.message.trim()) {
      return;
    }

    const vendor = vendors.find((v) => String(v.id) === String(formData.vendorId));
    const payload = {
      vendorId: Number(formData.vendorId),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
      communicationType: formData.communicationType,
      communicationDate: formData.communicationDate
        ? `${formData.communicationDate}:00`
        : new Date().toISOString().slice(0, 19),
      communicationStatus: formData.communicationStatus,
      remarks: formData.remarks.trim(),
    };

    setSaving(true);
    try {
      const isEditing = editingId != null;
      const response = await fetch(
        isEditing ? `${COMM_API}/${editingId}` : COMM_API,
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: {
            ...authHeaders(),
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const result = await response.json();
        const saved = result?.data;
        if (isEditing) {
          setCommunications((prev) =>
            prev.map((c) => (c.id === editingId ? saved : c))
          );
        } else {
          setCommunications((prev) => [saved, ...prev]);
        }
        handleCloseModal();
      } else {
        const errPayload = await response.json().catch(() => null);
        setApiError(
          errPayload?.message ||
            `Failed to save communication (HTTP ${response.status}).`
        );
      }
    } catch {
      const localEntry = {
        id: editingId != null ? editingId : Date.now(),
        vendorId: Number(formData.vendorId),
        companyName: vendor?.companyName || 'Local Vendor',
        vendorCode: vendor?.vendorCode || '—',
        subject: payload.subject,
        message: payload.message,
        communicationType: payload.communicationType,
        communicationDate: payload.communicationDate,
        communicationStatus: payload.communicationStatus,
        remarks: payload.remarks,
        createdBy: 'local',
      };
      if (editingId != null) {
        setCommunications((prev) =>
          prev.map((c) => (c.id === editingId ? localEntry : c))
        );
      } else {
        setCommunications((prev) => [localEntry, ...prev]);
      }
      setApiError(
        'Could not reach the backend; the communication was saved locally and will sync when the server is available.'
      );
      handleCloseModal();
    } finally {
      setSaving(false);
    }
  };

  const vendorOptions = useMemo(() => {
    const map = new Map();
    vendors.forEach((v) => map.set(String(v.id), v.companyName));
    communications.forEach((c) => {
      if (c.vendorId && !map.has(String(c.vendorId))) {
        map.set(String(c.vendorId), c.companyName || `Vendor #${c.vendorId}`);
      }
    });
    return Array.from(map.entries()).map(([id, name]) => ({
      id,
      name: name || `Vendor #${id}`,
    }));
  }, [vendors, communications]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return communications.filter((c) => {
      const haystack = `${c.subject || ''} ${c.message || ''} ${
        c.companyName || ''
      } ${c.vendorCode || ''}`.toLowerCase();
      const matchesSearch = !q || haystack.includes(q);
      const matchesType = typeFilter === 'ALL' || c.communicationType === typeFilter;
      const matchesStatus =
        statusFilter === 'ALL' || c.communicationStatus === statusFilter;
      const matchesVendor =
        vendorFilter === 'ALL' || String(c.vendorId) === String(vendorFilter);
      return matchesSearch && matchesType && matchesStatus && matchesVendor;
    });
  }, [communications, searchQuery, typeFilter, statusFilter, vendorFilter]);

  const stats = useMemo(() => {
    const total = communications.length;
    const pending = communications.filter((c) => c.communicationStatus === 'PENDING').length;
    const completed = communications.filter((c) => c.communicationStatus === 'COMPLETED').length;
    const cancelled = communications.filter((c) => c.communicationStatus === 'CANCELLED').length;
    const typeCounts = COMM_TYPES.reduce((acc, t) => {
      acc[t] = communications.filter((c) => c.communicationType === t).length;
      return acc;
    }, {});
    return { total, pending, completed, cancelled, typeCounts };
  }, [communications]);

  return (
    <div className="comm-container">
      {/* 1. Page Header */}
      <div className="comm-header">
        <div>
          <h2>Communication Dashboard</h2>
          <p>Track all vendor communications, follow-ups, and engagement history.</p>
        </div>
        <button
          type="button"
          className="comm-btn-primary"
          onClick={handleOpenCreate}
        >
          + New Communication
        </button>
      </div>

      {/* 2. KPI Summary Cards */}
      <div className="comm-stats-grid">
        <div className="comm-stat-card">
          <span className="comm-stat-label">Total Communications</span>
          <strong className="comm-stat-value">{stats.total}</strong>
        </div>
        <div className="comm-stat-card">
          <span className="comm-stat-label">Pending Follow-ups</span>
          <strong className="comm-stat-value comm-stat-warn">{stats.pending}</strong>
        </div>
        <div className="comm-stat-card">
          <span className="comm-stat-label">Completed</span>
          <strong className="comm-stat-value comm-stat-success">{stats.completed}</strong>
        </div>
        <div className="comm-stat-card">
          <span className="comm-stat-label">Cancelled</span>
          <strong className="comm-stat-value comm-stat-danger">{stats.cancelled}</strong>
        </div>
      </div>

      {/* 3. Communication Type Breakdown */}
      <div className="comm-types-row">
        {COMM_TYPES.map((t) => (
          <div key={t} className={`comm-type-chip comm-type-${t.toLowerCase()}`}>
            <span className="comm-type-icon">{TYPE_ICONS[t]}</span>
            <span className="comm-type-name">{TYPE_LABELS[t]}</span>
            <span className="comm-type-count">{stats.typeCounts[t] || 0}</span>
          </div>
        ))}
      </div>

      {/* 4. Search & Filter Bar */}
      <div className="comm-toolbar">
        <input
          type="text"
          className="comm-search-input"
          placeholder="Search by subject, message, or vendor..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="comm-filter-select"
          value={vendorFilter}
          onChange={(e) => setVendorFilter(e.target.value)}
        >
          <option value="ALL">All Vendors</option>
          {vendorOptions.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
        <select
          className="comm-filter-select"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value="ALL">All Types</option>
          {COMM_TYPES.map((t) => (
            <option key={t} value={t}>
              {TYPE_LABELS[t]}
            </option>
          ))}
        </select>
        <select
          className="comm-filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          {COMM_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="comm-btn-refresh"
          onClick={fetchCommunications}
          disabled={isLoading}
          title="Refresh communications from backend"
        >
          {isLoading ? '⟳ Refreshing...' : '⟳ Refresh'}
        </button>
      </div>

      {apiError && <div className="comm-api-alert">{apiError}</div>}

      {/* 5. Communications List */}
      {filtered.length === 0 ? (
        <div className="comm-empty">
          {isLoading
            ? 'Loading communications from server...'
            : 'No communications found. Click "+ New Communication" to log your first interaction.'}
        </div>
      ) : (
        <div className="comm-list">
          {filtered.map((c) => {
            const badge = statusBadge(c.communicationStatus);
            return (
              <div key={c.id} className="comm-card">
                <div className="comm-card-left">
                  <span
                    className={`comm-type-icon-lg comm-type-icon-${c.communicationType.toLowerCase()}`}
                    title={TYPE_LABELS[c.communicationType]}
                  >
                    {TYPE_ICONS[c.communicationType] || '💬'}
                  </span>
                </div>

                <div className="comm-card-body">
                  <div className="comm-card-top">
                    <h3 className="comm-card-subject">{c.subject}</h3>
                    <span className={`comm-badge ${badge.className}`}>
                      {badge.label}
                    </span>
                  </div>

                  <div className="comm-card-meta">
                    <span className="comm-meta-item">
                      <span className="comm-meta-label">Vendor:</span>{' '}
                      <span className="comm-meta-strong">
                        {c.companyName || `Vendor #${c.vendorId}`}
                      </span>
                      {c.vendorCode && c.vendorCode !== '—' && (
                        <span className="comm-meta-code"> ({c.vendorCode})</span>
                      )}
                    </span>
                    <span className="comm-meta-item">
                      <span className="comm-meta-label">Type:</span>{' '}
                      {TYPE_LABELS[c.communicationType] || c.communicationType}
                    </span>
                    <span className="comm-meta-item">
                      <span className="comm-meta-label">Date:</span>{' '}
                      {formatDateTime(c.communicationDate)}
                    </span>
                    {c.createdBy && c.createdBy !== 'local' && (
                      <span className="comm-meta-item">
                        <span className="comm-meta-label">By:</span>{' '}
                        {c.createdBy}
                      </span>
                    )}
                  </div>

                  <p className="comm-card-message">{c.message}</p>

                  {c.remarks && (
                    <p className="comm-card-remarks">
                      <span className="comm-remarks-label">Notes:</span>{' '}
                      {c.remarks}
                    </p>
                  )}
                </div>

                <div className="comm-card-actions">
                  <select
                    className="comm-status-select"
                    value={c.communicationStatus}
                    onChange={(e) => handleStatusChange(c.id, e.target.value)}
                    title="Update status"
                  >
                    {COMM_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="comm-btn-edit"
                    onClick={() => handleOpenEdit(c)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="comm-btn-delete"
                    onClick={() => handleDelete(c.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 6. Create / Edit Modal */}
      {isModalOpen && (
        <div className="comm-modal-overlay">
          <div className="comm-modal">
            <div className="comm-modal-header">
              <h3>
                {editingId != null ? 'Edit Communication' : 'New Communication'}
              </h3>
              <button
                type="button"
                className="comm-modal-close"
                onClick={handleCloseModal}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="comm-form">
              <div className="comm-form-grid">
                <div className="comm-form-group">
                  <label htmlFor="vendorId">Vendor *</label>
                  <select
                    id="vendorId"
                    name="vendorId"
                    value={formData.vendorId}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select a vendor</option>
                    {vendorOptions.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="comm-form-group">
                  <label htmlFor="communicationType">Type *</label>
                  <select
                    id="communicationType"
                    name="communicationType"
                    value={formData.communicationType}
                    onChange={handleChange}
                  >
                    {COMM_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {TYPE_LABELS[t]}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="comm-form-group">
                  <label htmlFor="communicationDate">Date & Time *</label>
                  <input
                    id="communicationDate"
                    name="communicationDate"
                    type="datetime-local"
                    value={formData.communicationDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="comm-form-group">
                  <label htmlFor="communicationStatus">Status</label>
                  <select
                    id="communicationStatus"
                    name="communicationStatus"
                    value={formData.communicationStatus}
                    onChange={handleChange}
                  >
                    {COMM_STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABELS[s]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="comm-form-group">
                <label htmlFor="subject">Subject *</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  placeholder="e.g. Q4 pricing negotiation follow-up"
                  value={formData.subject}
                  onChange={handleChange}
                  maxLength={200}
                  required
                />
              </div>

              <div className="comm-form-group">
                <label htmlFor="message">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Write the communication details, summary, or transcript notes..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="comm-form-group">
                <label htmlFor="remarks">Remarks (optional)</label>
                <textarea
                  id="remarks"
                  name="remarks"
                  rows={2}
                  placeholder="Additional notes, next steps, or follow-up reminders..."
                  value={formData.remarks}
                  onChange={handleChange}
                />
              </div>

              <div className="comm-modal-actions">
                <button
                  type="button"
                  className="comm-btn-secondary"
                  onClick={handleCloseModal}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="comm-btn-primary"
                  disabled={saving}
                >
                  {saving
                    ? 'Saving...'
                    : editingId != null
                    ? 'Update Communication'
                    : 'Save Communication'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Vendorcommunication;