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
import { ClipboardList, PlusCircle } from 'lucide-react-native';
import { router } from 'expo-router';

export default function VisitorRequestsScreen() {
  const { user } = useAuthStore();
  const { fetchRequestsByVisitor } = useVisitStore();
  
  const [requests, setRequests] = useState<VisitRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<VisitRequest[]>([]);
  const [activeFilter, setActiveFilter] = useState<RequestStatus | 'all'>('all');
  const [refreshing, setRefreshing] = useState(false);
  
  const loadRequests = async () => {
    if (user) {
      const visitorRequests = await fetchRequestsByVisitor(user.id);
      setRequests(visitorRequests);
      applyFilter(activeFilter, visitorRequests);
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
  
  const handleNewRequest = () => {
    router.push('/(app)/(visitor)/new-request');
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
          />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={
          <EmptyState
            title="No Requests Found"
            message={`You don't have any ${activeFilter !== 'all' ? activeFilter : ''} visit requests.`}
            icon={<ClipboardList size={48} color={Colors.subtext} />}
            actionLabel="Create New Request"
            onAction={handleNewRequest}
          />
        }
      />
      
      <TouchableOpacity 
        style={styles.fab}
        onPress={handleNewRequest}
      >
        <PlusCircle size={24} color="#FFFFFF" />
      </TouchableOpacity>
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
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});