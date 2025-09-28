// Custom hook for authentication
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { loginStart, loginSuccess, loginFailure, logout } from '../store/slices/authSlice';
import { mockUsers } from '../data/mockData';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isLoading, error } = useSelector((state: RootState) => state.auth);

  const login = async (email: string, password: string) => {
    dispatch(loginStart());
    
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/login', { ... });
      
      // Mock authentication logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUser = mockUsers.find(u => u.email === email);
      if (mockUser && password === 'password123') {
        const token = `mock-token-${mockUser.id}`;
        dispatch(loginSuccess({ user: mockUser, token }));
        return { success: true };
      } else {
        dispatch(loginFailure('Invalid email or password'));
        return { success: false, error: 'Invalid email or password' };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      dispatch(loginFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData: any) => {
    dispatch(loginStart());
    
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/register', { ... });
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser = {
        id: Date.now().toString(),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        isAdmin: false,
        isBlocked: false,
        createdAt: new Date().toISOString(),
      };
      
      const token = `mock-token-${newUser.id}`;
      dispatch(loginSuccess({ user: newUser, token }));
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      dispatch(loginFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };

  const logoutUser = () => {
    dispatch(logout());
  };

  return {
    user,
    token,
    isLoading,
    error,
    login,
    register,
    logout: logoutUser,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
  };
};