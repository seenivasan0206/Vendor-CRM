import { useState, useEffect, useCallback } from 'react';
import {
  CreditCard,
  DollarSign,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  Plus,
  X,
  Search,
  Filter,
  FileText
} from 'lucide-react';
import '../Styles/Payment.css';
import { authService } from '../services/authService';

const INVOICE_API_BASE = 'http://localhost:8080/api/invoices';
const PAYMENT_API_BASE = 'http://localhost:8080/api/payments';
const VENDOR_API_BASE = 'http://localhost:8080/api/vendors';

const SAMPLE_INVOICES = [
  {
    id: 1,
    invoiceNumber: 'INV-2026-0001',
    vendorId: 1,
    vendorCompanyName: 'Acme Industrial Supplies',
    vendorCode: 'VEN-001',
    purchaseOrderId: 1,
    purchaseOrderNumber: 'PO-2026-001',
    invoiceDate: '2026-11-01',
    dueDate: '2026-12-01',
    subtotal: 1500.0,
    taxAmount: 270.0,
    totalAmount: 1770.0,
    paidAmount: 500.0,
    remainingBalance: 1270.0,
    status: 'PARTIALLY_PAID',
    paymentTerms: 'Net 30',
    notes: 'Initial batch delivery for heavy components',
  },
  {
    id: 2,
    invoiceNumber: 'INV-2026-0002',
    vendorId: 2,
    vendorCompanyName: 'Apex Cloud Solutions',
    vendorCode: 'VEN-002',
    purchaseOrderId: 2,
    purchaseOrderNumber: 'PO-2026-002',
    invoiceDate: '2026-11-05',
    dueDate: '2026-11-20',
    subtotal: 2400.0,
    taxAmount: 432.0,
    totalAmount: 2832.0,
    paidAmount: 0.0,
    remainingBalance: 2832.0,
    status: 'APPROVED',
    paymentTerms: 'Net 15',
    notes: 'Cloud networking routers and firewall setup',
  },
  {
    id: 3,
    invoiceNumber: 'INV-2026-0003',
    vendorId: 3,
    vendorCompanyName: 'Global Logistics Corp',
    vendorCode: 'VEN-003',
    purchaseOrderId: 3,
    purchaseOrderNumber: 'PO-2026-003',
    invoiceDate: '2026-10-15',
    dueDate: '2026-11-15',
    subtotal: 855.0,
    taxAmount: 153.9,
    totalAmount: 1008.9,
    paidAmount: 1008.9,
    remainingBalance: 0.0,
    status: 'PAID',
    paymentTerms: 'Net 30',
    notes: 'Hydraulic pallet jacks delivery',
  },
];

