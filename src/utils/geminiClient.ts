/**
 * Utility to execute Gemini API Calls both Server-Side (default)
 * and Client-Side (automatic fallback for GitHub Pages & static deployments)
 */

import { AnalisisResponse, PPMModul } from "../types";

// Schema for Curriculum Analysis
const ANALISIS_SCHEMA = {
  type: "OBJECT",
  properties: {
    semester1: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          no: { type: "INTEGER" },
          cp: { type: "STRING" },
          konten: { type: "STRING" },
          kompetensi: { type: "STRING" },
          materi: { type: "STRING" },
          tp: { type: "STRING" },
          kbc_value: { type: "STRING" },
          lintas_disiplin: { type: "STRING" },
        },
        required: ["no", "cp", "konten", "kompetensi", "materi", "tp", "kbc_value", "lintas_disiplin"],
      },
    },
    semester2: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          no: { type: "INTEGER" },
          cp: { type: "STRING" },
          konten: { type: "STRING" },
          kompetensi: { type: "STRING" },
          materi: { type: "STRING" },
          tp: { type: "STRING" },
          kbc_value: { type: "STRING" },
          lintas_disiplin: { type: "STRING" },
        },
        required: ["no", "cp", "konten", "kompetensi", "materi", "tp", "kbc_value", "lintas_disiplin"],
      },
    },
  },
  required: ["semester1", "semester2"],
};

// Schema for Perencanaan Pembelajaran Mendalam (PPM) / Modul Ajar
const PPM_SCHEMA = {
  type: "OBJECT",
  properties: {
    identitas: {
      type: "OBJECT",
      properties: {
        alokasi: { type: "STRING" },
        profil: { type: "STRING" },
        kbc: { type: "STRING" },
      },
      required: ["alokasi", "profil", "kbc"],
    },
    desain: {
      type: "OBJECT",
      properties: {
        cp_integrated: { type: "STRING" },
        lintas_disiplin: { type: "STRING" },
        tp_integrated: { type: "STRING" },
        pedagogis: {
          type: "OBJECT",
          properties: {
            model: { type: "STRING" },
            strategi: { type: "STRING" },
            metode: { type: "STRING" },
          },
          required: ["model", "strategi", "metode"],
        },
        kemitraan: {
          type: "OBJECT",
          properties: {
            a: { type: "STRING" },
            b: { type: "STRING" },
            c: { type: "STRING" },
          },
          required: ["a", "b", "c"],
        },
        lingkungan: {
          type: "OBJECT",
          properties: {
            fisik: { type: "STRING" },
            virtual: { type: "STRING" },
            budaya: { type: "STRING" },
          },
          required: ["fisik", "virtual", "budaya"],
        },
        digital: { type: "STRING" },
      },
      required: ["cp_integrated", "lintas_disiplin", "tp_integrated", "pedagogis", "kemitraan", "lingkungan", "digital"],
    },
    pengalaman: {
      type: "OBJECT",
      properties: {
        mindful: { type: "STRING" },
        meaningful: { type: "STRING" },
        joyful: { type: "STRING" },
        langkah: {
          type: "OBJECT",
          properties: {
            awal: { type: "STRING" },
            inti: { type: "STRING" },
            penutup: { type: "STRING" },
          },
          required: ["awal", "inti", "penutup"],
        },
      },
      required: ["mindful", "meaningful", "joyful", "langkah"],
    },
    asesmen: {
      type: "OBJECT",
      properties: {
        awal: { type: "STRING" },
        proses: { type: "STRING" },
        akhir: { type: "STRING" },
      },
      required: ["awal", "proses", "akhir"],
    },
    lkpd: {
      type: "OBJECT",
      properties: {
        judul: { type: "STRING" },
        tugas: { type: "STRING" },
      },
      required: ["judul", "tugas"],
    },
    rubrik: {
      type: "OBJECT",
      properties: {
        kognitif: { type: "STRING" },
        sikap: { type: "STRING" },
        presentasi: { type: "STRING" },
      },
      required: ["kognitif", "sikap", "presentasi"],
    },
  },
  required: ["identitas", "desain", "pengalaman", "asesmen", "lkpd", "rubrik"],
};

/**
 * Executes a raw fetch to Google's Gemini API directly from browser
 */
