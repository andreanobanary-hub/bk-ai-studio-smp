import React, { useState } from 'react';
import { StudentPeer, ClassRoom, IKMSItem } from '../types';
import { STANDARD_IKMS_ITEMS } from '../data/constants';
import {
  UserCheck,
  X,
  Heart,
  Users,
  BookOpen,
  Compass,
  CheckCircle2,
  ShieldCheck,
  Send,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface StudentPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeClass: ClassRoom;
  onSaveStudentSubmission: (updatedStudent: StudentPeer) => void;
}

export const StudentPortalModal: React.FC<StudentPortalModalProps> = ({
  isOpen,
  onClose,
  activeClass,
  onSaveStudentSubmission,
}) => {
  const [selectedStudentId, setSelectedStudentId] = useState<number | 'new'>(
    activeClass.siswa.length > 0 ? activeClass.siswa[0].id : 'new'
  );
  const [customNama, setCustomNama] = useState<string>('');
  const [gender, setGender] = useState<'L' | 'P'>('L');
  const [pilihan1, setPilihan1] = useState<number>(0);
  const [pilihan2, setPilihan2] = useState<number>(0);
  const [selectedIKMS, setSelectedIKMS] = useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // When student selection changes
  const handleStudentSelect = (val: string) => {
    if (val === 'new') {
      setSelectedStudentId('new');
      setCustomNama('');
      setPilihan1(0);
      setPilihan2(0);
      setSelectedIKMS([]);
    } else {
      const id = parseInt(val, 10);
      setSelectedStudentId(id);
      const existing = activeClass.siswa.find((s) => s.id === id);
      if (existing) {
        setGender(existing.gender);
        setPilihan1(existing.pilihan1Id || 0);
        setPilihan2(existing.pilihan2Id || 0);
        setSelectedIKMS(existing.ikmsResponses || []);
      }
    }
  };

  const toggleIKMS = (id: number) => {
    setSelectedIKMS((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    let finalId: number;
    let finalNama: string;

    if (selectedStudentId === 'new') {
      if (!customNama.trim()) {
        setErrorMsg('Silakan ketik nama lengkap kamu terlebih dahulu.');
        return;
      }
      finalId = activeClass.siswa.length > 0 ? Math.max(...activeClass.siswa.map((s) => s.id)) + 1 : 1;
      finalNama = customNama.trim();
    } else {
      finalId = selectedStudentId;
      const exist = activeClass.siswa.find((s) => s.id === finalId);
      finalNama = exist ? exist.nama : 'Peserta Didik';
    }

    if (pilihan1 !== 0 && pilihan1 === finalId) {
      setErrorMsg('Pilihan Teman 1 tidak boleh memilih diri sendiri.');
      return;
    }
    if (pilihan2 !== 0 && pilihan2 === finalId) {
      setErrorMsg('Pilihan Teman 2 tidak boleh memilih diri sendiri.');
      return;
    }
    if (pilihan1 !== 0 && pilihan2 !== 0 && pilihan1 === pilihan2) {
      setErrorMsg('Pilihan Teman 1 dan Teman 2 sebaiknya teman yang berbeda.');
      return;
    }

    const submission: StudentPeer = {
      id: finalId,
      nama: finalNama,
      gender,
      pilihan1Id: pilihan1,
      pilihan2Id: pilihan2,
      ikmsResponses: selectedIKMS,
      submittedViaPortal: true,
      timestamp: new Date().toLocaleString('id-ID'),
    };

    onSaveStudentSubmission(submission);
    setIsSubmitted(true);
  };

  const handleResetForNext = () => {
    setIsSubmitted(false);
    setSelectedStudentId('new');
    setCustomNama('');
    setPilihan1(0);
    setPilihan2(0);
    setSelectedIKMS([]);
    setErrorMsg(null);
  };

  const currentStudentName =
    selectedStudentId === 'new'
      ? customNama || 'Peserta Didik'
      : activeClass.siswa.find((s) => s.id === selectedStudentId)?.nama || 'Peserta Didik';

  // Group IKMS items by bidang
  const ikmsPribadi = STANDARD_IKMS_ITEMS.filter((i) => i.bidang === 'Pribadi');
  const ikmsSosial = STANDARD_IKMS_ITEMS.filter((i) => i.bidang === 'Sosial');
  const ikmsBelajar = STANDARD_IKMS_ITEMS.filter((i) => i.bidang === 'Belajar');
  const ikmsKarier = STANDARD_IKMS_ITEMS.filter((i) => i.bidang === 'Karier');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-xs border border-white/20">
              <UserCheck className="w-6 h-6 text-blue-200" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-blue-400/30 text-blue-100 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Portal Siswa Mandiri
                </span>
                <span className="text-xs text-blue-200 font-medium">{activeClass.namaKelas}</span>
              </div>
              <h3 className="text-base font-black tracking-tight">Angket Sosiometri & Kebutuhan Diri (IKMS)</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isSubmitted ? (
          <div className="p-8 text-center space-y-5 my-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-xl font-black text-slate-900">Terima Kasih, {currentStudentName}!</h4>
              <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
                Jawaban angket sosiometri dan kebutuhan belajarmu telah berhasil disimpan. Guru BK menjamin{' '}
                <strong className="text-indigo-700">kerahasiaan penuh</strong> atas setiap pilihan dan ceritamu.
              </p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-md mx-auto text-left text-xs text-slate-600 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Kelas:</span>
                <span className="font-bold text-slate-800">{activeClass.namaKelas}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Pilihan Relasi:</span>
                <span className="font-bold text-slate-800">2 Teman Terpilih</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Kebutuhan Diri (IKMS):</span>
                <span className="font-bold text-blue-700">{selectedIKMS.length} Masalah/Topik Dicatat</span>
              </div>
            </div>
            <div className="flex justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleResetForNext}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" />
                <span>Isi untuk Siswa Berikutnya</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-colors"
              >
                Selesai & Kembali ke Ruang BK
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
            {/* Banner Kerahasiaan */}
            <div className="bg-blue-50 border border-blue-200/80 rounded-xl p-3.5 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-900 leading-relaxed">
                <strong>Asas Kerahasiaan BK:</strong> Semua jawaban yang kamu masukkan bersifat pribadi dan hanya
                digunakan oleh Guru BK untuk membantu suasana belajar yang nyaman dan mencegah perundungan di kelas.
              </p>
            </div>

            {errorMsg && (
              <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Identitas Siswa */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span>Langkah 1: Identitas Peserta Didik</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pilih Nama Kamu di Daftar Kelas {activeClass.namaKelas}:
                  </label>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => handleStudentSelect(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  >
                    {activeClass.siswa.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.id}. {st.nama} ({st.gender === 'L' ? 'Laki-laki' : 'Perempuan'})
                      </option>
                    ))}
                    <option value="new">+ Nama Saya Belum Ada di Daftar (Ketik Baru)</option>
                  </select>
                </div>

                {selectedStudentId === 'new' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Ketik Nama Lengkap Kamu:
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Muhammad Rizki"
                      value={customNama}
                      onChange={(e) => setCustomNama(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Jenis Kelamin:</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setGender('L')}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                        gender === 'L'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      Laki-laki
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('P')}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                        gender === 'P'
                          ? 'bg-pink-600 text-white border-pink-600'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      Perempuan
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Pilihan Sosiometri */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>Langkah 2: Sosiometri Relasi Teman Sebaya</span>
                </h4>
                <span className="text-[11px] text-slate-500 font-medium">Kriteria: {activeClass.kriteriaSosiometri}</span>
              </div>
              <p className="text-xs text-slate-600">
                Pilihlah 2 orang teman sekelas yang paling nyaman untuk kamu ajak berdiskusi atau berbagi cerita:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pilihan Teman Pertama (Pilihan 1):
                  </label>
                  <select
                    value={pilihan1}
                    onChange={(e) => setPilihan1(parseInt(e.target.value, 10))}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  >
                    <option value={0}>-- Pilih Teman Sebaya 1 --</option>
                    {activeClass.siswa
                      .filter((s) => s.id !== selectedStudentId)
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.nama} ({s.gender === 'L' ? 'L' : 'P'})
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Pilihan Teman Kedua (Pilihan 2):
                  </label>
                  <select
                    value={pilihan2}
                    onChange={(e) => setPilihan2(parseInt(e.target.value, 10))}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  >
                    <option value={0}>-- Pilih Teman Sebaya 2 --</option>
                    {activeClass.siswa
                      .filter((s) => s.id !== selectedStudentId && s.id !== pilihan1)
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.nama} ({s.gender === 'L' ? 'L' : 'P'})
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Checklist IKMS */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider flex items-center gap-1.5">
                  <Heart className="w-4 h-4 text-rose-600" />
                  <span>Langkah 3: Ceklis Kebutuhan & Masalah Remaja (IKMS)</span>
                </h4>
                <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  {selectedIKMS.length} Masalah Dipilih
                </span>
              </div>
              <p className="text-xs text-slate-600">
                Centang setiap pernyataan di bawah ini yang sesuai dengan apa yang sedang kamu rasakan atau alami saat ini (boleh lebih dari satu):
              </p>

              <div className="space-y-4">
                {/* Pribadi */}
                <div>
                  <div className="flex items-center gap-2 mb-2 text-xs font-black text-blue-700">
                    <Heart className="w-3.5 h-3.5" />
                    <span>A. Bidang Pribadi (Emosi, Kebiasaan, Rasa Percaya Diri)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ikmsPribadi.map((item) => (
                      <label
                        key={item.id}
                        className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                          selectedIKMS.includes(item.id)
                            ? 'bg-blue-50/80 border-blue-300 text-blue-950 font-medium'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedIKMS.includes(item.id)}
                          onChange={() => toggleIKMS(item.id)}
                          className="mt-0.5 rounded-sm border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="leading-snug">{item.pernyataan}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Sosial */}
                <div>
                  <div className="flex items-center gap-2 mb-2 text-xs font-black text-indigo-700">
                    <Users className="w-3.5 h-3.5" />
                    <span>B. Bidang Sosial (Pertemanan, Pergaulan, Anti-Bullying)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ikmsSosial.map((item) => (
                      <label
                        key={item.id}
                        className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                          selectedIKMS.includes(item.id)
                            ? 'bg-indigo-50/80 border-indigo-300 text-indigo-950 font-medium'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedIKMS.includes(item.id)}
                          onChange={() => toggleIKMS(item.id)}
                          className="mt-0.5 rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="leading-snug">{item.pernyataan}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Belajar */}
                <div>
                  <div className="flex items-center gap-2 mb-2 text-xs font-black text-emerald-700">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>C. Bidang Belajar (Gaya Belajar, Konsentrasi, Tugas Sekolah)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ikmsBelajar.map((item) => (
                      <label
                        key={item.id}
                        className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                          selectedIKMS.includes(item.id)
                            ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-medium'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedIKMS.includes(item.id)}
                          onChange={() => toggleIKMS(item.id)}
                          className="mt-0.5 rounded-sm border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <span className="leading-snug">{item.pernyataan}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Karier */}
                <div>
                  <div className="flex items-center gap-2 mb-2 text-xs font-black text-amber-700">
                    <Compass className="w-3.5 h-3.5" />
                    <span>D. Bidang Karier (Bakat Minat, Cita-cita, SMA vs SMK)</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ikmsKarier.map((item) => (
                      <label
                        key={item.id}
                        className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition-all ${
                          selectedIKMS.includes(item.id)
                            ? 'bg-amber-50/80 border-amber-300 text-amber-950 font-medium'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100/50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedIKMS.includes(item.id)}
                          onChange={() => toggleIKMS(item.id)}
                          className="mt-0.5 rounded-sm border-slate-300 text-amber-600 focus:ring-amber-500"
                        />
                        <span className="leading-snug">{item.pernyataan}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>Kirim Jawaban Angket Saya</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
