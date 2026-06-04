'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Video,
  Users,
  Settings,
  Calendar,
  MessageCircle,
  Monitor,
  Check,
  Eye,
  Globe,
  Lock as LockIcon,
} from 'lucide-react';
import { streamsService } from '@/lib/services/streams.service';
import { StreamPrivacy, StreamPlatform } from '@/lib/types';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { YouTubeIcon, FacebookIcon, LinkedInIcon, TwitterIcon, TwitchIcon } from '@/components/icons/PlatformIcons';

const platforms = [
  { value: StreamPlatform.YOUTUBE, label: 'YouTube', icon: YouTubeIcon, color: '#FF0000', bgColor: 'bg-red-50 hover:bg-red-100' },
  { value: StreamPlatform.FACEBOOK, label: 'Facebook', icon: FacebookIcon, color: '#1877F2', bgColor: 'bg-blue-50 hover:bg-blue-100' },
  { value: StreamPlatform.LINKEDIN, label: 'LinkedIn', icon: LinkedInIcon, color: '#0A66C2', bgColor: 'bg-blue-50 hover:bg-blue-100' },
  { value: StreamPlatform.TWITTER, label: 'Twitter', icon: TwitterIcon, color: '#000000', bgColor: 'bg-gray-50 hover:bg-gray-100' },
  { value: StreamPlatform.TWITCH, label: 'Twitch', icon: TwitchIcon, color: '#9146FF', bgColor: 'bg-purple-50 hover:bg-purple-100' },
];

const privacyOptions = [
  { value: StreamPrivacy.PUBLIC, label: 'Pública - Cualquiera puede ver', icon: Globe, description: 'Tu transmisión será visible para todos' },
  { value: StreamPrivacy.PRIVATE, label: 'Privada - Solo tú puedes ver', icon: LockIcon, description: 'Solo tú puedes ver esta transmisión' },
  { value: StreamPrivacy.UNLISTED, label: 'No listada - Solo con enlace', icon: Eye, description: 'Solo quienes tengan el enlace pueden ver' },
];

