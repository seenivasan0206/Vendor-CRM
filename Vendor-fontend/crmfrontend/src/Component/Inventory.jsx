import { useState, useEffect, useCallback } from 'react';
import '../Styles/Inventory.css';
import { authService } from '../services/authService';

const API_BASE_URL = 'http://localhost:8080/api/inventory';

const SAMPLE_INVENTORY = [
  {
    id: 1,
    productName: 'Industrial IoT Temperature Sensor',
    sku: 'PRD-IOT-101',
    productSku: 'PRD-IOT-101',
    location: 'Warehouse 1 - Rack B2 - Shelf 4',
    quantityOnHand: 100,
    reservedQuantity: 10,
    reorderLevel: 25,
    maxLevel: 500,
    batchNumber: 'BATCH-2026-001',
  },
  {
    id: 2,
    productName: 'Dell UltraSharp 27-inch 4K Monitor',
    sku: 'MON-DEL-4K',
    productSku: 'MON-DEL-4K',
    location: 'Warehouse 1 - Rack A1 - Shelf 1',
    quantityOnHand: 8,
    reservedQuantity: 2,
    reorderLevel: 15,
    maxLevel: 100,
    batchNumber: 'BATCH-2026-002',
  },
  {
    id: 3,
    productName: 'Logitech MX Master 3S Wireless Mouse',
    sku: 'MOU-LOG-MX3',
    productSku: 'MOU-LOG-MX3',
    location: 'Warehouse 2 - Shelf C3',
    quantityOnHand: 45,
    reservedQuantity: 5,
    reorderLevel: 20,
    maxLevel: 200,
    batchNumber: 'BATCH-2026-003',
  },
  {
    id: 4,
    productName: 'USB-C Universal Docking Station',
    sku: 'DOC-USB-09',
    productSku: 'DOC-USB-09',
    location: 'Warehouse 1 - Rack B1 - Shelf 2',
    quantityOnHand: 0,
    reservedQuantity: 0,
    reorderLevel: 10,
    maxLevel: 100,
    batchNumber: 'BATCH-2026-004',
  },
  {
    id: 5,
    productName: 'Heavy-Duty Industrial Motor 15HP',
    sku: 'MOT-IND-15HP',
    productSku: 'MOT-IND-15HP',
    location: 'Warehouse 3 - Heavy Bay 1',
    quantityOnHand: 30,
    reservedQuantity: 4,
    reorderLevel: 10,
    maxLevel: 150,
    batchNumber: 'BATCH-2026-005',
  },
];

function getStockStatus(item) {
  const onHand = Number(item.quantityOnHand) || 0;
  const reorder = Number(item.reorderLevel) || 0;
  if (onHand <= 0) {
    return { key: 'OUT_OF_STOCK', label: 'OUT OF STOCK', className: 'inv-badge-out' };
  }
  if (onHand <= reorder) {
    return { key: 'LOW_STOCK', label: 'LOW STOCK', className: 'inv-badge-low' };
  }
  return { key: 'IN_STOCK', label: 'IN STOCK', className: 'inv-badge-in' };
}

