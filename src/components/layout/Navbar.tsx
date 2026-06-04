import React from 'react';
import Link from 'next/link';
import { Video, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface NavbarProps {
  userName?: string;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ userName, onLogout }) => {
  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className="bg-indigo-600 p-2 rounded-lg group-hover:bg-indigo-700 transition-colors">
                <Video className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">StreamYard</span>
            </Link>
          </div>

          {/* Right side - User menu */}
          <div className="flex items-center space-x-4">
            {userName && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <User className="h-4 w-4" />
                  <span className="font-medium">{userName}</span>
                </div>
                {onLogout && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onLogout}
                    className="flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Cerrar Sesión</span>
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
