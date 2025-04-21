import { useContext } from 'react';
import { Link, useLocation } from 'wouter';
import { AuthContext } from '@/context/AuthProvider';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FileText,
  User,
  Settings,
  LogOut,
  Activity
} from 'lucide-react';

interface SidebarProps {
  isMobileSidebarOpen: boolean;
  closeMobileSidebar: () => void;
}

export function Sidebar({ isMobileSidebarOpen, closeMobileSidebar }: SidebarProps) {
  const [location] = useLocation();
  const { logout } = useContext(AuthContext);

  const handleLogout = async () => {
    await logout();
  };

  const isActive = (path: string) => {
    return location === path || (path !== '/dashboard' && location.startsWith(path));
  };

  return (
    <>
      {/* Overlay para móvel */}
      <div 
        className={cn(
          "fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden",
          isMobileSidebarOpen ? "block" : "hidden"
        )}
        onClick={closeMobileSidebar}
      />

      {/* Sidebar component - exatamente como na referência */}
      <aside className="fixed top-0 left-0 z-40 h-screen w-60 transform -translate-x-full md:translate-x-0 transition-transform bg-[#1a2036] text-white border-r-0 shadow-lg">
        {/* Cabeçalho com logo */}
        <div className="p-4 border-b border-white/10">
          <div className="text-xl font-bold">MONITORAUTI</div>
          <div className="text-xs text-white/60">Sistema Avançado de Monitoramento</div>
        </div>

        {/* Menu de navegação */}
        <div className="flex flex-col h-[calc(100%-12rem)]">
          <div className="flex-1 py-4">
            {/* Seção Menu */}
            <div className="mb-6">
              <div className="px-4 text-xs uppercase tracking-wider text-white/50 font-medium mb-2">Menu</div>
              <nav className="space-y-1">
                <Link
                  href="/dashboard"
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-white/80 hover:bg-[#242b44] rounded-md transition-colors",
                    isActive("/dashboard") && "bg-[#2e3652] text-[#3b82f6]"
                  )}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                
                <Link
                  href="/patients"
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-white/80 hover:bg-[#242b44] rounded-md transition-colors",
                    isActive("/patients") && "bg-[#2e3652] text-[#3b82f6]"
                  )}
                >
                  <Users className="h-5 w-5" />
                  <span>Pacientes</span>
                </Link>
                
                <Link
                  href="/agenda"
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-white/80 hover:bg-[#242b44] rounded-md transition-colors",
                    isActive("/agenda") && "bg-[#2e3652] text-[#3b82f6]"
                  )}
                >
                  <Calendar className="h-5 w-5" />
                  <span>Agenda</span>
                </Link>
                
                <Link
                  href="/rounds"
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-white/80 hover:bg-[#242b44] rounded-md transition-colors",
                    isActive("/rounds") && "bg-[#2e3652] text-[#3b82f6]"
                  )}
                >
                  <Activity className="h-5 w-5" />
                  <span>Rounds</span>
                </Link>
              </nav>
            </div>

            {/* Seção Administração */}
            <div>
              <div className="px-4 text-xs uppercase tracking-wider text-white/50 font-medium mb-2">Administração</div>
              <nav className="space-y-1">
                <Link
                  href="/reports"
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-white/80 hover:bg-[#242b44] rounded-md transition-colors",
                    isActive("/reports") && "bg-[#2e3652] text-[#3b82f6]"
                  )}
                >
                  <FileText className="h-5 w-5" />
                  <span>Relatórios</span>
                </Link>
                
                <Link
                  href="/profile"
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-white/80 hover:bg-[#242b44] rounded-md transition-colors",
                    isActive("/profile") && "bg-[#2e3652] text-[#3b82f6]"
                  )}
                >
                  <User className="h-5 w-5" />
                  <span>Perfil</span>
                </Link>
                
                <Link
                  href="/settings"
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-white/80 hover:bg-[#242b44] rounded-md transition-colors",
                    isActive("/settings") && "bg-[#2e3652] text-[#3b82f6]"
                  )}
                >
                  <Settings className="h-5 w-5" />
                  <span>Configurações</span>
                </Link>
              </nav>
            </div>
          </div>

          {/* Logout button */}
          <div className="px-4 py-4 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="flex items-center w-full gap-3 px-4 py-2.5 text-sm font-medium text-white/80 hover:bg-red-400/10 hover:text-red-400 rounded-md transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}