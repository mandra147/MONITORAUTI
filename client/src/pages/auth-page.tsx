import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { AuthContext } from '@/context/AuthProvider';
import { LoginForm } from '@/components/auth/LoginForm';
import { useTheme } from 'next-themes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AuthPage() {
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  const [_, navigate] = useLocation();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('login');

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="animate-pulse h-16 w-16 rounded-full bg-primary/20"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Auth Form Section */}
      <div className="w-full md:w-1/2 flex flex-col p-8 md:p-12 justify-center">
        <div className="absolute top-4 right-4">
          <button 
            onClick={toggleTheme} 
            className="p-2 rounded-full hover:bg-muted transition-colors"
            aria-label="Alternar tema"
          >
            {theme === 'dark' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
            )}
          </button>
        </div>

        <div className="flex items-center mb-8">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold text-primary">MONITORAUTI</h1>
            <p className="text-xs text-muted-foreground">Sistema Avançado de Monitoramento</p>
          </div>
        </div>

        <Tabs defaultValue="login" className="w-full max-w-md mx-auto" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="login">Entrar</TabsTrigger>
            <TabsTrigger value="register">Registrar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
          
          <TabsContent value="register">
            {/* Will be implemented later */}
            <div className="bg-muted p-4 rounded text-center">
              <p>Contate o administrador do sistema para criar uma nova conta.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Hero Section */}
      <div className="hidden md:flex md:w-1/2 bg-primary/5 relative overflow-hidden">
        <div className="relative z-10 flex flex-col justify-center p-12 text-center md:text-left w-full">
          <h2 className="text-3xl font-bold mb-4">
            Monitoramento de UTI <span className="text-primary">Inteligente</span>
          </h2>
          <p className="text-muted-foreground max-w-md mb-6">
            Acesse o sistema completo para monitoramento avançado em tempo real, análise de dados clínicos e suporte à decisão médica.
          </p>
          <ul className="space-y-2 text-muted-foreground max-w-md mx-auto md:mx-0">
            <li className="flex items-center">
              <svg className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Acompanhamento em tempo real de todos os pacientes
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Alertas inteligentes para detecção precoce de riscos
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Interface otimizada para profissionais de saúde
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Análise avançada de dados clínicos
            </li>
          </ul>
        </div>
        
        {/* Abstract background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>
      </div>
    </div>
  );
}