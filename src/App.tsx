/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Header } from "./components/Header";
import { InputDataTab } from "./components/InputDataTab";
import { AnalisisTab } from "./components/AnalisisTab";
import { AlurTPTab } from "./components/AlurTPTab";
import { PPMTab } from "./components/PPMTab";
import { PromesTab } from "./components/PromesTab";
import { ProtaTab } from "./components/ProtaTab";
import { AnalisisItem, AnalisisResponse } from "./types";
import { BookOpen, Sparkles, AlertCircle, LayoutDashboard, Database, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Initial sample CP to make testing/experiencing extremely smooth and educational
const CONTOH_CP = `Peserta didik mampu menganalisis sejarah lahirnya Pancasila; menganalisis kedudukan Pancasila sebagai dasar negara, pandangan hidup bangsa, dan ideologi negara; memetakan gagasan para pendiri negara tentang rumusan Pancasila; menganalisis penerapan nilai-nilai Pancasila dalam kehidupan bermasyarakat, berbangsa, dan bernegara. Peserta didik juga mampu membedakan dan mematuhi peraturan perundang-undangan; menyadari hak dan kewajiban sebagai warga negara; serta mempraktekkan perilaku gotong-royong demi mempererat persatuan bangsa dan menumbuhkan rasa cinta negeri.`;

export default function App() {
  const [activeTab, setActiveTab] = React.useState<string>("data");
  
  // Form States
  const [sekolah, setSekolah] = React.useState<string>("SMK Negeri 1 Kudus");
  const [guru, setGuru] = React.useState<string>("Drs. HARMAJI, M.Pd");
  const [mapel, setMapel] = React.useState<string>("Pendidikan Pancasila");
  const [fase, setFase] = React.useState<string>("F");
  const [tapel, setTapel] = React.useState<string>("2025/2026");
  const [cpInput, setCpInput] = React.useState<string>("");

  // Analysis Result States
  const [semester1, setSemester1] = React.useState<AnalisisItem[]>([]);
  const [semester2, setSemester2] = React.useState<AnalisisItem[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

  const isDataAvailable = semester1.length > 0 || semester2.length > 0;

  const handleFillSample = () => {
    setCpInput(CONTOH_CP);
    setSekolah("SMK Negeri 1 Kudus");
    setGuru("Drs. HARMAJI, M.Pd");
    setMapel("Pendidikan Pancasila");
    setFase("F");
    setTapel("2025/2026");
  };

  const handleGenerateAnalisis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cpInput.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);
    setActiveTab("analisis"); // Switch to analysis view to show loader

    try {
      const response = await fetch("/api/generate-analisis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cp: cpInput,
          fase,
          mapel,
          guru,
          sekolah,
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal memperoleh hasil analisis dari AI Server.");
      }

      const data: AnalisisResponse = await response.json();
      setSemester1(data.semester1 || []);
      setSemester2(data.semester2 || []);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Koneksi ke AI terputus. Silakan coba kembali.");
      setActiveTab("data"); // bounce back on error
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "data", label: "1. Input Data" },
    { id: "analisis", label: "2. Analisis TP (Deep)", disabled: !isDataAvailable && !isLoading },
    { id: "atp", label: "3. Alur TP (Peta)", disabled: !isDataAvailable },
    { id: "ppm", label: "4. PPM (Modul)", disabled: !isDataAvailable },
    { id: "promes", label: "5. PROMES", disabled: !isDataAvailable },
    { id: "prota", label: "6. PROTA", disabled: !isDataAvailable },
  ];

  return (
    <div className="min-h-screen bg-slate-50/40 font-sans text-slate-800 glow-bg p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Header */}
        <Header />

        {/* Quick Fill Sample Helper for first time teachers */}
        {activeTab === "data" && !cpInput && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 bg-indigo-50/60 border border-indigo-100 rounded-2xl flex flex-wrap items-center justify-between gap-4 no-print"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-white">
                <Sparkles className="h-4 w-4" />
              </span>
              <p className="text-xs font-semibold text-indigo-950">
                Baru pertama kali mencoba? Isi data CP secara instan dengan contoh draft kurikulum merdeka.
              </p>
            </div>
            <button
              onClick={handleFillSample}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-display text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95"
            >
              Gunakan Contoh CP
            </button>
          </motion.div>
        )}

        {/* Navigasi Utama */}
        <nav className="no-print sticky top-4 z-40 mb-8 flex flex-wrap gap-2.5 rounded-3xl border border-slate-200 bg-white/80 p-3.5 shadow-xl backdrop-blur-xl">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                disabled={tab.disabled}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-btn rounded-2xl px-5 py-3 font-display text-xs font-extrabold tracking-wide transition-all duration-300 disabled:pointer-events-none disabled:opacity-30 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-100"
                    : "bg-white text-slate-600 hover:bg-indigo-50/50 hover:text-indigo-900 border border-slate-100"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        {/* Content Tabs Switcher */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {isLoading && activeTab === "analisis" && (
              <motion.div
                key="loading-ai"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-[2.5rem] border border-slate-100 bg-white p-12 text-center shadow-xl py-36"
              >
                <div className="relative inline-block mb-6 h-16 w-16 text-indigo-600 animate-spin">
                  <div className="absolute top-0 left-0 w-full h-full border-8 border-indigo-50 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-full h-full border-8 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                </div>
                <h3 className="font-display text-2xl font-black text-indigo-950 uppercase tracking-tight">
                  Analisis Kurikulum AI Berjalan
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-slate-500 font-light leading-relaxed">
                  Mesin AI sedang membedah Capaian Pembelajaran, memecah sebaran taksonomi kompetensi, merumuskan 24 TP, serta menyinkronkan nilai Kurikulum Berbasis Cinta (KBC). Mohon tunggu beberapa saat...
                </p>
              </motion.div>
            )}

            {!isLoading && errorMsg && (
              <motion.div
                key="error-box"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-xl mx-auto p-8 bg-red-50/50 border border-red-200 rounded-3xl text-center shadow-md mb-8"
              >
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h4 className="font-display font-black text-lg text-red-950 uppercase">Gagal Memproses CP</h4>
                <p className="mt-2 text-sm text-red-700 leading-relaxed">{errorMsg}</p>
                <button
                  onClick={handleFillSample}
                  className="mt-6 rounded-2xl bg-red-600 px-6 py-3 font-display font-bold text-white shadow-lg shadow-red-100 hover:bg-red-700 active:scale-95 transition-all"
                >
                  Gunakan Contoh Draft Aman
                </button>
              </motion.div>
            )}

            {!isLoading && activeTab === "data" && (
              <InputDataTab
                sekolah={sekolah}
                setSekolah={setSekolah}
                guru={guru}
                setGuru={setGuru}
                mapel={mapel}
                setMapel={setMapel}
                fase={fase}
                setFase={setFase}
                tapel={tapel}
                setTapel={setTapel}
                cpInput={cpInput}
                setCpInput={setCpInput}
                onGenerate={handleGenerateAnalisis}
                isLoading={isLoading}
              />
            )}

            {!isLoading && isDataAvailable && activeTab === "analisis" && (
              <AnalisisTab
                semester1={semester1}
                semester2={semester2}
                sekolah={sekolah}
                guru={guru}
                mapel={mapel}
              />
            )}

            {!isLoading && isDataAvailable && activeTab === "atp" && (
              <AlurTPTab
                semester1={semester1}
                semester2={semester2}
                sekolah={sekolah}
                guru={guru}
                mapel={mapel}
              />
            )}

            {!isLoading && isDataAvailable && activeTab === "ppm" && (
              <PPMTab
                analisisData={[...semester1, ...semester2]}
                sekolah={sekolah}
                guru={guru}
                mapel={mapel}
                fase={fase}
              />
            )}

            {!isLoading && isDataAvailable && activeTab === "promes" && (
              <PromesTab
                semester1={semester1}
                semester2={semester2}
                sekolah={sekolah}
                guru={guru}
                mapel={mapel}
              />
            )}

            {!isLoading && isDataAvailable && activeTab === "prota" && (
              <ProtaTab
                semester1={semester1}
                semester2={semester2}
                sekolah={sekolah}
                guru={guru}
                mapel={mapel}
              />
            )}

            {/* General Fallback Placeholder for locked tabs if no analysis is present */}
            {!isLoading && !isDataAvailable && activeTab !== "data" && (
              <motion.div
                key="fallback-unlocked"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="rounded-[2.5rem] border border-slate-100 bg-white p-12 text-center shadow-xl py-24"
              >
                <Database className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="font-display text-lg font-bold text-slate-700 uppercase">Menu Terkunci</h3>
                <p className="mt-1 text-sm text-slate-400 max-w-xs mx-auto">
                  Silakan masukkan data Capaian Pembelajaran (CP) dan jalankan Analisis AI terlebih dahulu di tab pertama.
                </p>
                <button
                  onClick={() => setActiveTab("data")}
                  className="mt-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-display text-xs font-bold px-6 py-3 transition-all active:scale-95"
                >
                  Kembali ke Input Data
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
