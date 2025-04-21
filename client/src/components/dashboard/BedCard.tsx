
import { useCallback } from 'react';
import { useLocation } from 'wouter';
import { Bed } from '@/types';
import { cn } from '@/lib/utils';
import { Activity, Heart, Stethoscope, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BedCardProps {
  bed: Bed;
}

export function BedCard({ bed }: BedCardProps) {
  const [_, navigate] = useLocation();

  const getBorderColor = useCallback(() => {
    switch (bed.status) {
      case 'critical':
        return 'border-critical';
      case 'attention':
        return 'border-attention';
      case 'stable':
        return 'border-stable';
      case 'available':
        return 'border-available';
      default:
        return 'border-gray-300';
    }
  }, [bed.status]);

  const getStatusIcon = useCallback(() => {
    switch (bed.status) {
      case 'critical':
        return <Activity className="h-4 w-4 text-critical" />;
      case 'attention':
        return <Heart className="h-4 w-4 text-attention" />;
      case 'stable':
        return <Stethoscope className="h-4 w-4 text-stable" />;
      default:
        return null;
    }
  }, [bed.status]);

  const getStatusBadgeClass = useCallback(() => {
    switch (bed.status) {
      case 'critical':
        return 'bg-critical';
      case 'attention':
        return 'bg-attention';
      case 'stable':
        return 'bg-stable';
      case 'available':
        return 'bg-available';
      default:
        return 'bg-gray-500';
    }
  }, [bed.status]);

  const getStatusText = useCallback(() => {
    switch (bed.status) {
      case 'critical':
        return 'Crítico';
      case 'attention':
        return 'Atenção';
      case 'stable':
        return 'Estável';
      case 'available':
        return 'Disponível';
      default:
        return 'Desconhecido';
    }
  }, [bed.status]);

  const handlePatientDetails = () => {
    if (bed.status !== 'available' && bed.patient) {
      navigate(`/patient/${bed.patient.id}`);
    }
  };

  const handleAddPatient = () => {
    // Navegar para a página de adicionar paciente
    navigate('/add-patient');
  };

  return (
    <div 
      className={cn(
        "bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-t-4 h-full",
        "transition-all duration-200 hover:-translate-y-2 hover:shadow-[0_8px_16px_rgba(0,0,0,0.4)]",
        getBorderColor()
      )}
    >
      {bed.status === 'available' ? (
        <div className="p-4 flex flex-col items-center justify-center h-full" style={{ minHeight: '220px' }}>
          <div className="text-center">
            <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-300 mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h10z"></path>
              </svg>
            </span>
            <h3 className="text-xl font-semibold mb-2">
              Leito {bed.bedNumber}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Disponível para admissão
            </p>
            <Button 
              onClick={handleAddPatient}
              className="w-full justify-center"
            >
              Adicionar Paciente
            </Button>
          </div>
        </div>
      ) : (
        <div className="p-4 flex flex-col h-full" style={{ minHeight: '220px' }}>
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center">
              <span className="font-bold text-lg">Leito {bed.bedNumber}</span>
              <span className={cn(
                "ml-2 px-2 py-1 text-xs font-medium text-white rounded-full",
                getStatusBadgeClass()
              )}>
                {getStatusText()}
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Ala {bed.wing}
            </span>
          </div>
          
          {bed.patient && (
            <>
              <div className="mb-3">
                <h3 className="font-semibold text-lg">{bed.patient.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {bed.patient.age} anos
                </p>
              </div>
              
              <div className="flex items-start gap-2 mb-3">
                {getStatusIcon()}
                <div className="flex-1 text-sm">
                  <p className="font-medium">Diagnóstico:</p>
                  <p className="text-gray-600 dark:text-gray-300">
                    {bed.patient.mainDiagnosis}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-auto text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{bed.patient.daysHospitalized} {bed.patient.daysHospitalized === 1 ? 'dia' : 'dias'} na UTI</span>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="mt-4 w-full justify-center"
                onClick={handlePatientDetails}
              >
                Ver Detalhes
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
