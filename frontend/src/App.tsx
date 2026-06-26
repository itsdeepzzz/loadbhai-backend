// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { 
  Truck, User, ShieldCheck, MapPin, ArrowRight, 
  Bot, X, Upload, CheckCircle2, 
  Layers, HelpCircle, Radio, Menu, Crown, 
  History, LogOut, Settings, PhoneCall, 
  Info, Camera, Bus, ShoppingBag, Building, 
  AlertTriangle, Package, Clock, QrCode, TrendingDown, 
  Activity, ArrowLeft, ChevronDown, 
  Star, PlayCircle, Lock, Search, Flame, Eye, Box, Send, Plus, Check
} from 'lucide-react';

// --- TYPE DEFINITIONS ---
type Role = 'driver' | 'transporter' | 'trader' | 'corporate' | null;
type View = 'landing' | 'dashboard' | 'premium' | 'history' | 'support' | 'settings' | 'about' | 'services' | 'safe_qr' | 'feature_detail' | 'contact';
type ModuleTab = 'freight' | 'bus_cargo' | 'mandi' | 'ads' | 'corporate';
type ListingTab = 'all' | 'my_listings' | 'command_center';

// --- CONSTANTS & MOCK DATA ---
import AppHeader from './components/AppHeader';
import { sendOtp, verifyOtp, getLoads, createLoad } from './api';
import SupplementaryViews from './components/SupplementaryViews';
import DashboardView from './components/DashboardView';
import FeatureDetailView from './components/FeatureDetailView';
import LandingView from './components/LandingView';
import { parallelHeaders, platformFeatures, mandiProducts } from './constants';

