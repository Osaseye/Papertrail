import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../lib/firebase';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const { user } = useAuth();
  // Default to system preference if no user or local storage
  const getInitialTheme = () => {
    if (typeof window !== 'undefined' && window.localStorage) {
        const storedPrefs = window.localStorage.getItem('color-theme');
        if (typeof storedPrefs === 'string') {
            return storedPrefs;
        }

        const userMedia = window.matchMedia('(prefers-color-scheme: dark)');
        if (userMedia.matches) {
            return 'dark';
        }
    }
    return 'light'; // Default
  };

  const [theme, setTheme] = useState(getInitialTheme);

  // Apply theme class to HTML
  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = theme === 'dark';
    
    root.classList.remove(isDark ? 'light' : 'dark');
    root.classList.add(theme);

    localStorage.setItem('color-theme', theme);
  }, [theme]);

  // Sync with Firestore when User Logs In
  useEffect(() => {
      const syncTheme = async () => {
          if (!user?.uid) return;

          try {
              // 1. Fetch user's preference from DB
              const collectionName = user.role === 'creator' ? 'creators' : 'users';
              const userRef = doc(db, collectionName, user.uid);
              const snap = await getDoc(userRef);

              if (snap.exists() && snap.data().theme) {
                   // If DB has a preference, OVERRIDE local state
                   setTheme(snap.data().theme);
              } else {
                   // If DB has NOTHING, save current local preference to DB
                   // But be careful not to overwrite other fields
                   await setDoc(userRef, { theme: theme }, { merge: true });
              }
          } catch (e) {
              console.error("Theme sync error", e);
          }
      };
      
      syncTheme();
  }, [user]);

  // Toggle Function exposed to app
  const toggleTheme = async () => {
      const newTheme = theme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);

      if (user?.uid) {
          try {
              const collectionName = user.role === 'creator' ? 'creators' : 'users';
              await updateDoc(doc(db, collectionName, user.uid), {
                  theme: newTheme
              });
          } catch (e) {
              console.error("Failed to save theme preference", e);
          }
      }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
