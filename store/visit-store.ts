import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { VisitRequest, RequestStatus } from '@/types';
import { mockVisitRequests, mockOwners, mockVisitors } from '@/mocks/data';
import { useNotificationStore } from './notification-store';

interface VisitState {
  requests: VisitRequest[];
  isLoading: boolean;
  error: string | null;
  
  // Fetch requests
  fetchRequests: () => Promise<void>;
  fetchRequestsByVisitor: (visitorId: string) => Promise<VisitRequest[]>;
  fetchRequestsByOwner: (ownerId: string) => Promise<VisitRequest[]>;
  
  // Create and update requests
  createRequest: (request: Omit<VisitRequest, 'id' | 'status' | 'createdAt'>) => Promise<VisitRequest>;
  updateRequestStatus: (requestId: string, status: RequestStatus) => Promise<void>;
  
  // Clear state
  clearError: () => void;
}

export const useVisitStore = create<VisitState>()(
  persist(
    (set, get) => ({
      requests: [...mockVisitRequests],
      isLoading: false,
      error: null,

      fetchRequests: async () => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // In a real app, we would fetch from an API
          // For now, we're using our mock data
          set({ requests: [...mockVisitRequests], isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch requests', 
            isLoading: false 
          });
        }
      },

      fetchRequestsByVisitor: async (visitorId) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const visitorRequests = get().requests.filter(
            request => request.visitorId === visitorId
          );
          
          // Enhance requests with owner details
          const enhancedRequests = visitorRequests.map(request => ({
            ...request,
            owner: mockOwners.find(owner => owner.id === request.ownerId),
          }));
          
          set({ isLoading: false });
          return enhancedRequests;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch visitor requests', 
            isLoading: false 
          });
          return [];
        }
      },

      fetchRequestsByOwner: async (ownerId) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const ownerRequests = get().requests.filter(
            request => request.ownerId === ownerId
          );
          
          // Enhance requests with visitor details
          const enhancedRequests = ownerRequests.map(request => ({
            ...request,
            visitor: mockVisitors.find(visitor => visitor.id === request.visitorId),
          }));
          
          set({ isLoading: false });
          return enhancedRequests;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to fetch owner requests', 
            isLoading: false 
          });
          return [];
        }
      },

      createRequest: async (requestData) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const newRequest: VisitRequest = {
            ...requestData,
            id: `request-${Date.now()}`,
            status: 'pending',
            createdAt: new Date().toISOString(),
            visitor: mockVisitors.find(visitor => visitor.id === requestData.visitorId),
            owner: mockOwners.find(owner => owner.id === requestData.ownerId),
          };
          
          // Update the requests array with the new request
          set(state => ({ 
            requests: [...state.requests, newRequest],
            isLoading: false 
          }));
          
          // Create notification for owner
          const notificationStore = useNotificationStore.getState();
          const visitorName = newRequest.visitor?.name || "A visitor";
          
          notificationStore.createNotification({
            userId: requestData.ownerId,
            title: 'New Visit Request',
            message: `${visitorName} has requested to visit on ${requestData.date} at ${requestData.time}`,
            relatedTo: newRequest.id,
          });
          
          return newRequest;
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to create request', 
            isLoading: false 
          });
          throw error;
        }
      },

      updateRequestStatus: async (requestId, status) => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Find the request to update
          const requestToUpdate = get().requests.find(r => r.id === requestId);
          
          if (!requestToUpdate) {
            throw new Error('Request not found');
          }
          
          // Update the request status
          set(state => {
            const updatedRequests = state.requests.map(request => 
              request.id === requestId 
                ? { ...request, status } 
                : request
            );
            
            return { requests: updatedRequests, isLoading: false };
          });
          
          // Get the updated request
          const updatedRequest = get().requests.find(r => r.id === requestId);
          
          if (updatedRequest) {
            // Create notification for visitor
            const notificationStore = useNotificationStore.getState();
            const statusText = status === 'approved' ? 'approved' : 'denied';
            const ownerName = updatedRequest.owner?.name || "The owner";
            
            notificationStore.createNotification({
              userId: updatedRequest.visitorId,
              title: `Request ${statusText.charAt(0).toUpperCase() + statusText.slice(1)}`,
              message: `${ownerName} has ${statusText} your visit request for ${updatedRequest.date} at ${updatedRequest.time}`,
              relatedTo: requestId,
            });
          }
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to update request status', 
            isLoading: false 
          });
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'visit-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);