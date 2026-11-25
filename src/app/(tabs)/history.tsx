
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

import { auth, db } from '../../firebase/firebaseConfig';

export default function HistoryScreen() {
  const [skinHistory, setSkinHistory] = useState<any[]>([]);
  const [hairHistory, setHairHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadHistory = async () => {
    const user = auth.currentUser;

    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const skinQuery = query(
        collection(db, 'skinAnalysis'),
        where('userId', '==', user.uid)
      );

      const hairQuery = query(
        collection(db, 'hairAnalysis'),
        where('userId', '==', user.uid)
      );

      const skinSnapshot = await getDocs(skinQuery);
      const hairSnapshot = await getDocs(hairQuery);

      setSkinHistory(
        skinSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }))
      );

      setHairHistory(
        hairSnapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }))
      );
    } catch (error: any) {
      window.alert(error.message || 'Unable to load history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const deleteHistory = (id: string, type: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this ${type} analysis?`
    );

    if (!confirmed) {
      return;
    }

    handleDelete(id, type);
  };

  const handleDelete = async (id: string, type: string) => {
    const user = auth.currentUser;

    if (!user) {
      window.alert('Please login to delete this record.');
      return;
    }

    try {
      setDeletingId(id);

      const collectionName =
        type === 'Skin' ? 'skinAnalysis' : 'hairAnalysis';

      await deleteDoc(doc(db, collectionName, id));

      if (type === 'Skin') {
        setSkinHistory((previous) =>
          previous.filter((item) => item.id !== id)
        );
      } else {
        setHairHistory((previous) =>
          previous.filter((item) => item.id !== id)
        );
      }

      window.alert(`${type} analysis deleted successfully.`);
    } catch (error: any) {
      window.alert(error.message || 'Unable to delete record.');
    } finally {
      setDeletingId(null);
    }
  };

  const renderHistory = (items: any[], type: string) => {
    if (items.length === 0) {
      return (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyText}>
            No {type.toLowerCase()} analysis found.
          </Text>
        </View>
      );
    }

    return items.map((item) => (
      <View key={item.id} style={styles.card}>
        <Text style={styles.cardTitle}>
          {type} Analysis
        </Text>

        <View style={styles.separator} />

        <Text style={styles.label}>
          {type === 'Skin' ? 'Skin Type' : 'Hair Type'}
        </Text>

        <Text style={styles.detail}>
          {type === 'Skin' ? item.skinType : item.hairType}
        </Text>

        <Text style={styles.label}>Concerns</Text>

        <Text style={styles.detail}>
          {item.concerns?.length
            ? item.concerns.join(', ')
            : 'No concerns recorded'}
        </Text>

        <Text style={styles.label}>
          {type === 'Skin' ? 'Sensitivity' : 'Scalp Type'}
        </Text>

        <Text style={styles.detail}>
          {type === 'Skin'
            ? item.sensitivity || 'Not specified'
            : item.scalp || 'Not specified'}
        </Text>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteHistory(item.id, type)}
          disabled={deletingId === item.id}
        >
          {deletingId === item.id ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.deleteText}>Delete</Text>
          )}
        </TouchableOpacity>
      </View>
    ));
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#A99AE8" />
        <Text style={styles.loadingText}>
          Loading your history...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={styles.brand}>Luma</Text>

        <Text style={styles.title}>My Analysis History</Text>

        <Text style={styles.subtitle}>
          View your previous skin and hair analysis results.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Skin Analysis</Text>
        {renderHistory(skinHistory, 'Skin')}
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Hair Analysis</Text>
        {renderHistory(hairHistory, 'Hair')}
      </View>

      <TouchableOpacity
        style={styles.refreshButton}
        onPress={() => {
          setLoading(true);
          loadHistory();
        }}
      >
        <Text style={styles.refreshText}>Refresh History</Text>
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
    paddingBottom: 25,
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
    fontSize: 26,
    fontWeight: 'bold',
    color: '#F4F1FA',
  },

  subtitle: {
    fontSize: 14,
    color: '#A6A1B5',
    marginTop: 10,
    lineHeight: 21,
  },

  section: {
    margin: 20,
    marginBottom: 5,
  },

  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#C0B4F0',
    marginBottom: 15,
  },

  card: {
    backgroundColor: '#1C1C25',
    padding: 18,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#343342',
    elevation: 2,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#C0B4F0',
    marginBottom: 12,
  },

  separator: {
    height: 1,
    backgroundColor: '#343342',
    marginBottom: 15,
  },

  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#A99AE8',
    marginBottom: 5,
  },

  detail: {
    fontSize: 14,
    color: '#E5E0F0',
    marginBottom: 13,
    lineHeight: 21,
  },

  emptyCard: {
    backgroundColor: '#1C1C25',
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#343342',
  },

  emptyText: {
    color: '#A6A1B5',
    textAlign: 'center',
    lineHeight: 21,
  },

  deleteButton: {
    backgroundColor: '#8F4658',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5,
  },

  deleteText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111116',
  },

  loadingText: {
    color: '#A6A1B5',
    marginTop: 12,
    fontSize: 14,
  },

  refreshButton: {
    backgroundColor: '#A99AE8',
    marginHorizontal: 20,
    marginTop: 15,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },

  refreshText: {
    color: '#17151F',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
