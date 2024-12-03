import axios from 'axios';
import {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useContext,
} from 'react';

interface AuthContextType {
  currentUser: any;
  login: (inputs: any) => Promise<void>;
  logout: () => Promise<void>;
}
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<any | null>(
    JSON.parse(localStorage.getItem('user')!) || null,
  );

  const login = async (inputs: any) => {
    try {
      const res = await axios.post(
        'https://spoturf-backend.onrender.com/client/auth/login',
        inputs,
        {
          withCredentials: true,
        },
      );
      console.log('Login response:', res.data); // Check if the response has valid data
      setCurrentUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
    } catch (err) {
      console.error('Login failed:', err);
      alert('Login failed. Please try again.');
    }
  };

  const logout = async () => {
    try {
      await axios.post('https://spoturf-backend.onrender.com/client/auth/logout', {});
      setCurrentUser(null);
      localStorage.removeItem('user');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
