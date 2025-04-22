import React from 'react';
import { Tabs } from 'expo-router';
import Colors from '@/constants/colors';
import { useNotificationStore } from '@/store/notification-store';
import { useAuthStore } from '@/store/auth-store';
import NotificationBadge from '@/components/NotificationBadge';
import { Home, ClipboardList, Bell, User } from 'lucide-react-native';


export default function OwnerTabsLayout() {
  const { user } = useAuthStore();
  const { notifications } = useNotificationStore();
  
  // Count unread notifications for the current user
  const unreadCount = user ? notifications.filter(
    n => n.userId === user.id && !n.read
  ).length : 0;
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.inactive,
        tabBarStyle: {
          backgroundColor: Colors.card,
          borderTopColor: Colors.border,
        },
        headerStyle: {
          backgroundColor: Colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="requests"
        options={{
          title: 'Visitor Requests',
          tabBarLabel: 'Requests',
          tabBarIcon: ({ color, size }) => (
            <ClipboardList size={size} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarLabel: 'Notifications',
          tabBarIcon: ({ color, size }) => (
            <React.Fragment>
              <Bell size={size} color={color} />
              {unreadCount > 0 && (
                <NotificationBadge count={unreadCount} size="small" />
              )}
            </React.Fragment>
          ),
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'My Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <User size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
