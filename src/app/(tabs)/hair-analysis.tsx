
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import {
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';

import { db, auth } from '../../firebase/firebaseConfig';

export default function HairAnalysisScreen() {
  const [hairType, setHairType] = useState('');
  const [concerns, setConcerns] = useState<string[]>([]);
  const [scalp, setScalp] = useState('');
  const [loading, setLoading] = useState(false);

  const hairTypes = [
    'Straight',
    'Wavy',
    'Curly',
    'Coily',
  ];

  const hairConcerns = [
    'Hair Fall',
    'Dandruff',
    'Dry Hair',
    'Frizzy Hair',
    'Split Ends',
    'Slow Hair Growth',
  ];

  const scalpTypes = [
    'Dry',
    'Oily',
    'Normal',
    'Sensitive',
  ];

  const toggleConcern = (item: string) => {
    if (concerns.includes(item)) {
      setConcerns(concerns.filter((concern) => concern !== item));
    } else {
      setConcerns([...concerns, item]);
    }
  };

  const handleSubmit = async () => {
    if (!hairType || concerns.length === 0 || !scalp) {
      window.alert('Please select your hair type, concerns and scalp type.');
      return;
    }

    const user = auth.currentUser;

    if (!user) {
      window.alert('Please login before submitting your analysis.');
      return;
    }

    try {
      setLoading(true);

      await addDoc(collection(db, 'hairAnalysis'), {
        userId: user.uid,
        email: user.email,
        hairType: hairType,
        concerns: concerns,
        scalp: scalp,
        createdAt: serverTimestamp(),
      });

      window.alert('Hair Analysis saved successfully!');

      setHairType('');
      setConcerns([]);
      setScalp('');

    } catch (error: any) {
      window.alert(error.message || 'Failed to save hair analysis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={styles.brand}>Luma</Text>

        <Text style={styles.title}>Hair Analysis</Text>

        <Text style={styles.subtitle}>
          Tell us about your hair to discover a suitable hair care routine.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>01. Select Your Hair Type</Text>

        <View style={styles.options}>
          {hairTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.option,
                hairType === type && styles.selectedOption,
              ]}
              onPress={() => setHairType(type)}
            >
              <Text
                style={[
                  styles.optionText,
                  hairType === type && styles.selectedText,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>02. Your Hair Concerns</Text>

        <Text style={styles.description}>
          Select all the concerns that apply to you.
        </Text>

        <View style={styles.options}>
          {hairConcerns.map((item) => (
            <TouchableOpacity
              key={item}
              style={[
                styles.option,
                concerns.includes(item) && styles.selectedOption,
              ]}
              onPress={() => toggleConcern(item)}
            >
              <Text
                style={[
                  styles.optionText,
                  concerns.includes(item) && styles.selectedText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>03. Select Your Scalp Type</Text>

        <View style={styles.options}>
          {scalpTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.option,
                scalp === type && styles.selectedOption,
              ]}
              onPress={() => setScalp(type)}
            >
              <Text
                style={[
                  styles.optionText,
                  scalp === type && styles.selectedText,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.submitButton,
          loading && styles.disabledButton,
        ]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.submitText}>
          {loading ? 'Saving...' : 'Submit Analysis'}
        </Text>
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
    fontSize: 27,
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
    backgroundColor: '#1C1C25',
    margin: 15,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#343342',
  },

  heading: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#C0B4F0',
    marginBottom: 15,
  },

  description: {
    color: '#A6A1B5',
    marginBottom: 14,
    fontSize: 13,
  },

  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  option: {
    borderWidth: 1,
    borderColor: '#454253',
    backgroundColor: '#242431',
    paddingVertical: 11,
    paddingHorizontal: 17,
    borderRadius: 20,
  },

  selectedOption: {
    backgroundColor: '#A99AE8',
    borderColor: '#A99AE8',
  },

  optionText: {
    color: '#C2BDCE',
    fontSize: 14,
  },

  selectedText: {
    color: '#17151F',
    fontWeight: 'bold',
  },

  submitButton: {
    backgroundColor: '#A99AE8',
    marginHorizontal: 15,
    marginTop: 10,
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },

  disabledButton: {
    opacity: 0.6,
  },

  submitText: {
    color: '#17151F',
    fontSize: 16,
    fontWeight: 'bold',
  },

  note: {
    color: '#827F91',
    fontSize: 12,
    textAlign: 'center',
    margin: 20,
    marginBottom: 35,
    lineHeight: 18,
  },
});
