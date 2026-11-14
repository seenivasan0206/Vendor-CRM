import { motion } from 'framer-motion';
import ZenveLogo from './ZenveLogo';
import FeatureHighlights from './FeatureHighlights';
import PetsHeroCard from './PetsHeroCard';

export default function BrandingSection() {
  return (
    <div className="flex flex-col justify-center h-full py-1 relative z-10">
      {/* Desktop Logo & Welcome Header (Hidden on Mobile since Mobile displays compact header above Login Card) */}
      <div className="hidden lg:block">
        {/* 1. Zenve Zippy Logo at Top Left */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-3 xl:mb-4"
        >
          <ZenveLogo size="md" />
        </motion.div>

        {/* 2. Welcome Headline & Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-1.5 mb-4 xl:mb-5"
        >
          <h1 className="text-3xl xl:text-[40px] font-black tracking-tight text-white leading-[1.1]">
            Welcome to{' '}
            <span className="text-white">Zenve Zippy </span>
            <br />
            <span
              className="inline-block bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(0,212,229,0.4)]"
              style={{
                backgroundImage: 'linear-gradient(90deg, #00D4E5 0%, #38bdf8 60%, #1265FF 100%)',
              }}
            >
              Vendor CRM
            </span>
          </h1>

          <p className="text-sm xl:text-base font-medium text-slate-300 leading-snug max-w-lg">
            Smarter Vendor Management.{' '}
            <span className="text-[#00D4E5] font-semibold">Stronger Business Growth.</span>
          </p>

          {/* Subtle Cyan Accent Bar */}
          <div className="pt-1.5">
            <div className="h-[3px] w-16 rounded-full bg-gradient-to-r from-[#00D4E5] to-[#1265FF] shadow-[0_0_12px_rgba(0,212,229,0.65)]" />
          </div>
        </motion.div>
      </div>

      {/* 3 & 4. Feature Highlights (Left) + Golden Retriever & Cat Picture (In Between Features and Login Card) */}
      <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-4 xl:gap-6 w-full">
        <div className="w-full md:w-[48%] xl:w-[47%]">
          <FeatureHighlights />
        </div>

        <div className="w-full md:w-[52%] xl:w-[53%] flex justify-center md:justify-start">
          <PetsHeroCard />
        </div>
      </div>
    </div>
  );
}