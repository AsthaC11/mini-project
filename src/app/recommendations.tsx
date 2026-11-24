
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';

import {
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';

import { db, auth } from '../firebase/firebaseConfig';

type Product = {
  code: string;
  product_name: string;
  brands: string;
  image_front_url: string;
  ingredients_text: string;
};

export default function RecommendationsScreen() {
  const [skinType, setSkinType] = useState('');
  const [concerns, setConcerns] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Select search keywords based on skin concerns
  const getSearchTerms = (concerns: string[]) => {
    const terms: string[] = [];

    concerns.forEach((concern) => {
      const value = concern.toLowerCase();

      if (value.includes('acne')) {
        terms.push('acne', 'face cleanser', 'face moisturizer');
      }

      if (value.includes('dark spots')) {
        terms.push('face serum', 'skin brightening');
      }

      if (value.includes('wrinkles')) {
        terms.push('anti aging', 'face cream');
      }

      if (value.includes('dullness')) {
        terms.push('face serum', 'face moisturizer');
      }

      if (value.includes('uneven skin tone')) {
        terms.push('face serum', 'face cream');
      }
    });

    terms.push(
      'face cream',
      'moisturizer',
      'facial cleanser',
      'sunscreen',
      'face serum'
    );

    return [...new Set(terms)];
  };

  // Load recommendations
  const loadRecommendations = async () => {
    try {
      setLoading(true);
      setError('');
      setProducts([]);

      const user = auth.currentUser;

      if (!user) {
        setError('Please log in to view recommendations.');
        return;
      }

      // Get skin analysis from Firestore
      const analysisQuery = query(
        collection(db, 'skinAnalysis'),
        where('userId', '==', user.uid)
      );

      const analysisSnapshot = await getDocs(analysisQuery);

      if (analysisSnapshot.empty) {
        setError('Please complete your skin analysis first.');
        return;
      }

      // Get latest skin analysis
      const analyses = analysisSnapshot.docs.map((doc) => doc.data());

      analyses.sort((a, b) => {
        const dateA = a.createdAt?.toMillis?.() || 0;
        const dateB = b.createdAt?.toMillis?.() || 0;
        return dateB - dateA;
      });

      const latestAnalysis = analyses[0];

      const userSkinType = latestAnalysis.skinType || '';
      const userConcerns: string[] = latestAnalysis.concerns || [];

      setSkinType(userSkinType);
      setConcerns(userConcerns);

      // Get search keywords
      const searchTerms = getSearchTerms(userConcerns);

      let allProducts: Product[] = [];

      // Search multiple keywords
      for (const term of searchTerms) {
        try {
          const url =
            'https://world.openbeautyfacts.org/cgi/search.pl' +
            '?action=process' +
            '&json=1' +
            '&search_terms=' + encodeURIComponent(term) +
            '&fields=code,product_name,brands,image_front_url,ingredients_text' +
            '&page_size=50';

          const response = await fetch(url);

          if (!response.ok) {
            continue;
          }

          const data = await response.json();

          const validProducts = (data.products || []).filter(
            (product: Product) =>
              product.product_name &&
              product.image_front_url
          );

          allProducts = [...allProducts, ...validProducts];

          if (allProducts.length >= 30) {
            break;
          }
        } catch (searchError) {
          console.log('Search failed for:', term);
        }
      }

      // Remove duplicate products
      const uniqueProducts = Array.from(
        new Map(
          allProducts.map((product) => [
            product.code || product.product_name,
            product,
          ])
        ).values()
      );

      // Display up to 12 products
      setProducts(uniqueProducts.slice(0, 12));

      if (uniqueProducts.length === 0) {
        setError(
          'No products with images were found. Please try again later.'
        );
      }
    } catch (err) {
      console.log('Recommendation error:', err);
      setError('Unable to load recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecommendations();
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        <Text style={styles.brand}>Luma</Text>

        <Text style={styles.heading}>Your Recommendations</Text>

        <Text style={styles.subtitle}>
          Products selected based on your skin analysis.
        </Text>
      </View>

      {/* Skin Profile */}
      {skinType !== '' && (
        <View style={styles.analysisBox}>
          <Text style={styles.analysisTitle}>
            Your Skin Profile
          </Text>

          <View style={styles.profileRow}>
            <Text style={styles.profileLabel}>Skin Type</Text>
            <Text style={styles.info}>{skinType}</Text>
          </View>

          <View style={styles.profileRow}>
            <Text style={styles.profileLabel}>Concerns</Text>
            <Text style={styles.info}>{concerns.join(', ')}</Text>
          </View>
        </View>
      )}

      {/* Loading */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#A99AE8"
          style={styles.loader}
        />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.error}>{error}</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={loadRecommendations}
          >
            <Text style={styles.buttonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <Text style={styles.sectionTitle}>
            Recommended Products
          </Text>

          <Text style={styles.resultCount}>
            {products.length} products found
          </Text>

          {/* Product Cards */}
          {products.map((product, index) => (
            <View
              style={styles.productCard}
              key={product.code || index.toString()}
            >
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: product.image_front_url }}
                  style={styles.productImage}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.productDetails}>
                <Text style={styles.productName}>
                  {product.product_name}
                </Text>

                <Text style={styles.brandName}>
                  Brand: {product.brands || 'Not available'}
                </Text>

                <View style={styles.separator} />

                <Text style={styles.ingredientTitle}>
                  Ingredients
                </Text>

                <Text style={styles.ingredients}>
                  {product.ingredients_text ||
                    'Ingredient information not available.'}
                </Text>
              </View>
            </View>
          ))}
        </>
      )}

      <Text style={styles.disclaimer}>
        Product information is collected from Open Beauty Facts.
        Always check the product label before use. These suggestions
        are not medical advice.
      </Text>
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

  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#F4F1FA',
  },

  subtitle: {
    fontSize: 14,
    color: '#A6A1B5',
    marginTop: 8,
    lineHeight: 21,
  },

  analysisBox: {
    backgroundColor: '#242331',
    padding: 18,
    borderRadius: 14,
    margin: 20,
    borderWidth: 1,
    borderColor: '#454253',
  },

  analysisTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#C0B4F0',
    marginBottom: 14,
  },

  profileRow: {
    marginBottom: 10,
  },

  profileLabel: {
    fontSize: 12,
    color: '#A99AE8',
    fontWeight: 'bold',
    marginBottom: 4,
  },

  info: {
    fontSize: 14,
    color: '#E5E0F0',
    lineHeight: 21,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: 'bold',
    color: '#F4F1FA',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 5,
  },

  resultCount: {
    fontSize: 13,
    color: '#A6A1B5',
    marginHorizontal: 20,
    marginBottom: 15,
  },

  loader: {
    marginTop: 45,
  },

  errorContainer: {
    paddingHorizontal: 20,
  },

  error: {
    color: '#E9A3B0',
    fontSize: 15,
    marginTop: 25,
    textAlign: 'center',
    lineHeight: 22,
  },

  button: {
    backgroundColor: '#A99AE8',
    padding: 14,
    borderRadius: 12,
    marginTop: 18,
  },

  buttonText: {
    color: '#17151F',
    textAlign: 'center',
    fontWeight: 'bold',
  },

  productCard: {
    backgroundColor: '#1C1C25',
    borderRadius: 16,
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#343342',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },

  imageContainer: {
    width: '100%',
    height: 210,
    backgroundColor: '#242431',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },

  productImage: {
    width: '100%',
    height: '100%',
  },

  productDetails: {
    marginTop: 15,
  },

  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E5E0F0',
    lineHeight: 24,
  },

  brandName: {
    fontSize: 14,
    color: '#A6A1B5',
    marginTop: 7,
  },

  separator: {
    height: 1,
    backgroundColor: '#343342',
    marginTop: 14,
    marginBottom: 12,
  },

  ingredientTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#C0B4F0',
  },

  ingredients: {
    fontSize: 13,
    color: '#A6A1B5',
    marginTop: 6,
    lineHeight: 20,
  },

  disclaimer: {
    fontSize: 12,
    color: '#827F91',
    textAlign: 'center',
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 25,
    lineHeight: 18,
  },
});
