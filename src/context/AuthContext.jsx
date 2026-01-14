import { createContext, useContext, useState, useEffect } from 'react';
import LoadingScreen from '../components/ui/LoadingScreen';
import { auth, db } from '../lib/firebase';
import { 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      // Don't set loading true here causing flickers on standard re-auths
      // Just handle the transition 
      if (currentUser) {
        try {
          // Check if user is in 'users' collection
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            setUser({ ...userDoc.data(), id: currentUser.uid, role: 'user' });
          } else {
            // Check if user is in 'creators' collection
            const creatorDocRef = doc(db, 'creators', currentUser.uid);
            const creatorDoc = await getDoc(creatorDocRef);
            
            if (creatorDoc.exists()) {
              setUser({ ...creatorDoc.data(), id: currentUser.uid, role: 'creator' });
            } else {
              // Fallback
              setUser({ id: currentUser.uid, email: currentUser.email });
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email, password, role, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;
      const collectionName = role === 'Content Creator' ? 'creators' : 'users';
      
      const userData = {
        uid: user.uid,
        email: user.email,
        name: name,
        role: role === 'Content Creator' ? 'creator' : 'user',
        createdAt: serverTimestamp(),
      };

      await setDoc(doc(db, collectionName, user.uid), userData);
      
      // Update local state immediately
      setUser({ ...userData, id: user.uid });
      
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signIn = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Determine role via Firestore check to help redirect
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      let role = null;
      if (userDoc.exists()) {
        role = 'user';
      } else {
        const creatorDocRef = doc(db, 'creators', user.uid);
        const creatorDoc = await getDoc(creatorDocRef);
        if (creatorDoc.exists()) {
          role = 'creator';
        }
      }

      return { success: true, role };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const loginWithGoogle = async (targetRole = 'user') => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check existence
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      const creatorDocRef = doc(db, 'creators', user.uid);
      const creatorDoc = await getDoc(creatorDocRef);

      let role = null;
      if (userDoc.exists()) {
        role = 'user';
      } else if (creatorDoc.exists()) {
        role = 'creator';
      } else {
        // New user - we might need to create a basic doc or let onboarding handle it
        // For now, return success but no role, letting the UI redirect to onboarding
        // We can optionally pre-create the doc here based on targetRole, but onboarding is better for collecting extra info
      }

      return { success: true, role, isNewUser: (!role) };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem('papertrail_user');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };
  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <AuthContext.Provider value={{ user, signUp, signIn, loginWithGoogle, logout, loading }}>
      {loading ? <LoadingScreen /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
