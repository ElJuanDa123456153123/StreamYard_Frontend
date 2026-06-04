# StreamYard Frontend

Frontend de StreamYard Clone desarrollado con Next.js 14, TypeScript y TailwindCSS.

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
EOF

# Modo desarrollo
npm run dev

# Compilar para producción
npm run build
npm run start
```

La aplicación estará disponible en: `http://localhost:3000`

## 📁 Estructura del Proyecto

```
frontend/
├── src/
│   ├── app/                    # App Router Next.js 14
│   │   ├── auth/              # Autenticación
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── dashboard/         # Dashboard principal
│   │   │   ├── page.tsx
│   │   │   ├── create/        # Crear stream
│   │   │   └── [streamId]/    # Editar stream
│   │   ├── studio/            # Sala de streaming
│   │   │   └── [streamId]/
│   │   ├── layout.tsx         # Layout principal
│   │   ├── page.tsx           # Homepage
│   │   └── globals.css        # Estilos globales
│   ├── components/            # Componentes React
│   │   ├── ui/               # Componentes reutilizables
│   │   ├── auth/             # Componentes de auth
│   │   ├── dashboard/        # Componentes dashboard
│   │   └── studio/           # Componentes studio
│   ├── lib/
│   │   ├── services/         # Servicios API
│   │   │   ├── api.ts              # Cliente HTTP
│   │   │   ├── auth.service.ts     # Auth
│   │   │   ├── streams.service.ts  # Streams
│   │   │   └── sessions.service.ts # Sessions
│   │   ├── types/            # Tipos TypeScript
│   │   ├── hooks/            # Custom hooks
│   │   └── utils/            # Utilidades
│   └── styles/               # Estilos adicionales
├── public/                   # Archivos estáticos
├── .env.local              # Variables de entorno
├── next.config.js          # Configuración Next.js
├── tailwind.config.ts      # Configuración Tailwind
└── package.json
```

## 🎨 Páginas Principales

### Homepage `/`
- Landing page con información del proyecto
- Call-to-action para registro
- Links a streams públicos

### Autenticación `/auth`
- **Login** (`/auth/login`) - Inicio de sesión con email/password o Google
- **Register** (`/auth/register`) - Registro de nuevos usuarios

### Dashboard `/dashboard`
- Vista general de streams del usuario
- Estadísticas rápidas (total, live, scheduled)
- Lista de streams con acciones rápidas
- Botón para crear nuevo stream

### Crear Stream `/dashboard/create`
- Formulario para crear nuevo stream
- Configuración de título, descripción, privacidad
- Selección de plataformas (YouTube, Facebook, etc.)
- Configuración de participantes y opciones

### Studio `/studio/[streamId]`
- Sala de streaming principal
- Preview de video (simulado en MVP)
- Lista de participantes en tiempo real
- Controles de streaming
- Información de stream y viewers

## 🔧 Servicios API

### Cliente HTTP (`lib/services/api.ts`)
```typescript
import apiClient from '@/lib/services/api';

// Cliente con interceptores para auth
const api = apiClient.getClient();

// Todos los requests incluyen automáticamente el token
```

### Auth Service (`lib/services/auth.service.ts`)
```typescript
authService.login(credentials)
authService.register(credentials)
authService.refreshToken(token)
authService.logout()
authService.getCurrentUser()
authService.isAuthenticated()
```

### Streams Service (`lib/services/streams.service.ts`)
```typescript
streamsService.create(data)
streamsService.findMy()
streamsService.findById(id)
streamsService.update(id, data)
streamsService.delete(id)
streamsService.findLive()
```

### Sessions Service (`lib/services/sessions.service.ts`)
```typescript
sessionsService.create(streamId, data)
sessionsService.findByStream(streamId)
sessionsService.join(id)
sessionsService.leave(id)
sessionsService.kick(sessionId, streamId)
```

## 🎨 Componentes

