// File: components/Navbar3/Navbar3Page.jsx
"use client";

import { useState, useMemo } from "react";
import { PieChart } from 'react-minimal-pie-chart';
import toast from 'react-hot-toast'; // <-- 1. IMPOR TOAST DI SINI
import AnimatedPanel from '@/components/shared/AnimatedPanel';

// Data HP Tujuan (bisa dipindahkan ke database nanti)
const destinationPhones = [
  { name: 'HP Admin 1', number: '6281234567890' },
  { name: 'HP Admin 2', number: '6281234567891' },
  { name: 'HP Tim A', number: '6281234567892' },
];

export default function Navbar3Page({ 
  threshold, 
  isThresholdSet, 
  onSetThreshold, 
  linkBucket,
  onDistributeBatch
}) {
  const [thresholdInput, setThresholdInput] = useState('');
  const [selectedPhones, setSelectedPhones] = useState({});

  const batches = useMemo(() => {
    if (!linkBucket || linkBucket.length === 0) return [];
    const batchSize = 100;
    const createdBatches = [];
    for (let i = 0; i < linkBucket.length; i += batchSize) {
      const chunk = linkBucket.slice(i, i + batchSize);
      createdBatches.push({
        id: i / batchSize,
        links: chunk.map(item => item.productLink),
        isFull: chunk.length === batchSize,
      });
    }
    return createdBatches;
  }, [linkBucket]);
  
  const handleSetThresholdClick = () => {
    if (Number(thresholdInput) > 0 && Number(thresholdInput) % 100 === 0) {
      onSetThreshold(thresholdInput);
    } else {
      // !! 2. GANTI alert() MENJADI toast.error() !!
      toast.error("Mohon masukkan angka threshold kelipatan 100.");
    }
  };

  const handlePhoneSelection = (batchId, phoneNumber) => {
    setSelectedPhones(prev => ({ ...prev, [batchId]: phoneNumber }));
  };

  const handleSendToWhatsApp = (batch) => {
    const selectedPhone = selectedPhones[batch.id];
    if (!selectedPhone) {
      // !! 3. GANTI alert() MENJADI toast.error() JUGA !!
      toast.error(`Mohon pilih HP tujuan untuk Batch ${batch.id + 1}.`);
      return;
    }

    const message = batch.links.join('\n');
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://web.whatsapp.com/send?phone=${selectedPhone}&text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    toast.success(`Batch ${batch.id + 1} sedang dibuka di WhatsApp...`);
    
    onDistributeBatch(batch.links);
  };

  if (!linkBucket && !isThresholdSet) {
    return (
      <AnimatedPanel>
        <div className="text-white text-center">
            <h2 className="text-2xl font-bold">Navbar 3: Distribusi Link</h2>
            <p className="text-white/70 mt-2">Silakan atur threshold untuk memulai.</p>
        </div>
      </AnimatedPanel>
    );
  }

  return (
    <AnimatedPanel>
        <div className="text-white">
            <h2 className="text-2xl font-bold text-center">Navbar 3: Distribusi Link</h2>
            
            {!isThresholdSet ? (
              <div className="mt-6 text-center">
                <p className="text-white/80 mb-2">Tentukan jumlah link target (threshold) untuk memulai.</p>
                <input type="number" step="100" placeholder="Contoh: 300" value={thresholdInput} onChange={(e) => setThresholdInput(e.target.value)} className="w-full max-w-xs mx-auto bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white text-center focus:outline-none focus:ring-2 focus:ring-purple-400"/>
                <button onClick={handleSetThresholdClick} className="w-full max-w-xs mx-auto mt-4 font-bold py-3 rounded-lg shadow-lg transform transition-all duration-300 bg-purple-600 hover:bg-purple-500 scale-100 hover:scale-105">SET THRESHOLD & MULAI</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
                <div className="text-center">
                  <h3 className="font-semibold">Progress "Ember"</h3>
                  <div className="w-48 h-48 mx-auto my-4 relative">
                    <PieChart data={[{ value: linkBucket.length, color: '#8b5cf6' }]} totalValue={Number(threshold) || 1} lineWidth={20} background="#374151" animate/>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <span className="text-3xl font-bold">{Number(threshold) > 0 ? Math.round((linkBucket.length / Number(threshold)) * 100) : 0}%</span>
                    </div>
                  </div>
                  <p className="text-sm">Terkumpul: <span className="font-bold">{linkBucket.length}</span> / {threshold} Link</p>
                  <p className="text-xs text-white/60 mt-2">Kumpulkan lebih banyak link dari Navbar 1.</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Batch Siap Distribusi</h3>
                  <div className="space-y-3 max-h-[50vh] overflow-auto pr-2">
                    {batches.length > 0 ? batches.map(batch => (
                      <div key={batch.id} className="p-4 rounded-lg bg-gray-500/20 border border-gray-400">
                        <p className="font-bold">Batch {batch.id + 1} ({batch.links.length}/100)</p>
                        <div className="flex gap-2 mt-3">
                           <select onChange={(e) => handlePhoneSelection(batch.id, e.target.value)} defaultValue="" className="w-full bg-black/30 border border-white/20 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400">
                               <option value="" disabled>Pilih HP Tujuan</option>
                               {destinationPhones.map(phone => <option key={phone.number} value={phone.number}>{phone.name}</option>)}
                           </select>
                           <button onClick={() => handleSendToWhatsApp(batch)} disabled={!batch.isFull} className="px-4 py-2 font-bold text-sm bg-green-600 hover:bg-green-500 rounded-lg whitespace-nowrap transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">KIRIM</button>
                        </div>
                      </div>
                    )) : <p className="text-sm text-center text-white/70 py-10">"Ember" masih kosong atau link belum cukup.</p>}
                  </div>
                </div>
              </div>
            )}
        </div>
    </AnimatedPanel>
  );
}