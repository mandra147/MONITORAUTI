import { useState, useContext, useEffect } from 'react';
import { useLocation } from 'wouter';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AuthContext } from '@/context/AuthProvider';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Activity, LockKeyhole, LogIn, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Esquema de validação para login
const loginSchema = z.object({
  username: z.string().min(3, 'Nome de usuário deve ter pelo menos 3 caracteres'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

// Esquema de validação para registro
const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  username: z.string().min(3, 'Nome de usuário deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  role: z.enum(['admin', 'doctor', 'nurse']).default('doctor'),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<string>('login');
  const [location, navigate] = useLocation();
  const { toast } = useToast();
  const { user, isLoading, login, logout } = useContext(AuthContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Se já estiver autenticado, redireciona para o dashboard
  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  // Form de login
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  // Form de registro
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      username: '',
      email: '',
      password: '',
      role: 'doctor',
    },
  });

  // Submissão do formulário de login
  const onLoginSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      await login(data.username, data.password);
      toast({
        title: 'Login realizado com sucesso',
        description: 'Bem-vindo de volta ao sistema MONITORA UTI',
      });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Erro ao fazer login',
        description: 'Usuário ou senha incorretos',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submissão do formulário de registro
  const onRegisterSubmit = async (data: RegisterFormValues) => {
    setIsSubmitting(true);
    try {
      // Implemente o registro aqui quando estiver disponível
      toast({
        title: 'Funcionalidade não implementada',
        description: 'O registro de novos usuários ainda não está disponível',
        variant: 'destructive',
      });
      // Em uma implementação real, você adicionaria:
      // await register(data);
    } catch (error) {
      console.error('Register error:', error);
      toast({
        title: 'Erro ao registrar',
        description: 'Não foi possível criar sua conta',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Renderiza os formulários de autenticação
  const renderAuthForms = () => (
    <Tabs 
      defaultValue="login" 
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full"
    >
      <TabsList className="grid w-full grid-cols-2 mb-6">
        <TabsTrigger value="login" disabled={isSubmitting} className="text-sm">
          Login
        </TabsTrigger>
        <TabsTrigger value="register" disabled={isSubmitting} className="text-sm">
          Registro
        </TabsTrigger>
      </TabsList>

      {/* Login Form */}
      <TabsContent value="login" className="mt-0">
        <Card className="border-0 shadow-none">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
            <CardDescription>
              Entre com suas credenciais para acessar o sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <Form {...loginForm}>
              <form className="space-y-4" onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
                <FormField
                  control={loginForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome de usuário</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite seu nome de usuário" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Digite sua senha" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Autenticando...
                    </>
                  ) : (
                    <>
                      <LogIn className="mr-2 h-4 w-4" />
                      Entrar
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="px-0 pt-4 justify-between flex-col items-start sm:flex-row">
            <div className="text-xs text-muted-foreground mb-2 sm:mb-0">
              Não tem uma conta?{' '}
              <button 
                type="button" 
                className="text-primary hover:underline font-medium"
                onClick={() => setActiveTab('register')}
              >
                Registre-se
              </button>
            </div>
            <button 
              type="button" 
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Esqueceu a senha?
            </button>
          </CardFooter>
        </Card>
      </TabsContent>

      {/* Register Form */}
      <TabsContent value="register" className="mt-0">
        <Card className="border-0 shadow-none">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="text-2xl font-bold">Criar Conta</CardTitle>
            <CardDescription>
              Preencha os dados abaixo para criar uma nova conta
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <Form {...registerForm}>
              <form className="space-y-4" onSubmit={registerForm.handleSubmit(onRegisterSubmit)}>
                <FormField
                  control={registerForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite seu nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome de usuário</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite um nome de usuário" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Digite seu email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Crie uma senha segura" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={registerForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Função</FormLabel>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="doctor">Médico</option>
                        <option value="nurse">Enfermeiro</option>
                        <option value="admin">Administrador</option>
                      </select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Criando conta...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Criar conta
                    </>
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="px-0 pt-4">
            <div className="text-xs text-muted-foreground">
              Já tem uma conta?{' '}
              <button 
                type="button" 
                className="text-primary hover:underline font-medium"
                onClick={() => setActiveTab('login')}
              >
                Faça login
              </button>
            </div>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );

  // Página de autenticação com design inspirado nas imagens de referência
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-muted/30">
      {/* Hero section (lado direito em telas grandes, topo em telas pequenas) */}
      <div className="lg:w-1/2 bg-primary p-8 lg:p-16 text-white order-1 lg:order-2">
        <div className="flex flex-col h-full justify-center max-w-md mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <Activity className="h-8 w-8" />
            <h1 className="text-2xl font-bold">MONITORA UTI</h1>
          </div>
          
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Sistema Avançado de Monitoramento para UTI
          </h2>
          
          <p className="mb-6 text-white/80">
            Transforme o atendimento ao paciente com nossa plataforma de monitoramento em tempo real, 
            projetada para otimizar o fluxo de trabalho clínico e melhorar os resultados dos pacientes.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="bg-white/10 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-5 w-5 text-white" />
                <h3 className="font-medium">Monitoramento Avançado</h3>
              </div>
              <p className="text-sm text-white/70">
                Acompanhe sinais vitais e alertas em tempo real para respostas rápidas.
              </p>
            </div>
            
            <div className="bg-white/10 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <LockKeyhole className="h-5 w-5 text-white" />
                <h3 className="font-medium">Acesso Seguro</h3>
              </div>
              <p className="text-sm text-white/70">
                Protocolos de segurança avançados para proteger dados sensíveis dos pacientes.
              </p>
            </div>
          </div>
          
          <p className="text-white/60 text-sm mt-auto">
            © 2025 MONITORA UTI. Todos os direitos reservados.
          </p>
        </div>
      </div>
      
      {/* Authentication forms (lado esquerdo em telas grandes, abaixo em telas pequenas) */}
      <div className="lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center order-2 lg:order-1">
        <div className="w-full max-w-md mx-auto">
          {renderAuthForms()}
        </div>
      </div>
    </div>
  );
}