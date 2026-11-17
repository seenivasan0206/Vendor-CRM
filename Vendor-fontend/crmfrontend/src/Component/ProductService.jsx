import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Package,
  Download,
  Building2,
  Wrench,
  AlertTriangle,
  Search,
  LayoutGrid,
  List,
  Eye,
  Pencil,
  Trash2,
  Star,
  CheckCircle,
  Sparkles,
  X
} from 'lucide-react';
import '../Styles/ProductService.css';

// ============================================================================
// INITIAL REALISTIC ENTERPRISE PRODUCTS & SERVICES DATASET
// ============================================================================
const INITIAL_PRODUCTS_SERVICES = [
  {
    id: 1,
    sku: 'PRD-HW-001',
    name: 'Apex Enterprise Dual-Socket Rack Server (2U)',
    description: 'High-density compute node with dual 32-core processors, 512GB ECC DDR5 RAM, and redundant titanium power supplies.',
    type: 'PRODUCT',
    category: 'Hardware & Systems',
    vendorId: 1,
    vendorCompanyName: 'Apex Cloud Systems Ltd',
    vendorCode: 'VND-001',
    unitPrice: 4250.00,
    unitOfMeasure: 'per unit',
    stockQuantity: 34,
    reorderLevel: 10,
    leadTime: '3 Business Days',
    warranty: '3-Year 24/7 On-Site NBD',
    status: 'ACTIVE',
    minOrderQty: 1,
    rating: 4.8
  },
  {
    id: 2,
    sku: 'SRV-CLD-002',
    name: 'Multi-Region Kubernetes Managed Cloud Cluster',
    description: 'Fully orchestrated multi-tenant Kubernetes infrastructure with automated cross-zone failover, DDoS mitigation, and 99.99% uptime guarantee.',
    type: 'SERVICE',
    category: 'Cloud Infrastructure',
    vendorId: 1,
    vendorCompanyName: 'Apex Cloud Systems Ltd',
    vendorCode: 'VND-001',
    unitPrice: 5800.00,
    unitOfMeasure: 'per month',
    stockQuantity: 99, // Represents SLA / capacity
    reorderLevel: 0,
    leadTime: 'Instant Provisioning',
    warranty: '99.99% Guaranteed SLA Uptime',
    status: 'ACTIVE',
    minOrderQty: 1,
    rating: 4.9
  },
  {
    id: 3,
    sku: 'PRD-NET-003',
    name: 'Precision 100G QSFP28 Core Aggregation Switch',
    description: '32-port non-blocking 100GbE data center switch with sub-400ns ultra-low latency telemetry and dual redundant airflow.',
    type: 'PRODUCT',
    category: 'Network & Telecom',
    vendorId: 3,
    vendorCompanyName: 'Precision Dynamics Corp',
    vendorCode: 'VND-003',
    unitPrice: 6890.00,
    unitOfMeasure: 'per unit',
    stockQuantity: 8,
    reorderLevel: 12,
    leadTime: '10 Days',
    warranty: '5-Year Hardware Advance Replacement',
    status: 'LOW_STOCK',
    minOrderQty: 1,
    rating: 4.7
  },
  {
    id: 4,
    sku: 'SRV-LOG-004',
    name: 'Temperature-Monitored Global Express Freight',
    description: 'Direct air freight logistics with active IoT telemetry tracking, continuous cold-chain audit reporting, and customs pre-clearance.',
    type: 'SERVICE',
    category: 'Logistics & Freight',
    vendorId: 2,
    vendorCompanyName: 'Nexus Global Logistics',
    vendorCode: 'VND-002',
    unitPrice: 16500.00,
    unitOfMeasure: 'per consignment',
    stockQuantity: 50,
    reorderLevel: 0,
    leadTime: '24-48 Hours',
    warranty: 'Cargo Insurance up to $1.5M per shipment',
    status: 'ACTIVE',
    minOrderQty: 1,
    rating: 4.9
  },
  {
    id: 5,
    sku: 'PRD-IND-005',
    name: 'Carbide Precision CNC Industrial Milling Tooling',
    description: 'Micro-grain tungsten carbide 4-flute end mill set engineered for titanium alloys, hardened steels, and aerospace composites.',
    type: 'PRODUCT',
    category: 'Manufacturing Supplies',
    vendorId: 3,
    vendorCompanyName: 'Precision Dynamics Corp',
    vendorCode: 'VND-003',
    unitPrice: 420.00,
    unitOfMeasure: 'per set (10-pc)',
    stockQuantity: 185,
    reorderLevel: 40,
    leadTime: '4 Business Days',
    warranty: 'ISO 9001 Batch Certified',
    status: 'ACTIVE',
    minOrderQty: 5,
    rating: 4.6
  },
  {
    id: 6,
    sku: 'SRV-SEC-006',
    name: '24/7 Managed SOC Threat Hunting & EDR Monitoring',
    description: 'Continuous proactive cyber defense, endpoint detection & response (EDR), threat hunting, and 15-minute SLA critical incident isolation.',
    type: 'SERVICE',
    category: 'Security & Compliance',
    vendorId: 4,
    vendorCompanyName: 'CyberShield Global Inc',
    vendorCode: 'VND-004',
    unitPrice: 8900.00,
    unitOfMeasure: 'per month',
    stockQuantity: 100,
    reorderLevel: 0,
    leadTime: 'Immediate Engagement',
    warranty: '15-Minute MTTR Critical SLA',
    status: 'ACTIVE',
    minOrderQty: 1,
    rating: 4.9
  },
  {
    id: 7,
    sku: 'PRD-OFC-007',
    name: 'Ergonomic Executive Mesh Task Chair (Series X)',
    description: 'BIFMA-certified ergonomic seating featuring 4D adaptive lumbar support, breathable elastomeric mesh, and 300 lb weight rating.',
    type: 'PRODUCT',
    category: 'Office Facilities',
    vendorId: 5,
    vendorCompanyName: 'Summit Office Solutions',
    vendorCode: 'VND-005',
    unitPrice: 380.00,
    unitOfMeasure: 'per unit',
    stockQuantity: 6,
    reorderLevel: 25,
    leadTime: '7 Business Days',
    warranty: '12-Year Comprehensive Structural Warranty',
    status: 'LOW_STOCK',
    minOrderQty: 4,
    rating: 4.5
  },
  {
    id: 8,
    sku: 'SRV-CON-008',
    name: 'Principal ERP Architecture & Integration Consulting',
    description: 'Senior enterprise solution architects dedicated to legacy database migration, microservices redesign, and custom API pipelines.',
    type: 'SERVICE',
    category: 'Professional Services',
    vendorId: 6,
    vendorCompanyName: 'InnoSoft Global Solutions',
    vendorCode: 'VND-006',
    unitPrice: 195.00,
    unitOfMeasure: 'per billable hour',
    stockQuantity: 160,
    reorderLevel: 20,
    leadTime: '1 Week Scheduling',
    warranty: 'Milestone Deliverable Acceptance Guarantee',
    status: 'ACTIVE',
    minOrderQty: 40,
    rating: 4.8
  },
  {
    id: 9,
    sku: 'PRD-STL-009',
    name: 'High-Tensile Structural A992 Alloy Steel I-Beams',
    description: 'Hot-rolled structural steel beams for industrial warehousing, seismic building reinforcement, and high-load infrastructure.',
    type: 'PRODUCT',
    category: 'Raw Materials',
    vendorId: 7,
    vendorCompanyName: 'SteelForge Heavy Industries',
    vendorCode: 'VND-007',
    unitPrice: 2150.00,
    unitOfMeasure: 'per metric ton',
    stockQuantity: 0,
    reorderLevel: 30,
    leadTime: '3 Weeks',
    warranty: 'Mill Test Certificate EN 10204 3.1',
    status: 'OUT_OF_STOCK',
    minOrderQty: 10,
    rating: 4.3
  },
  {
    id: 10,
    sku: 'SRV-CLN-010',
    name: 'Cleanroom & Medical-Grade Bio-Decontamination',
    description: 'Certified ISO 14644 cleanroom protocol cleaning, HEPA filtration inspection, and electrostatic antimicrobial disinfectant fogging.',
    type: 'SERVICE',
    category: 'Facilities & Maintenance',
    vendorId: 8,
    vendorCompanyName: 'EcoClean Industrial Services',
    vendorCode: 'VND-008',
    unitPrice: 2400.00,
    unitOfMeasure: 'per clean cycle',
    stockQuantity: 12,
    reorderLevel: 0,
    leadTime: '48 Hours',
    warranty: 'EPA & OSHA Compliance Certificate',
    status: 'ACTIVE',
    minOrderQty: 1,
    rating: 4.7
  },
  {
    id: 11,
    sku: 'PRD-SEC-011',
    name: 'Multimodal Biometric Access Terminal & Reader',
    description: 'AI facial recognition and contactless palm-vein access reader with optical tamper detection and IP66 weatherproofing.',
    type: 'PRODUCT',
    category: 'Security & Compliance',
    vendorId: 4,
    vendorCompanyName: 'CyberShield Global Inc',
    vendorCode: 'VND-004',
    unitPrice: 950.00,
    unitOfMeasure: 'per terminal',
    stockQuantity: 42,
    reorderLevel: 15,
    leadTime: '3 Business Days',
    warranty: '2-Year Hardware Warranty',
    status: 'ACTIVE',
    minOrderQty: 2,
    rating: 4.7
  },
  {
    id: 12,
    sku: 'SRV-TRN-012',
    name: 'Global Supply Chain Anti-Bribery & ISO Audit Training',
    description: 'Interactive corporate compliance training for procurement officers covering FCPA, UK Bribery Act, and modern ESG supply auditing.',
    type: 'SERVICE',
    category: 'Professional Services',
    vendorId: 6,
    vendorCompanyName: 'InnoSoft Global Solutions',
    vendorCode: 'VND-006',
    unitPrice: 3200.00,
    unitOfMeasure: 'per cohort (25 staff)',
    stockQuantity: 8,
    reorderLevel: 0,
    leadTime: '2 Weeks Lead',
    warranty: 'CPD Certified Accreditation',
    status: 'PENDING_APPROVAL',
    minOrderQty: 1,
    rating: 4.6
  }
];

