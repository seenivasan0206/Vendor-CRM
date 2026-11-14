import React, { useState, useEffect } from 'react';
import '../Styles/Inventory.css';

const API_BASE_URL = 'http://localhost:8080/api/inventory';

const SAMPLE_INVENTORY = [
  {
    id: 1,
    productName: 'Industrial IoT Temperature Sensor',
    sku: 'PRD-IOT-101',
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
    location: 'Warehouse 1 - Rack B1 - Shelf 2',
    quantityOnHand: 0,
    reservedQuantity: 0,
    reorderLevel: 10,
    maxLevel: 100,
    batchNumber: 'BATCH-2026-004',
  },
];

function getStockStatus(item) {
  if (item.quantityOnHand <= 0) {
    return { label: 'OUT OF STOCK', className: 'inv-badge-out' };
  }
  if (item.quantityOnHand <= item.reorderLevel) {
    return { label: 'LOW STOCK', className: 'inv-badge-low' };
  }
  return { label: 'IN STOCK', className: 'inv-badge-in' };
}

function Inventory() {
  const [inventoryList, setInventoryList] = useState(SAMPLE_INVENTORY);
  const [isLoading, setIsLoading] = useState(false);
  const [apiAlert, setApiAlert] = useState('');
  const [adjustModalItem, setAdjustModalItem] = useState(null);
  const [adjustType, setAdjustType] = useState('STOCK_IN');
  const [adjustQty, setAdjustQty] = useState('');
  const [adjustNotes, setAdjustNotes] = useState('');
  const [adjustError, setAdjustError] = useState('');

  const fetchInventory = async () => {
    try {
      setIsLoading(true);
      setApiAlert('');
      const res = await fetch(API_BASE_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const list = data?.data?.content || data?.data || [];
      if (list.length > 0) {
        setInventoryList(list);
      }
    } catch (err) {
      console.warn('Backend API offline, using local inventory state:', err.message);
      setApiAlert('Backend API offline (http://localhost:8080). Displaying local data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

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

    if (adjustType === 'STOCK_OUT' && qty > adjustModalItem.quantityOnHand) {
      setAdjustError(
        `Cannot dispatch ${qty} units. Only ${adjustModalItem.quantityOnHand} available on hand!`
      );
      return;
    }

    try {
      // Attempt backend API call: POST /api/inventory/{id}/adjust
      await fetch(`${API_BASE_URL}/${adjustModalItem.id}/adjust`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: adjustType,
          quantity: qty,
          referenceNumber: adjustNotes || 'WEB-MANUAL',
          notes: adjustNotes || 'Manual stock adjustment from UI',
        }),
      });
    } catch (err) {
      console.warn('Backend API call failed, adjusting locally:', err.message);
    }

    // Always update React state smoothly
    setInventoryList((prev) =>
      prev.map((item) => {
        if (item.id === adjustModalItem.id) {
          const newQty =
            adjustType === 'STOCK_IN'
              ? item.quantityOnHand + qty
              : item.quantityOnHand - qty;
          return { ...item, quantityOnHand: newQty };
        }
        return item;
      })
    );

    closeAdjustModal();
  };

  const totalItems = inventoryList.length;
  const totalStockQty = inventoryList.reduce((sum, item) => sum + item.quantityOnHand, 0);
  const lowStockCount = inventoryList.filter(
    (item) => item.quantityOnHand <= item.reorderLevel
  ).length;

  return (
    <div className="inv-container">
      {/* 1. Page Header */}
      <div className="inv-header">
        <div>
          <h2>Inventory Management</h2>
          <p>Track warehouse stock levels, locations, and reorder alerts.</p>
        </div>
        <button
          type="button"
          className="inv-btn-refresh"
          onClick={fetchInventory}
          disabled={isLoading}
        >
          {isLoading ? '⟳ Refreshing...' : '⟳ Refresh'}
        </button>
      </div>

      {apiAlert && <div className="inv-api-alert">{apiAlert}</div>}

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

      {/* 3. Inventory Table */}
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
            {inventoryList.map((item) => {
              const status = getStockStatus(item);
              return (
                <tr key={item.id}>
                  <td>
                    <div className="inv-prod-name">{item.productName}</div>
                    <div className="inv-prod-sku">{item.sku}</div>
                  </td>
                  <td className="inv-location">{item.location}</td>
                  <td>{item.batchNumber}</td>
                  <td className="inv-qty-strong">{item.quantityOnHand}</td>
                  <td>{item.reservedQuantity}</td>
                  <td>{item.reorderLevel}</td>
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
                        disabled={item.quantityOnHand <= 0}
                        title="Dispatch / deduct units"
                      >
                        - Stock Out
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 4. Stock Adjustment Modal */}
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
              <span className="inv-meta-name">{adjustModalItem.productName}</span>
              <span className="inv-meta-current">
                Current Stock: <strong>{adjustModalItem.quantityOnHand}</strong> units
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
                  placeholder="e.g. GRN-2026-8891 / Project deployment"
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

