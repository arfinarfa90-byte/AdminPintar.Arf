export interface AnalisisItem {
  no: number;
  cp: string;
  konten: string;
  kompetensi: string;
  materi: string;
  tp: string;
  kbc_value: string;
  lintas_disiplin: string;
}

export interface AnalisisResponse {
  semester1: AnalisisItem[];
  semester2: AnalisisItem[];
}

export interface PPMModul {
  identitas: {
    alokasi: string;
    profil: string;
    kbc: string;
  };
  desain: {
    cp_integrated: string;
    lintas_disiplin: string;
    tp_integrated: string;
    pedagogis: {
      model: string;
      strategi: string;
      metode: string;
    };
    kemitraan: {
      a: string;
      b: string;
      c: string;
    };
    lingkungan: {
      fisik: string;
      virtual: string;
      budaya: string;
    };
    digital: string;
  };
  pengalaman: {
    mindful: string;
    meaningful: string;
    joyful: string;
    langkah: {
      awal: string;
      inti: string;
      penutup: string;
    };
  };
  asesmen: {
    awal: string;
    proses: string;
    akhir: string;
  };
  lkpd: {
    judul: string;
    tugas: string;
  };
  rubrik: {
    kognitif: string;
    sikap: string;
    presentasi: string;
  };
}
