import React, { useState, useMemo } from 'react';
import { SchoolProfile, StudentPeer, SosiometriResult } from '../types';
import { SAMPLE_STUDENTS_7A, IKMS_NEED_DATA } from '../data/constants';
import {
  Users2,
  AlertTriangle,
  Star,
  UserX,
  HeartHandshake,
  Printer,
  Plus,
  RefreshCw,
  BarChart3,
  ShieldAlert,
  HelpCircle,
  FileSpreadsheet,
} from 'lucide-react';

interface AsesmenViewProps {
  profile: SchoolProfile;
  onShowToast: (msg: string) => void;
}

export const AsesmenView: React.FC<AsesmenViewProps> = ({
  profile,
  onShowToast,
}) => {
  const [subTab, setSubTab] = useState<'sosiometri' | 'ikms'>('sosiometri');
  const [selectedKelas, setSelectedKelas] = useState<string>('Kelas 7-A');
  const [kriteria, setKriteria] = useState<string>('Teman Belajar Kelompok & Berbagi Cerita');
  const [students, setStudents] = useState<StudentPeer[]>(SAMPLE_STUDENTS_7A);

  // New Student modal or state
  const [newNama, setNewNama] = useState<string>('');
  const [newGender, setNewGender] = useState<'L' | 'P'>('L');

  // Calculate sociometry matrix & results
  const results: SosiometriResult[] = useMemo(() => {
    return students.map((st) => {
      // Find who chose this student
      const choosers = students.filter(
        (other) => other.id !== st.id && (other.pilihan1Id === st.id || other.pilihan2Id === st.id)
      );

      const skor = choosers.length;
      let status: SosiometriResult['status'] = 'Normal';
      let catatanIntervensi = 'Kondisi relasi sebaya dalam kategori wajar dan adaptif.';

      if (skor === 0) {
        status = 'Terisolasi (0 Pilihan)';
        catatanIntervensi =
          'PERINGATAN DINI: Siswa tidak dipilih oleh teman sekelas. Rentan mengalami penarikan diri (withdrawn), kesepian, atau potensi korban perundungan terselubung. Rekomendasi: Konseling Individual, asesmen minat, dan program Buddy System.';
      } else if (skor >= 4) {
        status = 'Bintang (Populer)';
        catatanIntervensi =
          'Siswa memiliki daya tarik sosial tinggi dan dipercaya teman. Berpotensi diberdayakan sebagai Peer Counselor (Konselor Sebaya) atau ketua kelompok inklusif.';
      } else if (skor === 1) {
        status = 'Diabaikan';
        catatanIntervensi =
          'Penerimaan sosial rendah. Perlu dipantau keaktifannya dalam dinamika kelompok kerja di kelas.';
      }

      return {
        studentId: st.id,
        nama: st.nama,
        gender: st.gender,
        skor,
        pemilih: choosers.map((c) => c.nama),
        status,
        catatanIntervensi,
      };
    });
  }, [students]);

  // Mutual pairs (pasangan saling memilih)
  const mutualPairs = useMemo(() => {
    const pairs: Array<{ p1: string; p2: string }> = [];
    students.forEach((s1) => {
      students.forEach((s2) => {
        if (s1.id < s2.id) {
          const s1ChoseS2 = s1.pilihan1Id === s2.id || s1.pilihan2Id === s2.id;
          const s2ChoseS1 = s2.pilihan1Id === s1.id || s2.pilihan2Id === s1.id;
          if (s1ChoseS2 && s2ChoseS1) {
            pairs.push({ p1: s1.nama, p2: s2.nama });
          }
        }
      });
    });
    return pairs;
  }, [students]);

  // Isolated students count
  const isolatedStudents = results.filter((r) => r.skor === 0);
  const popularStudents = results.filter((r) => r.skor >= 4);

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNama.trim()) return;

    const newId = students.length > 0 ? Math.max(...students.map((s) => s.id)) + 1 : 1;
    // Default pick first two existing students if available
    const p1 = students.length > 0 ? students[0].id : 0;
    const p2 = students.length > 1 ? students[1].id : 0;

    const newSt: StudentPeer = {
      id: newId,
      nama: newNama.trim(),
      gender: newGender,
      pilihan1Id: p1,
      pilihan2Id: p2,
    };

    setStudents([...students, newSt]);
    setNewNama('');
    onShowToast(`Siswa "${newSt.nama}" berhasil ditambahkan ke sosiometri!`);
  };

  const handleUpdateChoice = (studentId: number, field: 'pilihan1Id' | 'pilihan2Id', value: number) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === studentId ? { ...s, [field]: value } : s))
    );
  };

  const handleResetData = () => {
    setStudents(SAMPLE_STUDENTS_7A);
    onShowToast('Data simulasi sosiometri berhasil dimuat ulang!');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Tab Switcher & Header */}
      <div className="no-print bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Users2 className="w-5 h-5 text-blue-600" />
            <span>Asesmen Kebutuhan & Dinamika Sosial Siswa SMP</span>
          </h2>
          <p className="text-xs text-slate-500">
            Pemetaan sosiometri pertemanan sebaya (deteksi siswa terisolasi/bullying) & instrumen kebutuhan IKMS/AKPD
          </p>
        </div>

        {/* Subtabs */}
        <div className="flex p-1 bg-slate-100 rounded-xl space-x-1 shrink-0">
          <button
            onClick={() => setSubTab('sosiometri')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              subTab === 'sosiometri'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sosiometri Teman Sebaya
          </button>
          <button
            onClick={() => setSubTab('ikms')}
            className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${
              subTab === 'ikms'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Profil Kebutuhan IKMS / AKPD
          </button>
        </div>
      </div>

      {subTab === 'sosiometri' ? (
        <div className="space-y-6">
          {/* Sosiometri Alert Summary Cards */}
          <div className="no-print grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Terisolasi Card */}
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start space-x-3">
              <div className="p-2.5 bg-rose-600 text-white rounded-xl">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                  Siswa Terisolasi (0 Pilihan)
                </div>
                <div className="text-2xl font-black text-rose-900 mt-0.5">
                  {isolatedStudents.length} Siswa
                </div>
                <p className="text-[11px] text-rose-700 mt-1">
                  Prioritas pemantauan konselor untuk pencegahan perundungan & pengucilan sosial.
                </p>
              </div>
            </div>

            {/* Bintang Card */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start space-x-3">
              <div className="p-2.5 bg-amber-500 text-white rounded-xl">
                <Star className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                  Siswa Bintang / Populer
                </div>
                <div className="text-2xl font-black text-amber-900 mt-0.5">
                  {popularStudents.length} Siswa
                </div>
                <p className="text-[11px] text-amber-700 mt-1">
                  Memiliki penerimaan teman sangat tinggi, calon agen kebaikan & konselor sebaya kelas.
                </p>
              </div>
            </div>

            {/* Pasangan Sahabat (Mutual) Card */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex items-start space-x-3">
              <div className="p-2.5 bg-indigo-600 text-white rounded-xl">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-indigo-800 uppercase tracking-wider">
                  Pasangan Saling Memilih (Mutual)
                </div>
                <div className="text-2xl font-black text-indigo-900 mt-0.5">
                  {mutualPairs.length} Pasang
                </div>
                <p className="text-[11px] text-indigo-700 mt-1">
                  Ikatan pertemanan akrab dua arah yang terbentuk di dalam kelas.
                </p>
              </div>
            </div>
          </div>

          {/* Sosiometri Controls Bar */}
          <div className="no-print bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                  Kelas Sasaran:
                </label>
                <select
                  value={selectedKelas}
                  onChange={(e) => setSelectedKelas(e.target.value)}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg text-slate-800 outline-hidden"
                >
                  <option value="Kelas 7-A">Kelas 7-A (Fase D)</option>
                  <option value="Kelas 7-B">Kelas 7-B (Fase D)</option>
                  <option value="Kelas 8-A">Kelas 8-A (Fase D)</option>
                  <option value="Kelas 9-C">Kelas 9-C (Fase D)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                  Kriteria Angket Sosiometri:
                </label>
                <input
                  type="text"
                  value={kriteria}
                  onChange={(e) => setKriteria(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 outline-hidden w-64"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleResetData}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors"
                title="Muat Ulang Data Simulasi 15 Siswa"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Simulasi</span>
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Laporan Sosiometri</span>
              </button>
            </div>
          </div>

          {/* Sosiometri Printable Sheet */}
          <div className="print-area bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-md space-y-6">
            {/* Header Laporan */}
            <div className="border-b-2 border-slate-900 pb-3 text-center space-y-1">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700">
                Laporan Hasil Asesmen Sosiometri Dinamika Hubungan Teman Sebaya
              </h2>
              <h3 className="text-base font-black text-slate-900 uppercase">
                {profile.namaSekolah} • {selectedKelas}
              </h3>
              <p className="text-xs text-slate-600">
                Kriteria Angket: "{kriteria}" • Semester {profile.semester} T.A. {profile.tahunPelajaran}
              </p>
            </div>

            {/* Alert Box for Isolated Students */}
            {isolatedStudents.length > 0 && (
              <div className="p-4 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-950 space-y-2">
                <div className="flex items-center gap-2 font-black text-xs text-rose-800 uppercase tracking-wider">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Peringatan Dini Deteksi Siswa Terisolasi (Bullying / Social Exclusion)</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  {isolatedStudents.map((iso) => (
                    <div key={iso.studentId} className="p-2.5 bg-white rounded-lg border border-rose-200">
                      <div className="font-bold text-slate-900 flex items-center justify-between">
                        <span>{iso.studentId}. {iso.nama}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold">
                          0 Pilihan
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                        {iso.catatanIntervensi}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Matrix Table */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                  <span>Tabel Matriks Pilihan Sosiometri ({students.length} Siswa)</span>
                </h4>
                <span className="text-[11px] text-slate-500">
                  Tiap siswa memilih 2 teman sebaya
                </span>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-xs divide-y divide-slate-200">
                  <thead className="bg-slate-100 text-slate-700">
                    <tr>
                      <th className="p-2.5 text-center w-12 font-bold">No</th>
                      <th className="p-2.5 text-left font-bold">Nama Peserta Didik</th>
                      <th className="p-2.5 text-center w-12 font-bold">L/P</th>
                      <th className="p-2.5 text-left w-36 font-bold">Pilihan 1</th>
                      <th className="p-2.5 text-left w-36 font-bold">Pilihan 2</th>
                      <th className="p-2.5 text-center w-20 font-bold bg-blue-50 text-blue-900">Total Dipilih</th>
                      <th className="p-2.5 text-left w-44 font-bold">Status Hubungan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {students.map((st, idx) => {
                      const res = results.find((r) => r.studentId === st.id)!;
                      const isIso = res.skor === 0;
                      const isStar = res.skor >= 4;

                      return (
                        <tr
                          key={st.id}
                          className={`hover:bg-slate-50/80 transition-colors ${
                            isIso ? 'bg-rose-50/40' : isStar ? 'bg-amber-50/30' : ''
                          }`}
                        >
                          <td className="p-2.5 text-center font-bold text-slate-600">{idx + 1}</td>
                          <td className="p-2.5 font-semibold text-slate-900">
                            {st.nama}
                            {isIso && (
                              <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700">
                                Butuh Perhatian
                              </span>
                            )}
                          </td>
                          <td className="p-2.5 text-center text-slate-600 font-medium">{st.gender}</td>

                          {/* Pilihan 1 editable in screen */}
                          <td className="p-2">
                            <select
                              value={st.pilihan1Id}
                              onChange={(e) => handleUpdateChoice(st.id, 'pilihan1Id', parseInt(e.target.value, 10))}
                              className="w-full text-xs p-1 bg-slate-50 border border-slate-200 rounded text-slate-800"
                            >
                              {students
                                .filter((other) => other.id !== st.id)
                                .map((other) => (
                                  <option key={other.id} value={other.id}>
                                    {other.id}. {other.nama.split(' ')[0]}
                                  </option>
                                ))}
                            </select>
                          </td>

                          {/* Pilihan 2 editable in screen */}
                          <td className="p-2">
                            <select
                              value={st.pilihan2Id}
                              onChange={(e) => handleUpdateChoice(st.id, 'pilihan2Id', parseInt(e.target.value, 10))}
                              className="w-full text-xs p-1 bg-slate-50 border border-slate-200 rounded text-slate-800"
                            >
                              {students
                                .filter((other) => other.id !== st.id)
                                .map((other) => (
                                  <option key={other.id} value={other.id}>
                                    {other.id}. {other.nama.split(' ')[0]}
                                  </option>
                                ))}
                            </select>
                          </td>

                          {/* Total Dipilih */}
                          <td className="p-2.5 text-center font-black bg-blue-50/60 text-blue-900">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full ${
                                isIso
                                  ? 'bg-rose-200 text-rose-900 font-black'
                                  : isStar
                                  ? 'bg-amber-200 text-amber-900 font-black'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {res.skor}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="p-2.5 font-medium">
                            {isIso ? (
                              <span className="text-rose-700 font-bold flex items-center gap-1">
                                <UserX className="w-3.5 h-3.5" />
                                <span>Terisolasi</span>
                              </span>
                            ) : isStar ? (
                              <span className="text-amber-700 font-bold flex items-center gap-1">
                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                <span>Bintang (Populer)</span>
                              </span>
                            ) : (
                              <span className="text-slate-600">Normal Adaptif</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Rekomendasi Program Tindak Lanjut Guru BK */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3 text-xs">
              <h4 className="font-black text-slate-900 uppercase tracking-wider">
                Rencana Intervensi & Tindak Lanjut Guru BK SMP:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <div className="font-bold text-blue-800 mb-1">1. Siswa Terisolasi:</div>
                  <p className="text-slate-600 leading-relaxed">
                    Lakukan pemanggilan konseling individual secara privat (tanpa memberi tahu hasil angket secara frontal). Gali kendala adaptasi, hambatan komunikasi, dan pasangkan dengan teman pendamping yang ramah.
                  </p>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <div className="font-bold text-indigo-800 mb-1">2. Siswa Bintang (Populer):</div>
                  <p className="text-slate-600 leading-relaxed">
                    Diberikan pembekalan empati dan tanggung jawab sosial sebagai pemimpin informal kelas agar tidak membentuk klik eksklusif atau geng yang menolak teman lain.
                  </p>
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-lg">
                  <div className="font-bold text-emerald-800 mb-1">3. Dinamika Kelas Utuh:</div>
                  <p className="text-slate-600 leading-relaxed">
                    Jadwalkan layanan bimbingan klasikal bertema "Menghargai Keberagaman & Pertemanan Sehat" dan lakukan rotasi kelompok belajar secara terencana oleh wali kelas.
                  </p>
                </div>
              </div>
            </div>

            {/* Signature Area */}
            <div className="pt-6 border-t border-slate-300">
              <div className="flex justify-between items-start text-xs text-slate-800 px-4">
                <div className="text-left space-y-14">
                  <div>
                    <p>Mengetahui,</p>
                    <p className="font-bold">Kepala {profile.namaSekolah}</p>
                  </div>
                  <div>
                    <p className="font-bold underline uppercase">{profile.namaKepalaSekolah}</p>
                    <p className="text-slate-600">NIP. {profile.nipKepalaSekolah || '_________________________'}</p>
                  </div>
                </div>

                <div className="text-left space-y-14">
                  <div>
                    <p>{profile.kota}, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    <p className="font-bold">Guru Bimbingan dan Konseling</p>
                  </div>
                  <div>
                    <p className="font-bold underline uppercase">{profile.namaGuruBK}</p>
                    <p className="text-slate-600">NIP. {profile.nipGuruBK || '_________________________'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Tambah Siswa Baru (no-print) */}
          <div className="no-print bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-blue-600" />
              <span>Tambah Siswa Baru ke Daftar Sosiometri</span>
            </h4>
            <form onSubmit={handleAddStudent} className="flex flex-wrap items-center gap-3">
              <input
                type="text"
                value={newNama}
                onChange={(e) => setNewNama(e.target.value)}
                placeholder="Nama Lengkap Siswa..."
                className="flex-1 min-w-[200px] px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 outline-hidden focus:border-blue-500"
              />
              <select
                value={newGender}
                onChange={(e) => setNewGender(e.target.value as 'L' | 'P')}
                className="px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800 outline-hidden"
              >
                <option value="L">Laki-laki (L)</option>
                <option value="P">Perempuan (P)</option>
              </select>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-colors"
              >
                + Tambah Siswa
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* Tab 2: IKMS / AKPD */
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-indigo-600" />
                  <span>Profil Kebutuhan Peserta Didik (IKMS / AKPD) Fase D</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Distribusi persentase kebutuhan dan masalah terbanyak siswa SMP pada 4 bidang bimbingan
                </p>
              </div>
              <button
                onClick={() => window.print()}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Profil IKMS</span>
              </button>
            </div>

            {/* 4 Bidang Bar Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {IKMS_NEED_DATA.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                      Bidang Layanan {item.bidang}
                    </span>
                    <span className="text-sm font-black text-blue-700">{item.persentase}% Kebutuhan</span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.warna} rounded-full transition-all duration-500`}
                      style={{ width: `${item.persentase}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-600 font-medium">
                    Fokus: {item.deskripsi}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-200">
                    <div className="text-[11px] font-bold text-slate-700">3 Masalah Tertinggi di SMP:</div>
                    <ul className="text-xs space-y-1 text-slate-600 pl-4">
                      {item.topIssues.map((issue, i) => (
                        <li key={i} className="list-disc leading-tight text-[11px]">
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Rekomendasi Program Tahunan BK SMP */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-2">
              <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                Implikasi pada Program Kerja BK SMP Fase D:
              </h4>
              <p className="text-xs text-blue-800 leading-relaxed">
                Berdasarkan data asesmen IKMS, bidang <strong>Sosial (74%)</strong> dan <strong>Pribadi (68%)</strong> menempati urutan prioritas tertinggi. Disarankan untuk memprioritaskan layanan bimbingan klasikal bertema <em>Anti-Bullying & Relasi Pertemanan</em> di awal semester ganjil, serta <em>Manajemen Screen-Time Gadget</em> pada pertengahan semester.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
