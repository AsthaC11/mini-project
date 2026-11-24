
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';

import {
  TextInput,
  Button,
} from 'react-native-paper';

import {
  signInWithEmailAndPassword,
} from 'firebase/auth';

import { auth } from '../../firebase/firebaseConfig';
import { useRouter, Link } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      window.alert('Please enter your email and password.');
      return;
    }

    try {
      setLoading(true);

      await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      window.alert('Login successful! Welcome to Luma.');
      router.replace('/(tabs)');
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential') {
        window.alert('Invalid email or password.');
      } else if (error.code === 'auth/invalid-email') {
        window.alert('Please enter a valid email address.');
      } else if (error.code === 'auth/too-many-requests') {
        window.alert('Too many attempts. Please try again later.');
      } else {
        window.alert(error.message || 'Login failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>

      <View style={styles.logoCircle}>
  <MaterialCommunityIcons
    name="flower-outline"
    size={42}
    color="#C0B4F0"
  />
</View>

        <Text style={styles.brand}>Luma</Text>

        <Text style={styles.title}>Welcome Back</Text>

        <Text style={styles.subtitle}>
          Login to continue your skin and hair care journey.
        </Text>

        <View style={styles.form}>

          <Text style={styles.label}>Email Address</Text>

          <TextInput
            mode="outlined"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            outlineColor="#454253"
            activeOutlineColor="#A99AE8"
            textColor="#F4F1FA"
            placeholderTextColor="#827F91"
            style={styles.input}
            theme={{
              roundness: 10,
              colors: {
                background: '#1A1A23',
              },
            }}
          />

          <Text style={styles.label}>Password</Text>

          <TextInput
            mode="outlined"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            outlineColor="#454253"
            activeOutlineColor="#A99AE8"
            textColor="#F4F1FA"
            placeholderTextColor="#827F91"
            style={styles.input}
            theme={{
              roundness: 10,
              colors: {
                background: '#1A1A23',
              },
            }}
          
          />

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            buttonColor="#A99AE8"
            textColor="#17151F"
            style={styles.loginButton}
            contentStyle={styles.loginContent}
            labelStyle={styles.buttonText}
          >
            Login
          </Button>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>
              Don't have an account?{' '}
            </Text>

            <Link href="/(auth)/register" style={styles.registerLink}>
              Register
            </Link>
          </View>

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
    padding: 20,
  },

  card: {
    width: '100%',
    maxWidth: 450,
    backgroundColor: '#1C1C25',
    padding: 30,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#343342',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },

  logoCircle: {
    width: 65,
    height: 65,
    borderRadius: 33,
    backgroundColor: '#292834',
    borderWidth: 1,
    borderColor: '#A99AE8',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },

  logo: {
    fontSize: 35,
    color: '#A99AE8',
    fontWeight: '300',
  },

  brand: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#A99AE8',
    textAlign: 'center',
    letterSpacing: 3,
    marginBottom: 25,
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F4F1FA',
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 14,
    color: '#A6A1B5',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 30,
    lineHeight: 21,
  },

  form: {
    width: '100%',
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E5E0F0',
    marginBottom: 8,
  },

  input: {
    marginBottom: 20,
    fontSize: 14,
  },

  loginButton: {
    borderRadius: 12,
    marginTop: 5,
  },

  loginContent: {
    height: 48,
  },

  buttonText: {
    fontSize: 15,
    fontWeight: 'bold',
  },

  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: 25,
  },

  registerText: {
    color: '#A6A1B5',
    fontSize: 14,
  },

  registerLink: {
    color: '#B8ADD9',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
