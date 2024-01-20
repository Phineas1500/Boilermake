// userService.js
import { db } from './firebaseConfig';
import { doc, setDoc } from "firebase/firestore";

// Create User Profile
export const createUserProfile = async (userId, profileData) => {
  try {
    await setDoc(doc(db, "users", userId), profileData);
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
};