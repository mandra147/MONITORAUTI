import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BedStatus } from '@/types';
import { useTheme } from 'next-themes';

// Este é o novo componente BedCard, seguindo o design de referência
function BedCard({ bed }: { bed: any }) {
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'critical':
        return 'bg-card dark:bg-card border-t-4 border-red-500';
      case 'attention':
        return 'bg-card dark:bg-card border-t-4 border-amber-500';
      case 'stable':
        return 'bg-card dark:bg-card border-t-4 border-green-500';
      case 'available':
        return 'bg-card dark:bg-card border-t-4 border-blue-300 dark:border-blue-500';
      default:
        return 'bg-card dark:bg-card border-t-4 border-muted';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'critical':
        return 'Crítico';
      case 'attention':
        return 'Atenção';
      case 'stable':
        return 'Estável';
      case 'available':
        return 'Vago';
      default:
        return 'Desconhecido';
    }
  };

  // Se o leito estiver disponível, mostramos uma mensagem simplificada
  if (!bed.patient || bed.status === 'available') {
    return (
      <div className={`rounded-md shadow-sm ${getStatusClass(bed.status)}`}>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold">Leito {bed.bedNumber}</h3>
            <span className="text-xs text-muted-foreground">
              Ala {bed.wing} • {bed.floor}º andar
            </span>
          </div>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <span className="text-sm font-medium text-muted-foreground mb-2">Leito Disponível</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-md shadow-sm ${getStatusClass(bed.status)}`}>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold">Leito {bed.bedNumber}</h3>
          <span className="text-xs text-muted-foreground">
            Ala {bed.wing} • {bed.floor}º andar
          </span>
        </div>

        <div className="pt-1">
          <h4 className="font-medium">{bed.patient.name}</h4>
          <div className="flex items-center text-xs text-muted-foreground mt-1 space-x-1">
            <span>{bed.patient.age} anos</span>
            <span>•</span>
            <span>{bed.patient.mainDiagnosis}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-4 text-xs">
          <div className="flex flex-col">
            <span className="text-muted-foreground">Tempo de internação</span>
            <span className="font-medium">{bed.patient.daysHospitalized || 0} dias</span>
          </div>

          <div className="flex flex-col text-right">
            <span className="text-muted-foreground">Gravidade</span>
            <span className="font-medium">
              {bed.status === 'critical' ? 'Alta' : 
               bed.status === 'attention' ? 'Moderada' : 
               bed.status === 'stable' ? 'Baixa' : 'Normal'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Dashboard() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Função para gerar dados fictícios de 10 leitos (501-510)
  const generateMockBeds = () => {
    const statuses = ['critical', 'attention', 'stable', 'available'];
    const mockBeds = [];
    
    for (let i = 1; i <= 10; i++) {
      const bedNumber = `50${i}`;
      const status = statuses[Math.floor(Math.random() * 4)]; // Status aleatório
      const isOccupied = status !== 'available';
      
      mockBeds.push({
        id: i.toString(),
        bedNumber,
        status,
        wing: i <= 5 ? 'A' : 'B',
        floor: 5,
        patient: isOccupied ? {
          id: `patient-${i}`,
          name: `Paciente ${i}`,
          age: Math.floor(Math.random() * 50) + 20, // Idade entre 20-70
          gender: Math.random() > 0.5 ? 'male' : 'female',
          mainDiagnosis: ['Pneumonia', 'Sepse', 'Insuficiência Cardíaca', 'AVC', 'Politrauma'][Math.floor(Math.random() * 5)],
          daysHospitalized: Math.floor(Math.random() * 20) + 1,
          sapsScore: status === 'critical' ? 70 : status === 'attention' ? 50 : 30
        } : null
      });
    }
    
    return mockBeds;
  };

  // Usar dados mockados se não existirem dados reais
  const { data: apiData = [], isLoading, error } = useQuery({
    queryKey: ['/api/dashboard'],
    refetchInterval: 30000, // Refetch every 30 seconds
  });
  
  // Se tivermos menos de 10 leitos, complementar com dados mockados
  const beds = useMemo(() => {
    const bedsArray = Array.isArray(apiData) ? apiData : [];
    if (bedsArray.length >= 10) return bedsArray.slice(0, 10); // Limitar a 10 leitos
    
    const mockBeds = generateMockBeds();
    return [...bedsArray, ...mockBeds.slice(bedsArray.length)].slice(0, 10);
  }, [apiData]);

  // Ensure beds is always an array, even if API returns an object or undefined
  const bedsArray = Array.isArray(beds) ? beds : [];

  const filteredBeds = useMemo(() => {
    if (!bedsArray || bedsArray.length === 0) return [];

    return bedsArray.filter((bed: any) => {
      // Filter by status (ignore if "all" is selected)
      if (statusFilter && statusFilter !== 'all' && bed.status !== statusFilter) {
        return false;
      }

      // Filter by search term (bed number or patient name)
      if (searchTerm) {
        const searchTermLower = searchTerm.toLowerCase();
        const bedNumberMatch = bed.bedNumber.toLowerCase().includes(searchTermLower);
        const patientNameMatch = bed.patient && bed.patient.name 
          ? bed.patient.name.toLowerCase().includes(searchTermLower)
          : false;

        return bedNumberMatch || patientNameMatch;
      }

      return true;
    });
  }, [bedsArray, searchTerm, statusFilter]);

  const statusCounts = useMemo(() => {
    if (!bedsArray || bedsArray.length === 0) return { critical: 0, attention: 0, stable: 0, available: 0 };

    return bedsArray.reduce(
      (acc: Record<BedStatus, number>, bed: any) => {
        const status = bed.status as BedStatus;
        if (status) {
          acc[status] = (acc[status] || 0) + 1;
        }
        return acc;
      },
      { critical: 0, attention: 0, stable: 0, available: 0 }
    );
  }, [bedsArray]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
  };

  const updateTime = new Date().toLocaleTimeString('pt-BR', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit'
  });

  if (error) {
    return (
      <div className="container p-6">
        <div className="bg-destructive/10 p-4 rounded-md border border-destructive/30">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-destructive" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-destructive">
                Erro ao carregar dados
              </h3>
              <div className="mt-2 text-sm">
                <p>
                  Ocorreu um erro ao carregar os dados. Por favor, tente novamente mais tarde.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold mb-1">Visão Geral dos Leitos</h1>
          <p className="text-muted-foreground text-sm">
            {bedsArray.length} leitos monitorados em tempo real
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-sm text-muted-foreground">
            {updateTime}
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
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            type="text"
            className="pl-10"
            placeholder="Buscar leito ou paciente"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>

        <Select value={statusFilter} onValueChange={handleStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Todos os status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="critical">Crítico</SelectItem>
            <SelectItem value="attention">Atenção</SelectItem>
            <SelectItem value="stable">Estável</SelectItem>
            <SelectItem value="available">Disponível</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="mb-4 flex flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-critical"></span>
          <span className="text-xs">Crítico</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-attention"></span>
          <span className="text-xs">Atenção</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-stable"></span>
          <span className="text-xs">Estável</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-3 h-3 rounded-full bg-available"></span>
          <span className="text-xs">Disponível</span>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {Array(10).fill(0).map((_, i) => (
            <div key={i} className="bg-card/50 rounded-md shadow-sm border border-border/50 h-[220px] animate-pulse">
              <div className="p-4 space-y-3">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-5/6"></div>
                <div className="h-4 bg-muted rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {filteredBeds.slice(0, 5).map((bed: any) => (
              <BedCard key={bed.id} bed={bed} />
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-4">
            {filteredBeds.slice(5, 10).map((bed: any) => (
              <BedCard key={bed.id} bed={bed} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}