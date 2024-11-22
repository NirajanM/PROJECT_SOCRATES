import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { auth } from "../firebase";
import Cookies from "js-cookie";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  getIdToken,
  getAuth,
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const firestore = getFirestore();

const useAuthStore = create(
  devtools((set, get) => ({
    user: null,
    error: null,
    loading: false,

    checkUserAuth: () => {
      set({ loading: true });
      const auth = getAuth();
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const freshToken = await user.getIdToken(true); // Force refresh
            Cookies.set("authToken", freshToken, {
              expires: 7,
              secure: true,
              sameSite: "strict",
            });
            set({ user, loading: false });
          } catch (error) {
            console.error("Error refreshing token:", error);
            Cookies.remove("authToken");
            set({
              user: null,
              loading: false,
              error: "Session expired. Please log in again.",
            });
          }
        } else {
          Cookies.remove("authToken");
          set({ user: null, loading: false });
        }
      });
    },

    signup: async (email, password, name, navigate) => {
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
        navigate("/login");
      } catch (error) {
        set({ error: error.message, loading: false });
      }
    },

    login: async (email, password, navigate) => {
      set({ loading: true, error: null });
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        const userDocRef = doc(firestore, "Enumerators", user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          set({
            error: "Enumerators are not authorized to access this web app.",
            loading: false,
          });
          // signOut(auth); // Optionally sign the user out
          return;
        }

        const token = await getIdToken(user);
        Cookies.set("authToken", token, {
          expires: 7,
          secure: true,
          sameSite: "strict",
        });

        set({ user, loading: false });
        navigate("/");
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

    createEnumerator: async (email, password, name) => {
      set({ loading: true, error: null });
      try {
        const supervisor = get().user; // Get the current authenticated user (supervisor)
        if (!supervisor) {
          throw new Error("Supervisor not authenticated");
        }

        const supervisorRef = doc(firestore, "supervisors", supervisor.uid);

        // Create a new enumerator in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const enumerator = userCredential.user;

        // Save enumerator data in Firestore
        await setDoc(doc(firestore, "Enumerators", enumerator.uid), {
          email: enumerator.email,
          uid: enumerator.uid,
          name,
          supervisor: supervisorRef,
          active: true,
          createdAt: new Date().toISOString(),
        });

        set({ loading: false });
        return { success: true, message: "Enumerator created successfully" };
      } catch (error) {
        console.error(error);
        set({ error: error.message, loading: false });
        return { success: false, message: error.message };
      }
    },
  }))
);

export default useAuthStore;
