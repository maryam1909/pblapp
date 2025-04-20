import React, { useEffect, useState } from 'react';
import { 
  View, 
  StyleSheet, 
  SafeAreaView, 
  FlatList, 
  Text,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useAuthStore } from '@/store/auth-store';
import { useVisitStore } from '@/store/visit-store';
import { VisitRequest, RequestStatus } from '@/types';
import RequestCard from '@/components/RequestCard';
import EmptyState from '@/components/EmptyState';
import Colors from '@/constants/colors';
import { ClipboardList } from 'lucide-react-native';

export default function OwnerRequestsScreen() {
  const { user } = useAuthStore();
  const { fetchRequestsByOwner, updateRequestStatus } = useVisitStore();
  
  const [requests, setRequests] = useState<VisitRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<VisitRequest[]>([]);
  const [activeFilter, setActiveFilter] = useState<RequestStatus | 'all'>('all');
  const [refreshing, setRefreshing] = useState(false);
  
  const loadRequests = async () => {
    if (user) {
      const ownerRequests = await fetchRequestsByOwner(user.id);
      setRequests(ownerRequests);
      applyFilter(activeFilter, ownerRequests);
    }
  };
  
  useEffect(() => {
    loadRequests();
  }, [user]);
  
  const applyFilter = (filter: RequestStatus | 'all', requestList = requests) => {
    setActiveFilter(filter);
    
    if (filter === 'all') {
      setFilteredRequests(requestList);
    } else {
      setFilteredRequests(requestList.filter(request => request.status === filter));
    }
  };
  
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadRequests();
    setRefreshing(false);
  };
  
  const handleApprove = async (requestId: string) => {
    await updateRequestStatus(requestId, 'approved');
    await loadRequests();
  };
  
  const handleDeny = async (requestId: string) => {
    await updateRequestStatus(requestId, 'denied');
    await loadRequests();
  };
  
  const renderFilterButton = (filter: RequestStatus | 'all', label: string) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        activeFilter === filter && styles.activeFilterButton
      ]}
      onPress={() => applyFilter(filter)}
    >
      <Text
        style={[
          styles.filterButtonText,
          activeFilter === filter && styles.activeFilterButtonText
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.filterContainer}>
        {renderFilterButton('all', 'All')}
        {renderFilterButton('pending', 'Pending')}
        {renderFilterButton('approved', 'Approved')}
        {renderFilterButton('denied', 'Denied')}
      </View>
      
      <FlatList
        data={filteredRequests}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RequestCard
            request={item}
            isOwner
            onApprove={handleApprove}
            onDeny={handleDeny}
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <EmptyState
            title="No Requests Found"
            message={`You don't have any ${activeFilter !== 'all' ? activeFilter : ''} visitor requests.`}
            icon={<ClipboardList size={48} color={Colors.subtext} />}
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
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: Colors.background,
  },
  activeFilterButton: {
    backgroundColor: Colors.primary,
  },
  filterButtonText: {
    fontSize: 14,
    color: Colors.text,
  },
  activeFilterButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
});