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
   <nav style={{ width: '100%', padding: '16px', position: 'fixed', top: 0, left: 0, zIndex: 50 }}>
     {/* Container utama dengan efek glassmorphism */}
     <div style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(4, 5, 41, 0.8)', backdropFilter: 'blur(12px)', padding: '8px 16px 8px 24px', borderRadius: '50px', border: '1px solid #19386D' }}>
       
       {/* BAGIAN KIRI: Logo */}
       <div style={{ position: 'relative', height: '32px', width: '112px' }}>
         <Image
           src="/images/WINPROD_logo_horizontal.svg"
           alt="Logo Aplikasi"
           layout="fill"
           objectFit="contain"
         />
       </div>

       {/* BAGIAN TENGAH: Tombol Navigasi Utama */}
       <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
         <ul style={{ display: 'flex', alignItems: 'center', gap: '8px', listStyle: 'none', margin: 0, padding: 0 }}>
           {navItems.map((item, index) => {
             const viewName = viewNames[index];
             const isActive = activeView === viewName;
             const isDisabled = isNavLocked && (viewName === 'navbar1' || viewName === 'navbar2');

             return (
               <li key={item} style={{ position: 'relative' }}>
                 <button
                   onClick={() => setActiveView(viewName)}
                   disabled={isDisabled}
                   style={{
                     padding: '8px 16px',
                     fontSize: '14px',
                     fontWeight: '600',
                     borderRadius: '50px',
                     transition: 'all 0.2s ease',
                     whiteSpace: 'nowrap',
                     border: 'none',
                     cursor: isDisabled ? 'not-allowed' : 'pointer',
                     color: isActive ? '#77F7F0' : '#59C6D4',
                     backgroundColor: isActive ? 'rgba(119, 247, 240, 0.15)' : 'transparent',
                     opacity: isDisabled ? 0.5 : 1
                   }}
                   onMouseEnter={(e) => {
                     if (!isDisabled && !isActive) {
                       e.target.style.color = '#77F7F0';
                       e.target.style.backgroundColor = 'rgba(119, 247, 240, 0.05)';
                     }
                   }}
                   onMouseLeave={(e) => {
                     if (!isDisabled && !isActive) {
                       e.target.style.color = '#59C6D4';
                       e.target.style.backgroundColor = 'transparent';
                     }
                   }}
                 >
                   {item}
                 </button>
               </li>
             );
           })}
         </ul>
       </div>
       
       {/* BAGIAN KANAN: Tombol Login */}
       <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
           <button style={{
             color: '#59C6D4',
             fontSize: '14px',
             fontWeight: '600',
             transition: 'color 0.2s ease',
             border: 'none',
             background: 'none',
             cursor: 'pointer'
           }}
           onMouseEnter={(e) => e.target.style.color = '#77F7F0'}
           onMouseLeave={(e) => e.target.style.color = '#59C6D4'}>
               Login
           </button>
           <button style={{
             background: 'linear-gradient(135deg, #59C6D4 0%, #4091B2 100%)',
             color: 'white',
             fontSize: '14px',
             fontWeight: 'bold',
             padding: '8px 16px',
             borderRadius: '50px',
             transition: 'all 0.2s ease',
             border: 'none',
             cursor: 'pointer'
           }}
           onMouseEnter={(e) => {
             e.target.style.background = 'linear-gradient(135deg, #4091B2 0%, #2A6190 100%)';
             e.target.style.transform = 'translateY(-1px)';
           }}
           onMouseLeave={(e) => {
             e.target.style.background = 'linear-gradient(135deg, #59C6D4 0%, #4091B2 100%)';
             e.target.style.transform = 'translateY(0)';
           }}>
               Start free trial
           </button>
       </div>

     </div>
   </nav>
 );
}