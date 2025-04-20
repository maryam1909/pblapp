import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

interface NotificationBadgeProps {
  count: number;
  size?: 'small' | 'medium' | 'large';
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ 
  count, 
  size = 'medium' 
}) => {
  if (count <= 0) return null;
  
  const getBadgeSize = () => {
    switch (size) {
      case 'small':
        return {
          width: 16,
          height: 16,
          fontSize: 10,
          borderRadius: 8,
        };
      case 'medium':
        return {
          width: 20,
          height: 20,
          fontSize: 12,
          borderRadius: 10,
        };
      case 'large':
        return {
          width: 24,
          height: 24,
          fontSize: 14,
          borderRadius: 12,
        };
    }
  };
  
  const sizeStyles = getBadgeSize();
  
  return (
    <View 
      style={[
        styles.badge, 
        { 
          width: sizeStyles.width, 
          height: sizeStyles.height,
          borderRadius: sizeStyles.borderRadius,
        }
      ]}
    >
      <Text style={[styles.text, { fontSize: sizeStyles.fontSize }]}>
        {count > 99 ? '99+' : count}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    backgroundColor: Colors.notification,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default NotificationBadge;