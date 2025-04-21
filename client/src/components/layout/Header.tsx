import { useState, useEffect, useContext } from 'react';
import { Bell, Menu } from 'lucide-react';
import { AuthContext } from '@/context/AuthProvider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getInitials } from '@/lib/utils';
import { useTheme } from 'next-themes';

interface HeaderProps {
  toggleSidebar: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState<string>('');
  const { user } = useContext(AuthContext);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    // Update time every second
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('pt-BR', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };

    // Initial update
    updateTime();

    // Set interval for updates
    const intervalId = setInterval(updateTime, 1000);

    // Clean up interval
    return () => clearInterval(intervalId);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-14 sm:h-16 items-center gap-2 sm:gap-4 border-b bg-background/95 backdrop-blur px-2 sm:px-4 md:px-6">
      <div className="container flex justify-between items-center">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden mr-2 text-muted-foreground"
            onClick={toggleSidebar}
            aria-label="Abrir menu"
          >
            <Menu className="h-5 w-5" />
          </Button>

          <div className="hidden md:block">
            <h1 className="text-xl font-bold text-primary">MONITORAUTI</h1>
            <p className="text-xs text-muted-foreground">Sistema Avançado de Monitoramento</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {currentTime}
          </div>

          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Alternar tema"
          >
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            )}
          </button>

          <div className="relative">
            <Button variant="ghost" size="icon" className="text-muted-foreground rounded-full">
              <Bell className="h-5 w-5" />
            </Button>
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
          </div>

          <div className="flex items-center gap-2 border-l pl-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" alt={user?.name || "Perfil do usuário"} />
              <AvatarFallback>{user ? getInitials(user.name) : "U"}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium hidden md:block">
              {user?.name || 'Usuário'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}