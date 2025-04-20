import { useQuery } from '@tanstack/react-query';
import { Link, useRoute } from 'wouter';
import { 
  ChevronLeft, 
  AlertCircle, 
  Clock, 
  Activity, 
  Heart, 
  Stethoscope, 
  Droplet, 
  Utensils, 
  Microscope, 
  ShieldCheck 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function PatientInfo() {
  const [match, params] = useRoute('/patient/:id');
  const patientId = params?.id;

  const { data: patient, isLoading, error } = useQuery({
    queryKey: [`/api/patients/${patientId}`],
    enabled: !!patientId,
  });

  if (isLoading) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="h-40 bg-gray-200 rounded"></div>
              <div className="h-40 bg-gray-200 rounded"></div>
              <div className="h-40 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 p-4 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Erro ao carregar dados do paciente
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>
                    Ocorreu um erro ao carregar os dados do paciente. Por favor, tente novamente mais tarde.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-critical';
      case 'attention': return 'text-attention';
      case 'stable': return 'text-stable';
      default: return 'text-gray-700';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: ptBR });
    } catch {
      return 'Data desconhecida';
    }
  };

  const systemIcons = {
    'Neurológico': <Activity className="h-6 w-6" />,
    'Cardiovascular': <Heart className="h-6 w-6" />,
    'Respiratório': <Stethoscope className="h-6 w-6" />,
    'Renal': <Droplet className="h-6 w-6" />,
    'Gastrointestinal': <Utensils className="h-6 w-6" />,
    'Infeccioso': <Microscope className="h-6 w-6" />,
    'Profilaxias': <ShieldCheck className="h-6 w-6" />,
    'Diagnósticos': <Activity className="h-6 w-6" />,
  };

  const clinicalSystems = [
    'Neurológico', 'Cardiovascular', 'Respiratório', 'Renal', 
    'Gastrointestinal', 'Infeccioso', 'Profilaxias', 'Diagnósticos'
  ];

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col space-y-6">
          {/* Top Navigation Bar */}
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="outline" className="flex items-center space-x-2">
                  <ChevronLeft className="h-4 w-4" />
                  <span>Voltar ao Dashboard</span>
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">{patient.name}</h1>
                <div className="flex items-center mt-1 space-x-2">
                  <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                    D.I.: {formatDate(patient.admissionDate)}
                  </Badge>
                  {patient.bed && (
                    <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
                      Leito: {patient.bed.bedNumber}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline">Editar Dados</Button>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Diagnóstico de Admissão */}
            <Card className="bg-[#192841] text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Diagnóstico de Admissão</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{patient.mainDiagnosis}</p>
                {patient.diagnosisCode && (
                  <p className="text-sm text-gray-300 mt-1">CID-10: {patient.diagnosisCode}</p>
                )}
                <div className="mt-4 pt-2 border-t border-gray-700 flex justify-between text-xs">
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white p-0">
                    <span>Editar</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white p-0">
                    <span>Histórico</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Diagnósticos Progressos */}
            <Card className="bg-[#1C4441] text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Diagnósticos Progressos</CardTitle>
              </CardHeader>
              <CardContent>
                {patient.secondaryDiagnoses && patient.secondaryDiagnoses.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1">
                    {patient.secondaryDiagnoses.map((diagnosis: string, index: number) => (
                      <li key={index}>{diagnosis}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-300 italic">Sem diagnósticos progressos registrados</p>
                )}
              </CardContent>
            </Card>

            {/* Problemas Atuais */}
            <Card className="bg-[#3C1F2D] text-white border-l-4 border-red-500">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Problemas Atuais</CardTitle>
              </CardHeader>
              <CardContent>
                {patient.problems && patient.problems.length > 0 ? (
                  <ul className="space-y-2">
                    {patient.problems.map((problem: any) => (
                      <li key={problem.id} className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span>{problem.description}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-300 italic">Sem problemas registrados atualmente</p>
                )}
              </CardContent>
            </Card>

            {/* Tempo de Internação */}
            <Card className="bg-[#192841] text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Tempo de Internação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">
                  {patient.daysHospitalized} {patient.daysHospitalized === 1 ? 'dia' : 'dias'}
                </div>
                <div className="flex items-center mt-2">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="text-sm">
                    Previsão de alta: Não definida
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Pendências */}
            <Card className="bg-[#3C1F2D] text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Pendências</CardTitle>
              </CardHeader>
              <CardContent>
                {patient.pendingTasks && patient.pendingTasks.length > 0 ? (
                  <ul className="space-y-2">
                    {patient.pendingTasks.map((task: any) => (
                      <li key={task.id} className="text-sm border-l-2 border-yellow-500 pl-2">
                        <p>{task.description}</p>
                        {task.deadline && (
                          <p className="text-xs text-gray-300">
                            Prazo: {formatDate(task.deadline)}
                          </p>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-300 italic">Sem pendências registradas</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Exames Laboratoriais */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Exames Laboratoriais</CardTitle>
                <Button variant="outline" size="sm">Mais Detalhes</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Exame
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Valor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Referência
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Hemoglobina
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        (Sem dados)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        12-16 g/dL
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        -
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Leucócitos
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        (Sem dados)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        4.000-10.000/mm³
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        -
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        Plaquetas
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        (Sem dados)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        150.000-450.000/mm³
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        -
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Sistemas Clínicos */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Avaliação por Sistemas</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {clinicalSystems.map((system) => (
                <Card key={system} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="flex flex-col items-center justify-center h-20 p-4">
                    <div className={`mb-2 ${getStatusColor(patient.status || 'stable')}`}>
                      {systemIcons[system as keyof typeof systemIcons]}
                    </div>
                    <span className="text-sm font-medium">{system}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
