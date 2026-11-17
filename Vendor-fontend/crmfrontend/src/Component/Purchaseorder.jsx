import { useState, useEffect, useCallback } from 'react';
import { ShoppingCart, Clock, CheckCircle, IndianRupee, RefreshCw, X, Plus } from 'lucide-react';
import '../Styles/Purchaseorder.css';
import { authService } from '../services/authService';

const PO_API_BASE = 'http://localhost:8080/api/purchase-orders';
const VENDOR_API_BASE = 'http://localhost:8080/api/vendors';

const DEFAULT_PURCHASE_ORDERS = [
  {
    id: 1,
    orderNumber: 'PO-2026-001',
    vendorId: 1,
    vendorCompanyName: 'Acme Industrial Supplies',
    orderDate: '2026-11-10',
    expectedDeliveryDate: '2026-11-25',
    totalAmount: 245000,
    taxAmount: 44100,
    grandTotal: 289100,
    status: 'APPROVED',
    shippingAddress: 'Warehouse 1, Tech Park, Chennai',
    items: [
      { id: 1, itemDescription: 'Heavy-Duty Industrial Motors 15HP', sku: 'MOT-IND-15HP', quantity: 4, unitPrice: 50000, taxRate: 18, totalPrice: 200000 },
      { id: 2, itemDescription: 'Motor Mounting Brackets & Couplings', sku: 'BRK-MOT-01', quantity: 9, unitPrice: 5000, taxRate: 18, totalPrice: 45000 }
    ]
  },
  {
    id: 2,
    orderNumber: 'PO-2026-002',
    vendorId: 2,
    vendorCompanyName: 'Apex Cloud Solutions',
    orderDate: '2026-11-12',
    expectedDeliveryDate: '2026-11-20',
    totalAmount: 120000,
    taxAmount: 21600,
    grandTotal: 141600,
    status: 'PENDING_APPROVAL',
    shippingAddress: 'Headquarters Server Room, Floor 4, Bengaluru',
    items: [
      { id: 3, itemDescription: 'Enterprise Cloud Firewall Annual License', sku: 'LIC-CFW-ENT', quantity: 2, unitPrice: 60000, taxRate: 18, totalPrice: 120000 }
    ]
  },
  {
    id: 3,
    orderNumber: 'PO-2026-003',
    vendorId: 3,
    vendorCompanyName: 'Global Logistics Corp',
    orderDate: '2026-11-14',
    expectedDeliveryDate: '2026-11-18',
    totalAmount: 85500,
    taxAmount: 15390,
    grandTotal: 100890,
    status: 'ISSUED',
    shippingAddress: 'Distribution Hub, Sector 5, Mumbai',
    items: [
      { id: 4, itemDescription: 'Pallet Jack 2.5 Ton Hydraulic', sku: 'LOG-PLT-25T', quantity: 3, unitPrice: 28500, taxRate: 18, totalPrice: 85500 }
    ]
  },
  {
    id: 4,
    orderNumber: 'PO-2026-004',
    vendorId: 4,
    vendorCompanyName: 'ByteWave Technologies',
    orderDate: '2026-11-15',
    expectedDeliveryDate: '2026-11-22',
    totalAmount: 350000,
    taxAmount: 63000,
    grandTotal: 413000,
    status: 'DELIVERED',
    shippingAddress: 'IT Facility Warehouse, Cyber City, Hyderabad',
    items: [
      { id: 5, itemDescription: 'Cisco Core Switch 48-Port PoE+', sku: 'NET-SW-48P', quantity: 2, unitPrice: 175000, taxRate: 18, totalPrice: 350000 }
    ]
  }
];

const FALLBACK_VENDORS = [
  { id: 1, companyName: 'Acme Industrial Supplies' },
  { id: 2, companyName: 'Apex Cloud Solutions' },
  { id: 3, companyName: 'Global Logistics Corp' },
  { id: 4, companyName: 'ByteWave Technologies' }
];

