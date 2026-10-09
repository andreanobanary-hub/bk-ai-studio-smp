import React from 'react';
import {
  Printer,
  Copy,
  Sparkles,
  School,
  Search,
  Check,
  Key,
} from 'lucide-react';
import { SchoolProfile } from '../types';

interface TopbarProps {
  activeTitle: string;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onPrint: () => void;
  onCopy: () => void;
  isCopied: boolean;
  profile: SchoolProfile;
  onOpenProfile: () => void;
  onOpenApiKeyModal: () => void;
  hasApiKey: boolean;
}

export const Topbar: React.FC<TopbarProps> = ({
  activeTitle,
  searchQuery,
  setSearchQuery,
  onPrint,
  onCopy,
  isCopied,
  profile,
  onOpenProfile,
  onOpenApiKeyModal,
  hasApiKey,
}) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 no-print sticky top-0 z-20">
      {/* Title & Search */}
      <div className="flex items-center space-x-6 flex-1 min-w-0 mr-4">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <span>{activeTitle}</span>
            <span className="hidden md:inline-flex text-[11px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md border border-blue-200">
              Fase D (SMP)
            </span>
          </h2>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-xs w-full hidden sm:block">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari topik materi, SKKPD, kata kunci..."
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Right Actions & Status */}
      <div className="flex items-center space-x-2.5 shrink-0">
        {/* Gemini API Key Setting Button */}
        <button
          onClick={onOpenApiKeyModal}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            hasApiKey
              ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
              : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100 animate-pulse'
          }`}
          title="Atur Gemini API Key"
        >
          <Key className={`w-3.5 h-3.5 ${hasApiKey ? 'text-blue-600' : 'text-amber-600'}`} />
          <span className="hidden sm:inline">
            {hasApiKey ? 'API Key Aktif' : 'Set API Key'}
          </span>
          <span
            className={`w-2 h-2 rounded-full ${
              hasApiKey ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
          />
        </button>

        {/* Copy Document Button */}
        <button
          onClick={onCopy}
          className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
            isCopied
              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
          }`}
          title="Salin isi dokumen yang aktif ke papan klip"
        >
          {isCopied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Tersalin!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>Salin Dokumen</span>
            </>
          )}
        </button>

        {/* Print / Save PDF Button */}
        <button
          onClick={onPrint}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all"
          title="Cetak lembar resmi atau simpan sebagai file PDF"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Cetak / Simpan PDF</span>
        </button>

        {/* School Profile Trigger */}
        <button
          onClick={onOpenProfile}
          className="flex items-center space-x-1.5 p-1.5 pl-2.5 pr-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs transition-colors"
          title="Identitas Sekolah & Guru BK"
        >
          <School className="w-4 h-4 text-blue-600" />
          <span className="font-medium hidden xl:inline max-w-[130px] truncate">
            {profile.namaSekolah}
          </span>
        </button>
      </div>
    </header>
  );
};

