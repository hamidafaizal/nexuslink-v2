// File: components/layout/MainNavbar.jsx
"use client";

import Image from 'next/image';
import { motion } from 'framer-motion';

const navItems = [
  'Upload File Riset',
  'Komreg',
  'Distribusi Link'
];
const viewNames = ['navbar1', 'navbar2', 'navbar3'];

export default function MainNavbar({ activeView, setActiveView, isNavLocked }) {
  return (
    <nav className="w-full p-4 fixed top-0 left-0 z-50">
      {/* Container utama dengan efek glassmorphism, sesuai referensi */}
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between bg-black/10 backdrop-blur-lg p-2 pl-6 pr-4 rounded-full border border-white/10">
        
        {/* BAGIAN KIRI: Logo */}
        <div className="relative h-8 w-28">
          <Image
            src="/images/WINPROD_logo_horizontal.svg" // Ganti dengan path logo Anda
            alt="Logo Aplikasi"
            layout="fill"
            objectFit="contain"
          />
        </div>

        {/* BAGIAN TENGAH: Tombol Navigasi Utama */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <ul className="flex items-center space-x-2">
            {navItems.map((item, index) => {
              const viewName = viewNames[index];
              const isActive = activeView === viewName;
              const isDisabled = isNavLocked && (viewName === 'navbar1' || viewName === 'navbar2');

              return (
                <li key={item} className="relative">
                  <button
                    onClick={() => setActiveView(viewName)}
                    disabled={isDisabled}
                    className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-200 whitespace-nowrap ${
                      isActive ? 'text-white' : 'text-white/60'
                    } ${
                      isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {item}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        
        {/* BAGIAN KANAN: Tombol Login */}
        <div className="flex items-center gap-4">
            <button className="text-white/70 hover:text-white text-sm font-semibold transition-colors">
                Login
            </button>
            <button className="bg-white text-black text-sm font-bold px-4 py-2 rounded-full hover:bg-gray-200 transition-colors">
                Start free trial
            </button>
        </div>

      </div>
    </nav>
  );
}