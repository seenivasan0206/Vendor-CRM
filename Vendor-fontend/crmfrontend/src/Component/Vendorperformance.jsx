import { useState, useEffect, useCallback } from 'react';
import { Star, Plus, X, RefreshCw, CheckCircle, Trash2, RotateCw } from 'lucide-react';
import '../Styles/Vendorperformance.css';
import { authService } from '../services/authService';

const PERF_API_BASE = 'http://localhost:8080/api/vendor-performance';
const VENDOR_API_BASE = 'http://localhost:8080/api/vendors';

const SAMPLE_REVIEWS = [
  {
    id: 1,
    vendorId: 1,
    vendorCompanyName: 'Acme Industrial Supplies',
    vendorCode: 'VEN-001',
    reviewPeriod: 'Q4 2026',
    reviewDate: '2026-11-15',
    qualityScore: 4.8,
    deliveryScore: 4.6,
    pricingScore: 4.5,
    communicationScore: 4.7,
    complianceScore: 4.9,
    overallScore: 4.7,
    comments: 'Outstanding turnaround speed on mechanical fasteners and heavy machinery.',
  },
  {
    id: 2,
    vendorId: 2,
    vendorCompanyName: 'Apex Cloud Solutions',
    vendorCode: 'VEN-002',
    reviewPeriod: 'Q3 2026',
    reviewDate: '2026-10-28',
    qualityScore: 4.9,
    deliveryScore: 4.8,
    pricingScore: 4.6,
    communicationScore: 4.9,
    complianceScore: 4.8,
    overallScore: 4.8,
    comments: 'High reliability on cloud firewall throughput and 24/7 technical support.',
  },
  {
    id: 3,
    vendorId: 3,
    vendorCompanyName: 'Global Logistics Corp',
    vendorCode: 'VEN-003',
    reviewPeriod: 'Q3 2026',
    reviewDate: '2026-09-15',
    qualityScore: 4.3,
    deliveryScore: 4.4,
    pricingScore: 4.2,
    communicationScore: 4.5,
    complianceScore: 4.6,
    overallScore: 4.4,
    comments: 'Dependable container shipping and warehouse material handling operations.',
  },
];

function getRatingBadge(score) {
  if (score >= 4.5) return { label: 'Top Tier (5.0)', className: 'perf-badge-top' };
  if (score >= 4.0) return { label: 'Good (4.0)', className: 'perf-badge-good' };
  if (score >= 3.0) return { label: 'Average (3.0)', className: 'perf-badge-avg' };
  return { label: 'Needs Improvement', className: 'perf-badge-poor' };
}

