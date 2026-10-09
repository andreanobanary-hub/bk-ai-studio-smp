import React from 'react';
import { SchoolProfile } from '../types';
import {
  FileText,
  Users2,
  Sparkles,
  MessageSquareHeart,
  School,
  Settings,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';

interface SidebarProps {
  activeTab: 'rpl' | 'asesmen' | 'lkpd' | 'konsultasi';
  setActiveTab: (tab: 'rpl' | 'asesmen' | 'lkpd' | 'konsultasi') => void;
  profile: SchoolProfile;
  onOpenProfile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  profile,
  onOpenProfile,
}) => {
  const menuItems = [
    {
      id: 'rpl' as const,
      label: 'Perencanaan (RPL BK SMP)',
      sublabel: 'Deep Learning • Alur ARKA',
      icon: FileText,
      badge: 'Fase D',
    },
    {
      id: 'asesmen' as const,
      label: 'Asesmen Kebutuhan',
      sublabel: 'Sosiometri Teman & IKMS/AKPD',
      icon: Users2,
      badge: 'Deteksi Bullying',
    },
    {
      id: 'lkpd' as const,
      label: 'Media & LKPD Refleksi',
      sublabel: 'Refleksi Diri 4F Ramah Remaja',
      icon: Sparkles,
      badge: 'Siap Cetak',
    },
    {
      id: 'konsultasi' as const,
      label: 'Konsultasi Kasus Konselor',
      sublabel: 'AI Studi Kasus & Bimbingan Klinis',
      icon: MessageSquareHeart,
      badge: 'Pakar ABKIN',
    },
  ];

  return (
    <aside className="w-72 bg-slate-900 text-slate-200 flex flex-col shrink-0 border-r border-slate-800 select-none min-h-screen">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white font-black text-xl">
            BK
          </div>
          <div>
            <h1 className="font-extrabold text-white text-base tracking-tight flex items-center gap-1.5">
              <span>BK AI STUDIO</span>
              <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 font-semibold px-1.5 py-0.5 rounded-full">
                SMP
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">
              Fase D (Kelas 7, 8, 9)
            </p>
          </div>
        </div>

        {/* School Pill */}
        <div className="mt-3 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center space-x-2 truncate">
            <School className="w-4 h-4 text-blue-400 shrink-0" />
            <div className="truncate">
              <div className="text-xs font-semibold text-slate-200 truncate">
                {profile.namaSekolah}
              </div>
              <div className="text-[11px] text-slate-400">
                Sem. {profile.semester} {profile.tahunPelajaran}
              </div>
            </div>
          </div>
          <button
            onClick={onOpenProfile}
            title="Ubah Profil Sekolah"
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition-colors ml-1"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
        <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Ruang Kerja Guru BK
        </div>

        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left p-3 rounded-xl transition-all duration-150 flex items-start space-x-3 relative group ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30 font-medium'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <div
                className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-800 text-slate-400 group-hover:text-blue-400'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold truncate">
                    {item.label}
                  </span>
                </div>
                <div
                  className={`text-xs mt-0.5 line-clamp-1 ${
                    isActive ? 'text-blue-100' : 'text-slate-400'
                  }`}
                >
                  {item.sublabel}
                </div>
              </div>
              {isActive && (
                <div className="w-1.5 h-6 bg-white rounded-full absolute right-1 top-1/2 -translate-y-1/2" />
              )}
            </button>
          );
        })}

        {/* Feature Overview Box */}
        <div className="pt-4 px-3">
          <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-800/40 text-blue-200">
            <div className="flex items-center space-x-2 text-xs font-bold text-blue-300 mb-1">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Standar Kurikulum Nasional Terbaru</span>
            </div>
            <p className="text-[11px] text-blue-300/80 leading-relaxed">
              Memadukan Pendekatan Deep Learning (3 Pilar & Dimensi 6C), SKKPD SMP, dan 4 Alur ARKA.
            </p>
          </div>
        </div>
      </nav>

      {/* Footer Profile */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/90">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 font-bold shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold text-white truncate">
              {profile.namaGuruBK}
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              {profile.nipGuruBK ? `NIP: ${profile.nipGuruBK}` : 'Konselor Sekolah'}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
