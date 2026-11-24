
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';
import { useRouter, Link } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function RegisterScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      window.alert('Please fill in all the fields.');
      return;
    }

    if (password.length < 6) {
      window.alert('Password must contain at least 6 characters.');
      return;
    }

    try {
      setLoading(true);

      await createUserWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      window.alert('Registration successful! Welcome to Luma.');
      router.replace('/(tabs)');
    } catch (error: any) {
      window.alert(error.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.logoCircle}>
  <MaterialCommunityIcons
    name="flower-outline"
    size={42}
    color="#C0B4F0"
  />
</View>

      <Text style={styles.brand}>Luma</Text>

      <Text style={styles.title}>Create Account</Text>

      <Text style={styles.subtitle}>
        Start your personal skin and hair care journey.
      </Text>

      <View style={styles.form}>
        <Text style={styles.label}>Full Name</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter your name"
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

        <Text style={styles.label}>Password</Text>

        <TextInput
          style={styles.input}
          placeholder="Create a password"
          placeholderTextColor="#827F91"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, loading && styles.disabledButton]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Creating Account...' : 'Register'}
          </Text>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>
            Already have an account?{' '}
          </Text>

          <Link href="/(auth)/login" style={styles.loginLink}>
            Login
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#111116',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },

  logoCircle: {
    width: 65,
    height: 65,
    borderRadius: 33,
    backgroundColor: '#242431',
    borderWidth: 1,
    borderColor: '#A99AE8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  logo: {
    fontSize: 35,
    fontWeight: '300',
    color: '#A99AE8',
  },

  brand: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#A99AE8',
    textAlign: 'center',
    letterSpacing: 3,
    marginBottom: 22,
  },

  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#F4F1FA',
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 14,
    color: '#A6A1B5',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 25,
  },

  form: {
    width: '100%',
    maxWidth: 450,
    backgroundColor: '#1C1C25',
    padding: 22,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#343342',
    elevation: 4,
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
    backgroundColor: '#1A1A23',
    color: '#F4F1FA',
  },

  button: {
    backgroundColor: '#A99AE8',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 5,
  },

  disabledButton: {
    opacity: 0.6,
  },

  buttonText: {
    color: '#17151F',
    fontSize: 16,
    fontWeight: 'bold',
  },

  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 20,
  },

  loginText: {
    color: '#A6A1B5',
  },

  loginLink: {
    color: '#B8ADD9',
    fontWeight: 'bold',
  },
});
