import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Helper function to dynamically initialize Gemini based on incoming or system API key
function getGoogleGenAIClient(customKey?: string) {
  const apiKey = (customKey && customKey.trim()) || process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    throw new Error(
      "Kunci API Gemini tidak ditemukan. Jika Anda menjalankan aplikasi ini di GitHub / lokal, silakan masukkan Kunci API Gemini Anda di kolom konfigurasi 'Kunci API Gemini' terlebih dahulu atau atur environment variable GEMINI_API_KEY."
    );
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// API Endpoint: Generate Curriculum Analysis (TP Ganjil & Genap)
app.post("/api/generate-analisis", async (req, res) => {
  try {
    const { cp, fase, mapel, guru, sekolah, customApiKey } = req.body;

    if (!cp) {
      return res.status(400).json({ error: "Capaian Pembelajaran (CP) is required" });
    }

    const prompt = `
Lakukan analisis mendalam CP untuk Fase ${fase || "D"} Mata Pelajaran ${mapel || "Umum"} yang diampu oleh Guru ${guru || "Guru Pintar"} di sekolah ${sekolah || "Sekolah"}.
CP yang dianalisis: "${cp}"

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
   - "lintas_disiplin": Hubungan materi ini dengan mata pelajaran lain (sebutkan mapel lain yang relevan, misalnya: "Bahasa Indonesia, PPKn". PENTING: Jangan menyebutkan mata pelajaran utama "${mapel}" itu sendiri sebagai lintas disiplin!).

Hasilkan respon JSON dengan format schema berikut:
{
  "semester1": [
    {
      "no": number,
      "cp": string,
      "konten": string,
      "kompetensi": string,
      "materi": string,
      "tp": string,
      "kbc_value": string,
      "lintas_disiplin": string
    }
  ],
  "semester2": [
    {
      "no": number,
      "cp": string,
      "konten": string,
      "kompetensi": string,
      "materi": string,
      "tp": string,
      "kbc_value": string,
      "lintas_disiplin": string
    }
  ]
}
`;

    // Perform analysis with gemini-3.5-flash
    const aiClient = getGoogleGenAIClient(customApiKey);
    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            semester1: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  no: { type: Type.INTEGER },
                  cp: { type: Type.STRING },
                  konten: { type: Type.STRING },
                  kompetensi: { type: Type.STRING },
                  materi: { type: Type.STRING },
                  tp: { type: Type.STRING },
                  kbc_value: { type: Type.STRING },
                  lintas_disiplin: { type: Type.STRING },
                },
                required: ["no", "cp", "konten", "kompetensi", "materi", "tp", "kbc_value", "lintas_disiplin"],
              },
            },
            semester2: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  no: { type: Type.INTEGER },
                  cp: { type: Type.STRING },
                  konten: { type: Type.STRING },
                  kompetensi: { type: Type.STRING },
                  materi: { type: Type.STRING },
                  tp: { type: Type.STRING },
                  kbc_value: { type: Type.STRING },
                  lintas_disiplin: { type: Type.STRING },
                },
                required: ["no", "cp", "konten", "kompetensi", "materi", "tp", "kbc_value", "lintas_disiplin"],
              },
            },
          },
          required: ["semester1", "semester2"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response received from Gemini");
    }

    const data = JSON.parse(text);
    res.json(data);
  } catch (error: any) {
    console.error("Error at generate-analisis:", error);
    res.status(500).json({ error: error.message || "Failed to analyze curriculum" });
  }
});

