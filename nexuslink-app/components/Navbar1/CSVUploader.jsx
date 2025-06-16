// File: components/Navbar1/CSVUploader.jsx
"use client";

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import AnimatedPanel from '@/components/shared/AnimatedPanel';

export default function CSVUploader({ onProcessComplete, commissionThreshold, setCommissionThreshold }) {
  const [rank, setRank] = useState('');
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    setFiles(acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'text/csv': ['.csv'] }
  });

  const handleProcessClick = async () => {
    if (!rank || files.length === 0 || !commissionThreshold) {
      alert("Mohon isi semua kolom (Rank, Treshold Komisi) dan pilih file CSV.");
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append('rank', rank);
    formData.append('commission_threshold', commissionThreshold); 
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('http://localhost:8000/api/process-csv', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Gagal memproses file di backend.');
      const data = await response.json();
      onProcessComplete(data);
    } catch (error) {
      console.error("Error saat proses CSV:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatedPanel>
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Navbar 1: Filter & Kumpulkan Link</h2>
        
        <div className="grid grid-cols-2 gap-4 my-6 text-left">
            <div>
              <label htmlFor="rankInput" className="block text-white/80 mb-2 font-semibold">Input Angka Rank</label>
              <input id="rankInput" type="number" placeholder="Contoh: 50" value={rank} onChange={(e) => setRank(e.target.value)} className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"/>
            </div>
            <div>
              <label htmlFor="commissionThresholdInput" className="block text-white/80 mb-2 font-semibold">Treshold Komisi</label>
              <input id="commissionThresholdInput" type="number" placeholder="Contoh: 1000" value={commissionThreshold} onChange={(e) => setCommissionThreshold(e.target.value)} className="w-full bg-black/20 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"/>
            </div>
        </div>

        <div className="text-left mb-6">
          <label className="block text-white/80 mb-2 font-semibold">Upload File CSV</label>
          <div {...getRootProps()} className={`relative border-2 border-dashed border-white/30 rounded-lg p-8 text-center cursor-pointer hover:border-purple-400 hover:bg-white/5 transition-all duration-300 ${isDragActive ? 'border-purple-400 bg-white/10' : ''}`}>
            <input {...getInputProps()} />
            <div className='flex flex-col items-center justify-center space-y-2 pointer-events-none'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-4-4V7a4 4 0 014-4h.586a1 1 0 01.707.293l.414.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l.414-.414a1 1 0 01.707-.293H17a4 4 0 014 4v5a4 4 0 01-4 4H7z" /></svg>
                {files.length === 0 ? <p className='text-sm'>Seret & lepas file CSV di sini, atau <span className='font-semibold text-purple-300'>klik</span></p> : <p className='text-sm font-semibold text-green-400'>{files.length} file dipilih</p>}
            </div>
          </div>
        </div>

        <button onClick={handleProcessClick} disabled={isLoading} className="w-full font-bold py-3 rounded-lg shadow-lg transform transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-purple-600 hover:bg-purple-500 scale-100 hover:scale-105">
          {isLoading ? 'Memproses...' : 'PROSES'}
        </button>
      </div>
    </AnimatedPanel>
  );
}