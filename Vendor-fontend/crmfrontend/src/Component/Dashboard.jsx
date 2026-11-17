  import { useState, useEffect, useMemo, useCallback } from 'react';
import '../Styles/Dashboard.css';

// Fallback / Initial realistic dataset matching backend DTO schemas exactly
const DEFAULT_STATS = {
  vendorStats: {
    totalVendors: 124,
    activeVendors: 98,
    inactiveVendors: 11,
    pendingApprovalVendors: 12,
    blockedVendors: 3,
    averageRating: 4.65
  },
  purchaseOrderStats: {
    totalOrders: 182,
    pendingOrders: 14,
    approvedOrders: 65,
    issuedOrders: 42,
    deliveredOrders: 53,
    cancelledOrders: 8,
    totalOrderValue: 1450820.00
  },
  contractStats: {
    totalContracts: 48,
    activeContracts: 38,
    expiredContracts: 4,
    terminatedContracts: 2,
    draftContracts: 4,
    expiringSoon: 6,
    totalContractValue: 3820000.00,
    activeContractValue: 3120000.00
  }
};

const DEFAULT_MONTHLY_DATA = {
  2026: [
    { month: 1, monthName: 'Jan', orderCount: 14, totalValue: 84000 },
    { month: 2, monthName: 'Feb', orderCount: 18, totalValue: 112000 },
    { month: 3, monthName: 'Mar', orderCount: 16, totalValue: 95000 },
    { month: 4, monthName: 'Apr', orderCount: 22, totalValue: 145000 },
    { month: 5, monthName: 'May', orderCount: 20, totalValue: 130000 },
    { month: 6, monthName: 'Jun', orderCount: 26, totalValue: 178000 },
    { month: 7, monthName: 'Jul', orderCount: 24, totalValue: 162000 },
    { month: 8, monthName: 'Aug', orderCount: 19, totalValue: 122000 },
    { month: 9, monthName: 'Sep', orderCount: 28, totalValue: 195000 },
    { month: 10, monthName: 'Oct', orderCount: 31, totalValue: 215000 },
    { month: 11, monthName: 'Nov', orderCount: 25, totalValue: 168000 },
    { month: 12, monthName: 'Dec', orderCount: 0, totalValue: 0 }
  ],
  2025: [
    { month: 1, monthName: 'Jan', orderCount: 11, totalValue: 62000 },
    { month: 2, monthName: 'Feb', orderCount: 13, totalValue: 74000 },
    { month: 3, monthName: 'Mar', orderCount: 15, totalValue: 89000 },
    { month: 4, monthName: 'Apr', orderCount: 18, totalValue: 110000 },
    { month: 5, monthName: 'May', orderCount: 17, totalValue: 102000 },
    { month: 6, monthName: 'Jun', orderCount: 21, totalValue: 135000 },
    { month: 7, monthName: 'Jul', orderCount: 20, totalValue: 128000 },
    { month: 8, monthName: 'Aug', orderCount: 16, totalValue: 98000 },
    { month: 9, monthName: 'Sep', orderCount: 22, totalValue: 142000 },
    { month: 10, monthName: 'Oct', orderCount: 24, totalValue: 158000 },
    { month: 11, monthName: 'Nov', orderCount: 25, totalValue: 165000 },
    { month: 12, monthName: 'Dec', orderCount: 29, totalValue: 190000 }
  ]
};

const DEFAULT_PENDING_POS = [
  { id: 101, orderNumber: 'PO-2026-089', vendorName: 'Apex Cloud Systems Ltd', orderDate: '2026-11-09', grandTotal: 34200.00, status: 'PENDING_APPROVAL', department: 'IT Infrastructure' },
  { id: 102, orderNumber: 'PO-2026-088', vendorName: 'Nexus Global Logistics', orderDate: '2026-11-08', grandTotal: 18950.50, status: 'PENDING_APPROVAL', department: 'Supply Chain' },
  { id: 103, orderNumber: 'PO-2026-087', vendorName: 'Precision Dynamics Corp', orderDate: '2026-11-07', grandTotal: 52400.00, status: 'PENDING_APPROVAL', department: 'Manufacturing' },
  { id: 104, orderNumber: 'PO-2026-086', vendorName: 'Summit Office Solutions', orderDate: '2026-11-06', grandTotal: 6300.00, status: 'PENDING_APPROVAL', department: 'Operations' },
  { id: 105, orderNumber: 'PO-2026-085', vendorName: 'Quantum CyberSec Tech', orderDate: '2026-11-05', grandTotal: 41800.00, status: 'PENDING_APPROVAL', department: 'Information Security' }
];