async function callGeminiClientSide(prompt: string, apiKey: string, responseSchema: any): Promise<any> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`;
  
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
        },
      }),
    });

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      const msg = errBody?.error?.message || `HTTP Error ${response.status}`;
      throw new Error(`Gemini API Client-Side Error: ${msg}`);
    }

    const data = await response.json();
    const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!textOutput) {
      throw new Error("Respon kosong diterima dari server Gemini client-side.");
    }

    return JSON.parse(textOutput);
  } catch (error: any) {
    console.error("Error direct calling Gemini client-side:", error);
    throw new Error(
      error.message || "Gagal menghubungi server Gemini secara langsung. Periksa koneksi internet dan API Key Anda."
    );
  }
}

/**
 * Handles curriculum analysis generation.
 * Will first try backend route if no custom API key is present.
 * If custom API key is present OR if backend fetch fails with 404/network error, it executes fully client-side.
 */
export async function generateAnalisis(params: {
  cp: string;
  fase: string;
  mapel: string;
  guru: string;
  sekolah: string;
  customApiKey: string;
}): Promise<AnalisisResponse> {
  const customKey = params.customApiKey.trim();

  // If a custom API key is supplied, run client-side directly for maximum stability on GitHub Pages
  if (customKey !== "") {
    const prompt = `
Lakukan analisis mendalam CP untuk Fase ${params.fase || "D"} Mata Pelajaran ${params.mapel || "Umum"} yang diampu oleh Guru ${params.guru || "Guru Pintar"} di sekolah ${params.sekolah || "Sekolah"}.
CP yang dianalisis: "${params.cp}"

INSTRUKSI KHUSUS:
1. Pecah CP menjadi minimal 24 Tujuan Pembelajaran (TP) yang realistik, terbagi merata (12 TP di Semester 1/Ganjil, dan 12 TP di Semester 2/Genap). Jika materi CP terlalu pendek, kembangkan rincian sub-konsep pendukungnya agar mencapai target jumlah ini.
2. Untuk SETIAP semester, hasil analisis harus mencakup:
   - "no": Nomor urut integer (Semester 1 dimulai dari 1 hingga 12; Semester 2 dimulai dari 13 hingga 24).
   - "cp": Ringkasan potongan elemen CP dasar yang melandasi TP tersebut.
   - "konten": Konten pembelajaran atau kata kunci bahasan utama.
   - "kompetensi": Kompetensi yang ingin dicapai (gunakan kata kerja operasional Taksonomi Bloom revisi).
   - "materi": Materi pokok spesifik yang diajarkan.
   - "tp": Rumusan Tujuan Pembelajaran (TP) yang operasional, relevan, dan terintegrasi dengan nilai-nilai KBC (Kurikulum Berbasis Cinta).
   - "kbc_value": Pilih/gabungkan nilai KBC yang paling sesuai dari 5 nilai berikut secara presisi:
     - "Cinta Allah dan rasulnya"
     - "Cinta diri dan sesama"
     - "Cinta alam dan lingkungan"
     - "Cinta ilmu pengetahuan"
     - "Cinta negeri dan bangsa"
     (PENTING: Hanya gunakan nilai di atas, jangan buat nilai baru!).
   - "lintas_disiplin": Hubungan materi ini dengan mata pelajaran lain (sebutkan mapel lain yang relevan, misalnya: "Bahasa Indonesia, PPKn". PENTING: Jangan menyebutkan mata pelajaran utama "${params.mapel}" itu sendiri sebagai lintas disiplin!).

Hasilkan respon JSON dengan format schema yang tepat.
`;
    return await callGeminiClientSide(prompt, customKey, ANALISIS_SCHEMA);
  }

  // No custom key: attempt backend server-side proxy
  try {
    const response = await fetch("/api/generate-analisis", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cp: params.cp,
        fase: params.fase,
        mapel: params.mapel,
        guru: params.guru,
        sekolah: params.sekolah,
        customApiKey: "",
      }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("404_NOT_FOUND");
      }
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error || "Gagal memperoleh hasil analisis dari AI Server.");
    }

    return await response.json();
  } catch (err: any) {
    if (err.message === "404_NOT_FOUND" || err.message?.includes("Failed to fetch") || err.name === "TypeError") {
      throw new Error(
        "Aplikasi dijalankan di lingkungan statis (seperti GitHub Pages) tanpa server-side. Silakan masukkan Kunci API Gemini Anda pada kolom 'Kunci API Gemini (opsional di github)' di tab '1. Input Data' untuk menggunakan fitur AI secara langsung di browser Anda."
      );
    }
    throw err;
  }
}

/**
 * Handles Perencanaan Pembelajaran Mendalam (PPM) Modul Ajar generation.
 * Resolves client-side if custom API key is present or falls back cleanly with user instructions if server of github fails.
 */
export async function generatePpm(params: {
  no: number;
  tp: string;
  cp: string;
  materi: string;
  kbc_value: string;
  lintas_disiplin: string;
  fase: string;
  sekolah: string;
  guru: string;
  mapel: string;
  customApiKey: string;
}): Promise<PPMModul> {
  const customKey = params.customApiKey.trim();

  if (customKey !== "") {
    const prompt = `
