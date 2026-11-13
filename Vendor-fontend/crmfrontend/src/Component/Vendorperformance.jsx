import React, { useState } from 'react';
import '../Styles/Vendorperformance.css';

const SAMPLE_REVIEWS = [
  {
    id: 1,
    vendorCompanyName: 'Global Apex Logistics',
    vendorCode: 'VEND-GLOBAL-01',
    reviewPeriod: 'Q3 2026',
    reviewDate: '2026-11-05',
    qualityScore: 4.8,
    deliveryScore: 4.5,
    pricingScore: 4.2,
    communicationScore: 4.7,
    complianceScore: 4.8,
    overallScore: 4.6,
    comments: 'Consistently delivers high-grade IoT sensors with zero defect return rate.',
  },
  {
    id: 2,
    vendorCompanyName: 'Tech Supplies Global Pvt Ltd',
    vendorCode: 'VEND-001',
    reviewPeriod: 'Q3 2026',
    reviewDate: '2026-10-28',
    qualityScore: 4.6,
    deliveryScore: 4.8,
    pricingScore: 4.5,
    communicationScore: 4.3,
    complianceScore: 4.6,
    overallScore: 4.6,
    comments: 'Superb on-time shipping for hardware batches. Very dependable.',
  },
  {
    id: 3,
    vendorCompanyName: 'Apex Packaging Corp',
    vendorCode: 'VEND-003',
    reviewPeriod: 'Q2 2026',
    reviewDate: '2026-07-15',
    qualityScore: 3.5,
    deliveryScore: 3.2,
    pricingScore: 3.8,
    communicationScore: 3.5,
    complianceScore: 4.0,
    overallScore: 3.6,
    comments: 'Minor delays observed during monsoon shipment cycles. Action plan requested.',
  },
];

function getRatingBadge(score) {
  if (score >= 4.5) return { label: 'Top Tier ★★★★★', className: 'perf-badge-top' };
  if (score >= 4.0) return { label: 'Good ★★★★', className: 'perf-badge-good' };
  if (score >= 3.0) return { label: 'Average ★★★', className: 'perf-badge-avg' };
  return { label: 'Needs Improvement ★', className: 'perf-badge-poor' };
}

function Vendorperformance() {
  const [reviews, setReviews] = useState(SAMPLE_REVIEWS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    vendorCompanyName: '',
    vendorCode: '',
    reviewPeriod: 'Q4 2026',
    reviewDate: new Date().toISOString().split('T')[0],
    qualityScore: 4.5,
    deliveryScore: 4.5,
    pricingScore: 4.5,
    communicationScore: 4.5,
    complianceScore: 4.5,
    comments: '',
  });

  // Summary Metrics
  const totalReviews = reviews.length;
  const avgOverallScore = (
    reviews.reduce((sum, r) => sum + r.overallScore, 0) / (totalReviews || 1)
  ).toFixed(1);
  const topTierCount = reviews.filter((r) => r.overallScore >= 4.5).length;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = () => {
    setFormData({
      vendorCompanyName: '',
      vendorCode: '',
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const q = Number(formData.qualityScore);
    const d = Number(formData.deliveryScore);
    const p = Number(formData.pricingScore);
    const c = Number(formData.communicationScore);
    const comp = Number(formData.complianceScore);
    const overall = Number(((q + d + p + c + comp) / 5).toFixed(1));

    const newReview = {
      id: Date.now(),
      vendorCompanyName: formData.vendorCompanyName.trim(),
      vendorCode: formData.vendorCode.trim() || 'VEND-NEW',
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
    setIsModalOpen(false);
  };

  return (
    <div className="perf-container">
      {/* 1. Page Header */}
      <div className="perf-header">
        <div>
          <h2>Vendor Performance & Ratings</h2>
          <p>Scorecards, delivery SLA benchmarks, and compliance reviews.</p>
        </div>
        <button
          type="button"
          className="perf-btn-primary"
          onClick={handleOpenModal}
        >
          + Record Review
        </button>
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
            </tr>
          </thead>
          <tbody>
            {reviews.map((r) => {
              const badge = getRatingBadge(r.overallScore);
              return (
                <tr key={r.id}>
                  <td>
                    <div className="perf-vendor-name">{r.vendorCompanyName}</div>
                    <div className="perf-vendor-code">{r.vendorCode}</div>
                  </td>
                  <td>{r.reviewPeriod}</td>
                  <td>{r.qualityScore.toFixed(1)}</td>
                  <td>{r.deliveryScore.toFixed(1)}</td>
                  <td>{r.pricingScore.toFixed(1)}</td>
                  <td>{r.communicationScore.toFixed(1)}</td>
                  <td>{r.complianceScore.toFixed(1)}</td>
                  <td className="perf-overall-score">
                    <strong>{r.overallScore.toFixed(1)}</strong> / 5.0
                  </td>
                  <td>
                    <span className={`perf-badge ${badge.className}`}>
                      {badge.label}
                    </span>
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
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="perf-form">
              <div className="perf-form-grid">
                <div className="perf-form-group">
                  <label htmlFor="vendorCompanyName">Vendor Company Name *</label>
                  <input
                    id="vendorCompanyName"
                    name="vendorCompanyName"
                    type="text"
                    placeholder="e.g. Acme Tech Solutions"
                    value={formData.vendorCompanyName}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="perf-form-group">
                  <label htmlFor="vendorCode">Vendor Code</label>
                  <input
                    id="vendorCode"
                    name="vendorCode"
                    type="text"
                    placeholder="e.g. VEND-004"
                    value={formData.vendorCode}
                    onChange={handleChange}
                  />
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
                >
                  Cancel
                </button>
                <button type="submit" className="perf-btn-primary">
                  Save Review
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
