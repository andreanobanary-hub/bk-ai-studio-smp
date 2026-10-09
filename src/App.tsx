import React, { useState, useEffect } from 'react';
import { SchoolProfile, RPLData } from './types';
import { DEFAULT_SCHOOL_PROFILE, DEFAULT_RPL } from './data/constants';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { ProfileModal } from './components/ProfileModal';
import { RPLView } from './components/RPLView';
import { AsesmenView } from './components/AsesmenView';
import { LKPDView } from './components/LKPDView';
import { KonsultasiView } from './components/KonsultasiView';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'rpl' | 'asesmen' | 'lkpd' | 'konsultasi'>('rpl');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // School profile stored in localStorage
  const [profile, setProfile] = useState<SchoolProfile>(() => {
    try {
      const saved = localStorage.getItem('bk_smp_profile');
      return saved ? JSON.parse(saved) : DEFAULT_SCHOOL_PROFILE;
    } catch {
      return DEFAULT_SCHOOL_PROFILE;
    }
  });

  // Current RPL data in memory
  const [rplData, setRplData] = useState<RPLData>(DEFAULT_RPL);

  const handleSaveProfile = (newProfile: SchoolProfile) => {
    setProfile(newProfile);
    try {
      localStorage.setItem('bk_smp_profile', JSON.stringify(newProfile));
      showToast('Profil Satuan Pendidikan & Guru BK berhasil diperbarui!');
    } catch (e) {
      console.error(e);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyActiveDoc = () => {
    let textToCopy = '';
    if (activeTab === 'rpl') {
      textToCopy = `RPL BIMBINGAN KLASIKAL SMP: ${rplData.topik} (${rplData.kelas})\nSKKPD: ${rplData.skkpd}\nTujuan Umum: ${rplData.tujuanUmum}\nModel: ${rplData.pendekatan}`;
    } else if (activeTab === 'lkpd') {
      textToCopy = `LKPD REFLEKSI 4F: ${rplData.topik} (${rplData.kelas})\nFact, Feeling, Finding, Future`;
    } else if (activeTab === 'asesmen') {
      textToCopy = `HASIL ASESMEN SOSIOMETRI & IKMS SMP: ${profile.namaSekolah}`;
    } else if (activeTab === 'konsultasi') {
      textToCopy = `LEMBAR KONSULTASI KASUS KONSELOR BK SMP: ${profile.namaSekolah}`;
    }

    navigator.clipboard.writeText(textToCopy);
    setIsCopied(true);
    showToast('Dokumen berhasil disalin!');
    setTimeout(() => setIsCopied(false), 2000);
  };

  const getActiveTabTitle = () => {
    switch (activeTab) {
      case 'rpl':
        return 'Perencanaan (RPL BK SMP)';
      case 'asesmen':
        return 'Asesmen Kebutuhan (Sosiometri & IKMS)';
      case 'lkpd':
        return 'Media & LKPD (Refleksi Diri 4F)';
      case 'konsultasi':
        return 'Konsultasi Kasus Konselor';
      default:
        return 'BK AI STUDIO SMP';
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-row">
      {/* Sidebar Navigation (Hidden during print) */}
      <div className="no-print">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          profile={profile}
          onOpenProfile={() => setIsProfileOpen(true)}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Topbar
          activeTitle={getActiveTabTitle()}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onPrint={handlePrint}
          onCopy={handleCopyActiveDoc}
          isCopied={isCopied}
          profile={profile}
          onOpenProfile={() => setIsProfileOpen(true)}
        />

        <main className="flex-1 pb-16">
          {activeTab === 'rpl' && (
            <RPLView
              rplData={rplData}
              setRplData={setRplData}
              profile={profile}
              searchFilter={searchQuery}
              onNavigateToLKPD={() => setActiveTab('lkpd')}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'asesmen' && (
            <AsesmenView
              profile={profile}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'lkpd' && (
            <LKPDView
              profile={profile}
              currentTopikRPL={rplData.topik}
              currentKelasRPL={rplData.kelas}
              onShowToast={showToast}
            />
          )}

          {activeTab === 'konsultasi' && (
            <KonsultasiView
              profile={profile}
              onShowToast={showToast}
            />
          )}
        </main>
      </div>

      {/* School Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />

      {/* Toast Notification (No alert()) */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center space-x-2.5 text-xs font-semibold animate-in fade-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
