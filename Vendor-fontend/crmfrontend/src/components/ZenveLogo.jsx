import { motion } from 'framer-motion';

export default function ZenveLogo({ size = 'md', className = '' }) {
  const isSmall = size === 'sm';
  const isLarge = size === 'lg';

  const iconDimension = isSmall ? 'w-9 h-9' : isLarge ? 'w-12 h-12' : 'w-10 h-10';
  const titleSize = isSmall ? 'text-lg' : isLarge ? 'text-2xl' : 'text-xl';

  return (
    <motion.div
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      className={`inline-flex items-center gap-3 group cursor-pointer select-none ${className}`}
    >
      {/* Dynamic Glowing Logo Icon */}
      <div className={`relative ${iconDimension} flex items-center justify-center`}>
        {/* Ambient Back Glow */}
        <div
          className="absolute inset-0 rounded-[14px] blur-md opacity-65 group-hover:opacity-95 transition-opacity duration-300"
          style={{
            background: 'linear-gradient(135deg, #00D4E5 0%, #1265FF 65%, #7B2CFF 100%)',
          }}
        />

        {/* Glass Icon Vessel */}
        <div className="relative w-full h-full rounded-[14px] bg-[#07172B]/90 border border-[#00D4E5]/40 backdrop-blur-md flex items-center justify-center shadow-inner overflow-hidden p-2">
          <div className="absolute -inset-full bg-gradient-to-r from-transparent via-[#00D4E5]/20 to-transparent rotate-45 group-hover:animate-pulse" />

          {/* Stylized 'Z' Geometric Vector Logo */}
          <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-[0_0_8px_rgba(0,212,229,0.75)]"
          >
            <defs>
              <linearGradient id="zenveBrandGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
                <stop stopColor="#00D4E5" />
                <stop offset="0.6" stopColor="#1265FF" />
                <stop offset="1" stopColor="#7B2CFF" />
              </linearGradient>
            </defs>
            <path
              d="M7 11.5C7 9.8 8.4 8.5 10 8.5H31C32.7 8.5 33.7 10.3 32.7 11.7L18.5 29.5H31C32.7 29.5 34 30.8 34 32.5C34 34.2 32.7 35.5 31 35.5H9C7.3 35.5 6.3 33.7 7.3 32.3L21.5 14.5H10C8.4 14.5 7 13.2 7 11.5Z"
              fill="url(#zenveBrandGrad)"
            />
            <circle cx="28" cy="11.5" r="2.3" fill="#FF9500" className="animate-pulse" />
          </svg>
        </div>
      </div>

      {/* Brand Text Details */}
      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1.5">
          <span className={`font-extrabold tracking-tight text-white ${titleSize}`}>
            Zenve
          </span>
          <span
            className={`font-extrabold tracking-tight bg-clip-text text-transparent ${titleSize}`}
            style={{
              backgroundImage: 'linear-gradient(90deg, #00D4E5 0%, #1265FF 100%)',
            }}
          >
            Zippy
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#00D4E5] bg-[#07172B]/90 px-2 py-0.5 rounded-md border border-[#00D4E5]/30">
            Vendor CRM
          </span>
          <span className="text-[10px] text-slate-400 font-medium">Enterprise</span>
        </div>
      </div>
    </motion.div>
  );
}

