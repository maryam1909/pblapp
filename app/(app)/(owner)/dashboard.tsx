import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useAuthStore } from '@/store/auth-store';
import { useVisitStore } from '@/store/visit-store';
import { useNotificationStore } from '@/store/notification-store';
import { VisitRequest } from '@/types';
import RequestCard from '@/components/RequestCard';
import EmptyState from '@/components/EmptyState';
import Colors from '@/constants/colors';
import { router } from 'expo-router';
import { 
  Clock, 
  CheckCheck, 
  X, 
  Bell, 
  ArrowRight,
  ClipboardList,
} from 'lucide-react-native';

export default function OwnerDashboardScreen() {
  const { user } = useAuthStore();
  const { fetchRequestsByOwner, updateRequestStatus } = useVisitStore();
  const { notifications } = useNotificationStore();
  
  const [pendingRequests, setPendingRequests] = useState<VisitRequest[]>([]);
  const [recentRequests, setRecentRequests] = useState<VisitRequest[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    denied: 0,
  });
  
  const unreadNotifications = notifications.filter(
    n => n.userId === user?.id && !n.read
  ).length;
  
  const loadData = async () => {
    if (user) {
      const requests = await fetchRequestsByOwner(user.id);
      
      // Get pending requests
      const pending = requests.filter(r => r.status === 'pending');
      setPendingRequests(pending);
      
      // Get recent requests (last 5, excluding pending)
      const recent = requests
        .filter(r => r.status !== 'pending')
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);
      setRecentRequests(recent);
      
      // Calculate stats
      setStats({
        pending: requests.filter(r => r.status === 'pending').length,
        approved: requests.filter(r => r.status === 'approved').length,
        denied: requests.filter(r => r.status === 'denied').length,
      });
    }
  };
  
  useEffect(() => {
    loadData();
  }, [user]);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };
  
  const handleApprove = async (requestId: string) => {
    await updateRequestStatus(requestId, 'approved');
    await loadData();
  };
  
  const handleDeny = async (requestId: string) => {
    await updateRequestStatus(requestId, 'denied');
    await loadData();
  };
  
  const handleViewAllRequests = () => {
    router.push('/(app)/(owner)/requests');
  };
  
  const handleViewNotifications = () => {
    router.push('/(app)/(owner)/notifications');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0]}</Text>
          
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={handleViewNotifications}
          >
            <Bell size={24} color={Colors.text} />
            {unreadNotifications > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>
                  {unreadNotifications}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: Colors.warning + '20' }]}>
              <Clock size={20} color={Colors.warning} />
            </View>
            <Text style={styles.statValue}>{stats.pending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: Colors.success + '20' }]}>
              <CheckCheck size={20} color={Colors.success} />
            </View>
            <Text style={styles.statValue}>{stats.approved}</Text>
            <Text style={styles.statLabel}>Approved</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.statIconContainer, { backgroundColor: Colors.error + '20' }]}>
              <X size={20} color={Colors.error} />
            </View>
            <Text style={styles.statValue}>{stats.denied}</Text>
            <Text style={styles.statLabel}>Denied</Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pending Requests</Text>
            {pendingRequests.length > 0 && (
              <TouchableOpacity onPress={handleViewAllRequests}>
                <Text style={styles.viewAll}>View All</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {pendingRequests.length > 0 ? (
            pendingRequests.slice(0, 3).map(request => (
              <RequestCard
                key={request.id}
                request={request}
                isOwner
                onApprove={handleApprove}
                onDeny={handleDeny}
              />
            ))
          ) : (
            <EmptyState
              title="No Pending Requests"
              message="You don't have any pending visitor requests at the moment."
              icon={<ClipboardList size={48} color={Colors.subtext} />}
            />
          )}
        </View>
        
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            {recentRequests.length > 0 && (
              <TouchableOpacity onPress={handleViewAllRequests}>
                <Text style={styles.viewAll}>View All</Text>
              </TouchableOpacity>
            )}
          </View>
          
          {recentRequests.length > 0 ? (
            recentRequests.map(request => (
              <RequestCard
                key={request.id}
                request={request}
                isOwner
              />
            ))
          ) : (
            <EmptyState
              title="No Recent Activity"
              message="Your recent visitor activity will appear here."
              icon={<ClipboardList size={48} color={Colors.subtext} />}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  notificationButton: {
    position: 'relative',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: Colors.notification,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationCount: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.subtext,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  viewAll: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
});