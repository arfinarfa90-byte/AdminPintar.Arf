import React from "react";
import { FileText, CalendarRange } from "lucide-react";
import { motion } from "motion/react";
import { AnalisisItem } from "../types";
import { exportToWord } from "../utils/export";

interface PromesTabProps {
  semester1: AnalisisItem[];
  semester2: AnalisisItem[];
  sekolah: string;
  guru: string;
  mapel: string;
}

export function PromesTab({ semester1, semester2, sekolah, guru, mapel }: PromesTabProps) {
  const renderPromesTable = (
    title: string,
    months: string[],
    data: AnalisisItem[],
    startWeekOffset: number
  ) => {
    return (
      <div className="rounded-[2.5rem] border border-slate-100 bg-white p-6 shadow-xl sm:p-8 print-break mb-12">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h3 className="font-display text-2xl font-black text-indigo-950 uppercase tracking-tight">
            {title}
          </h3>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3.5 py-1 text-xs font-bold text-indigo-700">
            <CalendarRange className="h-3.5 w-3.5" /> Berbagi Rata Alokasi JP
          </span>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-100">
          <table className="w-full min-w-[900px] border-collapse text-[11px] text-left">
            <thead>
              <tr className="bg-slate-900 text-white font-bold text-center">
                <th rowSpan={2} className="p-3 w-10 border border-slate-800 rounded-tl-2xl">No</th>
                <th rowSpan={2} className="p-3 border border-slate-800 text-left">Tujuan Pembelajaran (TP)</th>
                <th rowSpan={2} className="p-3 w-12 border border-slate-800">JP</th>
                {months.map((m) => (
                  <th key={m} colSpan={4} className="p-1.5 border border-slate-800 font-semibold tracking-wider uppercase text-[10px]">
                    {m}
                  </th>
                ))}
              </tr>
              <tr className="bg-slate-800 text-slate-300 font-bold text-center">
                {months.map((m) => (
                  <React.Fragment key={`${m}-w`}>
                    <th className="p-1 border border-slate-700 w-6">1</th>
                    <th className="p-1 border border-slate-700 w-6">2</th>
                    <th className="p-1 border border-slate-700 w-6">3</th>
                    <th className="p-1 border border-slate-700 w-6">4</th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {data.map((item, idx) => {
                const totalWeeks = months.length * 4;
                const activeWeek = idx + startWeekOffset;

                return (
                  <tr key={item.no} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3 text-center border-r font-bold text-slate-400 font-mono">
                      {item.no}
                    </td>
                    <td className="p-3 font-semibold text-slate-900 border-r max-w-sm whitespace-normal leading-relaxed">
                      {item.tp}
                    </td>
                    <td className="p-3 text-center font-black text-indigo-900 border-r font-mono bg-indigo-50/50">
                      4 JP
                    </td>
                    {Array.from({ length: totalWeeks }).map((_, wIdx) => {
                      const weekNumber = wIdx + 1;
                      const isActive = weekNumber === activeWeek;
                      return (
                        <td
                          key={weekNumber}
                          className={`p-1 border-r text-center font-bold ${
                            isActive
                              ? "bg-indigo-600 text-white font-mono text-center align-middle"
                              : ""
                          }`}
                        >
                          {isActive ? "X" : ""}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

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
          Modul Program Semester (PROMES) memetakan sebaran alokasi 4 JP Tujuan Pembelajaran dalam kegiatan mingguan tiap bulan.
        </p>

        <button
          onClick={() => exportToWord("promes-output", "Program_Semester_PROMES")}
          className="inline-flex items-center gap-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-display font-bold px-6 py-3 shadow-lg shadow-indigo-100 transition-all duration-200 active:scale-95"
        >
          <FileText className="h-4 w-4" />
          <span>Ekspor PROMES ke Word</span>
        </button>
      </div>

      <div id="promes-output" className="space-y-4">
        {/* Printable info header */}
        <div className="hidden print:block mb-8 border-b-2 border-indigo-950 pb-4">
          <h2 className="text-2xl font-black uppercase text-indigo-950 text-center">
            PROGRAM SEMESTER (PROMES)
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

        {renderPromesTable(
          "Semester Ganjil",
          ["Juli", "Agustus", "September", "Oktober", "November", "Desember"],
          semester1,
          2
        )}

        {renderPromesTable(
          "Semester Genap",
          ["Januari", "Februari", "Maret", "April", "Mei", "Juni"],
          semester2,
          1
        )}
      </div>
    </motion.div>
  );
}
