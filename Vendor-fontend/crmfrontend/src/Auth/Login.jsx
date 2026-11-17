import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, HelpCircle } from 'lucide-react';
import BackgroundDecoration from '../components/BackgroundDecoration';
import BrandingSection from '../components/BrandingSection';
import LoginCard from '../components/LoginCard';
import '../Styles/Login.css';

export default function Login({ onLoginSuccess }) {
  const [toastNotification, setToastNotification] = useState(null);

  const handleSuccess = (userData) => {
    setToastNotification({
      title: 'Signed in successfully',
      message: `Welcome back, ${userData.fullName || userData.username || userData.email} (${(userData.activeRole || 'User').replace(/_/g, ' ')})`,
    });
    setTimeout(() => {
      setToastNotification(null);
      if (onLoginSuccess) {
        onLoginSuccess(userData);
      }
    }, 800);
  };

  return (
    <div className="login-viewport">
      {/* Background Graphic Effects */}
      <BackgroundDecoration />

      {/* Main Responsive Grid Layout */}
      <main className="login-main">
        <div className="login-container">
          {/* Left Column: Enterprise Branding */}
          <div className="login-branding-col">
            <BrandingSection />
          </div>

          {/* Right Column: Portal Login Card */}
          <div className="login-card-col">
            <LoginCard onLoginSuccess={handleSuccess} />
          </div>
        </div>
      </main>

      {/* Enterprise Footer */}
      <footer className="login-footer">
        <div className="login-footer-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck style={{ width: '16px', height: '16px', color: '#6366F1' }} />
            <span>© 2026 Zenve Zippy Inc. Enterprise Vendor Relationship Management.</span>
          </div>
          <div className="login-footer-links">
            <a href="#privacy">Privacy Policy</a>
            <span>•</span>
            <a href="#terms">Terms of Service</a>
            <span>•</span>
            <a href="#security">Security</a>
            <span>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
              <HelpCircle style={{ width: '14px', height: '14px', color: '#FF9500' }} />
              Support
            </span>
          </div>
        </div>
      </footer>

      {/* Floating Notification Toast */}
      <AnimatePresence>
        {toastNotification && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              zIndex: 9999,
              padding: '14px 20px',
              borderRadius: '16px',
              background: 'rgba(7, 23, 43, 0.95)',
              border: '1px solid rgba(99, 102, 241, 0.45)',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 12px 40px rgba(99, 102, 241, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              maxWidth: '380px',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'rgba(99, 102, 241, 0.15)',
                border: '1px solid rgba(99, 102, 241, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6366F1',
                flexShrink: 0,
              }}
            >
              <ShieldCheck style={{ width: '20px', height: '20px' }} />
            </div>
            <div>
              <p style={{ margin: '0 0 2px 0', fontSize: '0.88rem', fontWeight: '700', color: '#E2E8F0' }}>
                {toastNotification.title}
              </p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1' }}>
                {toastNotification.message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
