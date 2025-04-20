import { useContext, useEffect } from 'react';
import { useLocation } from 'wouter';
import { AuthContext } from '@/context/AuthProvider';
import { LoginForm } from '@/components/auth/LoginForm';
import { Card, CardContent } from '@/components/ui/card';

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  const [_, navigate] = useLocation();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Don't render anything while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="animate-pulse h-16 w-16 rounded-full bg-primary/20"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4 shadow-lg">
        <CardContent className="pt-8 pb-8">
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
