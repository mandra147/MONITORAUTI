
import { useCallback } from 'react';
import { useLocation } from 'wouter';
import { Bed } from '@/types';
import { cn } from '@/lib/utils';
import { Activity, Heart, Stethoscope, Calendar, Lungs, Brain, Plus, User } from 'lucide-react';
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

  const getDiagnosisIcon = useCallback(() => {
    if (!bed.patient || !bed.patient.mainDiagnosis) return null;
    
    const diagnosis = bed.patient.mainDiagnosis.toLowerCase();
    
    if (diagnosis.includes('pneumonia') || diagnosis.includes('pulm')) {
      return <Lungs className="h-5 w-5 text-primary" />;
    } else if (diagnosis.includes('card') || diagnosis.includes('coração')) {
      return <Heart className="h-5 w-5 text-red-500" />;
    } else if (diagnosis.includes('avc') || diagnosis.includes('cerebr')) {
      return <Brain className="h-5 w-5 text-purple-500" />;
    } else if (diagnosis.includes('sepse') || diagnosis.includes('infec')) {
      return <Activity className="h-5 w-5 text-orange-500" />;
    } else {
      return <Stethoscope className="h-5 w-5 text-primary" />;
    }
  }, [bed.patient]);

  const getStatusBadgeClass = useCallback(() => {
    switch (bed.status) {
      case 'critical':
        return 'bg-critical text-white';
      case 'attention':
        return 'bg-attention text-white';
      case 'stable':
        return 'bg-stable text-white';
      case 'available':
        return 'bg-available text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  }, [bed.status]);

  const getStatusText = useCallback(() => {
    switch (bed.status) {
      case 'critical':
        return 'Crítico';
      case 'attention':
        return 'Em observação';
      case 'stable':
        return 'Estável';
      case 'available':
        return 'Vago';
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
              <Plus className="w-6 h-6" />
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
                "ml-2 px-2 py-0.5 text-xs font-medium rounded-full",
                getStatusBadgeClass()
              )}>
                {getStatusText()}
              </span>
            </div>
          </div>
          
          {bed.patient && (
            <>
              <div className="mb-3 flex items-center gap-2">
                <div className="h-8 w-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                </div>
                <div>
                  <h3 className="font-semibold text-base">{bed.patient.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {bed.patient.age} anos
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 mb-4 bg-gray-50 dark:bg-gray-700/50 p-2 rounded">
                {getDiagnosisIcon()}
                <div className="flex-1">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Diagnóstico</p>
                  <p className="text-sm font-medium">
                    {bed.patient.mainDiagnosis}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-auto text-sm">
                <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                  <Calendar className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                  <span className="text-xs font-medium">{bed.patient.daysHospitalized} {bed.patient.daysHospitalized === 1 ? 'dia' : 'dias'} na UTI</span>
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
