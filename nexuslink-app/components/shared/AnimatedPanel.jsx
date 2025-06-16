// File: components/shared/AnimatedPanel.jsx

"use client"; // <-- Tambahkan ini untuk kejelasan

import { motion } from '@/components/utils/motion'; // <-- Ubah baris ini

export default function AnimatedPanel({ children }) {

  const panelVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.div
      variants={panelVariants}
      initial="initial"
      animate="animate"
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg p-8 w-full max-w-2xl"
    >
      {children}
    </motion.div>
  );
}