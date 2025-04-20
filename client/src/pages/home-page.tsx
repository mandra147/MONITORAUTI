import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-card border rounded-lg p-6 flex flex-col items-center text-center hover:shadow-md transition-shadow">
      <div className="text-primary mb-3">{icon}</div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
}

export default function HomePage() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-4 px-6 border-b flex items-center justify-between bg-background">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold text-primary">MONITORAUTI</h1>
          <p className="text-xs text-muted-foreground">Sistema Avançado de Monitoramento</p>
        </div>
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
      </header>

      <main className="flex-1">
        <section className="py-16 px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
            Monitoramento Inteligente em <span className="text-primary">Tempo Real</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mb-8">
            Sistema avançado de monitoramento para UTI, desenvolvido por médicos para médicos. 
            Transformando dados complexos em decisões precisas.
          </p>
          <Link href="/auth">
            <Button size="lg" className="px-8">
              Acessar Sistema
            </Button>
          </Link>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12h4l3 8 4-16 3 8h4"/>
                </svg>
              }
              title="Monitoramento em Tempo Real"
              description="Acompanhamento contínuo dos sinais vitais e parâmetros clínicos essenciais."
            />
            
            <FeatureCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="8"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
              }
              title="Análise Inteligente"
              description="Sistema inteligente de alertas e predição de eventos adversos."
            />
            
            <FeatureCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
              }
              title="Suporte à Decisão Clínica"
              description="Ferramentas avançadas para apoio à tomada de decisão baseada em evidências."
            />
          </div>
        </section>

        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              }
              title="Gestão da Equipe"
              description="Coordenação eficiente da equipe multidisciplinar."
            />
            
            <FeatureCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 3v18h18"/>
                  <path d="m19 9-5 5-4-4-3 3"/>
                </svg>
              }
              title="Análise de Tendências"
              description="Visualização clara da evolução clínica do paciente."
            />
            
            <FeatureCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V6a4 4 0 0 0-8-2c0-1.5-1.5-2-4-2-1.5 0-4 1-4 4v6c0 6 8 10 8 10Z"/>
                </svg>
              }
              title="Indicadores de Qualidade"
              description="Métricas e indicadores para gestão da qualidade assistencial."
            />
          </div>
        </section>
      </main>

      <footer className="py-4 px-6 border-t bg-background text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} MonitoraUTI. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}