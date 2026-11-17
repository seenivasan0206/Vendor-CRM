import { useState, useEffect, useCallback } from 'react';
import '../Styles/Contractmanage.css';

// Realistic initial contracts matching backend ContractResponse schema
const INITIAL_CONTRACTS = [
  {
    id: 1,
    contractNumber: 'CNT-2024-012',
    title: 'Data Center Maintenance & Infrastructure SLA',
    vendorId: 1,
    vendorCompanyName: 'Apex Cloud Systems Ltd',
    vendorCode: 'VND-00124',
    startDate: '2024-12-01',
    endDate: '2026-11-30',
    contractValue: 180000.00,
    status: 'ACTIVE',
    termsAndConditions: 'Guaranteed 99.99% uptime, 15-minute response time for critical incidents, 24/7 engineering support.',
    autoRenew: true,
    renewalNoticeDays: 30
  },
  {
    id: 2,
    contractNumber: 'CNT-2023-045',
    title: 'Global Freight Forwarding & Logistics Master Agreement',
    vendorId: 2,
    vendorCompanyName: 'Nexus Global Logistics',
    vendorCode: 'VND-00123',
    startDate: '2023-11-20',
    endDate: '2026-11-20',
    contractValue: 420000.00,
    status: 'ACTIVE',
    termsAndConditions: 'Worldwide multimodal container shipping, customs clearance, bonded warehousing, and demurrage liability cap.',
    autoRenew: false,
    renewalNoticeDays: 60
  },
  {
    id: 3,
    contractNumber: 'CNT-2025-078',
    title: 'Precision Robotic Components Supply Term',
    vendorId: 3,
    vendorCompanyName: 'Precision Dynamics Corp',
    vendorCode: 'VND-00122',
    startDate: '2025-01-15',
    endDate: '2026-12-05',
    contractValue: 310000.00,
    status: 'ACTIVE',
    termsAndConditions: 'Quarterly batch manufacturing delivery, ISO 9001 certified quality tolerances, 1-year replacement warranty on defects.',
    autoRenew: true,
    renewalNoticeDays: 45
  },
  {
    id: 4,
    contractNumber: 'CNT-2024-031',
    title: 'Enterprise Endpoint Protection & Threat Intelligence',
    vendorId: 4,
    vendorCompanyName: 'Quantum CyberSec Tech',
    vendorCode: 'VND-00121',
    startDate: '2024-11-25',
    endDate: '2026-11-25',
    contractValue: 95000.00,
    status: 'ACTIVE',
    termsAndConditions: 'Zero-day endpoint detection, continuous vulnerability scans, quarterly penetration testing reports, SOC tier 3 integration.',
    autoRenew: false,
    renewalNoticeDays: 30
  },
  {
    id: 5,
    contractNumber: 'CNT-2025-009',
    title: 'Raw Structural Steel Master Procurement Contract',
    vendorId: 5,
    vendorCompanyName: 'Vanguard Steel Works',
    vendorCode: 'VND-00120',
    startDate: '2025-02-01',
    endDate: '2027-01-31',
    contractValue: 850000.00,
    status: 'ACTIVE',
    termsAndConditions: 'Fixed price hedge per metric ton, standard mill test certificates included, delivery to regional fabrication yards.',
    autoRenew: true,
    renewalNoticeDays: 60
  },
  {
    id: 6,
    contractNumber: 'CNT-2026-099',
    title: 'Optical Network Hardware & Maintenance Term',
    vendorId: 7,
    vendorCompanyName: 'CyberFlow Networking',
    vendorCode: 'VND-00118',
    startDate: '2026-03-01',
    endDate: '2027-02-28',
    contractValue: 240000.00,
    status: 'ACTIVE',
    termsAndConditions: 'Next-business-day hardware replacement, firmware lifecycle management, redundant dark fiber lease terms.',
    autoRenew: true,
    renewalNoticeDays: 30
  },
  {
    id: 7,
    contractNumber: 'CNT-2023-014',
    title: 'Heavy Plant Maintenance & Tooling Framework',
    vendorId: 8,
    vendorCompanyName: 'Titan Industrial Solutions',
    vendorCode: 'VND-00117',
    startDate: '2023-01-01',
    endDate: '2025-12-31',
    contractValue: 160000.00,
    status: 'EXPIRED',
    termsAndConditions: 'On-site preventive maintenance services. Expired and superseded by internal technical team operations.',
    autoRenew: false,
    renewalNoticeDays: 30
  },
  {
    id: 8,
    contractNumber: 'CNT-2026-104',
    title: 'Chemical Reagent Supply Draft Term',
    vendorId: 6,
    vendorCompanyName: 'Pinnacle Raw Materials',
    vendorCode: 'VND-00119',
    startDate: '2026-12-01',
    endDate: '2027-11-30',
    contractValue: 75000.00,
    status: 'DRAFT',
    termsAndConditions: 'Draft awaiting legal compliance signoff and material safety data sheet (MSDS) verification.',
    autoRenew: false,
    renewalNoticeDays: 30
  }
];

