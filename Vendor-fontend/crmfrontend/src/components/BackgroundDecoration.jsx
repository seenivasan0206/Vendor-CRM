import { motion } from 'framer-motion';
import officeBg from '../assets/office-bg.jpg';

export default function BackgroundDecoration() {
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0 bg-[#020B1A]">
      {/* 1. Dark, Blurred Modern Office Architecture Backdrop */}
      <div className="absolute inset-0 z-0">
        <img
          src={officeBg}
          alt="Modern Corporate Office Backdrop"
          className="w-full h-full object-cover object-center opacity-22 scale-105 filter blur-[2px] brightness-75 contrast-125"
        />
        {/* Deep Navy Scrim Overlay (#020B1A) */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(125deg, rgba(2,11,26,0.95) 0%, rgba(7,23,43,0.84) 50%, rgba(2,11,26,0.96) 100%)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020B1A] via-transparent to-[#020B1A]/85" />
      </div>

      {/* 2. Animated Multi-Tone Gradient Orbs (#00D4E5, #1265FF, #7B2CFF) */}
      <motion.div
        animate={{
          scale: [1, 1.16, 1],
          opacity: [0.32, 0.48, 0.32],
          x: [0, 30, 0],
          y: [0, -25, 0],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-36 -left-36 w-[620px] h-[620px] rounded-full blur-[130px]"
        style={{
          background:
            'radial-gradient(circle, rgba(0,212,229,0.28) 0%, rgba(18,101,255,0.14) 45%, transparent 75%)',
        }}
      />

      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.28, 0.45, 0.28],
          x: [0, -35, 0],
          y: [0, 35, 0],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        className="absolute top-1/4 -right-32 w-[580px] h-[580px] rounded-full blur-[140px]"
        style={{
          background:
            'radial-gradient(circle, rgba(18,101,255,0.3) 0%, rgba(123,44,255,0.18) 50%, transparent 75%)',
        }}
      />

      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.22, 0.38, 0.22],
          x: [0, 20, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2.5 }}
        className="absolute -bottom-44 left-1/4 w-[680px] h-[520px] rounded-full blur-[145px]"
        style={{
          background:
            'radial-gradient(circle, rgba(0,212,229,0.22) 0%, rgba(123,44,255,0.14) 50%, transparent 75%)',
        }}
      />

      {/* 3. Animated Abstract Curved Shapes & Glowing Neon Ribbons */}
      <svg
        className="absolute inset-0 w-full h-full opacity-45 z-0"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="curveGradPrimary" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D4E5" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#1265FF" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#7B2CFF" stopOpacity="0.0" />
          </linearGradient>

          <linearGradient id="curveGradSecondary" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7B2CFF" stopOpacity="0.25" />
            <stop offset="55%" stopColor="#00D4E5" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#1265FF" stopOpacity="0.85" />
          </linearGradient>

          <filter id="cyanNeonGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="10" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Primary Flowing Neon Curve */}
        <motion.path
          d="M -120 260 C 260 120, 480 560, 860 390 C 1180 250, 1360 460, 1580 340"
          fill="none"
          stroke="url(#curveGradPrimary)"
          strokeWidth="2.5"
          filter="url(#cyanNeonGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: 1,
            opacity: [0.45, 0.72, 0.45],
            y: [0, -8, 0],
          }}
          transition={{
            pathLength: { duration: 2.5, ease: 'easeOut' },
            opacity: { duration: 7, repeat: Infinity, ease: 'easeInOut' },
            y: { duration: 9, repeat: Infinity, ease: 'easeInOut' },
          }}
        />

        {/* Secondary Dashed Curved Wave */}
        <motion.path
          d="M -90 400 C 290 290, 520 690, 920 490 C 1240 330, 1390 590, 1620 430"
          fill="none"
          stroke="url(#curveGradSecondary)"
          strokeWidth="1.5"
          strokeDasharray="7 9"
          filter="url(#cyanNeonGlow)"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: 1,
            opacity: [0.3, 0.55, 0.3],
            y: [0, 10, 0],
          }}
          transition={{
            pathLength: { duration: 3, ease: 'easeOut', delay: 0.3 },
            opacity: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
            y: { duration: 11, repeat: Infinity, ease: 'easeInOut' },
          }}
        />

        {/* Abstract Architectural Sweep Bottom */}
        <motion.path
          d="M 80 920 C 340 660, 650 740, 910 855 C 1130 950, 1360 810, 1560 910"
          fill="none"
          stroke="rgba(0, 212, 229, 0.22)"
          strokeWidth="1.4"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Subtle Glowing Node Accents */}
        <circle cx="860" cy="390" r="3.5" fill="#00D4E5" filter="url(#cyanNeonGlow)" />
        <circle cx="480" cy="560" r="2.5" fill="#1265FF" />
        <circle cx="1180" cy="250" r="3" fill="#7B2CFF" />
      </svg>

      {/* Subtle High-Tech Dot Grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(#00D4E5 1px, transparent 1px)',
          backgroundSize: '34px 34px',
        }}
      />
    </div>
  );
}

