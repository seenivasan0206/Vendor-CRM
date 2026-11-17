import { useState, useEffect, useMemo } from 'react';
import '../Styles/Reports.css';

const DASH_API = 'http://localhost:8080/api/dashboard';

const STATUS_COLORS = {
  completed: '#059669',
  pending: '#f59e0b',
  cancelled: '#dc2626',
  approved: '#0284c7',
  issued: '#7c3aed',
  delivered: '#10b981',
  draft: '#64748b',
  active: '#059669',
  inactive: '#94a3b8',
  expired: '#dc2626',
  terminated: '#991b1b',
  expiringSoon: '#f59e0b',
  blocked: '#b91c1c',
  pendingApproval: '#f59e0b',
};

const SAMPLE_MONTHLY = [
  { month: 1, monthName: 'Jan', orderCount: 12, totalValue: 480000 },
  { month: 2, monthName: 'Feb', orderCount: 15, totalValue: 610000 },
  { month: 3, monthName: 'Mar', orderCount: 18, totalValue: 720000 },
  { month: 4, monthName: 'Apr', orderCount: 14, totalValue: 560000 },
  { month: 5, monthName: 'May', orderCount: 22, totalValue: 910000 },
  { month: 6, monthName: 'Jun', orderCount: 19, totalValue: 805000 },
  { month: 7, monthName: 'Jul', orderCount: 25, totalValue: 1050000 },
  { month: 8, monthName: 'Aug', orderCount: 20, totalValue: 840000 },
  { month: 9, monthName: 'Sep', orderCount: 27, totalValue: 1180000 },
  { month: 10, monthName: 'Oct', orderCount: 24, totalValue: 1020000 },
  { month: 11, monthName: 'Nov', orderCount: 30, totalValue: 1320000 },
  { month: 12, monthName: 'Dec', orderCount: 28, totalValue: 1210000 },
];

const SAMPLE_VENDOR_STATS = {
  totalVendors: 86,
  activeVendors: 64,
  inactiveVendors: 12,
  pendingApprovalVendors: 6,
  blockedVendors: 4,
  averageRating: 4.3,
};

const SAMPLE_PO_STATS = {
  totalOrders: 254,
  pendingOrders: 38,
  approvedOrders: 52,
  issuedOrders: 64,
  deliveredOrders: 92,
  cancelledOrders: 8,
  totalOrderValue: 15420000,
};

const SAMPLE_CONTRACT_STATS = {
  totalContracts: 48,
  activeContracts: 32,
  expiredContracts: 8,
  terminatedContracts: 3,
  draftContracts: 5,
  expiringSoon: 6,
  totalContractValue: 28500000,
  activeContractValue: 18200000,
};

function formatCurrency(value) {
  const num = Number(value) || 0;
  if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
  if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
  return `₹${num.toLocaleString('en-IN')}`;
}

function formatNumber(value) {
  return (Number(value) || 0).toLocaleString('en-IN');
}

