
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import { router } from 'expo-router';

export default function Index() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;
    let timer: ReturnType<typeof setTimeout>;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      timer = setTimeout(() => {
        if (isActive) {
          if (user) {
            router.replace('/(tabs)');
          } else {
            router.replace('/(auth)/login');
          }

          setLoading(false);
        }
      }, 3000);
    });

    return () => {
      isActive = false;
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.logoCircle}>
          <MaterialCommunityIcons
            name="flower-outline"
            size={65}
            color="#C0B4F0"
          />
        </View>

        <Text style={styles.title}>Luma</Text>

        <Text style={styles.subtitle}>
          Your personal beauty companion
        </Text>

        <ActivityIndicator
          size="large"
          color="#A99AE8"
          style={styles.loader}
        />

        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111116',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#242431',
    borderWidth: 1,
    borderColor: '#A99AE8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 22,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#F4F1FA',
    letterSpacing: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#A6A1B5',
    marginTop: 12,
  },
  loader: {
    marginTop: 40,
  },
  loadingText: {
    fontSize: 12,
    color: '#8279B5',
    marginTop: 12,
    letterSpacing: 1,
  },
});
