import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { formatDistanceToNow } from '@/utils/date';
import { Notification } from '@/types';
import Colors from '@/constants/colors';

interface NotificationItemProps {
  notification: Notification;
  onPress?: (notification: Notification) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ 
  notification, 
  onPress 
}) => {
  const handlePress = () => {
    if (onPress) {
      onPress(notification);
    }
  };
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        notification.read ? styles.read : styles.unread
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {!notification.read && <View style={styles.dot} />}
      
      <View style={styles.content}>
        <Text style={styles.title}>{notification.title}</Text>
        <Text style={styles.message}>{notification.message}</Text>
        <Text style={styles.time}>
          {formatDistanceToNow(new Date(notification.createdAt))}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    position: 'relative',
  },
  unread: {
    backgroundColor: Colors.highlight,
  },
  read: {
    backgroundColor: 'transparent',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    marginRight: 10,
    marginTop: 5,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: Colors.subtext,
    marginBottom: 8,
  },
  time: {
    fontSize: 12,
    color: Colors.subtext,
  },
});

export default NotificationItem;