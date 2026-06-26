// @ts-nocheck
import React from 'react';
import { Truck, ChevronDown, User, Menu } from 'lucide-react';

export default function AppHeader({
  handlePageChange,
  activeView,
  t,
  language,
  setLanguage,
  isLoggedIn,
  user,
  setDrawerOpen,
  setAuthModal
}: any) {
  return (
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handlePageChange('landing')}>
            <Truck className="h-8 w-8 text-[#EA580C]" />
            <span className="text-2xl font-black tracking-tight text-[#0F172A]">Load<span className="text-[#EA580C]">Bhai</span></span>
          </div>

          <nav className="hidden lg:flex space-x-8 text-sm font-black text-slate-700">
            {[{v: 'landing', e: 'HOME', h: 'होम'}, {v: 'about', e: 'ABOUT US', h: 'हमारे बारे में'}, {v: 'services', e: 'SERVICES', h: 'सेवाएं'}, {v: 'premium', e: 'PRICING', h: 'कीमत'}, {v: 'contact', e: 'CONTACT', h: 'संपर्क करें'}].map((page: any) => (
                <button type="button" key={page.v} onClick={() => handlePageChange(page.v as any)} className={`hover:text-[#EA580C] transition-colors uppercase tracking-wide ${activeView === page.v ? 'text-[#EA580C]' : ''}`}>{t(page.e, page.h)}</button>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <button type="button" onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')} className="flex bg-slate-100 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-200 border border-slate-200 shadow-sm">
              🌐 {language === 'en' ? 'EN' : 'HI'} <ChevronDown className="h-3 w-3 ml-1"/>
            </button>

            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                 <button type="button" onClick={() => handlePageChange('dashboard')} className="text-sm font-black text-[#EA580C] hidden sm:block border border-[#EA580C] bg-orange-50 px-5 py-2.5 rounded-xl hover:bg-[#EA580C] hover:text-white transition-colors shadow-md">Dashboard</button>
                 <div className="h-11 w-11 bg-slate-200 rounded-full cursor-pointer flex items-center justify-center overflow-hidden border-2 border-[#0F172A] shadow-md hover:scale-105 transition-transform" onClick={() => setDrawerOpen(true)}>
                   {user.dp ? <img src={user.dp} className="h-full w-full object-cover" alt=""/> : <User className="h-6 w-6 text-slate-500" />}
                 </div>
              </div>
            ) : (
              <>
                <button type="button" onClick={() => setAuthModal({ open: true, step: 'role' })} className="bg-[#0F172A] text-white px-7 py-3 rounded-xl font-black text-sm hover:bg-slate-800 transition-colors shadow-lg">
                  Login / Register
                </button>
                <button type="button" className="lg:hidden text-slate-600" onClick={() => setDrawerOpen(true)}><Menu className="h-7 w-7" /></button>
              </>
            )}
          </div>
        </div>
      </header>
  );
}
