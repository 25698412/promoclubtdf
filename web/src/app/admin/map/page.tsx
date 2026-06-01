'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AdminShell } from '@/components/layout/AdminShell';
import { FiMapPin, FiCheckCircle, FiX } from 'react-icons/fi';

export default function AdminMapPage() {
  const supabase = createClient();
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => { loadBusinesses(); }, []);

  const loadBusinesses = async () => {
    const { data } = await supabase
      .from('businesses')
      .select('id, name, category, city, address, is_active, is_founder, latitude, longitude, phone, promotions(id, is_active, moderation_status)')
      .not('latitude', 'is', null)
      .not('longitude', 'is', null)
      .order('name');

    setBusinesses(data || []);
    setLoading(false);
  };

  const filtered = businesses.filter((b) => {
    if (filter === 'active') return b.is_active;
    if (filter === 'inactive') return !b.is_active;
    return true;
  });

  useEffect(() => {
    if (typeof window === 'undefined' || filtered.length === 0) return;

    // Load Leaflet
    if (!document.querySelector('link[href*="leaflet"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const loadMap = () => {
      if (!(window as any).L || mapReady) return;

      const L = (window as any).L;
      const map = L.map('admin-map').setView([-54.8019, -68.3030], 13);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      const activeIcon = L.divIcon({
        html: `<div style="background:#22C55E;color:#fff;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;box-shadow:0 2px 6px rgba(0,0,0,0.3);border:2px solid #fff;">✓</div>`,
        className: '', iconSize: [28, 28], iconAnchor: [14, 14],
      });

      const inactiveIcon = L.divIcon({
        html: `<div style="background:#EF4444;color:#fff;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;box-shadow:0 2px 6px rgba(0,0,0,0.3);border:2px solid #fff;">✗</div>`,
        className: '', iconSize: [28, 28], iconAnchor: [14, 14],
      });

      const founderIcon = L.divIcon({
        html: `<div style="background:#F58220;color:#fff;width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:14px;box-shadow:0 2px 10px rgba(245,130,32,0.4);border:2px solid #FFD700;">📍</div>`,
        className: '', iconSize: [32, 32], iconAnchor: [16, 16],
      });

      filtered.forEach((biz) => {
        const activePromos = (biz.promotions || []).filter((p: any) => p.is_active && p.moderation_status === 'approved');
        const icon = biz.is_founder ? founderIcon : biz.is_active ? activeIcon : inactiveIcon;

        const popup = `
          <div style="min-width:180px;font-family:system-ui;">
            <div style="font-weight:bold;font-size:13px;color:#1B3A5C;">${biz.name} ${biz.is_founder ? '📍' : ''}</div>
            <div style="color:#6B7B8D;font-size:11px;margin-top:2px;">${biz.category} • ${biz.city}</div>
            <div style="color:#9CA3AF;font-size:11px;margin-top:4px;">📍 ${biz.address}</div>
            <div style="margin-top:6px;">
              <span style="display:inline-block;padding:2px 6px;border-radius:4px;font-size:10px;font-weight:600;${biz.is_active ? 'background:#F0FDF4;color:#22C55E' : 'background:#FEF2F2;color:#EF4444'}">
                ${biz.is_active ? 'Activo' : 'Inactivo'}
              </span>
              <span style="margin-left:4px;font-size:10px;color:#6B7B8D;">${activePromos.length} promo(s)</span>
            </div>
            <a href="/admin/businesses/${biz.id}" style="display:inline-block;margin-top:6px;color:#F58220;font-size:11px;font-weight:600;text-decoration:none;">Editar →</a>
          </div>
        `;

        L.marker([biz.latitude, biz.longitude], { icon }).addTo(map).bindPopup(popup);
      });

      setTimeout(() => map.invalidateSize(), 100);
      setMapReady(true);
    };

    if (!(window as any).L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = loadMap;
      document.head.appendChild(script);
    } else {
      loadMap();
    }
  }, [filtered, mapReady]);

  return (
    <AdminShell>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 animate-fade-in-up">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Mapa de Comercios</h1>
            <p className="text-gray-500 mt-1">{filtered.length} locales en el mapa</p>
          </div>
          <div className="flex gap-2">
            {(['all', 'active', 'inactive'] as const).map((f) => (
              <button
                key={f}
                onClick={() => { setFilter(f); setMapReady(false); }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filter === f ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {f === 'all' ? 'Todos' : f === 'active' ? '✅ Activos' : '❌ Inactivos'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16">
            <div className="w-10 h-10 border-4 border-accent-500 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div id="admin-map" style={{ height: '600px', width: '100%' }} />
          </div>
        )}

        {/* Legend */}
        <div className="flex items-center gap-6 mt-4 text-sm text-gray-500">
          <span className="flex items-center gap-2">
            <span style={{ background: '#22C55E', color: '#fff', width: '16px', height: '16px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px' }}>✓</span>
            Activo
          </span>
          <span className="flex items-center gap-2">
            <span style={{ background: '#EF4444', color: '#fff', width: '16px', height: '16px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px' }}>✗</span>
            Inactivo
          </span>
          <span className="flex items-center gap-2">
            <span style={{ background: '#F58220', color: '#fff', width: '16px', height: '16px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px' }}>📍</span>
            Fundador
          </span>
        </div>
      </div>
    </AdminShell>
  );
}