function Purchaseorder() {
  const [orders, setOrders] = useState(DEFAULT_PURCHASE_ORDERS);
  const [vendors, setVendors] = useState(FALLBACK_VENDORS);
  const [isLoading, setIsLoading] = useState(false);
  const [isLiveBackend, setIsLiveBackend] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [items, setItems] = useState([
    { itemDescription: '', sku: '', quantity: 1, unitPrice: 0, taxRate: 18 },
  ]);
  const [formData, setFormData] = useState({
    orderNumber: '',
    vendorId: '1',
    vendorCompanyName: 'Acme Industrial Supplies',
    orderDate: new Date().toISOString().split('T')[0],
    expectedDeliveryDate: '',
    shippingAddress: '',
    notes: '',
  });

  const showToast = (msg) => {
    setStatusMessage(msg);
    setTimeout(() => setStatusMessage(''), 3500);
  };

  const fetchOrders = useCallback(async (isManual = false) => {
    try {
      setIsLoading(true);
      const headers = authService.getAuthHeaders();
      const response = await fetch(`${PO_API_BASE}?size=50`, { headers });
      
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      
      const result = await response.json();
      const orderList = result?.data?.content || result?.data || [];
      
      if (Array.isArray(orderList) && orderList.length > 0) {
        setOrders(orderList);
        setIsLiveBackend(true);
        if (isManual) showToast('Purchase orders synced from live database.');
      } else {
        // Backend DB table has 0 rows, use default sample data
        setOrders(DEFAULT_PURCHASE_ORDERS);
        setIsLiveBackend(true);
        if (isManual) showToast('Connected to live backend (table is empty, displaying default POs).');
      }
    } catch (err) {
      console.warn('Backend purchase-orders API unavailable or offline:', err.message);
      setIsLiveBackend(false);
      if (isManual) showToast('Backend unavailable. Displaying local demo purchase orders.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchVendors = useCallback(async () => {
    try {
      const headers = authService.getAuthHeaders();
      const response = await fetch(`${VENDOR_API_BASE}?size=50`, { headers });
      if (response.ok) {
        const result = await response.json();
        const vendorList = result?.data?.content || result?.data;
        if (Array.isArray(vendorList) && vendorList.length > 0) {
          setVendors(vendorList);
        }
      }
    } catch {
      // Use fallback vendors
    }
  }, []);

  useEffect(() => {
    fetchOrders(false);
    fetchVendors();
  }, [fetchOrders, fetchVendors]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'vendorId') {
      const selected = vendors.find((v) => String(v.id) === String(value));
      setFormData((prev) => ({
        ...prev,
        vendorId: value,
        vendorCompanyName: selected ? selected.companyName : prev.vendorCompanyName,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleItemChange = (index, field, value) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const handleAddItem = () => {
    setItems((prev) => [
      ...prev,
      { itemDescription: '', sku: '', quantity: 1, unitPrice: 0, taxRate: 18 },
    ]);
  };

  const handleRemoveItem = (index) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const subTotal = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
    0
  );
  const totalTax = subTotal * 0.18;
  const calculatedGrandTotal = subTotal + totalTax;

  const openCreateModal = () => {
    const nextNum = `PO-2026-${String(orders.length + 1).padStart(3, '0')}`;
    setFormData({
      orderNumber: nextNum,
      vendorId: vendors[0]?.id ? String(vendors[0].id) : '1',
      vendorCompanyName: vendors[0]?.companyName || 'Acme Industrial Supplies',
      orderDate: new Date().toISOString().split('T')[0],
      expectedDeliveryDate: '',
      shippingAddress: 'Main Warehouse, Dock B, Facility 1',
      notes: '',
    });
    setItems([
      { itemDescription: '', sku: '', quantity: 1, unitPrice: 0, taxRate: 18 },
    ]);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const orderPayload = {
      orderNumber: formData.orderNumber.trim(),
      vendorId: Number(formData.vendorId) || 1,
      orderDate: formData.orderDate,
      expectedDeliveryDate: formData.expectedDeliveryDate || undefined,
      shippingAddress: formData.shippingAddress || 'Headquarters Warehouse',
      notes: formData.notes || '',
      status: 'PENDING_APPROVAL',
      items: items.map((it) => ({
        itemDescription: it.itemDescription.trim() || 'PO Item',
        sku: it.sku.trim() || `SKU-${Date.now().toString().slice(-4)}`,
        quantity: Math.max(1, Number(it.quantity) || 1),
        unitPrice: Math.max(0, Number(it.unitPrice) || 0),
        taxRate: Number(it.taxRate) || 18,
      })),
    };

    let savedOrder = null;

    // Attempt to persist to live backend
    try {
      const headers = authService.getAuthHeaders();
      const res = await fetch(PO_API_BASE, {
        method: 'POST',
        headers,
        body: JSON.stringify(orderPayload),
      });

      if (res.ok) {
        const json = await res.json();
        savedOrder = json?.data;
      }
    } catch (err) {
      console.warn('Backend PO save failed, using local fallback:', err.message);
    }

    if (!savedOrder) {
      // Local fallback
      const maxId = orders.reduce((max, po) => Math.max(max, Number(po.id) || 0), 0);
      savedOrder = {
        id: maxId + 1,
        orderNumber: formData.orderNumber,
        vendorId: Number(formData.vendorId) || 1,
        vendorCompanyName: formData.vendorCompanyName,
        orderDate: formData.orderDate,
        expectedDeliveryDate: formData.expectedDeliveryDate,
        totalAmount: subTotal,
        taxAmount: totalTax,
        grandTotal: calculatedGrandTotal,
        status: 'PENDING_APPROVAL',
        shippingAddress: formData.shippingAddress,
        notes: formData.notes,
        items: items.map((it, idx) => ({
          id: idx + 1,
          itemDescription: it.itemDescription,
          sku: it.sku || `SKU-${idx + 1}`,
          quantity: Number(it.quantity) || 1,
          unitPrice: Number(it.unitPrice) || 0,
          taxRate: 18,
          totalPrice: (Number(it.quantity) || 1) * (Number(it.unitPrice) || 0),
        })),
      };
    }

    setOrders((prev) => [savedOrder, ...prev]);
    setIsModalOpen(false);
    showToast(`Purchase Order ${savedOrder.orderNumber} created successfully!`);
  };

  const handleStatusChange = async (id, newStatus) => {
    setOrders((prev) =>
      prev.map((po) => (po.id === id ? { ...po, status: newStatus } : po))
    );

    try {
      const headers = authService.getAuthHeaders();
      await fetch(`${PO_API_BASE}/${id}/status`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ status: newStatus }),
      });
      showToast(`Order status updated to ${newStatus.replace(/_/g, ' ')}`);
    } catch (err) {
      console.warn('Backend status update failed, updated locally:', err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this purchase order?')) {
      return;
    }

    setOrders((prev) => prev.filter((po) => po.id !== id));

    try {
      const headers = authService.getAuthHeaders();
      await fetch(`${PO_API_BASE}/${id}`, {
        method: 'DELETE',
        headers,
      });
      showToast('Purchase order deleted successfully.');
    } catch (err) {
      console.warn('Backend delete failed, deleted locally:', err.message);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'APPROVED': return 'po-badge-approved';
      case 'PENDING_APPROVAL': return 'po-badge-pending';
      case 'ISSUED': return 'po-badge-issued';
      case 'DELIVERED': return 'po-badge-delivered';
      case 'CANCELLED': return 'po-badge-cancelled';
      default: return 'po-badge-draft';
    }
  };

  const filteredOrders = orders.filter((po) => {
    const orderNum = (po.orderNumber || '').toLowerCase();
    const vendorName = (po.vendorCompanyName || '').toLowerCase();
    const search = (searchQuery || '').toLowerCase();

    const matchesSearch = orderNum.includes(search) || vendorName.includes(search);
    const matchesStatus = statusFilter === 'ALL' || po.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // KPI Metrics Calculation
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'PENDING_APPROVAL').length;
  const approvedOrdersCount = orders.filter((o) => ['APPROVED', 'ISSUED', 'DELIVERED'].includes(o.status)).length;
  const totalSpend = orders.reduce((sum, o) => sum + (Number(o.grandTotal) || 0), 0);

  return (
    <div className="po-container">
      {/* 1. Page Header */}
      <div className="po-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2>Purchase Orders</h2>
            <span className={`po-connection-badge ${isLiveBackend ? 'live' : 'demo'}`} style={{ display: 'inline-flex', alignItems: 'center' }}>
              <span style={{ display: 'inline-block', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'currentColor', marginRight: '6px' }} />
              <span>{isLiveBackend ? 'Live Backend' : 'Demo State'}</span>
            </span>
          </div>
          <p>Create, track, and manage vendor purchase orders with approval workflows.</p>
        </div>
        <button
          className="po-btn-primary"
          type="button"
          onClick={openCreateModal}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={15} />
          <span>Create Purchase Order</span>
        </button>
      </div>

      {/* 2. KPI Summary Metric Cards */}
      <div className="po-stats-grid">
        <div className="po-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="po-stat-label">Total Orders</span>
            <ShoppingCart size={18} color="#6366F1" />
          </div>
          <strong className="po-stat-value po-stat-cyan">{totalOrdersCount}</strong>
        </div>
        <div className="po-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="po-stat-label">Pending Approval</span>
            <Clock size={18} color="#f59e0b" />
          </div>
          <strong className="po-stat-value po-stat-amber">{pendingOrdersCount}</strong>
        </div>
        <div className="po-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="po-stat-label">Approved & Issued</span>
            <CheckCircle size={18} color="#10b981" />
          </div>
          <strong className="po-stat-value po-stat-emerald">{approvedOrdersCount}</strong>
        </div>
        <div className="po-stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="po-stat-label">Total Value</span>
            <IndianRupee size={18} color="#c084fc" />
          </div>
          <strong className="po-stat-value po-stat-purple">₹{totalSpend.toLocaleString('en-IN')}</strong>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="po-toolbar">
        <input
          type="text"
          className="po-search-input"
          placeholder="Search by PO number or vendor..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="po-filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          <option value="DRAFT">DRAFT</option>
          <option value="PENDING_APPROVAL">PENDING APPROVAL</option>
          <option value="APPROVED">APPROVED</option>
          <option value="ISSUED">ISSUED</option>
          <option value="DELIVERED">DELIVERED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
        <button
          type="button"
          className="po-btn-refresh"
          onClick={() => fetchOrders(true)}
          disabled={isLoading}
          title="Refresh orders from backend"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <RefreshCw size={14} className={isLoading ? 'spinning' : ''} />
          <span>{isLoading ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {statusMessage && <div className="po-api-alert">{statusMessage}</div>}

      {/* 4. Orders Table */}
      <table className="po-table">
        <thead>
          <tr>
            <th>PO Number</th>
            <th>Vendor</th>
            <th>Order Date</th>
            <th>Grand Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan="6" className="po-empty">
                Loading purchase orders...
              </td>
            </tr>
          ) : filteredOrders.length === 0 ? (
            <tr>
              <td colSpan="6" className="po-empty">
                No purchase orders matching filter criteria.
              </td>
            </tr>
          ) : (
            filteredOrders.map((po) => (
              <tr key={po.id}>
                <td className="po-order-num">{po.orderNumber}</td>
                <td>{po.vendorCompanyName || 'Vendor #' + (po.vendorId || '-')}</td>
                <td>{po.orderDate || '-'}</td>
                <td>₹{(Number(po.grandTotal) || 0).toLocaleString('en-IN')}</td>
                <td>
                  <span className={`po-badge ${getStatusBadgeClass(po.status)}`}>
                    {(po.status || 'PENDING_APPROVAL').replace(/_/g, ' ')}
                  </span>
                </td>
                <td className="po-actions">
                  <select
                    className="po-status-select"
                    value={po.status || 'PENDING_APPROVAL'}
                    onChange={(e) => handleStatusChange(po.id, e.target.value)}
                  >
                    <option value="DRAFT">DRAFT</option>
                    <option value="PENDING_APPROVAL">PENDING APPROVAL</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="ISSUED">ISSUED</option>
                    <option value="DELIVERED">DELIVERED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                  <button
                    type="button"
                    className="po-btn-delete"
                    onClick={() => handleDelete(po.id)}
                    title="Delete purchase order"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 5. Create PO Modal */}
      {isModalOpen && (
        <div className="po-modal-overlay">
          <div className="po-modal">
            <h3>Create Purchase Order</h3>
            <form onSubmit={handleSubmit} className="po-form">
              <div>
                <label>PO Number *</label>
                <input
                  type="text"
                  name="orderNumber"
                  placeholder="PO Number (e.g. PO-2026-005)"
                  value={formData.orderNumber}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <label>Vendor Partner *</label>
                <select
                  name="vendorId"
                  className="po-form-select"
                  value={formData.vendorId}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    background: '#020B1A',
                    border: '1px solid rgba(99, 102, 241, 0.22)',
                    borderRadius: '8px',
                    fontSize: '0.92rem',
                    color: '#E2E8F0',
                    outline: 'none',
                  }}
                >
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.companyName}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label>Order Date *</label>
                  <input
                    type="date"
                    name="orderDate"
                    value={formData.orderDate}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label>Expected Delivery</label>
                  <input
                    type="date"
                    name="expectedDeliveryDate"
                    value={formData.expectedDeliveryDate}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label>Shipping Address</label>
                <input
                  type="text"
                  name="shippingAddress"
                  placeholder="e.g. Warehouse 1, Tech Park, Chennai"
                  value={formData.shippingAddress}
                  onChange={handleChange}
                />
              </div>

              {/* Dynamic Line Items */}
              <div className="po-items-section">
                <div className="po-items-header">
                  <h4>Order Items</h4>
                  <button
                    type="button"
                    className="po-btn-add-item"
                    onClick={handleAddItem}
                  >
                    + Add Item
                  </button>
                </div>

                {items.map((item, idx) => (
                  <div key={idx} className="po-item-row">
                    <input
                      type="text"
                      placeholder="Item description"
                      value={item.itemDescription}
                      onChange={(e) =>
                        handleItemChange(idx, 'itemDescription', e.target.value)
                      }
                      required
                    />
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      className="po-item-qty"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(idx, 'quantity', e.target.value)
                      }
                      required
                    />
                    <input
                      type="number"
                      min="0"
                      placeholder="Unit Price"
                      className="po-item-price"
                      value={item.unitPrice}
                      onChange={(e) =>
                        handleItemChange(idx, 'unitPrice', e.target.value)
                      }
                      required
                    />
                    {items.length > 1 && (
                      <button
                        type="button"
                        className="po-btn-remove-item"
                        onClick={() => handleRemoveItem(idx)}
                        title="Remove item"
                        style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}

                <div className="po-calculated-total">
                  <span>Subtotal: ₹{subTotal.toLocaleString('en-IN')} | Tax (18%): ₹{totalTax.toLocaleString('en-IN')}</span>
                  <strong>Grand Total: ₹{calculatedGrandTotal.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              <div className="po-modal-actions">
                <button
                  type="button"
                  className="po-btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="po-btn-primary">
                  Save Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Purchaseorder;
