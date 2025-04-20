import React, { useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  FlatList, 
  TouchableOpacity,
  Text,
  RefreshControl,
} from 'react-native';
import { useAuthStore } from '@/store/auth-store';
import { useNotificationStore } from '@/store/notification-store';
import { Notification } from '@/types';
import NotificationItem from '@/components/NotificationItem';
import EmptyState from '@/components/EmptyState';
import Colors from '@/constants/colors';
import { Bell, CheckCheck } from 'lucide-react-native';

export default function VisitorNotificationsScreen() {
  const { user } = useAuthStore();
  const { 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead,
    deleteNotification 
  } = useNotificationStore();
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  
  const loadNotifications = async () => {
    if (user) {
      const userNotifications = await fetchNotifications(user.id);
      setNotifications(userNotifications);
    }
  };
  
  useEffect(() => {
    loadNotifications();
  }, [user]);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };
  
  const handleNotificationPress = async (notification: Notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
      await loadNotifications();
    }
    
    // If the notification is related to a request, navigate to that request
    // This would be implemented in a real app
  };
  
  const handleMarkAllAsRead = async () => {
    if (user) {
      await markAllAsRead(user.id);
      await loadNotifications();
    }
  };
  
  const hasUnreadNotifications = notifications.some(n => !n.read);
  
  return (
    <SafeAreaView style={styles.container}>
      {notifications.length > 0 && hasUnreadNotifications && (
        <TouchableOpacity 
          style={styles.markAllButton}
          onPress={handleMarkAllAsRead}
        >
          <CheckCheck size={16} color="#FFFFFF" />
          <Text style={styles.markAllText}>Mark all as read</Text>
        </TouchableOpacity>
      )}
      
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationItem
            notification={item}
            onPress={handleNotificationPress}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <EmptyState
            title="No Notifications"
            message="You don't have any notifications yet."
            icon={<Bell size={48} color={Colors.subtext} />}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 12,
  },
  markAllText: {
    color: '#FFFFFF',
    fontWeight: '500',
    marginLeft: 8,
  },
  listContent: {
    flexGrow: 1,
  },
});