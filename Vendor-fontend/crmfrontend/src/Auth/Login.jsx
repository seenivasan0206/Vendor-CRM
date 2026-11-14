import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, HelpCircle } from 'lucide-react';
import BackgroundDecoration from '../components/BackgroundDecoration';
import BrandingSection from '../components/BrandingSection';
import LoginCard from '../components/LoginCard';
import ZenveLogo from '../components/ZenveLogo';
import '../Styles/Login.css';

export default function Login({ onLoginSuccess }) {
  const [toastNotification, setToastNotification] = useState(null);

  const handleSuccess = (userData) => {
    setToastNotification({
      title: 'Signed in successfully',
      message: `Welcome back, ${userData.fullName || userData.email} (${userData.activeRole?.replace('_', ' ') || 'User'})`,
    });
    setTimeout(() => {
      setToastNotification(null);
      if (onLoginSuccess) {
        onLoginSuccess(userData);
      }
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="login-viewport relative w-full bg-[#020B1A] text-slate-100 flex flex-col justify-between overflow-x-hidden"
    >
      {/* Dynamic Blurred Office Background, Curved Neon Shapes & Animated Gradients */}
      <BackgroundDecoration />

      {/* Main Responsive Layout Container */}
      <main className="relative z-10 flex-1 min-h-0 flex items-center justify-center px-4 sm:px-6 lg:px-10 py-3 sm:py-4 lg:py-2">
        <div className="w-full max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-12 gap-4 lg:gap-8 xl:gap-12 items-center">
          {/* Mobile-Only Compact Branding Header (keeps Login Card prominent above the fold on mobile) */}
          <div className="w-full flex flex-col items-center text-center lg:hidden">
            <ZenveLogo size="sm" className="mb-2" />
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
              Welcome to Zenve Zippy{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage: 'linear-gradient(90deg, #00D4E5 0%, #1265FF 100%)',
                }}
              >
                Vendor CRM
              </span>
            </h1>
            <p className="text-xs text-slate-300 mt-0.5">
              Smarter Vendor Management.{' '}
              <span className="text-[#00D4E5] font-medium">Stronger Business Growth.</span>
            </p>
          </div>

          {/* RIGHT SECTION on Desktop / FIRST Prominent Section on Mobile */}
          <section className="w-full lg:col-span-5 order-1 lg:order-2 flex flex-col items-center justify-center">
            <LoginCard onLoginSuccess={handleSuccess} />
          </section>

          {/* LEFT SECTION on Desktop / Simplified Below Login on Mobile */}
          <section className="w-full lg:col-span-7 order-2 lg:order-1 flex flex-col justify-center">
            <BrandingSection />
          </section>
        </div>
      </main>

      {/* Enterprise Footer */}
      <footer className="relative z-10 shrink-0 py-2 px-4 sm:px-6 border-t border-[#00D4E5]/10 bg-[#020B1A]/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] sm:text-xs text-slate-400">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <ShieldCheck className="w-3.5 h-3.5 text-[#00D4E5] flex-shrink-0" />
            <span>© 2026 Zenve Zippy Inc. Enterprise Vendor Relationship Management.</span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 text-slate-400">
            <a href="#privacy" className="hover:text-[#00D4E5] transition-colors">Privacy</a>
            <span>•</span>
            <a href="#terms" className="hover:text-[#00D4E5] transition-colors">Terms</a>
            <span>•</span>
            <a href="#security" className="hover:text-[#00D4E5] transition-colors">Security</a>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-400 hover:text-slate-200 cursor-pointer">
              <HelpCircle className="w-3.5 h-3.5 text-[#FF9500]" />
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
            className="absolute bottom-12 right-5 z-50 p-3.5 rounded-[18px] bg-[#07172B]/95 border border-[#00D4E5]/45 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,212,229,0.3)] flex items-center gap-3 max-w-sm"
          >
            <div className="w-9 h-9 rounded-[12px] bg-[#00D4E5]/15 border border-[#00D4E5]/40 flex items-center justify-center text-[#00D4E5] flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">
                {toastNotification.title}
              </p>
              <p className="text-xs text-slate-300 mt-0.5 leading-snug">
                {toastNotification.message}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}