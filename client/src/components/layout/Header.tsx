import { useState, useEffect, useContext } from 'react';
import { Bell, Menu } from 'lucide-react';
import { AuthContext } from '@/context/AuthProvider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getInitials } from '@/lib/utils';

interface HeaderProps {
  toggleSidebar: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  const [currentTime, setCurrentTime] = useState<string>('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Update time every second
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('pt-BR'));
    };

    // Initial update
    updateTime();

    // Set interval for updates
    const intervalId = setInterval(updateTime, 1000);

    // Clean up interval
    return () => clearInterval(intervalId);
  }, []);

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-gray-500 focus:outline-none"
              onClick={toggleSidebar}
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open sidebar</span>
            </Button>

            <div className="flex-shrink-0 flex items-center">
              <div className="md:hidden flex items-center">
                <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  MONITORA UTI
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center">
            <div className="flex-shrink-0 mr-4">
              <div className="text-lg font-semibold" data-testid="current-time">
                {currentTime}
              </div>
            </div>

            <div className="ml-3 relative">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Button variant="ghost" size="icon" className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none">
                    <span className="sr-only">View notifications</span>
                    <Bell className="h-6 w-6" />
                  </Button>
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400"></span>
                </div>

                <div className="flex items-center">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="" alt={user?.name || "User avatar"} />
                    <AvatarFallback>{user ? getInitials(user.name) : "U"}</AvatarFallback>
                  </Avatar>
                  <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">
                    {user?.name || 'User'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
