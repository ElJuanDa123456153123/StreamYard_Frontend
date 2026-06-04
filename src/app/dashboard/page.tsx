'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Video,
  Radio,
  Calendar,
  Users,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { streamsService } from '@/lib/services/streams.service';
import { StreamList } from '@/lib/types';
import { authService } from '@/lib/services/auth.service';
import { Navbar } from '@/components/layout/Navbar';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Dialog } from '@/components/ui/Dialog';

export default function DashboardPage() {
  const router = useRouter();
  const [streams, setStreams] = useState<StreamList[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [streamToDelete, setStreamToDelete] = useState<StreamList | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      router.push('/auth/login');
      return;
    }
    setUser(currentUser);

    loadStreams();
  }, [router]);

  const loadStreams = async () => {
    try {
      const data = await streamsService.findMy();
      setStreams(data);
    } catch (error) {
      console.error('Error al cargar transmisiones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    router.push('/');
  };

  const handleDeleteClick = (stream: StreamList) => {
    setStreamToDelete(stream);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!streamToDelete) return;

    setDeleting(true);
    try {
      await streamsService.delete(streamToDelete.id);
      setStreams(streams.filter((s) => s.id !== streamToDelete.id));
      setDeleteDialogOpen(false);
      setStreamToDelete(null);
    } catch (error) {
      console.error('Error al eliminar transmisión:', error);
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: 'success' | 'warning' | 'danger' | 'info' | 'gray'; label: string }> = {
      live: { variant: 'danger', label: 'EN VIVO' },
      scheduled: { variant: 'info', label: 'PROGRAMADA' },
      ended: { variant: 'gray', label: 'FINALIZADA' },
      draft: { variant: 'warning', label: 'BORRADOR' },
    };

    const config = statusMap[status] || statusMap.draft;
    return <Badge variant={config.variant} size="sm">{config.label}</Badge>;
  };

  const getActionButtons = (stream: StreamList) => {
    if (stream.status === 'draft') {
      return (
        <Button size="sm" variant="primary" asChild>
          <Link href={`/studio/${stream.id}`}>Iniciar Transmisión</Link>
        </Button>
      );
    }
    if (stream.status === 'scheduled') {
      return (
        <Button size="sm" variant="success" asChild>
          <Link href={`/studio/${stream.id}`}>Comenzar Transmisión</Link>
        </Button>
      );
    }
    if (stream.status === 'live') {
      return (
        <Button size="sm" variant="danger" asChild>
          <Link href={`/studio/${stream.id}`}>Entrar al Estudio</Link>
        </Button>
      );
    }
    return null;
  };

  const stats = [
    {
      title: 'Total de Transmisiones',
      value: streams.length,
      icon: Video,
      color: 'indigo',
    },
    {
      title: 'En Vivo Ahora',
      value: streams.filter((s) => s.status === 'live').length,
      icon: Radio,
      color: 'green',
    },
    {
      title: 'Programadas',
      value: streams.filter((s) => s.status === 'scheduled').length,
      icon: Calendar,
      color: 'blue',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userName={user?.name} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Panel de Control</h1>
            <p className="mt-2 text-gray-600">Administra tus transmisiones en vivo</p>
          </div>
          <Button size="lg" asChild>
            <Link href="/dashboard/create" className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Crear Nueva Transmisión
            </Link>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.title} hover>
              <CardBody className="flex items-center gap-4">
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className={`text-3xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Streams List */}
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900">Tus Transmisiones</h2>
          </CardHeader>
          <CardBody>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <span className="ml-3 text-gray-600">Cargando transmisiones...</span>
              </div>
            ) : streams.length === 0 ? (
              <div className="text-center py-12">
                <Video className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aún no hay transmisiones</h3>
                <p className="text-gray-600 mb-6">Comienza creando tu primera transmisión</p>
                <Button size="lg" asChild>
                  <Link href="/dashboard/create">Crear Tu Primera Transmisión</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {streams.map((stream) => (
                  <div
                    key={stream.id}
                    className="p-5 border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-4">
                      {/* Left side - Stream info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {stream.title}
                          </h3>
                          {getStatusBadge(stream.status)}
                        </div>
                        {stream.description && (
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                            {stream.description}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1.5">
                            <Eye className="h-4 w-4" />
                            <span>{stream.viewerCount} espectadores</span>
                          </div>
                          {stream.scheduledFor && (
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {new Date(stream.scheduledFor).toLocaleDateString()} a las{' '}
                                {new Date(stream.scheduledFor).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          )}
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4" />
                            <span>Creado {new Date(stream.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right side - Actions */}
                      <div className="flex items-center gap-3">
                        {getActionButtons(stream)}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => router.push(`/dashboard/${stream.id}/edit`)}
                          title="Editar transmisión"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteClick(stream)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Eliminar transmisión"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        isOpen={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setStreamToDelete(null);
        }}
        title="Eliminar Transmisión"
        description="Esta acción no se puede deshacer"
        size="sm"
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteDialogOpen(false);
                setStreamToDelete(null);
              }}
              disabled={deleting}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteConfirm}
              loading={deleting}
            >
              Eliminar Transmisión
            </Button>
          </>
        }
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
          <div className="flex-1">
            <p className="text-gray-700 mb-4">
              ¿Estás seguro de que deseas eliminar la transmisión?
            </p>
            {streamToDelete && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm font-semibold text-gray-900 mb-1">
                  {streamToDelete.title}
                </p>
                {streamToDelete.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {streamToDelete.description}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
}
