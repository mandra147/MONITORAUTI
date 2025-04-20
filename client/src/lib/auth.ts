import { apiRequest } from './queryClient';
import { User } from '@/types';

const AUTH_TOKEN_KEY = 'UTI_AUTH_TOKEN';
const AUTH_USER_KEY = 'UTI_AUTH_USER';

export const login = async (username: string, password: string): Promise<User> => {
  const response = await apiRequest('POST', '/api/auth/login', { username, password });
  const userData = await response.json();
  
  if (userData && userData.token) {
    localStorage.setItem(AUTH_TOKEN_KEY, userData.token);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
  }
  
  return userData;
};

export const logout = async (): Promise<void> => {
  try {
    const token = getToken();
    if (token) {
      await apiRequest('POST', '/api/auth/logout', {});
    }
  } catch (error) {
    console.error('Logout error', error);
  } finally {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
  }
};

export const getToken = (): string | null => {
  return localStorage.getItem(AUTH_TOKEN_KEY);
};

export const getUser = (): User | null => {
  const userJSON = localStorage.getItem(AUTH_USER_KEY);
  if (!userJSON) return null;
  
  try {
    return JSON.parse(userJSON) as User;
  } catch (error) {
    console.error('Error parsing user data', error);
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};
