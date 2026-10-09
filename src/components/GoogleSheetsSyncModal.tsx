import React, { useState } from 'react';
import { StudentPeer } from '../types';
import { syncGoogleSheetData } from '../services/storageService';
import { RefreshCw, ExternalLink, X, CheckCircle2, AlertCircle, HelpCircle, Table } from 'lucide-react';

interface GoogleSheetsSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialUrl: string;
  classNameTitle: string;
  currentStudents: StudentPeer[];
  onSyncComplete: (updatedStudents: StudentPeer[], url: string, message: string) => void;
}

export const GoogleSheetsSyncModal: React.FC<GoogleSheetsSyncModalProps> = ({
  isOpen,
  onClose,
  initialUrl,
  classNameTitle,
  currentStudents,
  onSyncComplete,
}) => {
  const [sheetUrl, setSheetUrl] = useState<string>(initialUrl || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSync = async () => {
    if (!sheetUrl.trim()) {
      setErrorMsg('Masukkan URL Google Sheets atau CSV terlebih dahulu.');
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setStatusMessage(null);

    try {
      const result = await syncGoogleSheetData(sheetUrl.trim(), currentStudents);
      setStatusMessage(result.message);
      onSyncComplete(result.updatedStudents, sheetUrl.trim(), result.message);
    } catch (err: any) {
      console.error('Error syncing Google Sheet:', err);
      setErrorMsg(err.message || 'Gagal menyinkronkan data dari Google Sheet.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadDemoPublicCsv = () => {
    // Provide a valid demo data simulator string via data URI or public mock
    // For convenience, provide sample google sheet URL structure
    setSheetUrl('https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/export?format=csv');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 via-emerald-700 to-teal-800 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-xs border border-white/20">
              <Table className="w-6 h-6 text-teal-200" />
            </div>
            <div>
              <span className="bg-teal-400/30 text-teal-100 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                Integrasi Cloud
              </span>
              <h3 className="text-base font-black tracking-tight">Sinkronisasi Google Sheets ({classNameTitle})</h3>
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
          <p className="text-xs text-slate-600 leading-relaxed">
            Hubungkan lembar respon Google Forms yang diisi siswa ke dalam ruang kerja BK AI Studio ini.
            Data respon sosiometri dan angket kebutuhan IKMS akan ditarik dan dianalisis secara dinamis.
          </p>

          {/* Form input URL */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                URL Google Sheets / Webhook CSV:
              </label>
              <button
                type="button"
                onClick={handleLoadDemoPublicCsv}
                className="text-[11px] font-bold text-teal-700 hover:underline"
              >
                Isi Contoh URL
              </button>
            </div>
            <input
              type="url"
              value={sheetUrl}
              onChange={(e) => {
                setSheetUrl(e.target.value);
                setErrorMsg(null);
              }}
              placeholder="https://docs.google.com/spreadsheets/d/.../export?format=csv"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500 focus:outline-hidden"
            />
          </div>

          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span className="leading-snug">{errorMsg}</span>
            </div>
          )}

          {statusMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{statusMessage}</span>
            </div>
          )}

          {/* Tutorial / Petunjuk Penggunaan */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-800">
              <HelpCircle className="w-4 h-4 text-teal-600" />
              <span>Cara Menghubungkan Google Form Siswa:</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-600 text-[11px] leading-relaxed">
              <li>
                Buat <strong>Google Form</strong> berisi: <em>Nama Siswa</em>, <em>Jenis Kelamin</em>, <em>Pilihan Teman 1</em>, <em>Pilihan Teman 2</em>, dan <em>Ceklis IKMS</em>.
              </li>
              <li>
                Buka tab <strong>Tanggapan</strong> pada Google Form dan hubungkan ke <strong>Google Spreadsheet</strong>.
              </li>
              <li>
                Pada Google Spreadsheet: Klik <strong>File</strong> &rarr; <strong>Bagikan</strong> &rarr; <strong>Publikasikan ke Web</strong> &rarr; Pilih sheet dan ubah format menjadi <strong>CSV (.csv)</strong> &rarr; Klik <strong>Publikasikan</strong>.
              </li>
              <li>
                Salin link publikasi CSV tersebut dan tempelkan ke kolom input di atas, lalu klik <strong>Tarik Data Sekarang</strong>.
              </li>
            </ol>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Tutup
          </button>
          <button
            type="button"
            disabled={isLoading || !sheetUrl.trim()}
            onClick={handleSync}
            className="px-5 py-2 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Menarik Data...' : 'Tarik Data Sekarang'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
