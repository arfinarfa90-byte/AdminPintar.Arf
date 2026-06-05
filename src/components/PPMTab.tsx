import React from "react";
import { Download, Layers, Sparkles, BookOpen, Clock, Users, Globe2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AnalisisItem, PPMModul } from "../types";
import { exportToWord } from "../utils/export";

interface PPMTabProps {
  analisisData: AnalisisItem[];
  sekolah: string;
  guru: string;
  mapel: string;
  fase: string;
  customApiKey: string;
}

export function PPMTab({ analisisData, sekolah, guru, mapel, fase, customApiKey }: PPMTabProps) {
  const [selectedTP, setSelectedTP] = React.useState<AnalisisItem | null>(null);
  const [modulData, setModulData] = React.useState<PPMModul | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const fetchModul = async (item: AnalisisItem) => {
    setSelectedTP(item);
    setModulData(null);
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/generate-ppm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          no: item.no,
          tp: item.tp,
          cp: item.cp,
          materi: item.materi,
          kbc_value: item.kbc_value,
          lintas_disiplin: item.lintas_disiplin,
          fase,
          sekolah,
          guru,
          mapel,
          customApiKey: customApiKey.trim(),
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || "Gagal generate modul dari server-side API.");
      }

      const data: PPMModul = await response.json();
      setModulData(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Terjadi kesalahan koneksi ke server-side AI.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-xl sm:p-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <h3 className="font-display text-3xl font-black text-indigo-950 uppercase tracking-tight">
            Perencanaan Pembelajaran Mendalam (PPM)
          </h3>
          <p className="mt-2 text-sm text-slate-500 leading-relaxed">
            Pilih nomor Tujuan Pembelajaran (TP) di bawah ini untuk menyusun Modul Ajar berasaskan trilogi Deep Learning (<span className="italic font-bold text-indigo-600">Mindful, Meaningful, Joyful</span>) secara dinamis dengan bantuan AI.
          </p>
        </div>

        {/* Selection buttons */}
        <div className="no-print flex flex-wrap gap-2.5 justify-center pb-6 border-b border-slate-100">
          {analisisData.map((item) => {
            const isSelected = selectedTP?.no === item.no;
            return (
              <button
                key={item.no}
                onClick={() => fetchModul(item)}
                className={`w-11 h-11 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center border shadow-sm ${
                  isSelected
                    ? "bg-indigo-600 border-indigo-600 text-white scale-110 shadow-indigo-100"
                    : "bg-white border-slate-100 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
                }`}
              >
                {item.no}
              </button>
            );
          })}
        </div>

        {/* Active Module UI / Loading / Empty */}
        <div className="mt-8">
          <AnimatePresence mode="wait">
            {isLoading && (
              <motion.div
                key="loading-ppm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="py-24 text-center"
              >
                <div className="relative inline-block mb-4 h-12 w-12 text-indigo-600 animate-spin">
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-100 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-600 rounded-full border-t-transparent"></div>
                </div>
                <h4 className="font-display text-lg font-bold text-indigo-950 uppercase"> Menyusun Modul Ajar</h4>
                <p className="mt-1 text-xs text-slate-400">Merumuskan skenario model, langkah mindful, LKPD & rubrik komparatif...</p>
              </motion.div>
            )}

            {!isLoading && errorMsg && (
              <motion.div
                key="error-ppm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-xl mx-auto p-6 bg-red-50/70 border border-red-200 rounded-3xl text-center"
              >
                <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-3" />
                <h4 className="font-display font-bold text-red-950">Gagal Mengompilasi Modul</h4>
                <p className="mt-1 text-xs text-red-700 leading-relaxed">{errorMsg}</p>
                <button
                  onClick={() => selectedTP && fetchModul(selectedTP)}
                  className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-red-700 active:scale-95"
                >
                  Coba Lagi
                </button>
              </motion.div>
            )}

            {!isLoading && !modulData && !errorMsg && (
              <motion.div
                key="empty-ppm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-20 bg-slate-50/40 rounded-[2rem] border-2 border-dashed border-slate-100"
              >
                <Layers className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Silakan pilih salah satu TP di atas</p>
              </motion.div>
            )}

            {!isLoading && modulData && selectedTP && (
              <motion.div
                key="content-ppm"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Module Actions / Toolbar */}
                <div className="no-print flex justify-end">
                  <button
                    onClick={() => exportToWord("ppm-module-output", `Modul_PPM_TP_${selectedTP.no}`)}
                    className="inline-flex items-center gap-2.5 rounded-2xl bg-pink-600 hover:bg-pink-700 text-white font-display font-bold px-8 py-3.5 shadow-xl shadow-pink-100 transition-all duration-200 active:scale-95"
                  >
                    <Download className="h-5 w-5" />
                    <span>Ekspor Modul Ke Word</span>
                  </button>
                </div>

                {/* Main printable node */}
                <div id="ppm-module-output" className="rounded-[2rem] border-t-[12px] border-pink-500 bg-white p-6 sm:p-10 shadow-lg">
                  {/* Printed Heading */}
                  <div className="flex flex-wrap items-start justify-between gap-6 pb-6 border-b border-slate-100">
                    <div>
                      <h4 className="font-display text-2xl font-black text-slate-900 uppercase">
                        PERENCANAAN PEMBELAJARAN MENDALAM (PPM)
                      </h4>
                      <p className="text-pink-600 font-bold text-xs uppercase tracking-widest mt-1">
                        Deep Learning & Kurikulum Berbasis Cinta (KBC)
                      </p>
                    </div>
                    <div className="text-right text-xs text-slate-400 font-bold">
                      <p>{sekolah || "SMK"}</p>
                      <p>Fase {fase} - {selectedTP.no <= 12 ? "Semester Ganjil" : "Semester Genap"}</p>
                    </div>
                  </div>

                  {/* I. Identitas */}
                  <section className="mt-8">
                    <h3 className="bg-indigo-950 text-white px-5 py-2 rounded-xl text-xs font-black inline-block uppercase tracking-wider mb-4">
                      I. IDENTITAS & PROFIL
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                        <span className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider">Materi Pelajaran</span>
                        <p className="mt-1 font-bold text-indigo-950 text-sm leading-snug">{selectedTP.materi}</p>
                      </div>
                      <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                        <span className="block text-[10px] font-bold uppercase text-indigo-400 tracking-wider">Profil Lulusan</span>
                        <p className="mt-1 font-bold text-indigo-950 text-sm leading-snug">{modulData.identitas.profil}</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                        <span className="block text-[10px] font-bold uppercase text-slate-400 tracking-wider">Alokasi Waktu</span>
                        <p className="mt-1 font-bold text-indigo-950 text-sm leading-snug">{modulData.identitas.alokasi}</p>
                      </div>
                    </div>
                  </section>

                  {/* II. Desain Pembelajaran */}
                  <section className="mt-8">
                    <h3 className="bg-indigo-950 text-white px-5 py-2 rounded-xl text-xs font-black inline-block uppercase tracking-wider mb-4">
                      II. DESAIN PEMBELAJARAN
                    </h3>
                    
                    <div className="p-5 bg-pink-50/50 border border-pink-100/70 rounded-3xl mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="h-4 w-4 text-pink-500" />
                        <h5 className="text-xs font-bold text-pink-900 uppercase tracking-widest">Kurikulum Berbasis Cinta (KBC) Integration</h5>
                      </div>
                      <p className="text-xs text-pink-800 leading-relaxed italic">
                        Pembelajaran dirancang harmonis dengan nilai "<strong>{modulData.identitas.kbc}</strong>", membimbing siswa mengagumi peradaban keilmuan, mengedepankan olah rasa, serta pembentukan kepribadian luhur.
                      </p>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Capaian Pembelajaran terintegrasi KBC</span>
                          <p className="text-xs text-slate-700 leading-relaxed font-medium p-3.5 bg-slate-50 border border-slate-100 rounded-xl">
                            {modulData.desain.cp_integrated}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tujuan Pembelajaran terintegrasi KBC</span>
                          <p className="text-xs text-slate-700 leading-relaxed font-semibold p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-indigo-900">
                            {modulData.desain.tp_integrated}
                          </p>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Kemitraan Pembelajaran</span>
                          <div className="text-xs space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            <p className="font-medium text-slate-600"><span className="font-bold text-indigo-600">a.</span> {modulData.desain.kemitraan.a}</p>
                            <p className="font-medium text-slate-600"><span className="font-bold text-indigo-600">b.</span> {modulData.desain.kemitraan.b}</p>
                            <p className="font-medium text-slate-600"><span className="font-bold text-indigo-600">c.</span> {modulData.desain.kemitraan.c}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Lingkungan Belajar</span>
                          <div className="grid grid-cols-3 gap-2.5">
                            <div className="p-3 bg-indigo-50/40 rounded-xl text-center border border-indigo-100/50">
                              <span className="block text-[8px] font-bold text-indigo-500 uppercase">Fisik</span>
                              <p className="text-[10px] font-medium text-slate-700 mt-1">{modulData.desain.lingkungan.fisik}</p>
                            </div>
                            <div className="p-3 bg-teal-50/40 rounded-xl text-center border border-teal-100/50">
                              <span className="block text-[8px] font-bold text-teal-600 uppercase">Virtual</span>
                              <p className="text-[10px] font-medium text-slate-700 mt-1">{modulData.desain.lingkungan.virtual}</p>
                            </div>
                            <div className="p-3 bg-pink-50/40 rounded-xl text-center border border-pink-100/50">
                              <span className="block text-[8px] font-bold text-pink-600 uppercase">Budaya</span>
                              <p className="text-[10px] font-medium text-slate-700 mt-1">{modulData.desain.lingkungan.budaya}</p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Digital/Platform</span>
                            <p className="text-xs font-semibold text-teal-700 p-2 bg-teal-50 border border-teal-100 rounded-lg">{modulData.desain.digital}</p>
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Lintas Disiplin</span>
                            <p className="text-xs font-semibold text-slate-700 p-2 bg-slate-50 border border-slate-100 rounded-lg">{modulData.desain.lintas_disiplin}</p>
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Praktik Pedagogis</span>
                          <div className="text-xs space-y-1.5 bg-indigo-950 text-slate-300 p-4 rounded-2xl">
                            <p><span className="font-bold text-white uppercase tracking-wider text-[9px] bg-white/10 px-1.5 py-0.5 rounded mr-1">Model</span> {modulData.desain.pedagogis.model}</p>
                            <p><span className="font-bold text-white uppercase tracking-wider text-[9px] bg-white/10 px-1.5 py-0.5 rounded mr-1">Strategi</span> {modulData.desain.pedagogis.strategi}</p>
                            <p><span className="font-bold text-white uppercase tracking-wider text-[9px] bg-white/10 px-1.5 py-0.5 rounded mr-1">Metode</span> {modulData.desain.pedagogis.metode}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* III. Pengalaman Belajar */}
                  <section className="mt-8">
                    <h3 className="bg-indigo-950 text-white px-5 py-2 rounded-xl text-xs font-black inline-block uppercase tracking-wider mb-4">
                      III. PENGALAMAN BELAJAR (Langkah)
                    </h3>

                    <div className="grid gap-4 md:grid-cols-3 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm text-center">
                        <span className="font-display font-bold text-pink-600 text-xs uppercase tracking-wider block">1. Mindful Entry</span>
                        <p className="text-xs text-slate-500 leading-relaxed mt-1">{modulData.pengalaman.mindful}</p>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm text-center">
                        <span className="font-display font-bold text-indigo-600 text-xs uppercase tracking-wider block">2. Meaningful Connection</span>
                        <p className="text-xs text-slate-500 leading-relaxed mt-1">{modulData.pengalaman.meaningful}</p>
                      </div>
                      <div className="p-3 bg-white rounded-xl border border-slate-100 shadow-sm text-center">
                        <span className="font-display font-bold text-emerald-600 text-xs uppercase tracking-wider block">3. Joyful Practice</span>
                        <p className="text-xs text-slate-500 leading-relaxed mt-1">{modulData.pengalaman.joyful}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 border-l-4 border-indigo-600 bg-slate-50/50 rounded-r-2xl">
                        <span className="text-xs font-bold text-indigo-950 uppercase tracking-widest block mb-1">Kegiatan Awal (15 Menit)</span>
                        <p className="text-xs text-slate-600 leading-relaxed">{modulData.pengalaman.langkah.awal}</p>
                      </div>
                      <div className="p-4 border-l-4 border-indigo-600 bg-slate-50/50 rounded-r-2xl">
                        <span className="text-xs font-bold text-indigo-950 uppercase tracking-widest block mb-1">Kegiatan Inti (90 Menit)</span>
                        <p className="text-xs text-slate-600 leading-relaxed">{modulData.pengalaman.langkah.inti}</p>
                      </div>
                      <div className="p-4 border-l-4 border-indigo-600 bg-slate-50/50 rounded-r-2xl">
                        <span className="text-xs font-bold text-indigo-950 uppercase tracking-widest block mb-1">Kegiatan Penutup (15 Menit)</span>
                        <p className="text-xs text-slate-600 leading-relaxed">{modulData.pengalaman.langkah.penutup}</p>
                      </div>
                    </div>
                  </section>

                  {/* IV. Asesmen */}
                  <section className="mt-8">
                    <h3 className="bg-indigo-950 text-white px-5 py-2 rounded-xl text-xs font-black inline-block uppercase tracking-wider mb-4">
                      IV. ASESMEN PEMBELAJARAN
                    </h3>
                    <div className="grid gap-4 md:grid-cols-3">
                      <div className="p-4 border border-slate-100 bg-white rounded-2xl shadow-sm">
                        <h5 className="font-display font-bold text-sm text-indigo-950 mb-2">Asesmen Awal (Diagnostik)</h5>
                        <p className="text-xs text-slate-500 leading-relaxed">{modulData.asesmen.awal}</p>
                      </div>
                      <div className="p-4 border border-slate-100 bg-white rounded-2xl shadow-sm">
                        <h5 className="font-display font-bold text-sm text-indigo-950 mb-2">Asesmen Proses (Formatif)</h5>
                        <p className="text-xs text-slate-500 leading-relaxed">{modulData.asesmen.proses}</p>
                      </div>
                      <div className="p-4 border border-slate-100 bg-indigo-50/50 rounded-2xl shadow-sm">
                        <h5 className="font-display font-bold text-sm text-indigo-900 mb-2">Asesmen Akhir (Sumatif)</h5>
                        <p className="text-xs text-indigo-950 font-medium leading-relaxed">{modulData.asesmen.akhir}</p>
                      </div>
                    </div>
                  </section>

                  {/* Lampiran */}
                  <div className="page-break" />
                  <section className="mt-12 border-t border-dashed border-slate-200 pt-10">
                    <h4 className="font-display text-2xl font-black text-slate-900 text-center uppercase tracking-tight mb-8">
                      LAMPIRAN PEMBELAJARAN
                    </h4>

                    <div className="grid gap-6">
                      {/* LKPD */}
                      <div className="p-6 bg-slate-50/70 rounded-3xl border border-slate-100">
                        <h5 className="font-display font-bold text-indigo-950 mb-3 uppercase tracking-wider text-xs">
                          1. Lembar Kerja Peserta Didik (LKPD)
                        </h5>
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                          <p className="font-display font-bold text-sm text-center text-slate-800 mb-2">{modulData.lkpd.judul}</p>
                          <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl italic border border-slate-100">{modulData.lkpd.tugas}</p>
                        </div>
                      </div>

                      {/* Rubrics */}
                      <div className="p-6 bg-slate-50/70 rounded-3xl border border-slate-100 space-y-6">
                        <h5 className="font-display font-bold text-indigo-950 uppercase tracking-wider text-xs">
                          2. Rubrik Penilaian Komparatif
                        </h5>

                        <div className="grid gap-6 md:grid-cols-3 text-xs">
                          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
                            <span className="block font-bold text-slate-700 border-b border-slate-100 pb-1 uppercase tracking-wider text-[10px]">A. Rubrik Kognitif</span>
                            <div className="text-slate-500 leading-relaxed font-medium whitespace-pre-line">{modulData.rubrik.kognitif}</div>
                          </div>
                          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
                            <span className="block font-bold text-pink-700 border-b border-slate-100 pb-1 uppercase tracking-wider text-[10px]">B. Rubrik Sikap (KBC)</span>
                            <div className="text-slate-500 leading-relaxed font-medium whitespace-pre-line">{modulData.rubrik.sikap}</div>
                          </div>
                          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
                            <span className="block font-bold text-indigo-700 border-b border-slate-100 pb-1 uppercase tracking-wider text-[10px]">C. Rubrik Presentasi</span>
                            <div className="text-slate-500 leading-relaxed font-medium whitespace-pre-line">{modulData.rubrik.presentasi}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
