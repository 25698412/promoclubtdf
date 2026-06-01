# Promo Club TDF

Plataforma de promociones y descuentos para locales comerciales en Tierra del Fuego.

**Presupuesto:** $4,000 USD  
**Proveedor:** Patagonia Techlab  
**Plazo:** 2 meses

## 🏗️ Arquitectura

- **Frontend Web**: Next.js 14 + Tailwind CSS
- **App Móvil**: React Native + Expo (Android + iOS)
- **Backend**: Supabase (PostgreSQL, Auth, Realtime, Edge Functions)
- **Hosting**: Vercel
- **Mapas**: Mapbox / Leaflet (alternativa gratuita a Google Maps)

## 📁 Estructura del Proyecto

```
├── web/                    # Aplicación web + Panel Admin (Next.js)
│   ├── src/
│   │   ├── app/           # App Router pages
│   │   │   ├── (public)/  # Páginas públicas
│   │   │   └── admin/     # Panel administrativo
│   │   └── lib/           # Utilidades y Supabase client
│   └── package.json
├── mobile/                 # App móvil (Expo) - Android + iOS
├── supabase/              # Schema y migraciones
│   └── schema.sql
└── public/                # Assets estáticos
    └── logo.png
```

## 🚀 Setup

### 1. Instalar dependencias

```bash
cd web
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.local.example .env.local
```

### 3. Configurar Supabase

1. Crear proyecto en [supabase.com](https://supabase.com)
2. Ejecutar el schema: `supabase/schema.sql`

### 4. Ejecutar en desarrollo

```bash
npm run dev
```

## 📊 Base de Datos

### Tablas

| Tabla | Descripción |
|-------|-------------|
| `user_profiles` | Perfiles de usuarios (con puntos, niveles, verificación) |
| `points_history` | Historial de puntos |
| `businesses` | Locales comerciales (con geolocalización) |
| `promotions` | Promociones (incluye ofertas flash) |
| `banners` | Banners destacados |
| `coupons` | Cupones QR dinámicos |
| `favorites` | Favoritos / Billetera |
| `rewards` | Premios canjeables por puntos |
| `reward_redemptions` | Canjes de premios |
| `analytics_events` | Métricas y analytics |
| `points_rules` | Reglas del motor de puntos |

## 🎨 Design System

Colores basados en el logo:

- **Primary**: `#1B3A5C` (Azul oscuro)
- **Secondary**: `#2E6B8A` (Azul medio)
- **Accent**: `#F58220` (Naranja)
- **Background**: `#F0F4F8` (Gris claro)

## 📱 Funcionalidades Completas

### App Móvil (Android + iOS)
- 🔐 Autenticación (Email, Google, Apple)
- ✅ Validación de residente TDF (DNI, dirección)
- 📍 Geolocalización y Geofencing (background)
- 🛍️ Explorador de locales por categoría y proximidad
- 🎯 Catálogo de promociones dinámico
- ⚡ Ofertas Flash (vencen en X minutos)
- ❤️ Favoritos / Billetera de cupones
- 🎫 Cupones QR dinámicos (cambian cada 60 seg)
- 🏆 Sistema de puntos (Bronce, Plata, Oro)
- 🎁 Canje de premios por puntos
- 🔎 Buscador inteligente
- 🔔 Notificaciones push inteligentes

### Panel de Comercio
- 📊 Dashboard de control (ventas, puntos, flujo)
- 🎟️ Gestión de promociones
- ⚡ Creador de ofertas flash
- ⏰ Programador de ofertas (horarios de baja afluencia)
- 📱 Escáner de validación QR
- 🎁 Gestión de stock de premios

### Panel Administrativo
- 🏪 Gestor de comercios (ABM)
- 🎟️ Gestión de promociones
- 🖼️ Gestión de banners destacados
- 📊 Métricas provinciales (Ushuaia, Río Grande, Tolhuin)
- 🗺️ Mapa con pines (dorados para fundadores)
- ✅ Moderación de contenido
- ⚙️ Configuración de reglas de puntos

## 📅 Cronograma

| Fase | Duración | Entregable |
|------|----------|------------|
| Setup + Web | Semanas 1-2 | Repo, DB, Web app |
| Panel Admin + Comercio | Semanas 3-4 | Gestión completa |
| App Móvil | Semanas 5-7 | Android + iOS |
| Testing + Deploy | Semana 8 | Deploy, builds .AAB/.IPA |

## 📦 Entrega

- **Android**: archivo .AAB
- **iOS**: archivo .IPA
- **Web**: Deploy en Vercel

---

Privado - Promo Club TDF / Patagonia Techlab 2026
