'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const userParam = searchParams.get('user');

    if (accessToken && refreshToken && userParam) {
      try {
        // Guardar tokens en localStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        // Guardar información del usuario
        const user = JSON.parse(decodeURIComponent(userParam));
        localStorage.setItem('user', JSON.stringify(user));

        // Redirigir al dashboard
        router.push('/dashboard');
      } catch (error) {
        console.error('Error processing callback:', error);
        router.push('/auth/login?error=callback_failed');
      }
    } else {
      // Si faltan parámetros, redirigir al login con error
      router.push('/auth/login?error=missing_tokens');
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Procesando autenticación...</p>
      </div>
    </div>
  );
}
