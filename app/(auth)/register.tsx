import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/auth-store';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import { 
  validateEmail, 
  validatePassword, 
  validateName, 
  validatePhone 
} from '@/utils/validation';
import { ArrowLeft } from 'lucide-react-native';
import { UserType } from '@/types';

export default function RegisterScreen() {
  const { register, isLoading, error, clearError } = useAuthStore();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<UserType>('visitor');
  const [address, setAddress] = useState('');
  
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [addressError, setAddressError] = useState('');
  
  const validateForm = () => {
    let isValid = true;
    
    if (!validateName(name)) {
      setNameError('Please enter a valid name');
      isValid = false;
    } else {
      setNameError('');
    }
    
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }
    
    if (!validatePhone(phone)) {
      setPhoneError('Please enter a valid phone number');
      isValid = false;
    } else {
      setPhoneError('');
    }
    
    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 6 characters');
      isValid = false;
    } else {
      setPasswordError('');
    }
    
    if (password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
      isValid = false;
    } else {
      setConfirmPasswordError('');
    }
    
    if (userType === 'owner' && !address.trim()) {
      setAddressError('Address is required for owners');
      isValid = false;
    } else {
      setAddressError('');
    }
    
    return isValid;
  };
  
  const handleRegister = async () => {
    if (validateForm()) {
      clearError();
      await register(
        {
          name,
          email,
          phone,
          type: userType,
          ...(userType === 'owner' ? { address } : {}),
        },
        password
      );
    }
  };
  
  const handleBack = () => {
    router.back();
  };
  
  const handleLogin = () => {
    router.push('/(auth)/login');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBack}
          >
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          
          <View style={styles.content}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Sign up to get started</Text>
            
            <View style={styles.userTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  userType === 'visitor' && styles.userTypeButtonActive
                ]}
                onPress={() => setUserType('visitor')}
              >
                <Text 
                  style={[
                    styles.userTypeText,
                    userType === 'visitor' && styles.userTypeTextActive
                  ]}
                >
                  Visitor
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.userTypeButton,
                  userType === 'owner' && styles.userTypeButtonActive
                ]}
                onPress={() => setUserType('owner')}
              >
                <Text 
                  style={[
                    styles.userTypeText,
                    userType === 'owner' && styles.userTypeTextActive
                  ]}
                >
                  Owner
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.form}>
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={name}
                onChangeText={setName}
                error={nameError}
              />
              
              <Input
                label="Email"
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                error={emailError}
              />
              
              <Input
                label="Phone"
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
                error={phoneError}
              />
              
              {userType === 'owner' && (
                <Input
                  label="Address"
                  placeholder="Enter your address"
                  value={address}
                  onChangeText={setAddress}
                  error={addressError}
                />
              )}
              
              <Input
                label="Password"
                placeholder="Create a password"
                isPassword
                value={password}
                onChangeText={setPassword}
                error={passwordError}
              />
              
              <Input
                label="Confirm Password"
                placeholder="Confirm your password"
                isPassword
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                error={confirmPasswordError}
              />
              
              {error && (
                <Text style={styles.errorText}>{error}</Text>
              )}
              
              <Button
                title="Register"
                onPress={handleRegister}
                isLoading={isLoading}
                style={styles.registerButton}
              />
            </View>
            
            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <TouchableOpacity onPress={handleLogin}>
                <Text style={styles.loginText}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  backButton: {
    padding: 16,
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.subtext,
    marginBottom: 32,
  },
  userTypeContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  userTypeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  userTypeButtonActive: {
    backgroundColor: Colors.primary,
  },
  userTypeText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  userTypeTextActive: {
    color: '#FFFFFF',
  },
  form: {
    marginBottom: 24,
  },
  errorText: {
    color: Colors.error,
    marginBottom: 16,
  },
  registerButton: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: Colors.subtext,
    marginRight: 4,
  },
  loginText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
});