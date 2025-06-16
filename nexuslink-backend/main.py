# File: main.py

# ==============================================================================
# BAGIAN 1: IMPOR SEMUA PUSTAKA YANG DIBUTUHKAN
# ==============================================================================
import os
import io
import json
import re 
from typing import List
from dotenv import load_dotenv

import pandas as pd
import google.generativeai as genai
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware


# ==============================================================================
# BAGIAN 2: KONFIGURASI APLIKASI DAN API
# ==============================================================================
load_dotenv()
app = FastAPI()
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
try:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("PERINGATAN: GEMINI_API_KEY tidak ditemukan di file .env")
        gemini_model = None
    else:
        genai.configure(api_key=api_key)
        gemini_model = genai.GenerativeModel('gemini-1.5-flash')
except Exception as e:
    print(f"Error saat konfigurasi Gemini: {e}")
    gemini_model = None


# ==============================================================================
# BAGIAN 3: FUNGSI PEMBANTU (HELPER FUNCTION)
# ==============================================================================

def parse_gemini_commission_text(text_response: str) -> List[dict]:
    """
    Fungsi ini sekarang membaca format "1. 2%" dan mengubahnya menjadi JSON.
    """
    results = []
    lines = text_response.strip().split('\n')
    for line in lines:
        # REGEX BARU untuk mencocokkan format "1. 2%" atau "1. 2.5%" dll.
        match = re.search(r"^\s*(\d+)\.\s*([\d\.]+%?)", line)
        if match:
            # Grup 1 adalah nomor urut (misal: "1")
            product_index = int(match.group(1))
            # Grup 2 adalah nilai komisi (misal: "2%")
            commission_percent = match.group(2).strip()

            if '%' not in commission_percent:
                commission_percent += '%'
            
            results.append({
                "product_index": product_index,
                "commission_percent": commission_percent
            })
    return results


# ==============================================================================
# BAGIAN 4: ENDPOINT (URL) UNTUK APLIKASI
# ==============================================================================

@app.get("/")
def read_root():
    return {"Status": "Backend NexusLink Aktif"}


# --- ENDPOINT UNTUK NAVBAR 1 ---
@app.post("/api/process-csv")
async def process_csv(
    files: List[UploadFile] = File(...), 
    rank: int = Form(...),
    commission_threshold: int = Form(...) # !! PARAMETER BARU DITAMBAHKAN DI SINI !!
):
    # Log untuk konfirmasi bahwa data baru sudah diterima
    print(f"--- MENERIMA REQUEST PROSES CSV ---")
    print(f"Rank: {rank}, Treshold Komisi: {commission_threshold}")
    print(f"Jumlah File: {len(files)}")
    
    all_filtered_data = []
    for file in files:
        content = await file.read()
        df = pd.read_csv(io.StringIO(content.decode('utf-8')))
        df_filtered = df[df['Tren'] != 'TURUN'].copy()
        hasil_a = df_filtered[(df_filtered['Tren'] == 'NAIK') & (df_filtered['isAd'] == 'Yes')]
        sisa_df = df_filtered[(df_filtered['Tren'] == 'NAIK') & (df_filtered['isAd'] == 'No')]
        sisa_df_sorted = sisa_df.sort_values(by='Penjualan (30 Hari)', ascending=False)
        hasil_b = sisa_df_sorted.head(rank)
        hasil_file_ini = pd.concat([hasil_a, hasil_b])
        all_filtered_data.append(hasil_file_ini)

    if not all_filtered_data: return []

    final_df = pd.concat(all_filtered_data)
    final_df = final_df.sample(frac=1).reset_index(drop=True)
    final_df = final_df.drop_duplicates(subset=['productLink'], keep='first')
    
    result = final_df[['productLink']].copy()
    result['commission'] = None
    return result.to_dict(orient='records')


# Di dalam file main.py

# --- ENDPOINT BARU UNTUK NAVBAR 2 ---
@app.post("/api/analyze-multiple-images")
async def analyze_multiple_images(files: List[UploadFile] = File(...)):
    """Menerima BANYAK file gambar, menganalisanya satu per satu dengan Gemini."""
    if not gemini_model:
        return {"error": "Model Gemini tidak terkonfigurasi."}

    # Prompt yang fleksibel tetap kita gunakan
    prompt = """
    Anda adalah asisten AI yang ahli dalam menganalisa gambar screenshot dari marketplace Shopee.

Tugas utama Anda adalah menemukan nilai "Komisi Affiliate" untuk setiap produk di dalam gambar yang diberikan. Ikuti aturan ini dengan sangat ketat:

ATURAN ANALISA:
1.  Identifikasi setiap produk yang memiliki ikon checklist oranye (✓) di sebelah kirinya.
2.  Untuk setiap produk tersebut, fokus pada area di sebelah kanannya untuk mencari informasi komisi.
3.  Cari teks berwarna oranye "Komisi hingga X%". Nilai ini biasanya berada di atas harga produk.
4.  Jika Anda menemukan teks tersebut, catat nilainya (contoh: "2%", "0.5%", "3%").
5.  Jika Anda TIDAK menemukan teks "Komisi hingga X%" untuk sebuah produk yang memiliki checklist, catat nilainya sebagai "0%".

ATURAN PENTING LAINNYA:
-   Abaikan semua informasi lain seperti nama produk, harga, jumlah terjual, dan lokasi toko.
-   Setiap produk dengan checklist oranye HARUS dianalisa. Jangan ada yang terlewat.

FORMAT JAWABAN:
-   Berikan jawaban Anda HANYA dalam format daftar bernomor, satu produk per baris.
-   Jangan tambahkan kalimat pembuka, penutup, atau penjelasan apa pun. Langsung berikan daftarnya.

Contoh Format Jawaban:
1. 2%
2. 0%
3. 5%
    """
    
    # Ganti bagian ini di dalam fungsi analyze_multiple_images

    results = []
    for file in files:
        try:
            image_bytes = await file.read()
            image_part = {"mime_type": file.content_type, "data": image_bytes}
            
            print(f"--- MENGANALISA FILE: {file.filename} DENGAN GEMINI (PROMPT FINAL) ---")
            response = gemini_model.generate_content([prompt, image_part])
            
            # !! MATA-MATA BARU: LIHAT JAWABAN MENTAH DARI GEMINI !!
            print(f"--- JAWABAN MENTAH DARI GEMINI UNTUK {file.filename}: ---")
            # Kita beri tanda kutip agar terlihat jika responsnya adalah string kosong
            print(f"'{response.text}'") 
            print("----------------------------------------------------")

            # Menggunakan fungsi helper kita untuk membaca format teks, bukan JSON
            commission_data = parse_gemini_commission_text(response.text)
            
            # Jika parser tidak menemukan apa-apa, anggap gagal
            if not commission_data:
                raise ValueError("Gagal mem-parsing respons dari Gemini. Mungkin format tidak sesuai.")

            results.append({"fileName": file.filename, "status": "sukses", "commissions": commission_data})

        except Exception as e:
            print(f"Error saat memproses {file.filename}: {e}")
            results.append({"fileName": file.filename, "status": "gagal", "commissions": [], "error": str(e)})
            
    return results