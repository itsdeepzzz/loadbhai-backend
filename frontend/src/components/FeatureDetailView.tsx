// @ts-nocheck
import React from 'react';
import { ArrowLeft, Activity } from 'lucide-react';

export default function FeatureDetailView({
  selectedFeature,
  handlePageChange,
  setAuthModal
}: any) {
  return (
    <section className="max-w-[1200px] mx-auto px-4 sm:px-8 py-20 animate-fade-in z-10 relative">
       <button type="button" onClick={() => handlePageChange('landing')} className="flex items-center text-[#EA580C] font-black text-base mb-10 transition-colors hover:text-[#0F172A] bg-white px-6 py-3 rounded-xl shadow-md border"><ArrowLeft className="h-5 w-5 mr-3"/> Back to Main Screen</button>
       <div className="bg-white rounded-[3rem] overflow-hidden shadow-2xl border border-slate-200">
          <div className="h-[500px] relative">
            <img src={selectedFeature?.url} className="w-full h-full object-cover" alt="" />
            <div className={`absolute inset-0 bg-gradient-to-t from-[#0F172A] opacity-90`}></div>
            <div className="absolute inset-0 flex flex-col justify-end p-16">
               <span className="bg-[#EA580C] text-white px-5 py-2 rounded-full w-fit text-xs font-black tracking-widest mb-6 shadow-lg uppercase border border-orange-400">{selectedFeature?.tag}</span>
               <h1 className="text-6xl md:text-7xl font-black text-white leading-tight drop-shadow-lg">{selectedFeature?.title}</h1>
            </div>
          </div>
          <div className="p-16 space-y-10">
             <h3 className="text-4xl font-black text-slate-900">Feature Overview</h3>
             <p className="text-slate-600 text-2xl font-medium leading-relaxed max-w-4xl">{selectedFeature?.subtitle} Built with high-scale architecture to support millions of concurrent transactions, ensuring reliability and security across the entire logistics grid.</p>
             <div className="bg-slate-50 border border-slate-200 p-10 rounded-3xl flex items-center space-x-8 max-w-lg shadow-inner">
                <Activity className="h-12 w-12 text-[#EA580C]"/>
                <div>
                  <div className="text-3xl font-black text-slate-900 mb-2">Enterprise Ready</div>
                  <div className="text-base font-bold text-slate-500 uppercase tracking-widest">Fully integrated module</div>
                </div>
             </div>
             <button type="button" onClick={() => setAuthModal({open: true, step: 'role'})} className="bg-[#0F172A] text-white px-12 py-5 rounded-2xl text-xl font-black hover:bg-slate-800 transition-colors shadow-2xl">Start Using This Feature</button>
          </div>
       </div>
    </section>
  );
}
