import React, { useState, useEffect } from 'react';
import '../Styles/Purchaseorder.css';

const API_BASE_URL = '/api/purchase-orders';

function Purchaseorder() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [items, setItems] = useState([
    { itemDescription: '', quantity: 1, unitPrice: 0 },
  ]);
  const [formData, setFormData] = useState({
    orderNumber: '',
    vendorCompanyName: '',
    orderDate: '',
  });

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setApiError('');
      const response = await fetch(API_BASE_URL);
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      const result = await response.json();
      // Spring Boot returns ApiResponse with data as Page<PurchaseOrderResponse>
      const orderList = result?.data?.content || result?.data || [];
      setOrders(orderList);
    } catch (err) {
      console.warn('Backend API offline or unreachable, using local state:', err.message);
      setApiError('Backend API offline (http://localhost:8080). Displaying local data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index, field, value) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      )
    );
  };

  const handleAddItem = () => {
    setItems((prev) => [...prev, { itemDescription: '', quantity: 1, unitPrice: 0 }]);
  };

  const handleRemoveItem = (index) => {
    if (items.length === 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const calculatedTotal = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
    0
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    const newOrder = {
      id: Date.now(),
      orderNumber: formData.orderNumber,
      vendorCompanyName: formData.vendorCompanyName,
      orderDate: formData.orderDate,
      grandTotal: calculatedTotal,
      items: items,
      status: 'PENDING_APPROVAL',
    };

    setOrders((prev) => [newOrder, ...prev]);
    setFormData({ orderNumber: '', vendorCompanyName: '', orderDate: '' });
    setItems([{ itemDescription: '', quantity: 1, unitPrice: 0 }]);
    setIsModalOpen(false);
  };

  const handleStatusChange = (id, newStatus) => {
    setOrders((prev) =>
      prev.map((po) => (po.id === id ? { ...po, status: newStatus } : po))
    );
  };

  const handleDelete = (id) => {
    setOrders((prev) => prev.filter((po) => po.id !== id));
  };

  const filteredOrders = orders.filter((po) => {
    const matchesSearch =
      po.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.vendorCompanyName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' || po.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="po-container">
      {/* 1. Page Header */}
      <div className="po-header">
        <div>
          <h2>Purchase Orders</h2>
          <p>Manage your vendor purchase orders.</p>
        </div>
        <button
          className="po-btn-primary"
          type="button"
          onClick={() => setIsModalOpen(true)}
        >
          + Create Purchase Order
        </button>
      </div>

      {/* 2. Search & Filter Bar */}
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
          onClick={fetchOrders}
          disabled={isLoading}
          title="Refresh orders from backend"
        >
          {isLoading ? '⟳ Refreshing...' : '⟳ Refresh'}
        </button>
      </div>

      {apiError && <div className="po-api-alert">{apiError}</div>}

      {/* 3. Orders Table */}
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
                Loading purchase orders from server...
              </td>
            </tr>
          ) : filteredOrders.length === 0 ? (
            <tr>
              <td colSpan="6" className="po-empty">
                No purchase orders found.
              </td>
            </tr>
          ) : (
            filteredOrders.map((po) => (
              <tr key={po.id}>
                <td className="po-order-num">{po.orderNumber}</td>
                <td>{po.vendorCompanyName}</td>
                <td>{po.orderDate}</td>
                <td>₹{(po.grandTotal || 0).toLocaleString('en-IN')}</td>
                <td>{po.status.replace(/_/g, ' ')}</td>
                <td className="po-actions">
                  <select
                    className="po-status-select"
                    value={po.status}
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
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 3. Create PO Modal */}
      {isModalOpen && (
        <div className="po-modal-overlay">
          <div className="po-modal">
            <h3>Create Purchase Order</h3>
            <form onSubmit={handleSubmit} className="po-form">
              <input
                type="text"
                name="orderNumber"
                placeholder="PO Number (e.g. PO-2026-001)"
                value={formData.orderNumber}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="vendorCompanyName"
                placeholder="Vendor Name"
                value={formData.vendorCompanyName}
                onChange={handleChange}
                required
              />
              <input
                type="date"
                name="orderDate"
                value={formData.orderDate}
                onChange={handleChange}
                required
              />

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
                      placeholder="Price"
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
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}

                <div className="po-calculated-total">
                  <span>Grand Total:</span>
                  <strong>₹{calculatedTotal.toLocaleString('en-IN')}</strong>
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
