// @ts-nocheck
import { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Radio, Truck } from 'lucide-react';

const MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// ── Load Google Maps script once ─────────────────────────
let scriptLoaded = false;
const loadGoogleMapsScript = () =>
  new Promise<void>((resolve) => {
    if (window.google?.maps || scriptLoaded) return resolve();
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_API_KEY}&libraries=geometry`;
    script.async = true;
    script.onload = () => { scriptLoaded = true; resolve(); };
    document.head.appendChild(script);
  });

// ─────────────────────────────────────────────────────────
// LiveRadarMap — shows all in-transit trucks as pulsing pins
// ─────────────────────────────────────────────────────────
export function LiveRadarMap({ trucks = [] }: { trucks?: any[] }) {
  const mapRef  = useRef<HTMLDivElement>(null);
  const [mapReady, setMapReady] = useState(false);
  const mapInstance = useRef<any>(null);
  const markers     = useRef<any[]>([]);

  useEffect(() => {
    loadGoogleMapsScript().then(() => setMapReady(true));
  }, []);

  useEffect(() => {
    if (!mapReady || !mapRef.current) return;
    if (!mapInstance.current) {
      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: 22.5726, lng: 80.1875 }, // center of India
        zoom: 5,
        mapTypeId: 'roadmap',
        styles: darkMapStyle,
        disableDefaultUI: false,
        zoomControl: true,
      });
    }

    // Clear old markers
    markers.current.forEach(m => m.setMap(null));
    markers.current = [];

    // Place a truck marker for each live truck
    trucks.forEach((truck) => {
      if (!truck.liveLocation?.lat) return;
      const marker = new window.google.maps.Marker({
        position: { lat: truck.liveLocation.lat, lng: truck.liveLocation.lng },
        map: mapInstance.current,
        title: `${truck.truckId} — ${truck.driverName}`,
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/truck.png',
          scaledSize: new window.google.maps.Size(36, 36),
        },
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="font-family:sans-serif;padding:8px;min-width:160px">
            <strong style="color:#EA580C">${truck.truckId}</strong><br/>
            Driver: ${truck.driverName}<br/>
            ${truck.origin} → ${truck.destination}<br/>
            <small style="color:#94a3b8">${truck.liveLocation.address || ''}</small>
          </div>
        `,
      });

      marker.addListener('click', () => infoWindow.open(mapInstance.current, marker));
      markers.current.push(marker);
    });
  }, [mapReady, trucks]);

  if (!MAPS_API_KEY) {
    return <MapPlaceholder label="Live Radar" note="Set VITE_GOOGLE_MAPS_API_KEY in .env to enable" />;
  }

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-700">
      <div ref={mapRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 bg-[#0F172A]/90 backdrop-blur-sm text-white px-4 py-2 rounded-xl border border-slate-700 flex items-center gap-2 text-sm font-black">
        <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
        LIVE RADAR — {trucks.filter(t => t.liveLocation?.lat).length} trucks active
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// RouteMap — draws the route between origin and destination
// ─────────────────────────────────────────────────────────
export function RouteMap({ origin, destination, polyline }: { origin: string; destination: string; polyline?: string }) {
  const mapRef  = useRef<HTMLDivElement>(null);
  const [mapReady, setMapReady] = useState(false);
  const [routeData, setRouteData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadGoogleMapsScript().then(() => setMapReady(true));
  }, []);

  // Fetch route from our backend
  useEffect(() => {
    if (!origin || !destination) return;
    setLoading(true);
    fetch(`/api/maps/route?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}`)
      .then(r => r.json())
      .then(data => { setRouteData(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [origin, destination]);

  useEffect(() => {
    if (!mapReady || !mapRef.current || !routeData?.origin?.lat) return;

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 6,
      center: {
        lat: (routeData.origin.lat + routeData.destination.lat) / 2,
        lng: (routeData.origin.lng + routeData.destination.lng) / 2,
      },
      styles: darkMapStyle,
    });

    // Origin marker (orange)
    new window.google.maps.Marker({
      position: routeData.origin,
      map,
      title: origin,
      icon: { url: 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png' },
      label: { text: 'A', color: 'white', fontWeight: 'bold' },
    });

    // Destination marker (red)
    new window.google.maps.Marker({
      position: routeData.destination,
      map,
      title: destination,
      icon: { url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png' },
      label: { text: 'B', color: 'white', fontWeight: 'bold' },
    });

    // Draw polyline if available
    const encodedPoly = polyline || routeData.polyline;
    if (encodedPoly && window.google.maps.geometry) {
      const decodedPath = window.google.maps.geometry.encoding.decodePath(encodedPoly);
      new window.google.maps.Polyline({
        path: decodedPath,
        geodesic: true,
        strokeColor: '#EA580C',
        strokeOpacity: 0.9,
        strokeWeight: 4,
        map,
      });
    }
  }, [mapReady, routeData]);

  if (!MAPS_API_KEY) {
    return <MapPlaceholder label={`${origin} → ${destination}`} note="Set VITE_GOOGLE_MAPS_API_KEY to see route" />;
  }

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-200">
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/70">
          <div className="text-white font-black animate-pulse">Calculating route...</div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
      {routeData?.distanceKm && (
        <div className="absolute bottom-4 left-4 right-4 bg-[#0F172A]/90 backdrop-blur-sm text-white px-4 py-3 rounded-xl border border-slate-700 flex justify-between text-sm font-black">
          <span className="flex items-center gap-2"><Navigation className="h-4 w-4 text-[#EA580C]" />{routeData.distanceKm} km</span>
          <span>~{routeData.durationHrs} hrs</span>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Fallback placeholder when API key is not configured
// ─────────────────────────────────────────────────────────
function MapPlaceholder({ label, note }: { label: string; note: string }) {
  return (
    <div className="w-full h-full min-h-[300px] rounded-2xl bg-[#0F172A] border border-slate-700 flex flex-col items-center justify-center gap-4 text-center p-8">
      <MapPin className="h-16 w-16 text-[#EA580C] opacity-60" />
      <p className="text-white font-black text-lg">{label}</p>
      <p className="text-slate-400 text-sm font-medium max-w-xs">{note}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// Dark map style for the LoadBhai aesthetic
// ─────────────────────────────────────────────────────────
const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#0f172a' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0f172a' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#0f172a' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#64748b' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#334155' }] },
  { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#ea580c' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#020817' }] },
  { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#334155' }] },
  { featureType: 'administrative.country', elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
];