const KNOWN_VENDORS = [
  { id: 1, name: 'Apex Cloud Systems Ltd', code: 'VND-00124' },
  { id: 2, name: 'Nexus Global Logistics', code: 'VND-00123' },
  { id: 3, name: 'Precision Dynamics Corp', code: 'VND-00122' },
  { id: 4, name: 'Quantum CyberSec Tech', code: 'VND-00121' },
  { id: 5, name: 'Vanguard Steel Works', code: 'VND-00120' },
  { id: 6, name: 'Pinnacle Raw Materials', code: 'VND-00119' },
  { id: 7, name: 'CyberFlow Networking', code: 'VND-00118' },
  { id: 8, name: 'Titan Industrial Solutions', code: 'VND-00117' }
];

const EMPTY_CONTRACT_FORM = {
  contractNumber: '',
  title: '',
  vendorId: 1,
  vendorCompanyName: 'Apex Cloud Systems Ltd',
  startDate: new Date().toISOString().slice(0, 10),
  endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  contractValue: '',
  status: 'ACTIVE',
  termsAndConditions: '',
  autoRenew: true,
  renewalNoticeDays: 30
};

// Helper: Calculate days remaining
function getDaysRemaining(endDateStr) {
  if (!endDateStr) return null;
  const target = new Date(endDateStr);
  const now = new Date();
  const diffTime = target - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Helper: Format currency
function formatCurrency(amount) {
  if (amount == null) return '$0.00';
  const num = typeof amount === 'number' ? amount : parseFloat(amount);
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num);
}

