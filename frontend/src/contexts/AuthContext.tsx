import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  name: string;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On mount, check session
    axios.get('/api/method/frappe.auth.get_logged_user').then(res => {
      if (res.data.message) {
        // Fetch user roles
        axios.get(`/api/resource/User/${res.data.message}`).then(userRes => {
          setUser({
            name: userRes.data.data.name,
            roles: userRes.data.data.roles.map((r: any) => r.role),
          });
        });
      }
    }).finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    await axios.post('/api/method/login', { usr: email, pwd: password });
    // Fetch user info
    const session = await axios.get('/api/method/frappe.auth.get_logged_user');
    if (session.data.message) {
      const userRes = await axios.get(`/api/resource/User/${session.data.message}`);
      setUser({
        name: userRes.data.data.name,
        roles: userRes.data.data.roles.map((r: any) => r.role),
      });
    }
  };

  const logout = async () => {
    await axios.get('/api/method/logout');
    setUser(null);
  };

  const register = async (name: string, email: string, password: string) => {
    await axios.post('/api/method/frappe.core.doctype.user.user.sign_up', {
      email,
      full_name: name,
      password,
    });
    // Optionally, auto-login after registration
    await login(email, password);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext); 