function Payment() {
  const [invoices, setInvoices] = useState(SAMPLE_INVOICES);
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLiveBackend, setIsLiveBackend] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [toastMessage, setToastMessage] = useState(null);

  // Pay Modal State
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState('');
  const [payMethod, setPayMethod] = useState('BANK_TRANSFER');
  const [payDate, setPayDate] = useState(new Date().toISOString().split('T')[0]);
  const [payTxnRef, setPayTxnRef] = useState('');
  const [payNotes, setPayNotes] = useState('');
  const [payError, setPayError] = useState('');
  const [isSubmittingPay, setIsSubmittingPay] = useState(false);

  // Create Invoice Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    invoiceNumber: '',
    vendorId: '',
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    paymentTerms: 'Net 30',
    notes: '',
    status: 'APPROVED',
    itemDescription: 'Supplies & Equipment',
    quantity: 1,
    unitPrice: 1000,
    taxRate: 18,
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchInvoices = useCallback(async (isManual = false) => {
    try {
      setIsLoading(true);
      const headers = authService.getAuthHeaders();
      const res = await fetch(`${INVOICE_API_BASE}?size=50`, { headers });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const body = await res.json();
      const list = body?.data?.content || body?.data || [];

      if (Array.isArray(list) && list.length > 0) {
        setInvoices(list);
        setIsLiveBackend(true);
        if (isManual) showToast('Invoices synced with live database.');
      } else {
        setInvoices(SAMPLE_INVOICES);
        setIsLiveBackend(true);
        if (isManual) showToast('Live backend connected (no invoices found, showing defaults).');
      }
    } catch (err) {
      console.warn('Invoices API offline or unreachable:', err.message);
      setIsLiveBackend(false);
      if (isManual) showToast('Backend API unreachable. Running in offline fallback mode.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchVendors = useCallback(async () => {
    try {
      const headers = authService.getAuthHeaders();
      const res = await fetch(`${VENDOR_API_BASE}?size=100`, { headers });
      if (res.ok) {
        const body = await res.json();
        const vList = body?.data?.content || body?.data || [];
        if (Array.isArray(vList) && vList.length > 0) {
          setVendors(vList);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchInvoices(false);
    fetchVendors();
  }, [fetchInvoices, fetchVendors]);

  // Calculations for KPI Cards
  const totalInvoiced = invoices.reduce((sum, inv) => sum + (Number(inv.totalAmount) || 0), 0);
  const totalPaid = invoices.reduce((sum, inv) => sum + (Number(inv.paidAmount) || 0), 0);
  const totalOutstanding = invoices.reduce((sum, inv) => sum + (Number(inv.remainingBalance) || 0), 0);
  const pendingCount = invoices.filter(
    (inv) => inv.status !== 'PAID' && (Number(inv.remainingBalance) || 0) > 0
  ).length;

  const formatCurrency = (val) => {
    const num = Number(val) || 0;
    return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const getStatusBadge = (status) => {
    const s = (status || '').toUpperCase();
    if (s === 'PAID') {
      return <span className="pay-badge pay-badge-paid">PAID</span>;
    }
    if (s === 'PARTIALLY_PAID') {
      return <span className="pay-badge pay-badge-partially_paid">PARTIAL</span>;
    }
    if (s === 'APPROVED') {
      return <span className="pay-badge pay-badge-approved">APPROVED</span>;
    }
    return <span className="pay-badge" style={{ backgroundColor: 'rgba(148, 163, 184, 0.2)', color: '#94a3b8' }}>{s}</span>;
  };

  // Open Payment Modal
  const handleOpenPayModal = (inv) => {
    setSelectedInvoice(inv);
    const balance = Number(inv.remainingBalance) || 0;
    setPayAmount(balance > 0 ? balance.toFixed(2) : '');
    setPayMethod('BANK_TRANSFER');
    setPayDate(new Date().toISOString().split('T')[0]);
    setPayTxnRef(`TXN-${Date.now().toString().slice(-6)}`);
    setPayNotes('');
    setPayError('');
    setIsPayModalOpen(true);
  };

  // Submit Payment
  const handleRecordPayment = async (e) => {
    e.preventDefault();
    if (!selectedInvoice) return;

    const amountNum = parseFloat(payAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setPayError('Please enter a valid payment amount greater than 0.');
      return;
    }

    const currentBalance = Number(selectedInvoice.remainingBalance) || Number(selectedInvoice.totalAmount) || 0;
    if (amountNum > currentBalance + 0.01) {
      setPayError(`Payment amount cannot exceed remaining balance of ${formatCurrency(currentBalance)}.`);
      return;
    }

    try {
      setIsSubmittingPay(true);
      setPayError('');

      const paymentReference = `PAY-${Date.now().toString().slice(-6)}`;
      const payload = {
        paymentReference,
        invoiceId: selectedInvoice.id,
        amount: amountNum,
        paymentDate: payDate,
        paymentMethod: payMethod,
        transactionReference: payTxnRef,
        notes: payNotes || 'Payment disbursed via CRM portal',
      };

      const headers = authService.getAuthHeaders();
      const res = await fetch(PAYMENT_API_BASE, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(`Payment ${paymentReference} of ${formatCurrency(amountNum)} recorded successfully!`);
        setIsPayModalOpen(false);
        fetchInvoices(false);
      } else {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || `HTTP ${res.status}`);
      }
    } catch (err) {
      console.warn('Failed to record payment on backend, updating local state:', err.message);
      // Fallback local update
      setInvoices((prev) =>
        prev.map((inv) => {
          if (inv.id === selectedInvoice.id) {
            const newPaid = (Number(inv.paidAmount) || 0) + amountNum;
            const newBalance = Math.max(0, (Number(inv.totalAmount) || 0) - newPaid);
            return {
              ...inv,
              paidAmount: newPaid,
              remainingBalance: newBalance,
              status: newBalance <= 0 ? 'PAID' : 'PARTIALLY_PAID',
            };
          }
          return inv;
        })
      );
      showToast(`Payment of ${formatCurrency(amountNum)} recorded locally.`);
      setIsPayModalOpen(false);
    } finally {
      setIsSubmittingPay(false);
    }
  };

  // Open Create Invoice Modal
  const handleOpenCreateModal = () => {
    const nextInv = `INV-2026-${String(invoices.length + 1).padStart(4, '0')}`;
    const firstVendorId = vendors[0]?.id || (invoices[0]?.vendorId || 1);
    const due = new Date();
    due.setDate(due.getDate() + 30);

    setCreateFormData({
      invoiceNumber: nextInv,
      vendorId: String(firstVendorId),
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: due.toISOString().split('T')[0],
      paymentTerms: 'Net 30',
      notes: 'New supplier billing record',
      status: 'APPROVED',
      itemDescription: 'Procurement items and materials',
      quantity: 1,
      unitPrice: 1500,
      taxRate: 18,
    });
    setIsCreateModalOpen(true);
  };

  // Submit Create Invoice
  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    const qty = Number(createFormData.quantity) || 1;
    const price = Number(createFormData.unitPrice) || 0;
    const taxR = Number(createFormData.taxRate) || 0;
    const sub = qty * price;
    const tax = (sub * taxR) / 100;
    const total = sub + tax;

    const selectedVendor = vendors.find((v) => String(v.id) === String(createFormData.vendorId));
    const vendorName = selectedVendor ? selectedVendor.companyName : 'Acme Industrial Supplies';

    const payload = {
      invoiceNumber: createFormData.invoiceNumber.trim(),
      vendorId: Number(createFormData.vendorId),
      invoiceDate: createFormData.invoiceDate,
      dueDate: createFormData.dueDate,
      paymentTerms: createFormData.paymentTerms,
      notes: createFormData.notes,
      status: createFormData.status,
      items: [
        {
          productId: 1,
          description: createFormData.itemDescription,
          quantity: qty,
          unitPrice: price,
          taxRate: taxR,
          totalPrice: total,
        },
      ],
    };

    try {
      const headers = authService.getAuthHeaders();
      const res = await fetch(INVOICE_API_BASE, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(`Invoice ${createFormData.invoiceNumber} created successfully!`);
        setIsCreateModalOpen(false);
        fetchInvoices(false);
        return;
      }
      throw new Error(`HTTP ${res.status}`);
    } catch {
      // Local fallback
      const newInv = {
        id: Date.now(),
        invoiceNumber: createFormData.invoiceNumber,
        vendorId: Number(createFormData.vendorId),
        vendorCompanyName: vendorName,
        invoiceDate: createFormData.invoiceDate,
        dueDate: createFormData.dueDate,
        subtotal: sub,
        taxAmount: tax,
        totalAmount: total,
        paidAmount: 0,
        remainingBalance: total,
        status: createFormData.status,
        paymentTerms: createFormData.paymentTerms,
        notes: createFormData.notes,
      };
      setInvoices((prev) => [newInv, ...prev]);
      showToast(`Invoice ${createFormData.invoiceNumber} created locally.`);
      setIsCreateModalOpen(false);
    }
  };

  // Filtered invoices
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      (inv.invoiceNumber || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (inv.vendorCompanyName || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === 'ALL' || (inv.status || '').toUpperCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="pay-container">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '24px',
            backgroundColor: '#07172B',
            border: '1px solid #6366F1',
            color: '#E2E8F0',
            padding: '12px 20px',
            borderRadius: '10px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.9rem',
          }}
        >
          <CheckCircle size={18} color="#34d399" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="pay-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2>Invoices & Payment Records</h2>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.72rem',
                fontWeight: 600,
                padding: '3px 8px',
                borderRadius: '9999px',
                backgroundColor: isLiveBackend ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                color: isLiveBackend ? '#34d399' : '#fbbf24',
                border: isLiveBackend ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(245, 158, 11, 0.3)',
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: isLiveBackend ? '#34d399' : '#fbbf24',
                }}
              />
              {isLiveBackend ? 'Live Backend Connected' : 'Demo Fallback'}
            </span>
          </div>
          <p>Track vendor bills, disburse payments, and reconcile accounts in real time.</p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            type="button"
            className="pay-btn-secondary"
            onClick={() => fetchInvoices(true)}
            disabled={isLoading}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            <span>{isLoading ? 'Syncing...' : 'Sync'}</span>
          </button>
          <button
            type="button"
            className="pay-btn-primary"
            onClick={handleOpenCreateModal}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={15} />
            <span>Create Invoice</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="pay-stats-grid">
        <div className="pay-stat-card">
          <span className="pay-stat-label">Total Billed</span>
          <strong className="pay-stat-value">{formatCurrency(totalInvoiced)}</strong>
        </div>
        <div className="pay-stat-card">
          <span className="pay-stat-label">Disbursed / Settled</span>
          <strong className="pay-stat-value pay-stat-success">{formatCurrency(totalPaid)}</strong>
        </div>
        <div className="pay-stat-card">
          <span className="pay-stat-label">Outstanding Balance</span>
          <strong className="pay-stat-value pay-stat-warning">{formatCurrency(totalOutstanding)}</strong>
        </div>
        <div className="pay-stat-card">
          <span className="pay-stat-label">Active / Pending Invoices</span>
          <strong className="pay-stat-value">{pendingCount}</strong>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px',
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#051329',
            border: '1px solid rgba(99, 102, 241, 0.22)',
            borderRadius: '8px',
            padding: '6px 12px',
            gap: '8px',
            flex: '1',
            minWidth: '220px',
            maxWidth: '420px',
          }}
        >
          <Search size={16} color="#94a3b8" />
          <input
            type="text"
            placeholder="Search by invoice # or vendor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#E2E8F0',
              fontSize: '0.88rem',
              width: '100%',
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={15} color="#94a3b8" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              backgroundColor: '#051329',
              border: '1px solid rgba(99, 102, 241, 0.22)',
              borderRadius: '8px',
              padding: '7px 12px',
              color: '#E2E8F0',
              fontSize: '0.85rem',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="ALL">All Statuses</option>
            <option value="APPROVED">Approved</option>
            <option value="PARTIALLY_PAID">Partially Paid</option>
            <option value="PAID">Paid</option>
            <option value="DRAFT">Draft</option>
          </select>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="pay-table-wrapper">
        <table className="pay-table">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Vendor</th>
              <th>Due Date</th>
              <th>Total Billed</th>
              <th>Paid Amount</th>
              <th>Balance Due</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.length === 0 ? (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                  No matching invoices found.
                </td>
              </tr>
            ) : (
              filteredInvoices.map((inv) => {
                const balance = Number(inv.remainingBalance) || 0;
                const isCleared = balance <= 0 || (inv.status || '').toUpperCase() === 'PAID';

                return (
                  <tr key={inv.id}>
                    <td className="pay-inv-num">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FileText size={14} color="#6366F1" />
                        <span>{inv.invoiceNumber}</span>
                      </div>
                    </td>
                    <td>
                      <div className="pay-vendor-name">{inv.vendorCompanyName || 'Supplier Ltd'}</div>
                      <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                        {inv.purchaseOrderNumber ? `PO: ${inv.purchaseOrderNumber}` : inv.vendorCode || ''}
                      </div>
                    </td>
                    <td>
                      <span className={balance > 0 ? 'pay-due-alert' : 'pay-due-settled'}>
                        {inv.dueDate || '30 Days'}
                      </span>
                    </td>
                    <td>
                      <strong>{formatCurrency(inv.totalAmount)}</strong>
                    </td>
                    <td style={{ color: '#34d399' }}>{formatCurrency(inv.paidAmount)}</td>
                    <td>
                      <span style={{ fontWeight: balance > 0 ? 700 : 400, color: balance > 0 ? '#fbbf24' : '#94a3b8' }}>
                        {formatCurrency(balance)}
                      </span>
                    </td>
                    <td>{getStatusBadge(inv.status)}</td>
                    <td style={{ textAlign: 'right' }}>
                      {isCleared ? (
                        <span className="pay-cleared-text" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle size={14} />
                          <span>Cleared</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          className="pay-btn-record"
                          onClick={() => handleOpenPayModal(inv)}
                        >
                          Record Payment
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Record Payment Modal */}
      {isPayModalOpen && selectedInvoice && (
        <div className="pay-modal-overlay">
          <div className="pay-modal">
            <div className="pay-modal-header">
              <h3>Record Payment Disbursement</h3>
              <button
                type="button"
                className="pay-modal-close"
                onClick={() => setIsPayModalOpen(false)}
              >
                &times;
              </button>
            </div>

            <div className="pay-modal-meta">
              <div>
                <strong>Invoice:</strong> {selectedInvoice.invoiceNumber} ({selectedInvoice.vendorCompanyName})
              </div>
              <div className="pay-modal-balance-row">
                <span>Remaining Balance:</span>
                <strong>{formatCurrency(selectedInvoice.remainingBalance)}</strong>
              </div>
            </div>

            <form onSubmit={handleRecordPayment} className="pay-form">
              {payError && <div className="pay-form-error">{payError}</div>}

              <div className="pay-form-group">
                <label>Payment Amount ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={selectedInvoice.remainingBalance}
                  value={payAmount}
                  onChange={(e) => setPayAmount(e.target.value)}
                  required
                />
              </div>

              <div className="pay-form-group">
                <label>Payment Method *</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value)}
                  required
                >
                  <option value="BANK_TRANSFER">Bank Wire Transfer (NEFT/RTGS/ACH)</option>
                  <option value="CREDIT_CARD">Corporate Credit Card</option>
                  <option value="CHECK">Check Disbursement</option>
                  <option value="ACH">Direct ACH Debit</option>
                  <option value="CASH">Cash / Petty Cash</option>
                </select>
              </div>

              <div className="pay-form-group">
                <label>Payment Date *</label>
                <input
                  type="date"
                  value={payDate}
                  onChange={(e) => setPayDate(e.target.value)}
                  required
                />
              </div>

              <div className="pay-form-group">
                <label>Transaction / Reference Number</label>
                <input
                  type="text"
                  placeholder="e.g. TXN-991823"
                  value={payTxnRef}
                  onChange={(e) => setPayTxnRef(e.target.value)}
                />
              </div>

              <div className="pay-form-group">
                <label>Disbursement Notes</label>
                <input
                  type="text"
                  placeholder="Optional internal remarks"
                  value={payNotes}
                  onChange={(e) => setPayNotes(e.target.value)}
                />
              </div>

              <div className="pay-modal-actions">
                <button
                  type="button"
                  className="pay-btn-secondary"
                  onClick={() => setIsPayModalOpen(false)}
                  disabled={isSubmittingPay}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="pay-btn-primary"
                  disabled={isSubmittingPay}
                >
                  {isSubmittingPay ? 'Processing...' : 'Confirm Payment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Invoice Modal */}
      {isCreateModalOpen && (
        <div className="pay-modal-overlay">
          <div className="pay-modal" style={{ maxWidth: '520px' }}>
            <div className="pay-modal-header">
              <h3>Create Supplier Invoice</h3>
              <button
                type="button"
                className="pay-modal-close"
                onClick={() => setIsCreateModalOpen(false)}
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="pay-form">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="pay-form-group">
                  <label>Invoice Number *</label>
                  <input
                    type="text"
                    value={createFormData.invoiceNumber}
                    onChange={(e) => setCreateFormData({ ...createFormData, invoiceNumber: e.target.value })}
                    required
                  />
                </div>

                <div className="pay-form-group">
                  <label>Vendor *</label>
                  <select
                    value={createFormData.vendorId}
                    onChange={(e) => setCreateFormData({ ...createFormData, vendorId: e.target.value })}
                    required
                  >
                    {vendors.length > 0 ? (
                      vendors.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.companyName}
                        </option>
                      ))
                    ) : (
                      <option value="1">Acme Industrial Supplies</option>
                    )}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="pay-form-group">
                  <label>Invoice Date *</label>
                  <input
                    type="date"
                    value={createFormData.invoiceDate}
                    onChange={(e) => setCreateFormData({ ...createFormData, invoiceDate: e.target.value })}
                    required
                  />
                </div>

                <div className="pay-form-group">
                  <label>Due Date *</label>
                  <input
                    type="date"
                    value={createFormData.dueDate}
                    onChange={(e) => setCreateFormData({ ...createFormData, dueDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="pay-form-group">
                <label>Item Description *</label>
                <input
                  type="text"
                  value={createFormData.itemDescription}
                  onChange={(e) => setCreateFormData({ ...createFormData, itemDescription: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div className="pay-form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={createFormData.quantity}
                    onChange={(e) => setCreateFormData({ ...createFormData, quantity: e.target.value })}
                    required
                  />
                </div>

                <div className="pay-form-group">
                  <label>Unit Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={createFormData.unitPrice}
                    onChange={(e) => setCreateFormData({ ...createFormData, unitPrice: e.target.value })}
                    required
                  />
                </div>

                <div className="pay-form-group">
                  <label>Tax Rate (%)</label>
                  <input
                    type="number"
                    value={createFormData.taxRate}
                    onChange={(e) => setCreateFormData({ ...createFormData, taxRate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="pay-modal-actions">
                <button
                  type="button"
                  className="pay-btn-secondary"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="pay-btn-primary">
                  Save Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Payment;
