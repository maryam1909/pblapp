import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Notification } from '@/types';
import { mockNotifications } from '@/mocks/data';

interface NotificationState {
  notifications: Notification[];
  isLoading: boolean;
  error: string | null;
  
  fetchNotifications: (userId: string) => Promise<Notification[]>;
  createNotification: (data: Omit<Notification, 'id' | 'read' | 'createdAt'>) => Promise<Notification>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: (userId: string) => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  clearError: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: [...mockNotifications],
      isLoading: false,
      error: null,

      fetchNotifications: async (userId) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const userNotifications = get().notifications.filter(
            notification => notification.userId === userId
          );
          
          set({ isLoading: false });
          return userNotifications;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch notifications', 
            isLoading: false 
          });
          return [];
        }
      },

      createNotification: async (data) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const newNotification: Notification = {
            ...data,
            id: `notif-${Date.now()}`,
            read: false,
            createdAt: new Date().toISOString(),
          };
          
          set(state => ({ 
            notifications: [...state.notifications, newNotification],
            isLoading: false 
          }));
          
          return newNotification;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to create notification', 
            isLoading: false 
          });
          throw error;
        }
      },

      markAsRead: async (notificationId) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 300));
          
          set(state => {
            const updatedNotifications = state.notifications.map(notification => 
              notification.id === notificationId 
                ? { ...notification, read: true } 
                : notification
            );
            
            return { notifications: updatedNotifications, isLoading: false };
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to mark notification as read', 
            isLoading: false 
          });
        }
      },

      markAllAsRead: async (userId) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => {
            const updatedNotifications = state.notifications.map(notification => 
              notification.userId === userId 
                ? { ...notification, read: true } 
                : notification
            );
            
            return { notifications: updatedNotifications, isLoading: false };
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to mark all notifications as read', 
            isLoading: false 
          });
        }
      },

      deleteNotification: async (notificationId) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          set(state => {
            const updatedNotifications = state.notifications.filter(
              notification => notification.id !== notificationId
            );
            
            return { notifications: updatedNotifications, isLoading: false };
          });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to delete notification', 
            isLoading: false 
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'notification-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);