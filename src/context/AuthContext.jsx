import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for persistent mock session
    const storedUser = localStorage.getItem('papertrail_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const loginAsUser = () => {
    const mockUser = {
      id: '1',
      name: 'Test User',
      email: 'user@papertrail.com',
      role: 'user',
    };
    setUser(mockUser);
    localStorage.setItem('papertrail_user', JSON.stringify(mockUser));
  };

  const loginAsCreator = () => {
    const mockCreator = {
      id: '2',
      name: 'Jane Doe',
      email: 'creator@papertrail.com',
      role: 'creator',
      brandName: 'Tech Weekly',
    };
    setUser(mockCreator);
    localStorage.setItem('papertrail_user', JSON.stringify(mockCreator));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('papertrail_user');
  };

  return (
    <AuthContext.Provider value={{ user, loginAsUser, loginAsCreator, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