// Helper: Format large currency abbreviated
function formatAbbreviatedCurrency(amount) {
  if (amount == null) return '$0';
  const num = typeof amount === 'number' ? amount : parseFloat(amount);
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(1)}k`;
  return `$${num.toFixed(0)}`;
}

export default function Contractmanage() {
  // Main Data States
  const [contracts, setContracts] = useState(INITIAL_CONTRACTS);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [isLiveBackend, setIsLiveBackend] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Modals & Feedback
  const [detailContract, setDetailContract] = useState(null);
  const [formModal, setFormModal] = useState({ isOpen: false, isEdit: false, data: EMPTY_CONTRACT_FORM });
  const [renewModal, setRenewModal] = useState({ isOpen: false, contract: null, newEndDate: '', newContractValue: '', notes: '' });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, contract: null });
  const [toastMessage, setToastMessage] = useState('');

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  }, []);

  // Fetch contracts from Spring Boot Backend API
  const fetchContracts = useCallback(async (isManual = false) => {
    setRefreshing(true);
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken') || localStorage.getItem('jwt');
    const authHeaders = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    try {
      const res = await fetch('http://localhost:8080/api/contracts?size=50', { headers: authHeaders });
      if (res.ok) {
        const data = await res.json();
        const list = data?.data?.content || data?.data;
        if (Array.isArray(list) && list.length > 0) {
          setContracts(list);
          setIsLiveBackend(true);
          if (isManual) showToast('Contracts synced with live backend database');
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

    fetch('http://localhost:8080/api/contracts?size=50', { headers: authHeaders })
      .then(r => r.json())
      .then(d => {
        if (!ignore) {
          const list = d?.data?.content || d?.data;
          if (Array.isArray(list) && list.length > 0) {
            setContracts(list);
            setIsLiveBackend(true);
          }
        }
      })
      .catch(() => {
        if (!ignore) setIsLiveBackend(false);
      });

    return () => { ignore = true; };
  }, []);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    const nextNum = contracts.length + 105;
    setFormModal({
      isOpen: true,
      isEdit: false,
      data: {
        ...EMPTY_CONTRACT_FORM,
        contractNumber: `CNT-2026-${nextNum}`
      }
    });
  };

  // Open Edit Modal
  const handleOpenEditModal = (contract) => {
    setFormModal({
      isOpen: true,
      isEdit: true,
      data: { ...contract }
    });
  };

  // Save Contract (Create or Update)
  const handleSaveContract = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken') || localStorage.getItem('jwt');
    const authHeaders = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    const isEdit = formModal.isEdit;
    const payload = formModal.data;

    if (!payload.contractNumber || !payload.title || !payload.startDate || !payload.endDate || !payload.contractValue) {
      showToast('Please fill all required contract fields.');
      return;
    }

    try {
      if (isEdit) {
        await fetch(`http://localhost:8080/api/contracts/${payload.id}`, {
          method: 'PUT',
          headers: authHeaders,
          body: JSON.stringify(payload)
        });
        setContracts(prev => prev.map(c => c.id === payload.id ? { ...payload } : c));
        if (detailContract && detailContract.id === payload.id) setDetailContract({ ...payload });
        showToast(`Contract ${payload.contractNumber} updated successfully!`);
      } else {
        const res = await fetch('http://localhost:8080/api/contracts', {
          method: 'POST',
          headers: authHeaders,
          body: JSON.stringify(payload)
        });
        let newContract = payload;
        if (res.ok) {
          const resData = await res.json();
          if (resData.data) newContract = resData.data;
        } else {
          newContract = { ...payload, id: Date.now() };
        }
        setContracts(prev => [newContract, ...prev]);
        showToast(`Contract ${payload.contractNumber} created successfully!`);
      }
    } catch {
      // Local fallback
      if (isEdit) {
        setContracts(prev => prev.map(c => c.id === payload.id ? { ...payload } : c));
        showToast(`Contract ${payload.contractNumber} updated locally.`);
      } else {
        const newContract = { ...payload, id: Date.now() };
        setContracts(prev => [newContract, ...prev]);
        showToast(`Contract ${payload.contractNumber} created locally.`);
      }
    } finally {
      setFormModal({ isOpen: false, isEdit: false, data: EMPTY_CONTRACT_FORM });
    }
  };

  // Open Renew Modal
  const handleOpenRenewModal = (contract) => {
    const curEnd = new Date(contract.endDate);
    const nextYearEnd = new Date(curEnd.setFullYear(curEnd.getFullYear() + 1)).toISOString().slice(0, 10);
    setRenewModal({
      isOpen: true,
      contract,
      newEndDate: nextYearEnd,
      newContractValue: contract.contractValue,
      notes: 'Standard 1-year contract renewal with indexation.'
    });
  };

  // Submit Renewal
  const handleConfirmRenew = async (e) => {
    e.preventDefault();
    if (!renewModal.contract) return;
    const contractId = renewModal.contract.id;
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken') || localStorage.getItem('jwt');
    const authHeaders = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    try {
      await fetch(`http://localhost:8080/api/contracts/${contractId}/renew`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          newEndDate: renewModal.newEndDate,
          newContractValue: renewModal.newContractValue,
          notes: renewModal.notes
        })
      });
    } catch {
      // Fallback
    }

    setContracts(prev => prev.map(c => {
      if (c.id === contractId) {
        return {
          ...c,
          endDate: renewModal.newEndDate,
          contractValue: Number(renewModal.newContractValue),
          status: 'ACTIVE'
        };
      }
      return c;
    }));

    if (detailContract && detailContract.id === contractId) {
      setDetailContract(prev => ({
        ...prev,
        endDate: renewModal.newEndDate,
        contractValue: Number(renewModal.newContractValue),
        status: 'ACTIVE'
      }));
    }

    const cNum = renewModal.contract.contractNumber;
    setRenewModal({ isOpen: false, contract: null, newEndDate: '', newContractValue: '', notes: '' });
    showToast(`Contract ${cNum} renewed until ${renewModal.newEndDate}!`);
  };

  // Delete Contract
  const handleConfirmDelete = async () => {
    if (!deleteModal.contract) return;
    const contractId = deleteModal.contract.id;
    const cNum = deleteModal.contract.contractNumber;
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken') || localStorage.getItem('jwt');
    const authHeaders = {
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    try {
      await fetch(`http://localhost:8080/api/contracts/${contractId}`, {
        method: 'DELETE',
        headers: authHeaders
      });
    } catch {
      // Fallback
    }

    setContracts(prev => prev.filter(c => c.id !== contractId));
    if (detailContract && detailContract.id === contractId) setDetailContract(null);
    setDeleteModal({ isOpen: false, contract: null });
    showToast(`Contract ${cNum} deleted.`);
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Contract Number,Title,Vendor,Start Date,End Date,Value,Status,Auto Renew'];
    const rows = filteredContracts.map(c =>
      `"${c.contractNumber}","${c.title}","${c.vendorCompanyName || ''}","${c.startDate}","${c.endDate}","${c.contractValue}","${c.status}","${c.autoRenew ? 'Yes' : 'No'}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Contracts_Portfolio_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Contracts portfolio exported to CSV!');
  };

  // KPI Calculations
  const total = contracts.length;
  const active = contracts.filter(c => c.status === 'ACTIVE').length;
  const draft = contracts.filter(c => c.status === 'DRAFT').length;
  const expired = contracts.filter(c => c.status === 'EXPIRED').length;

  const expiringSoon = contracts.filter(c => {
    if (c.status !== 'ACTIVE') return false;
    const days = getDaysRemaining(c.endDate);
    return days !== null && days <= 30 && days >= 0;
  }).length;

  const totalValue = contracts.reduce((sum, c) => sum + (Number(c.contractValue) || 0), 0);
  const activeValue = contracts
    .filter(c => c.status === 'ACTIVE')
    .reduce((sum, c) => sum + (Number(c.contractValue) || 0), 0);

  const stats = { total, active, draft, expired, expiringSoon, totalValue, activeValue };

  // Filtered Contracts
  const q = searchQuery.toLowerCase().trim();
  const filteredContracts = contracts.filter(c => {
    let matchesTab = true;
    if (statusFilter === 'EXPIRING_SOON') {
      const d = getDaysRemaining(c.endDate);
      matchesTab = c.status === 'ACTIVE' && d !== null && d <= 30 && d >= 0;
    } else if (statusFilter !== 'ALL') {
      matchesTab = c.status === statusFilter;
    }

    const matchesSearch = !q ||
      (c.contractNumber && c.contractNumber.toLowerCase().includes(q)) ||
      (c.title && c.title.toLowerCase().includes(q)) ||
      (c.vendorCompanyName && c.vendorCompanyName.toLowerCase().includes(q)) ||
      (c.vendorCode && c.vendorCode.toLowerCase().includes(q));

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
    <div className="contracts-container">
      {/* 1. HERO BANNER & REAL-TIME CONTROLS */}
      <section className="contracts-hero-banner">
        <div className="contracts-hero-left">
          <h2>
            <span>Contract Management & SLA Portfolio</span>
            <span role="img" aria-label="scroll">📜</span>
          </h2>
          <div className="contracts-hero-subtitle">
            <span>Supplier Agreements, Automated Expiration Tracking & Renewals</span>
            <div className={`contracts-live-badge ${isLiveBackend ? 'live' : 'demo'}`}>
              <span className="badge-dot" />
              <span>{isLiveBackend ? 'Live DB Connected' : 'Interactive Demo Mode'}</span>
            </div>
          </div>
        </div>

        <div className="contracts-hero-actions">
          <button
            className={`contracts-btn contracts-btn-refresh ${refreshing ? 'spinning' : ''}`}
            onClick={() => fetchContracts(true)}
            title="Reload contracts"
          >
            <span className="refresh-icon">↻</span>
            <span>{refreshing ? 'Syncing...' : 'Refresh'}</span>
          </button>

          <button
            className="contracts-btn contracts-btn-export"
            onClick={handleExportCSV}
          >
            <span>📥 Export CSV</span>
          </button>

          <button
            className="contracts-btn contracts-btn-primary"
            onClick={handleOpenCreateModal}
          >
            <span>+ Create Contract</span>
          </button>
        </div>
      </section>

      {/* 2. TOP 4 CONTRACT KPI CARDS */}
      <section className="contracts-kpi-grid">
        <div className="contracts-kpi-card" onClick={() => setStatusFilter('ACTIVE')} style={{ cursor: 'pointer' }}>
          <div className="contracts-kpi-accent accent-blue" />
          <div className="kpi-top-row">
            <span className="kpi-title">Active Contracts</span>
            <div className="kpi-icon-pill pill-blue">📜</div>
          </div>
          <div className="kpi-value">{stats.active}</div>
          <div className="kpi-footer">
            <span className="kpi-tag tag-success">{Math.round((stats.active / (stats.total || 1)) * 100)}% Active</span>
            <span style={{ color: '#38bdf8', fontWeight: 600 }}>{stats.total} Total Portfolio</span>
          </div>
        </div>

        <div className="contracts-kpi-card">
          <div className="contracts-kpi-accent accent-purple" />
          <div className="kpi-top-row">
            <span className="kpi-title">Total Portfolio Value</span>
            <div className="kpi-icon-pill pill-purple">💎</div>
          </div>
          <div className="kpi-value">{formatAbbreviatedCurrency(stats.totalValue)}</div>
          <div className="kpi-footer">
            <span className="kpi-tag tag-neutral">{formatAbbreviatedCurrency(stats.activeValue)} Active</span>
            <span style={{ color: '#c084fc' }}>Commercial Valuation</span>
          </div>
        </div>

        <div className="contracts-kpi-card" onClick={() => setStatusFilter('EXPIRING_SOON')} style={{ cursor: 'pointer' }}>
          <div className="contracts-kpi-accent accent-amber" />
          <div className="kpi-top-row">
            <span className="kpi-title">Expiring Soon (30 Days)</span>
            <div className="kpi-icon-pill pill-amber">⏳</div>
          </div>
          <div className="kpi-value">{stats.expiringSoon}</div>
          <div className="kpi-footer">
            <span className="kpi-tag tag-warning">Attention Needed</span>
            <span style={{ color: '#fbbf24' }}>Upcoming Renewals</span>
          </div>
        </div>

        <div className="contracts-kpi-card" onClick={() => setStatusFilter('DRAFT')} style={{ cursor: 'pointer' }}>
          <div className="contracts-kpi-accent accent-green" />
          <div className="kpi-top-row">
            <span className="kpi-title">Draft & Review</span>
            <div className="kpi-icon-pill pill-green">✍️</div>
          </div>
          <div className="kpi-value">{stats.draft}</div>
          <div className="kpi-footer">
            <span className="kpi-tag tag-neutral">{stats.expired} Expired</span>
            <span style={{ color: '#34d399' }}>Pipeline Agreements</span>
          </div>
        </div>
      </section>

      {/* 3. TOOLBAR & STATUS FILTERS */}
      <section className="contracts-filter-card">
        <div className="contracts-status-tabs">
          <button
            className={`contracts-tab-btn ${statusFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setStatusFilter('ALL')}
          >
            <span>All</span>
            <span className="contracts-tab-count">{stats.total}</span>
          </button>
          <button
            className={`contracts-tab-btn ${statusFilter === 'ACTIVE' ? 'active' : ''}`}
            onClick={() => setStatusFilter('ACTIVE')}
          >
            <span>Active</span>
            <span className="contracts-tab-count">{stats.active}</span>
          </button>
          <button
            className={`contracts-tab-btn ${statusFilter === 'EXPIRING_SOON' ? 'active' : ''}`}
            onClick={() => setStatusFilter('EXPIRING_SOON')}
          >
            <span>Expiring Soon</span>
            <span className="contracts-tab-count urgent">{stats.expiringSoon}</span>
          </button>
          <button
            className={`contracts-tab-btn ${statusFilter === 'DRAFT' ? 'active' : ''}`}
            onClick={() => setStatusFilter('DRAFT')}
          >
            <span>Draft</span>
            <span className="contracts-tab-count">{stats.draft}</span>
          </button>
          <button
            className={`contracts-tab-btn ${statusFilter === 'EXPIRED' ? 'active' : ''}`}
            onClick={() => setStatusFilter('EXPIRED')}
          >
            <span>Expired</span>
            <span className="contracts-tab-count">{stats.expired}</span>
          </button>
        </div>

        <div className="contracts-search-group">
          <div className="contracts-search-box">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search by contract #, title, supplier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="contracts-view-toggle">
            <button
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Card View"
            >
              <span>🔲</span>
              <span>Cards</span>
            </button>
            <button
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <span>📋</span>
              <span>Table</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4. MAIN CONTENT AREA: GRID OR TABLE */}
      {filteredContracts.length === 0 ? (
        <div className="contracts-empty-state">
          <div className="empty-icon">📜</div>
          <div className="empty-title">No contracts found</div>
          <p className="empty-desc">Try clearing the search query or changing your status filter.</p>
        </div>
      ) : viewMode === 'grid' ? (
        /* CARD GRID VIEW */
        <div className="contracts-grid">
          {filteredContracts.map((contract) => {
            const daysLeft = getDaysRemaining(contract.endDate);
            const isUrgent = daysLeft !== null && daysLeft <= 15 && daysLeft >= 0;
            return (
              <div key={contract.id} className="contract-card">
                <div>
                  <div className="contract-card-header">
                    <span className="contract-code-tag">{contract.contractNumber}</span>
                    {renderStatusBadge(contract.status)}
                  </div>

                  <div className="contract-title-wrap">
                    <h3>{contract.title}</h3>
                    <div className="contract-vendor-link">
                      <span>🏢</span>
                      <span>{contract.vendorCompanyName || 'Supplier Partner'}</span>
                    </div>
                  </div>

                  <div className="contract-dates-box" style={{ marginTop: '14px' }}>
                    <div className="dates-row">
                      <span className="dates-label">Validity Period:</span>
                      <span>{contract.startDate} ➔ {contract.endDate}</span>
                    </div>
                    <div className="dates-row" style={{ alignItems: 'center' }}>
                      <span className="dates-label">Expiration Status:</span>
                      {daysLeft !== null && daysLeft > 0 ? (
                        <span className={`contract-countdown-badge ${isUrgent ? 'urgent' : ''}`}>
                          ⏳ {daysLeft} days remaining
                        </span>
                      ) : daysLeft !== null && daysLeft <= 0 ? (
                        <span className="contract-countdown-badge urgent">
                          ⚠️ Expired
                        </span>
                      ) : (
                        <span>N/A</span>
                      )}
                    </div>
                    <div className="dates-row" style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                      <span>Auto-Renew: {contract.autoRenew ? '✓ Enabled' : 'Disabled'}</span>
                      <span>Notice: {contract.renewalNoticeDays || 30} days</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="contract-value-footer">
                    <div className="contract-val-display">
                      <span className="val-label">Contract Value</span>
                      <span className="val-amount">{formatCurrency(contract.contractValue)}</span>
                    </div>

                    <div className="contract-actions-cluster">
                      <button
                        className="action-btn-sm"
                        style={{ backgroundColor: '#0284c7', borderColor: '#0284c7', color: '#fff' }}
                        onClick={() => setDetailContract(contract)}
                      >
                        Details
                      </button>

                      <button
                        className="action-btn-sm action-btn-renew"
                        onClick={() => handleOpenRenewModal(contract)}
                        title="Renew agreement"
                      >
                        🔄 Renew
                      </button>

                      <button
                        className="action-btn-sm"
                        onClick={() => handleOpenEditModal(contract)}
                        title="Edit contract"
                      >
                        ✏️
                      </button>

                      <button
                        className="action-btn-sm action-btn-delete"
                        onClick={() => setDeleteModal({ isOpen: true, contract })}
                        title="Delete contract"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* DENSE TABLE VIEW */
        <div className="contracts-table-card">
          <div className="contracts-table-wrapper">
            <table className="contracts-table">
              <thead>
                <tr>
                  <th>Contract #</th>
                  <th>Title</th>
                  <th>Vendor Partner</th>
                  <th>Validity Dates</th>
                  <th>Days Left</th>
                  <th>Contract Value</th>
                  <th>Auto-Renew</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContracts.map((contract) => {
                  const daysLeft = getDaysRemaining(contract.endDate);
                  const isUrgent = daysLeft !== null && daysLeft <= 15 && daysLeft >= 0;
                  return (
                    <tr key={contract.id}>
                      <td className="cell-code">{contract.contractNumber}</td>
                      <td className="cell-bold">{contract.title}</td>
                      <td>{contract.vendorCompanyName}</td>
                      <td>{contract.startDate} to {contract.endDate}</td>
                      <td>
                        {daysLeft !== null && daysLeft > 0 ? (
                          <span className={`contract-countdown-badge ${isUrgent ? 'urgent' : ''}`}>
                            ⏳ {daysLeft}d left
                          </span>
                        ) : daysLeft !== null && daysLeft <= 0 ? (
                          <span className="contract-countdown-badge urgent">Expired</span>
                        ) : (
                          'N/A'
                        )}
                      </td>
                      <td className="cell-val">{formatCurrency(contract.contractValue)}</td>
                      <td>{contract.autoRenew ? '✓ Yes' : 'No'}</td>
                      <td>{renderStatusBadge(contract.status)}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            className="action-btn-sm"
                            onClick={() => setDetailContract(contract)}
                          >
                            View
                          </button>
                          <button
                            className="action-btn-sm action-btn-renew"
                            onClick={() => handleOpenRenewModal(contract)}
                          >
                            Renew
                          </button>
                          <button
                            className="action-btn-sm"
                            onClick={() => handleOpenEditModal(contract)}
                          >
                            Edit
                          </button>
                          <button
                            className="action-btn-sm action-btn-delete"
                            onClick={() => setDeleteModal({ isOpen: true, contract })}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. CONTRACT DETAIL MODAL */}
      {detailContract && (
        <div className="contracts-modal-overlay" onClick={() => setDetailContract(null)}>
          <div className="contracts-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="contracts-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.4rem' }}>📜</span>
                <div>
                  <h3 style={{ margin: 0 }}>{detailContract.title}</h3>
                  <span style={{ fontFamily: 'monospace', color: '#38bdf8', fontSize: '0.82rem' }}>
                    {detailContract.contractNumber}
                  </span>
                </div>
              </div>
              <button className="contracts-modal-close" onClick={() => setDetailContract(null)}>×</button>
            </div>

            <div className="contracts-modal-body">
              <div className="detail-row">
                <span className="detail-lbl">Status</span>
                <span className="detail-val">{renderStatusBadge(detailContract.status)}</span>
              </div>
              <div className="detail-row">
                <span className="detail-lbl">Vendor Partner</span>
                <span className="detail-val" style={{ color: '#38bdf8' }}>
                  {detailContract.vendorCompanyName} ({detailContract.vendorCode || 'VND'})
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-lbl">Contract Value</span>
                <span className="detail-val" style={{ color: '#34d399', fontSize: '1.1rem' }}>
                  {formatCurrency(detailContract.contractValue)}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-lbl">Start Date</span>
                <span className="detail-val">{detailContract.startDate}</span>
              </div>
              <div className="detail-row">
                <span className="detail-lbl">End Date / Expiration</span>
                <span className="detail-val">{detailContract.endDate}</span>
              </div>
              <div className="detail-row">
                <span className="detail-lbl">Days Remaining</span>
                <span className="detail-val">
                  {getDaysRemaining(detailContract.endDate) !== null ? `${getDaysRemaining(detailContract.endDate)} days` : 'N/A'}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-lbl">Auto-Renewal Clause</span>
                <span className="detail-val">
                  {detailContract.autoRenew ? `✓ Enabled (${detailContract.renewalNoticeDays || 30} days notice)` : 'Manual Renewal Only'}
                </span>
              </div>

              {detailContract.termsAndConditions && (
                <div style={{ marginTop: '10px' }}>
                  <span className="detail-lbl" style={{ display: 'block', marginBottom: '6px' }}>
                    Commercial Terms & Conditions:
                  </span>
                  <div style={{ backgroundColor: '#0f172a', padding: '12px', borderRadius: '8px', border: '1px solid #334155', fontSize: '0.86rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                    {detailContract.termsAndConditions}
                  </div>
                </div>
              )}
            </div>

            <div className="contracts-modal-footer">
              <button className="contracts-btn contracts-btn-secondary" onClick={() => setDetailContract(null)}>
                Close
              </button>
              <button
                className="contracts-btn action-btn-renew"
                onClick={() => {
                  const target = detailContract;
                  setDetailContract(null);
                  handleOpenRenewModal(target);
                }}
              >
                🔄 Extend / Renew Contract
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. CONTRACT RENEWAL MODAL */}
      {renewModal.isOpen && renewModal.contract && (
        <div className="contracts-modal-overlay" onClick={() => setRenewModal({ isOpen: false, contract: null, newEndDate: '', newContractValue: '', notes: '' })}>
          <div className="contracts-modal-box" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleConfirmRenew}>
              <div className="contracts-modal-header">
                <h3>🔄 Renew Contract: {renewModal.contract.contractNumber}</h3>
                <button
                  type="button"
                  className="contracts-modal-close"
                  onClick={() => setRenewModal({ isOpen: false, contract: null, newEndDate: '', newContractValue: '', notes: '' })}
                >
                  ×
                </button>
              </div>

              <div className="contracts-modal-body">
                <div style={{ padding: '10px 14px', backgroundColor: 'rgba(56, 189, 248, 0.12)', border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '8px', color: '#38bdf8', fontSize: '0.85rem' }}>
                  Extending contract term for <strong>{renewModal.contract.title}</strong> with {renewModal.contract.vendorCompanyName}.
                </div>

                <div className="contracts-form-group">
                  <label>New End Date *</label>
                  <input
                    type="date"
                    required
                    value={renewModal.newEndDate}
                    onChange={(e) => setRenewModal(prev => ({ ...prev, newEndDate: e.target.value }))}
                  />
                </div>

                <div className="contracts-form-group">
                  <label>Adjusted Contract Value ($) *</label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={renewModal.newContractValue}
                    onChange={(e) => setRenewModal(prev => ({ ...prev, newContractValue: e.target.value }))}
                  />
                </div>

                <div className="contracts-form-group">
                  <label>Extension Notes / Escalation Clause</label>
                  <textarea
                    value={renewModal.notes}
                    onChange={(e) => setRenewModal(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
              </div>

              <div className="contracts-modal-footer">
                <button
                  type="button"
                  className="contracts-btn contracts-btn-secondary"
                  onClick={() => setRenewModal({ isOpen: false, contract: null, newEndDate: '', newContractValue: '', notes: '' })}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="contracts-btn action-btn-renew"
                  style={{ padding: '9px 18px', fontWeight: 700 }}
                >
                  ✓ Confirm & Renew
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 7. CREATE / EDIT CONTRACT MODAL */}
      {formModal.isOpen && (
        <div className="contracts-modal-overlay" onClick={() => setFormModal({ isOpen: false, isEdit: false, data: EMPTY_CONTRACT_FORM })}>
          <div className="contracts-modal-box" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSaveContract}>
              <div className="contracts-modal-header">
                <h3>{formModal.isEdit ? 'Edit Agreement' : 'Create New Commercial Contract'}</h3>
                <button
                  type="button"
                  className="contracts-modal-close"
                  onClick={() => setFormModal({ isOpen: false, isEdit: false, data: EMPTY_CONTRACT_FORM })}
                >
                  ×
                </button>
              </div>

              <div className="contracts-modal-body">
                <div className="form-grid-2">
                  <div className="contracts-form-group">
                    <label>Contract Number *</label>
                    <input
                      type="text"
                      required
                      value={formModal.data.contractNumber}
                      onChange={(e) => setFormModal(prev => ({
                        ...prev,
                        data: { ...prev.data, contractNumber: e.target.value }
                      }))}
                    />
                  </div>

                  <div className="contracts-form-group">
                    <label>Vendor Partner *</label>
                    <select
                      value={formModal.data.vendorId}
                      onChange={(e) => {
                        const vId = Number(e.target.value);
                        const found = KNOWN_VENDORS.find(v => v.id === vId);
                        setFormModal(prev => ({
                          ...prev,
                          data: {
                            ...prev.data,
                            vendorId: vId,
                            vendorCompanyName: found ? found.name : ''
                          }
                        }));
                      }}
                    >
                      {KNOWN_VENDORS.map(v => (
                        <option key={v.id} value={v.id}>{v.name} ({v.code})</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="contracts-form-group">
                  <label>Contract Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Master Logistics & Transport Framework Agreement"
                    value={formModal.data.title}
                    onChange={(e) => setFormModal(prev => ({
                      ...prev,
                      data: { ...prev.data, title: e.target.value }
                    }))}
                  />
                </div>

                <div className="form-grid-2">
                  <div className="contracts-form-group">
                    <label>Start Date *</label>
                    <input
                      type="date"
                      required
                      value={formModal.data.startDate}
                      onChange={(e) => setFormModal(prev => ({
                        ...prev,
                        data: { ...prev.data, startDate: e.target.value }
                      }))}
                    />
                  </div>

                  <div className="contracts-form-group">
                    <label>End Date *</label>
                    <input
                      type="date"
                      required
                      value={formModal.data.endDate}
                      onChange={(e) => setFormModal(prev => ({
                        ...prev,
                        data: { ...prev.data, endDate: e.target.value }
                      }))}
                    />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="contracts-form-group">
                    <label>Contract Value ($) *</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      placeholder="e.g. 150000"
                      value={formModal.data.contractValue}
                      onChange={(e) => setFormModal(prev => ({
                        ...prev,
                        data: { ...prev.data, contractValue: e.target.value }
                      }))}
                    />
                  </div>

                  <div className="contracts-form-group">
                    <label>Contract Status</label>
                    <select
                      value={formModal.data.status}
                      onChange={(e) => setFormModal(prev => ({
                        ...prev,
                        data: { ...prev.data, status: e.target.value }
                      }))}
                    >
                      <option value="ACTIVE">ACTIVE</option>
                      <option value="DRAFT">DRAFT</option>
                      <option value="EXPIRED">EXPIRED</option>
                      <option value="TERMINATED">TERMINATED</option>
                    </select>
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="contracts-form-group">
                    <label>Renewal Notice (Days)</label>
                    <input
                      type="number"
                      value={formModal.data.renewalNoticeDays || 30}
                      onChange={(e) => setFormModal(prev => ({
                        ...prev,
                        data: { ...prev.data, renewalNoticeDays: Number(e.target.value) }
                      }))}
                    />
                  </div>

                  <div className="contracts-form-group" style={{ justifyContent: 'center' }}>
                    <div className="checkbox-row">
                      <input
                        type="checkbox"
                        id="autoRenewCheck"
                        checked={formModal.data.autoRenew}
                        onChange={(e) => setFormModal(prev => ({
                          ...prev,
                          data: { ...prev.data, autoRenew: e.target.checked }
                        }))}
                      />
                      <label htmlFor="autoRenewCheck">Enable Automated Evergreen Renewal</label>
                    </div>
                  </div>
                </div>

                <div className="contracts-form-group">
                  <label>Terms & Conditions / SLA Metrics</label>
                  <textarea
                    placeholder="Enter agreed SLA response thresholds, penalties, and jurisdiction..."
                    value={formModal.data.termsAndConditions || ''}
                    onChange={(e) => setFormModal(prev => ({
                      ...prev,
                      data: { ...prev.data, termsAndConditions: e.target.value }
                    }))}
                  />
                </div>
              </div>

              <div className="contracts-modal-footer">
                <button
                  type="button"
                  className="contracts-btn contracts-btn-secondary"
                  onClick={() => setFormModal({ isOpen: false, isEdit: false, data: EMPTY_CONTRACT_FORM })}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="contracts-btn contracts-btn-primary"
                >
                  {formModal.isEdit ? 'Save Changes' : 'Execute Contract'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. DELETE CONFIRMATION MODAL */}
      {deleteModal.isOpen && deleteModal.contract && (
        <div className="contracts-modal-overlay" onClick={() => setDeleteModal({ isOpen: false, contract: null })}>
          <div className="contracts-modal-box" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div className="contracts-modal-header">
              <h3 style={{ color: '#f87171' }}>Delete Contract</h3>
              <button className="contracts-modal-close" onClick={() => setDeleteModal({ isOpen: false, contract: null })}>×</button>
            </div>
            <div className="contracts-modal-body">
              <p style={{ margin: 0, color: '#cbd5e1', lineHeight: '1.5' }}>
                Are you sure you want to delete <strong style={{ color: '#f8fafc' }}>{deleteModal.contract.title}</strong> ({deleteModal.contract.contractNumber})?
              </p>
              <div style={{ padding: '10px 14px', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#f87171', fontSize: '0.82rem' }}>
                ⚠️ Warning: Terminating or removing contract records will permanently impact audit tracking.
              </div>
            </div>
            <div className="contracts-modal-footer">
              <button className="contracts-btn contracts-btn-secondary" onClick={() => setDeleteModal({ isOpen: false, contract: null })}>
                Cancel
              </button>
              <button
                className="contracts-btn action-btn-delete"
                style={{ padding: '8px 16px', fontWeight: 700 }}
                onClick={handleConfirmDelete}
              >
                Delete Contract
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 9. TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="contracts-toast">
          <span className="toast-dot" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

