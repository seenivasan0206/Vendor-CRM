import { useState, useEffect, useCallback } from 'react';
import {
  Building2,
  Download,
  CheckCircle,
  Zap,
  Star,
  Search,
  LayoutGrid,
  List,
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Pencil,
  Trash2,
  Check,
  AlertTriangle,
  Eye
} from 'lucide-react';
import '../Styles/Vendor.css';

// Realistic supplier dataset matching backend VendorResponse schema
const INITIAL_VENDORS = [
  {
    id: 1,
    vendorCode: 'VND-00124',
    companyName: 'Apex Cloud Systems Ltd',
    contactPerson: 'David Chen',
    email: 'dchen@apexcloud.io',
    phone: '+1 555-019-2831',
    address: '100 Silicon Way, Tech Park',
    city: 'San Francisco',
    state: 'CA',
    country: 'USA',
    postalCode: '94105',
    taxId: 'US-99382104',
    status: 'ACTIVE',
    rating: 4.8,
    paymentTerms: 'Net 30',
    notes: 'Primary cloud infrastructure and high-availability data center hosting partner.'
  },
  {
    id: 2,
    vendorCode: 'VND-00123',
    companyName: 'Nexus Global Logistics',
    contactPerson: 'Sarah Jenkins',
    email: 's.jenkins@nexuslogistics.com',
    phone: '+1 555-014-9923',
    address: '450 Harbor Boulevard, Suite 800',
    city: 'Seattle',
    state: 'WA',
    country: 'USA',
    postalCode: '98101',
    taxId: 'US-88491022',
    status: 'ACTIVE',
    rating: 4.6,
    paymentTerms: 'Net 45',
    notes: 'International freight forwarding, container tracking, and bonded warehousing.'
  },
  {
    id: 3,
    vendorCode: 'VND-00122',
    companyName: 'Precision Dynamics Corp',
    contactPerson: 'Marcus Vance',
    email: 'm.vance@precisiondyn.com',
    phone: '+1 555-017-8821',
    address: '88 Industrial Parkway',
    city: 'Detroit',
    state: 'MI',
    country: 'USA',
    postalCode: '48201',
    taxId: 'US-77123904',
    status: 'ACTIVE',
    rating: 4.9,
    paymentTerms: 'Net 30',
    notes: 'High-precision industrial component manufacturing and robotic automation parts.'
  },
  {
    id: 4,
    vendorCode: 'VND-00121',
    companyName: 'Quantum CyberSec Tech',
    contactPerson: 'Elena Rostova',
    email: 'erostova@quantumsec.org',
    phone: '+1 555-018-4412',
    address: '12 Cyber Way, Security Tower',
    city: 'Austin',
    state: 'TX',
    country: 'USA',
    postalCode: '78701',
    taxId: 'US-66401923',
    status: 'PENDING_APPROVAL',
    rating: 4.2,
    paymentTerms: 'Net 15',
    notes: 'Enterprise endpoint protection, SOC monitoring, and cybersecurity compliance audit.'
  },
  {
    id: 5,
    vendorCode: 'VND-00120',
    companyName: 'Vanguard Steel Works',
    contactPerson: 'Robert Miller',
    email: 'rmiller@vanguardsteel.com',
    phone: '+1 555-012-7788',
    address: '77 Foundry Rd',
    city: 'Pittsburgh',
    state: 'PA',
    country: 'USA',
    postalCode: '15201',
    taxId: 'US-55219034',
    status: 'ACTIVE',
    rating: 4.5,
    paymentTerms: 'Net 60',
    notes: 'Structural steel framing, alloy plates, and raw metal fabrication supplies.'
  },
  {
    id: 6,
    vendorCode: 'VND-00119',
    companyName: 'Pinnacle Raw Materials',
    contactPerson: 'Anita Rao',
    email: 'arao@pinnacleraw.com',
    phone: '+1 555-013-1122',
    address: '320 Commerce Drive',
    city: 'Chicago',
    state: 'IL',
    country: 'USA',
    postalCode: '60601',
    taxId: 'US-44391820',
    status: 'INACTIVE',
    rating: 3.9,
    paymentTerms: 'Immediate',
    notes: 'Bulk mineral and chemical supply. Inactive account pending quarterly review.'
  },
  {
    id: 7,
    vendorCode: 'VND-00118',
    companyName: 'CyberFlow Networking',
    contactPerson: 'Kenji Takahashi',
    email: 'ktakahashi@cyberflow.net',
    phone: '+1 555-016-5544',
    address: '500 Technology Loop',
    city: 'San Jose',
    state: 'CA',
    country: 'USA',
    postalCode: '95110',
    taxId: 'US-33829104',
    status: 'ACTIVE',
    rating: 4.7,
    paymentTerms: 'Net 30',
    notes: 'Core routing equipment, transceivers, and optical networking supplies.'
  },
  {
    id: 8,
    vendorCode: 'VND-00117',
    companyName: 'Titan Industrial Solutions',
    contactPerson: 'Liam O’Connor',
    email: 'loconnor@titanind.com',
    phone: '+1 555-011-8899',
    address: '900 Factory Lane',
    city: 'Cleveland',
    state: 'OH',
    country: 'USA',
    postalCode: '44101',
    taxId: 'US-22910482',
    status: 'BLOCKED',
    rating: 2.3,
    paymentTerms: 'Net 30',
    notes: 'Blocked due to recurring delivery delay penalties and quality non-conformance.'
  }
];

