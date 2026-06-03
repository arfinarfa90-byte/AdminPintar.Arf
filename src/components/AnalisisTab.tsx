import React from "react";
import { Copy, FileText, CheckCircle2, ChevronRight, HelpCircle } from "lucide-react";
import { motion } from "motion/react";
import { AnalisisItem } from "../types";
import { exportToWord } from "../utils/export";

interface AnalisisTabProps {
  semester1: AnalisisItem[];
  semester2: AnalisisItem[];
  sekolah: string;
  guru: string;
  mapel: string;
}

export function AnalisisTab({ semester1, semester2, sekolah, guru, mapel }: AnalisisTabProps) {
  const [copiedIndex, setCopiedIndex] = React.useState<string | null>(null);

  const handleCopyTP = (text: string, refKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(refKey);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const renderSemesterTable = (title: string, data: AnalisisItem[], idPrefix: string) => (
    <div className="mb-12 rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-xl sm:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl font-black text-indigo-950 uppercase tracking-tight">
            {title}
          </h3>
          <p className="mt-1 text-xs text-slate-400 font-medium">
            Kumpulan TP terstruktur dengan Kompetensi Taksonomi Bloom & kurikulum KBC
          </p>
        </div>
        <span className="rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-indigo-600">
          {data.length} Tujuan Pembelajaran
        </span>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-100">
        <table className="w-full min-w-[800px] text-left border-collapse">
          <thead>
            <tr className="bg-indigo-950 text-white text-xs font-bold uppercase tracking-wider">
              <th className="p-4 w-12 text-center border-b border-indigo-900 rounded-tl-2xl">No</th>
              <th className="p-4 w-1/4 border-b border-indigo-900">Potongan Elemen CP</th>
              <th className="p-4 w-1/6 border-b border-indigo-900">Konten / Pokok Bahasan</th>
              <th className="p-4 w-1/6 border-b border-indigo-900">Kompetensi (KKO)</th>
              <th className="p-4 w-1/5 border-b border-indigo-900">Materi Spesifik</th>
              <th className="p-4 w-1/3 border-b border-indigo-900 rounded-tr-2xl">Tujuan Pembelajaran (TP)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {data.map((item, idx) => {
              const refKey = `${idPrefix}-${idx}`;
              return (
                <tr key={refKey} className="group hover:bg-slate-50/70 transition-colors">
                  <td className="p-4 text-center font-bold text-slate-400 font-mono">
                    {item.no}
                  </td>
                  <td className="p-4 text-xs text-slate-500 font-medium italic">
                    {item.cp}
                  </td>
                  <td className="p-4 font-bold text-indigo-900">
                    {item.konten}
                  </td>
                  <td className="p-4">
                    <span className="inline-block rounded-full bg-pink-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-pink-600">
                      {item.kompetensi}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-slate-700">
                    {item.materi}
                  </td>
                  <td className="p-4 text-slate-600 font-medium relative pr-12">
                    <div className="line-clamp-3 group-hover:line-clamp-none transition-all duration-300">
                      {item.tp}
                    </div>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleCopyTP(item.tp, refKey)}
                        className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-all active:scale-90"
                        title="Copy text TP"
                      >
                        {copiedIndex === refKey ? (
                          <CheckCircle2 className="h-4 w-4 text-teal-500 animate-scale" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Top Banner Toolbar */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white p-4 shadow-md border border-slate-100">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <HelpCircle className="h-5 w-5 text-indigo-500 shrink-0" />
          <span>Klik baris tabel untuk menampilkan rincian jika teks terpotong.</span>
        </div>

        <button
          onClick={() => exportToWord("analisis-output", "Analisis_Kurikulum_TP")}
          className="inline-flex items-center gap-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-display font-bold px-6 py-3 shadow-lg shadow-indigo-100 transition-all duration-200 active:scale-95"
        >
          <FileText className="h-4 w-4" />
          <span>Ekspor Analisis ke Word</span>
        </button>
      </div>

      {/* Exportable Wrapper */}
      <div id="analisis-output">
        {/* Printable Header Info */}
        <div className="hidden print:block mb-8 border-b-2 border-indigo-950 pb-4">
          <h2 className="text-2xl font-black uppercase text-indigo-950 text-center">
            ANALISIS TUJUAN PEMBELAJARAN (DEEP LEARNING)
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm font-semibold text-slate-700">
            <div>
              <p>Sekolah / Madrasah: <span className="font-light">{sekolah || "-"}</span></p>
              <p>Guru Pengampu: <span className="font-light">{guru || "-"}</span></p>
            </div>
            <div className="text-right">
              <p>Mata Pelajaran: <span className="font-light">{mapel || "-"}</span></p>
              <p>Kurikulum: <span className="font-light">Kurikulum Merdeka</span></p>
            </div>
          </div>
        </div>

        {renderSemesterTable("Semester Ganjil", semester1, "ganjil")}
        {renderSemesterTable("Semester Genap", semester2, "genap")}
      </div>
    </motion.div>
  );
}
