import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { 
  subscribeToNotes, 
  subscribeToFlashcards, 
  saveNote as saveNoteToCloud,
  saveFlashcard as saveFlashcardToCloud,
  updateNote as updateNoteInCloud,
  updateFlashcard as updateFlashcardInCloud,
  deleteNote as deleteNoteFromCloud,
  deleteFlashcard as deleteFlashcardFromCloud,
  saveStudySession as saveStudySessionToCloud,
  saveAchievement as saveAchievementToCloud
} from '../services/dataService';

const useAppStore = create(
  persist(
    (set) => ({
      // User state
      user: null,
      isAuthenticated: false,
      
      // Theme state
      theme: 'light',
      
      // Study data
      notes: [],
      flashcards: [],
      studySessions: [],
      achievements: [],
      studyStreak: 0,
      totalStudyHours: 0,
      
      // UI state
      sidebarOpen: true,
      currentPage: 'dashboard',
      loading: false,
      
      // Actions
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => set({ user: null, isAuthenticated: false }),
      
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),
      
      setSidebarOpen: (open) => set({ sidebarOpen: open }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      
      setCurrentPage: (page) => set({ currentPage: page }),
      setLoading: (loading) => set({ loading }),
      
      // Notes actions
      addNote: async (note) => {
        const newNote = { ...note, id: Date.now(), createdAt: new Date() };
        
        set((state) => ({
          notes: [...state.notes, newNote]
        }));

        // Sync to cloud if user is authenticated
        try {
          await saveNoteToCloud(newNote);
        } catch {
          console.log('Note saved locally only');
        }
      },
      
      updateNote: async (id, updates) => {
        const updatedData = { ...updates, updatedAt: new Date() };
        
        set((state) => ({
          notes: state.notes.map(note => 
            note.id === id ? { ...note, ...updatedData } : note
          )
        }));

        // Sync to cloud if user is authenticated
        try {
          await updateNoteInCloud(id, updatedData);
        } catch {
          console.log('Note updated locally only');
        }
      },
      
      deleteNote: async (id) => {
        set((state) => ({
          notes: state.notes.filter(note => note.id !== id)
        }));

        // Sync to cloud if user is authenticated
        try {
          await deleteNoteFromCloud(id);
        } catch {
          console.log('Note deleted locally only');
        }
      },
      
      // Flashcards actions
      addFlashcard: async (flashcard) => {
        const newFlashcard = { 
          ...flashcard, 
          id: Date.now(), 
          createdAt: new Date(),
          reviewCount: 0,
          correctCount: 0,
          nextReview: new Date()
        };

        set((state) => ({
          flashcards: [...state.flashcards, newFlashcard]
        }));

        // Sync to cloud if user is authenticated
        try {
          await saveFlashcardToCloud(newFlashcard);
        } catch {
          console.log('Flashcard saved locally only');
        }
      },
      
      updateFlashcard: async (id, updates) => {
        set((state) => ({
          flashcards: state.flashcards.map(card => 
            card.id === id ? { ...card, ...updates } : card
          )
        }));

        // Sync to cloud if user is authenticated
        try {
          await updateFlashcardInCloud(id, updates);
        } catch {
          console.log('Flashcard updated locally only');
        }
      },
      
      deleteFlashcard: async (id) => {
        set((state) => ({
          flashcards: state.flashcards.filter(card => card.id !== id)
        }));

        // Sync to cloud if user is authenticated
        try {
          await deleteFlashcardFromCloud(id);
        } catch {
          console.log('Flashcard deleted locally only');
        }
      },
      
      // Study session actions
      startStudySession: (subject) => {
        const session = {
          id: Date.now(),
          subject,
          startTime: new Date(),
          endTime: null,
          duration: 0,
          isActive: true
        };
        set((state) => ({
          studySessions: [...state.studySessions, session]
        }));
        return session.id;
      },
      
      endStudySession: async (sessionId) => {
        let completedSession = null;
        
        set((state) => {
          const updatedSessions = state.studySessions.map(session => {
            if (session.id === sessionId && session.isActive) {
              const endTime = new Date();
              const duration = (endTime - new Date(session.startTime)) / (1000 * 60); // minutes
              completedSession = {
                ...session,
                endTime,
                duration,
                isActive: false
              };
              return completedSession;
            }
            return session;
          });
          
          // Update total study hours
          const totalMinutes = updatedSessions.reduce((acc, session) => acc + session.duration, 0);
          const totalHours = Math.round((totalMinutes / 60) * 100) / 100;
          
          return {
            studySessions: updatedSessions,
            totalStudyHours: totalHours
          };
        });

        // Sync completed session to cloud if user is authenticated
        if (completedSession) {
          try {
            await saveStudySessionToCloud(completedSession);
          } catch {
            console.log('Study session saved locally only');
          }
        }
      },
      
      // Achievement actions
      addAchievement: async (achievement) => {
        const newAchievement = {
          ...achievement,
          id: Date.now(),
          unlockedAt: new Date()
        };

        set((state) => ({
          achievements: [...state.achievements, newAchievement]
        }));

        // Sync to cloud if user is authenticated
        try {
          await saveAchievementToCloud(newAchievement);
        } catch {
          console.log('Achievement saved locally only');
        }
      },
      
      // Study streak actions
      updateStudyStreak: () => set((state) => {
        const today = new Date().toDateString();
        const lastSession = state.studySessions
          .filter(session => !session.isActive)
          .sort((a, b) => new Date(b.endTime) - new Date(a.endTime))[0];
        
        if (lastSession && new Date(lastSession.endTime).toDateString() === today) {
          return { studyStreak: state.studyStreak + 1 };
        }
        return state;
      }),
      
      // Data synchronization actions
      setupCloudSync: () => {
        const { setNotes, setFlashcards } = useAppStore.getState();
        
        // Subscribe to cloud updates for notes
        const unsubscribeNotes = subscribeToNotes((cloudNotes) => {
          setNotes(cloudNotes);
        });

        // Subscribe to cloud updates for flashcards
        const unsubscribeFlashcards = subscribeToFlashcards((cloudFlashcards) => {
          setFlashcards(cloudFlashcards);
        });

        // Return cleanup function
        return () => {
          unsubscribeNotes();
          unsubscribeFlashcards();
        };
      },

      setNotes: (notes) => set({ notes }),
      setFlashcards: (flashcards) => set({ flashcards }),

      // Reset all data (for testing/demo purposes)
      resetData: () => set({
        notes: [],
        flashcards: [],
        studySessions: [],
        achievements: [],
        studyStreak: 0,
        totalStudyHours: 0
      }),
    }),
    {
      name: 'studymate-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        theme: state.theme,
        notes: state.notes,
        flashcards: state.flashcards,
        studySessions: state.studySessions,
        achievements: state.achievements,
        studyStreak: state.studyStreak,
        totalStudyHours: state.totalStudyHours,
      }),
    }
  )
);

export default useAppStore;