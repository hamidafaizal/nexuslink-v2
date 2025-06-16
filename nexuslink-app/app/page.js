// File: app/page.js
"use client";

import { useState, useEffect } from "react";
import { Toaster } from 'react-hot-toast';
import MainNavbar from "@/components/layout/MainNavbar";
import CSVUploader from "@/components/Navbar1/CSVUploader";
import ResultsTable from "@/components/Navbar1/ResultsTable";
import Navbar2Page from "@/components/Navbar2/Navbar2Page";
import Navbar3Page from "@/components/Navbar3/Navbar3Page";

export default function HomePage() {
  const [activeView, setActiveView] = useState('navbar3');
  const [threshold, setThreshold] = useState(0);
  const [isThresholdSet, setIsThresholdSet] = useState(false);
  const [linkBucket, setLinkBucket] = useState([]);
  const [processedResults, setProcessedResults] = useState(null);
  const [commissionThreshold, setCommissionThreshold] = useState('');

  const handleSetThreshold = (newThreshold) => {
    setThreshold(Number(newThreshold));
    setIsThresholdSet(true);
    setActiveView('navbar1');
  };

  const handleProcessingComplete = (data) => {
    const initialData = data.map(item => ({ ...item, commission: null, status: 'pending' }));
    setProcessedResults(initialData);
  };

  const handleReset = () => {
    setProcessedResults(null);
    setLinkBucket([]);
    setIsThresholdSet(false);
    setThreshold(0);
    setCommissionThreshold('');
    setActiveView('navbar3');
  };

  const handleApproveAndSend = (approvedFiles) => {
    if (!processedResults || !commissionThreshold) {
      alert("Treshold komisi belum diatur di Navbar 1.");
      return;
    }

    const numericThreshold = Number(commissionThreshold);
    let newLinksForBucket = [];

    // Gunakan Functional Update untuk keamanan maksimum
    setProcessedResults(prevResults => {
      // Mulai dengan salinan baru dari state sebelumnya
      let updatedResults = [...prevResults];
      
      // 1. Temukan semua indeks dari link yang statusnya masih 'pending'
      let pendingLinkIndices = [];
      updatedResults.forEach((item, index) => {
        if (item.status === 'pending') {
          pendingLinkIndices.push(index);
        }
      });

      let pendingLinkCursor = 0; // Penunjuk untuk melacak link pending berikutnya

      // 2. Loop melalui setiap file yang SUKSES dianalisa
      approvedFiles.forEach(file => {
        if (file.status === 'sukses' && file.commissions) {
          
          // 3. Loop melalui setiap komisi di dalam file tersebut
          file.commissions.forEach(comm => {
            // Pastikan kita tidak melebihi jumlah link yang pending
            if (pendingLinkCursor < pendingLinkIndices.length) {
              
              // Ambil indeks global dari link pending berikutnya yang akan diisi
              const targetGlobalIndex = pendingLinkIndices[pendingLinkCursor];
              
              const commissionValue = parseInt(String(comm.commission_percent).replace('%', '')) || 0;
              let newStatus = commissionValue >= numericThreshold ? 'Terkirim' : 'Ditolak';

              // 4. Perbarui item pada indeks yang TEPAT secara immutable
              updatedResults[targetGlobalIndex] = {
                ...updatedResults[targetGlobalIndex],
                commission: commissionValue,
                status: newStatus
              };
              
              if (newStatus === 'Terkirim') {
                newLinksForBucket.push(updatedResults[targetGlobalIndex]);
              }
              
              // Maju ke link pending berikutnya
              pendingLinkCursor++;
            }
          });
        }
      });
      
      return updatedResults; // Kembalikan seluruh data yang sudah diperbarui
    });

    // Tuang ke ember setelah state di atas selesai di-update
    setTimeout(() => {
      if (newLinksForBucket.length > 0) {
        setLinkBucket(prevBucket => {
          const combinedLinks = [...prevBucket, ...newLinksForBucket];
          const uniqueProductLinks = new Map(combinedLinks.map(item => [item.productLink, item]));
          const finalBucketContent = Array.from(uniqueProductLinks.values()).slice(0, threshold);
          return finalBucketContent;
        });
        alert(`${newLinksForBucket.length} link baru telah ditambahkan ke ember!`);
      } else {
        alert("Tidak ada link baru yang ditambahkan ke ember (semua di bawah treshold).");
      }
      setActiveView('navbar3');
    }, 0);
  };
  
  // Di dalam file app/page.js

  return (
    // Bagian <main> kita ubah untuk menggunakan background image
    <main
      className="min-h-screen w-full relative bg-cover bg-center"
      style={{
        backgroundImage: "url('/images/3409297.jpg')", // Menggunakan file lokal Anda
      }}
    >
      {/* Lapisan overlay gelap agar konten tetap terbaca */}
      <div className="absolute inset-0 bg-black/60 z-0" />

      {/* Konten aplikasi kita letakkan di atas lapisan overlay */}
      <div className="relative z-10 flex flex-col items-center w-full min-h-screen">
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: '#333',
              color: '#fff',
            },
          }}
        />
        
        <MainNavbar 
          activeView={activeView} 
          setActiveView={setActiveView} 
          isNavLocked={!isThresholdSet} 
        />
        
        <div className="flex-grow flex items-center justify-center w-full p-4">
          {activeView === 'navbar1' && (
            !processedResults ? 
            <CSVUploader onProcessComplete={handleProcessingComplete} commissionThreshold={commissionThreshold} setCommissionThreshold={setCommissionThreshold} /> : 
            <ResultsTable data={processedResults} onReset={handleReset} />
          )}
          {activeView === 'navbar2' && (
            <Navbar2Page processedResults={processedResults} onApproveAndSend={handleApproveAndSend} />
          )}
          {activeView === 'navbar3' && (
            <Navbar3Page
              threshold={threshold}
              isThresholdSet={isThresholdSet}
              onSetThreshold={handleSetThreshold}
              linkBucket={linkBucket}
              onDistributeBatch={() => {}} // Placeholder karena belum ada fungsi real
            />
          )}
        </div>
      </div>
    </main>
  );
}