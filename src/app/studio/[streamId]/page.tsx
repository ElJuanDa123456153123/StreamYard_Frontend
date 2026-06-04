'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Video,
  Radio,
  Mic,
  Monitor,
  MessageCircle,
  Settings,
  Users,
  X,
  User,
  Link as LinkIcon,
  Copy,
  Check,
  LogOut,
} from 'lucide-react';
import { streamsService } from '@/lib/services/streams.service';
import { sessionsService } from '@/lib/services/sessions.service';
import { Stream, SessionList } from '@/lib/types';
import { authService } from '@/lib/services/auth.service';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardBody } from '@/components/ui/Card';

export default function StudioPage() {
  const router = useRouter();
  const params = useParams();
  const streamId = params.streamId as string;

  const [stream, setStream] = useState<Stream | null>(null);
  const [sessions, setSessions] = useState<SessionList[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState('');
  const [inviteLinkCopied, setInviteLinkCopied] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }

    loadStream();
    loadSessions();

    // Simulate real-time updates
    const interval = setInterval(() => {
      loadSessions();
    }, 5000);

    return () => clearInterval(interval);
  }, [streamId, router]);

  const loadStream = async () => {
    try {
      const data = await streamsService.findById(streamId);
      setStream(data);
      setIsLive(data.status === 'live');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al cargar transmisión');
    } finally {
      setLoading(false);
    }
  };

  const loadSessions = async () => {
    try {
      const data = await sessionsService.findActiveByStream(streamId);
      setSessions(data);
    } catch (err) {
      console.error('Error al cargar sesiones:', err);
    }
  };

  const handleGoLive = async () => {
    if (!stream) return;

    try {
      await streamsService.updateStatus(streamId, 'live');
      setIsLive(true);
      loadStream();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al iniciar transmisión');
    }
  };

  const handleEndStream = async () => {
    if (!stream) return;

    try {
      await streamsService.updateStatus(streamId, 'ended');
      setIsLive(false);
      loadStream();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al finalizar transmisión');
    }
  };

  const handleKickUser = async (sessionId: string) => {
    try {
      await sessionsService.kick(sessionId, streamId);
      loadSessions();
    } catch (err) {
      console.error('Error al expulsar usuario:', err);
    }
  };

  const handleCopyInviteLink = () => {
    const link = `${window.location.origin}/studio/${streamId}`;
    navigator.clipboard.writeText(link);
    setInviteLinkCopied(true);
    setTimeout(() => setInviteLinkCopied(false), 2000);
  };

  const controls = [
    { icon: Mic, label: 'Micrófono', active: false },
    { icon: Video, label: 'Cámara', active: false },
    { icon: Monitor, label: 'Compartir Pantalla', active: false },
    { icon: MessageCircle, label: 'Chat', active: true },
    { icon: Settings, label: 'Configuración', active: false },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          <p className="text-white text-xl">Cargando estudio...</p>
        </div>
      </div>
    );
  }

  if (error || !stream) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-500 text-xl">{error || 'Transmisión no encontrada'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-full px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-white text-xl font-semibold">{stream.title}</h1>
            {isLive && (
              <Badge variant="danger" size="sm">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse mr-2"></span>
                EN VIVO
              </Badge>
            )}
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Radio className="h-4 w-4" />
              <span>{stream.viewerCount} espectadores</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {!isLive ? (
              <Button size="md" variant="success" onClick={handleGoLive}>
                <Radio className="h-4 w-4 mr-2" />
                Iniciar Transmisión
              </Button>
            ) : (
              <Button size="md" variant="danger" onClick={handleEndStream}>
                <X className="h-4 w-4 mr-2" />
                Finalizar Transmisión
              </Button>
            )}
            <Button size="md" variant="ghost" onClick={() => router.push('/dashboard')}>
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Video Preview Area */}
          <div className="flex-1 bg-black flex items-center justify-center relative">
            <div className="text-center text-gray-500">
              <div className="p-4 bg-gray-800 rounded-full inline-flex mb-4">
                <Video className="h-16 w-16" />
              </div>
              <p className="text-xl font-medium">Vista Previa del Video</p>
              <p className="text-sm mt-2">
                {isLive ? 'La transmisión está en vivo' : 'La transmisión no está en vivo'}
              </p>
            </div>

            {/* Stream Info Overlay */}
            {stream.description && (
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white p-4 rounded-lg max-w-md">
                <p className="text-sm">{stream.description}</p>
              </div>
            )}
          </div>

          {/* Controls Bar */}
          <div className="bg-gray-800 border-t border-gray-700 p-4">
            <div className="flex items-center justify-center gap-4">
              {controls.map((control) => (
                <button
                  key={control.label}
                  className={`
                    p-3 rounded-full transition-all duration-200
                    ${
                      control.active
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'bg-gray-700 text-white hover:bg-gray-600'
                    }
                  `}
                  title={control.label}
                >
                  <control.icon className="h-5 w-5" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Participants */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-white font-semibold flex items-center gap-2">
              <Users className="h-5 w-5" />
              Participantes ({sessions.length})
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {sessions.length === 0 ? (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 text-sm">No hay participantes activos</p>
              </div>
            ) : (
              sessions.map((session) => (
                <Card key={session.id} padding="sm" className="bg-gray-700">
                  <CardBody className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {session.user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">{session.user.name}</p>
                          <p className="text-gray-400 text-xs capitalize">{session.role}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleKickUser(session.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))
            )}
          </div>

          {/* Invite Link */}
          <div className="p-4 border-t border-gray-700">
            <Button
              fullWidth
              size="md"
              onClick={handleCopyInviteLink}
              className="flex items-center justify-center gap-2"
            >
              {inviteLinkCopied ? (
                <>
                  <Check className="h-4 w-4" />
                  ¡Copiado!
                </>
              ) : (
                <>
                  <LinkIcon className="h-4 w-4" />
                  Invitar Participantes
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
