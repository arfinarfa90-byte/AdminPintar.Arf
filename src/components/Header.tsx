import React from "react";
import { Sparkles, GraduationCap, Heart, User } from "lucide-react";
import { motion } from "motion/react";

export function Header() {
  return (
    <header className="relative overflow-hidden rounded-[2rem] bg-indigo-950 p-8 text-white shadow-2xl md:p-12 mb-8">
      {/* Decorative ambient background elements */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 h-96 w-96 rounded-full bg-gradient-to-br from-pink-500/10 to-indigo-500/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-pink-500/5 blur-3xl" />

      <div className="relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-wrap items-center gap-3 mb-4"
        >
          <span className="inline-flex items-center gap-1.5 rounded-full bg-pink-500 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-white shadow-lg">
            <Sparkles className="h-3 w-3" /> Deep Learning & KBC
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium tracking-wide text-indigo-200 backdrop-blur-md">
            AI Powered OS
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-none text-white">
            Administrasi Guru Pintar
          </h1>
          <p className="mt-4 max-w-2xl text-lg sm:text-xl font-light leading-relaxed text-indigo-200">
            Sistem otomatisasi analisis Tujuan Pembelajaran (TP), Alur TP (Peta), Perencanaan Pembelajaran Mendalam (Modul / PPM), Program Semester (PROMES), & Program Tahunan (PROTA) berbasis kecerdasan buatan.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 flex flex-wrap gap-4"
        >
          <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-6 py-3 shadow-sm backdrop-blur-md">
            <User className="h-5 w-5 text-pink-400" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">Pengembang Sistem</p>
              <p className="font-display font-medium text-white text-base">Arfin Arfa, S.T.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-6 py-3 shadow-sm backdrop-blur-md">
            <GraduationCap className="h-5 w-5 text-teal-400" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-300">Kurikulum Nasional</p>
              <p className="font-display font-medium text-white text-base">Kurikulum Merdeka</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="absolute right-8 bottom-8 hidden lg:block opacity-10 rotate-12 transition-transform hover:scale-110 duration-700">
        <Heart className="h-64 w-64 text-pink-400 fill-pink-400" />
      </div>
    </header>
  );
}
