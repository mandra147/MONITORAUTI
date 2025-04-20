import { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { BedCard } from './BedCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BedStatus } from '@/types';

export function Dashboard() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const { data: beds = [], isLoading, error } = useQuery({
    queryKey: ['/api/dashboard'],
    refetchInterval: 30000, // Refetch every 30 seconds
  });
  
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
        acc[bed.status as BedStatus] = (acc[bed.status as BedStatus] || 0) + 1;
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

  const updateTime = new Date().toLocaleTimeString('pt-BR');

  if (error) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Erro ao carregar dados
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    Ocorreu um erro ao carregar os dados. Por favor, tente novamente mais tarde.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">UTI - Visão Geral</h1>
          
          <div className="flex space-x-4">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                className="block w-full pl-10 pr-4 py-2"
                placeholder="Buscar leito ou paciente"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>

            <Select value={statusFilter} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-[180px]">
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
        </div>

        {isLoading ? (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md h-[234px] animate-pulse">
                <div className="h-1 bg-gray-200 rounded-t-lg"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBeds.map((bed: any) => (
              <BedCard key={bed.id} bed={bed} />
            ))}
          </div>
        )}
        
        <div className="mt-8 flex justify-between items-center">
          <div className="flex space-x-6">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-critical"></div>
              <span className="ml-2 text-sm text-gray-600">Crítico ({statusCounts.critical})</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-attention"></div>
              <span className="ml-2 text-sm text-gray-600">Atenção ({statusCounts.attention})</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-stable"></div>
              <span className="ml-2 text-sm text-gray-600">Estável ({statusCounts.stable})</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-available"></div>
              <span className="ml-2 text-sm text-gray-600">Disponível ({statusCounts.available})</span>
            </div>
          </div>
          
          <div className="text-sm text-gray-500">
            Última atualização: {updateTime}
          </div>
        </div>
      </div>
    </div>
  );
}
