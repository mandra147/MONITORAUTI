
import { useCallback } from 'react';
import { useLocation } from 'wouter';
import { Bed } from '@/types';
import { cn } from '@/lib/utils';
import { Activity, Heart, Stethoscope, Brain, Plus, User, Calendar } from 'lucide-react';
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

  const getStatusColor = useCallback(() => {
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
        return 'bg-gray-300';
    }
  }, [bed.status]);

  const getDiagnosisIcon = useCallback(() => {
    if (!bed.patient || !bed.patient.mainDiagnosis) return null;

    const diagnosis = bed.patient.mainDiagnosis.toLowerCase();

    if (diagnosis.includes('pneumonia') || diagnosis.includes('pulm')) {
      return <Activity className="h-5 w-5 text-blue-400" />;
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

  const getStatusText = useCallback(() => {
    switch (bed.status) {
      case 'critical':
        return 'Crítico';
      case 'attention':
        return 'Em observação';
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
    navigate('/add-patient');
  };

  return (
    <div
      className={cn(
        "relative backdrop-blur-sm bg-card/60 rounded-xl shadow-lg overflow-hidden h-full",
        "transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
        bed.status === 'available' ? 'border border-gray-200 dark:border-gray-800' : `border-l-4 ${getBorderColor()}`
      )}
    >
      {/* Status indicator */}
      <div className={`absolute top-3 right-3 w-3 h-3 rounded-full ${getStatusColor()}`}></div>
      
      <div className="p-5 flex flex-col h-full">
        <div className="mb-3">
          <h3 className="font-bold text-lg">Leito {bed.bedNumber}</h3>
        </div>

        {bed.status === 'available' ? (
          <div className="flex flex-col items-center justify-center flex-grow py-6">
            <div className="text-center mb-6 text-muted-foreground">
              Leito Disponível
            </div>
            <Button 
              onClick={handleAddPatient}
              variant="default"
              className="w-full justify-center gap-2 py-5 rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <Plus className="h-4 w-4" />
              Adicionar Paciente
            </Button>
          </div>
        ) : (
          <>
            {bed.patient && (
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{bed.patient.name}</h4>
                      <p className="text-xs text-muted-foreground">{bed.patient.age} anos</p>
                    </div>
                  </div>
                </div>
                
                {/* Diagnosis with icon - prominently displayed */}
                <div className="mb-4 p-3 bg-card/80 rounded-lg border border-border/50 flex items-center gap-3">
                  <div className="p-2 rounded-full bg-primary/10">
                    {getDiagnosisIcon()}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Diagnóstico</p>
                    <p className="font-medium text-sm line-clamp-1">{bed.patient.mainDiagnosis}</p>
                  </div>
                </div>

                <div className="flex items-center mt-auto mb-4 gap-2">
                  <div className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10">
                    <Calendar className="h-3.5 w-3.5 text-primary" />
                    <span>{bed.patient.daysHospitalized} {bed.patient.daysHospitalized === 1 ? 'dia' : 'dias'}</span>
                  </div>
                  <div className="text-xs px-3 py-1.5 rounded-full bg-card">
                    <span className="text-muted-foreground">{getStatusText()}</span>
                  </div>
                </div>

                <Button 
                  variant="secondary" 
                  className="w-full justify-center py-5 rounded-lg shadow-sm hover:shadow transition-all"
                  onClick={handlePatientDetails}
                >
                  Ver Detalhes
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
