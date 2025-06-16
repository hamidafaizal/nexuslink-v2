// File: components/Navbar2/ProgressPanel.jsx
"use client";

export default function ProgressPanel({ currentBatch, totalBatches, linksCompleted, totalLinks, ssApproved, totalSs }) {

  const percentage = totalSs > 0 ? Math.round((ssApproved / totalSs) * 100) : 0;

  return (
    <div className="my-6 p-4 bg-black/20 rounded-lg text-center">
      <p className="text-lg font-semibold">
        {`Batch ${currentBatch} dari ${totalBatches}`}
      </p>
      
      {/* Progress Bar Visual */}
      <div className="w-full bg-black/30 rounded-full h-2.5 my-3">
        <div 
          className="bg-purple-600 h-2.5 rounded-full transition-all duration-500" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>

      {/* Indikator Teks Detail */}
      <div className="text-xs text-white/70 flex justify-between px-1">
        <span>Link Terisi Komisi: {linksCompleted}/{totalLinks}</span>
        <span>SS Diapprove: {ssApproved}/{totalSs}</span>
      </div>
    </div>
  );
}