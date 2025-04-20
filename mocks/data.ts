import { Owner, Visitor, VisitRequest, Notification } from '@/types';

export const mockOwners: Owner[] = [
  {
    id: 'owner-1',
    name: 'John Smith',
    email: 'john@example.com',
    phone: '555-123-4567',
    type: 'owner',
    address: '123 Main Street, Apt 4B',
    profileImage: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
  },
  {
    id: 'owner-2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '555-987-6543',
    type: 'owner',
    address: '456 Oak Avenue, Suite 7C',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
  },
];

export const mockVisitors: Visitor[] = [
  {
    id: 'visitor-1',
    name: 'Michael Brown',
    email: 'michael@example.com',
    phone: '555-222-3333',
    type: 'visitor',
    profileImage: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
  },
  {
    id: 'visitor-2',
    name: 'Emily Davis',
    email: 'emily@example.com',
    phone: '555-444-5555',
    type: 'visitor',
    profileImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
  },
  {
    id: 'visitor-3',
    name: 'David Wilson',
    email: 'david@example.com',
    phone: '555-666-7777',
    type: 'visitor',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
  },
];

export const mockVisitRequests: VisitRequest[] = [
  {
    id: 'request-1',
    visitorId: 'visitor-1',
    ownerId: 'owner-1',
    purpose: 'Maintenance check',
    date: '2023-11-15',
    time: '14:00',
    status: 'pending',
    createdAt: '2023-11-10T10:30:00Z',
  },
  {
    id: 'request-2',
    visitorId: 'visitor-2',
    ownerId: 'owner-1',
    purpose: 'Package delivery',
    date: '2023-11-16',
    time: '10:30',
    status: 'approved',
    createdAt: '2023-11-11T09:15:00Z',
  },
  {
    id: 'request-3',
    visitorId: 'visitor-3',
    ownerId: 'owner-2',
    purpose: 'Social visit',
    date: '2023-11-17',
    time: '18:00',
    status: 'denied',
    createdAt: '2023-11-12T14:45:00Z',
  },
  {
    id: 'request-4',
    visitorId: 'visitor-1',
    ownerId: 'owner-2',
    purpose: 'Internet installation',
    date: '2023-11-18',
    time: '11:00',
    status: 'pending',
    createdAt: '2023-11-13T16:20:00Z',
  },
];

export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'owner-1',
    title: 'New Visit Request',
    message: 'Michael Brown has requested to visit on Nov 15 at 2:00 PM',
    read: false,
    createdAt: '2023-11-10T10:30:00Z',
    relatedTo: 'request-1',
  },
  {
    id: 'notif-2',
    userId: 'visitor-2',
    title: 'Request Approved',
    message: 'Your visit request for Nov 16 has been approved',
    read: true,
    createdAt: '2023-11-11T10:00:00Z',
    relatedTo: 'request-2',
  },
  {
    id: 'notif-3',
    userId: 'visitor-3',
    title: 'Request Denied',
    message: 'Your visit request for Nov 17 has been denied',
    read: false,
    createdAt: '2023-11-12T15:00:00Z',
    relatedTo: 'request-3',
  },
  {
    id: 'notif-4',
    userId: 'owner-2',
    title: 'New Visit Request',
    message: 'Michael Brown has requested to visit on Nov 18 at 11:00 AM',
    read: false,
    createdAt: '2023-11-13T16:20:00Z',
    relatedTo: 'request-4',
  },
];