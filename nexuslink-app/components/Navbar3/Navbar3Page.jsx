// File: components/Navbar3/Navbar3Page.jsx
"use client";

import { useState, useMemo } from "react";
import { PieChart } from 'react-minimal-pie-chart';
import toast from 'react-hot-toast';
import AnimatedPanel from '@/components/shared/AnimatedPanel';

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
     toast.error("Mohon masukkan angka threshold kelipatan 100.");
   }
 };

 const handlePhoneSelection = (batchId, phoneNumber) => {
   setSelectedPhones(prev => ({ ...prev, [batchId]: phoneNumber }));
 };

 const handleSendToWhatsApp = (batch) => {
   const selectedPhone = selectedPhones[batch.id];
   if (!selectedPhone) {
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
       <div style={{ color: '#77F7F0', textAlign: 'center' }}>
           <h2 style={{ fontSize: '28px', fontWeight: 'bold', background: 'linear-gradient(90deg, #77F7F0 0%, #59C6D4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Navbar 3: Distribusi Link</h2>
           <p style={{ color: '#59C6D4', marginTop: '8px' }}>Silakan atur threshold untuk memulai.</p>
       </div>
     </AnimatedPanel>
   );
 }

 return (
   <AnimatedPanel>
       <div style={{ color: '#77F7F0' }}>
           <h2 style={{ fontSize: '28px', fontWeight: 'bold', textAlign: 'center', background: 'linear-gradient(90deg, #77F7F0 0%, #59C6D4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Navbar 3: Distribusi Link</h2>
           
           {!isThresholdSet ? (
             <div style={{ marginTop: '24px', textAlign: 'center' }}>
               <p style={{ color: '#59C6D4', marginBottom: '8px' }}>Tentukan jumlah link target (threshold) untuk memulai.</p>
               <input type="number" step="100" placeholder="Contoh: 300" value={thresholdInput} onChange={(e) => setThresholdInput(e.target.value)} style={{ width: '100%', maxWidth: '320px', margin: '0 auto', backgroundColor: 'rgba(4, 5, 41, 0.5)', border: '1px solid #19386D', borderRadius: '8px', padding: '12px 16px', color: '#77F7F0', textAlign: 'center', outline: 'none', display: 'block' }}/>
               <button onClick={handleSetThresholdClick} style={{ width: '100%', maxWidth: '320px', margin: '16px auto', fontWeight: 'bold', padding: '12px 0', borderRadius: '8px', background: 'linear-gradient(135deg, #59C6D4 0%, #4091B2 100%)', color: 'white', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease', display: 'block', textTransform: 'uppercase' }}>SET THRESHOLD & MULAI</button>
             </div>
           ) : (
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', marginTop: '24px' }}>
               <div style={{ textAlign: 'center' }}>
                 <h3 style={{ fontWeight: '600', color: '#77F7F0' }}>Progress "Ember"</h3>
                 <div style={{ width: '192px', height: '192px', margin: '16px auto', position: 'relative' }}>
                   <PieChart data={[{ value: linkBucket.length, color: '#4091B2' }]} totalValue={Number(threshold) || 1} lineWidth={20} background="#19386D" animate/>
                   <div style={{ position: 'absolute', inset: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                     <span style={{ fontSize: '30px', fontWeight: 'bold', color: '#77F7F0' }}>{Number(threshold) > 0 ? Math.round((linkBucket.length / Number(threshold)) * 100) : 0}%</span>
                   </div>
                 </div>
                 <p style={{ fontSize: '14px', color: '#59C6D4' }}>Terkumpul: <span style={{ fontWeight: 'bold', color: '#77F7F0' }}>{linkBucket.length}</span> / {threshold} Link</p>
                 <p style={{ fontSize: '12px', color: '#4091B2', marginTop: '8px' }}>Kumpulkan lebih banyak link dari Navbar 1.</p>
               </div>
               <div>
                 <h3 style={{ fontWeight: '600', marginBottom: '8px', color: '#77F7F0' }}>Batch Siap Distribusi</h3>
                 <div style={{ maxHeight: '50vh', overflowY: 'auto', paddingRight: '8px' }}>
                   {batches.length > 0 ? batches.map(batch => (
                     <div key={batch.id} style={{ padding: '16px', borderRadius: '8px', backgroundColor: 'rgba(13, 25, 75, 0.5)', border: '1px solid #19386D', marginBottom: '12px' }}>
                       <p style={{ fontWeight: 'bold', color: '#77F7F0' }}>Batch {batch.id + 1} ({batch.links.length}/100)</p>
                       <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                          <select onChange={(e) => handlePhoneSelection(batch.id, e.target.value)} defaultValue="" style={{ width: '100%', backgroundColor: 'rgba(4, 5, 41, 0.7)', border: '1px solid #19386D', borderRadius: '6px', padding: '8px 12px', fontSize: '14px', color: '#77F7F0', outline: 'none' }}>
                              <option value="" disabled>Pilih HP Tujuan</option>
                              {destinationPhones.map(phone => <option key={phone.number} value={phone.number}>{phone.name}</option>)}
                          </select>
                          <button onClick={() => handleSendToWhatsApp(batch)} disabled={!batch.isFull} style={{ padding: '8px 16px', fontWeight: 'bold', fontSize: '14px', background: batch.isFull ? 'linear-gradient(135deg, #59C6D4 0%, #4091B2 100%)' : '#2A6190', color: 'white', borderRadius: '8px', whiteSpace: 'nowrap', transition: 'all 0.3s ease', cursor: batch.isFull ? 'pointer' : 'not-allowed', border: 'none' }}>KIRIM</button>
                       </div>
                     </div>
                   )) : <p style={{ fontSize: '14px', textAlign: 'center', color: '#4091B2', padding: '40px 0' }}>"Ember" masih kosong atau link belum cukup.</p>}
                 </div>
               </div>
             </div>
           )}
       </div>
   </AnimatedPanel>
 );
}