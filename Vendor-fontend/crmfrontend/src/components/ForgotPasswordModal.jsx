import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, CheckCircle2, ArrowRight, KeyRound, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordModal({ isOpen, onClose, defaultEmail = '' }) {
  const [email, setEmail] = useState(defaultEmail);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !EMAIL_REGEX.test(email.trim())) {
      setErrorMsg('Please enter a valid work email address.');
      return;
    }

    setIsLoading(true);
    const result = await authService.requestPasswordReset(email);
    setIsLoading(false);

    if (result.success) {
      setStatusMessage(result.message);
      setIsSubmitted(true);
    } else {
      setErrorMsg(result.message);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setErrorMsg('');
    setStatusMessage('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-[#020B1A]/80 backdrop-blur-md"
          />

          {/* Modal Container (#07172B) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="relative w-full max-w-md rounded-[22px] bg-[#07172B]/95 border border-[#00D4E5]/30 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_30px_rgba(0,212,229,0.2)] z-10 overflow-hidden"
          >
            {/* Top Cyan/Blue Glow Accent */}
            <div
              className="absolute top-0 left-0 right-0 h-1"
              style={{
                background: 'linear-gradient(90deg, #00D4E5 0%, #1265FF 60%, #7B2CFF 100%)',
              }}
            />
            <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#00D4E5]/15 rounded-full blur-3xl pointer-events-none" />

            {/* Close Button */}
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close modal"
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {!isSubmitted ? (
              <div>
                <div className="w-12 h-12 rounded-[14px] bg-[#00D4E5]/10 border border-[#00D4E5]/30 flex items-center justify-center text-[#00D4E5] mb-4 shadow-[0_0_16px_rgba(0,212,229,0.25)]">
                  <KeyRound className="w-6 h-6" />
                </div>

                <h3 className="text-xl font-bold text-white tracking-tight">
                  Reset Your Password
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed">
                  Enter your registered enterprise work email to receive password recovery instructions.
                </p>

                {errorMsg && (
                  <div className="mt-4 p-3 rounded-[14px] bg-red-500/10 border border-red-500/35 text-red-300 text-xs flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                      Work Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errorMsg) setErrorMsg('');
                        }}
                        placeholder="you@company.com"
                        className="w-full pl-10 pr-4 py-2.5 rounded-[14px] glass-input text-white placeholder-slate-500 text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="flex-1 py-2.5 rounded-[14px] border border-white/10 text-slate-300 text-xs sm:text-sm font-semibold hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <motion.button
                      type="submit"
                      disabled={isLoading}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 py-2.5 rounded-[14px] text-white text-xs sm:text-sm font-bold shadow-[0_0_20px_rgba(0,212,229,0.4)] hover:shadow-[0_0_28px_rgba(0,212,229,0.65)] transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-70"
                      style={{
                        background: 'linear-gradient(90deg, #00D4E5 0%, #1265FF 100%)',
                      }}
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Send Reset Link</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-400/35 flex items-center justify-center text-emerald-400 mx-auto mb-4 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">
                  Recovery Link Sent
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2">
                  {statusMessage}
                </p>
                <p className="text-sm font-semibold text-[#00D4E5] mt-2 bg-[#020B1A]/70 py-1.5 px-3 rounded-lg border border-[#00D4E5]/25 inline-block">
                  {email}
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full py-2.5 rounded-[14px] bg-[#020B1A] hover:bg-slate-800 text-white text-sm font-semibold border border-[#00D4E5]/25 transition-colors cursor-pointer"
                  >
                    Back to Login
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}