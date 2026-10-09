import React, { useState } from 'react';
import { StudentPeer } from '../types';
import { parseStudentsFromText } from '../services/storageService';
import { FileSpreadsheet, Upload, X, Check, AlertCircle, FileText } from 'lucide-react';

interface ImportStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  classNameTitle: string;
  onImport: (newStudents: StudentPeer[], mode: 'replace' | 'append') => void;
}

export const ImportStudentsModal: React.FC<ImportStudentsModalProps> = ({
  isOpen,
  onClose,
  classNameTitle,
  onImport,
}) => {
  const [activeTab, setActiveTab] = useState<'paste' | 'file'>('paste');
  const [pastedText, setPastedText] = useState<string>('');
  const [importMode, setImportMode] = useState<'replace' | 'append'>('replace');
  const [previewStudents, setPreviewStudents] = useState<StudentPeer[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTextChange = (text: string) => {
    setPastedText(text);
    setErrorMsg(null);
    if (text.trim()) {
      const parsed = parseStudentsFromText(text, 1);
      setPreviewStudents(parsed.students);
    } else {
      setPreviewStudents([]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setPastedText(content);
        const parsed = parseStudentsFromText(content, 1);
        setPreviewStudents(parsed.students);
      }
    };
    reader.onerror = () => {
      setErrorMsg('Gagal membaca file. Pastikan format file teks atau CSV valid.');
    };
    reader.readAsText(file);
  };

  const handleLoadSample = () => {
    const sample = `1. Ahmad Albar, L, 0092147001\n2. Bunga Citra Lestari, P, 0092147002\n3. Dimas Anggara, L, 0092147003\n4. Fitri Carlina, P, 0092147004\n5. Galih Ginanjar, L, 0092147005\n6. Hana Saraswati, P, 0092147006\n7. Ivan Gunawan, L, 0092147007\n8. Jessica Mila, P, 0092147008`;
    handleTextChange(sample);
  };

  const handleSubmit = () => {
    if (previewStudents.length === 0) {
      setErrorMsg('Belum ada data siswa yang berhasil diidentifikasi. Silakan masukkan data nama siswa.');
      return;
    }

    onImport(previewStudents, importMode);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-xs border border-white/20">
              <FileSpreadsheet className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <span className="bg-emerald-400/30 text-emerald-100 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                Impor Data Riil
              </span>
              <h3 className="text-base font-black tracking-tight">Impor Daftar Siswa {classNameTitle}</h3>
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
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Subtab selection */}
          <div className="flex p-1 bg-slate-100 rounded-xl space-x-1">
            <button
              onClick={() => setActiveTab('paste')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                activeTab === 'paste'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Salin-Tempel (Excel / Word)</span>
            </button>
            <button
              onClick={() => setActiveTab('file')}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                activeTab === 'file'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Unggah Berkas CSV / Text</span>
            </button>
          </div>

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {activeTab === 'paste' ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">
                  Tempelkan (Paste) nama siswa dari Excel atau daftar absensi:
                </label>
                <button
                  type="button"
                  onClick={handleLoadSample}
                  className="text-[11px] font-bold text-emerald-700 hover:underline"
                >
                  Muat Contoh Format
                </button>
              </div>
              <textarea
                value={pastedText}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder={`Contoh Format:\n1. Adnan Wijaya, L\n2. Berlian Putri, P\n3. Citra Kirana, P\nAtau langsung copy 1 kolom nama dari Microsoft Excel`}
                rows={6}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs font-mono text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
              <p className="text-[11px] text-slate-500">
                Sistem otomatis mengenali format: <code>Nama</code>, <code>Nama, Gender(L/P)</code>, atau nomor urut <code>1. Nama</code>.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Pilih berkas CSV (.csv) atau Teks (.txt):
              </label>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors">
                <input
                  type="file"
                  accept=".csv,.txt"
                  onChange={handleFileUpload}
                  className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
                <p className="text-[11px] text-slate-400 mt-2">
                  Berkas berformat koma (,), titik koma (;), atau tab-delimited dari Excel.
                </p>
              </div>
            </div>
          )}

          {/* Opsi Penggantian */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <span className="font-bold text-slate-700">Metode Pengisian Kelas:</span>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="importMode"
                  checked={importMode === 'replace'}
                  onChange={() => setImportMode('replace')}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span className="font-medium text-slate-800">Ganti Semua Siswa Lama</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="importMode"
                  checked={importMode === 'append'}
                  onChange={() => setImportMode('append')}
                  className="text-emerald-600 focus:ring-emerald-500"
                />
                <span className="font-medium text-slate-800">Tambahkan ke Daftar Saat Ini</span>
              </label>
            </div>
          </div>

          {/* Pratinjau Siswa Terbaca */}
          {previewStudents.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black uppercase text-slate-700 tracking-wider">
                  Pratinjau ({previewStudents.length} Siswa Terdeteksi):
                </h4>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Siap Diimpor
                </span>
              </div>
              <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 bg-white">
                {previewStudents.map((st, i) => (
                  <div key={i} className="px-3 py-1.5 text-xs flex items-center justify-between">
                    <span className="font-semibold text-slate-800">
                      {i + 1}. {st.nama}
                    </span>
                    <span className="text-slate-500 text-[11px]">
                      {st.gender === 'L' ? 'Laki-laki' : 'Perempuan'} {st.nisn ? `• NISN: ${st.nisn}` : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            disabled={previewStudents.length === 0}
            onClick={handleSubmit}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>Terapkan {previewStudents.length} Siswa ke Kelas</span>
          </button>
        </div>
      </div>
    </div>
  );
};