export default function CreateStreamPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    privacy: StreamPrivacy.PUBLIC,
    platform: [] as StreamPlatform[],
    maxParticipants: 10,
    streamSettings: {
      enableChat: true,
      enableRecording: true,
      enableScreenShare: true,
      autoStart: false,
    },
    scheduledFor: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Remove empty fields before sending
      const dataToSend = {
        ...formData,
        scheduledFor: formData.scheduledFor || undefined,
        description: formData.description || undefined,
        platform: formData.platform.length > 0 ? formData.platform : undefined,
      };

      const stream = await streamsService.create(dataToSend);
      router.push(`/studio/${stream.id}`);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message;
      if (Array.isArray(errorMessage)) {
        setError(errorMessage.join(', '));
      } else {
        setError(errorMessage || 'Error al crear transmisión');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePlatformToggle = (platform: StreamPlatform) => {
    setFormData((prev) => ({
      ...prev,
      platform: prev.platform.includes(platform)
        ? prev.platform.filter((p) => p !== platform)
        : [...prev.platform, platform],
    }));
  };

  const handleSettingToggle = (setting: keyof typeof formData.streamSettings) => {
    setFormData((prev) => ({
      ...prev,
      streamSettings: {
        ...prev.streamSettings,
        [setting]: !prev.streamSettings[setting],
      },
    }));
  };

  const handleBack = () => {
    const user = localStorage.getItem('user');
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/auth/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar
        userName={JSON.parse(localStorage.getItem('user') || '{}')?.name}
        onLogout={() => {
          localStorage.clear();
          router.push('/');
        }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Volver al Panel de Control</span>
          </button>
          <div className="flex items-center gap-4">
            <div className="bg-indigo-600 p-3 rounded-xl">
              <Video className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Crear Nueva Transmisión</h1>
              <p className="mt-1 text-gray-600">Configura los ajustes de tu transmisión en vivo</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3">
            <Check className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Video className="h-5 w-5 text-indigo-600" />
                Información Básica
              </h2>
            </CardHeader>
            <CardBody className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Título de la Transmisión <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ej: Mi Transmisión Increíble"
                  leftIcon={<Video className="h-5 w-5" />}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-400 transition"
                  placeholder="Describe de qué tratará tu transmisión..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Privacidad
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {privacyOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = formData.privacy === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, privacy: option.value as StreamPrivacy })}
                        className={`
                          p-4 rounded-lg border-2 transition-all duration-200 text-left
                          ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50 shadow-md'
                              : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
                          }
                        `}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2 rounded-lg ${
                              isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <p className={`font-medium ${isSelected ? 'text-indigo-900' : 'text-gray-900'}`}>
                              {option.label}
                            </p>
                            <p className={`text-sm mt-1 ${isSelected ? 'text-indigo-700' : 'text-gray-500'}`}>
                              {option.description}
                            </p>
                          </div>
                        </div>
                        {isSelected && (
                          <Check className="h-5 w-5 text-indigo-600 ml-auto mt-2" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Platforms */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Settings className="h-5 w-5 text-indigo-600" />
                Plataformas de Streaming
              </h2>
              <p className="text-sm text-gray-600 mt-1">Selecciona las plataformas donde deseas transmitir simultáneamente</p>
            </CardHeader>
            <CardBody>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {platforms.map((platform) => {
                  const Icon = platform.icon;
                  const isSelected = formData.platform.includes(platform.value);
                  return (
                    <button
                      key={platform.value}
                      type="button"
                      onClick={() => handlePlatformToggle(platform.value)}
                      className={`
                        p-6 rounded-xl border-2 transition-all duration-200
                        flex flex-col items-center gap-3 relative group
                        ${
                          isSelected
                            ? 'border-current shadow-lg scale-105'
                            : 'border-gray-300 hover:border-gray-400 hover:scale-105'
                        }
                      `}
                      style={{
                        borderColor: isSelected ? platform.color : '',
                      }}
                    >
                      {isSelected && (
                        <div
                          className="absolute top-2 right-2 text-white rounded-full p-1"
                          style={{ backgroundColor: platform.color }}
                        >
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                      <div
                        className={`p-3 rounded-xl transition-all duration-200 ${
                          isSelected ? 'shadow-lg' : ''
                        }`}
                        style={{
                          backgroundColor: isSelected ? platform.color : '#E5E7EB',
                        }}
                      >
                        <Icon className="h-8 w-8" style={{ color: isSelected ? '#fff' : platform.color }} />
                      </div>
                      <span className={`font-semibold text-center ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>
                        {platform.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </CardBody>
          </Card>

          {/* Settings */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                <Settings className="h-5 w-5 text-indigo-600" />
                Configuración de Transmisión
              </h2>
            </CardHeader>
            <CardBody className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Máximo de Invitados
                </label>
                <Input
                  type="number"
                  min="1"
                  max="50"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
                  leftIcon={<Users className="h-5 w-5" />}
                  placeholder="10"
                />
                <p className="mt-2 text-sm text-gray-500">Cantidad máxima de participantes en tu transmisión (1-50)</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Características
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { key: 'enableChat', label: 'Chat en Vivo', icon: MessageCircle, description: 'Permite que los espectadores comenten' },
                    { key: 'enableRecording', label: 'Grabación Automática', icon: Video, description: 'Guarda la transmisión automáticamente' },
                    { key: 'enableScreenShare', label: 'Compartir Pantalla', icon: Monitor, description: 'Permite compartir tu pantalla' },
                  ].map((setting) => {
                    const Icon = setting.icon;
                    const isEnabled = formData.streamSettings[setting.key as keyof typeof formData.streamSettings];
                    return (
                      <button
                        key={setting.key}
                        type="button"
                        onClick={() => handleSettingToggle(setting.key as keyof typeof formData.streamSettings)}
                        className={`
                          p-4 rounded-lg border-2 transition-all duration-200
                          text-left
                          ${
                            isEnabled
                              ? 'border-green-600 bg-green-50'
                              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                          }
                        `}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div
                              className={`p-2 rounded-lg ${
                                isEnabled ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                              }`}
                            >
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <p className={`font-semibold ${isEnabled ? 'text-green-900' : 'text-gray-900'}`}>
                                {setting.label}
                              </p>
                              <p className={`text-sm mt-1 ${isEnabled ? 'text-green-700' : 'text-gray-500'}`}>
                                {setting.description}
                              </p>
                            </div>
                          </div>
                          {isEnabled && <Check className="h-5 w-5 text-green-600 mt-1" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Programar Para
                </label>
                <Input
                  type="datetime-local"
                  value={formData.scheduledFor}
                  onChange={(e) => setFormData({ ...formData, scheduledFor: e.target.value })}
                  leftIcon={<Calendar className="h-5 w-5" />}
                />
                <p className="mt-2 text-sm text-gray-500">Deja vacío para comenzar inmediatamente</p>
              </div>
            </CardBody>
          </Card>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button type="submit" loading={loading} fullWidth size="lg" className="sm:fullWidth-auto">
              <Video className="h-5 w-5 mr-2" />
              Crear Transmisión
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleBack}
              className="px-8"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