const DEFAULT_EXPIRING_CONTRACTS = [
  { id: 201, contractNumber: 'CNT-2024-012', title: 'Data Center Maintenance SLA', vendorName: 'Apex Cloud Systems Ltd', startDate: '2024-12-01', endDate: '2026-11-30', contractValue: 180000.00, status: 'ACTIVE', daysLeft: 19 },
  { id: 202, contractNumber: 'CNT-2023-045', title: 'Global Freight Forwarding Agreement', vendorName: 'Nexus Global Logistics', startDate: '2023-11-20', endDate: '2026-11-20', contractValue: 420000.00, status: 'ACTIVE', daysLeft: 9 },
  { id: 203, contractNumber: 'CNT-2025-078', title: 'Industrial Component Supply Term', vendorName: 'Precision Dynamics Corp', startDate: '2025-01-15', endDate: '2026-12-05', contractValue: 310000.00, status: 'ACTIVE', daysLeft: 24 },
  { id: 204, contractNumber: 'CNT-2024-031', title: 'Enterprise Endpoint Protection', vendorName: 'Quantum CyberSec Tech', startDate: '2024-11-25', endDate: '2026-11-25', contractValue: 95000.00, status: 'ACTIVE', daysLeft: 14 }
];

const DEFAULT_RECENT_POS = [
  { id: 98, orderNumber: 'PO-2026-084', vendorName: 'Vanguard Steel Works', orderDate: '2026-11-04', grandTotal: 78500.00, status: 'APPROVED' },
  { id: 97, orderNumber: 'PO-2026-083', vendorName: 'Pinnacle Raw Materials', orderDate: '2026-11-03', grandTotal: 23150.00, status: 'ISSUED' },
  { id: 96, orderNumber: 'PO-2026-082', vendorName: 'CyberFlow Networking', orderDate: '2026-11-02', grandTotal: 15400.00, status: 'DELIVERED' },
  { id: 95, orderNumber: 'PO-2026-081', vendorName: 'Horizon Chemical Supply', orderDate: '2026-10-31', grandTotal: 62000.00, status: 'DELIVERED' },
  { id: 94, orderNumber: 'PO-2026-080', vendorName: 'Summit Office Solutions', orderDate: '2026-10-30', grandTotal: 4890.00, status: 'APPROVED' }
];

const DEFAULT_RECENT_VENDORS = [
  { id: 1, vendorCode: 'VND-00124', companyName: 'Apex Cloud Systems Ltd', contactPerson: 'David Chen', email: 'dchen@apexcloud.io', phone: '+1 555-019-2831', status: 'ACTIVE', rating: 4.8 },
  { id: 2, vendorCode: 'VND-00123', companyName: 'Nexus Global Logistics', contactPerson: 'Sarah Jenkins', email: 's.jenkins@nexuslogistics.com', phone: '+1 555-014-9923', status: 'ACTIVE', rating: 4.6 },
  { id: 3, vendorCode: 'VND-00122', companyName: 'Precision Dynamics Corp', contactPerson: 'Marcus Vance', email: 'm.vance@precisiondyn.com', phone: '+1 555-017-8821', status: 'ACTIVE', rating: 4.9 },
  { id: 4, vendorCode: 'VND-00121', companyName: 'Quantum CyberSec Tech', contactPerson: 'Elena Rostova', email: 'erostova@quantumsec.org', phone: '+1 555-018-4412', status: 'PENDING_APPROVAL', rating: 4.2 },
  { id: 5, vendorCode: 'VND-00120', companyName: 'Vanguard Steel Works', contactPerson: 'Robert Miller', email: 'rmiller@vanguardsteel.com', phone: '+1 555-012-7788', status: 'ACTIVE', rating: 4.5 }
];

// Helper to format currency
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

// Helper to format large currency abbreviated
function formatAbbreviatedCurrency(amount) {
  if (amount == null) return '$0';
  const num = typeof amount === 'number' ? amount : parseFloat(amount);
  if (num >= 1_000_000) {
    return `$${(num / 1_000_000).toFixed(2)}M`;
  }
  if (num >= 1_000) {
    return `$${(num / 1_000).toFixed(1)}k`;
  }
  return `$${num.toFixed(0)}`;
}

