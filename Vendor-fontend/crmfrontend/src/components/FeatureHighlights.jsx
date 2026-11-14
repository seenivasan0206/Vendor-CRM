import { motion } from 'framer-motion';
import { Users2, Clock3, ShieldCheck } from 'lucide-react';

const features = [
  {
    id: 'vendors',
    title: 'Manage Vendors with Ease',
    desc: 'Unified onboarding & compliance ratings.',
    icon: Users2,
    iconColor: '#00D4E5',
    badge: '3,200+ Vendors',
    glow: 'from-[#00D4E5]/15 to-[#1265FF]/10',
  },
  {
    id: 'purchase-orders',
    title: 'Track Purchase Orders in Real-Time',
    desc: 'Live delivery alerts & PO tracking.',
    icon: Clock3,
    iconColor: '#1265FF',
    badge: 'Live PO Sync',
    glow: 'from-[#1265FF]/15 to-[#7B2CFF]/10',
  },
  {
    id: 'contracts',
    title: 'Handle Contracts Securely',
    desc: 'Encrypted vault & renewal alerts.',
    icon: ShieldCheck,
    iconColor: '#FF9500',
    badge: '256-Bit TLS',
    glow: 'from-[#7B2CFF]/15 to-[#00D4E5]/10',
  },
];

export default function FeatureHighlights() {
  return (
    <div className="flex flex-col gap-2.5 w-full">
      {features.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.55,
              delay: 0.15 + index * 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            whileHover={{ x: 4, transition: { duration: 0.2 } }}
            className="group relative rounded-[18px] p-2.5 sm:p-3 bg-[#07172B]/65 hover:bg-[#07172B]/85 border border-[#00D4E5]/18 hover:border-[#00D4E5]/45 backdrop-blur-xl transition-all duration-300 shadow-[0_8px_24px_rgba(0,0,0,0.45)] hover:shadow-[0_0_24px_rgba(0,212,229,0.2)]"
          >
            {/* Ambient Hover Glow */}
            <div
              className={`absolute inset-0 rounded-[18px] bg-gradient-to-r ${item.glow} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`}
            />

            <div className="relative flex items-center gap-3">
              {/* Icon Vessel */}
              <div className="relative flex-shrink-0">
                <div className="w-9 h-9 xl:w-10 xl:h-10 rounded-full bg-[#020B1A]/85 border border-[#00D4E5]/30 flex items-center justify-center group-hover:scale-105 group-hover:border-[#00D4E5]/65 transition-transform duration-300 shadow-inner">
                  <IconComponent
                    className="w-4 h-4 xl:w-5 xl:h-5 drop-shadow-[0_0_8px_rgba(0,212,229,0.5)]"
                    style={{ color: item.iconColor }}
                  />
                </div>
              </div>

              {/* Text Content */}
              <div className="flex-1 min-w-0">
                <h4 className="text-xs sm:text-[13px] xl:text-sm font-semibold text-white tracking-tight leading-snug group-hover:text-[#00D4E5] transition-colors">
                  {item.title}
                </h4>
                <div className="hidden sm:flex items-center justify-between gap-2 mt-0.5">
                  <p className="text-[11px] text-slate-400 leading-tight font-normal truncate">
                    {item.desc}
                  </p>
                  <span className="hidden xl:inline-block shrink-0 text-[9px] font-medium text-slate-300 bg-[#020B1A]/75 px-1.5 py-0.5 rounded-full border border-[#00D4E5]/20">
                    {item.badge}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}