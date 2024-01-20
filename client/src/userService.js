// userService.js
import { db } from './firebaseConfig';
import { doc, setDoc, getDoc } from "firebase/firestore";

// Fetch User Profile
export const fetchUserProfileFromFirestore = async (userId) => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      console.log("No such user profile exists!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};

// Create or Update User Profile
export const saveUserProfile = async (userId, profileData) => {
  try {
    // The merge: true option will update the document or create it if it doesn't exist
    await setDoc(doc(db, "users", userId), profileData, { merge: true });
    console.log("User profile saved successfully");
  } catch (error) {
    console.error("Error saving user profile:", error);
    throw error;
  }
};
