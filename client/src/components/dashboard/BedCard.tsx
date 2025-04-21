
import { useCallback } from 'react';
import { useLocation } from 'wouter';
import { Bed } from '@/types';
import { cn } from '@/lib/utils';
import { Activity, Heart, Stethoscope, Lungs, Brain, Plus, User, Calendar } from 'lucide-react';
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
      return <Lungs className="h-4 w-4 text-blue-400" />;
    } else if (diagnosis.includes('card') || diagnosis.includes('coração')) {
      return <Heart className="h-4 w-4 text-red-500" />;
    } else if (diagnosis.includes('avc') || diagnosis.includes('cerebr')) {
      return <Brain className="h-4 w-4 text-purple-500" />;
    } else if (diagnosis.includes('sepse') || diagnosis.includes('infec')) {
      return <Activity className="h-4 w-4 text-orange-500" />;
    } else {
      return <Stethoscope className="h-4 w-4 text-primary" />;
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
        "bg-card rounded-lg overflow-hidden border-t-4 h-full",
        "transition-all duration-200 ease hover:-translate-y-2 hover:shadow-[0_8px_16px_rgba(0,0,0,0.4)] cursor-pointer",
        getBorderColor()
      )}
    >
      <div className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-lg">Leito {bed.bedNumber}</h3>
          </div>
          <div className="text-xs text-muted-foreground">
            Ala {bed.wing} • {bed.floor}º andar
          </div>
        </div>

        {bed.status === 'available' ? (
          <div className="flex flex-col items-center justify-center flex-grow py-6">
            <div className="text-center mb-4 text-muted-foreground">
              <span className={`inline-block w-2 h-2 rounded-full ${getStatusColor()} mr-1.5`}></span>
              Leito Disponível
            </div>
            <Button 
              onClick={handleAddPatient}
              className="w-full justify-center transition-all duration-150 ease hover:brightness-110 hover:scale-[1.02]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Paciente
            </Button>
          </div>
        ) : (
          <>
            {bed.patient && (
              <>
                <div className="mb-3 flex justify-between">
                  <div>
                    <h3 className="font-medium">{bed.patient.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {bed.patient.age} anos
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className={`inline-block w-2 h-2 rounded-full ${getStatusColor()} mr-1.5`}></span>
                    <span className="text-xs">{getStatusText()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3 bg-card/30 p-2 rounded">
                  {getDiagnosisIcon()}
                  <div>
                    <p className="text-xs font-medium">
                      {bed.patient.mainDiagnosis}
                    </p>
                  </div>
                </div>

                <div className="flex items-center mt-auto mb-3 text-sm">
                  <div className="flex items-center gap-1.5 bg-card/30 px-2 py-1 rounded">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs">{bed.patient.daysHospitalized} {bed.patient.daysHospitalized === 1 ? 'dia' : 'dias'} na UTI</span>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full justify-center transition-all duration-150 ease hover:brightness-110 hover:scale-[1.02]"
                  onClick={handlePatientDetails}
                >
                  Ver Detalhes
                </Button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