// API Endpoint: Generate Perencanaan Pembelajaran Mendalam (PPM / Modul Ajar)
app.post("/api/generate-ppm", async (req, res) => {
  try {
    const { no, tp, cp, materi, kbc_value, lintas_disiplin, fase, sekolah, guru, mapel, customApiKey } = req.body;

    if (!tp || !materi) {
      return res.status(400).json({ error: "TP and Materi are required" });
    }

    const prompt = `
Buatlah Perencanaan Pembelajaran Mendalam (PPM) / Modul Ajar sangat lengkap dan detail untuk tujuan pembelajaran ke-${no || 1}:
- Sekolah: ${sekolah || "Sekolah"}
- Guru Pengampu: ${guru || "Guru Pintar"}
- Mata Pelajaran: ${mapel || "Mata Pelajaran"}
- Fase: ${fase || "D"}
- Materi Pokok: ${materi}
- Tujuan Pembelajaran (TP): ${tp}
- Nilai KBC Utama: ${kbc_value || "Cinta Ilmu Pengetahuan"}
- Lintas Disiplin Ilmu: ${lintas_disiplin || "-"}
- Potongan Capaian Pembelajaran Dasar: ${cp || ""}

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
   - "meaningful": Tunjukkan bagaimana mengaitkan materi ini dengan kehidupan sehari-world, memberikan makna mendalam, bukan sekadar hafalan.
   - "joyful": Buat skenario/aktivitas menyenangkan agar murid bersemangat.
   - "langkah": Berikan rincian { "awal": string, "inti": string, "penutup": string } dalam satuan menit (contoh awal: 15 menit, inti: 90 menit, penutup: 15 menit).

4. ASESMEN
   - "awal": Diagnostik non-kognitif / kognitif singkat.
   - "proses": Penilaian formatif sikap, keaktifan diskusi, atau observasi.
   - "akhir": Instrumen sumatif tertulis berupa 2 contoh soal pilihan ganda / esai penalaran kritis lengkap beserta kunci jawaban.

5. LAMPIRAN LKPD & RUBRIK
   - "lkpd": Format lembar kerja siswa berisi { "judul": string, "tugas": string } yang menantang kreasi mandiri siswa.
   - "rubrik": Sediakan text terstruktur atau kriteria rubrik lengkap untuk tiga pilar penilaian: { "kognitif": string, "sikap": string, "presentasi": string }.

Hasilkan respon JSON dengan format schema berikut:
{
  "identitas": {
    "alokasi": string,
    "profil": string,
    "kbc": string
  },
  "desain": {
    "cp_integrated": string,
    "lintas_disiplin": string,
    "tp_integrated": string,
    "pedagogis": {
      "model": string,
      "strategi": string,
      "metode": string
    },
    "kemitraan": {
      "a": string,
      "b": string,
      "c": string
    },
    "lingkungan": {
      "fisik": string,
      "virtual": string,
      "budaya": string
    },
    "digital": string
  },
  "pengalaman": {
    "mindful": string,
    "meaningful": string,
    "joyful": string,
    "langkah": {
      "awal": string,
      "inti": string,
      "penutup": string
    }
  },
  "asesmen": {
    "awal": string,
    "proses": string,
    "akhir": string
  },
  "lkpd": {
    "judul": string,
    "tugas": string
  },
  "rubrik": {
    "kognitif": string,
    "sikap": string,
    "presentasi": string
  }
}
`;

    const aiClient = getGoogleGenAIClient(customApiKey);
    const response = await aiClient.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            identitas: {
              type: Type.OBJECT,
              properties: {
                alokasi: { type: Type.STRING },
                profil: { type: Type.STRING },
                kbc: { type: Type.STRING },
              },
              required: ["alokasi", "profil", "kbc"],
            },
            desain: {
              type: Type.OBJECT,
              properties: {
                cp_integrated: { type: Type.STRING },
                lintas_disiplin: { type: Type.STRING },
                tp_integrated: { type: Type.STRING },
                pedagogis: {
                  type: Type.OBJECT,
                  properties: {
                    model: { type: Type.STRING },
                    strategi: { type: Type.STRING },
                    metode: { type: Type.STRING },
                  },
                  required: ["model", "strategi", "metode"],
                },
                kemitraan: {
                  type: Type.OBJECT,
                  properties: {
                    a: { type: Type.STRING },
                    b: { type: Type.STRING },
                    c: { type: Type.STRING },
                  },
                  required: ["a", "b", "c"],
                },
                lingkungan: {
                  type: Type.OBJECT,
                  properties: {
                    fisik: { type: Type.STRING },
                    virtual: { type: Type.STRING },
                    budaya: { type: Type.STRING },
                  },
                  required: ["fisik", "virtual", "budaya"],
                },
                digital: { type: Type.STRING },
              },
              required: ["cp_integrated", "lintas_disiplin", "tp_integrated", "pedagogis", "kemitraan", "lingkungan", "digital"],
            },
            pengalaman: {
              type: Type.OBJECT,
              properties: {
                mindful: { type: Type.STRING },
                meaningful: { type: Type.STRING },
                joyful: { type: Type.STRING },
                langkah: {
                  type: Type.OBJECT,
                  properties: {
                    awal: { type: Type.STRING },
                    inti: { type: Type.STRING },
                    penutup: { type: Type.STRING },
                  },
                  required: ["awal", "inti", "penutup"],
                },
              },
              required: ["mindful", "meaningful", "joyful", "langkah"],
            },
            asesmen: {
              type: Type.OBJECT,
              properties: {
                awal: { type: Type.STRING },
                proses: { type: Type.STRING },
                akhir: { type: Type.STRING },
              },
              required: ["awal", "proses", "akhir"],
            },
            lkpd: {
              type: Type.OBJECT,
              properties: {
                judul: { type: Type.STRING },
                tugas: { type: Type.STRING },
              },
              required: ["judul", "tugas"],
            },
            rubrik: {
              type: Type.OBJECT,
              properties: {
                kognitif: { type: Type.STRING },
                sikap: { type: Type.STRING },
                presentasi: { type: Type.STRING },
              },
              required: ["kognitif", "sikap", "presentasi"],
            },
          },
          required: ["identitas", "desain", "pengalaman", "asesmen", "lkpd", "rubrik"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Empty response received from Gemini");
    }

    const data = JSON.parse(text);
    res.json(data);
  } catch (error: any) {
    console.error("Error at generate-ppm:", error);
    res.status(500).json({ error: error.message || "Failed to generate PPM Module" });
  }
});

// Configure Vite or Static Files serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    // Integrate Vite development server middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files from the compiled bundle
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Administrasi Guru Pintar Server] running on http://localhost:${PORT}`);
  });
}

startServer();
