import { motion } from 'framer-motion';
import { ROLES } from '../constants/roles';

export default function RoleSelector({ selectedRole, onSelectRole }) {
  return (
    <div className="w-full space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-300">
          Select Role
        </label>
        <span className="text-[11px] text-[#00D4E5] font-medium">
          {ROLES.find((r) => r.id === selectedRole)?.description}
        </span>
      </div>

      {/* Segmented Apple-style Control Container */}
      <div className="grid grid-cols-3 p-1 rounded-[16px] bg-[#020B1A]/75 border border-[#00D4E5]/20 backdrop-blur-md relative gap-1 shadow-inner">
        {ROLES.map((role) => {
          const isSelected = selectedRole === role.id;
          const Icon = role.icon;

          return (
            <motion.button
              key={role.id}
              type="button"
              onClick={() => onSelectRole(role.id)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              aria-pressed={isSelected}
              className={`relative z-10 flex flex-col sm:flex-row items-center justify-center gap-1.5 py-1.5 sm:py-2 px-1.5 rounded-[12px] text-[11px] font-semibold transition-colors duration-200 cursor-pointer ${
                isSelected
                  ? 'text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Active Indicator Sliding Pill */}
              {isSelected && (
                <motion.div
                  layoutId="activeRoleIndicator"
                  className="absolute inset-0 rounded-[12px] border border-[#00D4E5]/55 -z-10"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(0,212,229,0.22) 0%, rgba(18,101,255,0.28) 100%)',
                    boxShadow: '0 0 18px rgba(0, 212, 229, 0.28)',
                  }}
                  transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                />
              )}

              <Icon
                className="w-3.5 h-3.5 transition-colors flex-shrink-0"
                style={{
                  color: isSelected ? '#00D4E5' : undefined,
                  filter: isSelected ? 'drop-shadow(0 0 6px rgba(0,212,229,0.8))' : undefined,
                }}
              />
              <span className="text-center leading-tight">{role.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

