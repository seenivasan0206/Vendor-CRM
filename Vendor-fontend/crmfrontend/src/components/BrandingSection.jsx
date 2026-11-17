import { Users2, Clock3, ShieldCheck } from 'lucide-react';
import ZenveLogo from './ZenveLogo';

const features = [
  {
    id: 'vendors',
    title: 'Vendor Lifecycle Management',
    desc: 'Automated vendor vetting, risk scoring, and compliance repository.',
    icon: Users2,
    color: '#6366F1',
    tag: '3,200+ Vendors',
  },
  {
    id: 'pos',
    title: 'Purchase Order Tracking',
    desc: 'Real-time multi-tier approvals, delivery dispatch alerts, and live sync.',
    icon: Clock3,
    color: '#1265FF',
    tag: 'Automated Sync',
  },
  {
    id: 'vault',
    title: 'Smart Contracts & Vault',
    desc: 'End-to-end encrypted contract repository with expiry and renewal alerts.',
    icon: ShieldCheck,
    color: '#FF9500',
    tag: '256-Bit Vault',
  },
];

export default function BrandingSection() {
  return (
    <div className="login-branding-col">
      {/* 1. Brand Logo */}
      <div>
        <ZenveLogo size="lg" />
      </div>

      {/* 2. Headline & Subtitle */}
      <div className="login-brand-header">
        <h1 className="login-hero-title">
          Welcome to <span className="login-gradient-text">Zenve Zippy</span>
          <br />
          Enterprise Vendor CRM
        </h1>
        <p className="login-hero-subtitle">
          Smarter Vendor Management. Stronger Business Growth. Streamline procurement, contracts, and warehouse operations in one unified workspace.
        </p>
        <div className="login-accent-line" />
      </div>

      {/* 3. Feature Cards */}
      <div className="login-features-list">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.id} className="login-feature-card">
              <div className="login-feature-icon-box">
                <Icon style={{ width: '20px', height: '20px', color: f.color }} />
              </div>
              <div className="login-feature-content" style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  <h4>{f.title}</h4>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: '700',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      background: 'rgba(2, 11, 26, 0.8)',
                      border: '1px solid rgba(99, 102, 241, 0.25)',
                      color: '#6366F1',
                    }}
                  >
                    {f.tag}
                  </span>
                </div>
                <p>{f.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Trust & Platform Metrics */}
      <div className="login-metrics-row">
        <div className="login-metric-item">
          <span className="login-metric-val">3,200+</span>
          <span className="login-metric-label">Active Vendors</span>
        </div>
        <div className="login-metric-item">
          <span className="login-metric-val">99.98%</span>
          <span className="login-metric-label">System Uptime</span>
        </div>
        <div className="login-metric-item">
          <span className="login-metric-val">256-Bit</span>
          <span className="login-metric-label">Bank Security</span>
        </div>
      </div>
    </div>
  );
}
