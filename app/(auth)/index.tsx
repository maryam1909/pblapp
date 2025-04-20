import React from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import { Home, User } from 'lucide-react-native';

export default function WelcomeScreen() {
  const { demoLogin, isLoading } = useAuthStore();

  const handleLogin = () => {
    router.push('/(auth)/login');
  };

  const handleRegister = () => {
    router.push('/(auth)/register');
  };

  const handleDemoOwnerLogin = async () => {
    try {
      await demoLogin('owner');
    } catch (error) {
      console.error('Demo login error:', error);
    }
  };

  const handleDemoVisitorLogin = async () => {
    try {
      await demoLogin('visitor');
    } catch (error) {
      console.error('Demo login error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1586769852044-692d6e3703f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80' }}
            style={styles.logo}
          />
        </View>
        
        <Text style={styles.title}>Visitor Management System</Text>
        <Text style={styles.subtitle}>
          Streamline visitor access and enhance security with our modern visitor management solution
        </Text>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Login"
            onPress={handleLogin}
            style={styles.button}
          />
          <Button
            title="Register"
            onPress={handleRegister}
            variant="outline"
            style={styles.button}
          />
        </View>
        
        <View style={styles.demoSection}>
          <Text style={styles.demoTitle}>Quick Demo Access</Text>
          
          <View style={styles.demoButtons}>
            <Button
              title="Demo as Owner"
              onPress={handleDemoOwnerLogin}
              variant="secondary"
              style={styles.demoButton}
              textStyle={styles.demoButtonText}
              isLoading={isLoading}
            />
            <Button
              title="Demo as Visitor"
              onPress={handleDemoVisitorLogin}
              variant="secondary"
              style={styles.demoButton}
              textStyle={styles.demoButtonText}
              isLoading={isLoading}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.subtext,
    textAlign: 'center',
    marginBottom: 32,
    paddingHorizontal: 24,
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 48,
  },
  button: {
    marginBottom: 16,
  },
  demoSection: {
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 24,
  },
  demoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.subtext,
    textAlign: 'center',
    marginBottom: 16,
  },
  demoButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  demoButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  demoButtonText: {
    fontSize: 14,
  },
});