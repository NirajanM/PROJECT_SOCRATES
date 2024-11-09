import { create } from "zustand";
import { auth } from "../firebase";
import Cookies from "js-cookie";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  getIdToken,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firestore = getFirestore();

const useAuthStore = create((set) => ({
  user: null,
  error: null,
  loading: false,

  checkUserAuth: () => {
    const token = Cookies.get("authToken");
    if (token) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          set({ user });
        } else {
          set({ user: null });
        }
      });
    } else {
      set({ user: null });
    }
  },

  signup: async (email, password, name) => {
    set({ loading: true, error: null });
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(firestore, "supervisors", user.uid), {
        email: user.email,
        uid: user.uid,
        name,
        createdAt: new Date().toISOString(),
      });

      const token = await getIdToken(user);
      Cookies.set("authToken", token, {
        expires: 7,
        secure: true,
        sameSite: "strict",
      });

      set({ user, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const token = await getIdToken(user);
      Cookies.set("authToken", token, {
        expires: 7,
        secure: true,
        sameSite: "strict",
      });

      set({ user, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  logout: async () => {
    set({ loading: true });
    await signOut(auth);
    Cookies.remove("authToken");
    set({ user: null, loading: false });
  },
}));

export default useAuthStore;