### Estructura de Componentes
- **ui/** - Componentes reutilizables (Button, Input, Modal, etc.)
- **auth/** - Componentes específicos de autenticación
- **dashboard/** - Componentes del dashboard
- **studio/** - Componentes de la sala de streaming

### Ejemplo de Uso
```typescript
'use client';

import { useState } from 'react';
import { authService } from '@/lib/services/auth.service';

export default function MyComponent() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  return <div>Welcome {user?.name}</div>;
}
```

## 🎨 Estilos

### TailwindCSS Configurado
```typescript
// tailwind.config.ts
colors: {
  primary: {
    50: '#f0f9ff',
    // ...
    900: '#0c4a6e',
  }
}
```

### Clases Utility
- Usa clases de Tailwind para estilos
- Componentes con variantes y estados
- Responsive design con breakpoints

## 📱 Responsive Design

El diseño es completamente responsive:
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

## 🔐 Autenticación

### Local Storage
```typescript
// Tokens almacenados en localStorage
localStorage.getItem('accessToken');
localStorage.getItem('refreshToken');
localStorage.getItem('user');
```

### Token Management
- Los tokens se incluyen automáticamente en cada request
- Tokens expirados lanzan redirect a login
- Refresh tokens renovan access tokens automáticamente

## 🛠️ Scripts

```bash
npm run dev          # Modo desarrollo
npm run build        # Compilar producción
npm run start        # Iniciar producción
npm run lint         # Ejecutar ESLint
npm run type-check   # Verificar tipos TypeScript
```

## 📦 Dependencias Principales

- `next` - Framework React
- `react` - Library UI
- `axios` - Cliente HTTP
- `zustand` - State management
- `socket.io-client` - WebSockets (futuro)
- `react-hook-form` - Formularios
- `zod` - Validación de esquemas
- `date-fns` - Fechas
- `clsx` - Clases condicionales
- `tailwind-merge` - Merge de clases Tailwind

## 🔧 Configuración

### Variables de Entorno

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

### Next.js Config
```javascript
// next.config.js
module.exports = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },
}
```

## 🎨 Características de UI

### Colors
- **Primary**: Indigo (blue-600)
- **Success**: Green
- **Warning**: Yellow
- **Error**: Red

### Typography
- **Headings**: Sans-serif, bold
- **Body**: Sans-serif, regular
- **Monospace**: Para código

### Components
- Buttons con variantes (primary, secondary, outline)
- Inputs con validación
- Cards con shadow
- Modals con overlay

## 🐛 Troubleshooting

### Error: Cannot connect to API
Verifica que:
1. El backend esté corriendo en `http://localhost:3001`
2. `NEXT_PUBLIC_API_URL` esté configurado correctamente
3. No hay bloqueo de CORS

### Error: Module not found
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Hydration Errors
Usa `'use client'` en componentes que usan hooks o estado.

## 🚀 Próximos Pasos

Para mejorar este frontend:

1. **WebRTC**: Integrar Simple-peer para video real
2. **WebSockets**: Socket.io para updates en tiempo real
3. **State Management**: Ampliar Zustand para más estados globales
4. **Error Boundaries**: Manejo elegante de errores
5. **Loading States**: Skeletons y spinners
6. **Animations**: Framer Motion para transiciones
7. **Testing**: Jest y React Testing Library
8. **Performance**: Code splitting y lazy loading

## 📝 Convenciones de Código

### Naming
- Componentes: PascalCase (`MyComponent.tsx`)
- Services: camelCase (`authService.ts`)
- Types: PascalCase (`User`, `Stream`)
- Hooks: camelCase con prefijo `use` (`useAuth`)

### File Structure
- Un componente por archivo
- Co-locar componentes cercanos a su uso
- Separar concerns (UI, lógica, tipos)

### TypeScript
- Usar tipos estrictos
- Evorar `any` cuando sea posible
- Usar interfaces para shapes públicos
- Usar types para unions/intersections

## 📄 Licencia

Proyecto educativo para Taller de Aplicaciones de Internet.
