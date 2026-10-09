import React, { useState } from 'react';
import { SchoolProfile, LKPDData } from '../types';
import {
  Sparkles,
  Printer,
  Copy,
  BookOpen,
  Calendar,
  CheckCircle2,
  Heart,
  Lightbulb,
  Compass,
  FileCheck,
  RotateCcw,
} from 'lucide-react';

interface LKPDViewProps {
  profile: SchoolProfile;
  currentTopikRPL: string;
  currentKelasRPL: string;
  onShowToast: (msg: string) => void;
}

export const LKPDView: React.FC<LKPDViewProps> = ({
  profile,
  currentTopikRPL,
  currentKelasRPL,
  onShowToast,
}) => {
  const [topik, setTopik] = useState<string>(
    currentTopikRPL || 'Membangun Pertemanan Sehat & Anti-Bullying'
  );
  const [kelas, setKelas] = useState<string>(currentKelasRPL || 'Kelas 7 SMP');
  const [bidang, setBidang] = useState<string>('Sosial');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // LKPD State
  const [lkpd, setLkpd] = useState<LKPDData>({
    topik: topik,
    kelas: kelas,
    bidang: bidang,
    instruksiSiswa:
      'Halo Sahabat Konseli! Isilah lembar refleksi 4F ini dengan jujur dan santai. Jawabanmu adalah cermin pemikiran dan perasaanmu untuk bertumbuh menjadi remaja yang hebat dan berkarakter!',
    refleksi4F: {
      fact: {
        pertanyaan:
          'Ceritakan peristiwa nyata atau situasi yang pernah kamu lihat / alami di lingkungan sekolah atau pertemanan terkait materi ini!',
        contohPemandu:
          'Contoh: "Saya pernah melihat teman satu kelompok diejek karena salah menjawab pertanyaan di depan kelas..."',
      },
      feeling: {
        pertanyaan:
          'Apa yang kamu rasakan saat kejadian tersebut berlangsung, dan bagaimana perasaanmu setelah mengikuti layanan bimbingan hari ini?',
        contohPemandu:
          'Contoh: "Saat itu saya merasa serba salah dan kasihan, namun setelah layanan hari ini saya merasa lebih percaya diri dan ingin menjadi pembela teman..."',
      },
      finding: {
        pertanyaan:
          'Pelajaran berharga atau pencerahan baru apa yang kamu temukan tentang dirimu dan arti persahabatan?',
        contohPemandu:
          'Contoh: "Saya menyadari bahwa diam saat melihat teman dibully sama saja membiarkan keburukan terjadi. Sahabat sejati saling melindungi..."',
      },
      future: {
        pertanyaan:
          'Tuliskan 2 aksi nyata yang akan kamu praktikkan langsung mulai besok di kelas atau rumah!',
        contohPemandu:
          'Contoh: "1) Menyapa dan mengajak teman yang sedang menyendiri untuk bergabung; 2) Berani menegur secara santun jika ada teman yang mengejek nama orang tua."',
      },
    },
    komitmenDiri: [
      'Saya berkomitmen untuk menciptakan suasana pertemanan kelas yang aman, hangat, dan tanpa perundungan.',
      'Saya tidak ragu untuk bercerita dan berkonsultasi kepada Guru BK jika menghadapi masalah yang membingungkan.',
    ],
  });

  const handleGenerateAI = async () => {
    if (!topik.trim()) {
      onShowToast('Masukkan topik materi LKPD terlebih dahulu');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-lkpd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topik, kelas, bidang }),
      });

      if (!response.ok) {
        throw new Error('Gagal menghubungi AI');
      }

      const data = await response.json();
      setLkpd(data);
      onShowToast('Lembar Refleksi 4F berhasil disusun secara otomatis!');
    } catch (err: any) {
      console.error(err);
      onShowToast('Gagal memproses AI, menggunakan format standar refleksi');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSyncFromRPL = () => {
    if (currentTopikRPL) {
      setTopik(currentTopikRPL);
      setKelas(currentKelasRPL);
      onShowToast(`Sinkronisasi dengan topik aktif: "${currentTopikRPL}"`);
    } else {
      onShowToast('Tidak ada topik RPL aktif');
    }
  };

  const handleCopyLKPD = () => {
    const text = `
LEMBAR KERJA PESERTA DIDIK (LKPD) BK SMP (FASE D)
MODEL REFLEKSI 4F (FACT, FEELING, FINDING, FUTURE)
SEKOLAH : ${profile.namaSekolah}
TOPIK   : ${lkpd.topik}
KELAS   : ${lkpd.kelas}

Petunjuk:
${lkpd.instruksiSiswa}

1. FACT (Peristiwa):
${lkpd.refleksi4F.fact.pertanyaan}
Jawaban: _________________________________________________

2. FEELING (Perasaan):
${lkpd.refleksi4F.feeling.pertanyaan}
Jawaban: _________________________________________________

3. FINDING (Pembelajaran):
${lkpd.refleksi4F.finding.pertanyaan}
Jawaban: _________________________________________________

4. FUTURE (Aksi Nyata):
${lkpd.refleksi4F.future.pertanyaan}
Jawaban: _________________________________________________

Komitmen Diri:
${lkpd.komitmenDiri.map((k, i) => `[ ] ${k}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(text);
    onShowToast('Konten LKPD berhasil disalin ke clipboard!');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Bar */}
      <div className="no-print bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span>Media & LKPD Refleksi Diri 4F (Ramah Siswa SMP)</span>
          </h2>
          <p className="text-xs text-slate-500">
            Model Refleksi 4F (Fact, Feeling, Finding, Future) Kurikulum Merdeka untuk menumbuhkan kesadaran diri konseli
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleSyncFromRPL}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
            title="Gunakan topik dari form RPL"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Gunakan Topik RPL Aktif</span>
          </button>
          <button
            onClick={handleCopyLKPD}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Salin</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Cetak LKPD (A4)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form: Parameter LKPD (no-print) */}
        <div className="no-print lg:col-span-4 space-y-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
            Sesuaikan Materi LKPD
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Sasaran Kelas
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {['Kelas 7 SMP', 'Kelas 8 SMP', 'Kelas 9 SMP'].map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setKelas(k)}
                  className={`py-1.5 px-2 text-xs font-bold rounded-lg border text-center transition-all ${
                    kelas === k
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {k.replace(' SMP', '')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Bidang Layanan
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {['Pribadi', 'Sosial', 'Belajar', 'Karier'].map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBidang(b)}
                  className={`py-1.5 px-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                    bidang === b
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-700 font-bold'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
              Topik Pembelajaran
            </label>
            <textarea
              rows={3}
              value={topik}
              onChange={(e) => setTopik(e.target.value)}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-hidden font-medium text-slate-800"
              placeholder="Masukkan topik..."
            />
          </div>

          <button
            type="button"
            onClick={handleGenerateAI}
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Menyusun LKPD (AI)...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Susun Ulang Pertanyaan Refleksi (AI)</span>
              </>
            )}
          </button>

          {/* Pedagogy explanation */}
          <div className="p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl text-[11px] text-indigo-900 space-y-1">
            <div className="font-bold flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5 text-indigo-600" />
              <span>Mengapa Model 4F Efektif untuk SMP?</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Model 4F (dikembangkan Dr. Roger Greenaway) memandu remaja mulai dari fakta objektif (Fact), menyadari emosi tanpa canggung (Feeling), memetik hikmah (Finding), hingga merumuskan tindakan mandiri (Future).
            </p>
          </div>
        </div>

        {/* Right Area: Printable LKPD Sheet */}
        <div className="lg:col-span-8 space-y-4">
          <div className="print-area bg-white p-8 md:p-10 rounded-2xl border border-slate-200 shadow-lg text-slate-900 space-y-5">
            {/* Kop LKPD */}
            <div className="border-b-2 border-slate-900 pb-3 text-center space-y-1">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {profile.namaSekolah} • Layanan Bimbingan dan Konseling
              </h2>
              <h3 className="text-base font-black text-slate-900 uppercase">
                Lembar Kerja Peserta Didik (LKPD) Refleksi Diri 4F
              </h3>
              <p className="text-xs text-slate-600">
                Topik: <span className="font-bold text-slate-900">"{lkpd.topik}"</span> • Sasaran: {lkpd.kelas} (Fase D SMP)
              </p>
            </div>

            {/* Identitas Siswa Box */}
            <div className="border border-slate-300 rounded-xl p-3 bg-slate-50/60 text-xs">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <span className="font-bold text-slate-600 block">Nama Peserta Didik:</span>
                  <div className="h-6 border-b border-dotted border-slate-400 mt-1"></div>
                </div>
                <div>
                  <span className="font-bold text-slate-600 block">Kelas / Absen:</span>
                  <div className="h-6 border-b border-dotted border-slate-400 mt-1"></div>
                </div>
                <div>
                  <span className="font-bold text-slate-600 block">Hari, Tanggal:</span>
                  <div className="h-6 border-b border-dotted border-slate-400 mt-1"></div>
                </div>
                <div>
                  <span className="font-bold text-slate-600 block">Guru Pembimbing:</span>
                  <div className="text-slate-800 font-semibold mt-1 truncate">
                    {profile.namaGuruBK.split(',')[0]}
                  </div>
                </div>
              </div>
            </div>

            {/* Petunjuk Pengisian */}
            <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl text-xs text-blue-900">
              <span className="font-bold">Petunjuk Siswa: </span>
              <span>{lkpd.instruksiSiswa}</span>
            </div>

            {/* 4F Reflection Grid */}
            <div className="space-y-4">
              {/* 1. FACT */}
              <div className="border border-blue-200 rounded-xl overflow-hidden">
                <div className="bg-blue-600 text-white px-3 py-1.5 flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>1. FACT (Peristiwa / Pengalaman Nyata)</span>
                  </span>
                  <span className="text-[10px] bg-blue-700 px-2 py-0.5 rounded text-blue-100">
                    Apa yang terjadi?
                  </span>
                </div>
                <div className="p-3.5 bg-white space-y-2">
                  <p className="text-xs font-semibold text-slate-800">
                    {lkpd.refleksi4F?.fact?.pertanyaan}
                  </p>
                  <p className="text-[11px] text-slate-400 italic">
                    {lkpd.refleksi4F?.fact?.contohPemandu}
                  </p>
                  <div className="h-20 border border-dashed border-slate-300 rounded-lg p-2 bg-slate-50/50">
                    <span className="text-[11px] text-slate-400 select-none">
                      (Tuliskan jawaban refleksi pribadimu di sini...)
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. FEELING */}
              <div className="border border-rose-200 rounded-xl overflow-hidden">
                <div className="bg-rose-600 text-white px-3 py-1.5 flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5" />
                    <span>2. FEELING (Perasaan yang Muncul)</span>
                  </span>
                  <span className="text-[10px] bg-rose-700 px-2 py-0.5 rounded text-rose-100">
                    Bagaimana perasaanmu?
                  </span>
                </div>
                <div className="p-3.5 bg-white space-y-2">
                  <p className="text-xs font-semibold text-slate-800">
                    {lkpd.refleksi4F?.feeling?.pertanyaan}
                  </p>
                  <p className="text-[11px] text-slate-400 italic">
                    {lkpd.refleksi4F?.feeling?.contohPemandu}
                  </p>
                  <div className="h-20 border border-dashed border-slate-300 rounded-lg p-2 bg-slate-50/50">
                    <span className="text-[11px] text-slate-400 select-none">
                      (Tuliskan apa yang kamu rasakan tanpa ragu...)
                    </span>
                  </div>
                </div>
              </div>

              {/* 3. FINDING */}
              <div className="border border-amber-200 rounded-xl overflow-hidden">
                <div className="bg-amber-600 text-white px-3 py-1.5 flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-1.5">
                    <Lightbulb className="w-3.5 h-3.5" />
                    <span>3. FINDING (Pembelajaran & Makna Baru)</span>
                  </span>
                  <span className="text-[10px] bg-amber-700 px-2 py-0.5 rounded text-amber-100">
                    Pelajaran apa yang dipetik?
                  </span>
                </div>
                <div className="p-3.5 bg-white space-y-2">
                  <p className="text-xs font-semibold text-slate-800">
                    {lkpd.refleksi4F?.finding?.pertanyaan}
                  </p>
                  <p className="text-[11px] text-slate-400 italic">
                    {lkpd.refleksi4F?.finding?.contohPemandu}
                  </p>
                  <div className="h-20 border border-dashed border-slate-300 rounded-lg p-2 bg-slate-50/50">
                    <span className="text-[11px] text-slate-400 select-none">
                      (Tuliskan hikmah atau pencerahan yang kamu peroleh...)
                    </span>
                  </div>
                </div>
              </div>

              {/* 4. FUTURE */}
              <div className="border border-emerald-200 rounded-xl overflow-hidden">
                <div className="bg-emerald-600 text-white px-3 py-1.5 flex items-center justify-between text-xs font-bold">
                  <span className="flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5" />
                    <span>4. FUTURE (Aksi Nyata & Langkah ke Depan)</span>
                  </span>
                  <span className="text-[10px] bg-emerald-700 px-2 py-0.5 rounded text-emerald-100">
                    Apa yang akan kamu lakukan?
                  </span>
                </div>
                <div className="p-3.5 bg-white space-y-2">
                  <p className="text-xs font-semibold text-slate-800">
                    {lkpd.refleksi4F?.future?.pertanyaan}
                  </p>
                  <p className="text-[11px] text-slate-400 italic">
                    {lkpd.refleksi4F?.future?.contohPemandu}
                  </p>
                  <div className="h-20 border border-dashed border-slate-300 rounded-lg p-2 bg-slate-50/50">
                    <span className="text-[11px] text-slate-400 select-none">
                      (Tuliskan rencana aksi nyata dan praktis yang akan kamu lakukan...)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Komitmen Diri Siswa */}
            <div className="p-4 bg-slate-50 border border-slate-300 rounded-xl space-y-2 text-xs">
              <span className="font-bold text-slate-900 uppercase tracking-wider block">
                Lembar Komitmen Pribadi Konseli:
              </span>
              <div className="space-y-1.5">
                {lkpd.komitmenDiri?.map((k, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <div className="w-4 h-4 border border-slate-400 rounded-sm bg-white shrink-0"></div>
                    <span className="text-slate-800">{k}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lembar Tanda Tangan / Paraf */}
            <div className="pt-4 border-t border-slate-300">
              <div className="grid grid-cols-3 gap-4 text-center text-xs text-slate-800">
                <div className="space-y-12">
                  <p className="font-semibold">Peserta Didik,</p>
                  <p className="font-medium text-slate-500">(..........................................)</p>
                </div>
                <div className="space-y-12">
                  <p className="font-semibold">Orang Tua / Wali,</p>
                  <p className="font-medium text-slate-500">(..........................................)</p>
                </div>
                <div className="space-y-12">
                  <p className="font-semibold">Guru Bimbingan dan Konseling,</p>
                  <p className="font-bold underline text-slate-900">{profile.namaGuruBK}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
