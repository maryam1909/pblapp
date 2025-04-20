import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { useAuthStore } from '@/store/auth-store';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import { 
  User, 
  Mail, 
  Phone, 
  LogOut, 
  Settings, 
  HelpCircle, 
  Shield,
  Bell,
} from 'lucide-react-native';

export default function VisitorProfileScreen() {
  const { user, logout } = useAuthStore();
  
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: logout,
          style: 'destructive',
        },
      ]
    );
  };
  
  const handleSettingsPress = () => {
    // Navigate to settings in a real app
    Alert.alert('Settings', 'Settings would open here in a real app.');
  };
  
  const handleHelpPress = () => {
    // Navigate to help in a real app
    Alert.alert('Help', 'Help section would open here in a real app.');
  };
  
  const handlePrivacyPress = () => {
    // Navigate to privacy in a real app
    Alert.alert('Privacy', 'Privacy settings would open here in a real app.');
  };
  
  const handleNotificationsPress = () => {
    // Navigate to notification settings in a real app
    Alert.alert('Notifications', 'Notification settings would open here in a real app.');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            {user?.profileImage ? (
              <Image 
                source={{ uri: user.profileImage }} 
                style={styles.avatar} 
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarText}>
                  {user?.name?.charAt(0) || 'U'}
                </Text>
              </View>
            )}
          </View>
          
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.userType}>Visitor</Text>
        </View>
        
        <View style={styles.infoSection}>
          <View style={styles.infoItem}>
            <Mail size={20} color={Colors.primary} style={styles.infoIcon} />
            <View>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{user?.email}</Text>
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <Phone size={20} color={Colors.primary} style={styles.infoIcon} />
            <View>
              <Text style={styles.infoLabel}>Phone</Text>
              <Text style={styles.infoValue}>{user?.phone}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.settingsSection}>
          <TouchableOpacity 
            style={styles.settingsItem}
            onPress={handleSettingsPress}
          >
            <Settings size={20} color={Colors.text} style={styles.settingsIcon} />
            <Text style={styles.settingsText}>Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingsItem}
            onPress={handleNotificationsPress}
          >
            <Bell size={20} color={Colors.text} style={styles.settingsIcon} />
            <Text style={styles.settingsText}>Notification Preferences</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingsItem}
            onPress={handleHelpPress}
          >
            <HelpCircle size={20} color={Colors.text} style={styles.settingsIcon} />
            <Text style={styles.settingsText}>Help & Support</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.settingsItem}
            onPress={handlePrivacyPress}
          >
            <Shield size={20} color={Colors.text} style={styles.settingsIcon} />
            <Text style={styles.settingsText}>Privacy & Security</Text>
          </TouchableOpacity>
        </View>
        
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="outline"
          style={styles.logoutButton}
          icon={<LogOut size={18} color={Colors.primary} style={styles.logoutIcon} />}
        />
        
        <Text style={styles.version}>Version 1.0.0</Text>
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
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  userType: {
    fontSize: 16,
    color: Colors.subtext,
  },
  infoSection: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoIcon: {
    marginRight: 16,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.subtext,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: Colors.text,
  },
  settingsSection: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingsIcon: {
    marginRight: 16,
  },
  settingsText: {
    fontSize: 16,
    color: Colors.text,
  },
  logoutButton: {
    marginBottom: 24,
  },
  logoutIcon: {
    marginRight: 8,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.subtext,
    marginBottom: 16,
  },
});