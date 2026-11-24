
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import { signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';

import {
  doc,
  setDoc,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore';

import { db, auth } from '../../firebase/firebaseConfig';

export default function ProfileScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');

  const [savedProfile, setSavedProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // Load saved profile from Firestore
  const loadProfile = async () => {
    try {
      const user = auth.currentUser;

      if (!user) return;

      const profileRef = doc(db, 'users', user.uid);
      const profileSnap = await getDoc(profileRef);

      if (profileSnap.exists()) {
        const data = profileSnap.data();

        setName(data.name || '');
        setEmail(data.email || '');
        setAge(data.age ? String(data.age) : '');

        setSavedProfile(data);
      }
    } catch (error) {
      console.log('Error loading profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  // Save profile
  const handleSave = async () => {
    try {
      const user = auth.currentUser;

      if (!user) {
        window.alert('Please login first.');
        return;
      }

      if (!name.trim() || !email.trim() || !age.trim()) {
        window.alert('Please fill all the fields.');
        return;
      }

      const ageNumber = Number(age);

      if (!Number.isInteger(ageNumber) || ageNumber <= 0) {
        window.alert('Please enter a valid age.');
        return;
      }

      const profileData = {
        name: name.trim(),
        email: email.trim(),
        age: ageNumber,
        updatedAt: serverTimestamp(),
      };

      await setDoc(
        doc(db, 'users', user.uid),
        profileData,
        { merge: true }
      );

      setSavedProfile({
        name: name.trim(),
        email: email.trim(),
        age: ageNumber,
      });

      window.alert('Profile saved successfully!');
    } catch (error) {
      console.log(error);
      window.alert('Unable to save profile.');
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      window.alert('Logged out successfully!');
      router.replace('/(auth)/login');
    } catch (error: any) {
      window.alert(error.message || 'Logout failed.');
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={styles.brand}>Luma</Text>

        <Text style={styles.title}>My Profile</Text>

        <Text style={styles.subtitle}>
          Manage your personal information.
        </Text>
      </View>

      <View style={styles.profileIcon}>
        <Text style={styles.iconText}>
          {name.trim() ? name.trim().charAt(0).toUpperCase() : 'L'}
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.heading}>Personal Details</Text>

        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          placeholderTextColor="#827F91"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#827F91"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Age</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your age"
          placeholderTextColor="#827F91"
          value={age}
          onChangeText={setAge}
          keyboardType="numeric"
        />

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>Save Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Display Saved Profile */}
      <View style={styles.savedCard}>
        <Text style={styles.savedHeading}>
          Saved Profile Details
        </Text>

        {loading ? (
          <ActivityIndicator color="#A99AE8" />
        ) : savedProfile ? (
          <>
            <Text style={styles.savedLabel}>Full Name</Text>
            <Text style={styles.savedText}>
              {savedProfile.name}
            </Text>

            <Text style={styles.savedLabel}>Email Address</Text>
            <Text style={styles.savedText}>
              {savedProfile.email}
            </Text>

            <Text style={styles.savedLabel}>Age</Text>
            <Text style={styles.savedText}>
              {savedProfile.age}
            </Text>
          </>
        ) : (
          <Text style={styles.savedText}>
            No profile details saved yet. Please save your profile.
          </Text>
        )}
      </View>

     

      <TouchableOpacity
        onPress={handleLogout}
        style={styles.logoutButton}
      >
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111116',
  },

  content: {
    paddingBottom: 30,
  },

  header: {
    backgroundColor: '#1C1C25',
    padding: 25,
    paddingTop: 45,
    paddingBottom: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#343342',
  },

  brand: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#A99AE8',
    letterSpacing: 3,
    marginBottom: 20,
  },

  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#F4F1FA',
  },

  subtitle: {
    fontSize: 14,
    color: '#A6A1B5',
    marginTop: 8,
  },

  profileIcon: {
    alignSelf: 'center',
    backgroundColor: '#292638',
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    borderWidth: 2,
    borderColor: '#A99AE8',
  },

  iconText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#C0B4F0',
  },

  form: {
    backgroundColor: '#1C1C25',
    margin: 20,
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#343342',
  },

  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#C0B4F0',
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E5E0F0',
    marginBottom: 8,
  },

  input: {
    borderWidth: 1,
    borderColor: '#454253',
    borderRadius: 10,
    padding: 13,
    marginBottom: 18,
    fontSize: 14,
    color: '#F4F1FA',
    backgroundColor: '#17171F',
  },

  saveButton: {
    backgroundColor: '#A99AE8',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 5,
  },

  saveButtonText: {
    color: '#17151F',
    fontSize: 16,
    fontWeight: 'bold',
  },

  savedCard: {
    backgroundColor: '#242331',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#454253',
  },

  savedHeading: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#C0B4F0',
    marginBottom: 18,
  },

  savedLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#A99AE8',
    marginBottom: 4,
  },

  savedText: {
    fontSize: 15,
    color: '#E5E0F0',
    marginBottom: 14,
    lineHeight: 22,
  },

  infoCard: {
    backgroundColor: '#1C1C25',
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#343342',
  },

  infoTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#C0B4F0',
  },

  infoText: {
    fontSize: 14,
    color: '#A6A1B5',
    marginTop: 10,
    lineHeight: 21,
  },

  logoutButton: {
    backgroundColor: '#292638',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: '#A99AE8',
  },

  logoutText: {
    color: '#C0B4F0',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
