
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <View style={styles.brand}>
  <MaterialCommunityIcons
    name="flower-outline"
    size={32}
    color="#C0B4F0"
  />
  <Text style={styles.logo}>Luma</Text>
</View>

        <Text style={styles.welcome}>Welcome to Luma</Text>

        <Text style={styles.subtitle}>
          Your personal skin and hair care companion.
        </Text>

        <View style={styles.headerLine} />
      </View>

      <Text style={styles.heading}>
        What would you like to explore?
      </Text>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push('/(tabs)/skin-analysis')}
        activeOpacity={0.8}
      >
        <View style={styles.cardIcon}>
          <MaterialCommunityIcons
            name="face-woman-outline"
            size={30}
            color="#A99AE8"
          />
        </View>

        <Text style={styles.cardTitle}>Skin Analysis</Text>

        <Text style={styles.cardDescription}>
          Understand your skin type and discover suitable skincare.
        </Text>

        <Text style={styles.cardButton}>
          Explore Skin Care  →
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.card}
        onPress={() => router.push('/(tabs)/hair-analysis')}
        activeOpacity={0.8}
      >
        <View style={styles.cardIcon}>
          <MaterialCommunityIcons
            name="hair-dryer"
            size={30}
            color="#A99AE8"
          />
        </View>

        <Text style={styles.cardTitle}>Hair Analysis</Text>

        <Text style={styles.cardDescription}>
          Learn about your hair type and find suitable hair care.
        </Text>

        <Text style={styles.cardButton}>
          Explore Hair Care  →
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.recommendationButton}
        onPress={() => router.push('/recommendations')}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons
          name="shopping-outline"
          size={22}
          color="#17151F"
        />

        <Text style={styles.recommendationButtonText}>
          View All Recommendations
        </Text>

        <MaterialCommunityIcons
          name="arrow-right"
          size={20}
          color="#17151F"
        />
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
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#343342',
  },

  logo: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#A99AE8',
    letterSpacing: 3,
    marginBottom: 28,
  },

  welcome: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#F4F1FA',
  },

  subtitle: {
    fontSize: 15,
    color: '#A6A1B5',
    marginTop: 8,
    lineHeight: 22,
  },

  headerLine: {
    width: 55,
    height: 3,
    backgroundColor: '#A99AE8',
    borderRadius: 5,
    marginTop: 22,
  },

  heading: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#F4F1FA',
    margin: 20,
    marginBottom: 10,
  },

  card: {
    backgroundColor: '#1C1C25',
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 22,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#343342',
    elevation: 3,
  },

  cardIcon: {
    width: 55,
    height: 55,
    borderRadius: 15,
    backgroundColor: '#292834',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#C0B4F0',
  },

  cardDescription: {
    fontSize: 14,
    color: '#A6A1B5',
    marginTop: 8,
    lineHeight: 21,
  },

  cardButton: {
    color: '#A99AE8',
    fontWeight: 'bold',
    marginTop: 17,
    fontSize: 14,
  },

  recommendationButton: {
    backgroundColor: '#A99AE8',
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 10,
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 10,
  },

  recommendationButtonText: {
    color: '#17151F',
    fontSize: 15,
    fontWeight: 'bold',
  },

  tipCard: {
    backgroundColor: '#242331',
    margin: 20,
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#454253',
    marginBottom: 35,
  },

  tipHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  tipTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#C0B4F0',
  },

  tipText: {
    fontSize: 14,
    color: '#C2BDCE',
    marginTop: 12,
    lineHeight: 22,
  },
  brand: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
  marginBottom: 28,
},
});