export default function App() {
  // --- APP STATE ---
  const [activeView, setActiveView] = useState<View>('landing');
  const [activeModule, setActiveModule] = useState<ModuleTab>('freight');
  const [listingTab, setListingTab] = useState<ListingTab>('all');
  const [busTab, setBusTab] = useState<ListingTab>('all');
  const [selectedFeature, setSelectedFeature] = useState<any>(null);
  const [language, setLanguage] = useState<'en'|'hi'>('en'); 
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  const [demoText, setDemoText] = useState("");
  const [heroIdx, setHeroIdx] = useState(0);
  
  const [platformStats, setPlatformStats] = useState({ trucks: 0, parcels: 0, verified: 0, cities: 0 });

  const t = (en: string, hi: string) => language === 'en' ? en : hi;

  // --- AUTH STATE (Passwordless + Split Screen) ---
  const [authModal, setAuthModal] = useState<{ open: boolean; step: 'role' | 'auth_choice' | 'login_pass' | 'register_otp' | 'forgot_otp' | 'kyc' }>({ open: false, step: 'role' });
  const [selectedRole, setSelectedRole] = useState<Role>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [user, setUser] = useState<any>({ firstName: '', lastName: '', mobile: '', email: '', password: '', businessName: '', gst: '', dl: '', dp: '' });
  const [otpVal, setOtpVal] = useState('');

  // --- MODULE STATES ---
  const [bookingStep, setBookingStep] = useState<number>(1); 
  const [expandedListingId, setExpandedListingId] = useState<string | null>(null);
  const [safetyEnabled, setSafetyEnabled] = useState<boolean>(false);
  
  // Real-time Filters
  const [freightSearch, setFreightSearch] = useState('');
  const [freightCapacityFilter, setFreightCapacityFilter] = useState('');
  const [busSearch, setBusSearch] = useState('');
  const [busTypeFilter, setBusTypeFilter] = useState('');
  
  // Live Data Repositories
  const [driversList, setDriversList] = useState<any[]>([
    { id: 'TRK-1029', origin: 'Mumbai, MH', destination: 'Delhi, DL', capacity: '20', charges: 45000, type: 'Container', driverName: 'Rajesh Kumar', isMine: false, dp: '', truckImg: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=400' },
    { id: 'TRK-2022', origin: 'Chennai, TN', destination: 'Kolkata, WB', capacity: '16', charges: 38000, type: 'Open Body', driverName: 'Vikram Singh', isMine: false, dp: '', truckImg: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&q=80&w=400' }
  ]);
  const [loadsList, setLoadsList] = useState<any[]>([{ id: 'LOD-9921', origin: 'Patna, BR', destination: 'Kolkata, WB', weight: '15', targetPrice: 32000, material: 'Textiles', companyName: 'Vikas Traders', isMine: false }]);
  const [busSpaceList, setBusSpaceList] = useState<any[]>([
    { id: 'BUS-110', operator: 'Shatabdi Volvo', route: 'Delhi - Jaipur', capacity: '100 KG Space', price: 15, isMine: false, busImg: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400', serviceType: 'Express' },
    { id: 'BUS-215', operator: 'Govt Transport', route: 'Patna - Ranchi', capacity: '50 KG Space', price: 10, isMine: false, busImg: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=400', serviceType: 'Standard' }
  ]); 
  const [corporateBids, setCorporateBids] = useState<any[]>([
    { id: '#54321', company: 'Constry Materials', demand: '200 Ton', route: 'Patna - Ranchi', L1: 45000, time: '02h 45m 10s' }
  ]);
  
  // Forms
  const [newTruck, setNewTruck] = useState<any>({ origin: '', dest: '', capacity: '', charges: '', vehicleNumber: '' });
  const [newLoad, setNewLoad] = useState<any>({ material: '', weight: '', origin: '', destination: '', targetPrice: '' });
  const [newBus, setNewBus] = useState<any>({ route: '', serviceType: 'Standard', price: '', vehicleNumber: '', capacity: '', productType: '', weight: '' }); 
  const [newBid, setNewBid] = useState<any>({ demand: '', route: '', initialL1: '' });
  
  // Safe QR state
  const [qrDocs, setQrDocs] = useState<any>({ dl: false, rc: false, ins: false, permit: false });
  const [uploadedFiles, setUploadedFiles] = useState<any>({});
  const allDocsUploaded = qrDocs.dl && qrDocs.rc && qrDocs.ins && qrDocs.permit;

  const [negotiationTarget, setNegotiationTarget] = useState<any>(null);
  const [counterOffer, setCounterOffer] = useState<string>('');

  // --- REAL-TIME FEED FILTER LOGIC ---
  const safeLoads = Array.isArray(loadsList) ? loadsList : [];
  const safeDrivers = Array.isArray(driversList) ? driversList : [];
  const safeBids = Array.isArray(corporateBids) ? corporateBids : [];
  const safeBuses = Array.isArray(busSpaceList) ? busSpaceList : [];
  
  const combinedFeed = [...safeLoads, ...safeDrivers].filter((item: any) => {
    const originMatch = freightSearch === '' || (item.origin || item.currentLoc || '').toLowerCase().includes(freightSearch.toLowerCase());
    const destMatch = freightSearch === '' || (item.destination || item.destLoc || '').toLowerCase().includes(freightSearch.toLowerCase());
    if (freightSearch && !originMatch && !destMatch) return false;
    if (freightCapacityFilter && item.capacity !== freightCapacityFilter && item.weight !== freightCapacityFilter) return false;
    return listingTab === 'all' ? !item.isMine : item.isMine;
  });

  const filteredBusFeed = safeBuses.filter((item: any) => {
    if (busSearch && !(item.route || '').toLowerCase().includes(busSearch.toLowerCase())) return false;
    if (busTypeFilter && item.serviceType !== busTypeFilter) return false;
    return busTab === 'all' ? !item.isMine : item.isMine;
  });

  const myActiveItem = combinedFeed.find((i: any) => i.isMine) || safeBuses.find((i: any) => i.isMine);
  const originLabel = myActiveItem ? (myActiveItem.origin || myActiveItem.currentLoc || (myActiveItem.route ? myActiveItem.route.split('-')[0] : 'Origin')) : 'Origin';
  const destLabel = myActiveItem ? (myActiveItem.destination || myActiveItem.destLoc || (myActiveItem.route ? myActiveItem.route.split('-')[1] : 'Destination')) : 'Destination';

  // --- EFFECTS ---
  useEffect(() => { setBookingStep(1); }, [activeModule, selectedRole, listingTab, busTab]);

  useEffect(() => {
    const slideTimer = setInterval(() => { setHeroIdx((prev) => (prev + 1) % parallelHeaders.length); }, 5000);
    return () => clearInterval(slideTimer);
  }, []);

  useEffect(() => {
    if (showDemo) {
      const texts = ["Initializing AI Engine...", "Scanning identity...", "Connecting Radar Grid...", "Ready. Welcome to the future."];
      let i = 0; setDemoText(texts[0]);
      const int = setInterval(() => { i++; if (i < texts.length) setDemoText(texts[i]); else clearInterval(int); }, 2000);
      return () => clearInterval(int);
    }
  }, [showDemo]);

  // --- ACTIONS ---
  const handlePageChange = (view: View) => { setActiveView(view); window.scrollTo(0,0); setDrawerOpen(false); };

  const handleMobileSubmit = () => {
    if (user.mobile.length !== 10) return;
    if (user.mobile === '8210160012') {
      setAuthModal({ open: true, step: 'login_pass' });
    } else {
      setAuthModal({ open: true, step: 'register_otp' });
    }
  };

  const executeLogin = () => { setIsLoggedIn(true); setAuthModal({ open: false, step: 'role' }); handlePageChange('dashboard'); };
  const handleVerifyOtp = async () => {
    if (otpVal.length !== 4) return;
    try {
      const res = await verifyOtp(user.mobile, otpVal);
      if (res.verified) {
        if (authModal.step === 'forgot_otp') executeLogin();
        else setAuthModal({ open: true, step: 'kyc' });
      }
    } catch (err: any) {
      alert(err.error || "Galat OTP hai Bhai!");
    }
  };


  const handleLogout = () => { setIsLoggedIn(false); setUser({ firstName: '', lastName: '', mobile: '', email: '', password: '', businessName: '', gst: '', dl: '', dp: '' }); setSelectedRole(null); handlePageChange('landing'); };

  const handleProfilePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) setUser({ ...user, dp: URL.createObjectURL(e.target.files[0]) });
  };
  
  const handleFileUpload = (type: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
        setUploadedFiles({ ...uploadedFiles, [type]: e.target.files[0].name });
        if (type === 'dl') setQrDocs({...qrDocs, dl: true});
        if (type === 'rc') setQrDocs({...qrDocs, rc: true});
        if (type === 'ins') setQrDocs({...qrDocs, ins: true});
        if (type === 'permit') setQrDocs({...qrDocs, permit: true});
    }
  };

  const openWhatsApp = (msg: string) => { window.open(`https://wa.me/918210160012?text=${encodeURIComponent(msg)}`, '_blank'); };

  const processBid = () => {
     if (Number(counterOffer) >= (negotiationTarget?.data?.L1 || 0)) return alert(t("Bid must be lower than current L1 price!", "बोली वर्तमान L1 कीमत से कम होनी चाहिए!"));
     const updatedBids = corporateBids.map((b: any) => b.id === negotiationTarget?.data?.id ? { ...b, L1: Number(counterOffer) } : b);
     setCorporateBids(updatedBids); setNegotiationTarget(null); setCounterOffer('');
     alert(t("Bid Placed Successfully! You are now L1.", "बोली सफलतापूर्वक लगाई गई!"));
  };

  const handlePostTruck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTruck.origin) return;
    const created = { id: `TRK-${Math.floor(1000 + Math.random() * 9000)}`, driverName: user.firstName || 'Driver', phone: user.mobile, dp: user.dp, currentLoc: newTruck.origin, destLoc: newTruck.dest, capacity: newTruck.capacity || '16', charges: Number(newTruck.charges) || 50000, status: 'Booked', type: 'Open Body', isMine: true, truckImg: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&q=80&w=400' };
    setDriversList([created, ...driversList]); setPlatformStats((prev: any) => ({...prev, trucks: prev.trucks + 1, cities: prev.cities + 2})); setListingTab('my_listings'); setNewTruck({ origin: '', dest: '', capacity: '', charges: '', vehicleNumber: '' }); setBookingStep(1);
  };

  const handlePostLoad = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLoad.origin) return;
    const loadPayload = { id: `LOD-${Date.now()}`, companyName: user.businessName || `${user.firstName}'s Enterprise`, phone: user.mobile, dp: user.dp, material: newLoad.material, weight: newLoad.weight, origin: newLoad.origin, destination: newLoad.destination, targetPrice: Number(newLoad.targetPrice), status: 'Booked', isMine: true };
    setLoadsList([loadPayload, ...loadsList]); setPlatformStats((prev: any) => ({...prev, parcels: prev.parcels + 1, cities: prev.cities + 2})); setListingTab('my_listings'); setNewLoad({ material: '', weight: '', origin: '', destination: '', targetPrice: '' }); setBookingStep(1);
  };

  const handlePostBus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBus.route) return alert(t("Please enter Route.", "कृपया रूट डालें।"));
    const isDriver = selectedRole === 'driver' || selectedRole === 'transporter';
    const capacityText = isDriver ? `${newBus.capacity} Space` : `${newBus.productType} (${newBus.weight} KG)`;
    
    const busPayload = { 
      id: `BUS-${Math.floor(Math.random() * 9000)}`, 
      operator: user.businessName || user.firstName || 'Travels', 
      phone: user.mobile, 
      dp: user.dp, 
      route: newBus.route, 
      capacity: capacityText, 
      price: Number(newBus.price) || 500, 
      isMine: true, 
      serviceType: newBus.serviceType || 'Standard', 
      busImg: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400' 
    };
    setBusSpaceList([busPayload, ...busSpaceList]); setNewBus({ route: '', serviceType: 'Standard', price: '', vehicleNumber: '', capacity: '', productType: '', weight: '' }); setBusTab('my_listings'); setBookingStep(1);
  };

  const handlePostBid = (e: React.FormEvent) => {
    e.preventDefault();
    if(!newBid.demand) return;
    const created = { id: `#${Math.floor(10000 + Math.random() * 90000)}`, company: user.businessName || 'Corporate', demand: newBid.demand, route: newBid.route, L1: Number(newBid.initialL1) || 50000, time: '7 Days Left', l1Holder: 'Awaiting Bids' };
    setCorporateBids([created, ...corporateBids]); setNewBid({ demand: '', route: '', initialL1: '' });
  };

  const handleKycSubmit = () => {
    if(!user.firstName) return alert("Required fields missing!");
    setUser({ ...user, isVerified: true }); 
    setPlatformStats((prev: any) => ({...prev, verified: prev.verified + 1}));
    executeLogin();
  };

  // --- REUSABLE COMPONENTS ---
  const BackToDashboardBtn = () => (
    <div className="mb-8 w-full max-w-[1600px] mx-auto px-4 sm:px-8 relative z-20 text-left">
      <button type="button" onClick={() => handlePageChange(isLoggedIn ? 'dashboard' : 'landing')} className="flex items-center text-[#EA580C] font-black bg-[#0F172A] px-6 py-3 rounded-xl shadow-xl w-fit group hover:bg-black transition-all border border-slate-800">
        <ArrowLeft className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" /> {t("Back to Main Screen", "मुख्य स्क्रीन पर वापस")}
      </button>
    </div>
  );

  const LayeredStepIndicator = () => (
    <div className="flex items-center justify-center space-x-2 sm:space-x-4 mb-8 max-w-lg mx-auto">
      <div className={`flex items-center ${bookingStep >= 1 ? 'text-[#EA580C] font-black' : 'text-slate-400 font-medium'}`}><span className={`h-8 w-8 rounded-full flex items-center justify-center text-sm mr-2 ${bookingStep >= 1 ? 'bg-[#EA580C] text-white shadow-md' : 'bg-slate-100'}`}>1</span><span className="text-sm">Location</span></div>
      <div className={`h-0.5 w-8 sm:w-16 ${bookingStep >= 2 ? 'bg-[#EA580C]' : 'bg-slate-200'}`}></div>
      <div className={`flex items-center ${bookingStep >= 2 ? 'text-[#EA580C] font-black' : 'text-slate-400 font-medium'}`}><span className={`h-8 w-8 rounded-full flex items-center justify-center text-sm mr-2 ${bookingStep >= 2 ? 'bg-[#EA580C] text-white shadow-md' : 'bg-slate-100'}`}>2</span><span className="text-sm">Details</span></div>
      <div className={`h-0.5 w-8 sm:w-16 ${bookingStep >= 3 ? 'bg-[#EA580C]' : 'bg-slate-200'}`}></div>
      <div className={`flex items-center ${bookingStep >= 3 ? 'text-[#EA580C] font-black' : 'text-slate-400 font-medium'}`}><span className={`h-8 w-8 rounded-full flex items-center justify-center text-sm mr-2 ${bookingStep >= 3 ? 'bg-[#EA580C] text-white shadow-md' : 'bg-slate-100'}`}>3</span><span className="text-sm">Confirm</span></div>
    </div>
  );

  const renderLiveRadar = () => (
    <div className="w-full bg-[#0F172A] border border-slate-800 rounded-[2rem] p-8 shadow-2xl animate-fade-in mt-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#EA580C] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
      <div className="flex justify-between items-center mb-8 relative z-10">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center"><MapPin className="h-6 w-6 text-[#EA580C] mr-2" /> Live Command Radar</h2>
          <p className="text-sm text-slate-400 mt-1 font-medium">Real-time GPS positioning on Grid</p>
        </div>
        <button type="button" onClick={() => setSafetyEnabled(!safetyEnabled)} className={`px-6 py-2.5 rounded-xl text-xs font-black transition-all shadow-lg ${safetyEnabled ? 'bg-red-500 text-white shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}>
          <AlertTriangle className="h-4 w-4 inline mr-2"/> Road Safety: {safetyEnabled ? 'ON' : 'OFF'}
        </button>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-8 relative z-10">
        <div className="flex-[2] relative rounded-[1.5rem] overflow-hidden bg-[#000000] shadow-inner border border-slate-800 h-[450px]">
           {safetyEnabled && (
             <div className="absolute inset-0 z-30 bg-black/90 backdrop-blur-md p-8 flex flex-col items-center justify-center text-center">
                <AlertTriangle className="h-20 w-20 text-red-500 mb-6 animate-pulse drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
                <h3 className="text-4xl font-black text-red-500 mb-4 tracking-tight">High Risk Zone</h3>
                <p className="text-slate-300 text-lg font-bold mb-8">Alert on route to {destLabel}. 3 Fatal Accidents in 48 Hrs.<br/>Foggy conditions ahead.</p>
                <button type="button" onClick={() => setSafetyEnabled(false)} className="bg-red-600 text-white px-10 py-4 rounded-xl text-base font-black hover:bg-red-700 shadow-xl">Acknowledge</button>
             </div>
           )}

           <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
             <div className="border border-teal-500/20 rounded-full w-[100%] h-[100%] absolute animate-ping" style={{animationDuration: '4s'}}></div>
             <div className="border border-teal-500/30 rounded-full w-[70%] h-[70%] absolute"></div>
             <div className="border border-teal-500/50 rounded-full w-[40%] h-[40%] absolute"></div>
             <div className="w-4 h-4 bg-[#EA580C] rounded-full absolute shadow-[0_0_20px_#EA580C]"></div>
             
             {myActiveItem ? (
               <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none" viewBox="0 0 800 600">
                   <path d="M 200 300 Q 400 100 600 300" fill="transparent" stroke="#EA580C" strokeWidth="2" strokeDasharray="6 6" className="animate-pulse opacity-60" />
                   <circle cx="200" cy="300" r="8" fill="#EA580C" />
                   <text x="170" y="330" fill="#94A3B8" fontSize="14" fontWeight="bold">{originLabel}</text>
                   <circle cx="600" cy="300" r="8" fill="#EA580C" className="animate-ping" />
                   <circle cx="600" cy="300" r="6" fill="#EA580C" />
                   <text x="570" y="330" fill="#94A3B8" fontSize="14" fontWeight="bold">{destLabel}</text>
                   <g className="animate-truck-move-dynamic">
                      <rect x="-20" y="-10" width="40" height="20" fill="#EA580C" rx="4" />
                   </g>
               </svg>
             ) : (
               <div className="text-slate-500 font-bold z-10 bg-slate-900/80 px-6 py-3 rounded-xl border border-slate-800">Scanning active fleet grid...</div>
             )}
           </div>

           {myActiveItem && (
             <div className="absolute top-6 left-6 bg-slate-900/90 backdrop-blur p-5 rounded-2xl border border-slate-700 w-80 z-20 shadow-2xl">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Active Trip Telemetry</h4>
               <div className="flex justify-between items-center mb-3">
                 <span className="font-black text-white truncate max-w-[40%] text-base">{originLabel}</span>
                 <ArrowRight className="h-5 w-5 text-slate-500" />
                 <span className="font-black text-white truncate max-w-[40%] text-base">{destLabel}</span>
               </div>
               <div className="text-[10px] text-teal-400 font-black flex items-center mt-4 bg-teal-500/10 w-fit px-3 py-1.5 rounded-lg border border-teal-500/20">
                 <Radio className="h-4 w-4 mr-2 animate-pulse" /> GPS Connection Active
               </div>
             </div>
           )}
        </div>

        <div className="flex-1 flex flex-col gap-6">
           <div className="bg-black p-8 rounded-[1.5rem] border border-slate-800 shadow-inner flex-1">
              <h4 className="text-white font-black text-base mb-8">Tracking Timeline</h4>
              <div className="relative border-l-2 border-slate-800 ml-5 space-y-10 pb-4">
                 <div className="relative">
                   <div className="absolute -left-[25px] bg-black p-1"><CheckCircle2 className="h-6 w-6 text-emerald-500" /></div>
                   <div className="pl-6">
                     <h4 className="font-black text-white text-base">Booked</h4>
                     <p className="text-xs text-slate-500 font-bold">Order Confirmed</p>
                   </div>
                 </div>
                 <div className="relative">
                   <div className="absolute -left-[25px] bg-black p-1"><Truck className="h-6 w-6 text-[#EA580C]" /></div>
                   <div className="pl-6">
                     <h4 className="font-black text-white text-base">Picked Up</h4>
                     <p className="text-xs text-slate-500 font-bold">Package Loaded</p>
                   </div>
                 </div>
                 <div className="relative">
                   <div className="absolute -left-[25px] bg-black p-1"><Radio className="h-6 w-6 text-teal-400 animate-pulse" /></div>
                   <div className="pl-6">
                     <h4 className="font-black text-teal-400 text-base">In Transit</h4>
                     <p className="text-xs text-slate-500 font-bold">Current Location</p>
                   </div>
                 </div>
                 <div className="relative">
                   <div className="absolute -left-[25px] bg-black p-1"><Package className="h-6 w-6 text-slate-700" /></div>
                   <div className="pl-6 bg-slate-900 p-4 rounded-xl border border-slate-800">
                     <h4 className="font-black text-slate-400 text-base">Shipped</h4>
                     <p className="text-xs text-slate-600 font-bold">Pending Arrival</p>
                   </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-[#EA580C] selection:text-white flex flex-col overflow-x-hidden relative">
      
      {/* 🇮🇳 REAL INDIA MAP WATERMARK (No Text, Just the SVG Outline) */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[#0F172A] opacity-5"></div>
        <img 
           src="https://upload.wikimedia.org/wikipedia/commons/b/b4/Outline_Map_of_India.svg" 
           alt="" 
           className="w-[90%] max-w-5xl h-auto opacity-[0.06] filter drop-shadow-[0_20px_50px_rgba(0,0,0,0.2)] mix-blend-multiply"
        />
      </div>

      {/* --- HEADER --- */}
      <AppHeader 
        handlePageChange={handlePageChange}
        activeView={activeView}
        t={t}
        language={language}
        setLanguage={setLanguage}
        isLoggedIn={isLoggedIn}
        user={user}
        setDrawerOpen={setDrawerOpen}
        setAuthModal={setAuthModal}
      />

      {/* --- DRAWER (Profile & Settings) --- */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[150] flex">
          <div className="absolute inset-0 bg-[#0F172A]/80 backdrop-blur-sm" onClick={() => setDrawerOpen(false)}></div>
          <div className="relative w-80 bg-white h-full shadow-2xl flex flex-col animate-fade-in-right z-50 border-l border-slate-100">
            {isLoggedIn ? (
              <>
                <div className="p-10 border-b border-slate-100 flex flex-col items-center bg-slate-50 relative">
                   <button type="button" onClick={() => setDrawerOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 bg-white p-2 rounded-lg border shadow-sm"><X className="h-5 w-5"/></button>
                   <label className="h-28 w-28 rounded-full bg-slate-200 mb-4 border-4 border-[#0F172A] flex items-center justify-center overflow-hidden cursor-pointer group relative shadow-inner">
                     {user.dp ? <img src={user.dp} className="h-full w-full object-cover" alt=""/> : <User className="h-12 w-12 text-slate-400"/>}
                     <div className="absolute inset-0 bg-black/60 hidden group-hover:flex items-center justify-center"><Camera className="h-8 w-8 text-white"/></div>
                     <input type="file" className="hidden" onChange={handleProfilePicUpload} accept="image/*"/>
                   </label>
                   <h3 className="font-black text-2xl text-slate-900">{user.firstName || 'Partner'}</h3>
                   <span className="text-xs font-black bg-[#EA580C] text-white px-4 py-1.5 rounded-full uppercase mt-2.5 shadow-md tracking-widest">{selectedRole}</span>
                </div>
                <div className="flex-1 overflow-y-auto p-5 space-y-2.5">
                   {[
                       {i: Layers, l: 'My Dashboard', v: 'dashboard'},
                       {i: History, l: 'Order History', v: 'history'},
                       {i: QrCode, l: 'Security QR', v: 'safe_qr', s: 'Free'},
                       {i: Crown, l: 'Subscriptions', v: 'premium'},
                       {i: Activity, l: 'Services Hub', v: 'services'},
                       {i: Info, l: 'About Us', v: 'about'},
                       {i: HelpCircle, l: 'Help Center', v: 'contact'},
                       {i: Settings, l: 'Settings', v: 'settings'},
                   ].map((item: any) => (
                       <button type="button" key={item.l} onClick={() => { setDrawerOpen(false); handlePageChange(item.v as View); }} className="w-full flex items-center p-4 text-sm font-black text-slate-700 hover:bg-orange-50 rounded-xl transition-colors group border border-transparent hover:border-orange-100">
                           <item.i className={`h-5 w-5 mr-4 ${item.v === 'dashboard' ? 'text-[#0F172A]' : 'text-slate-400 group-hover:text-[#EA580C]'}`}/> 
                           {item.l}
                           {item.s && <span className="ml-auto bg-emerald-100 text-emerald-600 text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-wider">{item.s}</span>}
                       </button>
                   ))}
                </div>
                <div className="p-8 border-t border-slate-100 bg-slate-50">
                   <button type="button" onClick={handleLogout} className="w-full bg-red-50 text-red-600 p-4 rounded-xl text-sm font-black hover:bg-red-100 transition-colors flex justify-center items-center border border-red-100 shadow-sm"><LogOut className="h-5 w-5 mr-3"/> Sign Out</button>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-10 text-center space-y-6">
                 <button type="button" onClick={() => setDrawerOpen(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 bg-white p-2 rounded-lg border shadow-sm"><X className="h-5 w-5"/></button>
                 <Lock className="h-20 w-20 text-slate-300"/>
                 <h3 className="text-3xl font-black text-slate-900">Please Login</h3>
                 <p className="text-base text-slate-500 font-medium">Access features by joining the network.</p>
                 <button type="button" onClick={() => { setDrawerOpen(false); setAuthModal({open: true, step: 'role'}); }} className="bg-[#EA580C] text-white px-10 py-4 rounded-xl font-black text-lg w-full mt-4 shadow-xl hover:bg-orange-700 transition-colors">Login Now</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- AUTH MODAL --- */}
      {authModal.open && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-[#0F172A]/90 backdrop-blur-md animate-fade-in pointer-events-auto">
          <div className="w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl flex overflow-hidden h-[550px] border border-slate-200 relative">
            <div className="hidden md:flex w-1/2 relative bg-[#0F172A] flex-col justify-end p-12">
               <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1586528116311-ad8ed7b66bfc?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center opacity-40 mix-blend-overlay"></div>
               <div className="relative z-10">
                  <h2 className="text-white text-4xl font-black mb-4 leading-tight">Powering the Future of Logistics.</h2>
                  <p className="text-slate-300 text-base font-medium">Seamlessly connect and manage your operations.</p>
               </div>
            </div>
            <div className="w-full md:w-1/2 p-8 sm:p-12 relative flex flex-col justify-center bg-white pointer-events-auto">
              <button type="button" onClick={() => setAuthModal({ ...authModal, open: false })} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 bg-slate-50 p-2 rounded-xl border z-50"><X className="h-5 w-5" /></button>
              
              {authModal.step === 'role' && (
                <div className="space-y-8 animate-fade-in text-center relative z-20">
                  <h3 className="text-3xl font-black text-slate-900">Select Identity</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { role: 'driver', label: 'Driver' },
                      { role: 'transporter', label: 'Transporter' },
                      { role: 'trader', label: 'Trader' },
                      { role: 'corporate', label: 'Corporate' }
                    ].map((r: any) => (
                      <button type="button" key={r.role} onClick={() => { setSelectedRole(r.role as Role); setAuthModal({ open: true, step: 'auth_choice' }); }} className="p-5 rounded-xl border border-slate-200 bg-white hover:border-[#EA580C] hover:shadow-md transition-all font-black text-slate-700 text-sm shadow-sm hover:text-[#EA580C]">
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {authModal.step === 'auth_choice' && (
                <div className="space-y-8 animate-fade-in text-center relative z-20">
                  <div className="flex justify-center mb-6"><div className="bg-orange-50 p-5 rounded-full border border-orange-100 shadow-inner"><Lock className="h-10 w-10 text-[#EA580C]"/></div></div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight">Login / Register</h3>
                  <p className="text-xs text-slate-500 font-bold uppercase tracking-widest border border-slate-200 w-fit mx-auto px-4 py-1.5 rounded-full shadow-sm">Role: <span className="text-[#EA580C]">{selectedRole}</span></p>
                  <input type="tel" maxLength={10} value={user.mobile} onChange={(e: any) => setUser({...user, mobile: e.target.value.replace(/\D/g,'')})} placeholder="10-Digit Mobile Number" className="w-full border-2 border-slate-200 rounded-xl p-4 text-center text-xl font-black outline-none focus:border-[#EA580C] shadow-inner" />
                  <div className="flex flex-col gap-4 pt-2">
                    <button type="button" onClick={handleMobileSubmit} disabled={user.mobile.length !== 10} className="w-full bg-[#EA580C] disabled:bg-slate-300 text-white font-black py-4 rounded-xl transition-colors shadow-lg hover:bg-orange-700 text-lg">Continue Securely</button>
                  </div>
                </div>
              )}
              {authModal.step === 'login_pass' && (
                 <div className="space-y-6 animate-fade-in text-center relative z-20">
                   <h3 className="text-3xl font-black text-slate-900">Welcome Back</h3>
                   <p className="text-sm font-bold text-slate-600 bg-slate-50 py-3 rounded-xl border border-slate-100 tracking-widest mb-6">{user.mobile}</p>
                   <div className="text-left space-y-2">
                      <label className="text-xs font-bold text-slate-600">Password</label>
                      <input type="password" value={user.password} onChange={(e: any) => setUser({...user, password: e.target.value})} placeholder="Enter Password" className="w-full border-2 border-slate-200 rounded-xl p-4 text-center text-xl font-bold outline-none focus:border-[#EA580C] shadow-inner" />
                   </div>
                   <button type="button" onClick={executeLogin} disabled={!user.password} className="w-full bg-[#0F172A] disabled:bg-slate-300 text-white font-black py-4 rounded-xl shadow-lg mt-4 hover:bg-slate-800 text-lg transition-colors">Sign In</button>
                   <div className="text-sm text-[#EA580C] font-bold cursor-pointer mt-6 hover:underline" onClick={() => setAuthModal({ open: true, step: 'forgot_otp' })}>Forgot Password?</div>
                 </div>
              )}
              {(authModal.step === 'register_otp' || authModal.step === 'forgot_otp') && (
                <div className="space-y-6 animate-fade-in text-center relative z-20">
                  <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">{authModal.step === 'forgot_otp' ? 'Reset via OTP' : 'Verify Number'}</h3>
                  <p className="text-xs text-slate-500 font-bold bg-slate-50 py-3 rounded-xl border border-slate-100 tracking-widest mb-6">OTP sent to {user.mobile}</p>
                  <input type="text" maxLength={4} value={otpVal} onChange={(e: any) => setOtpVal(e.target.value.replace(/\D/g,''))} placeholder="XXXX" className="w-full border-2 border-slate-200 rounded-xl p-4 text-center text-4xl tracking-[0.5em] font-black outline-none focus:border-[#EA580C] shadow-inner mt-4" />
                  <button type="button" onClick={handleVerifyOtp} disabled={otpVal.length !== 4} className="w-full bg-[#EA580C] disabled:bg-slate-300 text-white font-black py-4 rounded-xl shadow-lg mt-6 transition-colors text-base">Verify Secure Code</button>
                </div>
              )}
              {authModal.step === 'kyc' && (
                <div className="space-y-5 animate-fade-in overflow-y-auto max-h-full pb-4 pr-2 relative z-20">
                  <h3 className="text-2xl font-black text-slate-900 text-center border-b border-slate-100 pb-4 mb-6">Complete Profile Setup</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="First Name" value={user.firstName} onChange={(e: any)=>setUser({...user, firstName: e.target.value})} className="w-full border border-slate-300 rounded-xl p-3 text-sm font-bold outline-none focus:border-[#EA580C] shadow-inner"/>
                    <input type="text" placeholder="Last Name" value={user.lastName} onChange={(e: any)=>setUser({...user, lastName: e.target.value})} className="w-full border border-slate-300 rounded-xl p-3 text-sm font-bold outline-none focus:border-[#EA580C] shadow-inner"/>
                  </div>
                  {(selectedRole === 'trader' || selectedRole === 'corporate' || selectedRole === 'transporter') && (
                    <div className="space-y-4">
                      <input type="text" placeholder="Business / Company Name" value={user.businessName} onChange={(e: any)=>setUser({...user, businessName: e.target.value})} className="w-full border border-slate-300 rounded-xl p-3 text-sm font-bold outline-none focus:border-[#EA580C] shadow-inner"/>
                      <input type="text" placeholder="GSTIN Number (Mandatory)" value={user.gst} onChange={(e: any)=>setUser({...user, gst: e.target.value})} className="w-full border border-slate-300 rounded-xl p-3 text-sm font-bold outline-none focus:border-[#EA580C] shadow-inner"/>
                    </div>
                  )}
                  {selectedRole === 'driver' && (
                    <input type="text" placeholder="Driving License Number" value={user.dl} onChange={(e: any)=>setUser({...user, dl: e.target.value})} className="w-full border border-slate-300 rounded-xl p-3 text-sm font-bold outline-none focus:border-[#EA580C] shadow-inner"/>
                  )}
                  <label className="border-2 border-dashed border-slate-300 bg-slate-50 p-4 rounded-xl flex flex-col items-center cursor-pointer hover:bg-slate-100 transition-colors">
                    <Upload className="h-5 w-5 text-slate-400 mb-1" />
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Upload PAN/Aadhaar</span>
                    <input type="file" className="hidden" onChange={(e: any) => handleFileUpload('aadhaar', e)} />
                  </label>
                  <input type="password" placeholder="Set a Secure Password" value={user.password} onChange={(e: any)=>setUser({...user, password: e.target.value})} className="w-full border border-slate-300 rounded-xl p-3 text-sm font-bold outline-none focus:border-[#EA580C] shadow-inner mt-4"/>
                  <button type="button" onClick={handleKycSubmit} className="w-full bg-[#0F172A] text-white font-black py-4 rounded-xl shadow-lg mt-6 hover:bg-slate-800 transition-colors text-base">Initialize Account</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* --- DEMO OVERLAY --- */}
      {showDemo && (
        <div className="fixed inset-0 z-[400] bg-[#0F172A]/95 flex flex-col items-center justify-center p-6 backdrop-blur-md pointer-events-auto">
           <button type="button" onClick={() => setShowDemo(false)} className="absolute top-8 right-8 text-white hover:text-[#EA580C] z-50"><X className="h-10 w-10"/></button>
           <Bot className="h-32 w-32 text-[#EA580C] mb-8 animate-bounce drop-shadow-[0_0_20px_rgba(234,88,12,0.6)]" />
           <div className="h-16 flex items-center justify-center">
             <h2 className="text-2xl md:text-5xl font-mono text-white font-black border-r-4 border-[#EA580C] pr-3 animate-pulse">{demoText}</h2>
           </div>
           <div className="mt-16 max-w-2xl text-center space-y-8">
              <p className="text-slate-300 text-xl font-medium leading-relaxed">This AI engine matches drivers and loads in real-time, eliminating empty returns and reducing carbon footprints based on your identity profile.</p>
              <button type="button" onClick={() => setShowDemo(false)} className="bg-[#EA580C] text-white px-12 py-5 rounded-2xl font-black text-xl shadow-[0_0_30px_rgba(234,88,12,0.4)] hover:bg-orange-700 transition-colors">End Demo Simulation</button>
           </div>
        </div>
      )}

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 w-full relative z-10">
        
        {/* LANDING VIEW */}
        {activeView === 'landing' && (
          <LandingView 
            t={t} 
            platformStats={platformStats}
            setSelectedRole={setSelectedRole}
            setAuthModal={setAuthModal}
            setShowDemo={setShowDemo}
            handlePageChange={handlePageChange}
            heroIdx={heroIdx}
            setHeroIdx={setHeroIdx}
            setSelectedFeature={setSelectedFeature}
          />
        )}

        {/* FEATURE DETAIL PAGE */}
        {activeView === 'feature_detail' && selectedFeature && (
          <FeatureDetailView 
            selectedFeature={selectedFeature}
            handlePageChange={handlePageChange}
            setAuthModal={setAuthModal}
          />
        )}

        {/* LOGGED IN DASHBOARD MODULES */}
        {isLoggedIn && activeView === 'dashboard' && (
          <DashboardView 
            activeModule={activeModule} setActiveModule={setActiveModule}
            listingTab={listingTab} setListingTab={setListingTab}
            busTab={busTab} setBusTab={setBusTab}
            bookingStep={bookingStep} setBookingStep={setBookingStep}
            freightSearch={freightSearch} setFreightSearch={setFreightSearch}
            busSearch={busSearch} setBusSearch={setBusSearch}
            combinedFeed={combinedFeed} filteredBusFeed={filteredBusFeed} corporateBids={corporateBids}
            user={user} selectedRole={selectedRole} t={t}
            LayeredStepIndicator={LayeredStepIndicator} renderLiveRadar={renderLiveRadar}
            newTruck={newTruck} setNewTruck={setNewTruck} handlePostTruck={handlePostTruck}
            newLoad={newLoad} setNewLoad={setNewLoad} handlePostLoad={handlePostLoad}
            newBus={newBus} setNewBus={setNewBus} handlePostBus={handlePostBus}
            newBid={newBid} setNewBid={setNewBid} handlePostBid={handlePostBid}
            expandedListingId={expandedListingId} setExpandedListingId={setExpandedListingId}
            negotiationTarget={negotiationTarget} setNegotiationTarget={setNegotiationTarget}
            counterOffer={counterOffer} setCounterOffer={setCounterOffer} processBid={processBid} openWhatsApp={openWhatsApp}
          />
        )}
        
        {/* --- SUPPLEMENTARY PAGES --- */}
        <SupplementaryViews 
            activeView={activeView}
            handlePageChange={handlePageChange}
            BackToDashboardBtn={BackToDashboardBtn}
            t={t}
            isLoggedIn={isLoggedIn}
            user={user}
            setAuthModal={setAuthModal}
            uploadedFiles={uploadedFiles}
            handleFileUpload={handleFileUpload}
            qrDocs={qrDocs}
            allDocsUploaded={allDocsUploaded} setQrDocs={setQrDocs} negotiationTarget={negotiationTarget} setNegotiationTarget={setNegotiationTarget} counterOffer={counterOffer} setCounterOffer={setCounterOffer} processBid={processBid}
        />
        
        </main>

      {/* --- MEGA FOOTER --- */}
      <footer className="bg-[#0B1120] text-slate-400 py-20 px-6 relative z-10 border-t-4 border-[#EA580C] mt-24">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => handlePageChange('landing')}>
              <Truck className="h-10 w-10 text-[#EA580C]" />
              <span className="text-3xl font-black text-white tracking-tight">Load<span className="text-[#EA580C]">Bhai</span></span>
            </div>
            <p className="text-sm font-medium leading-relaxed">Empowering Transporters. Pure Profits. India's Logistics Backbone built for scale and transparency.</p>
            <div className="flex space-x-4 pt-2">
              <span className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white cursor-pointer hover:bg-[#EA580C] transition-all hover:scale-110 font-bold">f</span>
              <span className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white cursor-pointer hover:bg-[#EA580C] transition-all hover:scale-110 font-bold">in</span>
              <span className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white cursor-pointer hover:bg-[#EA580C] transition-all hover:scale-110 font-bold">X</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-black mb-8 text-xl tracking-wide">Company</h4>
            <ul className="space-y-5 text-base font-medium">
              <li><button type="button" onClick={() => handlePageChange('about')} className="hover:text-[#EA580C] transition-colors">About Us</button></li>
              <li><button type="button" onClick={() => handlePageChange('support')} className="hover:text-[#EA580C] transition-colors">Contact Support</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-black mb-8 text-xl tracking-wide">Platform</h4>
            <ul className="space-y-5 text-base font-medium">
              <li><button type="button" onClick={() => handlePageChange('premium')} className="hover:text-[#EA580C] transition-colors">Pricing Plans</button></li>
              <li><button type="button" onClick={() => handlePageChange('services')} className="hover:text-[#EA580C] transition-colors">Services Hub</button></li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-white font-black mb-8 text-xl tracking-wide">Newsletter</h4>
            <div className="flex border-2 border-slate-800 rounded-2xl overflow-hidden focus-within:border-[#EA580C] transition-colors bg-black/50 p-1">
              <input type="email" placeholder="Enter Email Address" className="bg-transparent px-6 py-4 text-base outline-none w-full text-white font-medium" />
              <button type="button" className="bg-[#EA580C] text-white px-8 text-sm font-black rounded-xl hover:bg-orange-700 transition-colors shadow-lg">Subscribe</button>
            </div>
          </div>
        </div>
        
        <div className="max-w-[1400px] mx-auto mt-20 pt-10 border-t border-slate-800/50 text-sm flex flex-col md:flex-row justify-between items-center text-slate-500 font-bold">
          <p>LoadBhai Logistics Tech © {new Date().getFullYear()} All rights reserved.</p>
          <div className="flex space-x-8 mt-6 md:mt-0">
             <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
             <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes headerFade { 
          0%, 15% { opacity: 1; transform: translateY(0); } 
          20%, 100% { opacity: 0; transform: translateY(-20px); } 
        }
        @keyframes ken-burns {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        .animate-ken-burns {
          animation: ken-burns 30s ease-in-out infinite alternate;
        }
        @keyframes marquee { 0% { transform: translateX(0%); } 100% { transform: translateX(-50%); } }
        @keyframes truckMoveDynamic { 0% { transform: translate(200px, 300px); } 100% { transform: translate(600px, 300px); } }
        .animate-truck-move-dynamic { animation: truckMoveDynamic 4s linear infinite alternate; }
        /* Hide scrollbar for Chrome, Safari and Opera */
        .no-scrollbar::-webkit-scrollbar { display: none; }
        /* Hide scrollbar for IE, Edge and Firefox */
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}