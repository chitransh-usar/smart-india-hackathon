import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize demo users if they don't exist
    const existingUsers = localStorage.getItem('ecolearn_users');
    if (!existingUsers) {
      const demoUsers = [
        {
          id: '1',
          name: 'Demo User',
          email: 'demo@ecolearn.com',
          password: 'demo123'
        },
        {
          id: '2',
          name: 'John Doe',
          email: 'john@ecolearn.com',
          password: 'john123'
        },
        {
          id: '3',
          name: 'Jane Smith',
          email: 'jane@ecolearn.com',
          password: 'jane123'
        }
      ];
      localStorage.setItem('ecolearn_users', JSON.stringify(demoUsers));
    }

    // Check if user is already logged in (from localStorage)
    const savedUser = localStorage.getItem('ecolearn_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // For demo purposes, we'll use localStorage to simulate authentication
      // In a real app, you'd make an API call to your backend
      const users = JSON.parse(localStorage.getItem('ecolearn_users') || '[]');
      const foundUser = users.find((u: any) => u.email === email && u.password === password);
      
      if (foundUser) {
        const userWithoutPassword = { id: foundUser.id, name: foundUser.name, email: foundUser.email };
        setUser(userWithoutPassword);
        localStorage.setItem('ecolearn_user', JSON.stringify(userWithoutPassword));
        setIsLoading(false);
        return true;
      }
      setIsLoading(false);
      return false;
    } catch (error) {
      setIsLoading(false);
      return false;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('ecolearn_users') || '[]');
      const existingUser = users.find((u: any) => u.email === email);
      
      if (existingUser) {
        console.log('User already exists with email:', email);
        setIsLoading(false);
        return false; // User already exists
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password // In a real app, this would be hashed
      };

      users.push(newUser);
      localStorage.setItem('ecolearn_users', JSON.stringify(users));
      console.log('New user created:', { id: newUser.id, name: newUser.name, email: newUser.email });

      // Auto-login after registration
      const userWithoutPassword = { id: newUser.id, name: newUser.name, email: newUser.email };
      setUser(userWithoutPassword);
      localStorage.setItem('ecolearn_user', JSON.stringify(userWithoutPassword));
      console.log('User auto-logged in after registration');
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ecolearn_user');
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
