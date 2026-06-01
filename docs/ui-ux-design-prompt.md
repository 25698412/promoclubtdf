# 🎨 UI/UX Design System - Promo Club TDF

## Contexto del Proyecto

**Nombre:** Promo Club TDF  
**Tipo:** Aplicación multiplataforma (Web + Móvil Android/iOS)  
**Propósito:** Plataforma de promociones y descuentos para locales comerciales en Tierra del Fuego  
**Stack:** Next.js (Web), React Native/Expo (Móvil), Supabase (Backend), Tailwind CSS

## 🎯 Objetivo del Diseño

Crear una experiencia de usuario intuitiva, moderna y atractiva que:
1. Facilite a los usuarios descubrir y usar promociones
2. Permita a los comercios gestionar sus ofertas fácilmente
3. Proporcione al admin herramientas poderosas de gestión

## 🎨 Design System

### Paleta de Colores (basada en el logo)

```
Primary:    #1B3A5C  (Azul oscuro - headers, textos principales)
Secondary:  #2E6B8A  (Azul medio - botones secundarios, links)
Accent:     #F58220  (Naranja - CTAs, badges de descuento, elementos destacados)
Background: #F0F4F8  (Gris claro - fondos)
White:      #FFFFFF  (Cards, inputs)
Success:    #22C55E  (Estados positivos)
Warning:    #F59E0B  (Alertas, ofertas flash)
Error:      #EF4444  (Errores, estados negativos)
```

### Tipografía

```
Font Family: Inter, system-ui, sans-serif

Headings:
- H1: 32px, Bold (700)
- H2: 24px, SemiBold (600)
- H3: 20px, SemiBold (600)

Body:
- Large: 16px, Regular (400)
- Base: 14px, Regular (400)
- Small: 12px, Regular (400)

Buttons: 16px, SemiBold (600)
```

### Espaciado

```
xs:  4px
sm:  8px
md:  16px
lg:  24px
xl:  32px
2xl: 48px
```

### Border Radius

```
sm:  8px   (inputs, badges)
md:  12px  (cards, botones)
lg:  16px  (modals, containers)
full: 9999px (avatars, pills)
```

### Sombras

```
sm:  0 1px 2px rgba(27, 58, 92, 0.05)
md:  0 4px 6px rgba(27, 58, 92, 0.1)
lg:  0 10px 15px rgba(27, 58, 92, 0.15)
```

## 📱 Principios de Diseño

### 1. Mobile-First
- Diseñar primero para móvil, luego adaptar a desktop
- Touch targets mínimo 44x44px
- Espaciado adecuado para uso con una mano

### 2. Accesibilidad
- Contraste mínimo 4.5:1 para texto normal
- Contraste mínimo 3:1 para texto grande
- Soporte para lectores de pantalla
- Navegación por teclado

### 3. Consistencia
- Mismos patrones en toda la app
- Componentes reutilizables
- Mismos iconos para mismas acciones

### 4. Feedback
- Loading states claros
- Confirmaciones de acciones
- Mensajes de error descriptivos
- Empty states informativos

### 5. Performance
- Skeleton loaders
- Lazy loading de imágenes
- Transiciones suaves

## 🧩 Estructura de Componentes

### Componentes Base

```
Button
├── Primary (bg-primary, text-white)
├── Secondary (bg-secondary, text-white)
├── Accent (bg-accent, text-white)
├── Outline (border, transparent)
└── Ghost (transparent, text-primary)

Input
├── Text
├── Search
├── Select
└── Textarea

Card
├── Default (bg-white, shadow-md, rounded-xl)
├── Interactive (hover:shadow-lg)
└── Elevated (shadow-lg)

Badge
├── Success (bg-green-100, text-green-800)
├── Warning (bg-yellow-100, text-yellow-800)
├── Error (bg-red-100, text-red-800)
└── Info (bg-blue-100, text-blue-800)

Avatar
├── Small (32px)
├── Medium (48px)
└── Large (64px)
```

### Componentes Específicos

