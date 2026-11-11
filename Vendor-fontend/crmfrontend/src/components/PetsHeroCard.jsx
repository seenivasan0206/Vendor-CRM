import { motion } from 'framer-motion';
import { PawPrint } from 'lucide-react';
import petsCutout from '../assets/pets-cutout.png';

const floatingPaws = [
  { id: 1, top: '6%', left: '4%', delay: 0, duration: 4.6, color: '#00D4E5', rotate: -18, size: 'w-4 h-4' },
  { id: 2, top: '12%', right: '4%', delay: 0.8, duration: 5.2, color: '#FF9500', rotate: 20, size: 'w-4 h-4' },
  { id: 3, bottom: '28%', left: '-4%', delay: 1.4, duration: 4.9, color: '#7B2CFF', rotate: -24, size: 'w-3.5 h-3.5' },
  { id: 4, bottom: '18%', right: '-2%', delay: 0.5, duration: 5.4, color: '#00D4E5', rotate: 16, size: 'w-4 h-4' },
];

export default function PetsHeroCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.85, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="relative group max-w-[330px] xl:max-w-[360px] w-full flex flex-col items-center justify-end select-none"
    >
      {/* Floating Paw-Print Decorations */}
      {floatingPaws.map((paw) => (
        <motion.div
          key={paw.id}
          animate={{
            y: [0, -9, 0],
            opacity: [0.35, 0.85, 0.35],
            rotate: [paw.rotate, paw.rotate + 10, paw.rotate],
          }}
          transition={{
            duration: paw.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: paw.delay,
          }}
          style={{
            top: paw.top,
            left: paw.left,
            right: paw.right,
            bottom: paw.bottom,
            color: paw.color,
          }}
          className="absolute z-20 pointer-events-none drop-shadow-[0_0_8px_rgba(0,212,229,0.55)]"
        >
          <PawPrint className={paw.size} />
        </motion.div>
      ))}

      {/* Subtle Ambient Rim Aura Behind Animals (No Card Box) */}
      <motion.div
        animate={{
          opacity: [0.45, 0.7, 0.45],
          scale: [0.98, 1.03, 0.98],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-x-6 top-6 bottom-4 rounded-full blur-2xl pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 50% 55%, rgba(0,212,229,0.22) 0%, rgba(18,101,255,0.16) 45%, transparent 75%)',
        }}
      />

      {/* Lifelike Sitting Golden Retriever & Cute Cat (Breathing + Micro-Sway Anchored at Paws) */}
      <motion.div
        style={{ transformOrigin: 'bottom center' }}
        animate={{
          scaleY: [1, 1.018, 1],
          scaleX: [1, 0.996, 1],
          rotate: [-0.35, 0.45, -0.35],
        }}
        transition={{
          scaleY: { duration: 3.6, repeat: Infinity, ease: 'easeInOut' },
          scaleX: { duration: 3.6, repeat: Infinity, ease: 'easeInOut' },
          rotate: { duration: 5.8, repeat: Infinity, ease: 'easeInOut' },
        }}
        className="relative z-10 w-full flex justify-center pointer-events-none"
      >
        <img
          src={petsCutout}
          alt="Realistic golden retriever dog and cute cat sitting together"
          className="w-full max-h-[215px] sm:max-h-[235px] lg:max-h-[230px] xl:max-h-[255px] object-contain object-bottom drop-shadow-[0_14px_24px_rgba(0,0,0,0.75)]"
          style={{
            maskImage: 'linear-gradient(to bottom, black 92%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 92%, transparent 100%)',
          }}
          loading="eager"
        />
      </motion.div>

      {/* Realistic Ground Contact Shadow & Soft Cyan Reflection Line Under Paws */}
      <div className="relative z-0 -mt-2 w-[82%] flex flex-col items-center pointer-events-none">
        <div
          className="w-full h-3 rounded-full blur-md"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.92) 0%, rgba(2, 11, 26, 0.65) 60%, transparent 100%)',
          }}
        />
        <div
          className="w-3/4 h-[1.5px] -mt-1.5 rounded-full opacity-55"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(0,212,229,0.75) 50%, transparent 100%)',
          }}
        />
      </div>
    </motion.div>
  );
}
