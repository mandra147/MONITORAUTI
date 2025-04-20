import { useContext, useEffect } from 'react';
import { useLocation } from 'wouter';
import { AuthContext } from '@/context/AuthProvider';
import { Layout } from '@/components/layout/Layout';
import { Dashboard } from '@/components/dashboard/Dashboard';

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  const [_, navigate] = useLocation();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Show loading indicator while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="animate-pulse h-16 w-16 rounded-full bg-primary/20"></div>
      </div>
    );
  }

  // Don't render anything if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
}
