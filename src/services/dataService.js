import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage, isFirebaseConfigured } from './firebaseConfig';
import { getCurrentUser } from './authService';
import toast from 'react-hot-toast';

// Helper function to get user collections
const getUserCollection = (userId, collectionName) => {
  return collection(db, `users/${userId}/${collectionName}`);
};

// Generic CRUD operations
export const createDocument = async (collectionName, data) => {
  if (!isFirebaseConfigured()) {
    console.log('Firebase not configured, skipping document creation');
    return { id: Date.now().toString(), ...data };
  }
  
  const user = getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  
  try {
    const docRef = await addDoc(getUserCollection(user.uid, collectionName), {
      ...data,
      userId: user.uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error(`Error creating ${collectionName} document:`, error);
    throw error;
  }
};

export const updateDocument = async (collectionName, docId, updates) => {
  if (!isFirebaseConfigured()) {
    console.log('Firebase not configured, skipping document update');
    return;
  }
  
  const user = getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  
  try {
    const docRef = doc(getUserCollection(user.uid, collectionName), docId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error(`Error updating ${collectionName} document:`, error);
    throw error;
  }
};

export const deleteDocument = async (collectionName, docId) => {
  if (!isFirebaseConfigured()) {
    console.log('Firebase not configured, skipping document deletion');
    return;
  }
  
  const user = getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  
  try {
    const docRef = doc(getUserCollection(user.uid, collectionName), docId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(`Error deleting ${collectionName} document:`, error);
    throw error;
  }
};

export const getDocuments = async (collectionName, options = {}) => {
  if (!isFirebaseConfigured()) {
    console.log('Firebase not configured, returning empty array');
    return [];
  }
  
  const user = getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  
  try {
    let q = getUserCollection(user.uid, collectionName);
    
    // Apply query options
    if (options.orderBy) {
      q = query(q, orderBy(options.orderBy.field, options.orderBy.direction || 'desc'));
    }
    
    if (options.where) {
      q = query(q, where(options.where.field, options.where.operator, options.where.value));
    }
    
    if (options.limit) {
      q = query(q, limit(options.limit));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error fetching ${collectionName} documents:`, error);
    throw error;
  }
};

export const subscribeToCollection = (collectionName, callback, options = {}) => {
  if (!isFirebaseConfigured()) {
    console.log('Firebase not configured, skipping subscription');
    return () => {}; // Return empty unsubscribe function
  }
  
  const user = getCurrentUser();
  if (!user) {
    callback([]);
    return () => {};
  }
  
  try {
    let q = getUserCollection(user.uid, collectionName);
    
    if (options.orderBy) {
      q = query(q, orderBy(options.orderBy.field, options.orderBy.direction || 'desc'));
    }
    
    return onSnapshot(q, (querySnapshot) => {
      const documents = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      callback(documents);
    }, (error) => {
      console.error(`Error in ${collectionName} subscription:`, error);
      callback([]);
    });
  } catch (error) {
    console.error(`Error subscribing to ${collectionName}:`, error);
    return () => {};
  }
};

// Specific service functions for each data type

// Notes services
export const saveNote = async (noteData) => {
  return createDocument('notes', noteData);
};

export const updateNote = async (noteId, updates) => {
  return updateDocument('notes', noteId, updates);
};

export const deleteNote = async (noteId) => {
  return deleteDocument('notes', noteId);
};

export const getNotes = async () => {
  return getDocuments('notes', { 
    orderBy: { field: 'createdAt', direction: 'desc' } 
  });
};

export const subscribeToNotes = (callback) => {
  return subscribeToCollection('notes', callback, { 
    orderBy: { field: 'createdAt', direction: 'desc' } 
  });
};

// Flashcards services
export const saveFlashcard = async (flashcardData) => {
  return createDocument('flashcards', flashcardData);
};

export const updateFlashcard = async (flashcardId, updates) => {
  return updateDocument('flashcards', flashcardId, updates);
};

export const deleteFlashcard = async (flashcardId) => {
  return deleteDocument('flashcards', flashcardId);
};

export const getFlashcards = async () => {
  return getDocuments('flashcards', { 
    orderBy: { field: 'createdAt', direction: 'desc' } 
  });
};

export const subscribeToFlashcards = (callback) => {
  return subscribeToCollection('flashcards', callback, { 
    orderBy: { field: 'createdAt', direction: 'desc' } 
  });
};

// Study sessions services
export const saveStudySession = async (sessionData) => {
  return createDocument('studySessions', sessionData);
};

export const updateStudySession = async (sessionId, updates) => {
  return updateDocument('studySessions', sessionId, updates);
};

export const getStudySessions = async (days = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  return getDocuments('studySessions', {
    where: { field: 'startTime', operator: '>=', value: startDate },
    orderBy: { field: 'startTime', direction: 'desc' }
  });
};

// Achievements services
export const saveAchievement = async (achievementData) => {
  return createDocument('achievements', achievementData);
};

export const getAchievements = async () => {
  return getDocuments('achievements', { 
    orderBy: { field: 'unlockedAt', direction: 'desc' } 
  });
};

// File upload services
export const uploadFile = async (file, folder = 'uploads') => {
  if (!isFirebaseConfigured() || !storage) {
    console.log('Firebase Storage not configured');
    throw new Error('File upload not available');
  }
  
  const user = getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  
  try {
    const fileName = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `${folder}/${user.uid}/${fileName}`);
    
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return {
      url: downloadURL,
      name: fileName,
      size: file.size,
      type: file.type
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};

export const deleteFile = async (fileUrl) => {
  if (!isFirebaseConfigured() || !storage) {
    console.log('Firebase Storage not configured');
    return;
  }
  
  try {
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

// Data synchronization
export const syncDataToCloud = async (localData) => {
  if (!isFirebaseConfigured()) {
    console.log('Firebase not configured, skipping cloud sync');
    return;
  }
  
  const user = getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  
  try {
    toast.loading('Syncing data to cloud...');
    
    // Sync different data types
    const syncPromises = [];
    
    if (localData.notes) {
      syncPromises.push(...localData.notes.map(note => saveNote(note)));
    }
    
    if (localData.flashcards) {
      syncPromises.push(...localData.flashcards.map(card => saveFlashcard(card)));
    }
    
    if (localData.studySessions) {
      syncPromises.push(...localData.studySessions.map(session => saveStudySession(session)));
    }
    
    if (localData.achievements) {
      syncPromises.push(...localData.achievements.map(achievement => saveAchievement(achievement)));
    }
    
    await Promise.allSettled(syncPromises);
    
    toast.dismiss();
    toast.success('Data synced to cloud successfully!');
  } catch (error) {
    toast.dismiss();
    console.error('Error syncing data to cloud:', error);
    toast.error('Failed to sync data to cloud');
    throw error;
  }
};

export const loadDataFromCloud = async () => {
  if (!isFirebaseConfigured()) {
    console.log('Firebase not configured, skipping cloud load');
    return null;
  }
  
  const user = getCurrentUser();
  if (!user) throw new Error('User not authenticated');
  
  try {
    toast.loading('Loading data from cloud...');
    
    const [notes, flashcards, studySessions, achievements] = await Promise.all([
      getNotes(),
      getFlashcards(),
      getStudySessions(),
      getAchievements()
    ]);
    
    toast.dismiss();
    toast.success('Data loaded from cloud successfully!');
    
    return {
      notes,
      flashcards,
      studySessions,
      achievements
    };
  } catch (error) {
    toast.dismiss();
    console.error('Error loading data from cloud:', error);
    toast.error('Failed to load data from cloud');
    throw error;
  }
};

export default {
  // CRUD operations
  createDocument,
  updateDocument,
  deleteDocument,
  getDocuments,
  subscribeToCollection,
  
  // Specific services
  saveNote,
  updateNote,
  deleteNote,
  getNotes,
  subscribeToNotes,
  
  saveFlashcard,
  updateFlashcard,
  deleteFlashcard,
  getFlashcards,
  subscribeToFlashcards,
  
  saveStudySession,
  updateStudySession,
  getStudySessions,
  
  saveAchievement,
  getAchievements,
  
  // File operations
  uploadFile,
  deleteFile,
  
  // Sync operations
  syncDataToCloud,
  loadDataFromCloud
};