import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { VisitRequest } from '@/types';
import { formatDate } from '@/utils/date';
import Button from './Button';
import Colors from '@/constants/colors';
import { Clock, Calendar, User, FileText } from 'lucide-react-native';

interface RequestCardProps {
  request: VisitRequest;
  isOwner?: boolean;
  onPress?: (request: VisitRequest) => void;
  onApprove?: (requestId: string) => void;
  onDeny?: (requestId: string) => void;
}

const RequestCard: React.FC<RequestCardProps> = ({
  request,
  isOwner = false,
  onPress,
  onApprove,
  onDeny,
}) => {
  const getStatusColor = () => {
    switch (request.status) {
      case 'approved':
        return Colors.success;
      case 'denied':
        return Colors.error;
      case 'pending':
      default:
        return Colors.warning;
    }
  };
  
  const handlePress = () => {
    if (onPress) {
      onPress(request);
    }
  };
  
  const handleApprove = () => {
    if (onApprove) {
      onApprove(request.id);
    }
  };
  
  const handleDeny = () => {
    if (onDeny) {
      onDeny(request.id);
    }
  };
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.statusContainer}>
          <View 
            style={[
              styles.statusDot, 
              { backgroundColor: getStatusColor() }
            ]} 
          />
          <Text style={styles.status}>
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </Text>
        </View>
        <Text style={styles.date}>
          {formatDate(new Date(request.createdAt))}
        </Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.infoRow}>
          <Calendar size={16} color={Colors.primary} />
          <Text style={styles.infoText}>{request.date}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Clock size={16} color={Colors.primary} />
          <Text style={styles.infoText}>{request.time}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <User size={16} color={Colors.primary} />
          <Text style={styles.infoText}>
            {isOwner 
              ? request.visitor?.name || 'Unknown Visitor'
              : request.owner?.name || 'Unknown Owner'}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <FileText size={16} color={Colors.primary} />
          <Text style={styles.infoText}>{request.purpose}</Text>
        </View>
      </View>
      
      {isOwner && request.status === 'pending' && (
        <View style={styles.actions}>
          <Button
            title="Deny"
            variant="outline"
            size="small"
            onPress={handleDeny}
            style={styles.denyButton}
          />
          <Button
            title="Approve"
            variant="primary"
            size="small"
            onPress={handleApprove}
            style={styles.approveButton}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  status: {
    fontSize: 14,
    fontWeight: '600',
  },
  date: {
    fontSize: 12,
    color: Colors.subtext,
  },
  content: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  denyButton: {
    marginRight: 8,
  },
  approveButton: {
    minWidth: 100,
  },
});

export default RequestCard;