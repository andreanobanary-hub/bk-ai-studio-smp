import React, { useState, useEffect } from 'react';
import { getActiveApiKey, setActiveApiKey } from '../services/geminiClient';
import { Key, Eye, EyeOff, Check, X, ShieldAlert, Sparkles, RefreshCw } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  onKeySaved,
}) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [showKey, setShowKey] = useState<boolean>(false);
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setApiKey(getActiveApiKey());
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveApiKey(apiKey.trim());
    onKeySaved(apiKey.trim());
    onClose();
  };

  const handleTestKey = async () => {
    const keyToTest = apiKey.trim() || getActiveApiKey();
    if (!keyToTest) {
      setTestResult({
        success: false,
        message: 'Masukkan API Key terlebih dahulu sebelum melakukan tes.',
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);
    try {
      const ai = new GoogleGenAI({ apiKey: keyToTest });
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: 'Katakan "OK" jika terhubung.',
      });

      if (response && response.text) {
        setTestResult({
          success: true,
          message: 'Koneksi Berhasil! Model gemini-3.8-flash aktif dan siap digunakan.',
        });
      } else {
        throw new Error('Tidak ada respon dari model');
      }
    } catch (err: any) {
      console.error(err);
      setTestResult({
        success: false,
        message: `Koneksi Gagal: ${err.message || 'Periksa kembali API Key Anda.'}`,
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleClearKey = () => {
    setApiKey('');
    setActiveApiKey('');
    setTestResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-blue-700 to-indigo-700 text-white">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <Key className="w-5 h-5 text-blue-100" />
            </div>
            <div>
              <h3 className="text-base font-bold">Pengaturan Gemini API Key</h3>
              <p className="text-[11px] text-blue-100">
                Akses langsung Google Gen AI SDK dari peramban
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Google Gemini API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full pl-3 pr-10 py-2.5 text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 outline-hidden text-slate-900"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                title={showKey ? 'Sembunyikan' : 'Tampilkan'}
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
              Kunci API disimpan secara lokal di browser Anda (Local Storage) dan digunakan langsung oleh <code className="bg-slate-100 px-1 py-0.5 rounded text-blue-600 font-mono">@google/genai</code> untuk menyusun RPL, analisis kasus, dan LKPD.
            </p>
          </div>

          {/* Test Status feedback */}
          {testResult && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-start space-x-2 ${
                testResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}
            >
              {testResult.success ? (
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="leading-relaxed">{testResult.message}</div>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handleTestKey}
                disabled={isTesting}
                className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
              >
                {isTesting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                    <span>Menguji...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    <span>Tes Koneksi</span>
                  </>
                )}
              </button>
              {apiKey && (
                <button
                  type="button"
                  onClick={handleClearKey}
                  className="px-2.5 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  Hapus
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex items-center space-x-1.5 px-4 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Simpan Kunci</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
