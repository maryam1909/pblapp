import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useAuthStore } from '@/store/auth-store';
import { useVisitStore } from '@/store/visit-store';
import { Owner } from '@/types';
import Input from '@/components/Input';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import { validateRequired } from '@/utils/validation';
import { router } from 'expo-router';
import { Calendar, Clock, FileText, User } from 'lucide-react-native';
import { mockOwners } from '@/mocks/data';

export default function NewRequestScreen() {
  const { user } = useAuthStore();
  const { createRequest, isLoading, error, clearError } = useVisitStore();
  
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [purpose, setPurpose] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [showOwnersList, setShowOwnersList] = useState(false);
  
  const [purposeError, setPurposeError] = useState('');
  const [dateError, setDateError] = useState('');
  const [timeError, setTimeError] = useState('');
  const [ownerError, setOwnerError] = useState('');
  
  useEffect(() => {
    // Reset any previous errors
    clearError();
  }, []);
  
  const validateForm = () => {
    let isValid = true;
    
    if (!selectedOwner) {
      setOwnerError('Please select a property owner');
      isValid = false;
    } else {
      setOwnerError('');
    }
    
    if (!validateRequired(purpose)) {
      setPurposeError('Please enter the purpose of your visit');
      isValid = false;
    } else {
      setPurposeError('');
    }
    
    if (!validateRequired(date)) {
      setDateError('Please enter a date for your visit');
      isValid = false;
    } else {
      setDateError('');
    }
    
    if (!validateRequired(time)) {
      setTimeError('Please enter a time for your visit');
      isValid = false;
    } else {
      setTimeError('');
    }
    
    return isValid;
  };
  
  const handleSubmit = async () => {
    if (validateForm() && user && selectedOwner) {
      try {
        const newRequest = await createRequest({
          visitorId: user.id,
          ownerId: selectedOwner.id,
          purpose,
          date,
          time,
        });
        
        console.log("Created request:", newRequest);
        
        Alert.alert(
          'Request Submitted',
          'Your visit request has been submitted successfully. You will be notified when the owner responds.',
          [
            {
              text: 'OK',
              onPress: () => router.push('/(app)/(visitor)/requests'),
            },
          ]
        );
      } catch (err) {
        console.error("Error creating request:", err);
        Alert.alert('Error', 'Failed to submit request. Please try again.');
      }
    }
  };
  
  const toggleOwnersList = () => {
    setShowOwnersList(!showOwnersList);
  };
  
  const selectOwner = (owner: Owner) => {
    setSelectedOwner(owner);
    setShowOwnersList(false);
    setOwnerError('');
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
          <Text style={styles.title}>Create Visit Request</Text>
          <Text style={styles.subtitle}>
            Fill in the details below to request a visit to a property
          </Text>
          
          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Property Owner</Text>
              <TouchableOpacity 
                style={[
                  styles.ownerSelector,
                  ownerError ? styles.inputError : {},
                ]}
                onPress={toggleOwnersList}
              >
                <User size={20} color={Colors.subtext} style={styles.inputIcon} />
                <Text style={selectedOwner ? styles.ownerText : styles.ownerPlaceholder}>
                  {selectedOwner ? selectedOwner.name : 'Select a property owner'}
                </Text>
              </TouchableOpacity>
              {ownerError ? <Text style={styles.errorText}>{ownerError}</Text> : null}
              
              {showOwnersList && (
                <View style={styles.ownersList}>
                  {mockOwners.map(owner => (
                    <TouchableOpacity
                      key={owner.id}
                      style={styles.ownerItem}
                      onPress={() => selectOwner(owner)}
                    >
                      <Text style={styles.ownerName}>{owner.name}</Text>
                      <Text style={styles.ownerAddress}>{owner.address}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Purpose of Visit</Text>
              <View style={styles.inputContainer}>
                <FileText size={20} color={Colors.subtext} style={styles.inputIcon} />
                <Input
                  placeholder="e.g., Maintenance, Delivery, Social visit"
                  value={purpose}
                  onChangeText={setPurpose}
                  error={purposeError}
                  containerStyle={styles.inputWrapper}
                  inputStyle={styles.input}
                />
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Date of Visit</Text>
              <View style={styles.inputContainer}>
                <Calendar size={20} color={Colors.subtext} style={styles.inputIcon} />
                <Input
                  placeholder="YYYY-MM-DD"
                  value={date}
                  onChangeText={setDate}
                  error={dateError}
                  containerStyle={styles.inputWrapper}
                  inputStyle={styles.input}
                />
              </View>
            </View>
            
            <View style={styles.formGroup}>
              <Text style={styles.label}>Time of Visit</Text>
              <View style={styles.inputContainer}>
                <Clock size={20} color={Colors.subtext} style={styles.inputIcon} />
                <Input
                  placeholder="HH:MM"
                  value={time}
                  onChangeText={setTime}
                  error={timeError}
                  containerStyle={styles.inputWrapper}
                  inputStyle={styles.input}
                />
              </View>
            </View>
            
            {error && (
              <Text style={styles.formError}>{error}</Text>
            )}
            
            <Button
              title="Submit Request"
              onPress={handleSubmit}
              isLoading={isLoading}
              style={styles.submitButton}
            />
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
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.subtext,
    marginBottom: 24,
  },
  form: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputIcon: {
    marginRight: 12,
  },
  inputWrapper: {
    flex: 1,
    marginBottom: 0,
  },
  input: {
    backgroundColor: Colors.background,
  },
  ownerSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  ownerText: {
    fontSize: 16,
    color: Colors.text,
  },
  ownerPlaceholder: {
    fontSize: 16,
    color: Colors.subtext,
  },
  ownersList: {
    marginTop: 8,
    backgroundColor: Colors.background,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    maxHeight: 200,
  },
  ownerItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 4,
  },
  ownerAddress: {
    fontSize: 14,
    color: Colors.subtext,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorText: {
    color: Colors.error,
    fontSize: 12,
    marginTop: 4,
  },
  formError: {
    color: Colors.error,
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 8,
  },
});