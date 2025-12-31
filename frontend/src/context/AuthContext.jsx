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

const API_URL = import.meta.env.VITE_API_URL;

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize user on mount

  const logAction = async ({ userId, action, details = {} }) => {
    if (!API_URL) {
      console.error("VITE_API_URL is not defined, skipping logAction");
      return;
    }

    try {
      await fetch(`${API_URL}/api/log`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action, details }),
      });
    } catch (err) {
      console.warn("Logger failed:", err.message);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        let aadhaar = "";
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) aadhaar = docSnap.data().aadhaar || "";
          await logAction({
            userId: user.uid,
            action: "auth_state_changed",
            details: { email: user.email },
          });
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
      await logAction({
        userId: res.user.uid,
        action: "signup",
        details: {
          email: res.user.email,
          displayName: username,
        },
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
      await logAction({
        userId: res.user.uid,
        action: "login",
        details: {
          email: res.user.email,
        },
      });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    if (currentUser?.uid) {
      await logAction({
        userId: currentUser.uid,
        action: "logout",
      });
    }

    await signOut(auth);
    setCurrentUser(null);
  }, [currentUser]);

  // Update user
  const updateUser = useCallback(async (updatedUser, onError) => {
    setCurrentUser(updatedUser);
    try {
      await setDoc(
        doc(db, "users", updatedUser.uid),
        { aadhaar: updatedUser.aadhaar },
        { merge: true }
      );
      await logAction({
        userId: updatedUser.uid,
        action: "update_profile",
        details: {
          aadhaarUpdated: true,
        },
      });
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
