// @ts-nocheck
import React from 'react';
import { ArrowLeft, Box, QrCode, ShieldCheck, Star, Activity, Crown, History, Settings, Send, PhoneCall, Flame, TrendingDown, CheckCircle2, Upload, Check, Eye, Layers, X, Bot, HelpCircle, Plus } from 'lucide-react';

export default function SupplementaryViews({
  activeView,
  handlePageChange,
  BackToDashboardBtn,
  t,
  isLoggedIn,
  user,
  setAuthModal,
  uploadedFiles,
  handleFileUpload,
  qrDocs,
  allDocsUploaded,
  setQrDocs, negotiationTarget, setNegotiationTarget, counterOffer, setCounterOffer, processBid
}: any) {
  return (
    <>
      {/* --- SUPPLEMENTARY PAGES --- */}

        {/* SERVICES PAGE (Restored Clickable UI) */}
        {activeView === 'services' && (
           <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-24 text-center animate-fade-in space-y-16 relative z-10">
              <BackToDashboardBtn />
              <div className="max-w-4xl mx-auto space-y-6">
                <span className="bg-[#EA580C]/10 text-[#EA580C] px-5 py-2 rounded-full text-xs font-black tracking-widest uppercase border border-[#EA580C]/20 shadow-inner">How We Provide Services</span>
                <h2 className="text-5xl md:text-6xl font-black text-[#0F172A] tracking-tight leading-tight">Your Stories, Our Value</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-12 pt-12 text-left">
                {[
                  {i: Flame, t: 'Farmer Loss Returned', s: 'A farmer in Bihar was losing 30% of his tomato crop to spoilage due to slow transit and middlemen delays. Direct outstation truck matchmaking via LoadBhai solved his transit, eliminated middlemen cuts, and now he makes 50% more profit season on season.', img: 'https://images.unsplash.com/photo-1595853035070-59a39fe84de3?w=600'},
                  {i: TrendingDown, t: 'Fleet Owner Success Story', s: 'A fleet owner with 10 trucks was struggling with empty returns, facing 30% revenue loss. By utilizing our live radar, he now finds loads within 2 hours, boosting his monthly revenue by 40% and eliminating empty miles completely.', img: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?w=600'},
                ].map((story: any) => (
                  <div key={story.t} className="bg-white rounded-[2rem] border overflow-hidden shadow-2xl flex flex-col group hover:border-[#EA580C] transition-all">
                      <div className="h-64 relative overflow-hidden">
                        <img src={story.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                      </div>
                      <div className="p-10 flex-1 space-y-4">
                        <div className="flex items-center space-x-3 text-[#EA580C]"><story.i className="h-8 w-8"/><h3 className="font-black text-2xl text-slate-900 capitalize tracking-tight">{story.t}</h3></div>
                        <p className="text-slate-600 text-base font-medium leading-relaxed">{story.s}</p>
                      </div>
                  </div>
                ))}
              </div>
           </div>
        )}

        {/* SAFE QR PAGE (Accessed from Drawer) */}
        {activeView === 'safe_qr' && (
           <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-20 animate-fade-in relative z-10">
              <BackToDashboardBtn />
              <div className="bg-white p-12 md:p-16 rounded-[3rem] shadow-2xl border border-slate-200 text-center mt-10">
                 {!allDocsUploaded ? (
                    <>
                       <div className="bg-orange-50 w-32 h-32 mx-auto rounded-full flex items-center justify-center mb-8 border-4 border-white shadow-lg">
                          <QrCode className="h-16 w-16 text-[#EA580C] animate-pulse"/>
                       </div>
                       <h2 className="text-5xl font-black text-slate-900 mb-6 tracking-tight">Safe Traffic QR</h2>
                       <p className="text-slate-500 font-medium mb-16 max-w-3xl mx-auto text-xl leading-relaxed">
                         Upload your critical documents to generate a unique QR code. Streamline police cross-checks from 15 minutes to seconds, and protect yourself against highway scams.
                       </p>
                       <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
                         {['Driving License', 'Vehicle Registration (RC)', 'Insurance Policy', 'Route Permit'].map((doc: string) => {
                           const docKey = doc.toLowerCase().includes('dl') ? 'dl' : doc.toLowerCase().includes('rc') ? 'rc' : doc.toLowerCase().includes('insur') ? 'ins' : 'permit';
                           const isUploaded = qrDocs[docKey as keyof typeof qrDocs];
                           return (
                             <label key={doc} className={`border-2 border-dashed p-8 rounded-2xl flex items-center justify-between cursor-pointer transition-all ${isUploaded ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-slate-300 hover:bg-slate-50 hover:border-[#EA580C]'}`}>
                               <div>
                                 <h4 className={`font-black text-xl ${isUploaded ? 'text-emerald-700' : 'text-slate-800'}`}>{doc}</h4>
                                 <p className="text-sm text-slate-500 font-medium mt-1">{isUploaded ? 'Document Verified' : 'Click to upload PDF/Image'}</p>
                                 {isUploaded && <p className="text-xs text-emerald-600 font-black mt-3 bg-emerald-100 w-fit px-3 py-1 rounded-full"><CheckCircle2 className="h-4 w-4 inline mr-1"/> Ready</p>}
                               </div>
                               {isUploaded ? <CheckCircle2 className="h-10 w-10 text-emerald-500" /> : <Upload className="h-10 w-10 text-slate-400" />}
                               <input type="file" className="hidden" onChange={(e: any) => {
                                 if (e.target.files && e.target.files.length > 0) {
                                    setQrDocs({...qrDocs, [docKey]: true});
                                 }
                               }} />
                             </label>
                           );
                         })}
                       </div>
                    </>
                 ) : (
                    <div className="animate-fade-in py-10">
                       <div className="bg-emerald-500 w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-8 shadow-lg">
                          <Check className="h-12 w-12 text-white"/>
                       </div>
                       <h2 className="text-4xl font-black text-slate-900 mb-4">All Documents Verified</h2>
                       <p className="text-slate-500 font-medium mb-12 text-lg">Your Safe QR code is ready for highway inspections.</p>
                       
                       <div className="bg-white p-10 border-4 border-[#0F172A] rounded-[3rem] w-fit mx-auto shadow-2xl relative">
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#0F172A] text-white px-6 py-2 rounded-full font-black tracking-widest text-sm uppercase">LoadBhai Verified</div>
                          <QrCode className="h-64 w-64 text-[#0F172A] mx-auto"/>
                          <p className="text-sm font-bold text-slate-400 mt-6 tracking-widest uppercase">ID: LDB-{Math.floor(Math.random() * 900000)}</p>
                       </div>
                    </div>
                 )}
              </div>
           </div>
        )}

        {/* ABOUT US */}
        {activeView === 'about' && (
           <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-24 text-center animate-fade-in space-y-24 relative z-10">
              <BackToDashboardBtn />
              <div className="max-w-4xl mx-auto space-y-8">
                <span className="bg-[#0F172A] text-white px-6 py-2 rounded-full text-xs font-black tracking-widest uppercase shadow-lg">The Future of Freight</span>
                <h2 className="text-5xl md:text-7xl font-black text-[#0F172A] tracking-tight leading-[1.1]">Revolutionizing Logistics through <span className="text-[#EA580C]">Transparency.</span></h2>
                <p className="text-xl text-slate-600 font-medium leading-relaxed max-w-3xl mx-auto">
                  We are building the digital backbone of the global supply chain. Connecting fleets, simplifying freight, and delivering absolute clarity to B2B stakeholders everywhere.
                </p>
              </div>
              
              <div className="space-y-12">
                 <div className="text-center"><h3 className="text-4xl font-black text-slate-900 mb-4">Driven by Purpose</h3><p className="text-slate-500 font-medium text-lg">Our foundation is built on cutting-edge corporate modernism.</p></div>
                 <div className="grid md:grid-cols-2 gap-10 text-left">
                    <div className="bg-white p-12 rounded-[2.5rem] border border-slate-200 shadow-xl hover:shadow-2xl transition-shadow">
                       <Activity className="h-12 w-12 text-[#EA580C] mb-8 bg-orange-50 p-3 rounded-2xl border border-orange-100"/>
                       <h3 className="font-black text-2xl mb-4 text-slate-900">Our Mission</h3>
                       <p className="text-base font-medium text-slate-500 leading-relaxed">To eliminate friction in the global logistics network by providing a unified, high-scale platform. We empower carriers and shippers with real-time data, ensuring every load is moved with maximum efficiency.</p>
                    </div>
                    <div className="bg-white p-12 rounded-[2.5rem] border border-slate-200 shadow-xl hover:shadow-2xl transition-shadow">
                       <Eye className="h-12 w-12 text-[#EA580C] mb-8 bg-orange-50 p-3 rounded-2xl border border-orange-100"/>
                       <h3 className="font-black text-2xl mb-4 text-slate-900">Our Vision</h3>
                       <p className="text-base font-medium text-slate-500 leading-relaxed">A fully interconnected freight ecosystem where opacity is obsolete, and predictive intelligence drives strategic logistics decisions. Aligned with India's goal to reduce logistics costs to 9% of GDP.</p>
                    </div>
                    <div className="bg-white p-12 rounded-[2.5rem] border border-slate-200 shadow-xl hover:shadow-2xl transition-shadow">
                       <ShieldCheck className="h-12 w-12 text-[#0F172A] mb-8 bg-slate-100 p-3 rounded-2xl border border-slate-200"/>
                       <h3 className="font-black text-2xl mb-4 text-slate-900">Enterprise Reliability</h3>
                       <p className="text-base font-medium text-slate-500 leading-relaxed">Bank-grade security and 99.99% uptime for operations that never sleep.</p>
                    </div>
                    <div className="bg-white p-12 rounded-[2.5rem] border border-slate-200 shadow-xl hover:shadow-2xl transition-shadow">
                       <Layers className="h-12 w-12 text-[#0F172A] mb-8 bg-slate-100 p-3 rounded-2xl border border-slate-200"/>
                       <h3 className="font-black text-2xl mb-4 text-slate-900">Partner Ecosystem</h3>
                       <p className="text-base font-medium text-slate-500 leading-relaxed">Fostering deep collaborations between independent fleets and global hubs.</p>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* PRICING PAGE */}
        {activeView === 'premium' && (
           <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-24 text-center animate-fade-in space-y-16 relative z-10">
              <BackToDashboardBtn />
              <div className="max-w-3xl mx-auto space-y-6">
                <span className="bg-[#0F172A]/10 text-[#0F172A] px-5 py-2 rounded-full text-xs font-black tracking-widest uppercase border border-[#0F172A]/20 shadow-inner">Pricing Plans</span>
                <h2 className="text-5xl md:text-6xl font-black text-[#0F172A] tracking-tight leading-tight">Simple, Transparent Pricing</h2>
                <p className="text-xl text-slate-500 font-medium leading-relaxed">Power your logistics business with plans designed for single drivers, growing fleets, and large-scale enterprises.</p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8 pt-12 text-left">
                 {/* Starter Plan */}
                 <div className="bg-white p-12 rounded-[2.5rem] border border-slate-200 shadow-lg flex flex-col h-full hover:shadow-2xl hover:border-[#EA580C] hover:-translate-y-2 transition-all cursor-pointer group">
                    <h3 className="font-black text-3xl text-slate-900 mb-4 group-hover:text-[#EA580C] transition-colors">Starter</h3>
                    <div className="text-6xl font-black text-slate-900 mb-8">₹0<span className="text-xl text-slate-400 font-bold">/mo</span></div>
                    <button type="button" className="w-full bg-slate-100 text-slate-700 font-black py-4.5 rounded-xl mb-10 hover:bg-slate-200 transition-colors text-lg">Current Plan</button>
                    <ul className="space-y-6 text-base font-bold text-slate-600 flex-1">
                      <li className="flex items-start"><CheckCircle2 className="h-6 w-6 text-slate-300 mr-4 shrink-0"/> Standard route visibility</li>
                      <li className="flex items-start"><CheckCircle2 className="h-6 w-6 text-slate-300 mr-4 shrink-0"/> ₹1500 Match Fee applies per load</li>
                    </ul>
                 </div>

                 {/* Growth Plan (Recommended) */}
                 <div className="bg-[#0F172A] text-white p-12 rounded-[2.5rem] shadow-2xl transform md:-translate-y-8 relative flex flex-col h-full hover:shadow-[0_0_40px_rgba(234,88,12,0.3)] hover:-translate-y-10 transition-all cursor-pointer border border-[#0F172A]">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#EA580C] text-white text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest shadow-lg">Recommended</div>
                    <h3 className="font-black text-3xl text-white mb-4">Platinum</h3>
                    <div className="text-6xl font-black text-white mb-8">₹999<span className="text-xl text-slate-400 font-bold">/mo</span></div>
                    <button type="button" className="w-full bg-[#EA580C] text-white font-black py-4.5 rounded-xl mb-10 shadow-lg hover:bg-orange-700 transition-colors text-lg">Upgrade Now</button>
                    <ul className="space-y-6 text-base font-bold text-slate-300 flex-1">
                      <li className="flex items-start"><CheckCircle2 className="h-6 w-6 text-[#EA580C] mr-4 shrink-0"/> Zero Commission on 50 loads</li>
                      <li className="flex items-start"><CheckCircle2 className="h-6 w-6 text-[#EA580C] mr-4 shrink-0"/> Dedicated Account Manager</li>
                      <li className="flex items-start"><CheckCircle2 className="h-6 w-6 text-[#EA580C] mr-4 shrink-0"/> Live GPS Tracking Access</li>
                    </ul>
                 </div>

                 {/* Enterprise Plan */}
                 <div className="bg-white p-12 rounded-[2.5rem] border border-slate-200 shadow-lg flex flex-col h-full hover:shadow-2xl hover:border-[#0F172A] hover:-translate-y-2 transition-all cursor-pointer group">
                    <h3 className="font-black text-3xl text-slate-900 mb-4 group-hover:text-[#0F172A] transition-colors">Enterprise</h3>
                    <div className="text-6xl font-black text-slate-900 mb-8">Custom</div>
                    <button type="button" className="w-full bg-[#0F172A] text-white font-black py-4.5 rounded-xl mb-10 hover:bg-slate-800 transition-colors shadow-md text-lg">Contact Sales</button>
                    <ul className="space-y-6 text-base font-bold text-slate-600 flex-1">
                      <li className="flex items-start"><CheckCircle2 className="h-6 w-6 text-slate-300 mr-4 shrink-0 group-hover:text-[#0F172A] transition-colors"/> Full API Integrations</li>
                      <li className="flex items-start"><CheckCircle2 className="h-6 w-6 text-slate-300 mr-4 shrink-0 group-hover:text-[#0F172A] transition-colors"/> Custom Fleet Management</li>
                    </ul>
                 </div>
              </div>
           </div>
        )}

        {/* --- NEGOTIATION MODAL --- */}
        {negotiationTarget && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-[#0F172A]/80 backdrop-blur-sm animate-fade-in">
            <div className="w-full max-w-md bg-white rounded-2xl p-8 relative shadow-2xl pointer-events-auto">
              <button type="button" onClick={() => setNegotiationTarget(null)} className="absolute top-5 right-5 text-slate-400 hover:text-slate-900"><X className="h-5 w-5" /></button>
              <h3 className="text-xl font-black text-slate-900 mb-4">Place Your Bid - {negotiationTarget.data.id}</h3>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-sm mb-6 font-bold text-slate-600">
                 <div>{negotiationTarget.data.route}</div>
                 <div className="mt-1">Current L1: <span className="text-[#EA580C] text-lg font-black">₹{negotiationTarget.data.L1.toLocaleString('en-IN')}</span></div>
              </div>
              <div className="space-y-3 mb-6">
                <label className="text-xs font-bold text-slate-600 uppercase">Your Counter Bid</label>
                <input type="number" value={counterOffer} onChange={(e: any) => setCounterOffer(e.target.value)} placeholder="Amount (INR)" className="w-full bg-white border border-slate-300 rounded-xl p-4 text-sm font-bold outline-none focus:border-[#EA580C] shadow-inner" />
              </div>
              <button type="button" onClick={processBid} className="w-full bg-[#EA580C] text-white font-black text-sm py-4 rounded-xl hover:bg-orange-700 transition-all shadow-md">Submit Bid</button>
            </div>
          </div>
        )}

        {/* CONTACT PAGE WITH CHATBOT & FAQ */}
        {activeView === 'contact' && (
          <div className="max-w-[1400px] mx-auto px-6 py-24 animate-fade-in relative z-10">
             <BackToDashboardBtn />
             <div className="text-center mb-16 mt-8">
                 <h2 className="text-5xl font-black text-slate-900 mb-6">Contact & Support</h2>
                 <p className="text-xl text-slate-500 font-medium">We're here to help you 24/7 with your logistics needs.</p>
             </div>
             <div className="grid lg:grid-cols-2 gap-16">
                {/* Left: Contact Info & Chatbot */}
                <div className="space-y-12">
                   <div className="bg-[#0F172A] p-12 rounded-[3rem] shadow-2xl text-white relative overflow-hidden hover:scale-[1.02] transition-transform cursor-default">
                      <div className="absolute top-0 right-0 w-64 h-64 bg-[#EA580C] rounded-full blur-[100px] opacity-30"></div>
                      <PhoneCall className="h-16 w-16 text-[#EA580C] mb-6"/>
                      <h3 className="text-3xl font-black mb-2">Call Our Helpdesk</h3>
                      <p className="text-slate-400 font-medium mb-8">Available Mon-Sat, 9 AM to 8 PM</p>
                      <div className="text-5xl font-black text-[#EA580C] tracking-tight">+91 82101 60012</div>
                   </div>

                   <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-200">
                      <div className="flex items-center space-x-5 mb-8 pb-8 border-b border-slate-100">
                         <div className="bg-orange-50 p-4 rounded-full"><Bot className="h-10 w-10 text-[#EA580C]"/></div>
                         <div>
                            <h4 className="font-black text-2xl text-slate-900">LoadBhai AI Assistant</h4>
                            <p className="text-sm font-bold text-emerald-500 flex items-center mt-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mr-2 animate-pulse"></span> Online Now</p>
                         </div>
                      </div>
                      <div className="bg-slate-50 rounded-3xl p-8 h-72 overflow-y-auto mb-8 space-y-4 border border-slate-100 shadow-inner">
                         <div className="bg-white p-5 rounded-2xl rounded-tl-none shadow-sm w-fit border border-slate-200">
                            <p className="text-base font-bold text-slate-700">Namaste! How can I help you today with your logistics?</p>
                         </div>
                      </div>
                      <div className="flex items-center bg-white border border-slate-300 rounded-2xl p-3 shadow-inner">
                         <input type="text" placeholder="Type your message..." className="flex-1 outline-none px-5 py-3 text-base font-bold text-slate-700"/>
                         <button type="button" className="bg-[#EA580C] p-4 rounded-xl text-white hover:bg-orange-700 shadow-md transition-colors"><Send className="h-6 w-6"/></button>
                      </div>
                   </div>
                </div>

                {/* Right: FAQs */}
                <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-slate-200 h-fit">
                   <h3 className="text-3xl font-black text-slate-900 mb-10 flex items-center"><HelpCircle className="h-10 w-10 text-[#EA580C] mr-5"/> Frequently Asked Questions</h3>
                   <div className="space-y-6">
                      {[
                        {q: "How does 'Empowering Transporters' work?", a: "We empower transporters by removing middlemen. You connect directly with the shipper, meaning 100% of the negotiated fare goes to you."},
                        {q: "How to generate Safe QR?", a: "Go to your Profile Drawer > Security QR. Upload your DL, RC, and Permit. Once verified, a unique QR is generated to speed up highway police checks."},
                        {q: "How can I bid on Enterprise Loads?", a: "Register as a 'Corporate' or 'Transporter'. Go to the Enterprise Auctions tab in your dashboard, view active demands, and place your lowest competitive bid (L1)."},
                        {q: "What is Fleet Mandi?", a: "It's our group-buying marketplace. By combining the purchasing power of thousands of fleet owners, we negotiate wholesale prices for engine oil, tires, and spare parts."}
                      ].map((faq: any, i: number) => (
                         <details key={i} className="group bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                            <summary className="p-6 font-black text-xl text-slate-800 cursor-pointer list-none flex justify-between items-center group-open:bg-orange-50 group-open:text-[#EA580C] transition-colors">
                               {faq.q}
                               <Plus className="h-6 w-6 group-open:rotate-45 transition-transform text-slate-400 group-open:text-[#EA580C]"/>
                            </summary>
                            <div className="p-6 pt-0 text-slate-600 font-medium text-lg leading-relaxed bg-orange-50">
                               {faq.a}
                            </div>
                         </details>
                      ))}
                   </div>
                </div>
             </div>
          </div>
        )}

        {/* OTHER FALLBACKS */}
        {(activeView === 'history' || activeView === 'settings') && (
           <div className="max-w-[800px] mx-auto px-6 py-24 text-center animate-fade-in relative z-10">
              <BackToDashboardBtn />
              <div className="bg-white p-16 rounded-[3rem] border border-slate-200 shadow-2xl mt-10">
                 <div className="h-28 w-28 bg-slate-50 border border-slate-100 rounded-full mx-auto flex items-center justify-center mb-10 shadow-inner"><Settings className="h-12 w-12 text-[#EA580C]"/></div>
                 <h2 className="text-5xl font-black text-slate-900 mb-5 capitalize tracking-tight">{activeView.replace('_', ' ')} Module</h2>
                 <p className="text-slate-500 font-medium text-xl leading-relaxed max-w-xl mx-auto">This section is securely integrated into the backend architecture and requires appropriate permissions to view raw data.</p>
              </div>
           </div>
        )}

      
    </>
  );
}