function Inventory() {
  const [inventoryList, setInventoryList] = useState(SAMPLE_INVENTORY);
  const [isLoading, setIsLoading] = useState(false);
  const [isLiveBackend, setIsLiveBackend] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [adjustModalItem, setAdjustModalItem] = useState(null);
  const [adjustType, setAdjustType] = useState('STOCK_IN');
  const [adjustQty, setAdjustQty] = useState('');
  const [adjustNotes, setAdjustNotes] = useState('');
  const [adjustError, setAdjustError] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const fetchInventory = useCallback(async (isManual = false) => {
    try {
      setIsLoading(true);
      const headers = authService.getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}?size=50`, { headers });
      
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      
      const data = await res.json();
      const list = data?.data?.content || data?.data || [];
      
      if (Array.isArray(list) && list.length > 0) {
        setInventoryList(list);
        setIsLiveBackend(true);
        if (isManual) showToast('Inventory stock synced with live database.');
      } else {
        setInventoryList(SAMPLE_INVENTORY);
        setIsLiveBackend(true);
        if (isManual) showToast('Live backend connected (table empty, displaying default inventory).');
      }
    } catch (err) {
      console.warn('Backend inventory API offline or unreachable:', err.message);
      setIsLiveBackend(false);
      if (isManual) showToast('Backend API unreachable. Running in local demo inventory mode.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInventory(false);
  }, [fetchInventory]);

  const openAdjustModal = (item, type) => {
    setAdjustModalItem(item);
    setAdjustType(type);
    setAdjustQty('');
    setAdjustNotes('');
    setAdjustError('');
  };

  const closeAdjustModal = () => {
    setAdjustModalItem(null);
    setAdjustError('');
  };

  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    const qty = Number(adjustQty);

    if (!qty || qty <= 0) {
      setAdjustError('Please enter a valid quantity greater than 0.');
      return;
    }

    const currentQty = Number(adjustModalItem.quantityOnHand) || 0;

    if (adjustType === 'STOCK_OUT' && qty > currentQty) {
      setAdjustError(
        `Cannot dispatch ${qty} units. Only ${currentQty} units available on hand!`
      );
      return;
    }

    // Try backend API call: POST /api/inventory/{id}/adjust
    try {
      const headers = authService.getAuthHeaders();
      await fetch(`${API_BASE_URL}/${adjustModalItem.id}/adjust`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          type: adjustType,
          quantity: qty,
          referenceNumber: adjustNotes || 'WEB-MANUAL',
          notes: adjustNotes || 'Manual stock adjustment from UI',
        }),
      });
      showToast(
        `${adjustType === 'STOCK_IN' ? 'Received' : 'Dispatched'} ${qty} units of ${
          adjustModalItem.productName || 'product'
        }!`
      );
    } catch (err) {
      console.warn('Backend stock adjustment failed, updating local state:', err.message);
      showToast(
        `Adjusted locally: ${adjustType === 'STOCK_IN' ? '+' : '-'}${qty} units.`
      );
    }

    // Update React state
    setInventoryList((prev) =>
      prev.map((item) => {
        if (item.id === adjustModalItem.id) {
          const prevQty = Number(item.quantityOnHand) || 0;
          const newQty =
            adjustType === 'STOCK_IN'
              ? prevQty + qty
              : Math.max(0, prevQty - qty);
          return { ...item, quantityOnHand: newQty };
        }
        return item;
      })
    );

    closeAdjustModal();
  };

  // Filter items
  const filteredList = inventoryList.filter((item) => {
    const prodName = (item.productName || '').toLowerCase();
    const sku = (item.sku || item.productSku || '').toLowerCase();
    const location = (item.location || '').toLowerCase();
    const search = (searchQuery || '').toLowerCase();

    const matchesSearch =
      prodName.includes(search) || sku.includes(search) || location.includes(search);

    const statusObj = getStockStatus(item);
    const matchesStatus =
      statusFilter === 'ALL' || statusObj.key === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalItems = inventoryList.length;
  const totalStockQty = inventoryList.reduce(
    (sum, item) => sum + (Number(item.quantityOnHand) || 0),
    0
  );
  const lowStockCount = inventoryList.filter((item) => {
    const onHand = Number(item.quantityOnHand) || 0;
    const reorder = Number(item.reorderLevel) || 0;
    return onHand <= reorder;
  }).length;

  return (
    <div className="inv-container">
      {/* 1. Page Header */}
      <div className="inv-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2>Inventory Management</h2>
            <span className={`inv-connection-badge ${isLiveBackend ? 'live' : 'demo'}`}>
              {isLiveBackend ? '● Live Backend' : '● Demo State'}
            </span>
          </div>
          <p>Track warehouse stock levels, batch locations, and automated reorder alerts.</p>
        </div>
        <button
          type="button"
          className="inv-btn-refresh"
          onClick={() => fetchInventory(true)}
          disabled={isLoading}
        >
          {isLoading ? '⟳ Refreshing...' : '⟳ Refresh'}
        </button>
      </div>

      {toastMessage && <div className="inv-api-alert">{toastMessage}</div>}

      {/* 2. Summary KPI Cards */}
      <div className="inv-stats-grid">
        <div className="inv-stat-card">
          <span className="inv-stat-label">Total Products</span>
          <strong className="inv-stat-value">{totalItems}</strong>
        </div>
        <div className="inv-stat-card">
          <span className="inv-stat-label">Total Units on Hand</span>
          <strong className="inv-stat-value inv-stat-info">{totalStockQty}</strong>
        </div>
        <div className="inv-stat-card">
          <span className="inv-stat-label">Low / Out of Stock Alerts</span>
          <strong className="inv-stat-value inv-stat-danger">{lowStockCount}</strong>
        </div>
      </div>

      {/* 3. Toolbar: Search & Filter */}
      <div className="inv-toolbar">
        <input
          type="text"
          className="inv-search-input"
          placeholder="Search by product name, SKU, or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select
          className="inv-filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="ALL">All Stock Statuses</option>
          <option value="IN_STOCK">In Stock</option>
          <option value="LOW_STOCK">Low Stock</option>
          <option value="OUT_OF_STOCK">Out of Stock</option>
        </select>
      </div>

      {/* 4. Inventory Table */}
      <div className="inv-table-wrapper">
        <table className="inv-table">
          <thead>
            <tr>
              <th>Product & SKU</th>
              <th>Location</th>
              <th>Batch #</th>
              <th>On Hand</th>
              <th>Reserved</th>
              <th>Reorder Level</th>
              <th>Status</th>
              <th>Stock Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                  No inventory products found matching your filter.
                </td>
              </tr>
            ) : (
              filteredList.map((item) => {
                const status = getStockStatus(item);
                const onHand = Number(item.quantityOnHand) || 0;
                return (
                  <tr key={item.id}>
                    <td>
                      <div className="inv-prod-name">{item.productName || 'Product #' + item.id}</div>
                      <div className="inv-prod-sku">{item.sku || item.productSku || 'SKU-N/A'}</div>
                    </td>
                    <td className="inv-location">{item.location || 'General Storage'}</td>
                    <td>{item.batchNumber || '-'}</td>
                    <td className="inv-qty-strong">{onHand}</td>
                    <td>{item.reservedQuantity ?? 0}</td>
                    <td>{item.reorderLevel ?? 10}</td>
                    <td>
                      <span className={`inv-badge ${status.className}`}>
                        {status.label}
                      </span>
                    </td>
                    <td>
                      <div className="inv-action-btns">
                        <button
                          type="button"
                          className="inv-btn-in"
                          onClick={() => openAdjustModal(item, 'STOCK_IN')}
                          title="Add incoming shipment"
                        >
                          + Stock In
                        </button>
                        <button
                          type="button"
                          className="inv-btn-out"
                          onClick={() => openAdjustModal(item, 'STOCK_OUT')}
                          disabled={onHand <= 0}
                          title="Dispatch / deduct units"
                        >
                          - Stock Out
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 5. Stock Adjustment Modal */}
      {adjustModalItem && (
        <div className="inv-modal-overlay">
          <div className="inv-modal">
            <div className="inv-modal-header">
              <h3>
                {adjustType === 'STOCK_IN' ? '+ Receive Stock' : '- Dispatch Stock'}
              </h3>
              <button
                type="button"
                className="inv-modal-close"
                onClick={closeAdjustModal}
              >
                ×
              </button>
            </div>

            <div className="inv-modal-meta">
              <span className="inv-meta-name">
                {adjustModalItem.productName || 'Product #' + adjustModalItem.id}
              </span>
              <span className="inv-meta-current">
                Current Stock: <strong>{adjustModalItem.quantityOnHand ?? 0}</strong> units
              </span>
            </div>

            <form onSubmit={handleAdjustSubmit} className="inv-form">
              {adjustError && <div className="inv-form-error">{adjustError}</div>}

              <div className="inv-form-group">
                <label htmlFor="adjustQty">
                  Quantity to {adjustType === 'STOCK_IN' ? 'Receive' : 'Dispatch'} *
                </label>
                <input
                  id="adjustQty"
                  type="number"
                  min="1"
                  placeholder="e.g. 25"
                  value={adjustQty}
                  onChange={(e) => setAdjustQty(e.target.value)}
                  required
                />
              </div>

              <div className="inv-form-group">
                <label htmlFor="adjustNotes">Notes / Reference (Optional)</label>
                <input
                  id="adjustNotes"
                  type="text"
                  placeholder="e.g. GRN-2026-8891 / Warehouse dispatch"
                  value={adjustNotes}
                  onChange={(e) => setAdjustNotes(e.target.value)}
                />
              </div>

              <div className="inv-modal-actions">
                <button
                  type="button"
                  className="inv-btn-secondary"
                  onClick={closeAdjustModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={
                    adjustType === 'STOCK_IN' ? 'inv-btn-primary' : 'inv-btn-danger'
                  }
                >
                  Confirm {adjustType === 'STOCK_IN' ? 'Stock In' : 'Stock Out'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Inventory;
