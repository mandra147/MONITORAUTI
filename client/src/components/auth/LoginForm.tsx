import { useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation } from 'wouter';
import { AuthContext } from '@/context/AuthProvider';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

const loginFormSchema = z.object({
  username: z.string().min(3, { message: 'Usuário deve ter no mínimo 3 caracteres' }),
  password: z.string().min(6, { message: 'Senha deve ter no mínimo 6 caracteres' }),
});

type LoginFormValues = z.infer<typeof loginFormSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [_, navigate] = useLocation();
  const { login } = useContext(AuthContext);
  const { toast } = useToast();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      await login(data.username, data.password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Falha na autenticação. Por favor, tente novamente.';
      toast({
        title: 'Falha na Autenticação',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold mb-6">Bem-vindo de volta</h2>
      <p className="text-muted-foreground mb-8">Entre com suas credenciais para acessar o sistema</p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Usuário</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Digite seu nome de usuário" 
                    {...field}
                    className="h-11" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel>Senha</FormLabel>
                  <a href="#" className="text-xs text-primary hover:text-primary/80">
                    Esqueceu sua senha?
                  </a>
                </div>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="Digite sua senha" 
                    {...field}
                    className="h-11" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full h-11 mt-2 font-medium" 
            disabled={isLoading}
          >
            {isLoading ? 'Autenticando...' : 'Entrar no Sistema'}
          </Button>
        </form>
      </Form>

      <div className="mt-8 pt-6 border-t border-border text-center">
        <p className="text-sm text-muted-foreground">
          Precisa de ajuda? Entre em contato com o <span className="text-primary">Suporte Técnico</span>
        </p>
      </div>
    </div>
  );
}
