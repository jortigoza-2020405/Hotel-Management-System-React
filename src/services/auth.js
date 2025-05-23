import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile
} from "firebase/auth";
import { auth } from "../firebase";

export const loginUser = (email, password) => signInWithEmailAndPassword(auth, email, password);

export const registerUser = (email, password) => createUserWithEmailAndPassword(auth, email, password);

export const updateUserProfile = (user, fullName) => updateProfile(user, { displayName: fullName });

export const loginWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};