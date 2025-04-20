import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserType } from '@/types';
import { mockOwners, mockVisitors } from '@/mocks/data';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string, userType: UserType) => Promise<void>;
  demoLogin: (userType: UserType, userId?: string) => Promise<void>;
  register: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email, password, userType) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          let user = null;
          if (userType === 'owner') {
            user = mockOwners.find(owner => owner.email === email);
          } else {
            user = mockVisitors.find(visitor => visitor.email === email);
          }
          
          if (!user) {
            throw new Error('Invalid email or password');
          }
          
          // Set both user and isAuthenticated in a single update to avoid race conditions
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'An error occurred', 
            isLoading: false 
          });
        }
      },

      demoLogin: async (userType, userId) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          let user = null;
          if (userType === 'owner') {
            user = userId 
              ? mockOwners.find(owner => owner.id === userId) 
              : mockOwners[0];
          } else {
            user = userId 
              ? mockVisitors.find(visitor => visitor.id === userId) 
              : mockVisitors[0];
          }
          
          if (!user) {
            throw new Error('Demo user not found');
          }
          
          // Set both user and isAuthenticated in a single update to avoid race conditions
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'An error occurred', 
            isLoading: false 
          });
        }
      },

      register: async (userData, password) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if email already exists
          const emailExists = [...mockOwners, ...mockVisitors].some(
            user => user.email === userData.email
          );
          
          if (emailExists) {
            throw new Error('Email already in use');
          }
          
          // Create new user (in a real app, this would be saved to a database)
          const newUser: User = {
            id: `${userData.type}-${Date.now()}`,
            name: userData.name || '',
            email: userData.email || '',
            phone: userData.phone || '',
            type: userData.type || 'visitor',
          };
          
          // Set both user and isAuthenticated in a single update to avoid race conditions
          set({ user: newUser, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'An error occurred', 
            isLoading: false 
          });
        }
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);