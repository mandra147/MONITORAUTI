import { useContext } from 'react';
import { Link, useLocation } from 'wouter';
import { AuthContext } from '@/context/AuthProvider';
import {
  BarChart4,
  ClipboardList,
  Clock,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
  AlertTriangle,
  BookOpen,
  FileSpreadsheet,
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
    return location === path;
  };

  const navItems = [
    {
      title: 'Principal',
      items: [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-5 w-5 mr-3" /> },
        { name: 'Exames', path: '/exams', icon: <FileSpreadsheet className="h-5 w-5 mr-3" /> },
        { name: 'Boletim Médico', path: '/medical-bulletin', icon: <ClipboardList className="h-5 w-5 mr-3" /> },
        { name: 'Passagem de Plantão', path: '/shift-change', icon: <Clock className="h-5 w-5 mr-3" /> },
      ],
    },
    {
      title: 'Gestão',
      items: [
        { name: 'Relatórios', path: '/reports', icon: <FileText className="h-5 w-5 mr-3" /> },
        { name: 'Protocolos', path: '/protocols', icon: <BookOpen className="h-5 w-5 mr-3" /> },
        { name: 'Indicadores', path: '/indicators', icon: <BarChart4 className="h-5 w-5 mr-3" /> },
        { name: 'Pendências', path: '/pending', icon: <AlertTriangle className="h-5 w-5 mr-3" /> },
      ],
    },
    {
      title: 'Configurações',
      items: [
        { name: 'Perfil', path: '/profile', icon: <User className="h-5 w-5 mr-3" /> },
        { name: 'Configurações', path: '/settings', icon: <Settings className="h-5 w-5 mr-3" /> },
      ],
    },
  ];

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="w-64 h-full bg-text text-white flex-shrink-0 hidden md:block">
        <SidebarContent navItems={navItems} isActive={isActive} onLogout={handleLogout} />
      </aside>

      {/* Mobile sidebar */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={closeMobileSidebar}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-text text-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={closeMobileSidebar}
              >
                <span className="sr-only">Close sidebar</span>
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <SidebarContent navItems={navItems} isActive={isActive} onLogout={handleLogout} />
          </div>
        </div>
      )}
    </>
  );
}

interface SidebarContentProps {
  navItems: { title: string; items: { name: string; path: string; icon: JSX.Element }[] }[];
  isActive: (path: string) => boolean;
  onLogout: () => void;
}

function SidebarContent({ navItems, isActive, onLogout }: SidebarContentProps) {
  return (
    <>
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-white to-primary bg-clip-text">
            <h1 className="text-2xl font-bold text-transparent">MONITORA UTI</h1>
          </div>
        </div>
      </div>

      <nav className="mt-6">
        {navItems.map((section, idx) => (
          <div key={idx}>
            <div className="px-4 py-2 text-gray-400 text-xs uppercase tracking-wider">
              {section.title}
            </div>

            {section.items.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={(e) => {
                  if (isActive(item.path)) {
                    e.preventDefault();
                  }
                }}
                className={cn(
                  "flex items-center px-6 py-3 text-gray-300 hover:bg-opacity-5 hover:bg-white transition-colors duration-200",
                  isActive(item.path) && "bg-[rgba(74,144,226,0.15)] border-l-4 border-primary"
                )}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </div>
        ))}

        <div className="px-4 py-2 mt-4 text-gray-400 text-xs uppercase tracking-wider">
          Sessão
        </div>

        <button
          onClick={onLogout}
          className="w-full text-left flex items-center px-6 py-3 text-gray-300 hover:bg-opacity-5 hover:bg-white transition-colors duration-200"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sair
        </button>
      </nav>
    </>
  );
}