```
PromotionCard
├── Image
├── Title
├── Business Name
├── Discount Badge
├── Distance/Location
└── Action Button

CouponCard
├── Business Logo
├── Discount
├── Expiration Timer
├── QR Code
└── Status Badge

BusinessCard
├── Logo
├── Name
├── Category
├── Rating
├── Distance
└── Active Promotions Count

FlashOfferBanner
├── Timer Countdown
├── Discount
├── Business Name
└── CTA Button
```

## 📐 Layouts

### Web - Panel Admin

```
┌─────────────────────────────────────────────────────────┐
│ Sidebar (256px)                    │ Main Content       │
│                                    │                    │
│  Dashboard                         │  Header            │
│ 🏪 Locales                         │  ┌──────────────┐  │
│ 🎟️ Promociones                    │  │ Stats Cards  │  │
│ 🖼️ Banners                        │  └──────────────┘  │
│ 👥 Usuarios                        │                    │
│ 🎁 Premios                         │  Content Area      │
│ 📈 Métricas                        │  ┌──────────────┐  │
│ ⚙️ Configuración                   │  │              │  │
│                                    │  │              │  │
│ [Cerrar Sesión]                    │  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Móvil - App Usuario

```
┌─────────────────────────────────┐
│ Header                          │
│ ┌─────────────────────────────┐ │
│ │ Promo Club TDF              │ │
│ └─────────────────────────────┘ │
│                                 │
│ Content Area                    │
│ ┌─────────────────────────────┐ │
│ │                             │ │
│ │                             │ │
│ │                             │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Tab Bar                     │ │
│ │ 🏠  🔍  🎫  ❤️  👤       │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

## 🎬 Animaciones y Transiciones

### Duraciones

```
fast:   150ms  (hover states, tooltips)
normal: 250ms  (button presses, toggles)
slow:   350ms  (page transitions, modals)
```

### Easing

```
ease-in:    cubic-bezier(0.4, 0, 1, 1)
ease-out:   cubic-bezier(0, 0, 0.2, 1)
ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
```

### Micro-interacciones

```
- Button press: scale(0.98)
- Card hover: translateY(-2px) + shadow increase
- Loading: pulse animation
- Success: checkmark draw animation
- Error: shake animation
```

## 📝 Estados de la UI

### Loading States

```
- Skeleton screens para contenido
- Spinners para acciones
- Progress bars para uploads
```

### Empty States

```
- Ilustración simple
- Título descriptivo
- Subtítulo explicativo
- CTA para acción
```

### Error States

```
- Icono de error
- Mensaje claro
- Acción para resolver
- Link a soporte si es necesario
```

## 🎯 Patrones de Navegación

### Web
- Sidebar fija con navegación principal
- Breadcrumbs para profundidad
- Tabs para secciones relacionadas

### Móvil
- Bottom tab bar (5 items máximo)
- Stack navigation para drill-down
- Modal para acciones rápidas
- Bottom sheet para opciones

## 📊 Métricas de Diseño

### Objetivos

```
- Time to first action: < 3 segundos
- Task completion rate: > 90%
- Error rate: < 5%
- User satisfaction: > 4/5
```

## 🔍 Checklist de Revisión

### Antes de Implementar

- [ ] ¿El diseño sigue el design system?
- [ ] ¿Los colores tienen suficiente contraste?
- [ ] ¿Los touch targets son adecuados?
- [ ] ¿Hay estados para loading, error, empty?
- [ ] ¿La navegación es intuitiva?
- [ ] ¿Las animaciones son sutiles y útiles?
- [ ] ¿Es accesible?
- [ ] ¿Funciona en todos los tamaños de pantalla?

---

## 💡 Notas para el Desarrollador

1. Usar Tailwind CSS con las variables del design system
2. Crear componentes reutilizables en `/components`
3. Seguir la estructura de carpetas definida
4. Usar `clsx` y `tailwind-merge` para clases condicionales
5. Implementar dark mode como mejora futura
6. Usar `react-icons` para iconografía consistente
7. Implementar `next/image` para optimización de imágenes
