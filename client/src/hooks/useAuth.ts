// hooks/useAuth.ts
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { loginStart, loginSuccess, loginFailure, logout } from '../store/slices/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isLoading, error } = useSelector((state: RootState) => state.auth);

  // Login function for both user & admin
  const login = async (email: string, password: string) => {
    dispatch(loginStart());
    
    try {
      // Decide API endpoint based on email (or any logic)
      const endpoint = email.includes('admin')
        ? 'https://e-comm-backend-server.onrender.com/api/admins/login'
        : 'https://e-comm-backend-server.onrender.com/api/users/login';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Login failed');

      // Dispatch success with returned user/admin object
      dispatch(loginSuccess({
        user: data.admin || data.user, // admin or user object
        token: data.token,
      }));

      return { success: true };
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      dispatch(loginFailure(errorMessage));
      return { success: false, error: errorMessage };
    }
  };

  // Register function (users only, admin registration via backend separately)
  const register = async (userData: any) => {
    dispatch(loginStart());

    try {
      const response = await fetch(
        'https://e-comm-backend-server.onrender.com/api/users/register',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(userData),
        }
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Registration failed');

      // Do NOT auto-login after registration; require explicit login
      return { success: true };
    } catch (err: unknown) {
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
    isAdmin: user?.role === 'admin' || false, 
  };
};
