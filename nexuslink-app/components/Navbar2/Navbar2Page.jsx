// File: components/Navbar2/Navbar2Page.jsx
"use client";

import { useState, useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import AnimatedPanel from '@/components/shared/AnimatedPanel';

export default function Navbar2Page({ processedResults, onApproveAndSend }) {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    const sortedFiles = acceptedFiles.sort((a, b) => a.name.localeCompare(b.name));
    const newFilesState = sortedFiles.map(file => ({
      id: `${file.name}-${file.lastModified}`,
      file: file,
      fileName: file.name,
      status: 'Menunggu',
      commissions: null,
      error: null,
    }));
    setUploadedFiles(newFilesState);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [] },
    multiple: true,
  });

  const handleAnalyzeAll = async () => {
    const filesToAnalyze = uploadedFiles.filter(f => f.status === 'Menunggu' || f.status === 'Gagal');
    if (filesToAnalyze.length === 0) {
      alert("Tidak ada file baru atau file gagal untuk dianalisa.");
      return;
    }
    setIsLoading(true);
    setUploadedFiles(prev => prev.map(f => (f.status === 'Menunggu' || f.status === 'Gagal') ? { ...f, status: 'Menganalisa...' } : f));
    const formData = new FormData();
    filesToAnalyze.forEach(item => {
      formData.append('files', item.file, item.fileName);
    });
    try {
      const response = await fetch('http://localhost:8000/api/analyze-multiple-images', { method: 'POST', body: formData });
      if (!response.ok) throw new Error('Gagal menganalisa gambar di backend.');
      const results = await response.json();
      setUploadedFiles(prevFiles => {
        return prevFiles.map(pf => {
          const result = results.find(r => r.fileName === pf.fileName);
          return result ? { ...pf, status: result.status, commissions: result.commissions, error: result.error } : pf;
        });
      });
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleApproveAndSendClick = () => {
    const successfulFiles = uploadedFiles.filter(f => f.status === 'sukses');
    if (successfulFiles.length === 0) {
      alert("Tidak ada hasil analisa yang sukses untuk disetujui.");
      return;
    }
    onApproveAndSend(successfulFiles, processedResults);
  };

  const successfulResults = useMemo(() => {
    return uploadedFiles.filter(f => f.status === 'sukses');
  }, [uploadedFiles]);

  if (!processedResults) {
    return <AnimatedPanel><div className="text-white text-center"><p>Selesaikan proses di Navbar 1 terlebih dahulu.</p></div></AnimatedPanel>;
  }

  const hasFailedFiles = uploadedFiles.some(f => f.status === 'Gagal');

  return (
    <AnimatedPanel>
      <div className="text-white">
        <h2 className="text-2xl font-bold text-center">Navbar 2: Analisa Komisi</h2>
        
        <div className="text-left my-6">
          <label className="block text-white/80 mb-2 font-semibold">Upload Multiple Screenshot (Otomatis Terurut)</label>
          <div {...getRootProps()} className={`relative border-2 border-dashed border-white/30 rounded-lg p-8 text-center cursor-pointer hover:border-purple-400 hover:bg-white/5 transition-all duration-300 ${isDragActive ? 'border-purple-400 bg-white/10' : ''}`}>
            <input {...getInputProps()} />
            <div className='flex flex-col items-center justify-center space-y-2 pointer-events-none'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-4-4V7a4 4 0 014-4h.586a1 1 0 01.707.293l.414.414a1 1 0 00.707.293h3.172a1 1 0 00.707-.293l.414-.414a1 1 0 01.707-.293H17a4 4 0 014 4v5a4 4 0 01-4 4H7z" /></svg>
                {uploadedFiles.length === 0 ? <p className='text-sm'>Seret & lepas SEMUA SS Anda di sini, atau <span className='font-semibold text-purple-300'>klik</span></p> : <p className='text-sm font-semibold text-green-400'>{uploadedFiles.length} file dipilih</p>}
            </div>
          </div>
        </div>

        {uploadedFiles.length > 0 && (
          <div className="space-y-3">
            {/* Bagian Gagal (jika ada) */}
            {uploadedFiles.filter(f => f.status === 'Gagal').length > 0 && (
                <div>
                    <h3 className="font-semibold text-red-400">Analisa Gagal</h3>
                    {/* Logika untuk menampilkan file gagal & tombol ulangi */}
                </div>
            )}
            
            {/* !! BAGIAN YANG DIPERBAIKI !! */}
            {successfulResults.length > 0 && (
                <div className="mt-4">
                    <h3 className="font-semibold text-green-400">Hasil Analisa Sukses</h3>
                    <div className="space-y-2 mt-2 bg-black/20 p-3 rounded-md max-h-[25vh] overflow-auto">
                        {/* Loop untuk menampilkan setiap file yang sukses */}
                        {successfulResults.map(item => (
                            <div key={item.id} className="text-xs py-1 border-b border-white/10 last:border-b-0">
                                <p className="font-bold truncate" title={item.fileName}>{item.fileName}</p>
                                <ul className="list-disc list-inside pl-4 mt-1">
                                    {/* Loop untuk menampilkan setiap komisi di dalam file */}
                                    {item.commissions && item.commissions.length > 0 ? (
                                        item.commissions.map((comm, idx) => (
                                            <li key={idx}>Produk {comm.product_index} = <strong>{comm.commission_percent}</strong></li>
                                        ))
                                    ) : (
                                        <li>Tidak ada komisi terdeteksi.</li>
                                    )}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}
          </div>
        )}

        <div className="flex gap-4 mt-6">
          <button onClick={handleAnalyzeAll} disabled={isLoading || uploadedFiles.length === 0} className="w-full font-bold py-3 rounded-lg ...">
            {isLoading ? 'Menganalisa...' : 'ANALISA SEMUA'}
          </button>
          <button onClick={handleApproveAndSendClick} disabled={isLoading || hasFailedFiles || successfulResults.length === 0} className="w-full font-bold py-3 rounded-lg ... bg-green-600 ...">
            APPROVE & KIRIM
          </button>
        </div>
      </div>
    </AnimatedPanel>
  );
}