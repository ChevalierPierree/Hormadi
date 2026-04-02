'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Newspaper,
  Calendar,
  Trophy,
  Users,
  Ticket,
  ShoppingBag,
  LogOut,
  Menu,
  X,
} from 'lucide-react';

interface User {
  name: string;
  email: string;
  role: string;
}

interface AdminSidebarProps {
  user: User;
}

export default function AdminSidebar({ user }: AdminSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { label: 'Tableau de bord', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Actualités', href: '/admin/news', icon: Newspaper },
    { label: 'Matchs', href: '/admin/matches', icon: Calendar },
    { label: 'Classement', href: '/admin/standings', icon: Trophy },
    { label: 'Partenaires', href: '/admin/partners', icon: Users },
    { label: 'Billetterie', href: '/admin/tickets', icon: Ticket },
    { label: 'Boutique', href: '/admin/shop', icon: ShoppingBag },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isActive = (href: string) => pathname === href;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-hormadi-border">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-hormadi-red flex items-center justify-center flex-shrink-0">
            <span className="text-white text-lg font-bold">H</span>
          </div>
          <h1 className="text-xl font-bold text-white">Hormadi Admin</h1>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                active
                  ? 'bg-hormadi-red text-white'
                  : 'text-hormadi-muted hover:bg-hormadi-forest hover:text-white'
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-hormadi-border space-y-3">
        <div className="px-4 py-3 bg-hormadi-forest rounded-lg">
          <p className="text-white font-medium text-sm truncate">{user.name}</p>
          <p className="text-hormadi-muted text-xs mt-1 truncate">{user.email}</p>
          <p className="text-hormadi-ocean text-xs mt-2 font-medium uppercase">
            {user.role}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-hormadi-muted hover:text-hormadi-red rounded-lg transition-colors hover:bg-hormadi-forest"
        >
          <LogOut size={20} />
          <span className="font-medium">Déconnexion</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 hover:bg-hormadi-forest rounded-lg transition-colors"
      >
        {isOpen ? (
          <X className="text-white" size={24} />
        ) : (
          <Menu className="text-white" size={24} />
        )}
      </button>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:w-64 flex-col bg-hormadi-surface border-r border-hormadi-border">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 h-screen w-64 bg-hormadi-surface border-r border-hormadi-border transform transition-transform duration-300 lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
