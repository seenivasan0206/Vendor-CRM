import { useState, useEffect, useMemo } from 'react';
import {
  Mail,
  Phone,
  Handshake,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
  Edit,
  RotateCw
} from 'lucide-react';
import '../Styles/Vendorcommunication.css';

const COMM_API = 'http://localhost:8080/api/communications';
const VENDOR_API = 'http://localhost:8080/api/vendors';

const COMM_TYPES = ['EMAIL', 'PHONE', 'MEETING', 'MESSAGE'];
const COMM_STATUSES = ['PENDING', 'COMPLETED', 'CANCELLED'];

const renderCommTypeIcon = (type) => {
  switch (type) {
    case 'EMAIL':
      return <Mail size={18} color="#6366F1" />;
    case 'PHONE':
      return <Phone size={18} color="#6366F1" />;
    case 'MEETING':
      return <Handshake size={18} color="#6366F1" />;
    case 'MESSAGE':
    default:
      return <MessageSquare size={18} color="#6366F1" />;
  }
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
    sessionStorage.getItem('zenve_access_token') ||
    localStorage.getItem('token') ||
    sessionStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
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

const INITIAL_VENDORS = [
  { id: 1, vendorCode: 'VND-00124', companyName: 'Apex Cloud Systems Ltd' },
  { id: 2, vendorCode: 'VND-00123', companyName: 'Nexus Global Logistics' },
  { id: 3, vendorCode: 'VND-00125', companyName: 'CyberShield Security LLC' },
  { id: 4, vendorCode: 'VND-00126', companyName: 'Quantum Office Interiors' },
  { id: 5, vendorCode: 'VND-00127', companyName: 'BioMatrix Health Innovations' },
  { id: 6, vendorCode: 'VND-00128', companyName: 'Titan Heavy Machinery & Equipment' },
];

const INITIAL_COMMUNICATIONS = [
  {
    id: 1,
    vendorId: 1,
    companyName: 'Apex Cloud Systems Ltd',
    vendorCode: 'VND-00124',
    subject: 'Q2 SLA & Uptime Infrastructure Review',
    message: 'Completed quarterly review of high-availability clusters and load balancer failover metrics. Confirmed 99.99% uptime compliance across all US-East regions.',
    communicationType: 'EMAIL',
    communicationDate: '2026-11-15T10:30:00',
    communicationStatus: 'COMPLETED',
    remarks: 'Disaster recovery failover simulation scheduled for next quarter.',
    createdBy: 'David Chen',
  },
  {
    id: 2,
    vendorId: 2,
    companyName: 'Nexus Global Logistics',
    vendorCode: 'VND-00123',
    subject: 'Expedited Freight & Customs Clearance',
    message: 'Coordinated priority air-freight shipment documentation for international supply chain deliveries. Customs declarations and port clearances confirmed.',
    communicationType: 'PHONE',
    communicationDate: '2026-11-16T14:15:00',
    communicationStatus: 'COMPLETED',
    remarks: 'Real-time GPS tracking webhook integrated successfully.',
    createdBy: 'Sarah Jenkins',
  },
  {
    id: 3,
    vendorId: 3,
    companyName: 'CyberShield Security LLC',
    vendorCode: 'VND-00125',
    subject: 'SOC 2 Type II Annual Security Audit',
    message: 'Initiated annual third-party compliance review. Reviewed firewall rules, identity provider logs, and multi-factor authentication enforcement policies.',
    communicationType: 'MEETING',
    communicationDate: '2026-11-17T09:00:00',
    communicationStatus: 'PENDING',
    remarks: 'Final penetration testing report due by next Tuesday.',
    createdBy: 'Marcus Vance',
  },
  {
    id: 4,
    vendorId: 4,
    companyName: 'Quantum Office Interiors',
    vendorCode: 'VND-00126',
    subject: 'Ergonomic Standing Desk Delivery Batch',
    message: 'Confirmed assembly schedule and site delivery of 50 motorized standing workstations for headquarters expansion floor 4.',
    communicationType: 'MESSAGE',
    communicationDate: '2026-11-17T11:45:00',
    communicationStatus: 'PENDING',
    remarks: 'Security gate passes issued for delivery truck driver.',
    createdBy: 'Elena Rostova',
  },
  {
    id: 5,
    vendorId: 5,
    companyName: 'BioMatrix Health Innovations',
    vendorCode: 'VND-00127',
    subject: 'FDA 21 CFR Bio-Safety Certification Renewal',
    message: 'Validated ISO-13485 quality control documentation and FDA 21 CFR part 11 regulatory compliance certificates for cleanroom laboratory equipment.',
    communicationType: 'EMAIL',
    communicationDate: '2026-11-12T16:20:00',
    communicationStatus: 'COMPLETED',
    remarks: 'Certificates archived in compliance vault repository.',
    createdBy: 'Dr. Aris Thorne',
  },
  {
    id: 6,
    vendorId: 6,
    companyName: 'Titan Heavy Machinery & Equipment',
    vendorCode: 'VND-00128',
    subject: 'Hydraulic Assembly Routine Maintenance Call',
    message: 'Call postponed due to unscheduled plant maintenance and power generator overhaul at the manufacturing facility.',
    communicationType: 'PHONE',
    communicationDate: '2026-11-10T13:00:00',
    communicationStatus: 'CANCELLED',
    remarks: 'Rescheduling session requested for upcoming week.',
    createdBy: 'Kenji Sato',
  },
];

function Vendorcommunication() {
  const [communications, setCommunications] = useState(INITIAL_COMMUNICATIONS);
  const [vendors, setVendors] = useState(INITIAL_VENDORS);
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
      if (Array.isArray(list) && list.length > 0) {
        setVendors(list);
      }
    } catch (err) {
      console.warn('Vendor API offline, keeping initial vendors:', err.message);
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
      if (Array.isArray(list) && list.length > 0) {
        setCommunications(list);
      }
    } catch (err) {
      console.warn('Communication API offline, using fallback records:', err.message);
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
          <Plus size={16} />
          <span>New Communication</span>
        </button>
      </div>

      {/* 2. KPI Summary Cards */}
      <div className="comm-stats-grid">
        <div className="kpi-card">
          <div className="kpi-accent-bar" />
          <div className="kpi-header">
            <span className="kpi-title">Total Interactions</span>
            <div className="kpi-icon-pill">
              <MessageSquare size={18} />
            </div>
          </div>
          <div className="kpi-value">{stats.total}</div>
          <div className="kpi-subtext">All interaction logs</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-accent-bar" />
          <div className="kpi-header">
            <span className="kpi-title">Pending Follow-ups</span>
            <div className="kpi-icon-pill">
              <Clock size={18} />
            </div>
          </div>
          <div className="kpi-value">{stats.pending}</div>
          <div className="kpi-subtext">Action items awaiting reply</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-accent-bar" />
          <div className="kpi-header">
            <span className="kpi-title">Completed</span>
            <div className="kpi-icon-pill">
              <CheckCircle size={18} />
            </div>
          </div>
          <div className="kpi-value">{stats.completed}</div>
          <div className="kpi-subtext">Resolved communications</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-accent-bar" />
          <div className="kpi-header">
            <span className="kpi-title">Cancelled</span>
            <div className="kpi-icon-pill">
              <AlertCircle size={18} />
            </div>
          </div>
          <div className="kpi-value">{stats.cancelled}</div>
          <div className="kpi-subtext">Archived or rescheduled</div>
        </div>
      </div>

      {/* 3. Communication Type Breakdown */}
      <div className="comm-types-row">
        {COMM_TYPES.map((t) => (
          <div key={t} className={`comm-type-chip comm-type-${t.toLowerCase()}`}>
            <span className="comm-type-icon">{renderCommTypeIcon(t)}</span>
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
          <RotateCw size={15} className={isLoading ? 'comm-spin' : ''} />
          <span>{isLoading ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {apiError && <div className="comm-api-alert">{apiError}</div>}

      {/* 5. Communications List */}
      {filtered.length === 0 ? (
        <div className="comm-empty">
          {isLoading
            ? 'Loading communications from server...'
            : 'No communications found. Click "New Communication" to log your first interaction.'}
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
                    {renderCommTypeIcon(c.communicationType)}
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
                    <Edit size={14} />
                    <span>Edit</span>
                  </button>
                  <button
                    type="button"
                    className="comm-btn-delete"
                    onClick={() => handleDelete(c.id)}
                  >
                    <Trash2 size={14} />
                    <span>Delete</span>
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
