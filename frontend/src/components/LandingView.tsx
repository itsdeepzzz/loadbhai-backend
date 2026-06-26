// @ts-nocheck
import React from 'react';
import { Truck, Package, ShieldCheck, MapPin, User, Building, Star, ArrowRight, PlayCircle } from 'lucide-react';
import { parallelHeaders, platformFeatures } from '../constants';

export default function LandingView({
  t,
  platformStats,
  setSelectedRole,
  setAuthModal,
  setShowDemo,
  handlePageChange,
  heroIdx,
  setHeroIdx,
  setSelectedFeature
}: any) {
  return (
    <>
      <section className="relative w-full min-h-[65vh] md:min-h-[85vh] bg-[#0F172A] flex flex-col justify-end overflow-hidden pb-32 pt-24 border-b-8 border-[#EA580C]">
         <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
           {/* DRONE SHOT BACKGROUND ZOOMING */}
           <img src="https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=1600" className="w-full h-full object-cover opacity-50 animate-ken-burns" alt="Trucks Drone Shot" />
         </div>
         <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/70 to-transparent z-0 pointer-events-none"></div>
         
         <div className="relative z-10 max-w-[1600px] mx-auto px-6 sm:px-12 w-full grid lg:grid-cols-2 gap-16 items-center pointer-events-none">
            
            <div className="max-w-2xl space-y-8 pointer-events-auto">
               <span className="bg-[#EA580C]/20 text-[#EA580C] border border-[#EA580C]/50 px-5 py-2 rounded-full text-xs font-black tracking-widest uppercase inline-block shadow-inner">{t("India's Logistics Backbone", "भारत का लॉजिस्टिक्स नेटवर्क")}</span>
               <h1 className="text-5xl sm:text-6xl md:text-8xl font-black text-white leading-[1.05] tracking-tight drop-shadow-2xl">
                 {t("Empowering Transporters.", "ट्रांसपोर्टर्स को सशक्त बनाना")}<br/>
                 <span className="text-[#EA580C]">{t("Pure Profits.", "प्योर प्रॉफिट्स।")}</span>
               </h1>
               <p className="text-lg md:text-2xl text-slate-300 font-medium max-w-2xl leading-relaxed">
                 {t("Connect directly. Manage loads. Group buy parts. Access AI safety. Simplified logistics tailored for the Indian market.", "सीधे जुड़ें। लोड प्रबंधित करें। ग्रुप बाय पार्ट्स। एआई सेफ्टी का एक्सेस करें।")}
               </p>
            </div>

            {/* Parallel Scrolling Headers - Auto Carousel */}
            <div className="relative h-[450px] bg-slate-900 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden border border-slate-800 hidden lg:block pointer-events-auto">
              <div className="absolute inset-0 z-0 pointer-events-none">
                {parallelHeaders.map((header: any, i: number) => (
                  <div key={header.id} className={`absolute inset-0 transition-opacity duration-1000 ${i === heroIdx ? 'opacity-100' : 'opacity-0'}`}>
                    <img src={header.url} className="w-full h-full object-cover opacity-60" alt="" />
                  </div>
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/40 to-transparent"></div>
              </div>
              
              <div className="relative z-10 h-full flex flex-col justify-end p-10 pointer-events-none">
                {parallelHeaders.map((header: any, i: number) => (
                  <div key={header.id} className={`space-y-5 transition-all duration-1000 absolute bottom-10 left-10 right-10 ${i === heroIdx ? 'opacity-100 translate-y-0 z-20 pointer-events-auto' : 'opacity-0 translate-y-10 z-0 pointer-events-none'}`}>
                     <span className="bg-[#EA580C] text-white px-5 py-2 rounded-full text-[10px] font-black tracking-widest uppercase shadow-lg inline-block border border-orange-400">{header.tag}</span>
                     <h3 className="text-4xl md:text-5xl font-black text-white leading-tight drop-shadow-md">{header.title}</h3>
                     <p className="text-slate-300 text-lg font-bold max-w-md">{header.subtitle}</p>
                     <div className="flex space-x-4 mt-6">
                       {header.btn1 === 'Request Demo' && (
                         <button type="button" onClick={() => setShowDemo(true)} className="bg-white text-[#0F172A] px-8 py-4 rounded-xl font-black text-sm hover:bg-slate-200 transition-colors flex items-center shadow-xl hover:scale-105 transform cursor-pointer">
                           {header.btn1} <PlayCircle className="h-5 w-5 ml-3"/>
                         </button>
                       )}
                       {header.btn1 === 'Learn More' && (
                         <button type="button" onClick={() => handlePageChange('services')} className="bg-white text-[#0F172A] px-8 py-4 rounded-xl font-black text-sm hover:bg-slate-200 transition-colors flex items-center shadow-xl hover:scale-105 transform cursor-pointer">
                           {header.btn1} <ArrowRight className="h-5 w-5 ml-3"/>
                         </button>
                       )}
                       {(header.btn2 === 'Join Network') && (
                         <button type="button" onClick={() => setAuthModal({open:true, step:'role'})} className="bg-[#EA580C] text-white px-8 py-4 rounded-xl font-black text-sm hover:bg-orange-700 transition-colors flex items-center shadow-xl hover:scale-105 transform cursor-pointer">
                           {header.btn2} <User className="h-5 w-5 ml-3"/>
                         </button>
                       )}
                     </div>
                  </div>
                ))}
              </div>
              {/* Carousel Indicators */}
              <div className="absolute top-6 right-6 flex space-x-2 z-20 pointer-events-auto">
                 {parallelHeaders.map((_: any, i: number) => (
                   <button type="button" key={i} onClick={() => setHeroIdx(i)} className={`h-2 rounded-full transition-all cursor-pointer ${i === heroIdx ? 'w-10 bg-[#EA580C]' : 'w-4 bg-white/30 hover:bg-white/50'}`}></button>
                 ))}
              </div>
            </div>
         </div>
      </section>

      {/* OVERLAPPING STATS */}
      <section className="max-w-[1200px] mx-auto px-6 relative z-20 -mt-24 mb-32">
         <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 p-10 grid grid-cols-2 md:grid-cols-4 gap-10 text-center divide-x divide-slate-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 rounded-full blur-[80px] -z-10"></div>
            {[
                {i: Truck, c: platformStats.trucks, l: 'Trucks Listed'},
                {i: Package, c: platformStats.parcels, l: 'Parcels Shipped'},
                {i: ShieldCheck, c: platformStats.verified, l: 'Verified Drivers'},
                {i: MapPin, c: platformStats.cities, l: 'Cities Covered'}
            ].map((stat: any, i: number) => (
                <div key={stat.l} className={`flex-1 ${i === 0 ? '' : 'md:pl-10'} ${i > 1 ? 'mt-10 md:mt-0' : ''}`}>
                    <div className={`text-5xl md:text-6xl font-black ${i%2===0 ? 'text-[#EA580C]' : 'text-[#0F172A]'} flex items-center justify-center mb-3`}><stat.i className="h-10 w-10 mr-4 shrink-0"/> {stat.c}</div>
                    <div className="text-xs text-slate-500 font-black uppercase tracking-widest leading-tight">{stat.l}</div>
                </div>
            ))}
         </div>
      </section>

      {/* SELECT IDENTITY CARDS */}
      <section className="max-w-[1400px] mx-auto px-6 text-center space-y-16 mb-32">
        <h2 className="text-5xl font-black text-[#0F172A]">{t("Select Your Identity", "अपनी पहचान चुनें")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { role: 'driver', icon: <Truck/>, title: 'Driver / Fleet', desc: 'List empty trucks' },
            { role: 'transporter', icon: <User/>, title: 'Transporter', desc: 'Manage trader loads' },
            { role: 'trader', icon: <Package/>, title: 'Local Trader', desc: 'Ship individual parcels' },
            { role: 'corporate', icon: <Building/>, title: 'Corporate', desc: 'Bulk advanced bidding' }
          ].map((item: any) => (
            <button type="button" key={item.role} onClick={() => { setSelectedRole(item.role); setAuthModal({ open: true, step: 'auth_choice' }); }} 
              className="bg-white p-12 rounded-[2.5rem] border border-slate-200 shadow-lg hover:shadow-2xl hover:border-[#EA580C] transition-all flex flex-col items-center text-center group cursor-pointer hover:-translate-y-2">
              <div className="h-24 w-24 bg-slate-50 text-slate-500 rounded-[1.5rem] flex items-center justify-center mb-8 border border-slate-100 group-hover:bg-[#EA580C] group-hover:text-white transition-colors shadow-inner [&>svg]:h-12 [&>svg]:w-12">{item.icon}</div>
              <h3 className="text-2xl font-black text-slate-900 mb-3">{item.title}</h3>
              <p className="text-base text-slate-500 font-medium">{item.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* WHAT OUR USERS SAY */}
      <section className="py-32 bg-[#0F172A] text-white">
         <div className="max-w-[1600px] mx-auto px-6 sm:px-12">
           <div className="text-center mb-20">
             <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">What Our Users Say</h2>
             <p className="text-slate-400 text-xl font-medium max-w-2xl mx-auto">Real experiences from our growing network of partners who have transformed their logistics.</p>
           </div>
           <div className="flex overflow-x-auto space-x-8 pb-10 no-scrollbar snap-x cursor-grab">
             {[
               { name: "Rajesh K.", role: "Fleet Owner", quote: "LoadBhai's radar completely eliminated my empty return trips. My monthly revenue jumped by 40%. The UI is incredibly easy to use." },
               { name: "Suresh Singh", role: "Independent Driver", quote: "The safe QR code feature saved me from endless highway checks. It's the most secure way to haul freight in India right now." },
               { name: "Amit Patel", role: "Corporate Manager", quote: "Enterprise reverse bidding helped my manufacturing plant reduce logistics costs drastically. The bidding terminal is flawless." },
               { name: "Vikram D.", role: "Transporter", quote: "Bus parcel service is a game changer for urgent small loads. It's fast, reliable, and the escrow fee is very reasonable." }
             ].map((testimonial: any, i: number) => (
               <div key={i} className="min-w-[450px] bg-[#0B0F19] p-12 rounded-[2.5rem] border border-slate-800 shadow-2xl snap-center flex flex-col justify-between hover:border-[#EA580C] transition-colors group">
                 <div>
                   <div className="flex text-[#EA580C] mb-8"><Star className="h-6 w-6 fill-current"/><Star className="h-6 w-6 fill-current"/><Star className="h-6 w-6 fill-current"/><Star className="h-6 w-6 fill-current"/><Star className="h-6 w-6 fill-current"/></div>
                   <p className="text-xl text-slate-300 italic mb-10 leading-relaxed">"{testimonial.quote}"</p>
                 </div>
                 <div className="flex items-center space-x-5 border-t border-slate-800 pt-8">
                   <div className="h-16 w-16 rounded-full bg-slate-800 border-2 border-[#EA580C] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform"><User className="text-white h-8 w-8"/></div>
                   <div>
                     <h4 className="font-black text-white text-xl">{testimonial.name}</h4>
                     <p className="text-xs text-[#EA580C] font-black uppercase tracking-widest mt-1">{testimonial.role}</p>
                   </div>
                 </div>
               </div>
             ))}
           </div>
         </div>
      </section>

      {/* PLATFORM FEATURES GRID */}
      <section className="bg-slate-100 py-32 px-6">
         <div className="max-w-[1400px] mx-auto space-y-16">
           <div className="text-center mb-20"><h2 className="text-5xl font-black text-[#0F172A] mb-6">Platform Features</h2><p className="text-slate-500 text-xl font-medium">Click to explore the tools driving efficiency.</p></div>
           <div className="grid md:grid-cols-2 gap-10">
             {platformFeatures.map((b: any) => (
               <div key={b.id} onClick={() => { setSelectedFeature(b); handlePageChange('feature_detail'); }} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-lg hover:shadow-2xl transition-all cursor-pointer group hover:-translate-y-2">
                  <div className="h-72 relative overflow-hidden">
                    <img src={b.url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
                    <div className={`absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/50 opacity-90`}></div>
                    <span className="absolute top-6 left-6 bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-black px-5 py-2 rounded-full uppercase tracking-widest shadow-sm">{b.tag}</span>
                  </div>
                  <div className="p-10">
                    <h3 className="text-3xl font-black text-slate-900 mb-4 flex items-center">{b.title} <ArrowRight className="h-6 w-6 ml-auto text-slate-300 group-hover:text-[#EA580C] transition-colors"/></h3>
                    <p className="text-lg text-slate-600 font-medium leading-relaxed">{b.subtitle}</p>
                  </div>
               </div>
             ))}
           </div>
         </div>
      </section>
    </>
  );
}
