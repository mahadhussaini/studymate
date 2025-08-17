import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from './firebaseConfig';
import toast from 'react-hot-toast';

// Mock user for when Firebase is not configured
const MOCK_USER = {
  uid: 'mock-user-123',
  email: 'demo@studymate.app',
  displayName: 'Demo User',
  photoURL: null,
  emailVerified: true,
  createdAt: new Date().toISOString()
};

// Create user document in Firestore
const createUserDocument = async (user, additionalData = {}) => {
  if (!isFirebaseConfigured() || !db) return;
  
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    const { email, displayName, photoURL } = user;
    const createdAt = new Date();
    
    try {
      await setDoc(userRef, {
        email,
        displayName,
        photoURL,
        createdAt,
        lastLogin: createdAt,
        preferences: {
          theme: 'light',
          notifications: true,
          language: 'en'
        },
        stats: {
          totalStudyHours: 0,
          studyStreak: 0,
          totalNotes: 0,
          totalFlashcards: 0,
          level: 1,
          xp: 0
        },
        ...additionalData
      });
    } catch (error) {
      console.error('Error creating user document:', error);
      throw error;
    }
  }
  
  return userRef;
};

// Update user document
export const updateUserDocument = async (userId, updates) => {
  if (!isFirebaseConfigured() || !db) {
    console.log('Firebase not configured, skipping user update');
    return;
  }
  
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...updates,
      lastUpdated: new Date()
    });
  } catch (error) {
    console.error('Error updating user document:', error);
    throw error;
  }
};

// Sign up with email and password
export const signUpWithEmail = async (email, password, displayName) => {
  if (!isFirebaseConfigured()) {
    // Mock signup for demo
    toast.success('Demo account created! (Firebase not configured)');
    return {
      user: { ...MOCK_USER, email, displayName },
      isDemo: true
    };
  }
  
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update the user's display name
    await updateProfile(user, { displayName });
    
    // Create user document in Firestore
    await createUserDocument(user, { displayName });
    
    toast.success('Account created successfully!');
    return { user, isDemo: false };
  } catch (error) {
    console.error('Signup error:', error);
    
    let errorMessage = 'Failed to create account';
    switch (error.code) {
      case 'auth/email-already-in-use':
        errorMessage = 'An account with this email already exists';
        break;
      case 'auth/weak-password':
        errorMessage = 'Password is too weak';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address';
        break;
    }
    
    toast.error(errorMessage);
    throw error;
  }
};

// Sign in with email and password
export const signInWithEmail = async (email, password) => {
  if (!isFirebaseConfigured()) {
    // Mock signin for demo
    toast.success('Signed in as demo user! (Firebase not configured)');
    return {
      user: { ...MOCK_USER, email },
      isDemo: true
    };
  }
  
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    
    // Update last login time
    await updateUserDocument(user.uid, { lastLogin: new Date() });
    
    toast.success('Welcome back!');
    return { user, isDemo: false };
  } catch (error) {
    console.error('Signin error:', error);
    
    let errorMessage = 'Failed to sign in';
    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'No account found with this email';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address';
        break;
      case 'auth/too-many-requests':
        errorMessage = 'Too many failed attempts. Please try again later';
        break;
    }
    
    toast.error(errorMessage);
    throw error;
  }
};

// Sign in with Google
export const signInWithGoogle = async () => {
  if (!isFirebaseConfigured()) {
    toast.success('Demo Google signin! (Firebase not configured)');
    return {
      user: { ...MOCK_USER, displayName: 'Demo Google User' },
      isDemo: true
    };
  }
  
  try {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    // Create or update user document
    await createUserDocument(user);
    await updateUserDocument(user.uid, { lastLogin: new Date() });
    
    toast.success('Welcome back!');
    return { user, isDemo: false };
  } catch (error) {
    console.error('Google signin error:', error);
    
    let errorMessage = 'Failed to sign in with Google';
    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Sign in cancelled';
    }
    
    toast.error(errorMessage);
    throw error;
  }
};

// Sign out
export const signOutUser = async () => {
  if (!isFirebaseConfigured()) {
    toast.success('Signed out from demo account');
    return;
  }
  
  try {
    await signOut(auth);
    toast.success('Signed out successfully');
  } catch (error) {
    console.error('Signout error:', error);
    toast.error('Failed to sign out');
    throw error;
  }
};

// Reset password
export const resetPassword = async (email) => {
  if (!isFirebaseConfigured()) {
    toast.success('Password reset email sent! (Demo mode)');
    return;
  }
  
  try {
    await sendPasswordResetEmail(auth, email);
    toast.success('Password reset email sent!');
  } catch (error) {
    console.error('Password reset error:', error);
    
    let errorMessage = 'Failed to send reset email';
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'No account found with this email';
    }
    
    toast.error(errorMessage);
    throw error;
  }
};

// Auth state listener
export const onAuthStateChange = (callback) => {
  if (!isFirebaseConfigured()) {
    // For demo mode, call callback with null initially
    callback(null);
    return () => {}; // Return empty unsubscribe function
  }
  
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Get additional user data from Firestore
      try {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        
        const userData = {
          ...user,
          firestoreData: userDoc.exists() ? userDoc.data() : null
        };
        
        callback(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
        callback(user);
      }
    } else {
      callback(null);
    }
  });
};

// Get current user
export const getCurrentUser = () => {
  if (!isFirebaseConfigured()) {
    return null;
  }
  
  return auth.currentUser;
};

// Update user profile
export const updateUserProfile = async (updates) => {
  if (!isFirebaseConfigured()) {
    toast.success('Profile updated! (Demo mode)');
    return;
  }
  
  const user = getCurrentUser();
  if (!user) {
    throw new Error('No user signed in');
  }
  
  try {
    // Update Firebase Auth profile
    if (updates.displayName || updates.photoURL) {
      await updateProfile(user, updates);
    }
    
    // Update Firestore document
    await updateUserDocument(user.uid, updates);
    
    toast.success('Profile updated successfully!');
  } catch (error) {
    console.error('Profile update error:', error);
    toast.error('Failed to update profile');
    throw error;
  }
};

export default {
  signUpWithEmail,
  signInWithEmail,
  signInWithGoogle,
  signOutUser,
  resetPassword,
  onAuthStateChange,
  getCurrentUser,
  updateUserProfile,
  updateUserDocument
};