function Vendorperformance() {
  const [reviews, setReviews] = useState(SAMPLE_REVIEWS);
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLiveBackend, setIsLiveBackend] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    vendorId: '1',
    vendorCompanyName: 'Acme Industrial Supplies',
    vendorCode: 'VEN-001',
    reviewPeriod: 'Q4 2026',
    reviewDate: new Date().toISOString().split('T')[0],
    qualityScore: 4.5,
    deliveryScore: 4.5,
    pricingScore: 4.5,
    communicationScore: 4.5,
    complianceScore: 4.5,
    comments: '',
  });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const fetchReviews = useCallback(async (isManual = false) => {
    try {
      setIsLoading(true);
      const headers = authService.getAuthHeaders();
      const res = await fetch(`${PERF_API_BASE}?size=50`, { headers });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const body = await res.json();
      const list = body?.data?.content || body?.data || [];

      if (Array.isArray(list) && list.length > 0) {
        setReviews(list);
        setIsLiveBackend(true);
        if (isManual) showToast('Performance reviews synced with live database.');
      } else {
        setReviews(SAMPLE_REVIEWS);
        setIsLiveBackend(true);
        if (isManual) showToast('Live backend connected (no reviews found, showing defaults).');
      }
    } catch (err) {
      console.warn('Performance API offline or unreachable:', err.message);
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
        const list = body?.data?.content || body?.data || [];
        if (Array.isArray(list) && list.length > 0) {
          setVendors(list);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchReviews(false);
    fetchVendors();
  }, [fetchReviews, fetchVendors]);

  // Summary Metrics
  const totalReviews = reviews.length;
  const avgOverallScore = (
    reviews.reduce((sum, r) => sum + (Number(r.overallScore) || 0), 0) / (totalReviews || 1)
  ).toFixed(1);
  const topTierCount = reviews.filter((r) => (Number(r.overallScore) || 0) >= 4.5).length;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'vendorId') {
      const selected = vendors.find((v) => String(v.id) === String(value));
      setFormData((prev) => ({
        ...prev,
        vendorId: value,
        vendorCompanyName: selected ? selected.companyName : prev.vendorCompanyName,
        vendorCode: selected ? selected.vendorCode : prev.vendorCode,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleOpenModal = () => {
    const firstVendor = vendors[0] || { id: 1, companyName: 'Acme Industrial Supplies', vendorCode: 'VEN-001' };
    setFormData({
      vendorId: String(firstVendor.id),
      vendorCompanyName: firstVendor.companyName,
      vendorCode: firstVendor.vendorCode,
      reviewPeriod: 'Q4 2026',
      reviewDate: new Date().toISOString().split('T')[0],
      qualityScore: 4.5,
      deliveryScore: 4.5,
      pricingScore: 4.5,
      communicationScore: 4.5,
      complianceScore: 4.5,
      comments: '',
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const q = Number(formData.qualityScore);
    const d = Number(formData.deliveryScore);
    const p = Number(formData.pricingScore);
    const c = Number(formData.communicationScore);
    const comp = Number(formData.complianceScore);
    const overall = Number(((q + d + p + c + comp) / 5).toFixed(1));

    const payload = {
      vendorId: Number(formData.vendorId),
      reviewDate: formData.reviewDate,
      reviewPeriod: formData.reviewPeriod,
      qualityScore: q,
      deliveryScore: d,
      pricingScore: p,
      communicationScore: c,
      complianceScore: comp,
      comments: formData.comments.trim(),
    };

    try {
      setIsSubmitting(true);
      const headers = authService.getAuthHeaders();
      const res = await fetch(PERF_API_BASE, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast('Performance review recorded successfully in live database!');
        setIsModalOpen(false);
        fetchReviews(false);

        // Also sync vendor rating
        fetch(`${PERF_API_BASE}/vendor/${formData.vendorId}/sync-rating`, {
          method: 'POST',
          headers,
        }).catch(() => null);
        return;
      }
      throw new Error(`HTTP ${res.status}`);
    } catch {
      // Local fallback
      const newReview = {
        id: Date.now(),
        vendorId: Number(formData.vendorId),
        vendorCompanyName: formData.vendorCompanyName.trim(),
        vendorCode: formData.vendorCode.trim() || 'VEN-NEW',
        reviewPeriod: formData.reviewPeriod,
        reviewDate: formData.reviewDate,
        qualityScore: q,
        deliveryScore: d,
        pricingScore: p,
        communicationScore: c,
        complianceScore: comp,
        overallScore: overall,
        comments: formData.comments.trim(),
      };
      setReviews((prev) => [newReview, ...prev]);
      showToast('Performance review saved locally.');
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this performance review?')) return;
    try {
      const headers = authService.getAuthHeaders();
      const res = await fetch(`${PERF_API_BASE}/${id}`, {
        method: 'DELETE',
        headers,
      });
      if (res.ok) {
        showToast('Review deleted successfully.');
        fetchReviews(false);
        return;
      }
    } catch {
      // local removal
    }
    setReviews((prev) => prev.filter((r) => r.id !== id));
    showToast('Review removed locally.');
  };

  return (
    <div className="perf-container">
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

      {/* 1. Page Header */}
      <div className="perf-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2>Vendor Performance & Ratings</h2>
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
          <p>Scorecards, delivery SLA benchmarks, and compliance reviews.</p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            type="button"
            className="perf-btn-secondary"
            onClick={() => fetchReviews(true)}
            disabled={isLoading}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            <span>{isLoading ? 'Syncing...' : 'Sync'}</span>
          </button>
          <button
            type="button"
            className="perf-btn-primary"
            onClick={handleOpenModal}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={15} />
            <span>Record Review</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Summary Cards */}
      <div className="perf-stats-grid">
        <div className="perf-stat-card">
          <span className="perf-stat-label">Total Reviews Recorded</span>
          <strong className="perf-stat-value">{totalReviews}</strong>
        </div>
        <div className="perf-stat-card">
          <span className="perf-stat-label">Network Average Score</span>
          <strong className="perf-stat-value perf-stat-info">{avgOverallScore} / 5.0</strong>
        </div>
        <div className="perf-stat-card">
          <span className="perf-stat-label">Top Tier Vendors (4.5+)</span>
          <strong className="perf-stat-value perf-stat-success">{topTierCount}</strong>
        </div>
      </div>

      {/* 3. Performance Scorecards Table */}
      <div className="perf-table-wrapper">
        <table className="perf-table">
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Period</th>
              <th>Quality</th>
              <th>Delivery</th>
              <th>Pricing</th>
              <th>Comms</th>
              <th>Compliance</th>
              <th>Overall Score</th>
              <th>Rating Tier</th>
              <th style={{ textAlign: 'right' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r) => {
              const badge = getRatingBadge(Number(r.overallScore) || 0);
              return (
                <tr key={r.id}>
                  <td>
                    <div className="perf-vendor-name">{r.vendorCompanyName}</div>
                    <div className="perf-vendor-code">{r.vendorCode}</div>
                  </td>
                  <td>{r.reviewPeriod}</td>
                  <td>{(Number(r.qualityScore) || 0).toFixed(1)}</td>
                  <td>{(Number(r.deliveryScore) || 0).toFixed(1)}</td>
                  <td>{(Number(r.pricingScore) || 0).toFixed(1)}</td>
                  <td>{(Number(r.communicationScore) || 0).toFixed(1)}</td>
                  <td>{(Number(r.complianceScore) || 0).toFixed(1)}</td>
                  <td className="perf-overall-score">
                    <strong>{(Number(r.overallScore) || 0).toFixed(1)}</strong> / 5.0
                  </td>
                  <td>
                    <span className={`perf-badge ${badge.className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={11} fill="currentColor" />
                      <span>{badge.label}</span>
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => handleDelete(r.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#94a3b8',
                        cursor: 'pointer',
                        padding: '4px',
                        borderRadius: '4px',
                        display: 'inline-flex',
                        alignItems: 'center',
                      }}
                      title="Delete review"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 4. Record Review Modal */}
      {isModalOpen && (
        <div className="perf-modal-overlay">
          <div className="perf-modal">
            <div className="perf-modal-header">
              <h3>Record Performance Review</h3>
              <button
                type="button"
                className="perf-modal-close"
                onClick={() => setIsModalOpen(false)}
                style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="perf-form">
              <div className="perf-form-grid">
                <div className="perf-form-group">
                  <label htmlFor="vendorId">Select Vendor *</label>
                  <select
                    id="vendorId"
                    name="vendorId"
                    value={formData.vendorId}
                    onChange={handleChange}
                    required
                  >
                    {vendors.length > 0 ? (
                      vendors.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.companyName} ({v.vendorCode})
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="1">Acme Industrial Supplies (VEN-001)</option>
                        <option value="2">Apex Cloud Solutions (VEN-002)</option>
                        <option value="3">Global Logistics Corp (VEN-003)</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="perf-form-group">
                  <label htmlFor="reviewPeriod">Review Period</label>
                  <select
                    id="reviewPeriod"
                    name="reviewPeriod"
                    value={formData.reviewPeriod}
                    onChange={handleChange}
                  >
                    <option value="Q1 2026">Q1 2026</option>
                    <option value="Q2 2026">Q2 2026</option>
                    <option value="Q3 2026">Q3 2026</option>
                    <option value="Q4 2026">Q4 2026</option>
                  </select>
                </div>

                <div className="perf-form-group">
                  <label htmlFor="reviewDate">Review Date</label>
                  <input
                    id="reviewDate"
                    name="reviewDate"
                    type="date"
                    value={formData.reviewDate}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* 5 Scoring Sliders / Inputs */}
              <div className="perf-scores-box">
                <h4>Evaluation Scores (1.0 to 5.0)</h4>
                <div className="perf-score-inputs">
                  <div className="perf-score-item">
                    <label htmlFor="qualityScore">Quality: {formData.qualityScore}</label>
                    <input
                      id="qualityScore"
                      name="qualityScore"
                      type="range"
                      min="1.0"
                      max="5.0"
                      step="0.1"
                      value={formData.qualityScore}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="perf-score-item">
                    <label htmlFor="deliveryScore">Delivery: {formData.deliveryScore}</label>
                    <input
                      id="deliveryScore"
                      name="deliveryScore"
                      type="range"
                      min="1.0"
                      max="5.0"
                      step="0.1"
                      value={formData.deliveryScore}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="perf-score-item">
                    <label htmlFor="pricingScore">Pricing: {formData.pricingScore}</label>
                    <input
                      id="pricingScore"
                      name="pricingScore"
                      type="range"
                      min="1.0"
                      max="5.0"
                      step="0.1"
                      value={formData.pricingScore}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="perf-score-item">
                    <label htmlFor="communicationScore">Comms: {formData.communicationScore}</label>
                    <input
                      id="communicationScore"
                      name="communicationScore"
                      type="range"
                      min="1.0"
                      max="5.0"
                      step="0.1"
                      value={formData.communicationScore}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="perf-score-item">
                    <label htmlFor="complianceScore">Compliance: {formData.complianceScore}</label>
                    <input
                      id="complianceScore"
                      name="complianceScore"
                      type="range"
                      min="1.0"
                      max="5.0"
                      step="0.1"
                      value={formData.complianceScore}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="perf-form-group">
                <label htmlFor="comments">Reviewer Comments</label>
                <textarea
                  id="comments"
                  name="comments"
                  rows="2"
                  placeholder="Notes regarding delivery, responsiveness, or defects..."
                  value={formData.comments}
                  onChange={handleChange}
                />
              </div>

              <div className="perf-modal-actions">
                <button
                  type="button"
                  className="perf-btn-secondary"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button type="submit" className="perf-btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Vendorperformance;