function authHeaders() {
  const token =
    localStorage.getItem('zenve_access_token') ||
    sessionStorage.getItem('zenve_access_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { ...authHeaders(), Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return json?.data;
}

/* ---------- Lightweight SVG visualizations ---------- */

function BarChart({ data, labelKey = 'monthName' }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [activeMetric, setActiveMetric] = useState('orders'); // 'orders' | 'spend'

  const maxOrders = useMemo(() => {
    const vals = data.map((d) => Number(d.orderCount) || 0);
    const m = Math.max(...vals, 10);
    return Math.ceil(m / 5) * 5;
  }, [data]);

  const maxSpend = useMemo(() => {
    const vals = data.map((d) => Number(d.totalValue) || 0);
    const m = Math.max(...vals, 1000);
    return Math.ceil(m / 50000) * 50000;
  }, [data]);

  const currentMax = activeMetric === 'spend' ? maxSpend : maxOrders;

  return (
    <div
      style={{
        marginTop: '16px',
        background: '#07172B',
        border: '1px solid rgba(0, 212, 229, 0.25)',
        borderRadius: '16px',
        padding: '20px 24px',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(0, 212, 229, 0.08)'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div>
          <h4 style={{ margin: 0, color: '#f8fafc', fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.01em' }}>
            Monthly Procurement Trend Analytics
          </h4>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Visual breakdown of order spend and volume
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            background: '#020B1A',
            padding: '3px',
            borderRadius: '8px',
            border: '1px solid rgba(0, 212, 229, 0.2)'
          }}
        >
          <button
            type="button"
            onClick={() => setActiveMetric('orders')}
            style={{
              padding: '5px 14px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: activeMetric === 'orders' ? 'linear-gradient(90deg, #00D4E5 0%, #1265FF 100%)' : 'transparent',
              color: activeMetric === 'orders' ? '#ffffff' : '#94a3b8',
              boxShadow: activeMetric === 'orders' ? '0 0 10px rgba(0, 212, 229, 0.4)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            Orders (Qty)
          </button>
          <button
            type="button"
            onClick={() => setActiveMetric('spend')}
            style={{
              padding: '5px 14px',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: activeMetric === 'spend' ? 'linear-gradient(90deg, #00D4E5 0%, #1265FF 100%)' : 'transparent',
              color: activeMetric === 'spend' ? '#ffffff' : '#94a3b8',
              boxShadow: activeMetric === 'spend' ? '0 0 10px rgba(0, 212, 229, 0.4)' : 'none',
              transition: 'all 0.2s ease'
            }}
          >
            Spend ($)
          </button>
        </div>
      </div>

      <div style={{ position: 'relative', width: '100%', marginTop: '12px' }}>
        {hoveredIdx !== null && data[hoveredIdx] && (
          <div
            style={{
              position: 'absolute',
              top: '10px',
              right: '20px',
              background: '#020B1A',
              color: '#ffffff',
              padding: '10px 16px',
              borderRadius: '12px',
              fontSize: '0.82rem',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.7), 0 0 16px rgba(0, 212, 229, 0.25)',
              border: '1px solid #00D4E5',
              pointerEvents: 'none',
              zIndex: 10,
              animation: 'fadeIn 0.15s ease'
            }}
          >
            <div style={{ fontWeight: 800, color: '#00D4E5', marginBottom: '2px', fontSize: '0.88rem' }}>
              {data[hoveredIdx].monthName}
            </div>
            <div>Orders: <strong>{data[hoveredIdx].orderCount || 0}</strong></div>
            <div>Spend: <strong>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(data[hoveredIdx].totalValue || 0)}</strong></div>
          </div>
        )}

        <svg
          className="dash-svg-chart"
          viewBox="0 0 720 220"
          preserveAspectRatio="none"
          style={{ width: '100%', height: '220px', overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="repBarGradCyan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00D4E5" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#1265FF" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="repBarGradGreen" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00F0A8" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Horizontal grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = 180 - ratio * 150;
            const label =
              activeMetric === 'spend'
                ? `$${Math.round((maxSpend * ratio) / 1000)}k`
                : Math.round(maxOrders * ratio);
            return (
              <g key={idx}>
                <line x1="45" y1={y} x2="705" y2={y} stroke="rgba(0, 212, 229, 0.15)" strokeDasharray="4 4" />
                <text x="38" y={y + 4} textAnchor="end" fill="#94a3b8" fontSize="11px" fontWeight="500">
                  {label}
                </text>
              </g>
            );
          })}

          {/* Monthly Bars */}
          {data.map((d, idx) => {
            const barWidth = 32;
            const colWidth = (700 - 55) / data.length;
            const x = 55 + idx * colWidth + (colWidth - barWidth) / 2;
            const val = activeMetric === 'spend' ? Number(d.totalValue) || 0 : Number(d.orderCount) || 0;
            const barHeight = currentMax > 0 ? Math.max(4, (val / currentMax) * 150) : 4;
            const y = 180 - barHeight;
            const isHovered = hoveredIdx === idx;

            return (
              <g
                key={idx}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                style={{ cursor: 'pointer' }}
              >
                <rect x={55 + idx * colWidth} y="15" width={colWidth} height="185" fill="transparent" />
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx="4"
                  ry="4"
                  fill={activeMetric === 'spend' ? 'url(#repBarGradGreen)' : 'url(#repBarGradCyan)'}
                  opacity={hoveredIdx !== null && !isHovered ? 0.45 : 1}
                  filter={isHovered ? 'drop-shadow(0 0 10px rgba(0, 212, 229, 0.8))' : 'none'}
                  style={{ transition: 'all 0.2s ease' }}
                />
                <text
                  x={x + barWidth / 2}
                  y="200"
                  textAnchor="middle"
                  fill={isHovered ? '#00D4E5' : '#94a3b8'}
                  fontSize="11px"
                  fontWeight={isHovered ? 700 : 500}
                >
                  {d[labelKey]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

function DonutChart({ segments, size = 160, thickness = 26 }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  const radius = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * radius;

  const arcs = segments.map((seg, index) => {
    const frac = seg.value / total;
    const dash = frac * circumference;
    const precedingTotal = segments
      .slice(0, index)
      .reduce((s, p) => s + (p.value / total) * circumference, 0);
    return {
      label: seg.label,
      color: seg.color,
      dash,
      gap: circumference - dash,
      offset: -precedingTotal,
    };
  });

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rep-donut-svg">
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="none"
        stroke="#f1f5f9"
        strokeWidth={thickness}
      />
      {arcs.map((arc) => (
        <circle
          key={arc.label}
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={arc.color}
          strokeWidth={thickness}
          strokeDasharray={`${arc.dash} ${arc.gap}`}
          strokeDashoffset={arc.offset}
          transform={`rotate(-90 ${cx} ${cy})`}
          strokeLinecap="butt"
        />
      ))}
      <text
        x={cx}
        y={cy - 2}
        fontSize={18}
        fontWeight={700}
        textAnchor="middle"
        fill="#0f172a"
      >
        {total}
      </text>
      <text x={cx} y={cy + 14} fontSize={7} textAnchor="middle" fill="#94a3b8">
        TOTAL
      </text>
    </svg>
  );
}

function HBarList({ items }) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="rep-hbar-list">
      {items.map((item) => (
        <div key={item.label} className="rep-hbar-row">
          <div className="rep-hbar-meta">
            <span className="rep-hbar-dot" style={{ background: item.color }} />
            <span className="rep-hbar-label">{item.label}</span>
            <span className="rep-hbar-value">{formatNumber(item.value)}</span>
          </div>
          <div className="rep-hbar-track">
            <div
              className="rep-hbar-fill"
              style={{
                width: `${(item.value / max) * 100}%`,
                background: item.color,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- Main Component ---------- */

function Reports() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [overall, setOverall] = useState(null);
  const [monthly, setMonthly] = useState(SAMPLE_MONTHLY);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [recentTab, setRecentTab] = useState('vendors');
  const [recentVendors, setRecentVendors] = useState([]);
  const [recentPOs, setRecentPOs] = useState([]);
  const [recentContracts, setRecentContracts] = useState([]);

  const loadAnalytics = async () => {
    try {
      setIsLoading(true);
      setApiError('');
      const [stats, monthlyData, vendors, pos, contracts] = await Promise.all([
        fetchJson(`${DASH_API}/stats`),
        fetchJson(`${DASH_API}/monthly-po-stats?year=${selectedYear}`),
        fetchJson(`${DASH_API}/recent-vendors?limit=8`),
        fetchJson(`${DASH_API}/recent-purchase-orders?limit=8`),
        fetchJson(`${DASH_API}/recent-contracts?limit=8`),
      ]);
      if (stats) setOverall(stats);
      if (monthlyData?.points?.length) setMonthly(monthlyData.points);
      if (vendors) setRecentVendors(vendors);
      if (pos) setRecentPOs(pos);
      if (contracts) setRecentContracts(contracts);
    } catch (err) {
      console.warn('Dashboard API offline, using sample analytics:', err.message);
      setApiError(
        'Analytics backend is offline (http://localhost:8080). Displaying sample data for preview.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => loadAnalytics());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear]);

  const vendorStats = overall?.vendorStats || SAMPLE_VENDOR_STATS;
  const poStats = overall?.purchaseOrderStats || SAMPLE_PO_STATS;
  const contractStats = overall?.contractStats || SAMPLE_CONTRACT_STATS;

  const vendorSegments = useMemo(
    () => [
      { label: 'Active', value: vendorStats.activeVendors, color: STATUS_COLORS.active },
      { label: 'Inactive', value: vendorStats.inactiveVendors, color: STATUS_COLORS.inactive },
      { label: 'Pending', value: vendorStats.pendingApprovalVendors, color: STATUS_COLORS.pendingApproval },
      { label: 'Blocked', value: vendorStats.blockedVendors, color: STATUS_COLORS.blocked },
    ],
    [vendorStats]
  );

  const poSegments = useMemo(
    () => [
      { label: 'Delivered', value: poStats.deliveredOrders, color: STATUS_COLORS.delivered },
      { label: 'Issued', value: poStats.issuedOrders, color: STATUS_COLORS.issued },
      { label: 'Approved', value: poStats.approvedOrders, color: STATUS_COLORS.approved },
      { label: 'Pending', value: poStats.pendingOrders, color: STATUS_COLORS.pending },
      { label: 'Cancelled', value: poStats.cancelledOrders, color: STATUS_COLORS.cancelled },
    ],
    [poStats]
  );

  const contractSegments = useMemo(
    () => [
      { label: 'Active', value: contractStats.activeContracts, color: STATUS_COLORS.active },
      { label: 'Draft', value: contractStats.draftContracts, color: STATUS_COLORS.draft },
      { label: 'Expiring Soon', value: contractStats.expiringSoon, color: STATUS_COLORS.expiringSoon },
      { label: 'Expired', value: contractStats.expiredContracts, color: STATUS_COLORS.expired },
      { label: 'Terminated', value: contractStats.terminatedContracts, color: STATUS_COLORS.terminated },
    ],
    [contractStats]
  );

  const poCompletionRate =
    poStats.totalOrders > 0
      ? ((poStats.deliveredOrders / poStats.totalOrders) * 100).toFixed(1)
      : '0.0';
  const vendorActiveRate =
    vendorStats.totalVendors > 0
      ? ((vendorStats.activeVendors / vendorStats.totalVendors) * 100).toFixed(1)
      : '0.0';

  return (
    <div className="rep-container">
      {/* 1. Page Header */}
      <div className="rep-header">
        <div>
          <h2>Reports & Analytics</h2>
          <p>Procurement intelligence, vendor health, and spend analytics at a glance.</p>
        </div>
        <div className="rep-header-actions">
          <select
            className="rep-year-select"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            title="Select reporting year"
          >
            {Array.from({ length: 5 }, (_, i) => {
              const y = new Date().getFullYear() - i;
              return (
                <option key={y} value={y}>
                  {y}
                </option>
              );
            })}
          </select>
          <button
            type="button"
            className="rep-btn-refresh"
            onClick={loadAnalytics}
            disabled={isLoading}
          >
            {isLoading ? '⟳ Refreshing...' : '⟳ Refresh'}
          </button>
        </div>
      </div>

      {apiError && <div className="rep-api-alert">{apiError}</div>}

      {/* 2. KPI Cards */}
      <div className="rep-stats-grid">
        <div className="rep-stat-card">
          <span className="rep-stat-label">Total Vendors</span>
          <strong className="rep-stat-value">{formatNumber(vendorStats.totalVendors)}</strong>
          <span className="rep-stat-sub rep-stat-success">
            {vendorActiveRate}% active
          </span>
        </div>
        <div className="rep-stat-card">
          <span className="rep-stat-label">Avg Vendor Rating</span>
          <strong className="rep-stat-value rep-stat-warn">
            {Number(vendorStats.averageRating).toFixed(1)} / 5
          </strong>
          <span className="rep-stat-sub">Across {formatNumber(vendorStats.totalVendors)} vendors</span>
        </div>
        <div className="rep-stat-card">
          <span className="rep-stat-label">Purchase Orders</span>
          <strong className="rep-stat-value">{formatNumber(poStats.totalOrders)}</strong>
          <span className="rep-stat-sub rep-stat-info">
            {poCompletionRate}% delivered
          </span>
        </div>
        <div className="rep-stat-card">
          <span className="rep-stat-label">Total Order Value</span>
          <strong className="rep-stat-value rep-stat-success">
            {formatCurrency(poStats.totalOrderValue)}
          </strong>
          <span className="rep-stat-sub">
            {formatNumber(poStats.pendingOrders)} pending
          </span>
        </div>
        <div className="rep-stat-card">
          <span className="rep-stat-label">Active Contracts</span>
          <strong className="rep-stat-value rep-stat-info">
            {formatNumber(contractStats.activeContracts)} / {formatNumber(contractStats.totalContracts)}
          </strong>
          <span className="rep-stat-sub rep-stat-danger">
            {formatNumber(contractStats.expiringSoon)} expiring soon
          </span>
        </div>
        <div className="rep-stat-card">
          <span className="rep-stat-label">Contract Value</span>
          <strong className="rep-stat-value">
            {formatCurrency(contractStats.totalContractValue)}
          </strong>
          <span className="rep-stat-sub">
            {formatCurrency(contractStats.activeContractValue)} active
          </span>
        </div>
      </div>

      {/* 3. Monthly PO Trend (full-width) */}
      <div className="rep-panel rep-panel-wide">
        <div className="rep-panel-header">
          <h3>Monthly Purchase Order Trend — {selectedYear}</h3>
          <span className="rep-panel-hint">
            Orders & value per month
          </span>
        </div>
        <BarChart data={monthly} labelKey="monthName" />
        <div className="rep-trend-foot">
          {monthly.map((m) => (
            <div key={m.monthName} className="rep-trend-cell">
              <span className="rep-trend-count">{formatNumber(m.orderCount)}</span>
              <span className="rep-trend-val">{formatCurrency(m.totalValue)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Two-column: PO donut + Contract donut */}
      <div className="rep-grid-2">
        <div className="rep-panel">
          <div className="rep-panel-header">
            <h3>Purchase Order Status</h3>
          </div>
          <div className="rep-donut-wrap">
            <DonutChart segments={poSegments} size={170} thickness={28} />
            <div className="rep-legend">
              {poSegments.map((s) => (
                <div key={s.label} className="rep-legend-item">
                  <span className="rep-legend-dot" style={{ background: s.color }} />
                  <span className="rep-legend-label">{s.label}</span>
                  <span className="rep-legend-value">{formatNumber(s.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rep-panel">
          <div className="rep-panel-header">
            <h3>Contract Status</h3>
          </div>
          <div className="rep-donut-wrap">
            <DonutChart segments={contractSegments} size={170} thickness={28} />
            <div className="rep-legend">
              {contractSegments.map((s) => (
                <div key={s.label} className="rep-legend-item">
                  <span className="rep-legend-dot" style={{ background: s.color }} />
                  <span className="rep-legend-label">{s.label}</span>
                  <span className="rep-legend-value">{formatNumber(s.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Vendor breakdown + Contract value split */}
      <div className="rep-grid-2">
        <div className="rep-panel">
          <div className="rep-panel-header">
            <h3>Vendor Portfolio Breakdown</h3>
          </div>
          <HBarList items={vendorSegments} />
        </div>

        <div className="rep-panel">
          <div className="rep-panel-header">
            <h3>Contract Value Split</h3>
          </div>
          <HBarList
            items={[
              { label: 'Active Value', value: contractStats.activeContractValue, color: STATUS_COLORS.active },
              {
                label: 'Inactive Value',
                value: Math.max(contractStats.totalContractValue - contractStats.activeContractValue, 0),
                color: STATUS_COLORS.inactive,
              },
            ]}
          />
          <div className="rep-value-callout">
            <span>Active share:</span>
            <strong>
              {contractStats.totalContractValue > 0
                ? (
                    (contractStats.activeContractValue / contractStats.totalContractValue) *
                    100
                  ).toFixed(1)
                : '0.0'}
              %
            </strong>
          </div>
        </div>
      </div>

      {/* 6. Recent activity table with tabs */}
      <div className="rep-panel rep-panel-wide">
        <div className="rep-panel-header">
          <h3>Recent Activity</h3>
          <div className="rep-tabs">
            <button
              type="button"
              className={`rep-tab ${recentTab === 'vendors' ? 'active' : ''}`}
              onClick={() => setRecentTab('vendors')}
            >
              Vendors
            </button>
            <button
              type="button"
              className={`rep-tab ${recentTab === 'pos' ? 'active' : ''}`}
              onClick={() => setRecentTab('pos')}
            >
              Purchase Orders
            </button>
            <button
              type="button"
              className={`rep-tab ${recentTab === 'contracts' ? 'active' : ''}`}
              onClick={() => setRecentTab('contracts')}
            >
              Contracts
            </button>
          </div>
        </div>

        <div className="rep-table-wrapper">
          {recentTab === 'vendors' && (
            <table className="rep-table">
              <thead>
                <tr>
                  <th>Vendor</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {recentVendors.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="rep-empty">No recent vendors.</td>
                  </tr>
                ) : (
                  recentVendors.map((v) => (
                    <tr key={v.id}>
                      <td>
                        <div className="rep-cell-name">{v.companyName}</div>
                        <div className="rep-cell-sub">{v.vendorCode}</div>
                      </td>
                      <td>{v.contactPerson || '—'}</td>
                      <td>
                        <span className={`rep-badge rep-badge-${(v.status || '').toLowerCase()}`}>
                          {v.status}
                        </span>
                      </td>
                      <td>
                        <span className="rep-rating">
                          ★ {Number(v.rating || 0).toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {recentTab === 'pos' && (
            <table className="rep-table">
              <thead>
                <tr>
                  <th>PO Number</th>
                  <th>Vendor</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentPOs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="rep-empty">No recent purchase orders.</td>
                  </tr>
                ) : (
                  recentPOs.map((po) => (
                    <tr key={po.id}>
                      <td className="rep-cell-name">{po.orderNumber}</td>
                      <td>{po.vendorCompanyName || '—'}</td>
                      <td>{po.orderDate || '—'}</td>
                      <td className="rep-amount">{formatCurrency(po.grandTotal)}</td>
                      <td>
                        <span className={`rep-badge rep-badge-${(po.status || '').toLowerCase()}`}>
                          {(po.status || '').replace(/_/g, ' ')}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}

          {recentTab === 'contracts' && (
            <table className="rep-table">
              <thead>
                <tr>
                  <th>Contract #</th>
                  <th>Vendor</th>
                  <th>Value</th>
                  <th>End Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentContracts.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="rep-empty">No recent contracts.</td>
                  </tr>
                ) : (
                  recentContracts.map((c) => (
                    <tr key={c.id}>
                      <td className="rep-cell-name">{c.contractNumber}</td>
                      <td>{c.vendorCompanyName || '—'}</td>
                      <td className="rep-amount">{formatCurrency(c.contractValue)}</td>
                      <td>{c.endDate || '—'}</td>
                      <td>
                        <span className={`rep-badge rep-badge-${(c.status || '').toLowerCase()}`}>
                          {(c.status || '').replace(/_/g, ' ')}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default Reports;