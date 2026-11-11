import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Check,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import RoleSelector from './RoleSelector';
import { ROLES } from '../constants/roles';
import ForgotPasswordModal from './ForgotPasswordModal';
import { authService } from '../services/authService';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginCard({ onLoginSuccess }) {
  const remembered = authService.getRememberedCredentials();

  const [selectedRole, setSelectedRole] = useState(remembered.role || 'ADMIN');
  const [email, setEmail] = useState(remembered.email || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(Boolean(remembered.email));
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({ email: '', password: '' });
  const [focusedField, setFocusedField] = useState(null);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const activeRoleObj = ROLES.find((r) => r.id === selectedRole) || ROLES[0];

  const handleRoleChange = (roleId) => {
    setSelectedRole(roleId);
    setServerError('');
  };

  const validateForm = () => {
    const errors = { email: '', password: '' };
    let isValid = true;

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      errors.email = 'Email address is required.';
      isValid = false;
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      errors.email = 'Please enter a valid email address (e.g., name@company.com).';
      isValid = false;
    }

    if (!password) {
      errors.password = 'Password is required.';
      isValid = false;
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    setIsSuccess(false);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    const result = await authService.login({
      usernameOrEmail: email,
      password,
      selectedRole,
      rememberMe,
    });

    setIsLoading(false);

    if (result.success) {
      setIsSuccess(true);
      if (onLoginSuccess) {
        onLoginSuccess(result.user);
      }
    } else {
      setServerError(result.message || 'Authentication failed. Please try again.');
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.75, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[470px] mx-auto relative group"
      >
        {/* Soft Neon Cyan & Electric Blue Back-Glow */}
        <div
          className="absolute -inset-1.5 rounded-[28px] blur-2xl opacity-65 group-hover:opacity-90 transition duration-700 pointer-events-none"
          style={{
            background:
              'linear-gradient(135deg, rgba(0,212,229,0.28) 0%, rgba(18,101,255,0.24) 55%, rgba(123,44,255,0.26) 100%)',
          }}
        />

        {/* Glassmorphism Card Container (#07172B, 24px radius, subtle cyan glowing border) */}
        <div className="relative glass-card p-4 sm:p-5 overflow-hidden">
          {/* Top Specular Highlight Line */}
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#00D4E5]/65 to-transparent" />

          {/* Subtle Inner Corner Glows */}
          <div className="absolute -top-28 -right-28 w-56 h-56 bg-[#00D4E5]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-28 -left-28 w-56 h-56 bg-[#7B2CFF]/12 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="relative mb-2.5 text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#020B1A]/75 border border-[#00D4E5]/30 text-[#00D4E5] text-[10px] font-semibold mb-1.5 backdrop-blur-md">
              <Sparkles className="w-3 h-3 text-[#FF9500]" />
              <span>Enterprise Vendor Portal</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight">
              Login to Your Account
            </h2>
            <p className="text-xs text-slate-400 mt-0.5 font-normal">
              Access your vendor management dashboard
            </p>
          </div>

          {/* Server / Auth Error Banner */}
          <AnimatePresence>
            {serverError && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                className="mb-2.5 p-2.5 rounded-[14px] bg-red-500/10 border border-red-400/35 text-red-200 text-xs flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span className="leading-snug">{serverError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Backend Auth Success Banner */}
          <AnimatePresence>
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                className="mb-2.5 p-2.5 rounded-[14px] bg-emerald-500/15 border border-emerald-400/40 text-emerald-200 text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
              >
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="font-bold">Authenticated Successfully</p>
                  <p className="text-[11px] text-emerald-300/85">
                    Authorized for {activeRoleObj.label} workspace.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Role Selection Buttons */}
          <div className="mb-2.5">
            <RoleSelector
              selectedRole={selectedRole}
              onSelectRole={handleRoleChange}
            />
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} noValidate className="space-y-2">
            {/* Email Address Field */}
            <div className="space-y-1 text-left">
              <label
                htmlFor="login-email"
                className="text-xs font-semibold text-slate-300 tracking-wide flex items-center justify-between"
              >
                <span>Email Address</span>
                <span className="text-[10px] text-slate-400 font-normal">
                  e.g. {activeRoleObj.defaultEmail}
                </span>
              </label>

              <motion.div
                animate={{ scale: focusedField === 'email' ? 1.01 : 1 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <div
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                    focusedField === 'email' ? 'text-[#00D4E5]' : 'text-slate-400'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors((prev) => ({ ...prev, email: '' }));
                    if (serverError) setServerError('');
                  }}
                  placeholder={activeRoleObj.defaultEmail}
                  aria-invalid={Boolean(fieldErrors.email)}
                  className={`w-full pl-10 pr-4 py-2 rounded-[14px] glass-input text-white placeholder-slate-500 text-sm focus:outline-none font-medium ${
                    fieldErrors.email ? 'border-red-400/70 focus:border-red-400' : ''
                  }`}
                />
              </motion.div>

              {fieldErrors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[11px] text-red-400 font-medium pl-1"
                >
                  {fieldErrors.email}
                </motion.p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1 text-left">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="text-xs font-semibold text-slate-300 tracking-wide"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotPasswordOpen(true)}
                  className="text-[11px] font-medium text-[#00D4E5] hover:text-cyan-300 transition-colors hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>

              <motion.div
                animate={{ scale: focusedField === 'password' ? 1.01 : 1 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <div
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                    focusedField === 'password' ? 'text-[#00D4E5]' : 'text-slate-400'
                  }`}
                >
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: '' }));
                    if (serverError) setServerError('');
                  }}
                  placeholder="Enter your password"
                  aria-invalid={Boolean(fieldErrors.password)}
                  className={`w-full pl-10 pr-11 py-2 rounded-[14px] glass-input text-white placeholder-slate-500 text-sm focus:outline-none font-medium ${
                    fieldErrors.password ? 'border-red-400/70 focus:border-red-400' : ''
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#00D4E5] transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </motion.div>

              {fieldErrors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-[11px] text-red-400 font-medium pl-1"
                >
                  {fieldErrors.password}
                </motion.p>
              )}
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="inline-flex items-center gap-2 cursor-pointer select-none text-left">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded-[5px] border flex items-center justify-center transition-all ${
                    rememberMe
                      ? 'border-[#00D4E5] shadow-[0_0_12px_rgba(0,212,229,0.5)]'
                      : 'bg-[#020B1A]/80 border-slate-600'
                  }`}
                  style={
                    rememberMe
                      ? { background: 'linear-gradient(135deg, #00D4E5 0%, #1265FF 100%)' }
                      : undefined
                  }
                >
                  {rememberMe && <Check className="w-3 h-3 text-[#020B1A] stroke-[3]" />}
                </div>
                <span className="text-xs text-slate-300 font-medium">
                  Remember me
                </span>
              </label>
            </div>

            {/* Gradient Login Button */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={{ scale: 1.015 }}
              whileTap={{ scale: 0.985 }}
              className="w-full relative mt-1 py-2.5 px-6 rounded-[16px] font-bold text-sm tracking-wide text-white neon-cyan-glow neon-cyan-glow-hover transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed overflow-hidden"
              style={{
                background: 'linear-gradient(90deg, #00D4E5 0%, #1265FF 100%)',
              }}
            >
              {/* Light Shimmer Sweep */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-1000 ease-in-out pointer-events-none" />

              {isLoading ? (
                <div className="flex items-center gap-2 text-white font-bold">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Signing In...</span>
                </div>
              ) : (
                <>
                  <span className="drop-shadow-sm">
                    Login as {activeRoleObj.label}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Secure & Trusted Platform Indicator */}
          <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-center gap-2 text-slate-400 text-[11px]">
            <div className="relative flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="absolute w-3.5 h-3.5 rounded-full bg-emerald-400/30 animate-ping" />
            </div>
            <ShieldCheck className="w-3.5 h-3.5 text-[#00D4E5]" />
            <span className="text-slate-200 font-medium">
              Secure &amp; Trusted Platform
            </span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-[#FF9500] text-[11px] font-medium hidden sm:inline">
              256-Bit SSL
            </span>
          </div>
        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
        defaultEmail={email}
      />
    </>
  );
}