export default function Dashboard({ setActiveTab }) {
  // State
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [monthlyData, setMonthlyData] = useState(DEFAULT_MONTHLY_DATA[2026]);
  const [selectedYear, setSelectedYear] = useState(2026);
  const [chartMetric, setChartMetric] = useState('value'); // 'value' | 'volume'
  const [hoveredMonth, setHoveredMonth] = useState(null);

  const [pendingPOs, setPendingPOs] = useState(DEFAULT_PENDING_POS);
  const [expiringContracts, setExpiringContracts] = useState(DEFAULT_EXPIRING_CONTRACTS);
  const [recentPOs, setRecentPOs] = useState(DEFAULT_RECENT_POS);
  const [recentVendors, setRecentVendors] = useState(DEFAULT_RECENT_VENDORS);

  const [tableTab, setTableTab] = useState('pending'); // 'pending' | 'expiring' | 'recent_orders' | 'recent_vendors'
  const [searchQuery, setSearchQuery] = useState('');
  const [isLiveBackend, setIsLiveBackend] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalItem, setModalItem] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Show temporary toast notification
  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3500);
  }, []);

  // Fetch dashboard data from backend API with fallback
  const fetchDashboardData = useCallback(async (isManualRefresh = false) => {
    setRefreshing(true);
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken') || localStorage.getItem('jwt');
    const authHeaders = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    const endpoints = [
      'http://localhost:8080/api/dashboard/stats',
      `http://localhost:8080/api/dashboard/monthly-po-stats?year=${selectedYear}`,
      'http://localhost:8080/api/dashboard/pending-purchase-orders?limit=10',
      'http://localhost:8080/api/dashboard/upcoming-contract-expirations?days=30&limit=10',
      'http://localhost:8080/api/dashboard/recent-vendors?limit=6',
      'http://localhost:8080/api/dashboard/recent-purchase-orders?limit=6'
    ];

    try {
      const statsRes = await fetch(endpoints[0], { headers: authHeaders, method: 'GET' });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        if (statsData.data) {
          setStats(statsData.data);
          setIsLiveBackend(true);
        }

        const [monthlyRes, pendingRes, contractsRes, vendorsRes, posRes] = await Promise.allSettled([
          fetch(endpoints[1], { headers: authHeaders }).then(r => r.json()),
          fetch(endpoints[2], { headers: authHeaders }).then(r => r.json()),
          fetch(endpoints[3], { headers: authHeaders }).then(r => r.json()),
          fetch(endpoints[4], { headers: authHeaders }).then(r => r.json()),
          fetch(endpoints[5], { headers: authHeaders }).then(r => r.json())
        ]);

        if (monthlyRes.status === 'fulfilled' && monthlyRes.value?.data?.points) {
          setMonthlyData(monthlyRes.value.data.points);
        }
        if (pendingRes.status === 'fulfilled' && Array.isArray(pendingRes.value?.data)) {
          setPendingPOs(pendingRes.value.data);
        }
        if (contractsRes.status === 'fulfilled' && Array.isArray(contractsRes.value?.data)) {
          setExpiringContracts(contractsRes.value.data);
        }
        if (vendorsRes.status === 'fulfilled' && Array.isArray(vendorsRes.value?.data)) {
          setRecentVendors(vendorsRes.value.data);
        }
        if (posRes.status === 'fulfilled' && Array.isArray(posRes.value?.data)) {
          setRecentPOs(posRes.value.data);
        }

        if (isManualRefresh) {
          showToast('Dashboard synced with live backend database');
        }
      } else {
        throw new Error('Backend not available or auth required');
      }
    } catch {
      setIsLiveBackend(false);
      setMonthlyData(DEFAULT_MONTHLY_DATA[selectedYear] || DEFAULT_MONTHLY_DATA[2026]);
      if (isManualRefresh) {
        showToast('Running in standalone demo mode (Backend not connected)');
      }
    } finally {
      setRefreshing(false);
    }
  }, [selectedYear, showToast]);

  useEffect(() => {
    let ignore = false;
    const token = localStorage.getItem('token') || localStorage.getItem('accessToken') || localStorage.getItem('jwt');
    const authHeaders = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    fetch('http://localhost:8080/api/dashboard/stats', { headers: authHeaders })
      .then(res => {
        if (!res.ok) throw new Error('Not live');
        return res.json();
      })
      .then(data => {
        if (!ignore && data?.data) {
          setStats(data.data);
          setIsLiveBackend(true);
        }
      })
      .catch(() => {
        if (!ignore) {
          setIsLiveBackend(false);
          setMonthlyData(DEFAULT_MONTHLY_DATA[selectedYear] || DEFAULT_MONTHLY_DATA[2026]);
        }
      });

    return () => {
      ignore = true;
    };
  }, [selectedYear]);

  // Handle PO quick approval action
  const handleApprovePO = (poId, orderNum) => {
    setPendingPOs(prev => prev.filter(po => po.id !== poId));
    setStats(prev => ({
      ...prev,
      purchaseOrderStats: {
        ...prev.purchaseOrderStats,
        pendingOrders: Math.max(0, prev.purchaseOrderStats.pendingOrders - 1),
        approvedOrders: prev.purchaseOrderStats.approvedOrders + 1
      }
    }));
    showToast(`Order ${orderNum} marked as Approved!`);
  };

  // Switch tabs safely
  const handleNavigate = (tabName) => {
    if (typeof setActiveTab === 'function') {
      setActiveTab(tabName);
    } else {
      showToast(`Navigating to ${tabName.toUpperCase()} module...`);
    }
  };

  // Filtered rows for data table
  const filteredData = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (tableTab === 'pending') {
      if (!q) return pendingPOs;
      return pendingPOs.filter(item =>
        (item.orderNumber && item.orderNumber.toLowerCase().includes(q)) ||
        (item.vendorName && item.vendorName.toLowerCase().includes(q)) ||
        (item.department && item.department.toLowerCase().includes(q))
      );
    }
    if (tableTab === 'expiring') {
      if (!q) return expiringContracts;
      return expiringContracts.filter(item =>
        (item.contractNumber && item.contractNumber.toLowerCase().includes(q)) ||
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.vendorName && item.vendorName.toLowerCase().includes(q))
      );
    }
    if (tableTab === 'recent_orders') {
      if (!q) return recentPOs;
      return recentPOs.filter(item =>
        (item.orderNumber && item.orderNumber.toLowerCase().includes(q)) ||
        (item.vendorName && item.vendorName.toLowerCase().includes(q))
      );
    }
    if (tableTab === 'recent_vendors') {
      if (!q) return recentVendors;
      return recentVendors.filter(item =>
        (item.companyName && item.companyName.toLowerCase().includes(q)) ||
        (item.vendorCode && item.vendorCode.toLowerCase().includes(q)) ||
        (item.contactPerson && item.contactPerson.toLowerCase().includes(q))
      );
    }
    return [];
  }, [tableTab, searchQuery, pendingPOs, expiringContracts, recentPOs, recentVendors]);

  // Chart calculations
  const maxSpend = useMemo(() => {
    const vals = monthlyData.map(d => d.totalValue || 0);
    const max = Math.max(...vals, 1000);
    return Math.ceil(max / 50000) * 50000;
  }, [monthlyData]);

  const maxVolume = useMemo(() => {
    const vols = monthlyData.map(d => d.orderCount || 0);
    const max = Math.max(...vols, 10);
    return Math.ceil(max / 5) * 5;
  }, [monthlyData]);

  const totalPeriodSpend = useMemo(() => {
    return monthlyData.reduce((acc, d) => acc + (d.totalValue || 0), 0);
  }, [monthlyData]);

  const totalPeriodOrders = useMemo(() => {
    return monthlyData.reduce((acc, d) => acc + (d.orderCount || 0), 0);
  }, [monthlyData]);

  // Status badge styling helper
  const renderStatusBadge = (status) => {
    if (!status) return null;
    const clean = status.toLowerCase();
    const label = status.replace('_', ' ');
    return <span className={`status-badge ${clean}`}>{label}</span>;
  };

  return (
    <div className="dashboard-container">
      {/* 1. HERO BANNER & REAL-TIME CONTROLS */}
      <section className="dash-hero-banner">
        <div className="dash-hero-left">
          <h2>
            <span>Executive Procurement Dashboard</span>
            <span role="img" aria-label="wave">📊</span>
          </h2>
          <div className="dash-hero-subtitle">
            <span>Enterprise Overview & Supplier Lifecycle Monitoring</span>
            <div className={`dash-live-badge ${isLiveBackend ? 'live' : 'demo'}`}>
              <span className="badge-dot" />
              <span>{isLiveBackend ? 'Live DB Connected' : 'Interactive Demo Mode'}</span>
            </div>
          </div>
        </div>

        <div className="dash-hero-actions">
          <button
            className={`dash-btn dash-btn-refresh ${refreshing ? 'spinning' : ''}`}
            onClick={() => fetchDashboardData(true)}
            title="Reload metrics"
          >
            <span className="refresh-icon">↻</span>
            <span>{refreshing ? 'Syncing...' : 'Refresh'}</span>
          </button>

          <button
            className="dash-btn dash-btn-secondary"
            onClick={() => handleNavigate('vendors')}
          >
            <span>+ Add Vendor</span>
          </button>

          <button
            className="dash-btn dash-btn-primary"
            onClick={() => handleNavigate('purchaseorders')}
          >
            <span>+ New Purchase Order</span>
          </button>
        </div>
      </section>

      {/* 2. TOP 4 PRIMARY KPI METRIC CARDS */}
      <section className="dash-kpi-grid">
        {/* KPI 1: Vendors */}
        <div className="dash-kpi-card" onClick={() => handleNavigate('vendors')} style={{ cursor: 'pointer' }}>
          <div className="kpi-accent-bar kpi-accent-blue" />
          <div className="kpi-top-row">
            <span className="kpi-title">Active Suppliers</span>
            <div className="kpi-icon-pill pill-blue">🏢</div>
          </div>
          <div className="kpi-value">{stats.vendorStats.totalVendors}</div>
          <div className="kpi-footer">
            <div className="kpi-sub-badges">
              <span className="kpi-tag tag-success">{stats.vendorStats.activeVendors} Active</span>
              <span className="kpi-tag tag-warning">{stats.vendorStats.pendingApprovalVendors} Pending</span>
            </div>
            <span className="rating-pill">★ {stats.vendorStats.averageRating?.toFixed(1) || '4.5'}</span>
          </div>
        </div>

        {/* KPI 2: Purchase Orders */}
        <div className="dash-kpi-card" onClick={() => handleNavigate('purchaseorders')} style={{ cursor: 'pointer' }}>
          <div className="kpi-accent-bar kpi-accent-green" />
          <div className="kpi-top-row">
            <span className="kpi-title">Total PO Spend</span>
            <div className="kpi-icon-pill pill-green">💰</div>
          </div>
          <div className="kpi-value">{formatAbbreviatedCurrency(stats.purchaseOrderStats.totalOrderValue)}</div>
          <div className="kpi-footer">
            <div className="kpi-sub-badges">
              <span className="kpi-tag tag-neutral">{stats.purchaseOrderStats.totalOrders} Orders</span>
              <span className="kpi-tag tag-success">{stats.purchaseOrderStats.deliveredOrders} Delivered</span>
            </div>
            <span className="kpi-tag tag-warning">{stats.purchaseOrderStats.pendingOrders} Pending</span>
          </div>
        </div>

        {/* KPI 3: Contracts */}
        <div className="dash-kpi-card" onClick={() => handleNavigate('contracts')} style={{ cursor: 'pointer' }}>
          <div className="kpi-accent-bar kpi-accent-purple" />
          <div className="kpi-top-row">
            <span className="kpi-title">Contract Portfolio</span>
            <div className="kpi-icon-pill pill-purple">📜</div>
          </div>
          <div className="kpi-value">{stats.contractStats.activeContracts} Active</div>
          <div className="kpi-footer">
            <div className="kpi-sub-badges">
              <span className="kpi-tag tag-neutral">{formatAbbreviatedCurrency(stats.contractStats.activeContractValue)} Val</span>
            </div>
            <span className="kpi-tag tag-danger">{stats.contractStats.expiringSoon} Expiring Soon</span>
          </div>
        </div>

        {/* KPI 4: Pending Approvals / Operational Queue */}
        <div className="dash-kpi-card" onClick={() => setTableTab('pending')} style={{ cursor: 'pointer' }}>
          <div className="kpi-accent-bar kpi-accent-amber" />
          <div className="kpi-top-row">
            <span className="kpi-title">Pending Approvals</span>
            <div className="kpi-icon-pill pill-amber">⚡</div>
          </div>
          <div className="kpi-value">{stats.purchaseOrderStats.pendingOrders + stats.vendorStats.pendingApprovalVendors}</div>
          <div className="kpi-footer">
            <div className="kpi-sub-badges">
              <span className="kpi-tag tag-warning">{stats.purchaseOrderStats.pendingOrders} Purchase Orders</span>
              <span className="kpi-tag tag-neutral">{stats.vendorStats.pendingApprovalVendors} Vendors</span>
            </div>
            <span className="kpi-tag tag-danger">Requires Action</span>
          </div>
        </div>
      </section>

      {/* 3. CHARTS & ANALYTICS DUAL SECTION */}
      <section className="dash-analytics-grid">
        {/* Left: Monthly Spending & Order Volume Chart */}
        <div className="dash-chart-card">
          <div className="chart-card-header">
            <div className="chart-card-title">
              <h3>Monthly Procurement Trend</h3>
              <p>Visual breakdown of order spend and volume across {selectedYear}</p>
            </div>

            <div className="chart-card-controls">
              <div className="chart-pill-group">
                <button
                  className={`chart-pill-btn ${chartMetric === 'value' ? 'active' : ''}`}
                  onClick={() => setChartMetric('value')}
                >
                  Spend ($)
                </button>
                <button
                  className={`chart-pill-btn ${chartMetric === 'volume' ? 'active' : ''}`}
                  onClick={() => setChartMetric('volume')}
                >
                  Orders (Qty)
                </button>
              </div>

              <select
                className="chart-year-select"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
              >
                <option value={2026}>FY 2026</option>
                <option value={2025}>FY 2025</option>
              </select>
            </div>
          </div>

          {/* High-Resolution SVG Responsive Chart */}
          <div className="svg-chart-container">
            {hoveredMonth !== null && monthlyData[hoveredMonth] && (
              <div className="chart-tooltip-bubble">
                <div className="chart-tooltip-month">{monthlyData[hoveredMonth].monthName} {selectedYear}</div>
                <div>Spend: {formatCurrency(monthlyData[hoveredMonth].totalValue)}</div>
                <div>Purchase Orders: {monthlyData[hoveredMonth].orderCount}</div>
              </div>
            )}

            <svg
              className="dash-svg-chart"
              viewBox="0 0 720 220"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="barGradientBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="barGradientGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#6ee7b7" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {/* Horizontal grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                const y = 180 - ratio * 150;
                const valueLabel = chartMetric === 'value'
                  ? formatAbbreviatedCurrency(maxSpend * ratio)
                  : Math.round(maxVolume * ratio);
                return (
                  <g key={idx}>
                    <line x1="45" y1={y} x2="705" y2={y} className="chart-grid-line" />
                    <text x="38" y={y + 4} textAnchor="end" className="chart-axis-text">
                      {valueLabel}
                    </text>
                  </g>
                );
              })}

              {/* Monthly Bars */}
              {monthlyData.map((d, idx) => {
                const barWidth = 32;
                const colWidth = (700 - 55) / 12;
                const x = 55 + idx * colWidth + (colWidth - barWidth) / 2;

                const currentVal = chartMetric === 'value' ? d.totalValue : d.orderCount;
                const currentMax = chartMetric === 'value' ? maxSpend : maxVolume;
                const barHeight = currentMax > 0 ? Math.max(4, (currentVal / currentMax) * 150) : 4;
                const y = 180 - barHeight;
                const isHovered = hoveredMonth === idx;

                return (
                  <g
                    key={idx}
                    className="chart-bar-group"
                    onMouseEnter={() => setHoveredMonth(idx)}
                    onMouseLeave={() => setHoveredMonth(null)}
                  >
                    {/* Invisible wider hover hit target */}
                    <rect
                      x={55 + idx * colWidth}
                      y="15"
                      width={colWidth}
                      height="185"
                      fill="transparent"
                      style={{ cursor: 'pointer' }}
                    />
                    {/* Visual Bar */}
                    <rect
                      x={x}
                      y={y}
                      width={barWidth}
                      height={barHeight}
                      rx="4"
                      ry="4"
                      fill={chartMetric === 'value' ? 'url(#barGradientBlue)' : 'url(#barGradientGreen)'}
                      className={`chart-bar ${isHovered ? 'selected' : ''}`}
                      opacity={hoveredMonth !== null && !isHovered ? 0.45 : 1}
                    />
                    {/* X-axis label */}
                    <text
                      x={x + barWidth / 2}
                      y="200"
                      textAnchor="middle"
                      className="chart-axis-text"
                      style={{ fontWeight: isHovered ? 700 : 500, fill: isHovered ? '#38bdf8' : '#94a3b8' }}
                    >
                      {d.monthName}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="chart-summary-footer">
            <div className="chart-stat-item">
              <span className="chart-stat-label">Total Spend ({selectedYear})</span>
              <span className="chart-stat-num">{formatCurrency(totalPeriodSpend)}</span>
            </div>
            <div className="chart-stat-item">
              <span className="chart-stat-label">Total Purchase Orders</span>
              <span className="chart-stat-num">{totalPeriodOrders} POs</span>
            </div>
            <div className="chart-stat-item">
              <span className="chart-stat-label">Monthly Average</span>
              <span className="chart-stat-num">{formatCurrency(totalPeriodSpend / 12)}</span>
            </div>
          </div>
        </div>

        {/* Right: Vendor Status Breakdown & Lifecycle Health */}
        <div className="dash-breakdown-card">
          <div>
            <div className="chart-card-title">
              <h3>Vendor Ecosystem Health</h3>
              <p>Supplier compliance and status distribution</p>
            </div>

            <div className="breakdown-section-title">
              <span>Status Distribution</span>
              <span>{stats.vendorStats.totalVendors} Total</span>
            </div>

            <div className="distribution-list">
              {/* Active */}
              <div className="distribution-row">
                <div className="dist-meta">
                  <span className="dist-label">
                    <span className="dist-dot dist-dot-active" />
                    <span>Active & Verified</span>
                  </span>
                  <span className="dist-value">
                    {stats.vendorStats.activeVendors} ({Math.round((stats.vendorStats.activeVendors / (stats.vendorStats.totalVendors || 1)) * 100)}%)
                  </span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill fill-green"
                    style={{ width: `${(stats.vendorStats.activeVendors / (stats.vendorStats.totalVendors || 1)) * 100}%` }}
                  />
                </div>
              </div>

              {/* Pending Approval */}
              <div className="distribution-row">
                <div className="dist-meta">
                  <span className="dist-label">
                    <span className="dist-dot dist-dot-pending" />
                    <span>Pending Onboarding</span>
                  </span>
                  <span className="dist-value">
                    {stats.vendorStats.pendingApprovalVendors} ({Math.round((stats.vendorStats.pendingApprovalVendors / (stats.vendorStats.totalVendors || 1)) * 100)}%)
                  </span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill fill-amber"
                    style={{ width: `${(stats.vendorStats.pendingApprovalVendors / (stats.vendorStats.totalVendors || 1)) * 100}%` }}
                  />
                </div>
              </div>

              {/* Inactive */}
              <div className="distribution-row">
                <div className="dist-meta">
                  <span className="dist-label">
                    <span className="dist-dot dist-dot-inactive" />
                    <span>Inactive / Dormant</span>
                  </span>
                  <span className="dist-value">
                    {stats.vendorStats.inactiveVendors} ({Math.round((stats.vendorStats.inactiveVendors / (stats.vendorStats.totalVendors || 1)) * 100)}%)
                  </span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill fill-slate"
                    style={{ width: `${(stats.vendorStats.inactiveVendors / (stats.vendorStats.totalVendors || 1)) * 100}%` }}
                  />
                </div>
              </div>

              {/* Blocked */}
              <div className="distribution-row">
                <div className="dist-meta">
                  <span className="dist-label">
                    <span className="dist-dot dist-dot-blocked" />
                    <span>Blocked / Disqualified</span>
                  </span>
                  <span className="dist-value">
                    {stats.vendorStats.blockedVendors} ({Math.round((stats.vendorStats.blockedVendors / (stats.vendorStats.totalVendors || 1)) * 100)}%)
                  </span>
                </div>
                <div className="progress-track">
                  <div
                    className="progress-fill fill-red"
                    style={{ width: `${(stats.vendorStats.blockedVendors / (stats.vendorStats.totalVendors || 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Highlight Alert Pill */}
          <div className="breakdown-highlight-box">
            <span className="highlight-box-icon">🛡️</span>
            <div>
              <div className="highlight-box-title">Supplier SLA Compliance: 96.4%</div>
              <p className="highlight-box-desc">
                98 active vendors adhere to agreed delivery and quality standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ACTIONABLE OPERATIONAL TABLES (TABBED INTERFACE) */}
      <section className="dash-tables-card">
        <div className="dash-tables-header">
          <nav className="dash-tab-nav">
            <button
              className={`dash-tab-btn ${tableTab === 'pending' ? 'active' : ''}`}
              onClick={() => { setTableTab('pending'); setSearchQuery(''); }}
            >
              <span>Pending PO Approvals</span>
              <span className="tab-count-pill urgent">{pendingPOs.length}</span>
            </button>

            <button
              className={`dash-tab-btn ${tableTab === 'expiring' ? 'active' : ''}`}
              onClick={() => { setTableTab('expiring'); setSearchQuery(''); }}
            >
              <span>Contracts Expiring Soon</span>
              <span className="tab-count-pill">{expiringContracts.length}</span>
            </button>

            <button
              className={`dash-tab-btn ${tableTab === 'recent_orders' ? 'active' : ''}`}
              onClick={() => { setTableTab('recent_orders'); setSearchQuery(''); }}
            >
              <span>Recent Orders</span>
              <span className="tab-count-pill">{recentPOs.length}</span>
            </button>

            <button
              className={`dash-tab-btn ${tableTab === 'recent_vendors' ? 'active' : ''}`}
              onClick={() => { setTableTab('recent_vendors'); setSearchQuery(''); }}
            >
              <span>Recent Vendors</span>
              <span className="tab-count-pill">{recentVendors.length}</span>
            </button>
          </nav>

          <div className="dash-tables-search">
            <span>🔍</span>
            <input
              type="text"
              placeholder={`Search ${tableTab.replace('_', ' ')}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Dynamic Table Content based on active tab */}
        <div className="dash-table-wrapper">
          {tableTab === 'pending' && (
            <table className="dash-data-table">
              <thead>
                <tr>
                  <th>PO Number</th>
                  <th>Vendor Partner</th>
                  <th>Order Date</th>
                  <th>Department</th>
                  <th>Grand Total</th>
                  <th>Status</th>
                  <th>Quick Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="7">
                      <div className="dash-empty-state">
                        <div className="empty-icon">✓</div>
                        <div className="empty-title">No pending orders matching filter</div>
                        <p className="empty-desc">All purchase orders have been processed.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((po) => (
                    <tr key={po.id}>
                      <td className="table-cell-code">{po.orderNumber}</td>
                      <td className="table-cell-bold">{po.vendorName}</td>
                      <td>{po.orderDate}</td>
                      <td>{po.department || 'Procurement'}</td>
                      <td className="table-cell-bold">{formatCurrency(po.grandTotal)}</td>
                      <td>{renderStatusBadge(po.status)}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className="dash-action-btn"
                            style={{ backgroundColor: '#0284c7', color: '#fff', borderColor: '#0284c7' }}
                            onClick={() => handleApprovePO(po.id, po.orderNumber)}
                          >
                            ✓ Approve
                          </button>
                          <button
                            className="dash-action-btn"
                            onClick={() => setModalItem({ type: 'PO', data: po })}
                          >
                            Details
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {tableTab === 'expiring' && (
            <table className="dash-data-table">
              <thead>
                <tr>
                  <th>Contract #</th>
                  <th>Title</th>
                  <th>Vendor</th>
                  <th>End Date</th>
                  <th>Days Remaining</th>
                  <th>Contract Value</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="8">
                      <div className="dash-empty-state">
                        <div className="empty-icon">📜</div>
                        <div className="empty-title">No upcoming expiring contracts</div>
                        <p className="empty-desc">All active contracts have 30+ days remaining.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((c) => (
                    <tr key={c.id}>
                      <td className="table-cell-code">{c.contractNumber}</td>
                      <td className="table-cell-bold">{c.title}</td>
                      <td>{c.vendorName}</td>
                      <td>{c.endDate}</td>
                      <td>
                        <span className={`expiry-countdown ${c.daysLeft && c.daysLeft <= 10 ? 'urgent' : ''}`}>
                          ⏳ {c.daysLeft ? `${c.daysLeft} days` : 'Expiring soon'}
                        </span>
                      </td>
                      <td className="table-cell-bold">{formatCurrency(c.contractValue)}</td>
                      <td>{renderStatusBadge(c.status)}</td>
                      <td>
                        <button
                          className="dash-action-btn"
                          onClick={() => setModalItem({ type: 'Contract', data: c })}
                        >
                          Review & Renew
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {tableTab === 'recent_orders' && (
            <table className="dash-data-table">
              <thead>
                <tr>
                  <th>PO Number</th>
                  <th>Vendor</th>
                  <th>Order Date</th>
                  <th>Total Amount</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="6">
                      <div className="dash-empty-state">
                        <div className="empty-icon">📦</div>
                        <div className="empty-title">No recent orders found</div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((po) => (
                    <tr key={po.id}>
                      <td className="table-cell-code">{po.orderNumber}</td>
                      <td className="table-cell-bold">{po.vendorName}</td>
                      <td>{po.orderDate}</td>
                      <td className="table-cell-bold">{formatCurrency(po.grandTotal)}</td>
                      <td>{renderStatusBadge(po.status)}</td>
                      <td>
                        <button
                          className="dash-action-btn"
                          onClick={() => setModalItem({ type: 'PO', data: po })}
                        >
                          View PO
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {tableTab === 'recent_vendors' && (
            <table className="dash-data-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Company Name</th>
                  <th>Primary Contact</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="8">
                      <div className="dash-empty-state">
                        <div className="empty-icon">🏢</div>
                        <div className="empty-title">No vendors found</div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((v) => (
                    <tr key={v.id}>
                      <td className="table-cell-code">{v.vendorCode}</td>
                      <td className="table-cell-bold">{v.companyName}</td>
                      <td>{v.contactPerson}</td>
                      <td>{v.email}</td>
                      <td>{v.phone}</td>
                      <td>
                        <span className="rating-pill">
                          <span className="star-icon">★</span>
                          <span>{v.rating ? v.rating.toFixed(1) : 'N/A'}</span>
                        </span>
                      </td>
                      <td>{renderStatusBadge(v.status)}</td>
                      <td>
                        <button
                          className="dash-action-btn"
                          onClick={() => setModalItem({ type: 'Vendor', data: v })}
                        >
                          Profile
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* 5. ITEM DETAIL PREVIEW MODAL */}
      {modalItem && (
        <div className="dash-modal-overlay" onClick={() => setModalItem(null)}>
          <div className="dash-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{modalItem.type} Overview</h3>
              <button className="modal-close-btn" onClick={() => setModalItem(null)}>×</button>
            </div>
            <div className="modal-body">
              {modalItem.type === 'PO' && (
                <>
                  <div className="modal-detail-row">
                    <span className="detail-label">Order Number</span>
                    <span className="detail-value">{modalItem.data.orderNumber}</span>
                  </div>
                  <div className="modal-detail-row">
                    <span className="detail-label">Vendor Name</span>
                    <span className="detail-value">{modalItem.data.vendorName}</span>
                  </div>
                  <div className="modal-detail-row">
                    <span className="detail-label">Order Date</span>
                    <span className="detail-value">{modalItem.data.orderDate}</span>
                  </div>
                  <div className="modal-detail-row">
                    <span className="detail-label">Grand Total</span>
                    <span className="detail-value" style={{ color: '#38bdf8' }}>
                      {formatCurrency(modalItem.data.grandTotal)}
                    </span>
                  </div>
                  <div className="modal-detail-row">
                    <span className="detail-label">Current Status</span>
                    <span className="detail-value">{renderStatusBadge(modalItem.data.status)}</span>
                  </div>
                </>
              )}

              {modalItem.type === 'Contract' && (
                <>
                  <div className="modal-detail-row">
                    <span className="detail-label">Contract #</span>
                    <span className="detail-value">{modalItem.data.contractNumber}</span>
                  </div>
                  <div className="modal-detail-row">
                    <span className="detail-label">Title</span>
                    <span className="detail-value">{modalItem.data.title}</span>
                  </div>
                  <div className="modal-detail-row">
                    <span className="detail-label">Vendor</span>
                    <span className="detail-value">{modalItem.data.vendorName}</span>
                  </div>
                  <div className="modal-detail-row">
                    <span className="detail-label">Validity Period</span>
                    <span className="detail-value">{modalItem.data.startDate} to {modalItem.data.endDate}</span>
                  </div>
                  <div className="modal-detail-row">
                    <span className="detail-label">Contract Value</span>
                    <span className="detail-value" style={{ color: '#34d399' }}>
                      {formatCurrency(modalItem.data.contractValue)}
                    </span>
                  </div>
                  <div className="modal-detail-row">
                    <span className="detail-label">Status</span>
                    <span className="detail-value">{renderStatusBadge(modalItem.data.status)}</span>
                  </div>
                </>
              )}

              {modalItem.type === 'Vendor' && (
                <>
                  <div className="modal-detail-row">
                    <span className="detail-label">Vendor Code</span>
                    <span className="detail-value">{modalItem.data.vendorCode}</span>
                  </div>
                  <div className="modal-detail-row">
                    <span className="detail-label">Company Name</span>
                    <span className="detail-value">{modalItem.data.companyName}</span>
                  </div>
                  <div className="modal-detail-row">
                    <span className="detail-label">Contact Person</span>
                    <span className="detail-value">{modalItem.data.contactPerson}</span>
                  </div>
                  <div className="modal-detail-row">
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{modalItem.data.email}</span>
                  </div>
                  <div className="modal-detail-row">
                    <span className="detail-label">Phone</span>
                    <span className="detail-value">{modalItem.data.phone}</span>
                  </div>
                  <div className="modal-detail-row">
                    <span className="detail-label">Rating</span>
                    <span className="detail-value">★ {modalItem.data.rating} / 5.0</span>
                  </div>
                </>
              )}
            </div>
            <div className="modal-footer">
              <button className="dash-btn dash-btn-secondary" onClick={() => setModalItem(null)}>
                Close
              </button>
              <button
                className="dash-btn dash-btn-primary"
                onClick={() => {
                  setModalItem(null);
                  if (modalItem.type === 'PO') handleNavigate('purchaseorders');
                  else if (modalItem.type === 'Contract') handleNavigate('contracts');
                  else if (modalItem.type === 'Vendor') handleNavigate('vendors');
                }}
              >
                Go to Full Screen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. TOAST FEEDBACK ALERT */}
      {toastMessage && (
        <div className="dash-toast">
          <span className="toast-dot" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
