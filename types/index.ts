export type UserType = 'visitor' | 'owner';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: UserType;
  profileImage?: string;
}

export interface Owner extends User {
  address: string;
  type: 'owner';
}

export interface Visitor extends User {
  type: 'visitor';
}

export type RequestStatus = 'pending' | 'approved' | 'denied';

export interface VisitRequest {
  id: string;
  visitorId: string;
  ownerId: string;
  purpose: string;
  date: string;
  time: string;
  status: RequestStatus;
  createdAt: string;
  visitor?: Visitor;
  owner?: Owner;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  relatedTo?: string; // request ID if related to a request
}