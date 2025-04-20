import { useContext } from 'react';
import { Link, useLocation } from 'wouter';
import { AuthContext } from '@/context/AuthProvider';
import {
  BarChart4,
  ClipboardList,
  Clock,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
  AlertTriangle,
  BookOpen,
  FileSpreadsheet,
  Calendar,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

  const navItems = [
    {
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
        { name: 'Pacientes', path: '/patients', icon: <Users size={20} /> },
        { name: 'Agenda', path: '/agenda', icon: <Calendar size={20} /> },
        { name: 'Rounds', path: '/rounds', icon: <Users size={20} /> },
      ],
    },
    {
      items: [
        { name: 'Relatórios', path: '/reports', icon: <FileText size={20} /> },
        { name: 'Perfil', path: '/profile', icon: <User size={20} /> },
        { name: 'Configurações', path: '/settings', icon: <Settings size={20} /> },
      ],
    },
  ];

  return (
    <>
      <div className={cn(
        "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden",
        isMobileSidebarOpen ? "block" : "hidden"
      )}
      onClick={closeMobileSidebar} />

      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full w-72 border-r bg-[#1a2036] text-white transition-transform md:translate-x-0",
        isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-4 flex flex-col">
            <div className="flex items-center h-14">
              <div>
                <h1 className="text-xl font-bold text-primary">MONITORAUTI</h1>
                <p className="text-xs text-muted-foreground">Sistema Avançado de Monitoramento</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 flex flex-col py-4 flex-1">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
                Menu
              </h2>
              <div className="space-y-1">
                {navItems[0].items.map((item) => (
                  <Link 
                    key={item.path}
                    href={item.path}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                      isActive(item.path) && "bg-accent text-accent-foreground"
                    )}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground uppercase">
                Administração
              </h2>
              <div className="space-y-1">
                {navItems[1].items.map((item) => (
                  <Link 
                    key={item.path}
                    href={item.path}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                      isActive(item.path) && "bg-accent text-accent-foreground"
                    )}
                  >
                    {item.icon}
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-auto px-3 py-2">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-md px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
              >
                <LogOut size={20} />
                Sair
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
