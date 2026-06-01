'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { MobileNavBar } from '@/components/layout/MobileNavBar';
import { LogoImage } from '@/components/ui/LogoImage';
import Link from 'next/link';
import { FiArrowLeft, FiMapPin, FiTag, FiNavigation } from 'react-icons/fi';

// Dynamic import for Leaflet (client-side only)
let MapContainer: any, TileLayer: any, Marker: any, Popup: any, useMap: any;

export default function MapPage() {
  const supabase = createClient();
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);

  // Default center: Ushuaia
  const defaultCenter: [number, number] = [-54.8019, -68.3030];
  const [center, setCenter] = useState<[number, number]>(defaultCenter);

  useEffect(() => {
    loadBusinesses();
    getUserLocation();
  }, []);

  const loadBusinesses = async () => {
    const { data } = await supabase
      .from('businesses')
      .select('*, promotions(id, title, discount_percentage, is_flash, is_active, moderation_status)')
      .eq('is_active', true)
      .not('latitude', 'is', null)
      .not('longitude', 'is', null);

    setBusinesses(data || []);
    setLoading(false);
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
          setCenter([loc.lat, loc.lng]);
        },
        () => {
          // Default to Ushuaia center
          setCenter(defaultCenter);
        }
      );
    }
  };

  // Load Leaflet dynamically
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Load Leaflet CSS
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Load Leaflet JS
    if (!(window as any).L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => initMap();
      document.head.appendChild(script);
    } else {
      initMap();
    }
  }, [businesses]);

  const initMap = () => {
    const L = (window as any).L;
    if (!L || mapReady) return;

    const map = L.map('map-container').setView(center, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Custom icon for businesses
    const businessIcon = L.divIcon({
      html: `<div style="background:#1B3A5C;color:#fff;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:14px;box-shadow:0 2px 8px rgba(0,0,0,0.3);border:2px solid #fff;">🏪</div>`,
      className: '',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    // Founder icon (golden)
    const founderIcon = L.divIcon({
      html: `<div style="background:#F58220;color:#fff;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:16px;box-shadow:0 2px 12px rgba(245,130,32,0.4);border:2px solid #FFD700;">📍</div>`,
      className: '',
      iconSize: [36, 36],
      iconAnchor: [18, 18],
    });

    // User location marker
    if (userLocation) {
      const userIcon = L.divIcon({
        html: `<div style="background:#3B82F6;color:#fff;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;box-shadow:0 0 0 4px rgba(59,130,246,0.3);border:2px solid #fff;">📍</div>`,
        className: '',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      });
      L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(map)
        .bindPopup('<b>Tu ubicación</b>');
    }

    // Add business markers
    businesses.forEach((biz) => {
      const activePromos = (biz.promotions || []).filter((p: any) => p.is_active && p.moderation_status === 'approved');
      const promoText = activePromos.length > 0
        ? `<br><div style="margin-top:6px;padding:4px 8px;background:#FFF4EB;border-radius:6px;font-size:12px;color:#F58220;font-weight:600;">🎯 ${activePromos.length} promo(s) activa(s)</div>`
        : '';

      const flashText = activePromos.some((p: any) => p.is_flash)
        ? `<div style="margin-top:4px;padding:4px 8px;background:#FFFBEB;border-radius:6px;font-size:12px;color:#F59E0B;font-weight:600;">⚡ Oferta Flash</div>`
        : '';

      const popupContent = `
        <div style="min-width:200px;font-family:system-ui;">
          <div style="font-weight:bold;font-size:14px;color:#1B3A5C;">${biz.name} ${biz.is_founder ? '📍' : ''}</div>
          <div style="color:#6B7B8D;font-size:12px;margin-top:2px;">${biz.category} • ${biz.city}</div>
          <div style="color:#9CA3AF;font-size:11px;margin-top:4px;">📍 ${biz.address}</div>
          ${biz.phone ? `<div style="color:#2E6B8A;font-size:11px;margin-top:2px;">📞 ${biz.phone}</div>` : ''}
          ${promoText}
          ${flashText}
          <a href="/businesses/${biz.id}" style="display:inline-block;margin-top:8px;color:#F58220;font-size:12px;font-weight:600;text-decoration:none;">Ver detalles →</a>
        </div>
      `;

      L.marker([biz.latitude, biz.longitude], { icon: biz.is_founder ? founderIcon : businessIcon })
        .addTo(map)
        .bindPopup(popupContent);
    });

    // Add attribution
    L.control.attribution({ position: 'bottomright' }).addTo(map);

    setMapReady(true);

    // Fix map size after render
    setTimeout(() => map.invalidateSize(), 100);
  };

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3 h-16">
            <Link href="/" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <FiArrowLeft size={20} className="text-gray-600" />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden flex items-center justify-center">
                <LogoImage className="w-6 h-6 object-contain" />
              </div>
              <h1 className="font-bold text-gray-900">Mapa de Comercios</h1>
            </div>
            <button
              onClick={getUserLocation}
              className="ml-auto p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Mi ubicación"
            >
              <FiNavigation size={18} className="text-accent-500" />
            </button>
          </div>
        </div>
      </header>

      {/* Map */}
      <div id="map-container" className="w-full" style={{ height: 'calc(100vh - 64px)' }} />

      {/* Legend */}
      <div className="fixed bottom-20 left-4 bg-white rounded-xl shadow-lg p-3 z-[1000] text-xs">
        <div className="flex items-center gap-2 mb-1">
          <span style={{ background: '#1B3A5C', color: '#fff', width: '16px', height: '16px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px' }}>🏪</span>
          <span className="text-gray-600">Comercio</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <span style={{ background: '#F58220', color: '#fff', width: '16px', height: '16px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px' }}>📍</span>
          <span className="text-gray-600">Fundador</span>
        </div>
        <div className="flex items-center gap-2">
          <span style={{ background: '#3B82F6', color: '#fff', width: '16px', height: '16px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px' }}>📍</span>
          <span className="text-gray-600">Tu ubicación</span>
        </div>
      </div>

      {/* Business List (mobile) */}
      <div className="fixed bottom-24 right-4 z-[1000]">
        <div className="bg-white rounded-full shadow-lg p-2 flex items-center gap-2">
          <FiMapPin size={16} className="text-gray-500" />
          <span className="text-sm font-medium text-gray-700">{businesses.length} locales</span>
        </div>
      </div>

      <MobileNavBar />
    </div>
  );
}
