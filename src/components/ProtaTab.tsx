import React from "react";
import { FileText, Award } from "lucide-react";
import { motion } from "motion/react";
import { AnalisisItem } from "../types";
import { exportToWord } from "../utils/export";

interface ProtaTabProps {
  semester1: AnalisisItem[];
  semester2: AnalisisItem[];
  sekolah: string;
  guru: string;
  mapel: string;
}

export function ProtaTab({ semester1, semester2, sekolah, guru, mapel }: ProtaTabProps) {
  const totalJP = (semester1.length + semester2.length) * 4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Top Toolbar */}
      <div className="no-print flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-white p-4 shadow-md border border-slate-100">
        <p className="text-xs font-semibold text-slate-500">
          Program Tahunan (PROTA) merekapitulasi sebaran Tujuan Pembelajaran terstruktur beserta total alokasi jam tatap muka setahun penuh.
        </p>

        <button
          onClick={() => exportToWord("prota-output", "Program_Tahunan_PROTA")}
          className="inline-flex items-center gap-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-display font-bold px-6 py-3 shadow-lg shadow-indigo-100 transition-all duration-200 active:scale-95"
        >
          <FileText className="h-4 w-4" />
          <span>Ekspor PROTA ke Word</span>
        </button>
      </div>

      <div id="prota-output" className="rounded-[2.5rem] border border-slate-100 bg-white p-6 sm:p-10 shadow-xl">
        {/* Printable info header */}
        <div className="mb-8 border-b-2 border-indigo-950 pb-4 text-center">
          <h2 className="text-3xl font-black uppercase text-indigo-950">
            PROGRAM TAHUNAN (PROTA)
          </h2>
          <p className="text-pink-600 font-bold text-xs uppercase tracking-widest mt-1">
            Kurikulum Merdeka Berbasis Cinta
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm font-semibold text-slate-700 text-left border-t border-slate-100 pt-4">
            <div>
              <p>Sekolah / Madrasah: <span className="font-light">{sekolah || "-"}</span></p>
              <p>Guru Pengampu: <span className="font-light">{guru || "-"}</span></p>
            </div>
            <div className="text-right">
              <p>Mata Pelajaran: <span className="font-light">{mapel || "-"}</span></p>
              <p>Th Pelajaran: <span className="font-light">2025/2026</span></p>
            </div>
          </div>
        </div>

        {/* PROTA Table */}
        <div className="overflow-x-auto rounded-3xl border border-slate-100">
          <table className="w-full min-w-[700px] border-collapse text-left text-sm">
            <thead>
              <tr className="bg-slate-900 text-white font-bold uppercase tracking-wider text-xs">
                <th className="p-4 w-32 text-center border border-slate-800 rounded-tl-2xl">Semester</th>
                <th className="p-4 w-12 text-center border border-slate-800">No</th>
                <th className="p-4 border border-slate-800">Tujuan Pembelajaran (TP Deep Learning)</th>
                <th className="p-4 w-32 text-center border border-slate-800 rounded-tr-2xl">Alokasi Waktu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium font-sans">
              {/* Semester 1 Rows */}
              {semester1.map((item, idx) => (
                <tr key={item.no} className="hover:bg-slate-50/50 transition-colors">
                  {idx === 0 && (
                    <td
                      rowSpan={semester1.length}
                      className="text-center font-black bg-slate-50 text-indigo-950 border border-slate-100 w-32 align-middle text-sm uppercase tracking-wider"
                    >
                      Semester 1 (Ganjil)
                    </td>
                  )}
                  <td className="p-4 text-center border border-slate-100 font-bold text-slate-400 font-mono">
                    {item.no}
                  </td>
                  <td className="p-4 border border-slate-100 font-semibold text-slate-900 pr-8">
                    {item.tp}
                  </td>
                  <td className="p-4 text-center border border-slate-100 font-black text-slate-800 font-mono bg-slate-50/40">
                    4 JP
                  </td>
                </tr>
              ))}

              {/* Semester 2 Rows */}
              {semester2.map((item, idx) => (
                <tr key={item.no} className="hover:bg-slate-50/50 transition-colors">
                  {idx === 0 && (
                    <td
                      rowSpan={semester2.length}
                      className="text-center font-black bg-slate-50 text-pink-900 border border-slate-100 w-32 align-middle text-sm uppercase tracking-wider"
                    >
                      Semester 2 (Genap)
                    </td>
                  )}
                  <td className="p-4 text-center border border-slate-100 font-bold text-slate-400 font-mono">
                    {item.no}
                  </td>
                  <td className="p-4 border border-slate-100 font-semibold text-slate-100 pr-8 text-slate-900">
                    {item.tp}
                  </td>
                  <td className="p-4 text-center border border-slate-100 font-black text-slate-800 font-mono bg-slate-50/40">
                    4 JP
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-indigo-950 text-white font-black text-lg">
                <td colSpan={3} className="p-6 text-right uppercase tracking-wider text-xs">
                  Total Jam Pelajaran / Tahun Tatap Muka
                </td>
                <td className="p-6 text-center text-xl font-mono">
                  {totalJP} JP
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