const INITIAL_FORM_STATE = {
  sku: '',
  name: '',
  description: '',
  type: 'PRODUCT',
  category: 'Hardware & Systems',
  vendorCompanyName: 'Apex Cloud Systems Ltd',
  vendorCode: 'VND-001',
  unitPrice: '',
  unitOfMeasure: 'per unit',
  stockQuantity: 50,
  reorderLevel: 10,
  leadTime: '3-5 Business Days',
  warranty: 'Standard 1-Year Commercial Warranty',
  status: 'ACTIVE'
};

const CATEGORIES = [
  'All Categories',
  'Hardware & Systems',
  'Cloud Infrastructure',
  'Network & Telecom',
  'Logistics & Freight',
  'Manufacturing Supplies',
  'Security & Compliance',
  'Office Facilities',
  'Professional Services',
  'Raw Materials',
  'Facilities & Maintenance'
];

export default function ProductService() {
  const [items, setItems] = useState(INITIAL_PRODUCTS_SERVICES);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL'); // 'ALL' | 'PRODUCT' | 'SERVICE' | 'LOW_STOCK'
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [isLiveBackend, setIsLiveBackend] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Modals state
  const [detailItem, setDetailItem] = useState(null);
  const [modalForm, setModalForm] = useState({ open: false, isEdit: false, data: INITIAL_FORM_STATE });
  const [stockModal, setStockModal] = useState({ open: false, item: null, newQuantity: 0 });
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, item: null });

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  }, []);

  // Sync with backend if available
  const fetchProducts = useCallback(async (isManual = false) => {
    if (isManual) setRefreshing(true);
    try {
      const token = localStorage.getItem('zenve_access_token') || sessionStorage.getItem('zenve_access_token');
      const res = await fetch('http://localhost:8080/api/products?size=50', {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (res.ok) {
        const payload = await res.json();
        const apiItems = payload?.data?.content || payload?.data;
        if (Array.isArray(apiItems) && apiItems.length > 0) {
          setItems(apiItems);
          setIsLiveBackend(true);
          if (isManual) showToast('Refreshed catalog from live backend API.');
          setRefreshing(false);
          return;
        }
      }
    } catch {
      // Backend unavailable; run smoothly in standalone mode
    }
    setIsLiveBackend(false);
    setRefreshing(false);
    if (isManual) {
      showToast('Catalog refreshed in offline demo mode.');
    }
  }, [showToast]);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const token = localStorage.getItem('zenve_access_token') || sessionStorage.getItem('zenve_access_token');
        const res = await fetch('http://localhost:8080/api/products?size=50', {
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          }
        });
        if (res.ok && !ignore) {
          const payload = await res.json();
          const apiItems = payload?.data?.content || payload?.data;
          if (Array.isArray(apiItems) && apiItems.length > 0) {
            setItems(apiItems);
            setIsLiveBackend(true);
          }
        }
      } catch {
        // standalone mode
      }
    };
    load();
    return () => { ignore = true; };
  }, []);

  // KPI Calculations
  const stats = useMemo(() => {
    const total = items.length;
    const products = items.filter(i => i.type === 'PRODUCT').length;
    const services = items.filter(i => i.type === 'SERVICE').length;
    const lowStock = items.filter(i => i.status === 'LOW_STOCK' || (i.type === 'PRODUCT' && i.stockQuantity <= i.reorderLevel)).length;
    const totalProductValuation = items
      .filter(i => i.type === 'PRODUCT')
      .reduce((acc, curr) => acc + ((curr.unitPrice || 0) * (curr.stockQuantity || 0)), 0);

    return {
      total,
      products,
      services,
      lowStock,
      totalProductValuation
    };
  }, [items]);

  // Filtered Items
  const filteredItems = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return items.filter(item => {
      // Type Filter
      if (typeFilter === 'PRODUCT' && item.type !== 'PRODUCT') return false;
      if (typeFilter === 'SERVICE' && item.type !== 'SERVICE') return false;
      if (typeFilter === 'LOW_STOCK') {
        const isLow = item.status === 'LOW_STOCK' || (item.type === 'PRODUCT' && item.stockQuantity <= item.reorderLevel);
        if (!isLow) return false;
      }

      // Category Filter
      if (categoryFilter !== 'All Categories' && item.category !== categoryFilter) return false;

      // Status Filter
      if (statusFilter !== 'ALL' && item.status !== statusFilter) return false;

      // Search Query
      if (q) {
        const matchSku = item.sku?.toLowerCase().includes(q);
        const matchName = item.name?.toLowerCase().includes(q);
        const matchDesc = item.description?.toLowerCase().includes(q);
        const matchVendor = item.vendorCompanyName?.toLowerCase().includes(q);
        const matchCategory = item.category?.toLowerCase().includes(q);
        if (!matchSku && !matchName && !matchDesc && !matchVendor && !matchCategory) return false;
      }

      return true;
    });
  }, [items, typeFilter, categoryFilter, statusFilter, searchQuery]);

  // Format currency helper
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(amount || 0);
  };

  // Status Badge Helper
  const renderStatusBadge = (status) => {
    const clean = (status || 'ACTIVE').toLowerCase();
    const label = status ? status.replace('_', ' ') : 'ACTIVE';
    return <span className={`status-badge ${clean}`}>{label}</span>;
  };

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setModalForm({
      open: true,
      isEdit: false,
      data: {
        ...INITIAL_FORM_STATE,
        sku: `PRD-${Date.now().toString().slice(-4)}`
      }
    });
  };

  // Open Edit Modal
  const handleOpenEditModal = (item) => {
    setModalForm({
      open: true,
      isEdit: true,
      data: { ...item }
    });
  };

  // Save Add/Edit
  const handleSaveItem = (e) => {
    e.preventDefault();
    const formData = modalForm.data;
    if (!formData.name.trim() || !formData.sku.trim()) {
      showToast('Item Name and SKU are required fields.');
      return;
    }

    const price = parseFloat(formData.unitPrice) || 0;
    const stock = parseInt(formData.stockQuantity, 10) || 0;
    const reorder = parseInt(formData.reorderLevel, 10) || 0;

    let computedStatus = formData.status;
    if (formData.type === 'PRODUCT') {
      if (stock === 0) computedStatus = 'OUT_OF_STOCK';
      else if (stock <= reorder) computedStatus = 'LOW_STOCK';
    }

    if (modalForm.isEdit) {
      setItems(prev => prev.map(i => (i.id === formData.id ? {
        ...formData,
        unitPrice: price,
        stockQuantity: stock,
        reorderLevel: reorder,
        status: computedStatus
      } : i)));
      showToast(`Updated item "${formData.name}" successfully.`);
    } else {
      const newItem = {
        ...formData,
        id: Date.now(),
        unitPrice: price,
        stockQuantity: stock,
        reorderLevel: reorder,
        status: computedStatus,
        rating: 4.8
      };
      setItems(prev => [newItem, ...prev]);
      showToast(`Registered new ${formData.type.toLowerCase()} "${formData.name}".`);
    }

    setModalForm({ open: false, isEdit: false, data: INITIAL_FORM_STATE });
  };

  // Quick Stock Adjust
  const handleSaveStockAdjust = () => {
    if (!stockModal.item) return;
    const updatedQty = Math.max(0, parseInt(stockModal.newQuantity, 10) || 0);

    setItems(prev => prev.map(item => {
      if (item.id === stockModal.item.id) {
        let newStatus = item.status;
        if (updatedQty === 0) newStatus = 'OUT_OF_STOCK';
        else if (updatedQty <= item.reorderLevel) newStatus = 'LOW_STOCK';
        else if (item.status === 'LOW_STOCK' || item.status === 'OUT_OF_STOCK') newStatus = 'ACTIVE';

        return { ...item, stockQuantity: updatedQty, status: newStatus };
      }
      return item;
    }));

    showToast(`Stock level for ${stockModal.item.sku} adjusted to ${updatedQty} units.`);
    setStockModal({ open: false, item: null, newQuantity: 0 });
  };

  // Delete Action
  const handleDeleteItem = () => {
    if (!deleteConfirm.item) return;
    setItems(prev => prev.filter(i => i.id !== deleteConfirm.item.id));
    showToast(`Item ${deleteConfirm.item.sku} removed from catalog.`);
    setDeleteConfirm({ open: false, item: null });
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['SKU', 'Name', 'Type', 'Category', 'Vendor', 'Price', 'Unit', 'Stock', 'Status', 'LeadTime', 'Warranty'];
    const rows = filteredItems.map(item => [
      item.sku,
      `"${item.name.replace(/"/g, '""')}"`,
      item.type,
      item.category,
      `"${item.vendorCompanyName || ''}"`,
      item.unitPrice,
      item.unitOfMeasure,
      item.stockQuantity,
      item.status,
      `"${item.leadTime || ''}"`,
      `"${item.warranty || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Products_Services_Catalog_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filteredItems.length} catalog items to CSV.`);
  };

  return (
    <div className="product-service-container">
      {/* 1. HERO BANNER */}
      <section className="product-hero-banner">
        <div className="product-hero-left">
          <h2>
            <span>Products &amp; Services Catalog</span>
            <span className="product-hero-icon" style={{ display: 'inline-flex', verticalAlign: 'middle', marginLeft: '8px' }}>
              <Package size={24} color="#6366F1" />
            </span>
          </h2>
          <div className="product-hero-subtitle">
            <span>Master Enterprise Repository for Procured Goods, Software Licenses &amp; Contracted Services</span>
            <div className={`product-live-badge ${isLiveBackend ? 'live' : 'demo'}`}>
              <span className="badge-dot" />
              <span>{isLiveBackend ? 'Live API Connected' : 'Interactive Demo Mode'}</span>
            </div>
          </div>
        </div>

        <div className="product-hero-actions">
          <button
            className={`product-btn product-btn-refresh ${refreshing ? 'spinning' : ''}`}
            onClick={() => fetchProducts(true)}
            title="Reload catalog"
          >
            <span className="refresh-icon">↻</span>
            <span>{refreshing ? 'Syncing...' : 'Refresh'}</span>
          </button>

          <button className="product-btn product-btn-export" onClick={handleExportCSV} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <Download size={14} />
            <span>Export CSV</span>
          </button>

          <button className="product-btn product-btn-primary" onClick={handleOpenCreateModal}>
            <span>+ Add Product / Service</span>
          </button>
        </div>
      </section>

      {/* 2. TOP 4 KPI CARDS */}
      <section className="product-kpi-grid">
        {/* KPI 1: Total Catalog Items */}
        <div className="product-kpi-card" onClick={() => setTypeFilter('ALL')} style={{ cursor: 'pointer' }}>
          <div className="product-kpi-accent" />
          <div className="kpi-top-row">
            <span className="kpi-title">Total Catalog Portfolio</span>
            <div className="kpi-icon-pill">
              <Package size={20} />
            </div>
          </div>
          <div className="kpi-value">{stats.total}</div>
          <div className="kpi-footer">
            <span className="kpi-subtext">{stats.products} Goods • {stats.services} Services</span>
          </div>
        </div>

        {/* KPI 2: Physical Products */}
        <div className="product-kpi-card" onClick={() => setTypeFilter('PRODUCT')} style={{ cursor: 'pointer' }}>
          <div className="product-kpi-accent" />
          <div className="kpi-top-row">
            <span className="kpi-title">Physical Goods &amp; Hardware</span>
            <div className="kpi-icon-pill">
              <Building2 size={20} />
            </div>
          </div>
          <div className="kpi-value">{stats.products}</div>
          <div className="kpi-footer">
            <span className="kpi-subtext">{formatCurrency(stats.totalProductValuation)} In-Stock • Active Warehouse</span>
          </div>
        </div>

        {/* KPI 3: Contracted Services */}
        <div className="product-kpi-card" onClick={() => setTypeFilter('SERVICE')} style={{ cursor: 'pointer' }}>
          <div className="product-kpi-accent" />
          <div className="kpi-top-row">
            <span className="kpi-title">Enterprise Services &amp; Cloud</span>
            <div className="kpi-icon-pill">
              <Wrench size={20} />
            </div>
          </div>
          <div className="kpi-value">{stats.services}</div>
          <div className="kpi-footer">
            <span className="kpi-subtext">Active SLA Retainers • High Reliability</span>
          </div>
        </div>

        {/* KPI 4: Stock & Reorder Alerts */}
        <div className="product-kpi-card" onClick={() => setTypeFilter('LOW_STOCK')} style={{ cursor: 'pointer' }}>
          <div className="product-kpi-accent" />
          <div className="kpi-top-row">
            <span className="kpi-title">Critical &amp; Low Stock Alerts</span>
            <div className="kpi-icon-pill">
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className="kpi-value">{stats.lowStock}</div>
          <div className="kpi-footer">
            <span className="kpi-subtext">{stats.lowStock} Items • Reorder Priority</span>
          </div>
        </div>
      </section>

      {/* 3. TOOLBAR & FILTER CARD */}
      <section className="product-filter-card">
        {/* Type Filter Tabs */}
        <div className="product-type-tabs">
          <button
            className={`product-tab-btn ${typeFilter === 'ALL' ? 'active' : ''}`}
            onClick={() => setTypeFilter('ALL')}
          >
            <span>All Items</span>
            <span className="tab-counter">{stats.total}</span>
          </button>

          <button
            className={`product-tab-btn ${typeFilter === 'PRODUCT' ? 'active' : ''}`}
            onClick={() => setTypeFilter('PRODUCT')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Package size={14} />
            <span>Products</span>
            <span className="tab-counter">{stats.products}</span>
          </button>

          <button
            className={`product-tab-btn ${typeFilter === 'SERVICE' ? 'active' : ''}`}
            onClick={() => setTypeFilter('SERVICE')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Wrench size={14} />
            <span>Services</span>
            <span className="tab-counter">{stats.services}</span>
          </button>

          <button
            className={`product-tab-btn ${typeFilter === 'LOW_STOCK' ? 'active' : ''}`}
            onClick={() => setTypeFilter('LOW_STOCK')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <AlertTriangle size={14} />
            <span>Low Stock Alerts</span>
            <span className={`tab-counter ${stats.lowStock > 0 ? 'urgent' : ''}`}>{stats.lowStock}</span>
          </button>
        </div>

        {/* Search, Categories, Status, & View Mode */}
        <div className="product-filter-right">
          <div className="product-search-box">
            <span style={{ display: 'inline-flex', alignItems: 'center' }}>
              <Search size={16} />
            </span>
            <input
              type="text"
              placeholder="Search by SKU, item, category, supplier..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
              >
                <X size={14} />
              </button>
            )}
          </div>

          <select
            className="product-select-filter"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            className="product-select-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="ACTIVE">Active / In Stock</option>
            <option value="LOW_STOCK">Low Stock</option>
            <option value="OUT_OF_STOCK">Out of Stock</option>
            <option value="PENDING_APPROVAL">Pending Approval</option>
          </select>

          <div className="view-toggle-group">
            <button
              className={`view-toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Card Grid View"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <LayoutGrid size={14} />
              <span>Cards</span>
            </button>
            <button
              className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Detailed Table View"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <List size={14} />
              <span>Table</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4. CONTENT AREA: CARDS GRID OR TABLE VIEW */}
      {filteredItems.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', background: '#1e293b', borderRadius: '14px', border: '1px solid #334155' }}>
          <div style={{ fontSize: '3rem', marginBottom: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Search size={40} color="#64748b" />
          </div>
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: '#E2E8F0' }}>No matching products or services found</h3>
          <p style={{ color: '#94a3b8', margin: '0 0 20px 0', fontSize: '0.9rem' }}>
            Try adjusting your search terms, type tab, or category filters.
          </p>
          <button
            className="product-btn product-btn-secondary"
            onClick={() => { setSearchQuery(''); setTypeFilter('ALL'); setCategoryFilter('All Categories'); setStatusFilter('ALL'); }}
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="product-grid">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="product-card"
              onClick={() => setDetailItem(item)}
              title="Click anywhere to view full specifications"
            >
              <div>
                <div className="product-card-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="product-code-tag">{item.sku}</span>
                    <span className="product-category-pill">{item.category}</span>
                  </div>
                  {renderStatusBadge(item.status)}
                </div>

                <h3 className="product-card-title">{item.name}</h3>

                <div className="product-card-essential-data">
                  <span className="essential-rate-label">Rate</span>
                  <span className="essential-rate-value">{formatCurrency(item.unitPrice)}</span>
                  <span className="essential-rate-unit">/ {item.unitOfMeasure}</span>
                </div>
              </div>

              <div className="product-card-footer">
                <button
                  type="button"
                  className="product-btn-view-details"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDetailItem(item);
                  }}
                  title="View complete specifications and supplier details"
                >
                  <Eye size={14} />
                  <span>View Details</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="product-table-card">
          <div className="product-table-wrapper">
            <table className="product-table">
              <thead>
                <tr>
                  <th>SKU / Code</th>
                  <th>Item Name &amp; Category</th>
                  <th>Type</th>
                  <th>Supplier / Vendor</th>
                  <th>Unit Price</th>
                  <th>Stock / Capacity</th>
                  <th>Lead Time</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map(item => (
                  <tr key={item.id}>
                    <td>
                      <span className="product-code-tag">{item.sku}</span>
                    </td>
                    <td>
                      <div className="table-item-cell">
                        <span className="table-item-name">{item.name}</span>
                        <span className="table-item-desc">{item.category}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`product-type-badge ${item.type.toLowerCase()}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        {item.type === 'PRODUCT' ? (
                          <>
                            <Package size={12} />
                            <span>Good</span>
                          </>
                        ) : (
                          <>
                            <Wrench size={12} />
                            <span>Service</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Building2 size={14} color="#64748b" />
                        <span style={{ fontWeight: 600 }}>{item.vendorCompanyName}</span>
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 700, color: '#34d399' }}>
                        {formatCurrency(item.unitPrice)}
                      </span>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{item.unitOfMeasure}</div>
                    </td>
                    <td>
                      {item.type === 'PRODUCT' ? (
                        <div>
                          <span style={{ fontWeight: 700, color: item.stockQuantity <= item.reorderLevel ? '#fbbf24' : '#f8fafc' }}>
                            {item.stockQuantity} units
                          </span>
                          <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Reorder at {item.reorderLevel}</div>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.82rem', color: '#c084fc', fontWeight: 600 }}>
                          {item.warranty || 'SLA Guaranteed'}
                        </span>
                      )}
                    </td>
                    <td>
                      <span style={{ fontSize: '0.82rem' }}>{item.leadTime}</span>
                    </td>
                    <td>{renderStatusBadge(item.status)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          className="btn-card-action"
                          onClick={() => setDetailItem(item)}
                          title="View Details"
                          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Eye size={13} />
                        </button>
                        {item.type === 'PRODUCT' && (
                          <button
                            className="btn-card-action"
                            onClick={() => setStockModal({ open: true, item, newQuantity: item.stockQuantity })}
                            title="Adjust Stock"
                            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <Package size={13} />
                          </button>
                        )}
                        <button
                          className="btn-card-action"
                          onClick={() => handleOpenEditModal(item)}
                          title="Edit"
                          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          className="btn-card-action btn-danger"
                          onClick={() => setDeleteConfirm({ open: true, item })}
                          title="Delete"
                          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <Trash2 size={13} />
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

      {/* ====================================================================
          5. MODALS & POPUPS
          ==================================================================== */}

      {/* 5A. VIEW DETAILS SPEC SHEET MODAL */}
      {detailItem && (
        <div className="product-modal-overlay" onClick={() => setDetailItem(null)}>
          <div className="product-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="product-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="product-code-tag">{detailItem.sku}</span>
                <h3>{detailItem.name}</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setDetailItem(null)} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
              <span className={`product-type-badge ${detailItem.type.toLowerCase()}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                {detailItem.type === 'PRODUCT' ? (
                  <>
                    <Package size={12} />
                    <span>Physical Product</span>
                  </>
                ) : (
                  <>
                    <Wrench size={12} />
                    <span>Enterprise Service</span>
                  </>
                )}
              </span>
              {renderStatusBadge(detailItem.status)}
              <span className="kpi-tag tag-neutral">{detailItem.category}</span>
            </div>

            <p style={{ color: '#cbd5e1', fontSize: '0.92rem', lineHeight: '1.6', margin: '0 0 16px 0' }}>
              {detailItem.description}
            </p>

            <div className="detail-spec-grid">
              <div className="detail-spec-item">
                <span className="label">Contracted Supplier</span>
                <span className="value" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Building2 size={14} color="#64748b" />
                  <span>{detailItem.vendorCompanyName} ({detailItem.vendorCode || 'VND-001'})</span>
                </span>
              </div>

              <div className="detail-spec-item">
                <span className="label">Unit Price &amp; Billing</span>
                <span className="value" style={{ color: '#34d399' }}>
                  {formatCurrency(detailItem.unitPrice)} / {detailItem.unitOfMeasure}
                </span>
              </div>

              <div className="detail-spec-item">
                <span className="label">{detailItem.type === 'PRODUCT' ? 'Inventory In Stock' : 'Service Capacity'}</span>
                <span className="value">{detailItem.stockQuantity} {detailItem.type === 'PRODUCT' ? 'units' : 'capacity index'}</span>
              </div>

              <div className="detail-spec-item">
                <span className="label">Reorder Threshold</span>
                <span className="value">{detailItem.reorderLevel} units</span>
              </div>

              <div className="detail-spec-item">
                <span className="label">Fulfillment / Lead Time</span>
                <span className="value">{detailItem.leadTime}</span>
              </div>

              <div className="detail-spec-item">
                <span className="label">Warranty &amp; SLA Terms</span>
                <span className="value" style={{ color: '#38bdf8' }}>{detailItem.warranty}</span>
              </div>

              <div className="detail-spec-item">
                <span className="label">Minimum Order Qty (MOQ)</span>
                <span className="value">{detailItem.minOrderQty || 1} units</span>
              </div>

              <div className="detail-spec-item">
                <span className="label">Supplier Quality Score</span>
                <span className="value" style={{ color: '#fbbf24', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Star size={12} fill="currentColor" />
                  <span>{detailItem.rating || '4.8'} / 5.0 Rating</span>
                </span>
              </div>
            </div>

            <div className="product-modal-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
              <button
                className="product-btn action-btn-delete"
                onClick={() => {
                  const itm = detailItem;
                  setDetailItem(null);
                  setDeleteConfirm({ open: true, item: itm });
                }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Trash2 size={14} />
                <span>Delete Item</span>
              </button>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  className="product-btn product-btn-secondary"
                  onClick={() => setDetailItem(null)}
                >
                  Close
                </button>
                {detailItem.type === 'PRODUCT' && (
                  <button
                    className="product-btn product-btn-secondary"
                    onClick={() => {
                      const itm = detailItem;
                      setDetailItem(null);
                      setStockModal({ open: true, item: itm, newQuantity: itm.stockQuantity });
                    }}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                  >
                    <Package size={14} />
                    <span>Adjust Stock</span>
                  </button>
                )}
                <button
                  className="product-btn product-btn-primary"
                  onClick={() => {
                    const itm = detailItem;
                    setDetailItem(null);
                    handleOpenEditModal(itm);
                  }}
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Pencil size={14} />
                  <span>Edit Item</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5B. ADD / EDIT PRODUCT & SERVICE MODAL */}
      {modalForm.open && (
        <div className="product-modal-overlay" onClick={() => setModalForm(prev => ({ ...prev, open: false }))}>
          <div className="product-modal-box" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSaveItem}>
              <div className="product-modal-header">
                <h3>{modalForm.isEdit ? 'Edit Product / Service' : 'Register New Product or Service'}</h3>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setModalForm(prev => ({ ...prev, open: false }))}
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>SKU / Item Code *</label>
                  <input
                    type="text"
                    required
                    value={modalForm.data.sku}
                    onChange={(e) => setModalForm(prev => ({ ...prev, data: { ...prev.data, sku: e.target.value } }))}
                    placeholder="e.g. PRD-HW-009"
                  />
                </div>

                <div className="form-group">
                  <label>Classification Type *</label>
                  <select
                    value={modalForm.data.type}
                    onChange={(e) => setModalForm(prev => ({ ...prev, data: { ...prev.data, type: e.target.value } }))}
                  >
                    <option value="PRODUCT">Physical Product / Hardware / Supplies</option>
                    <option value="SERVICE">Enterprise Service / Cloud / Consulting</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Item Name *</label>
                <input
                  type="text"
                  required
                  value={modalForm.data.name}
                  onChange={(e) => setModalForm(prev => ({ ...prev, data: { ...prev.data, name: e.target.value } }))}
                  placeholder="e.g. High-Density Dual Socket Server"
                />
              </div>

              <div className="form-group">
                <label>Description &amp; Specifications</label>
                <textarea
                  rows="3"
                  value={modalForm.data.description}
                  onChange={(e) => setModalForm(prev => ({ ...prev, data: { ...prev.data, description: e.target.value } }))}
                  placeholder="Detailed technical or operational specifications..."
                />
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={modalForm.data.category}
                    onChange={(e) => setModalForm(prev => ({ ...prev, data: { ...prev.data, category: e.target.value } }))}
                  >
                    {CATEGORIES.filter(c => c !== 'All Categories').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Supplier / Vendor *</label>
                  <input
                    type="text"
                    required
                    value={modalForm.data.vendorCompanyName}
                    onChange={(e) => setModalForm(prev => ({ ...prev, data: { ...prev.data, vendorCompanyName: e.target.value } }))}
                    placeholder="e.g. Apex Cloud Systems Ltd"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Contracted Unit Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={modalForm.data.unitPrice}
                    onChange={(e) => setModalForm(prev => ({ ...prev, data: { ...prev.data, unitPrice: e.target.value } }))}
                    placeholder="e.g. 1450.00"
                  />
                </div>

                <div className="form-group">
                  <label>Unit of Measure</label>
                  <input
                    type="text"
                    value={modalForm.data.unitOfMeasure}
                    onChange={(e) => setModalForm(prev => ({ ...prev, data: { ...prev.data, unitOfMeasure: e.target.value } }))}
                    placeholder="e.g. per unit, per month, per hour"
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>{modalForm.data.type === 'PRODUCT' ? 'Stock Quantity' : 'Service Capacity'}</label>
                  <input
                    type="number"
                    min="0"
                    value={modalForm.data.stockQuantity}
                    onChange={(e) => setModalForm(prev => ({ ...prev, data: { ...prev.data, stockQuantity: e.target.value } }))}
                  />
                </div>

                <div className="form-group">
                  <label>Reorder Point Alert</label>
                  <input
                    type="number"
                    min="0"
                    value={modalForm.data.reorderLevel}
                    onChange={(e) => setModalForm(prev => ({ ...prev, data: { ...prev.data, reorderLevel: e.target.value } }))}
                  />
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Fulfillment / Lead Time</label>
                  <input
                    type="text"
                    value={modalForm.data.leadTime}
                    onChange={(e) => setModalForm(prev => ({ ...prev, data: { ...prev.data, leadTime: e.target.value } }))}
                    placeholder="e.g. 3-5 Business Days"
                  />
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={modalForm.data.status}
                    onChange={(e) => setModalForm(prev => ({ ...prev, data: { ...prev.data, status: e.target.value } }))}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="LOW_STOCK">LOW STOCK</option>
                    <option value="OUT_OF_STOCK">OUT OF STOCK</option>
                    <option value="PENDING_APPROVAL">PENDING APPROVAL</option>
                    <option value="DISCONTINUED">DISCONTINUED</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Warranty &amp; Service Level Agreement (SLA)</label>
                <input
                  type="text"
                  value={modalForm.data.warranty}
                  onChange={(e) => setModalForm(prev => ({ ...prev, data: { ...prev.data, warranty: e.target.value } }))}
                  placeholder="e.g. 3-Year 24/7 NBD Hardware Replacement"
                />
              </div>

              <div className="product-modal-actions">
                <button
                  type="button"
                  className="product-btn product-btn-secondary"
                  onClick={() => setModalForm(prev => ({ ...prev, open: false }))}
                >
                  Cancel
                </button>
                <button type="submit" className="product-btn product-btn-primary">
                  {modalForm.isEdit ? 'Save Changes' : '+ Register Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5C. QUICK STOCK ADJUST MODAL */}
      {stockModal.open && stockModal.item && (
        <div className="product-modal-overlay" onClick={() => setStockModal({ open: false, item: null, newQuantity: 0 })}>
          <div className="product-modal-box" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div className="product-modal-header">
              <h3>Adjust Stock Inventory</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setStockModal({ open: false, item: null, newQuantity: 0 })}
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={16} />
              </button>
            </div>

            <p style={{ color: '#cbd5e1', fontSize: '0.88rem', margin: '0 0 16px 0' }}>
              Adjust current inventory level for <strong>{stockModal.item.name}</strong> ({stockModal.item.sku}).
            </p>

            <div className="form-group">
              <label>Current Stock (Units)</label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button
                  type="button"
                  className="product-btn product-btn-secondary"
                  onClick={() => setStockModal(prev => ({ ...prev, newQuantity: Math.max(0, prev.newQuantity - 10) }))}
                >
                  -10
                </button>
                <button
                  type="button"
                  className="product-btn product-btn-secondary"
                  onClick={() => setStockModal(prev => ({ ...prev, newQuantity: Math.max(0, prev.newQuantity - 1) }))}
                >
                  -1
                </button>
                <input
                  type="number"
                  min="0"
                  style={{ textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}
                  value={stockModal.newQuantity}
                  onChange={(e) => setStockModal(prev => ({ ...prev, newQuantity: parseInt(e.target.value, 10) || 0 }))}
                />
                <button
                  type="button"
                  className="product-btn product-btn-secondary"
                  onClick={() => setStockModal(prev => ({ ...prev, newQuantity: prev.newQuantity + 1 }))}
                >
                  +1
                </button>
                <button
                  type="button"
                  className="product-btn product-btn-secondary"
                  onClick={() => setStockModal(prev => ({ ...prev, newQuantity: prev.newQuantity + 10 }))}
                >
                  +10
                </button>
              </div>
            </div>

            <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '10px' }}>
              Reorder threshold for this item is <strong>{stockModal.item.reorderLevel} units</strong>.
            </div>

            <div className="product-modal-actions">
              <button
                type="button"
                className="product-btn product-btn-secondary"
                onClick={() => setStockModal({ open: false, item: null, newQuantity: 0 })}
              >
                Cancel
              </button>
              <button
                type="button"
                className="product-btn product-btn-primary"
                onClick={handleSaveStockAdjust}
              >
                Save Stock
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5D. DELETE CONFIRMATION MODAL */}
      {deleteConfirm.open && deleteConfirm.item && (
        <div className="product-modal-overlay" onClick={() => setDeleteConfirm({ open: false, item: null })}>
          <div className="product-modal-box" style={{ maxWidth: '440px' }} onClick={(e) => e.stopPropagation()}>
            <div className="product-modal-header">
              <h3 style={{ color: '#f87171' }}>Confirm Removal</h3>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setDeleteConfirm({ open: false, item: null })}
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={16} />
              </button>
            </div>

            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: '1.5', margin: '0 0 16px 0' }}>
              Are you sure you want to remove <strong>{deleteConfirm.item.name}</strong> ({deleteConfirm.item.sku}) from the catalog? This will affect procurement orders referencing this SKU.
            </p>

            <div className="product-modal-actions">
              <button
                type="button"
                className="product-btn product-btn-secondary"
                onClick={() => setDeleteConfirm({ open: false, item: null })}
              >
                Cancel
              </button>
              <button
                type="button"
                className="product-btn btn-card-action btn-danger"
                style={{ padding: '10px 18px', fontSize: '0.88rem' }}
                onClick={handleDeleteItem}
              >
                Yes, Remove Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. FLOATING TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="product-toast" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={16} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
