import React from "react";
import { Settings, Brain, ArrowRight, ShieldCheck, HelpCircle } from "lucide-react";
import { motion } from "motion/react";

interface InputDataTabProps {
  sekolah: string;
  setSekolah: (val: string) => void;
  guru: string;
  setGuru: (val: string) => void;
  mapel: string;
  setMapel: (val: string) => void;
  fase: string;
  setFase: (val: string) => void;
  tapel: string;
  setTapel: (val: string) => void;
  cpInput: string;
  setCpInput: (val: string) => void;
  onGenerate: (e: React.FormEvent) => void;
  isLoading: boolean;
  customApiKey: string;
  setCustomApiKey: (val: string) => void;
}

export function InputDataTab({
  sekolah,
  setSekolah,
  guru,
  setGuru,
  mapel,
  setMapel,
  fase,
  setFase,
  tapel,
  setTapel,
  cpInput,
  setCpInput,
  onGenerate,
  isLoading,
  customApiKey,
  setCustomApiKey,
}: InputDataTabProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="grid gap-8 lg:grid-cols-3"
    >
      {/* Sidebar: Configuration */}
      <div className="space-y-6 lg:col-span-1">
        <div className="rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-xl sm:p-8">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <Settings className="h-5 w-5" />
            </div>
            <h2 className="font-display text-xl font-bold text-slate-800">
              Konfigurasi Umum
            </h2>
          </div>

          <div className="space-y-5">
            {/* Server API Key Status Badge */}
            <div className="rounded-2xl bg-teal-50/70 border border-teal-100 p-4">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="mt-0.5 h-4 w-4 text-teal-600 shrink-0" />
                <div>
                  <h4 className="text-[10px] font-bold text-teal-900 uppercase tracking-wide">
                    Gemini AI Active
                  </h4>
                  <p className="mt-0.5 text-[11px] text-teal-700 leading-normal">
                    Kunci API terkonfigurasi otomatis di server-side. Jika dijalankan di GitHub/hosting mandiri, silakan isi opsi di bawah ini.
                  </p>
                </div>
              </div>
            </div>

            {/* Optional Gemini API Key Input */}
            <div className="space-y-1.5 rounded-2xl border border-slate-100 bg-slate-50/50 p-4.5">
              <label htmlFor="api-key-input" className="ml-1 text-[11px] font-bold text-indigo-950 uppercase tracking-wider flex items-center gap-1">
                Kunci API Gemini <span className="text-[10px] text-indigo-500 font-normal lowercase">(opsional di github)</span>
              </label>
              <input
                id="api-key-input"
                type="password"
                value={customApiKey}
                onChange={(e) => setCustomApiKey(e.target.value)}
                placeholder="Masukkan API Key Gemini..."
                className="w-full rounded-xl border border-slate-100 bg-white p-3 text-xs font-semibold text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-200 focus:ring-2 focus:ring-indigo-100"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="school-input" className="ml-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Nama Madrasah / Sekolah
              </label>
              <input
                id="school-input"
                type="text"
                value={sekolah}
                onChange={(e) => setSekolah(e.target.value)}
                placeholder="misal. SMK Negeri 1 Kudus"
                className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-200 focus:bg-white focus:ring-4 focus:ring-indigo-100/50"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="guru-input" className="ml-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Nama Lengkap Guru
              </label>
              <input
                id="guru-input"
                type="text"
                value={guru}
                onChange={(e) => setGuru(e.target.value)}
                placeholder="Nama Lengkap & Gelar"
                className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-200 focus:bg-white focus:ring-4 focus:ring-indigo-100/50"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="mapel-input" className="ml-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Mata Pelajaran
              </label>
              <input
                id="mapel-input"
                type="text"
                value={mapel}
                onChange={(e) => setMapel(e.target.value)}
                placeholder="misal. Pendidikan Agama Islam / IPA"
                className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-medium text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-200 focus:bg-white focus:ring-4 focus:ring-indigo-100/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="fase-select" className="ml-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Fase
                </label>
                <select
                  id="fase-select"
                  value={fase}
                  onChange={(e) => setFase(e.target.value)}
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-medium text-slate-800 outline-none transition-all focus:border-indigo-200 focus:bg-white focus:ring-4 focus:ring-indigo-100/50"
                >
                  <option value="A">Fase A (Kl. 1-2)</option>
                  <option value="B">Fase B (Kl. 3-4)</option>
                  <option value="C">Fase C (Kl. 5-6)</option>
                  <option value="D">Fase D (Kl. 7-9)</option>
                  <option value="E">Fase E (Kl. 10)</option>
                  <option value="F">Fase F (Kl. 11-12)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label htmlFor="tapel-input" className="ml-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Th. Pelajaran
                </label>
                <input
                  id="tapel-input"
                  type="text"
                  value={tapel}
                  onChange={(e) => setTapel(e.target.value)}
                  className="w-full rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-medium text-slate-800 outline-none transition-all focus:border-indigo-200 focus:bg-white focus:ring-4 focus:ring-indigo-100/50"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area: Capaian Pembelajaran */}
      <div className="lg:col-span-2">
        <div className="h-full rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-xl sm:p-8 flex flex-col justify-between">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                  <Brain className="h-5 w-5" />
                </div>
                <h2 className="font-display text-xl font-bold text-slate-800">
                  Capaian Pembelajaran (CP)
                </h2>
              </div>
            </div>

            <p className="mb-4 text-sm leading-relaxed text-slate-500">
              Tempel atau ketikkan dokumen Capaian Pembelajaran resmi di bawah ini. AI server akan membedah CP ini secara mendalam menjadi elemen-elemen alur tujuan pembelajaran (minimal 24 TP, 12 per semester) serta mengintegrasikan nilai-nilai luhur Kurikulum Berbasis Cinta (KBC).
            </p>

            <textarea
              value={cpInput}
              onChange={(e) => setCpInput(e.target.value)}
              placeholder="Tempel dokumen Capaian Pembelajaran (CP) di sini untuk dianalisis oleh AI..."
              className="min-h-[300px] w-full resize-y rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/50 p-6 text-sm font-medium leading-relaxed text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100/50 flex-grow"
            />
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-6">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
              <HelpCircle className="h-4 w-4" />
              <span>Membutuhkan waktu sekitar 15-20 detik</span>
            </div>

            <button
              onClick={onGenerate}
              disabled={isLoading || !cpInput.trim()}
              className="group inline-flex items-center gap-2.5 rounded-2xl bg-indigo-600 px-8 py-4 font-display font-bold text-white shadow-xl shadow-indigo-100 transition-all hover:bg-indigo-700 hover:shadow-indigo-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Menganalisis...</span>
                </>
              ) : (
                <>
                  <span>Mulai Analisis AI</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
