import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize user on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        let aadhaar = "";
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) aadhaar = docSnap.data().aadhaar || "";
        } catch (err) {
          console.warn("Firestore read failed:", err.message);
        }

        // Only update if different to prevent re-renders
        setCurrentUser((prev) => {
          if (!prev || prev.uid !== user.uid || prev.aadhaar !== aadhaar) {
            return {
              firebaseUser: user,
              uid: user.uid,
              email: user.email,
              displayName: user.displayName,
              aadhaar,
            };
          }
          return prev;
        });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Signup
  const signup = useCallback(async (username, email, password) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(res.user, { displayName: username });

      // Firestore user doc
      try {
        await setDoc(doc(db, "users", res.user.uid), { aadhaar: "" });
      } catch (err) {
        console.warn("Firestore write failed:", err.message);
      }

      setCurrentUser({
        firebaseUser: res.user,
        uid: res.user.uid,
        email: res.user.email,
        displayName: res.user.displayName,
        aadhaar: "",
      });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, []);

  // Login
  const login = useCallback(async (email, password) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);

      let aadhaar = "";
      try {
        const docRef = doc(db, "users", res.user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) aadhaar = docSnap.data().aadhaar || "";
      } catch (err) {
        console.warn("Firestore read failed:", err.message);
      }

      setCurrentUser({
        firebaseUser: res.user,
        uid: res.user.uid,
        email: res.user.email,
        displayName: res.user.displayName,
        aadhaar,
      });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    await signOut(auth);
    setCurrentUser(null);
  }, []);

  // Update user
  const updateUser = useCallback(async (updatedUser, onError) => {
    setCurrentUser(updatedUser);
    try {
      await setDoc(
        doc(db, "users", updatedUser.uid),
        { aadhaar: updatedUser.aadhaar },
        { merge: true }
      );
    } catch (err) {
      console.warn("Firestore update failed:", err.message);
      if (onError) onError(err.message);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ currentUser, signup, login, logout, updateUser, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
