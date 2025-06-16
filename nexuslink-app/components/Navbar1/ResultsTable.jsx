// File: components/Navbar1/ResultsTable.jsx
"use client";

import { useMemo } from 'react';
import AnimatedPanel from '@/components/shared/AnimatedPanel';

// Komponen sekarang lebih sederhana
export default function ResultsTable({ data, onReset }) { 
  console.log("[ResultsTable] Menerima dan merender data:", data);

  const handleCopyBatch = (batchIndex) => {
    const batchSize = 100;
    const startIndex = batchIndex * batchSize;
    const batchData = data.slice(startIndex, startIndex + batchSize);
    const linksToCopy = batchData.map(item => item.productLink).join('\n');

    navigator.clipboard.writeText(linksToCopy).then(() => {
      alert(`Berhasil menyalin ${batchData.length} link (batch ${batchIndex + 1}) ke clipboard!`);
    }, (err) => {
      console.error('Gagal menyalin teks: ', err);
      alert('Gagal menyalin link.');
    });
  };

  const copyBatches = useMemo(() => {
    if (!data) return [];
    const batchCount = Math.ceil(data.length / 100);
    return Array.from({ length: batchCount }, (_, i) => i);
  }, [data]);

  if (!data || data.length === 0) {
    return ( <AnimatedPanel><p className="text-white text-center">Tidak ada data untuk ditampilkan.</p></AnimatedPanel> )
  }

  return (
    <AnimatedPanel>
      <div className="text-white mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Hasil Filter</h2>
        <span className="bg-purple-500 text-xs font-semibold px-3 py-1 rounded-full">{data.length} Link Ditemukan</span>
      </div>

      <div className="overflow-auto max-h-[50vh] border border-white/10 rounded-lg">
        <table className="w-full text-white text-left">
          <thead className="bg-white/5">
            <tr className="border-b border-white/10">
              <th className="p-3 text-sm font-semibold sticky top-0 bg-white/10 backdrop-blur-sm">No.</th>
              <th className="p-3 text-sm font-semibold sticky top-0 bg-white/10 backdrop-blur-sm">Link Produk</th>
              <th className="p-3 text-sm font-semibold sticky top-0 bg-white/10 backdrop-blur-sm">Komisi</th>
              {/* !! KOLOM BARU !! */}
              <th className="p-3 text-sm font-semibold sticky top-0 bg-white/10 backdrop-blur-sm text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={item.productLink + index} className="border-b border-white/10 hover:bg-white/5">
                <td className="p-3 text-sm">{index + 1}</td>
                <td className="p-3 text-sm break-all">
                    <a href={item.productLink} target="_blank" rel="noopener noreferrer" className="hover:text-purple-300 transition-colors">
                        {item.productLink}
                    </a>
                </td>
                <td className="p-3 text-sm font-semibold">{item.commission !== null ? item.commission.toLocaleString('id-ID') : '...'}</td>
                
                {/* !! KONTEN KOLOM BARU !! */}
                <td className="p-3 text-sm text-center">
                  {item.status === 'Terkirim' && (
                    <span className="px-2 py-1 text-xs font-semibold text-white bg-green-600 rounded-full">Terkirim</span>
                  )}
                  {item.status === 'Ditolak' && (
                    <span className="px-2 py-1 text-xs font-semibold text-white bg-red-600 rounded-full">Ditolak</span>
                  )}
                  {/* Jika status 'pending', kolom akan kosong */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className='mt-6 pt-4 border-t border-white/10'>
          <p className='text-sm text-white/80 mb-3 text-center'>Salin link per batch untuk dianalisa:</p>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
              {copyBatches.map(batchIndex => {
                  const start = batchIndex * 100 + 1;
                  const end = Math.min((batchIndex + 1) * 100, data.length);
                  return ( <button key={batchIndex} onClick={() => handleCopyBatch(batchIndex)} className="text-xs font-semibold py-2 px-3 rounded-lg shadow-md transform transition-all duration-300 bg-gray-600 hover:bg-gray-500 scale-100 hover:scale-105">Copy Link {start}-{end}</button> )
              })}
          </div>
      </div>
      
      {/* Tombol aksi sekarang hanya ada RESET */}
      <div className="flex gap-4 mt-6">
        <button onClick={onReset} className="w-full font-bold py-3 rounded-lg shadow-lg transform transition-all duration-300 bg-red-600 hover:bg-red-500 scale-100 hover:scale-105">RESET SEMUA PROSES</button>
      </div>
    </AnimatedPanel>
  );
}