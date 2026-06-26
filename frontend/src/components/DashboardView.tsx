// @ts-nocheck
import React from 'react';
import { Truck, User, MapPin, Search, ArrowLeft, ArrowRight, Package, Box, Clock, TrendingDown, Radio, Send, Crown, CheckCircle2 } from 'lucide-react';
import { mandiProducts } from '../constants';

export default function DashboardView({
  activeModule, setActiveModule,
  listingTab, setListingTab,
  busTab, setBusTab,
  bookingStep, setBookingStep,
  freightSearch, setFreightSearch,
  busSearch, setBusSearch,
  combinedFeed, filteredBusFeed, corporateBids,
  user, selectedRole, t,
  LayeredStepIndicator, renderLiveRadar,
  newTruck, setNewTruck, handlePostTruck,
  newLoad, setNewLoad, handlePostLoad,
  newBus, setNewBus, handlePostBus,
  newBid, setNewBid, handlePostBid,
  expandedListingId, setExpandedListingId,
  negotiationTarget, setNegotiationTarget,
  counterOffer, setCounterOffer, processBid
}: any) {
  return (
    <>
      {/* LOGGED IN DASHBOARD MODULES */}
        
          <div className="max-w-[1600px] mx-auto px-4 sm:px-8 py-10 relative">
             
             {/* TOP MODULE TABS - RESTORED FULLY */}
             <div className="flex flex-col lg:flex-row justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-200 shadow-xl mb-12 gap-6">
                <h2 className="text-3xl font-black text-slate-900 w-full lg:w-auto text-center lg:text-left tracking-tight">
                  {activeModule === 'freight' && 'Book Freight & Radar'}
                  {activeModule === 'bus_cargo' && 'Bus Parcel Delivery'}
                  {activeModule === 'corporate' && 'Enterprise Auctions'}
                  {activeModule === 'mandi' && 'Fleet Mandi Hub'}
                  {activeModule === 'ads' && 'Truck Advertising'}
                </h2>
                {/* Module-specific Sub Tabs */}
                <div className="flex flex-wrap justify-center bg-slate-100 p-2 rounded-2xl w-full lg:w-auto border border-slate-200 shadow-inner gap-2">
                   {[
                     { id: 'freight', label: 'Book Freight' },
                     { id: 'bus_cargo', label: 'Bus Parcel' },
                     { id: 'corporate', label: 'Enterprise Bids' },
                     { id: 'mandi', label: 'Fleet Mandi' },
                     { id: 'ads', label: 'Truck Ads' }
                   ].map((tab: any) => (
                     <button type="button" key={tab.id} onClick={() => { setActiveModule(tab.id as ModuleTab); setListingTab('all'); setBusTab('all'); setBookingStep(1); }} 
                       className={`px-6 py-3.5 rounded-xl text-sm font-black transition-all ${activeModule === tab.id ? 'bg-[#0F172A] text-white shadow-md' : 'text-slate-500 hover:text-slate-900 hover:bg-white'}`}>
                       {tab.label}
                     </button>
                   ))}
                </div>
             </div>

             {/* Module-specific Sub Tabs for Freight/Bus */}
             {(activeModule === 'freight' || activeModule === 'bus_cargo') && (
                <div className="flex justify-center mb-10">
                  <div className="flex bg-slate-100 p-2 rounded-2xl w-fit border border-slate-200 shadow-inner">
                     <button type="button" onClick={() => { activeModule === 'freight' ? setListingTab('all') : setBusTab('all'); }} className={`px-10 py-3.5 rounded-xl text-sm font-black transition-all ${(activeModule === 'freight' ? listingTab : busTab) === 'all' ? 'bg-white text-[#EA580C] shadow' : 'text-slate-500 hover:text-slate-900'}`}>Market Feed</button>
                     <button type="button" onClick={() => { activeModule === 'freight' ? setListingTab('my_listings') : setBusTab('my_listings'); }} className={`px-10 py-3.5 rounded-xl text-sm font-black transition-all ${(activeModule === 'freight' ? listingTab : busTab) === 'my_listings' ? 'bg-white text-[#EA580C] shadow' : 'text-slate-500 hover:text-slate-900'}`}>My Listings</button>
                     <button type="button" onClick={() => { activeModule === 'freight' ? setListingTab('command_center') : setBusTab('command_center'); }} className={`px-10 py-3.5 rounded-xl text-sm font-black transition-all ${(activeModule === 'freight' ? listingTab : busTab) === 'command_center' ? 'bg-[#0F172A] text-white shadow' : 'text-slate-500 hover:text-slate-900'}`}>Radar</button>
                  </div>
                </div>
             )}

             {/* MODULE: FREIGHT */}
             {activeModule === 'freight' && (
               <div className="space-y-10 animate-fade-in">
                 {listingTab === 'all' && (
                    <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-2xl">
                      <div className="p-8 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
                         <div className="flex items-center space-x-4">
                           <div className="bg-[#EA580C] p-3 rounded-2xl shadow-inner"><Activity className="h-7 w-7 text-white"/></div>
                           <h3 className="font-black text-slate-900 text-2xl">Live Freight Market</h3>
                         </div>
                         <div className="flex space-x-4 w-full md:w-auto">
                           {/* Real-time search/filter inputs */}
                           <div className="bg-white border border-slate-300 px-5 py-4 rounded-xl flex items-center shadow-inner flex-1 md:flex-none">
                             <Search className="h-5 w-5 mr-3 text-slate-400"/>
                             <input type="text" placeholder="Search Origin/Dest..." value={freightSearch} onChange={(e: any)=>setFreightSearch(e.target.value)} className="text-sm font-bold outline-none w-full md:w-40 text-slate-700"/>
                           </div>
                           <select value={freightCapacityFilter} onChange={(e: any)=>setFreightCapacityFilter(e.target.value)} className="bg-[#0F172A] text-white border border-slate-800 px-7 py-4 rounded-xl shadow-md text-sm font-black outline-none cursor-pointer">
                              <option value="">All Capacities</option>
                              <option value="15">15 Tons</option>
                              <option value="16">16 Tons</option>
                              <option value="20">20 Tons</option>
                           </select>
                         </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[900px]">
                          <thead>
                            <tr className="bg-white border-b border-slate-200 text-xs font-black text-slate-400 uppercase tracking-widest">
                              <th className="p-8 pl-10">Vehicle / Asset</th>
                              <th className="p-8">Route Details</th>
                              <th className="p-8">Capacity & Type</th>
                              <th className="p-8">Est. Fare</th>
                              <th className="p-8 text-right pr-10">Action</th>
                            </tr>
                          </thead>
                          <tbody className="text-sm divide-y divide-slate-100">
                            {combinedFeed.map((item: any, idx: number) => (
                              <React.Fragment key={idx}>
                                <tr className="hover:bg-slate-50 cursor-pointer transition-colors" onClick={() => setExpandedListingId(expandedListingId === item.id ? null : item.id)}>
                                  <td className="p-8 pl-10">
                                    <div className="flex items-center space-x-5">
                                      <div className="h-16 w-24 bg-slate-200 rounded-xl overflow-hidden border border-slate-300 shadow-sm">
                                        <img src={item.truckImg || 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=400'} className="w-full h-full object-cover" alt=""/>
                                      </div>
                                      <div>
                                        <div className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded border border-slate-200 uppercase w-fit mb-1">{item.id || `LOD-${idx}`}</div>
                                        <div className="font-black text-slate-900 text-lg">{item.isMine ? (item.driverName || item.companyName) : 'View Contact'}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-8">
                                    <div className="flex items-center space-x-3 font-black text-slate-900 text-lg bg-slate-100 w-fit px-5 py-2.5 rounded-xl border border-slate-200">
                                      <span>{item.origin || item.currentLoc}</span>
                                      <ArrowRight className="h-5 w-5 text-[#EA580C]"/>
                                      <span>{item.destination || item.destLoc}</span>
                                    </div>
                                  </td>
                                  <td className="p-8 font-bold text-slate-600 text-lg">
                                    {item.capacity || item.weight} Tons <br/> <span className="text-xs text-slate-400 uppercase tracking-widest">{item.type || item.material || 'General'}</span>
                                  </td>
                                  <td className="p-8 font-black text-slate-900 text-3xl text-[#EA580C]">
                                    ₹{(item.charges || item.targetPrice).toLocaleString('en-IN')}
                                  </td>
                                  <td className="p-8 text-right pr-10">
                                    <div className="flex justify-end items-center text-slate-400 group-hover:text-[#0F172A]">
                                      <span className="text-xs font-black mr-3 uppercase tracking-widest">Details</span> 
                                      <div className={`p-2.5 rounded-full transition-all ${expandedListingId === item.id ? 'bg-[#0F172A] text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}>
                                        <ChevronDown className={`h-6 w-6 transition-transform ${expandedListingId === item.id ? 'rotate-180' : ''}`} />
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                {expandedListingId === item.id && (
                                  <tr className="bg-slate-50 border-b border-slate-200 shadow-inner">
                                    <td colSpan={5} className="p-8">
                                      <div className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-xl flex flex-col md:flex-row justify-between items-center gap-8 animate-fade-in">
                                        <div className="flex items-center space-x-8">
                                          <div className="h-20 w-20 rounded-full bg-slate-100 border-4 border-slate-200 flex items-center justify-center overflow-hidden shadow-inner">
                                            {item.dp ? <img src={item.dp} className="h-full w-full object-cover" alt=""/> : <User className="h-10 w-10 text-slate-400"/>}
                                          </div>
                                          <div>
                                            <div className="font-black text-slate-900 text-2xl mb-3">{item.driverName || item.companyName || 'Verified Transporter'}</div>
                                            <div className="flex space-x-5 text-sm font-bold text-slate-600">
                                              <span className="flex items-center bg-slate-100 px-4 py-2 rounded-xl border border-slate-200"><PhoneCall className="h-5 w-5 mr-2 text-[#EA580C]"/> {item.phone || '+91 9876543210'}</span>
                                              <span className="flex items-center bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 text-emerald-600"><CheckCircle2 className="h-5 w-5 mr-2"/> KYC Verified</span>
                                            </div>
                                          </div>
                                        </div>
                                        <button type="button" onClick={(e: any) => { e.stopPropagation(); openWhatsApp(`I want to connect regarding Freight ID: ${item.id}`); }} className="bg-[#0F172A] text-white font-black px-12 py-5 rounded-xl shadow-xl hover:bg-slate-800 transition-colors text-lg w-full md:w-auto">
                                          Contact / Bid Now
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            ))}
                            {combinedFeed.length === 0 && <tr><td colSpan={5} className="p-16 text-center text-slate-500 font-bold text-lg">No active listings match your search.</td></tr>}
                          </tbody>
                        </table>
                      </div>
                    </div>
                 )}

                 {listingTab === 'my_listings' && (
                    <div className="grid lg:grid-cols-3 gap-10">
                       <div className="lg:col-span-1 bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl h-fit">
                         <h3 className="font-black text-3xl text-slate-900 mb-8 border-b border-slate-100 pb-5">Post Requirements</h3>
                         {LayeredStepIndicator()}
                         {selectedRole === 'driver' || selectedRole === 'transporter' ? (
                           <form onSubmit={handlePostTruck} className="space-y-5">
                             {bookingStep === 1 && (
                               <div className="animate-fade-in space-y-5">
                                 <input type="text" placeholder="Origin Location" value={newTruck.origin} onChange={(e: any)=>setNewTruck({...newTruck, origin: e.target.value})} className="w-full border border-slate-300 p-5 rounded-xl text-base font-bold focus:border-[#EA580C] outline-none shadow-inner" required/>
                                 <input type="text" placeholder="Destination" value={newTruck.dest} onChange={(e: any)=>setNewTruck({...newTruck, dest: e.target.value})} className="w-full border border-slate-300 p-5 rounded-xl text-base font-bold focus:border-[#EA580C] outline-none shadow-inner" required/>
                                 <button type="button" onClick={()=>setBookingStep(2)} className="w-full bg-[#0F172A] text-white p-5 rounded-xl font-black text-lg hover:bg-slate-800 transition-colors shadow-lg mt-4">Next Step</button>
                               </div>
                             )}
                             {bookingStep === 2 && (
                               <div className="animate-fade-in space-y-5">
                                 <input type="text" placeholder="Vehicle No (e.g. MH04AB1234)" value={newTruck.vehicleNumber} onChange={(e: any)=>setNewTruck({...newTruck, vehicleNumber: e.target.value})} className="w-full border border-slate-300 p-5 rounded-xl text-base font-bold focus:border-[#EA580C] outline-none shadow-inner" required/>
                                 <input type="text" placeholder="Capacity (Tons)" value={newTruck.capacity} onChange={(e: any)=>setNewTruck({...newTruck, capacity: e.target.value})} className="w-full border border-slate-300 p-5 rounded-xl text-base font-bold focus:border-[#EA580C] outline-none shadow-inner" required/>
                                 <div className="flex gap-4 pt-4">
                                   <button type="button" onClick={()=>setBookingStep(1)} className="flex-1 bg-slate-100 text-slate-700 font-black p-5 rounded-xl hover:bg-slate-200 transition-colors">Back</button>
                                   <button type="button" onClick={()=>setBookingStep(3)} className="flex-[2] bg-[#0F172A] text-white font-black p-5 rounded-xl hover:bg-slate-800 transition-colors shadow-lg">Next</button>
                                 </div>
                               </div>
                             )}
                             {bookingStep === 3 && (
                               <div className="animate-fade-in space-y-5">
                                 <input type="number" placeholder="Expected Price (₹)" value={newTruck.charges} onChange={(e: any)=>setNewTruck({...newTruck, charges: e.target.value})} className="w-full border border-slate-300 p-5 rounded-xl text-base font-bold focus:border-[#EA580C] outline-none shadow-inner" required/>
                                 <label className="border-2 border-dashed border-slate-300 bg-slate-50 p-8 rounded-2xl text-center cursor-pointer block hover:bg-slate-100 transition-colors">
                                   <Camera className="mx-auto h-10 w-10 text-slate-400 mb-3"/>
                                   <span className="text-sm text-slate-600 font-black uppercase tracking-widest">Upload Truck Image</span>
                                   <input type="file" className="hidden" onChange={(e: any) => handleFileUpload('truck_pic', e)} />
                                 </label>
                                 <div className="flex gap-4 pt-6">
                                   <button type="button" onClick={()=>setBookingStep(2)} className="flex-1 bg-slate-100 text-slate-700 font-black p-5 rounded-xl hover:bg-slate-200 transition-colors">Back</button>
                                   <button type="submit" className="flex-[2] bg-[#EA580C] text-white font-black p-5 rounded-xl hover:bg-orange-700 shadow-xl transition-colors text-lg">Post Listing</button>
                                 </div>
                               </div>
                             )}
                           </form>
                         ) : (
                           <form onSubmit={handlePostLoad} className="space-y-5">
                              {bookingStep === 1 && (
                               <div className="animate-fade-in space-y-5">
                                 <input type="text" placeholder="Pickup Location" value={newLoad.origin} onChange={(e: any)=>setNewLoad({...newLoad, origin: e.target.value})} className="w-full border border-slate-300 p-5 rounded-xl text-base font-bold focus:border-[#EA580C] outline-none shadow-inner" required/>
                                 <input type="text" placeholder="Drop Location" value={newLoad.destination} onChange={(e: any)=>setNewLoad({...newLoad, destination: e.target.value})} className="w-full border border-slate-300 p-5 rounded-xl text-base font-bold focus:border-[#EA580C] outline-none shadow-inner" required/>
                                 <button type="button" onClick={()=>setBookingStep(2)} className="w-full bg-[#0F172A] text-white p-5 rounded-xl font-black text-lg hover:bg-slate-800 transition-colors shadow-lg mt-4">Next Step</button>
                               </div>
                             )}
                             {bookingStep === 2 && (
                               <div className="animate-fade-in space-y-5">
                                 <input type="text" placeholder="Material Type" value={newLoad.material} onChange={(e: any)=>setNewLoad({...newLoad, material: e.target.value})} className="w-full border border-slate-300 p-5 rounded-xl text-base font-bold focus:border-[#EA580C] outline-none shadow-inner" required/>
                                 <input type="text" placeholder="Weight (Tons)" value={newLoad.weight} onChange={(e: any)=>setNewLoad({...newLoad, weight: e.target.value})} className="w-full border border-slate-300 p-5 rounded-xl text-base font-bold focus:border-[#EA580C] outline-none shadow-inner" required/>
                                 <div className="flex gap-4 pt-4">
                                   <button type="button" onClick={()=>setBookingStep(1)} className="flex-1 bg-slate-100 text-slate-700 font-black p-5 rounded-xl hover:bg-slate-200 transition-colors">Back</button>
                                   <button type="button" onClick={()=>setBookingStep(3)} className="flex-[2] bg-[#0F172A] text-white font-black p-5 rounded-xl hover:bg-slate-800 transition-colors shadow-lg">Next</button>
                                 </div>
                               </div>
                             )}
                             {bookingStep === 3 && (
                               <div className="animate-fade-in space-y-5">
                                 <input type="number" placeholder="Offer Price (₹)" value={newLoad.targetPrice} onChange={(e: any)=>setNewLoad({...newLoad, targetPrice: e.target.value})} className="w-full border border-slate-300 p-5 rounded-xl text-base font-bold focus:border-[#EA580C] outline-none shadow-inner" required/>
                                 <div className="flex gap-4 pt-6">
                                   <button type="button" onClick={()=>setBookingStep(2)} className="flex-1 bg-slate-100 text-slate-700 font-black p-5 rounded-xl hover:bg-slate-200 transition-colors">Back</button>
                                   <button type="submit" className="flex-[2] bg-[#EA580C] text-white font-black p-5 rounded-xl hover:bg-orange-700 shadow-md transition-colors">Post Load</button>
                                 </div>
                               </div>
                             )}
                           </form>
                         )}
                       </div>
                       <div className="lg:col-span-2">
                         {renderLiveRadar()}
                       </div>
                    </div>
                 )}

                 {listingTab === 'command_center' && renderLiveRadar()}
               </div>
             )}

             {/* MODULE: BUS CARGO */}
             {activeModule === 'bus_cargo' && (
               <div className="space-y-10 animate-fade-in">
                 
                 {busTab === 'all' && (
                   <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-2xl">
                      <div className="p-8 border-b border-slate-200 bg-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
                         <div className="flex items-center space-x-4">
                           <div className="bg-[#EA580C] p-3 rounded-2xl shadow-inner"><Bus className="h-7 w-7 text-white"/></div>
                           <h3 className="font-black text-slate-900 text-2xl">Active Bus Cargo</h3>
                         </div>
                         <div className="flex space-x-4 w-full md:w-auto">
                           {/* Real-time search for Bus */}
                           <div className="bg-white border border-slate-300 px-5 py-4 rounded-xl flex items-center shadow-inner flex-1 md:flex-none">
                             <Search className="h-5 w-5 mr-3 text-slate-400"/>
                             <input type="text" placeholder="Search route..." value={busSearch} onChange={(e: any)=>setBusSearch(e.target.value)} className="text-sm font-bold outline-none w-full md:w-48 text-slate-700"/>
                           </div>
                           <select value={busTypeFilter} onChange={(e: any)=>setBusTypeFilter(e.target.value)} className="bg-[#0F172A] text-white border border-slate-800 px-7 py-4 rounded-xl shadow-md text-sm font-black outline-none cursor-pointer">
                              <option value="">All Types</option>
                              <option value="Fragile">Fragile</option>
                              <option value="Express">Express</option>
                              <option value="Standard">Standard</option>
                           </select>
                         </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[900px]">
                          <thead>
                            <tr className="bg-white border-b border-slate-200 text-xs font-black text-slate-400 uppercase tracking-widest">
                              <th className="p-8 pl-10">Bus Operator</th>
                              <th className="p-8">Route</th>
                              <th className="p-8">Space & Type</th>
                              <th className="p-8">Price/Kg</th>
                              <th className="p-8 text-right pr-10">Action</th>
                            </tr>
                          </thead>
                          <tbody className="text-sm divide-y divide-slate-100">
                            {filteredBusFeed.map((bus: any, idx: number) => (
                              <React.Fragment key={idx}>
                                <tr className="hover:bg-slate-50 cursor-pointer transition-colors" onClick={() => setExpandedListingId(expandedListingId === bus.id ? null : bus.id)}>
                                  <td className="p-8 pl-10">
                                    <div className="flex items-center space-x-5">
                                      <div className="h-16 w-24 bg-slate-200 rounded-xl overflow-hidden border border-slate-300 shadow-sm">
                                        <img src={bus.busImg} className="w-full h-full object-cover" alt="" />
                                      </div>
                                      <div>
                                        <div className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded border border-slate-200 uppercase w-fit mb-1">{bus.id}</div>
                                        <div className="font-black text-slate-900 text-lg">{bus.operator}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="p-8 font-black text-slate-900 text-lg">
                                    <span className="bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 inline-block">{bus.route}</span>
                                  </td>
                                  <td className="p-8 font-bold text-slate-600 text-base">
                                    {bus.capacity} <br/> 
                                    <span className={`text-[10px] font-black uppercase tracking-widest mt-1.5 inline-flex items-center px-2.5 py-1 rounded-md ${bus.serviceType === 'Fragile' ? 'bg-orange-50 text-[#EA580C] border border-orange-100' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                                      {bus.serviceType === 'Fragile' && <Package className="h-3 w-3 mr-1"/>}
                                      {bus.serviceType === 'Express' && <Truck className="h-3 w-3 mr-1"/>}
                                      {bus.serviceType === 'Standard' && <Box className="h-3 w-3 mr-1"/>}
                                      {bus.serviceType}
                                    </span>
                                  </td>
                                  <td className="p-8 font-black text-slate-900 text-3xl text-[#EA580C]">
                                    ₹{bus.price}
                                  </td>
                                  <td className="p-8 text-right pr-10">
                                    <div className="flex justify-end items-center text-slate-400 group-hover:text-[#0F172A]">
                                      <span className="text-xs font-black mr-3 uppercase tracking-widest">Details</span> 
                                      <div className={`p-2.5 rounded-full transition-all ${expandedListingId === bus.id ? 'bg-[#0F172A] text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}>
                                        <ChevronDown className={`h-6 w-6 transition-transform ${expandedListingId === bus.id ? 'rotate-180' : ''}`} />
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                {expandedListingId === bus.id && (
                                  <tr className="bg-slate-50 border-b border-slate-200 shadow-inner">
                                    <td colSpan={5} className="p-8">
                                      <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-lg flex flex-col md:flex-row justify-between items-center gap-6 animate-fade-in">
                                        <div className="flex items-center space-x-6">
                                          <div className="h-16 w-16 rounded-full bg-slate-100 border-4 border-slate-200 flex items-center justify-center overflow-hidden shadow-inner">
                                            <Bus className="h-8 w-8 text-slate-400"/>
                                          </div>
                                          <div>
                                            <div className="font-black text-slate-900 text-xl mb-2">{bus.operator}</div>
                                            <div className="flex space-x-4 text-sm font-bold text-slate-600">
                                              <span className="flex items-center bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200"><PhoneCall className="h-4 w-4 mr-2 text-[#EA580C]"/> Contact Operator</span>
                                              <span className="flex items-center bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 text-emerald-600"><CheckCircle2 className="h-4 w-4 mr-2"/> Verified Route</span>
                                            </div>
                                          </div>
                                        </div>
                                        <button type="button" onClick={(e: any) => { e.stopPropagation(); openWhatsApp(`I want to book parcel space on ${bus.route} via ${bus.operator}`); }} className="bg-[#0F172A] text-white font-black px-10 py-4 rounded-xl shadow-xl hover:bg-slate-800 transition-colors text-base w-full md:w-auto">
                                          Book Space Now
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            ))}
                            {filteredBusFeed.length === 0 && <tr><td colSpan={5} className="p-16 text-center text-slate-500 font-bold text-lg">No active bus networks match your filter.</td></tr>}
                          </tbody>
                        </table>
                      </div>
                   </div>
                 )}

                 {busTab === 'my_listings' && (
                   <div className="grid lg:grid-cols-3 gap-10">
                      <div className="lg:col-span-1 bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-2xl h-fit">
                        {selectedRole === 'driver' || selectedRole === 'transporter' ? (
                          <form onSubmit={handlePostBus} className="space-y-6">
                             <h3 className="font-black text-3xl text-slate-900 border-b border-slate-100 pb-5 mb-8">List Bus Capacity</h3>
                             <div className="space-y-5">
                               <label className="text-xs font-bold text-slate-700 block uppercase tracking-widest">Route (Origin - Destination)</label>
                               <input type="text" placeholder="e.g. Patna - Delhi" value={newBus.route} onChange={(e: any)=>setNewBus({...newBus, route:e.target.value})} className="w-full border border-slate-300 p-5 rounded-xl text-base font-bold outline-none focus:border-[#EA580C] shadow-inner" required/>
                               
                               <div className="grid grid-cols-2 gap-4">
                                 <div>
                                   <label className="text-xs font-bold text-slate-700 block pt-2 uppercase tracking-widest">Vehicle No.</label>
                                   <input type="text" placeholder="e.g. MH04 AB1234" value={newBus.vehicleNumber} onChange={(e: any)=>setNewBus({...newBus, vehicleNumber:e.target.value})} className="w-full border border-slate-300 p-5 rounded-xl text-base font-bold outline-none focus:border-[#EA580C] shadow-inner" required/>
                                 </div>
                                 <div>
                                   <label className="text-xs font-bold text-slate-700 block pt-2 uppercase tracking-widest">Space (KG)</label>
                                   <input type="number" placeholder="e.g. 500" value={newBus.capacity} onChange={(e: any)=>setNewBus({...newBus, capacity:e.target.value})} className="w-full border border-slate-300 p-5 rounded-xl text-base font-bold outline-none focus:border-[#EA580C] shadow-inner" required/>
                                 </div>
                               </div>

                               <label className="text-xs font-bold text-slate-700 block pt-4 uppercase tracking-widest">Select Service Type</label>
                               <div className="grid grid-cols-3 gap-4 mb-8">
                                  <div onClick={() => setNewBus({...newBus, serviceType: 'Fragile'})} className={`border-2 rounded-xl p-4 text-center cursor-pointer transition-colors ${newBus.serviceType === 'Fragile' ? 'border-[#EA580C] bg-orange-50' : 'border-slate-200'}`}><Package className={`h-8 w-8 mx-auto mb-3 ${newBus.serviceType === 'Fragile' ? 'text-[#EA580C]' : 'text-slate-400'}`}/><div className="text-[10px] font-black uppercase tracking-wider">Fragile</div></div>
                                  <div onClick={() => setNewBus({...newBus, serviceType: 'Express'})} className={`border-2 rounded-xl p-4 text-center cursor-pointer transition-colors ${newBus.serviceType === 'Express' ? 'border-[#EA580C] bg-orange-50' : 'border-slate-200'}`}><Truck className={`h-8 w-8 mx-auto mb-3 ${newBus.serviceType === 'Express' ? 'text-[#EA580C]' : 'text-slate-400'}`}/><div className="text-[10px] font-black uppercase tracking-wider">Express</div></div>
                                  <div onClick={() => setNewBus({...newBus, serviceType: 'Standard'})} className={`border-2 rounded-xl p-4 text-center cursor-pointer transition-colors ${newBus.serviceType === 'Standard' ? 'border-[#EA580C] bg-orange-50' : 'border-slate-200'}`}><Box className={`h-8 w-8 mx-auto mb-3 ${newBus.serviceType === 'Standard' ? 'text-[#EA580C]' : 'text-slate-400'}`}/><div className="text-[10px] font-black uppercase tracking-wider">Standard</div></div>
                               </div>

                               <label className="text-xs font-bold text-slate-700 block pt-4 uppercase tracking-widest">Price per Kg (₹)</label>
                               <input type="number" placeholder="₹" value={newBus.price} onChange={(e: any)=>setNewBus({...newBus, price:e.target.value})} className="w-full border border-slate-300 p-5 rounded-xl text-base font-bold outline-none focus:border-[#EA580C] shadow-inner" required/>
                               
                               <button type="submit" className="w-full bg-[#EA580C] text-white font-black p-5 rounded-xl hover:bg-orange-700 transition-colors shadow-xl mt-8 text-lg">Post Available Space</button>
                             </div>
                          </form>
                        ) : (
                          <form onSubmit={handlePostBus} className="space-y-6">
                             <h3 className="font-black text-3xl text-slate-900 border-b border-slate-100 pb-5 mb-8">Send Bus Parcel</h3>
                             <div className="space-y-5">
                               <label className="text-xs font-bold text-slate-700 block uppercase tracking-widest">Route (Origin - Destination)</label>
                               <input type="text" placeholder="e.g. Patna - Delhi" value={newBus.route} onChange={(e: any)=>setNewBus({...newBus, route:e.target.value})} className="w-full border border-slate-300 p-5 rounded-xl text-base font-bold outline-none focus:border-[#EA580C] shadow-inner" required/>
                               
                               <div className="grid grid-cols-2 gap-4">
                                 <div>
                                   <label className="text-xs font-bold text-slate-700 block pt-2 uppercase tracking-widest">Product Type</label>
                                   <input type="text" placeholder="e.g. Electronics" value={newBus.productType} onChange={(e: any)=>setNewBus({...newBus, productType:e.target.value})} className="w-full border border-slate-300 p-5 rounded-xl text-base font-bold outline-none focus:border-[#EA580C] shadow-inner" required/>
                                 </div>
                                 <div>
                                   <label className="text-xs font-bold text-slate-700 block pt-2 uppercase tracking-widest">Weight (KG)</label>
                                   <input type="number" placeholder="Total KG" value={newBus.weight} onChange={(e: any)=>setNewBus({...newBus, weight:e.target.value})} className="w-full border border-slate-300 p-5 rounded-xl text-base font-bold outline-none focus:border-[#EA580C] shadow-inner" required/>
                                 </div>
                               </div>

                               <label className="text-xs font-bold text-slate-700 block pt-4 uppercase tracking-widest">Select Service Type</label>
                               <div className="grid grid-cols-3 gap-4 mb-8">
                                  <div onClick={() => setNewBus({...newBus, serviceType: 'Fragile'})} className={`border-2 rounded-xl p-4 text-center cursor-pointer transition-colors ${newBus.serviceType === 'Fragile' ? 'border-[#EA580C] bg-orange-50' : 'border-slate-200'}`}><Package className={`h-8 w-8 mx-auto mb-3 ${newBus.serviceType === 'Fragile' ? 'text-[#EA580C]' : 'text-slate-400'}`}/><div className="text-[10px] font-black uppercase tracking-wider">Fragile</div></div>
                                  <div onClick={() => setNewBus({...newBus, serviceType: 'Express'})} className={`border-2 rounded-xl p-4 text-center cursor-pointer transition-colors ${newBus.serviceType === 'Express' ? 'border-[#EA580C] bg-orange-50' : 'border-slate-200'}`}><Truck className={`h-8 w-8 mx-auto mb-3 ${newBus.serviceType === 'Express' ? 'text-[#EA580C]' : 'text-slate-400'}`}/><div className="text-[10px] font-black uppercase tracking-wider">Express</div></div>
                                  <div onClick={() => setNewBus({...newBus, serviceType: 'Standard'})} className={`border-2 rounded-xl p-4 text-center cursor-pointer transition-colors ${newBus.serviceType === 'Standard' ? 'border-[#EA580C] bg-orange-50' : 'border-slate-200'}`}><Box className={`h-8 w-8 mx-auto mb-3 ${newBus.serviceType === 'Standard' ? 'text-[#EA580C]' : 'text-slate-400'}`}/><div className="text-[10px] font-black uppercase tracking-wider">Standard</div></div>
                               </div>

                               <label className="text-xs font-bold text-slate-700 block pt-4 uppercase tracking-widest">Offered Total Price (₹)</label>
                               <input type="number" placeholder="₹" value={newBus.price} onChange={(e: any)=>setNewBus({...newBus, price:e.target.value})} className="w-full border border-slate-300 p-5 rounded-xl text-base font-bold outline-none focus:border-[#EA580C] shadow-inner" required/>
                               
                               <button type="submit" className="w-full bg-[#0F172A] text-white font-black p-5 rounded-xl hover:bg-slate-800 transition-colors shadow-xl mt-8 text-lg">Post Parcel Demand</button>
                             </div>
                          </form>
                        )}
                      </div>
                      <div className="lg:col-span-2">
                        {renderLiveRadar()}
                      </div>
                   </div>
                 )}

                 {busTab === 'command_center' && renderLiveRadar()}
               </div>
             )}

             {/* MODULE: ENTERPRISE BIDS */}
             {activeModule === 'corporate' && (
               <div className="space-y-10 animate-fade-in">
                 <div className="bg-[#0F172A] text-white p-20 rounded-[2.5rem] text-center shadow-2xl relative overflow-hidden border border-slate-800">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#EA580C] rounded-full blur-[150px] opacity-20"></div>
                    <h2 className="text-6xl font-black mb-8 relative z-10 tracking-tight">Corporate Bidding & Reverse Auction</h2>
                    <p className="text-slate-300 font-medium text-xl relative z-10 max-w-3xl mx-auto leading-relaxed">Live bulk shipment auctions with real-time bidding for enterprise clients.</p>
                 </div>
                 
                 {selectedRole === 'corporate' && (
                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-xl flex flex-col md:flex-row gap-6 max-w-5xl mx-auto -mt-16 relative z-20">
                       <input type="text" placeholder="Demand (e.g. 50 Tons)" value={newBid.demand} onChange={(e: any)=>setNewBid({...newBid, demand:e.target.value})} className="flex-1 border border-slate-300 rounded-xl p-5 text-base font-bold outline-none focus:border-[#EA580C] shadow-inner" required/>
                       <input type="text" placeholder="Route (Origin-Dest)" value={newBid.route} onChange={(e: any)=>setNewBid({...newBid, route:e.target.value})} className="flex-1 border border-slate-300 rounded-xl p-5 text-base font-bold outline-none focus:border-[#EA580C] shadow-inner" required/>
                       <button type="button" onClick={handlePostBid} className="bg-[#EA580C] text-white px-12 py-5 rounded-xl font-black text-xl shadow-lg hover:bg-orange-700 transition-colors">List Auction</button>
                    </div>
                 )}

                 <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-xl mt-12">
                   <div className="p-8 border-b border-slate-200 bg-slate-50"><h3 className="font-black text-3xl text-slate-900">Active Auctions</h3></div>
                   <div className="overflow-x-auto">
                     <table className="w-full text-left border-collapse min-w-[900px]">
                       <thead className="bg-white border-b border-slate-200 text-xs font-black text-slate-500 uppercase tracking-widest">
                         <tr><th className="p-8 pl-10">ID & Company</th><th className="p-8">Route / Demand</th><th className="p-8">Time Left</th><th className="p-8">L1 (Lowest Bid)</th><th className="p-8 text-right pr-10">Action</th></tr>
                       </thead>
                       <tbody className="text-sm font-medium text-slate-700 divide-y divide-slate-100">
                         {safeBids.map((bid: any) => (
                           <tr key={bid.id} className="hover:bg-slate-50 transition-colors">
                             <td className="p-8 pl-10"><div className="font-black text-xl text-slate-900 mb-1">{bid.id}</div><div className="text-sm text-slate-500 font-bold">{bid.company}</div></td>
                             <td className="p-8"><div className="font-bold text-slate-900 text-lg">{bid.route}</div><div className="text-[10px] text-[#EA580C] font-black mt-2 bg-orange-50 border border-orange-100 w-fit px-3 py-1 rounded-full uppercase tracking-widest">{bid.demand}</div></td>
                             <td className="p-8 font-bold text-red-500 flex items-center mt-6 text-base"><Clock className="h-5 w-5 mr-2"/> {bid.time}</td>
                             <td className="p-8 font-black text-4xl text-slate-900">₹{bid.L1.toLocaleString('en-IN')}</td>
                             <td className="p-8 text-right pr-10"><button type="button" onClick={() => setNegotiationTarget({ type: 'bid', data: bid })} className="bg-[#0F172A] text-white px-10 py-4 rounded-xl text-sm font-black hover:bg-slate-800 transition-colors shadow-lg">View / Bid</button></td>
                           </tr>
                         ))}
                         {safeBids.length === 0 && <tr><td colSpan={5} className="p-16 text-center text-slate-500 font-bold text-lg">No active enterprise auctions.</td></tr>}
                       </tbody>
                     </table>
                   </div>
                 </div>
               </div>
             )}

             {/* MODULE: TRUCK ADS */}
             {activeModule === 'ads' && (
                <div className="space-y-16 animate-fade-in py-10 relative">
                   {(selectedRole === 'driver' || selectedRole === 'transporter') ? (
                      <div className="text-center py-24 bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-2xl max-w-5xl mx-auto px-10 relative">
                         {/* PREMIUM 3D DIGITAL MARKETING CARTOON */}
                         <img src="https://img.freepik.com/free-vector/digital-presentation-concept-illustration_114360-8451.jpg?w=800" className="mx-auto h-80 mb-10 object-contain drop-shadow-xl" alt="Digital Marketing Animated" />
                         <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 capitalize tracking-tight">Ad Platform Coming Soon</h2>
                         <p className="text-xl text-slate-500 font-medium mb-12 max-w-3xl mx-auto leading-relaxed">We are actively tying up with leading corporates to bring you exclusive bonus income through truck advertising. We will launch soon!</p>
                         <button type="button" className="bg-[#EA580C] text-white px-12 py-5 rounded-xl font-black text-xl shadow-xl hover:bg-orange-700 transition-colors">Wait For Launch</button>
                      </div>
                   ) : (
                      <>
                         <div className="bg-[#0F172A] rounded-[3rem] p-20 text-center text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-[#EA580C] rounded-full blur-[150px] opacity-30"></div>
                            <h2 className="text-6xl font-black mb-8 relative z-10 tracking-tight">Reach Millions On The Move</h2>
                            <p className="text-2xl text-slate-300 font-medium max-w-4xl mx-auto relative z-10 leading-relaxed">
                              Transform our extensive fleet network into your moving billboards. High visibility, low CPM, and route-targeted advertising across India.
                            </p>
                         </div>

                         <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                            {['Rear Door Panel', 'Full Side Wrap', 'Cabin Crown'].map((p: string, i: number) => (
                               <div key={p} className={`bg-white rounded-[2.5rem] border overflow-hidden shadow-xl p-10 text-center flex flex-col justify-between hover:border-[#EA580C] transition-all group relative ${i===1?'border-4 border-[#EA580C] transform lg:-translate-y-6 shadow-2xl':'border-slate-200'}`}>
                                 {i===1 && <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-[#EA580C] text-white text-[10px] font-black px-6 py-2 rounded-b-2xl uppercase tracking-widest shadow-md">Most Popular</div>}
                                 <div className="flex-1">
                                   <div className={`h-56 rounded-2xl mb-8 flex items-center justify-center border-2 border-dashed ${i===1?'bg-orange-50 border-orange-200':'bg-slate-50 border-slate-300'} mt-4`}><Truck className={`h-20 w-20 ${i===1?'text-[#EA580C]':'text-slate-400 group-hover:text-[#EA580C]'} transition-colors`}/></div>
                                   <h4 className="font-black text-3xl text-slate-900 mb-4">{t(p, p)}</h4>
                                   <p className="text-base text-slate-500 font-medium mb-10">Packages and placements vary according to requirement where they want placement and pay.</p>
                                 </div>
                                 <button type="button" onClick={() => openWhatsApp(`I want to place an ad: ${p}`)} className={`${i===1?'bg-[#EA580C]':'bg-[#0F172A]'} text-white px-8 py-5 rounded-xl font-black text-lg w-full hover:opacity-90 transition-opacity shadow-lg`}>Select Placement</button>
                               </div>
                            ))}
                         </div>

                         <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm mt-16">
                            <div className="text-center py-12 bg-slate-50 border-b border-slate-200"><h3 className="text-4xl font-black text-slate-900">Pricing & Packages</h3></div>
                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-lg min-w-[600px]">
                                 <thead className="bg-[#0F172A] text-white">
                                    <tr><th className="p-8 pl-12 font-bold uppercase tracking-widest text-sm">Vehicle Type</th><th className="p-8 font-bold uppercase tracking-widest text-sm">Placement</th><th className="p-8 font-bold uppercase tracking-widest text-sm">Base Price / Month</th></tr>
                                 </thead>
                                 <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                                    <tr className="hover:bg-slate-50 transition-colors"><td className="p-8 pl-12">Box Truck</td><td className="p-8">Rear Door</td><td className="p-8 font-black text-2xl text-[#EA580C]">₹15,000</td></tr>
                                    <tr className="hover:bg-slate-50 transition-colors"><td className="p-8 pl-12">Semi-Trailer</td><td className="p-8">Side Panel</td><td className="p-8 font-black text-2xl text-[#EA580C]">₹35,000</td></tr>
                                    <tr className="hover:bg-slate-50 transition-colors"><td className="p-8 pl-12">Full Container</td><td className="p-8">Full Wrap</td><td className="p-8 font-black text-2xl text-[#EA580C]">₹80,000</td></tr>
                                 </tbody>
                              </table>
                            </div>
                         </div>
                      </>
                   )}
                </div>
             )}
             
             {/* MODULE: FLEET MANDI */}
             {activeModule === 'mandi' && (
                <div className="space-y-12 animate-fade-in py-10 relative">
                  
                  <div className="text-center py-24 bg-white rounded-[3rem] border border-slate-200 overflow-hidden shadow-2xl max-w-5xl mx-auto px-10 relative">
                      {/* PREMIUM 3D E-COMMERCE CARTOON */}
                      <img src="https://img.freepik.com/free-vector/ecommerce-web-page-concept-illustration_114360-8204.jpg?w=800" className="mx-auto h-80 mb-10 object-contain drop-shadow-xl" alt="E-Commerce Animated" />
                      <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 capitalize tracking-tight">Marketplace Coming Soon</h2>
                      <p className="text-xl text-slate-500 font-medium mb-12 max-w-3xl mx-auto leading-relaxed">We are tying up with big fuel and tire companies to bring you massive group buying discounts. Wait for the official launch!</p>
                      <button type="button" className="bg-[#EA580C] text-white px-12 py-5 rounded-xl font-black text-xl shadow-xl hover:bg-orange-700 transition-colors">Wait For Launch</button>
                  </div>

                  <div className="flex flex-col md:flex-row justify-between items-center max-w-5xl mx-auto -mt-16 mb-16 p-8 bg-white border border-slate-200 rounded-3xl shadow-2xl gap-8 relative z-20">
                    <div className="flex items-center space-x-4">
                      <div className="bg-orange-50 p-4 rounded-full border border-orange-100"><ShoppingBag className="h-8 w-8 text-[#EA580C]"/></div>
                      <p className="text-2xl text-slate-900 font-black">List Your Products plz click this</p>
                    </div>
                    <button type="button" onClick={() => openWhatsApp('I want to list my products')} className="bg-[#0F172A] w-full md:w-auto text-white px-10 py-5 rounded-xl text-lg font-black hover:bg-slate-800 transition-colors shadow-lg flex items-center justify-center">Direct WhatsApp <ArrowRight className="h-5 w-5 ml-3"/></button>
                  </div>

                  {/* Pinduoduo clone UI - Marked as Preview */}
                  <div className="bg-[#0F172A] rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-2xl relative border border-slate-800 p-12 gap-10 opacity-40 select-none pointer-events-none">
                     <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 bg-black/80 px-10 py-5 rounded-2xl border border-slate-700 backdrop-blur-md">
                       <h2 className="text-white font-black text-3xl tracking-widest uppercase">Preview Only</h2>
                     </div>
                     <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1635767798638-3e2523d06eb1?auto=format&fit=crop&q=80&w=1200')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
                     <div className="md:w-2/3 relative z-10 flex flex-col justify-center">
                        <div className="bg-[#EA580C] text-white w-fit px-5 py-2 rounded-full text-xs font-black tracking-widest mb-6 shadow-md flex items-center"><Flame className="h-4 w-4 mr-2"/> HOT GROUP BUY</div>
                        <h2 className="text-5xl font-black text-white mb-6 leading-tight">Premium Synthetic Engine Oil Drum</h2>
                        <p className="text-slate-300 text-xl mb-10 font-medium max-w-2xl leading-relaxed">Join 450+ fleet owners to unlock wholesale pricing on our top-tier lubricant. Guaranteed protection for heavy-duty engines.</p>
                        <div className="flex items-center space-x-6">
                          <div className="text-5xl font-black text-[#EA580C]">₹12,499 <span className="text-xl text-slate-400 line-through">₹18,000</span></div>
                          <button type="button" className="bg-[#EA580C] text-white px-8 py-4 rounded-xl text-base font-black shadow-lg flex items-center">Team Up to Save <ArrowRight className="h-5 w-5 ml-3"/></button>
                        </div>
                     </div>
                     <div className="md:w-1/3 flex items-center justify-center relative z-10">
                         <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl w-full text-center">
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">DEAL ENDS IN</p>
                            <div className="flex justify-center space-x-4 mb-8">
                              <div className="bg-slate-100 px-5 py-4 rounded-xl font-black text-3xl">14<span className="block text-xs text-slate-400 mt-1">HRS</span></div>
                              <div className="text-3xl font-bold text-slate-300 pt-3">:</div>
                              <div className="bg-slate-100 px-5 py-4 rounded-xl font-black text-3xl">45<span className="block text-xs text-slate-400 mt-1">MIN</span></div>
                              <div className="text-3xl font-bold text-slate-300 pt-3">:</div>
                              <div className="bg-red-50 text-red-600 px-5 py-4 rounded-xl font-black text-3xl">22<span className="block text-xs text-red-400 mt-1">SEC</span></div>
                            </div>
                            <div className="flex justify-between text-sm font-bold mb-3"><span>450 / 500</span><span className="text-slate-500">Joined</span></div>
                            <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-6"><div className="bg-[#EA580C] w-[90%] h-full"></div></div>
                         </div>
                     </div>
                  </div>

                  <div className="flex justify-between items-center pt-8 border-t border-slate-200">
                    <h3 className="text-3xl font-black text-slate-900">Trending Deals</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 opacity-40 pointer-events-none select-none">
                    {mandiProducts.map((item: any) => (
                       <div key={item.id} className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-2xl transition-all group flex flex-col">
                          <div className="h-56 overflow-hidden relative bg-slate-100 p-4 flex items-center justify-center border-b border-slate-100">
                            <img src={item.img} className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500 shadow-md" alt="" />
                            <div className="absolute top-6 right-6 bg-white p-2.5 rounded-full shadow-lg"><ShoppingBag className="h-4 w-4 text-[#EA580C]"/></div>
                          </div>
                          <div className="p-8 flex-1 flex flex-col justify-between">
                             <div>
                               <h4 className="font-black text-xl text-slate-900 mb-2">{item.name}</h4>
                               <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6 border border-slate-200 w-fit px-2 py-1 rounded">{item.tag}</p>
                             </div>
                             <div>
                               <div className="flex justify-between items-end mb-6">
                                  <div><div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Price</div><div className="text-3xl font-black text-[#EA580C]">₹{item.price}</div></div>
                                  <div className="text-right text-xs font-black text-emerald-500 bg-emerald-50 px-2 py-1 rounded border border-emerald-100"><CheckCircle2 className="h-4 w-4 inline mr-1"/>{item.stock}</div>
                               </div>
                               <button type="button" className="w-full bg-[#0F172A] text-white px-4 py-4 rounded-xl text-sm font-black transition-colors shadow-lg">Buy Now</button>
                             </div>
                          </div>
                       </div>
                    ))}
                  </div>
                </div>
              )}

          </div>
        
    </>
  );
}
