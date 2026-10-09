import React, { useState, useMemo, useEffect } from 'react';
import { SchoolProfile, StudentPeer, SosiometriResult, ClassRoom } from '../types';
import { INITIAL_CLASSES } from '../data/constants';
import {
  loadClasses,
  saveClasses,
  loadActiveClassId,
  saveActiveClassId,
  calculateDynamicIKMSSummaries,
} from '../services/storageService';
import { StudentPortalModal } from './StudentPortalModal';
import { ImportStudentsModal } from './ImportStudentsModal';
import { GoogleSheetsSyncModal } from './GoogleSheetsSyncModal';
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
  FileSpreadsheet,
  Upload,
  UserCheck,
  CheckCircle2,
  Trash2,
  Layers,
  Sparkles,
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
  const [classes, setClasses] = useState<ClassRoom[]>(() => loadClasses());
  const [activeClassId, setActiveClassId] = useState<string>(() => loadActiveClassId());

  // Modal States
  const [isStudentPortalOpen, setIsStudentPortalOpen] = useState<boolean>(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState<boolean>(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState<boolean>(false);

  // New Student Inline Form
  const [newNama, setNewNama] = useState<string>('');
  const [newGender, setNewGender] = useState<'L' | 'P'>('L');

  // New Class Inline Form
  const [isAddingClass, setIsAddingClass] = useState<boolean>(false);
  const [newClassName, setNewClassName] = useState<string>('');
  const [newClassLevel, setNewClassLevel] = useState<string>('Kelas 7 SMP');

  // Save classes whenever updated
  useEffect(() => {
    saveClasses(classes);
  }, [classes]);

  useEffect(() => {
    saveActiveClassId(activeClassId);
  }, [activeClassId]);

  // Current active class
  const activeClass = useMemo(() => {
    const found = classes.find((c) => c.id === activeClassId);
    return found || classes[0] || INITIAL_CLASSES[0];
  }, [classes, activeClassId]);

  const students = activeClass.siswa;

  // Helper to update current class
  const updateCurrentClass = (updater: (prev: ClassRoom) => ClassRoom) => {
    setClasses((prevClasses) =>
      prevClasses.map((c) => (c.id === activeClass.id ? updater(c) : c))
    );
  };

  // Calculate dynamic sociometry results
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

  // Counts
  const isolatedStudents = results.filter((r) => r.skor === 0);
  const popularStudents = results.filter((r) => r.skor >= 4);
  const studentsWithIKMSSubmission = students.filter(
    (s) => s.ikmsResponses && s.ikmsResponses.length > 0
  );

  // Dynamic IKMS data calculated from students real submissions
  const dynamicIKMSSummaries = useMemo(() => {
    return calculateDynamicIKMSSummaries(students);
  }, [students]);

  // Handle student portal submission
  const handleSaveStudentSubmission = (submittedStudent: StudentPeer) => {
    updateCurrentClass((prev) => {
      const idx = prev.siswa.findIndex((s) => s.id === submittedStudent.id);
      let newStudents = [...prev.siswa];
      if (idx >= 0) {
        newStudents[idx] = submittedStudent;
      } else {
        newStudents.push(submittedStudent);
      }
      return { ...prev, siswa: newStudents };
    });
    onShowToast(`Respon angket dari "${submittedStudent.nama}" berhasil disimpan & diperbarui!`);
  };

  // Handle imported students from CSV / Excel
  const handleImportStudents = (newStudents: StudentPeer[], mode: 'replace' | 'append') => {
    updateCurrentClass((prev) => {
      let merged: StudentPeer[];
      if (mode === 'replace') {
        merged = newStudents;
      } else {
        const startId = prev.siswa.length > 0 ? Math.max(...prev.siswa.map((s) => s.id)) + 1 : 1;
        const adjusted = newStudents.map((s, idx) => ({ ...s, id: startId + idx }));
        merged = [...prev.siswa, ...adjusted];
      }
      return { ...prev, siswa: merged };
    });
    onShowToast(`${newStudents.length} siswa berhasil diterapkan ke ${activeClass.namaKelas}!`);
  };

  // Handle Google Sheet sync
  const handleSyncComplete = (updatedStudents: StudentPeer[], url: string, message: string) => {
    updateCurrentClass((prev) => ({
      ...prev,
      siswa: updatedStudents,
      googleSheetSyncUrl: url,
      lastSyncTime: new Date().toLocaleString('id-ID'),
    }));
    onShowToast(message);
  };

  // Handle inline Add Student
  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNama.trim()) return;

    const newId = students.length > 0 ? Math.max(...students.map((s) => s.id)) + 1 : 1;
    const newSt: StudentPeer = {
      id: newId,
      nama: newNama.trim(),
      gender: newGender,
      pilihan1Id: 0,
      pilihan2Id: 0,
      ikmsResponses: [],
    };

    updateCurrentClass((prev) => ({
      ...prev,
      siswa: [...prev.siswa, newSt],
    }));

    setNewNama('');
    onShowToast(`Siswa "${newSt.nama}" berhasil ditambahkan ke ${activeClass.namaKelas}!`);
  };

  // Handle update choices in table
  const handleUpdateChoice = (studentId: number, field: 'pilihan1Id' | 'pilihan2Id', value: number) => {
    updateCurrentClass((prev) => ({
      ...prev,
      siswa: prev.siswa.map((s) => (s.id === studentId ? { ...s, [field]: value } : s)),
    }));
  };

  // Handle delete student
  const handleDeleteStudent = (studentId: number) => {
    updateCurrentClass((prev) => ({
      ...prev,
      siswa: prev.siswa.filter((s) => s.id !== studentId),
    }));
    onShowToast('Siswa berhasil dihapus dari daftar kelas.');
  };

  // Handle Add New Class
  const handleCreateNewClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    const newId = `kelas-${Date.now().toString(36)}`;
    const createdClass: ClassRoom = {
      id: newId,
      namaKelas: newClassName.trim(),
      tingkat: newClassLevel,
      tahunPelajaran: profile.tahunPelajaran || '2026/2027',
      kriteriaSosiometri: 'Teman Belajar Kelompok & Berbagi Cerita',
      siswa: [],
    };

    setClasses((prev) => [...prev, createdClass]);
    setActiveClassId(newId);
    setIsAddingClass(false);
    setNewClassName('');
    onShowToast(`Kelas baru "${createdClass.namaKelas}" berhasil dibuat!`);
  };

  // Handle Reset to Demo
  const handleResetData = () => {
    setClasses(INITIAL_CLASSES);
    setActiveClassId(INITIAL_CLASSES[0].id);
    onShowToast('Data simulasi sosiometri & IKMS berhasil dikembalikan ke standar awal!');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Tab Switcher & Header */}
      <div className="no-print bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Users2 className="w-5 h-5 text-blue-600" />
              <span>Asesmen Kebutuhan & Sosiometri Siswa SMP</span>
            </h2>
            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-200">
              Data Nyata Interaktif
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Instrumen terpadu sosiometri relasi sebaya, deteksi siswa terisolasi/bullying, dan analisis kebutuhan IKMS Fase D
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

      {/* Action Bar (Student Portal, Import, Sync, Class Switcher) */}
      <div className="no-print bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-4 rounded-2xl shadow-md border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          {/* Class Selector */}
          <div>
            <label className="text-[10px] font-bold text-blue-200 uppercase tracking-wider block mb-1">
              Kelas Sasaran:
            </label>
            <div className="flex items-center gap-2">
              <select
                value={activeClassId}
                onChange={(e) => setActiveClassId(e.target.value)}
                className="px-3 py-1.5 text-xs font-bold bg-slate-800 border border-slate-700 rounded-lg text-white outline-hidden focus:border-blue-400"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.namaKelas} ({c.siswa.length} Siswa)
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setIsAddingClass(!isAddingClass)}
                className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold border border-white/20 transition-colors"
                title="Tambah Kelas Baru"
              >
                + Kelas
              </button>
            </div>
          </div>

          {/* Quick Stats Pill */}
          <div className="hidden lg:flex items-center space-x-3 text-xs bg-white/10 px-3 py-1.5 rounded-lg border border-white/15">
            <div>
              <span className="text-slate-300">Total: </span>
              <strong className="text-white">{students.length} Siswa</strong>
            </div>
            <div className="text-slate-400">|</div>
            <div>
              <span className="text-slate-300">Respon IKMS: </span>
              <strong className="text-emerald-300">
                {studentsWithIKMSSubmission.length}/{students.length} ({students.length > 0 ? Math.round((studentsWithIKMSSubmission.length / students.length) * 100) : 0}%)
              </strong>
            </div>
          </div>
        </div>

        {/* Buttons: Student Portal, Import, Google Sheet Sync */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Main Action: Student Portal */}
          <button
            type="button"
            onClick={() => setIsStudentPortalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-xl text-xs font-black shadow-lg transition-all flex items-center gap-2 border border-blue-400/40"
          >
            <UserCheck className="w-4 h-4 text-blue-100" />
            <span>Portal Siswa (Isi Angket)</span>
          </button>

          {/* Import CSV / Excel */}
          <button
            type="button"
            onClick={() => setIsImportModalOpen(true)}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Impor Data Siswa</span>
          </button>

          {/* Sync Google Sheets */}
          <button
            type="button"
            onClick={() => setIsSyncModalOpen(true)}
            className="px-3 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Sync Google Sheets</span>
          </button>

          {/* Reset Demo */}
          <button
            type="button"
            onClick={handleResetData}
            title="Reset data ke standar contoh"
            className="p-2 bg-white/10 hover:bg-white/20 text-slate-200 rounded-xl text-xs transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add New Class Form Drawer */}
      {isAddingClass && (
        <div className="no-print bg-blue-50 border border-blue-200 p-4 rounded-xl flex flex-wrap items-center gap-3">
          <span className="text-xs font-bold text-blue-900">Buat Kelas Baru:</span>
          <input
            type="text"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
            placeholder="Contoh: Kelas 7-C, Kelas 8-A..."
            className="px-3 py-1.5 text-xs bg-white border border-blue-300 rounded-lg text-slate-800 outline-hidden focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={newClassLevel}
            onChange={(e) => setNewClassLevel(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-blue-300 rounded-lg text-slate-800 outline-hidden"
          >
            <option value="Kelas 7 SMP">Kelas 7 SMP</option>
            <option value="Kelas 8 SMP">Kelas 8 SMP</option>
            <option value="Kelas 9 SMP">Kelas 9 SMP</option>
          </select>
          <button
            type="button"
            onClick={handleCreateNewClass}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors"
          >
            Simpan Kelas
          </button>
          <button
            type="button"
            onClick={() => setIsAddingClass(false)}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Batal
          </button>
        </div>
      )}

      {subTab === 'sosiometri' ? (
        <div className="space-y-6">
          {/* Sosiometri Alert Summary Cards */}
          <div className="no-print grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Terisolasi Card */}
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start space-x-3">
              <div className="p-2.5 bg-rose-600 text-white rounded-xl shadow-xs">
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
                  Prioritas pemantauan konselor untuk pencegahan perundungan & pengucilan sosial di {activeClass.namaKelas}.
                </p>
              </div>
            </div>

            {/* Bintang Card */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start space-x-3">
              <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-xs">
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
                  Penerimaan sosial tinggi di kelas, berpotensi sebagai Konselor Sebaya (Peer Counselor).
                </p>
              </div>
            </div>

            {/* Pasangan Sahabat (Mutual) Card */}
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 flex items-start space-x-3">
              <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-xs">
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
                  Ikatan persahabatan dua arah yang terbentuk secara organik di {activeClass.namaKelas}.
                </p>
              </div>
            </div>
          </div>

          {/* Sosiometri Controls Bar */}
          <div className="no-print bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase block mb-1">
                  Kriteria Angket Sosiometri:
                </label>
                <input
                  type="text"
                  value={activeClass.kriteriaSosiometri}
                  onChange={(e) =>
                    updateCurrentClass((prev) => ({
                      ...prev,
                      kriteriaSosiometri: e.target.value,
                    }))
                  }
                  className="px-3 py-1.5 text-xs font-medium bg-slate-50 border border-slate-300 rounded-lg text-slate-800 outline-hidden min-w-[280px]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Laporan Sosiometri</span>
              </button>
            </div>
          </div>

          {/* Sosiogram Visual Graphic Map (Preview) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 inline-block"></span>
                  <span>Peta Konstelasi Sosiogram ({activeClass.namaKelas})</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Visualisasi lingkar relasi sosial: Siswa terisolasi (merah), siswa populer (emas/bintang), dan jejaring pilihan
                </p>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500"></span> Terisolasi (0)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-400"></span> Populer (Bintang)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-blue-500"></span> Normal
                </span>
              </div>
            </div>

            {/* Visual Circular Grid of Student Nodes */}
            <div className="p-6 bg-slate-50/70 border border-slate-200 rounded-xl relative min-h-[300px] flex flex-wrap items-center justify-center gap-4">
              {results.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-xs">
                  Belum ada siswa di kelas ini. Klik <strong>Portal Siswa</strong> atau <strong>Impor Data Siswa</strong> untuk mengisi.
                </div>
              ) : (
                results.map((res) => {
                  const isIsolated = res.skor === 0;
                  const isStar = res.skor >= 4;

                  return (
                    <div
                      key={res.studentId}
                      className={`relative p-3 rounded-xl border transition-all flex flex-col items-center justify-center text-center w-36 shadow-xs ${
                        isIsolated
                          ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-400'
                          : isStar
                          ? 'bg-amber-50 border-amber-300 ring-2 ring-amber-400'
                          : 'bg-white border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-black mb-1.5 ${
                          isIsolated ? 'bg-rose-600' : isStar ? 'bg-amber-500' : 'bg-blue-600'
                        }`}
                      >
                        {res.gender === 'L' ? '♂' : '♀'}
                      </div>

                      <div className="font-bold text-xs text-slate-800 line-clamp-1" title={res.nama}>
                        {res.nama}
                      </div>

                      <div className="mt-1 flex items-center gap-1 text-[11px] font-bold">
                        <span className="text-slate-500">Dipilih:</span>
                        <span
                          className={`px-1.5 py-0.2 rounded-full ${
                            isIsolated
                              ? 'bg-rose-200 text-rose-800'
                              : isStar
                              ? 'bg-amber-200 text-amber-900'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {res.skor}
                        </span>
                      </div>

                      {/* Status Badge */}
                      <div className="mt-1 text-[9px] font-bold uppercase tracking-wider text-slate-500">
                        {isIsolated ? (
                          <span className="text-rose-700 font-black">TERISOLASI</span>
                        ) : isStar ? (
                          <span className="text-amber-800 font-black">BINTANG</span>
                        ) : (
                          'ADAPTIF'
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Interactive Sosiometri Matrix Table */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block"></span>
                  <span>Matriks Pilihan Relasi Sebaya (N x N) & Rekomendasi Konseling</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Guru BK dapat melihat pilihan teman, mengubah langsung di tabel, atau memantau hasil input mandiri siswa
                </p>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-3">No</th>
                    <th className="p-3">Nama Siswa</th>
                    <th className="p-3">L/P</th>
                    <th className="p-3">Pilihan 1 (Utama)</th>
                    <th className="p-3">Pilihan 2</th>
                    <th className="p-3 text-center">Jml Dipilih</th>
                    <th className="p-3">Status Relasi</th>
                    <th className="p-3">Rekomendasi Tindakan Konselor</th>
                    <th className="p-3 no-print text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {students.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-6 text-slate-400">
                        Belum ada siswa di kelas ini. Silakan tambah siswa baru atau gunakan tombol "Impor Data Siswa".
                      </td>
                    </tr>
                  ) : (
                    students.map((st, idx) => {
                      const res = results.find((r) => r.studentId === st.id);
                      const isIsolated = res?.skor === 0;
                      const isStar = (res?.skor || 0) >= 4;

                      return (
                        <tr
                          key={st.id}
                          className={`hover:bg-slate-50 transition-colors ${
                            isIsolated ? 'bg-rose-50/50' : isStar ? 'bg-amber-50/40' : ''
                          }`}
                        >
                          <td className="p-3 font-semibold text-slate-500">{idx + 1}</td>
                          <td className="p-3 font-bold text-slate-900">
                            <div className="flex items-center gap-1.5">
                              <span>{st.nama}</span>
                              {st.submittedViaPortal && (
                                <span
                                  className="no-print bg-emerald-100 text-emerald-800 text-[9px] px-1.5 py-0.2 rounded-full font-bold"
                                  title="Mengisi via portal mandiri"
                                >
                                  Portal
                                </span>
                              )}
                            </div>
                            {st.nisn && <div className="text-[10px] text-slate-400 font-normal">NISN: {st.nisn}</div>}
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                st.gender === 'L' ? 'bg-blue-100 text-blue-800' : 'bg-pink-100 text-pink-800'
                              }`}
                            >
                              {st.gender}
                            </span>
                          </td>

                          {/* Dropdown Pilihan 1 */}
                          <td className="p-3">
                            <select
                              value={st.pilihan1Id || 0}
                              onChange={(e) =>
                                handleUpdateChoice(st.id, 'pilihan1Id', parseInt(e.target.value, 10))
                              }
                              className="px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md outline-hidden text-slate-800 max-w-[140px]"
                            >
                              <option value={0}>-- Belum Memilih --</option>
                              {students
                                .filter((s) => s.id !== st.id)
                                .map((s) => (
                                  <option key={s.id} value={s.id}>
                                    {s.nama}
                                  </option>
                                ))}
                            </select>
                          </td>

                          {/* Dropdown Pilihan 2 */}
                          <td className="p-3">
                            <select
                              value={st.pilihan2Id || 0}
                              onChange={(e) =>
                                handleUpdateChoice(st.id, 'pilihan2Id', parseInt(e.target.value, 10))
                              }
                              className="px-2 py-1 text-xs bg-slate-50 border border-slate-200 rounded-md outline-hidden text-slate-800 max-w-[140px]"
                            >
                              <option value={0}>-- Belum Memilih --</option>
                              {students
                                .filter((s) => s.id !== st.id)
                                .map((s) => (
                                  <option key={s.id} value={s.id}>
                                    {s.nama}
                                  </option>
                                ))}
                            </select>
                          </td>

                          {/* Skor */}
                          <td className="p-3 text-center">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-xs font-black ${
                                isIsolated
                                  ? 'bg-rose-200 text-rose-900'
                                  : isStar
                                  ? 'bg-amber-200 text-amber-900'
                                  : 'bg-slate-200 text-slate-800'
                              }`}
                            >
                              {res?.skor || 0}
                            </span>
                          </td>

                          {/* Status */}
                          <td className="p-3 font-bold text-xs">
                            {isIsolated ? (
                              <span className="text-rose-700 flex items-center gap-1">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                <span>Terisolasi</span>
                              </span>
                            ) : isStar ? (
                              <span className="text-amber-800 flex items-center gap-1">
                                <Star className="w-3.5 h-3.5" />
                                <span>Bintang (Populer)</span>
                              </span>
                            ) : (
                              <span className="text-slate-600">Normal</span>
                            )}
                          </td>

                          {/* Catatan Intervensi */}
                          <td className="p-3 text-[11px] max-w-xs text-slate-600 leading-snug">
                            {res?.catatanIntervensi}
                          </td>

                          {/* Action Delete */}
                          <td className="p-3 no-print text-center">
                            <button
                              type="button"
                              onClick={() => handleDeleteStudent(st.id)}
                              className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors"
                              title="Hapus Siswa dari Kelas"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Form Tambah Siswa Baru (no-print) */}
          <div className="no-print bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-blue-600" />
              <span>Tambah Siswa Manual ke {activeClass.namaKelas}</span>
            </h4>
            <form onSubmit={handleAddStudent} className="flex flex-wrap items-center gap-3">
              <input
                type="text"
                value={newNama}
                onChange={(e) => setNewNama(e.target.value)}
                placeholder="Nama Lengkap Siswa Baru..."
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

          {/* Cetak Footer Dokumen Resmi */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-200 pb-3">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">
                Lembar Pengesahan Laporan Sosiometri BK SMP ({activeClass.namaKelas})
              </h4>
              <p className="text-xs text-slate-500">
                Tahun Ajaran {profile.tahunPelajaran} • Standar Layanan BK Fase D
              </p>
            </div>

            <div className="grid grid-cols-2 text-xs text-slate-800 pt-4">
              <div className="text-left space-y-12">
                <div>
                  <p>Mengetahui,</p>
                  <p className="font-bold">Kepala {profile.namaSekolah}</p>
                </div>
                <div>
                  <p className="font-bold underline uppercase">{profile.namaKepalaSekolah}</p>
                  <p className="text-slate-600">NIP. {profile.nipKepalaSekolah || '_________________________'}</p>
                </div>
              </div>

              <div className="text-left space-y-12">
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
      ) : (
        /* Tab 2: IKMS / AKPD (Calculated Dynamically from Real Student Responses) */
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                    <span>Profil Kebutuhan Peserta Didik (IKMS / AKPD) Fase D</span>
                  </h3>
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-black px-2 py-0.5 rounded-full border border-blue-200">
                    Dihitung Dinamis ({studentsWithIKMSSubmission.length}/{students.length} Responden)
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Distribusi persentase kebutuhan dan masalah terbanyak peserta didik {activeClass.namaKelas} pada 4 bidang layanan BK
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsStudentPortalOpen(true)}
                  className="no-print flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Input Angket Siswa</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Profil IKMS</span>
                </button>
              </div>
            </div>

            {/* 4 Bidang Bar Cards (Dynamically Calculated) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dynamicIKMSSummaries.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                      Bidang Layanan {item.bidang}
                    </span>
                    <span className="text-sm font-black text-blue-700">
                      {item.persentase}% Kebutuhan ({item.jumlahPemilih}/{students.length} Siswa)
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.warna} rounded-full transition-all duration-500`}
                      style={{ width: `${item.persentase}%` }}
                    />
                  </div>

                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                    Fokus: {item.deskripsi}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-200">
                    <div className="text-[11px] font-bold text-slate-700">
                      Top Masalah Terpilih di {activeClass.namaKelas}:
                    </div>
                    {item.topIssues.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">Belum ada respon pada butir bidang ini.</p>
                    ) : (
                      <ul className="text-xs space-y-1 text-slate-600 pl-4">
                        {item.topIssues.slice(0, 3).map((issue, i) => (
                          <li key={i} className="list-disc leading-tight text-[11px]">
                            {issue.pernyataan}{' '}
                            <strong className="text-slate-800">
                              ({issue.count} Siswa • {issue.persentase}%)
                            </strong>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Rekomendasi Program Tahunan BK SMP Berdasarkan Data Riil */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-2">
              <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                Implikasi pada Program Kerja BK SMP Fase D ({activeClass.namaKelas}):
              </h4>
              <p className="text-xs text-blue-800 leading-relaxed">
                Berdasarkan data angket riil {activeClass.namaKelas}, bidang dengan persentase kebutuhan tertinggi adalah prioritas utama perancangan Rencana Pelaksanaan Layanan (RPL).
                Gunakan hasil ini sebagai dasar bimbingan kelompok bagi siswa dengan kebutuhan serupa serta bimbingan klasikal tematik alur ARKA.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <StudentPortalModal
        isOpen={isStudentPortalOpen}
        onClose={() => setIsStudentPortalOpen(false)}
        activeClass={activeClass}
        onSaveStudentSubmission={handleSaveStudentSubmission}
      />

      <ImportStudentsModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        classNameTitle={activeClass.namaKelas}
        onImport={handleImportStudents}
      />

      <GoogleSheetsSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
        initialUrl={activeClass.googleSheetSyncUrl || ''}
        classNameTitle={activeClass.namaKelas}
        currentStudents={students}
        onSyncComplete={handleSyncComplete}
      />
    </div>
  );
};