Buatlah Perencanaan Pembelajaran Mendalam (PPM) / Modul Ajar sangat lengkap dan detail untuk tujuan pembelajaran ke-${params.no || 1}:
- Sekolah: ${params.sekolah || "Sekolah"}
- Guru Pengampu: ${params.guru || "Guru Pintar"}
- Mata Pelajaran: ${params.mapel || "Mata Pelajaran"}
- Fase: ${params.fase || "D"}
- Materi Pokok: ${params.materi}
- Tujuan Pembelajaran (TP): ${params.tp}
- Nilai KBC Utama: ${params.kbc_value || "Cinta Ilmu Pengetahuan"}
- Lintas Disiplin Ilmu: ${params.lintas_disiplin || "-"}
- Potongan Capaian Pembelajaran Dasar: ${params.cp || ""}

Sistematika & Ketentuan Output:
1. IDENTITAS & PROFIL
   - "alokasi": Tentukan alokasi waktu ideal secara otomatis (contoh: "4 JP / 2 Pertemuan").
   - "profil": Pilih secara akurat minimal 2 hingga 4 kombinasi dari 8 Profil Lulusan berikut: Keimanan dan Ketakwaan terhadap Tuhan YME, Kewargaan, Penalaran Kritis, Kreativitas, Kolaborasi, Kemandirian, Kesehatan, Komunikasi.
   - "kbc": Tuliskan integrasi Nilai KBC Utama.

2. DESAIN PEMBELAJARAN
   - "cp_integrated": Rumuskan Capaian Pembelajaran yang telah diperkaya nilai Kurikulum Berbasis Cinta (KBC).
   - "lintas_disiplin": Mata pelajaran penunjang kolaboratif yang relevan (misal: Bahasa Indonesia, PPKn, dll).
   - "tp_integrated": Rumusan TP yang terintegrasi secara praktis dengan perilaku cinta/karakter luhur.
   - "pedagogis": Tentukan { "model": string, "strategi": string, "metode": string } yang kooperatif dan interaktif.
   - "kemitraan": Tentukan { "a": string, "b": string, "c": string } melibatkan Laboran/Guru sejawat/Pihak eksternal.
   - "lingkungan": Tentukan { "fisik": string, "virtual": string, "budaya": string } lingkungan belajar kondusif.
   - "digital": Rekomendasi media digital atau platform interaktif (contoh: Canva, Quizizz, Google Earth).

3. PENGALAMAN BELAJAR (Deep Learning Elements)
   - "mindful": Deskripsikan cara membangun kesadaran penuh peserta didik sebelum belajar (mindfulness, hening sejenak, ice breaking bermakna).
   - "meaningful": Tunjukkan bagaimana mengaitkan materi ini dengan kehidupan sehari-hari, memberikan makna mendalam, bukan sekadar hafalan.
   - "joyful": Buat skenario/aktivitas menyenangkan agar murid bersemangat.
   - "langkah": Berikan rincian { "awal": string, "inti": string, "penutup": string } dalam satuan menit (contoh awal: 15 menit, inti: 90 menit, penutup: 15 menit).

4. ASESMEN
   - "awal": Diagnostik non-kognitif / kognitif singkat.
   - "proses": Penilaian formatif sikap, keaktifan diskusi, atau observasi.
   - "akhir": Instrumen sumatif tertulis berupa 2 contoh soal pilihan ganda / esai penalaran kritis lengkap beserta kunci jawaban.

5. LAMPIRAN LKPD & RUBRIK
   - "lkpd": Format lembar kerja siswa berisi { "judul": string, "tugas": string } yang menantang kreasi mandiri siswa.
   - "rubrik": Sediakan text terstruktur atau kriteria rubrik lengkap untuk tiga pilar penilaian: { "kognitif": string, "sikap": string, "presentasi": string }.

Hasilkan respon JSON dengan format schema yang tepat.
`;
    return await callGeminiClientSide(prompt, customKey, PPM_SCHEMA);
  }

  try {
    const response = await fetch("/api/generate-ppm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        no: params.no,
        tp: params.tp,
        cp: params.cp,
        materi: params.materi,
        kbc_value: params.kbc_value,
        lintas_disiplin: params.lintas_disiplin,
        fase: params.fase,
        sekolah: params.sekolah,
        guru: params.guru,
        mapel: params.mapel,
        customApiKey: "",
      }),
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error("404_NOT_FOUND");
      }
      const errJson = await response.json().catch(() => ({}));
      throw new Error(errJson.error || "Gagal generate modul dari server-side API.");
    }

    return await response.json();
  } catch (err: any) {
    if (err.message === "404_NOT_FOUND" || err.message?.includes("Failed to fetch") || err.name === "TypeError") {
      throw new Error(
        "Aplikasi dijalankan di lingkungan statis (seperti GitHub Pages) tanpa server-side. Silakan masukkan Kunci API Gemini Anda pada kolom 'Kunci API Gemini (opsional di github)' di tab '1. Input Data' untuk menggunakan fitur AI secara langsung di browser Anda."
      );
    }
    throw err;
  }
}
