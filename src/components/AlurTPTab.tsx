import React from "react";
import { FileText, Compass, Info } from "lucide-react";
import { motion } from "motion/react";
import { AnalisisItem } from "../types";
import { exportToWord } from "../utils/export";

interface AlurTPTabProps {
  semester1: AnalisisItem[];
  semester2: AnalisisItem[];
  sekolah: string;
  guru: string;
  mapel: string;
}

export function AlurTPTab({ semester1, semester2, sekolah, guru, mapel }: AlurTPTabProps) {
  const renderATPTable = (title: string, data: AnalisisItem[]) => (
    <div className="rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-xl sm:p-8 print-break mb-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-2xl font-black text-indigo-950 uppercase tracking-tight">
            {title}
          </h3>
          <p className="mt-1 text-xs text-slate-400 font-medium">
            Peta sebaran kompetensi, profil lulusan pancasila/rahmatan lil alamin, JP, & lintas disiplin
          </p>
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-emerald-700">
          <Compass className="h-3 w-3 animate-pulse" /> Peta Aktif
        </span>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-slate-100">
        <table className="w-full min-w-[1000px] text-xs text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-white font-bold uppercase tracking-wider">
              <th className="p-3 w-12 text-center border-b border-slate-800 rounded-tl-2xl">No</th>
              <th className="p-3 w-1/4 border-b border-slate-800">Tujuan Pembelajaran (TP)</th>
              <th className="p-3 w-1/6 border-b border-slate-800">Indikator Pencapaian Utama</th>
              <th className="p-3 w-1/8 border-b border-slate-800">Materi Pokok</th>
              <th className="p-3 w-1/8 border-b border-slate-800 text-center">Nilai KBC</th>
              <th className="p-3 w-14 text-center border-b border-slate-800">JP</th>
              <th className="p-3 w-1/8 border-b border-slate-800">Profil Lulusan</th>
              <th className="p-3 w-1/8 border-b border-slate-800">Lintas Disiplin</th>
              <th className="p-3 w-16 text-center border-b border-slate-800">Asesmen</th>
              <th className="p-3 w-20 border-b border-slate-800 rounded-tr-2xl">Sumber Belajar</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
            {data.map((item) => (
              <tr key={item.no} className="hover:bg-slate-50/50 transition-colors">
                <td className="p-3 text-center font-bold text-slate-400 font-mono">
                  {item.no}
                </td>
                <td className="p-3 font-semibold text-slate-900">
                  {item.tp}
                </td>
                <td className="p-3 italic text-slate-500">
                  Siswa mampu melakukan aktivitas terkait <span className="font-semibold text-indigo-900">{item.konten}</span> secara mandiri dan cermat.
                </td>
                <td className="p-3 font-semibold text-indigo-700">
                  {item.materi}
                </td>
                <td className="p-3 text-center">
                  <span className="inline-block rounded-lg bg-pink-50 px-2.5 py-1 text-[10px] font-black uppercase text-pink-700 border border-pink-100">
                    {item.kbc_value || "-"}
                  </span>
                </td>
                <td className="p-3 text-center font-bold text-slate-800 font-mono">
                  4 JP
                </td>
                <td className="p-3 text-[10px] font-bold text-slate-500">
                  Penalaran Kritis, Kreativitas, Mandiri
                </td>
                <td className="p-3 text-indigo-900 italic font-semibold">
                  {item.lintas_disiplin || "-"}
                </td>
                <td className="p-3 text-center">
                  <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-slate-600">
                    Formatif
                  </span>
                </td>
                <td className="p-3 text-[10px] text-slate-400">
                  Buku Paket, Modul Mandiri, Internet
                </td>
              </tr>
            ))}
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
          <Info className="h-5 w-5 text-indigo-500 shrink-0" />
          <span>Setiap Tujuan Pembelajaran diposisikan berurutan membentuk alur (ATP) sistematis 4 JP per kegiatan.</span>
        </div>

        <button
          onClick={() => exportToWord("atp-output", "Peta_Alur_Tujuan_Pembelajaran")}
          className="inline-flex items-center gap-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-display font-bold px-6 py-3 shadow-lg shadow-indigo-100 transition-all duration-200 active:scale-95"
        >
          <FileText className="h-4 w-4" />
          <span>Ekspor Peta ATP ke Word</span>
        </button>
      </div>

      <div id="atp-output" className="space-y-8">
        {/* Printable Header Info */}
        <div className="hidden print:block mb-8 border-b-2 border-indigo-950 pb-4">
          <h2 className="text-2xl font-black uppercase text-indigo-950 text-center">
            PETA ALUR TUJUAN PEMBELAJARAN (ATP)
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

        {renderATPTable("Peta Alur TP - Semester Ganjil", semester1)}
        {renderATPTable("Peta Alur TP - Semester Genap", semester2)}
      </div>
    </motion.div>
  );
}