const EMPTY_FORM = {
  vendorCode: '',
  companyName: '',
  contactPerson: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  country: 'USA',
  postalCode: '',
  taxId: '',
  status: 'ACTIVE',
  rating: 4.5,
  paymentTerms: 'Net 30',
  notes: ''
};

export default function Vendor() {
  // Main Data States
  const [vendors, setVendors] = useState(INITIAL_VENDORS);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [isLiveBackend, setIsLiveBackend] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Modals & Feedback
  const [detailVendor, setDetailVendor] = useState(null);
  const [formModal, setFormModal] = useState({ isOpen: false, isEdit: false, data: EMPTY_FORM });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, vendor: null });
  const [toastMessage, setToastMessage] = useState('');

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  }, []);

  // Fetch Vendors from Spring Boot Backend API
  const fetchVendors = useCallback(async (isManual = false) => {
    setRefreshing(true);
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken') || localStorage.getItem('jwt');
    const authHeaders = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    try {
      const res = await fetch('http://localhost:8080/api/vendors?size=50', { headers: authHeaders });
      if (res.ok) {
        const data = await res.json();
        const vendorList = data?.data?.content || data?.data;
        if (Array.isArray(vendorList) && vendorList.length > 0) {
          setVendors(vendorList);
          setIsLiveBackend(true);
          if (isManual) showToast('Vendors synced with live backend database');
          return;
        }
      }
      throw new Error('Fallback needed');
    } catch {
      setIsLiveBackend(false);
      if (isManual) showToast('Running in standalone demo mode (Backend not connected)');
    } finally {
      setRefreshing(false);
    }
  }, [showToast]);

  useEffect(() => {
    let ignore = false;
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken') || localStorage.getItem('jwt');
    const authHeaders = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    fetch('http://localhost:8080/api/vendors?size=50', { headers: authHeaders })
      .then(r => r.json())
      .then(d => {
        if (!ignore) {
          const list = d?.data?.content || d?.data;
          if (Array.isArray(list) && list.length > 0) {
            setVendors(list);
            setIsLiveBackend(true);
          }
        }
      })
      .catch(() => {
        if (!ignore) setIsLiveBackend(false);
      });

    return () => { ignore = true; };
  }, []);

  // Quick Action to open Create Modal with auto-generated code
  const handleOpenCreateModal = () => {
    const nextNum = vendors.length + 125;
    setFormModal({
      isOpen: true,
      isEdit: false,
      data: {
        ...EMPTY_FORM,
        vendorCode: `VND-00${nextNum}`
      }
    });
  };

  // Open Edit Modal
  const handleOpenEditModal = (vendor) => {
    setFormModal({
      isOpen: true,
      isEdit: true,
      data: { ...vendor }
    });
  };

  // Save (Create or Update)
  const handleSaveVendor = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken') || localStorage.getItem('jwt');
    const authHeaders = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    const isEdit = formModal.isEdit;
    const payload = formModal.data;

    if (!payload.companyName || !payload.contactPerson || !payload.email || !payload.phone) {
      showToast('Please fill in Company Name, Contact Person, Email, and Phone.');
      return;
    }

    try {
      if (isEdit) {
        // Try backend PUT
        await fetch(`http://localhost:8080/api/vendors/${payload.id}`, {
          method: 'PUT',
          headers: authHeaders,
          body: JSON.stringify(payload)
        });
        setVendors(prev => prev.map(v => v.id === payload.id ? { ...payload } : v));
        if (detailVendor && detailVendor.id === payload.id) {
          setDetailVendor({ ...payload });
        }
        showToast(`Vendor ${payload.companyName} updated successfully!`);
      } else {
        // Try backend POST
        const res = await fetch('http://localhost:8080/api/vendors', {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify(payload)
        });
        let newVendor = payload;
        if (res.ok) {
          const resData = await res.json();
          if (resData.data) newVendor = resData.data;
        } else {
          newVendor = { ...payload, id: Date.now() };
        }
        setVendors(prev => [newVendor, ...prev]);
        showToast(`Vendor ${payload.companyName} registered successfully!`);
      }
    } catch {
      // Local fallback update
      if (isEdit) {
        setVendors(prev => prev.map(v => v.id === payload.id ? { ...payload } : v));
        showToast(`Vendor ${payload.companyName} updated locally.`);
      } else {
        const newVendor = { ...payload, id: Date.now() };
        setVendors(prev => [newVendor, ...prev]);
        showToast(`Vendor ${payload.companyName} registered locally.`);
      }
    } finally {
      setFormModal({ isOpen: false, isEdit: false, data: EMPTY_FORM });
    }
  };

  // Change Vendor Status
  const handleUpdateStatus = async (vendorId, newStatus) => {
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken') || localStorage.getItem('jwt');
    const authHeaders = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    try {
      await fetch(`http://localhost:8080/api/vendors/${vendorId}/status`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({ status: newStatus, reason: 'Status updated via management console' })
      });
    } catch {
      // Offline fallback
    }

    setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, status: newStatus } : v));
    if (detailVendor && detailVendor.id === vendorId) {
      setDetailVendor(prev => ({ ...prev, status: newStatus }));
    }
    showToast(`Status changed to ${newStatus.replace('_', ' ')}!`);
  };

  // Delete Vendor
  const handleConfirmDelete = async () => {
    if (!deleteModal.vendor) return;
    const vendorId = deleteModal.vendor.id;
    const companyName = deleteModal.vendor.companyName;

    const token = localStorage.getItem('token') || localStorage.getItem('accessToken') || localStorage.getItem('jwt');
    const authHeaders = {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    try {
      await fetch(`http://localhost:8080/api/vendors/${vendorId}`, {
        method: 'DELETE',
        headers: authHeaders
      });
    } catch {
      // Offline fallback
    }

    setVendors(prev => prev.filter(v => v.id !== vendorId));
    if (detailVendor && detailVendor.id === vendorId) {
      setDetailVendor(null);
    }
    setDeleteModal({ isOpen: false, vendor: null });
    showToast(`Vendor ${companyName} removed from directory.`);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Vendor Code,Company Name,Contact Person,Email,Phone,City,State,Status,Rating,Payment Terms'];
    const rows = filteredVendors.map(v =>
      `"${v.vendorCode}","${v.companyName}","${v.contactPerson}","${v.email}","${v.phone}","${v.city || ''}","${v.state || ''}","${v.status}","${v.rating || ''}","${v.paymentTerms || ''}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Vendor_Directory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Vendor directory exported to CSV!');
  };

  // KPI Calculations
  const total = vendors.length;
  const active = vendors.filter(v => v.status === 'ACTIVE').length;
  const pending = vendors.filter(v => v.status === 'PENDING_APPROVAL').length;
  const inactive = vendors.filter(v => v.status === 'INACTIVE').length;
  const blocked = vendors.filter(v => v.status === 'BLOCKED').length;

  const ratedVendors = vendors.filter(v => v.rating && v.rating > 0);
  const avgRating = ratedVendors.length > 0
    ? (ratedVendors.reduce((sum, v) => sum + v.rating, 0) / ratedVendors.length).toFixed(1)
    : '0.0';

  const stats = { total, active, pending, inactive, blocked, avgRating };

  // Filtered Vendors based on Tab & Search Query
  const q = searchQuery.toLowerCase().trim();
  const filteredVendors = vendors.filter(v => {
    const matchesTab = statusFilter === 'ALL' || v.status === statusFilter;
    const matchesSearch = !q ||
      (v.companyName && v.companyName.toLowerCase().includes(q)) ||
      (v.vendorCode && v.vendorCode.toLowerCase().includes(q)) ||
      (v.contactPerson && v.contactPerson.toLowerCase().includes(q)) ||
      (v.email && v.email.toLowerCase().includes(q)) ||
      (v.city && v.city.toLowerCase().includes(q));
    return matchesTab && matchesSearch;
  });

  // Helper for Status Badge
  const renderStatusBadge = (status) => {
    if (!status) return null;
    const clean = status.toLowerCase();
    const label = status.replace('_', ' ');
    return <span className={`status-badge ${clean}`}>{label}</span>;
  };

  return (
    <div className="vendor-dashboard-container">
      {/* 1. HERO BANNER & REAL-TIME CONTROLS */}
      <section className="vendor-hero-banner">
        <div className="vendor-hero-left">
          <h2>
            <span>Vendor Management Directory</span>
            <span className="vendor-hero-icon" style={{ display: 'inline-flex', verticalAlign: 'middle', marginLeft: '8px' }}>
              <Building2 size={24} color="#6366F1" />
            </span>
          </h2>
          <div className="vendor-hero-subtitle">
            <span>Supplier Lifecycle, Compliance, and Commercial Partnerships</span>
            <div className={`vendor-live-badge ${isLiveBackend ? 'live' : 'demo'}`}>
              <span className="badge-dot" />
              <span>{isLiveBackend ? 'Live DB Connected' : 'Interactive Demo Mode'}</span>
            </div>
          </div>
        </div>

        <div className="vendor-hero-actions">
          <button
            className={`vendor-btn vendor-btn-refresh ${refreshing ? 'spinning' : ''}`}
            onClick={() => fetchVendors(true)}
            title="Reload directory"
          >
            <span className="refresh-icon">↻</span>
            <span>{refreshing ? 'Syncing...' : 'Refresh'}</span>
          </button>

          <button
            className="vendor-btn vendor-btn-export"
            onClick={handleExportCSV}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>

          <button
            className="vendor-btn vendor-btn-primary"
            onClick={handleOpenCreateModal}
          >
            <span>+ Register Vendor</span>
          </button>
        </div>
      </section>

      {/* 2. TOP KPI CARDS */}
      <section className="vendor-kpi-grid">
        <div className="vendor-kpi-card" onClick={() => setStatusFilter('ALL')} style={{ cursor: 'pointer' }}>
          <div className="vendor-kpi-accent" />
          <div className="kpi-top-row">
            <span className="kpi-title">Total Registered</span>
            <div className="kpi-icon-pill">
              <Building2 size={20} />
            </div>
          </div>
          <div className="kpi-value">{stats.total}</div>
          <div className="kpi-footer">
            <span className="kpi-subtext">Active Ecosystem • All Categories</span>
          </div>
        </div>

        <div className="vendor-kpi-card" onClick={() => setStatusFilter('ACTIVE')} style={{ cursor: 'pointer' }}>
          <div className="vendor-kpi-accent" />
          <div className="kpi-top-row">
            <span className="kpi-title">Active & Verified</span>
            <div className="kpi-icon-pill">
              <CheckCircle size={20} />
            </div>
          </div>
          <div className="kpi-value">{stats.active}</div>
          <div className="kpi-footer">
            <span className="kpi-subtext">{Math.round((stats.active / (stats.total || 1)) * 100)}% of Directory • SLA Compliant</span>
          </div>
        </div>

        <div className="vendor-kpi-card" onClick={() => setStatusFilter('PENDING_APPROVAL')} style={{ cursor: 'pointer' }}>
          <div className="vendor-kpi-accent" />
          <div className="kpi-top-row">
            <span className="kpi-title">Pending Onboarding</span>
            <div className="kpi-icon-pill">
              <Zap size={20} />
            </div>
          </div>
          <div className="kpi-value">{stats.pending}</div>
          <div className="kpi-footer">
            <span className="kpi-subtext">{stats.pending} Pending • Requires Review</span>
          </div>
        </div>

        <div className="vendor-kpi-card">
          <div className="vendor-kpi-accent" />
          <div className="kpi-top-row">
            <span className="kpi-title">Avg Supplier Rating</span>
            <div className="kpi-icon-pill">
              <Star size={20} fill="currentColor" />
            </div>
          </div>
          <div className="kpi-value" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Star size={18} fill="currentColor" />
            <span>{stats.avgRating}</span>
          </div>
          <div className="kpi-footer">
            <span className="kpi-subtext">Rated out of 5.0 • High Reliability</span>
          </div>
        </div>
      </section>

      {/* 3. TOOLBAR & FILTER CARD */}
      <section className="vendor-filter-card">
        <div className="vendor-status-tabs">
          <button
            className={`vendor-tab-btn ${statusFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setStatusFilter('ALL')}
          >
            <span>All</span>
            <span className="vendor-tab-count">{stats.total}</span>
          </button>
          <button
            className={`vendor-tab-btn ${statusFilter === 'ACTIVE' ? 'active' : ''}`}
            onClick={() => setStatusFilter('ACTIVE')}
          >
            <span>Active</span>
            <span className="vendor-tab-count">{stats.active}</span>
          </button>
          <button
            className={`vendor-tab-btn ${statusFilter === 'PENDING_APPROVAL' ? 'active' : ''}`}
            onClick={() => setStatusFilter('PENDING_APPROVAL')}
          >
            <span>Pending</span>
            <span className="vendor-tab-count">{stats.pending}</span>
          </button>
          <button
            className={`vendor-tab-btn ${statusFilter === 'INACTIVE' ? 'active' : ''}`}
            onClick={() => setStatusFilter('INACTIVE')}
          >
            <span>Inactive</span>
            <span className="vendor-tab-count">{stats.inactive}</span>
          </button>
          <button
            className={`vendor-tab-btn ${statusFilter === 'BLOCKED' ? 'active' : ''}`}
            onClick={() => setStatusFilter('BLOCKED')}
          >
            <span>Blocked</span>
            <span className="vendor-tab-count">{stats.blocked}</span>
          </button>
        </div>

        <div className="vendor-search-group">
          <div className="vendor-search-box">
            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search by name, code, contact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="view-toggle-group">
            <button
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Card Grid View"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            >
              <LayoutGrid size={14} />
              <span>Cards</span>
            </button>
            <button
              className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table List View"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            >
              <List size={14} />
              <span>Table</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4. MAIN CONTENT AREA: GRID OR TABLE */}
      {filteredVendors.length === 0 ? (
        <div className="vendor-empty-state">
          <div className="empty-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Building2 size={36} />
          </div>
          <div className="empty-title">No vendors found</div>
          <p className="empty-desc">Try clearing the search query or changing your status filter.</p>
        </div>
      ) : viewMode === 'grid' ? (
        /* CARD GRID VIEW */
        <div className="vendor-cards-grid">
          {filteredVendors.map((vendor) => (
            <div key={vendor.id} className="vendor-item-card">
              <div className="card-top-header">
                <div className="company-avatar-box">
                  <div className="vendor-avatar-circle">
                    {vendor.companyName?.slice(0, 2).toUpperCase() || 'VN'}
                  </div>
                  <div className="company-title-wrap">
                    <h3>{vendor.companyName}</h3>
                    <span className="vendor-code-tag">{vendor.vendorCode}</span>
                  </div>
                </div>
                {renderStatusBadge(vendor.status)}
              </div>

              <div className="card-summary-info">
                <div className="summary-item">
                  <span className="summary-lbl">Primary Contact</span>
                  <span className="summary-val">{vendor.contactPerson}</span>
                </div>
                <div className="summary-item">
                  <span className="summary-lbl">Location</span>
                  <span className="summary-val">{vendor.city ? `${vendor.city}${vendor.state ? `, ${vendor.state}` : ''}` : 'Corporate Office'}</span>
                </div>
              </div>

              <div className="card-actions-row">
                <button
                  className="vendor-btn-view-details"
                  onClick={() => setDetailVendor(vendor)}
                >
                  <Eye size={14} />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* DENSE TABLE VIEW */
        <div className="vendor-table-card">
          <div className="vendor-table-wrapper">
            <table className="vendor-table">
              <thead>
                <tr>
                  <th>Vendor Code</th>
                  <th>Company Name</th>
                  <th>Primary Contact</th>
                  <th>Email & Phone</th>
                  <th>Location</th>
                  <th>Payment Terms</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVendors.map((vendor) => (
                  <tr key={vendor.id}>
                    <td className="vendor-cell-code">{vendor.vendorCode}</td>
                    <td className="vendor-cell-bold">{vendor.companyName}</td>
                    <td>{vendor.contactPerson}</td>
                    <td>
                      <div>{vendor.email}</div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{vendor.phone}</div>
                    </td>
                    <td>{vendor.city ? `${vendor.city}, ${vendor.state || ''}` : 'N/A'}</td>
                    <td><span className="vendor-terms-pill">{vendor.paymentTerms || 'Net 30'}</span></td>
                    <td>
                      <span className="rating-stars" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <span className="star-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>
                          <Star size={12} fill="currentColor" />
                        </span>
                        <span>{vendor.rating ? vendor.rating.toFixed(1) : 'N/A'}</span>
                      </span>
                    </td>
                    <td>{renderStatusBadge(vendor.status)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          className="action-btn-sm"
                          onClick={() => setDetailVendor(vendor)}
                        >
                          View
                        </button>
                        <button
                          className="action-btn-sm"
                          onClick={() => handleOpenEditModal(vendor)}
                        >
                          Edit
                        </button>
                        <button
                          className="action-btn-sm action-btn-delete"
                          onClick={() => setDeleteModal({ isOpen: true, vendor })}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. VENDOR DETAIL PROFILE MODAL */}
      {detailVendor && (
        <div className="vendor-modal-overlay" onClick={() => setDetailVendor(null)}>
          <div className="vendor-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="vendor-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', color: '#6366F1' }}>
                  <Building2 size={24} />
                </span>
                <div>
                  <h3 style={{ margin: 0 }}>{detailVendor.companyName}</h3>
                  <span style={{ fontFamily: 'monospace', color: '#38bdf8', fontSize: '0.82rem' }}>
                    {detailVendor.vendorCode}
                  </span>
                </div>
              </div>
              <button className="vendor-modal-close" onClick={() => setDetailVendor(null)}>×</button>
            </div>

            <div className="vendor-modal-body">
              <div className="vendor-detail-row">
                <span className="detail-label">Status</span>
                <span className="detail-value">{renderStatusBadge(detailVendor.status)}</span>
              </div>
              <div className="vendor-detail-row">
                <span className="detail-label">Rating Score</span>
                <span className="detail-value" style={{ color: '#f59e0b', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={13} fill="currentColor" />
                  <span>{detailVendor.rating ? detailVendor.rating.toFixed(1) : 'N/A'} / 5.0</span>
                </span>
              </div>
              <div className="vendor-detail-row">
                <span className="detail-label">Primary Contact Person</span>
                <span className="detail-value">{detailVendor.contactPerson}</span>
              </div>
              <div className="vendor-detail-row">
                <span className="detail-label">Official Email</span>
                <span className="detail-value" style={{ color: '#38bdf8' }}>
                  <a href={`mailto:${detailVendor.email}`} style={{ color: '#38bdf8', textDecoration: 'none' }}>
                    {detailVendor.email}
                  </a>
                </span>
              </div>
              <div className="vendor-detail-row">
                <span className="detail-label">Telephone</span>
                <span className="detail-value">{detailVendor.phone}</span>
              </div>
              <div className="vendor-detail-row">
                <span className="detail-label">Tax ID / VAT</span>
                <span className="detail-value">{detailVendor.taxId || 'N/A'}</span>
              </div>
              <div className="vendor-detail-row">
                <span className="detail-label">Payment Terms</span>
                <span className="detail-value">{detailVendor.paymentTerms || 'Net 30'}</span>
              </div>
              <div className="vendor-detail-row">
                <span className="detail-label">Headquarters / Address</span>
                <span className="detail-value">
                  {detailVendor.address || ''} {detailVendor.city ? `, ${detailVendor.city}` : ''} {detailVendor.state || ''} {detailVendor.postalCode || ''}
                </span>
              </div>
              {detailVendor.notes && (
                <div style={{ marginTop: '8px' }}>
                  <span className="detail-label" style={{ display: 'block', marginBottom: '4px' }}>
                    Commercial Notes & Description:
                  </span>
                  <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '8px', border: '1px solid #334155', fontSize: '0.86rem', color: '#cbd5e1' }}>
                    {detailVendor.notes}
                  </div>
                </div>
              )}

              {/* Quick Status Control Inside Detail Modal */}
              <div style={{ marginTop: '12px', borderTop: '1px solid #334155', paddingTop: '14px' }}>
                <span className="detail-label" style={{ display: 'block', marginBottom: '8px' }}>
                  Quick Status Update:
                </span>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {detailVendor.status !== 'ACTIVE' && (
                    <button
                      className="vendor-btn vendor-btn-export"
                      style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      onClick={() => handleUpdateStatus(detailVendor.id, 'ACTIVE')}
                    >
                      <Check size={12} />
                      <span>Mark as Active</span>
                    </button>
                  )}
                  {detailVendor.status !== 'INACTIVE' && (
                    <button
                      className="vendor-btn vendor-btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      onClick={() => handleUpdateStatus(detailVendor.id, 'INACTIVE')}
                    >
                      Set Inactive
                    </button>
                  )}
                  {detailVendor.status !== 'BLOCKED' && (
                    <button
                      className="vendor-btn action-btn-delete"
                      style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                      onClick={() => handleUpdateStatus(detailVendor.id, 'BLOCKED')}
                    >
                      Block Supplier
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="vendor-modal-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                className="vendor-btn action-btn-delete"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                onClick={() => {
                  const target = detailVendor;
                  setDetailVendor(null);
                  setDeleteModal({ isOpen: true, vendor: target });
                }}
              >
                <Trash2 size={14} />
                <span>Delete Supplier</span>
              </button>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="vendor-btn vendor-btn-secondary" onClick={() => setDetailVendor(null)}>
                  Close
                </button>
                <button
                  className="vendor-btn vendor-btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  onClick={() => {
                    const target = detailVendor;
                    setDetailVendor(null);
                    handleOpenEditModal(target);
                  }}
                >
                  <Pencil size={14} />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. VENDOR CREATE / EDIT MODAL */}
      {formModal.isOpen && (
        <div className="vendor-modal-overlay" onClick={() => setFormModal({ isOpen: false, isEdit: false, data: EMPTY_FORM })}>
          <div className="vendor-modal-box" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSaveVendor}>
              <div className="vendor-modal-header">
                <h3>{formModal.isEdit ? 'Edit Supplier Profile' : 'Register New Supplier'}</h3>
                <button
                  type="button"
                  className="vendor-modal-close"
                  onClick={() => setFormModal({ isOpen: false, isEdit: false, data: EMPTY_FORM })}
                >
                  ×
                </button>
              </div>

              <div className="vendor-modal-body">
                <div className="form-grid-2">
                  <div className="vendor-form-group">
                    <label>Vendor Code *</label>
                    <input
                      type="text"
                      required
                      value={formModal.data.vendorCode}
                      onChange={(e) => setFormModal(prev => ({
                        ...prev,
                        data: { ...prev.data, vendorCode: e.target.value }
                      }))}
                    />
                  </div>

                  <div className="vendor-form-group">
                    <label>Company Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Acme Industrial Ltd"
                      value={formModal.data.companyName}
                      onChange={(e) => setFormModal(prev => ({
                        ...prev,
                        data: { ...prev.data, companyName: e.target.value }
                      }))}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="vendor-form-group">
                    <label>Contact Person *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={formModal.data.contactPerson}
                      onChange={(e) => setFormModal(prev => ({
                        ...prev,
                        data: { ...prev.data, contactPerson: e.target.value }
                      }))}
                    />
                  </div>

                  <div className="vendor-form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="john@acme.com"
                      value={formModal.data.email}
                      onChange={(e) => setFormModal(prev => ({
                        ...prev,
                        data: { ...prev.data, email: e.target.value }
                      }))}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="vendor-form-group">
                    <label>Phone Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="+1 555-019-2831"
                      value={formModal.data.phone}
                      onChange={(e) => setFormModal(prev => ({
                        ...prev,
                        data: { ...prev.data, phone: e.target.value }
                      }))}
                    />
                  </div>

                  <div className="vendor-form-group">
                    <label>Tax ID / VAT</label>
                    <input
                      type="text"
                      placeholder="e.g. US-99382104"
                      value={formModal.data.taxId || ''}
                      onChange={(e) => setFormModal(prev => ({
                        ...prev,
                        data: { ...prev.data, taxId: e.target.value }
                      }))}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="vendor-form-group">
                    <label>City</label>
                    <input
                      type="text"
                      placeholder="e.g. San Francisco"
                      value={formModal.data.city || ''}
                      onChange={(e) => setFormModal(prev => ({
                        ...prev,
                        data: { ...prev.data, city: e.target.value }
                      }))}
                    />
                  </div>

                  <div className="vendor-form-group">
                    <label>State / Region</label>
                    <input
                      type="text"
                      placeholder="e.g. CA"
                      value={formModal.data.state || ''}
                      onChange={(e) => setFormModal(prev => ({
                        ...prev,
                        data: { ...prev.data, state: e.target.value }
                      }))}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="vendor-form-group">
                    <label>Payment Terms</label>
                    <select
                      value={formModal.data.paymentTerms || 'Net 30'}
                      onChange={(e) => setFormModal(prev => ({
                        ...prev,
                        data: { ...prev.data, paymentTerms: e.target.value }
                      }))}
                    >
                      <option value="Net 15">Net 15</option>
                      <option value="Net 30">Net 30</option>
                      <option value="Net 45">Net 45</option>
                      <option value="Net 60">Net 60</option>
                      <option value="Immediate">Immediate</option>
                    </select>
                  </div>

                  <div className="vendor-form-group">
                    <label>Status</label>
                    <select
                      value={formModal.data.status}
                      onChange={(e) => setFormModal(prev => ({
                        ...prev,
                        data: { ...prev.data, status: e.target.value }
                      }))}
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="PENDING_APPROVAL">PENDING APPROVAL</option>
                      <option value="INACTIVE">INACTIVE</option>
                      <option value="BLOCKED">BLOCKED</option>
                    </select>
                  </div>
                </div>

                <div className="vendor-form-group">
                  <label>Commercial Notes</label>
                  <textarea
                    placeholder="Enter supplier scope, specialties, or contract conditions..."
                    value={formModal.data.notes || ''}
                    onChange={(e) => setFormModal(prev => ({
                      ...prev,
                      data: { ...prev.data, notes: e.target.value }
                    }))}
                  />
                </div>
              </div>

              <div className="vendor-modal-footer">
                <button
                  type="button"
                  className="vendor-btn vendor-btn-secondary"
                  onClick={() => setFormModal({ isOpen: false, isEdit: false, data: EMPTY_FORM })}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="vendor-btn vendor-btn-primary"
                >
                  {formModal.isEdit ? 'Save Changes' : 'Register Supplier'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. DELETE CONFIRMATION MODAL */}
      {deleteModal.isOpen && deleteModal.vendor && (
        <div className="vendor-modal-overlay" onClick={() => setDeleteModal({ isOpen: false, vendor: null })}>
          <div className="vendor-modal-box" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div className="vendor-modal-header">
              <h3 style={{ color: '#f87171' }}>Confirm Vendor Deletion</h3>
              <button className="vendor-modal-close" onClick={() => setDeleteModal({ isOpen: false, vendor: null })}>×</button>
            </div>
            <div className="vendor-modal-body">
              <p style={{ margin: 0, color: '#cbd5e1', lineHeight: '1.5' }}>
                Are you sure you want to remove <strong style={{ color: '#E2E8F0' }}>{deleteModal.vendor.companyName}</strong> ({deleteModal.vendor.vendorCode}) from the directory?
              </p>
              <div style={{ padding: '10px 14px', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#f87171', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                <span>Warning: This action permanently removes supplier details from the system.</span>
              </div>
            </div>
            <div className="vendor-modal-footer">
              <button className="vendor-btn vendor-btn-secondary" onClick={() => setDeleteModal({ isOpen: false, vendor: null })}>
                Cancel
              </button>
              <button
                className="vendor-btn action-btn-delete"
                style={{ padding: '8px 16px', fontWeight: 700 }}
                onClick={handleConfirmDelete}
              >
                Delete Vendor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="vendor-toast">
          <span className="toast-dot" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
