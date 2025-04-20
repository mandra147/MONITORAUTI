import { useCallback } from 'react';
import { useLocation } from 'wouter';
import { Bed } from '@/types';
import { cn } from '@/lib/utils';

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

  const handleClick = () => {
    if (bed.status !== 'available' && bed.patient) {
      navigate(`/patient/${bed.patient.id}`);
    }
  };

  return (
    <div 
      className={cn(
        "bg-white rounded-lg shadow-md overflow-hidden border-t-4 cursor-pointer transform transition-all duration-200 hover:-translate-y-1 hover:shadow-lg",
        getBorderColor()
      )}
      onClick={handleClick}
    >
      {bed.status === 'available' ? (
        <div className="p-4 flex flex-col items-center justify-center" style={{ height: '234px' }}>
          <div className="text-center">
            <svg 
              className={cn("h-12 w-12 mx-auto", "text-available")}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">
              {bed.bedNumber}
            </h3>
            <p className="mt-1 text-sm text-gray-500">Leito Disponível</p>
            <p className="mt-1 text-xs text-gray-400">Disponível</p>
            <button className="mt-4 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              Admitir Paciente
            </button>
          </div>
        </div>
      ) : (
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center">
                <span className="font-medium text-gray-900">{bed.bedNumber}</span>
                <span className="ml-2 text-xs text-gray-500">Ala {bed.wing} • {bed.floor}º andar</span>
              </div>
            </div>
            <span className={cn(
              "px-2 py-1 rounded-md text-xs font-medium text-white",
              getStatusBadgeClass()
            )}>
              {getStatusText()}
            </span>
          </div>
          
          {bed.patient && (
            <>
              <div className="mt-4">
                <h3 className="text-lg font-medium text-gray-900">{bed.patient.name}</h3>
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <span>{bed.patient.age} anos</span>
                  <span className="mx-1">•</span>
                  <span>{bed.patient.gender === 'male' ? 'Masculino' : bed.patient.gender === 'female' ? 'Feminino' : 'Outro'}</span>
                </div>
              </div>
              
              <div className="mt-4 border-t border-gray-200 pt-3">
                <div className="text-sm font-medium text-gray-500">Diagnóstico principal:</div>
                <div className="text-sm text-gray-900 mt-1">
                  {bed.patient.mainDiagnosis}
                  {bed.patient.diagnosisCode && ` (${bed.patient.diagnosisCode})`}
                </div>
              </div>
              
              <div className="mt-4 flex justify-between">
                <div>
                  <div className="text-xs text-gray-500">Internado há</div>
                  <div className="text-sm font-medium text-gray-900">
                    {bed.patient.daysHospitalized} {bed.patient.daysHospitalized === 1 ? 'dia' : 'dias'}
                  </div>
                </div>
                {bed.patient.sapsScore && (
                  <div>
                    <div className="text-xs text-gray-500">SAPS 3</div>
                    <div className={cn(
                      "text-sm font-medium",
                      {
                        'text-critical': bed.status === 'critical',
                        'text-attention': bed.status === 'attention',
                        'text-stable': bed.status === 'stable',
                      }
                    )}>
                      {bed.patient.sapsScore} pts
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
