import { useState, ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const closeMobileSidebar = () => {
    setIsMobileSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        isMobileSidebarOpen={isMobileSidebarOpen}
        closeMobileSidebar={closeMobileSidebar}
      />
      
      <div className="flex-1 flex flex-col min-h-screen w-full md:pl-72">
        <Header toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto bg-background w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
