'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Video, Users, Broadcast, Palette } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardBody } from '@/components/ui/Card';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('accessToken');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  const features = [
    {
      icon: Users,
      title: 'Transmisiones con Múltiples Invitados',
      description: 'Invita hasta 10 invitados a tu transmisión en vivo con calidad de video profesional.',
    },
    {
      icon: Broadcast,
      title: 'Multiplataforma',
      description: 'Transmite a YouTube, Facebook, LinkedIn, Twitter y Twitch simultáneamente.',
    },
    {
      icon: Palette,
      title: 'Marcación Personalizada',
      description: 'Agrega logotipos, banners y gráficos personalizados para que coincidan con tu marca.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center gap-2">
                <div className="bg-indigo-600 p-2 rounded-lg">
                  <Video className="h-5 w-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">StreamYard</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/auth/login"
                className="text-gray-700 hover:text-indigo-600 px-4 py-2 rounded-md text-sm font-medium transition"
              >
                Iniciar Sesión
              </Link>
              <Button size="sm" asChild>
                <Link href="/auth/register">Registrarse</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center">
          <h2 className="text-5xl font-extrabold text-gray-900 sm:text-6xl mb-6">
            Transmisiones en Vivo Profesionales
            <span className="block text-indigo-600 mt-2">Hechas Fáciles</span>
          </h2>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Crea transmisiones en vivo atractivas con múltiples invitados. Transmite a múltiples
            plataformas simultáneamente con herramientas de producción de calidad de estudio.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/auth/register">Comenzar Gratis</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/streams/public">Explorar Transmisiones</Link>
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.title} hover>
              <CardBody>
                <div className="p-3 bg-indigo-100 rounded-lg w-fit mb-4">
                  <feature.icon className="h-6 w-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
