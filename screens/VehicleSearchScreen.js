import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Circle } from 'react-native-progress';
import { searchService } from '../services/api';
import { COLORS } from '../config/constants';

export default function VehicleSearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      Alert.alert('Error', 'Please enter a vehicle identifier to search');
      return;
    }

    setIsSearching(true);
    try {
      const result = await searchService.searchVehicles(query);
      
      if (result.success) {
        navigation.navigate('SearchResults', {
          results: result.data || [],
          total: result.total || 0,
          searchType: 'vehicle',
          query: query.trim(),
        });
      } else {
        Alert.alert('Search Error', result.error || 'Failed to perform vehicle search');
      }
    } catch (error) {
      console.error('Vehicle search error:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Text style={styles.icon}>🚗</Text>
            <Text style={styles.title}>Vehicle Search</Text>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Vehicle Identifier</Text>
            <Text style={styles.hint}>
              Enter plate number, VIN, or other vehicle identifier. Search is partial and case-insensitive.
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter plate number or identifier"
              placeholderTextColor={COLORS.gray}
              value={query}
              onChangeText={setQuery}
              autoCapitalize="characters"
              editable={!isSearching}
            />
          </View>

          {isSearching && (
            <View style={styles.progressContainer}>
              <Circle
                size={50}
                indeterminate={true}
                color={COLORS.white}
                borderWidth={3}
              />
              <Text style={styles.progressText}>Searching vehicles...</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.searchButton, isSearching && styles.searchButtonDisabled]}
            onPress={handleSearch}
            disabled={isSearching}
            activeOpacity={0.8}
          >
            <Text style={styles.searchButtonText}>
              {isSearching ? 'Searching...' : 'Search Vehicles'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  icon: {
    fontSize: 64,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
    marginBottom: 8,
  },
  hint: {
    fontSize: 12,
    color: COLORS.lightGray,
    marginBottom: 12,
    lineHeight: 16,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.white,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  progressText: {
    color: COLORS.white,
    marginTop: 12,
    fontSize: 14,
  },
  searchButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  searchButtonDisabled: {
    opacity: 0.6,
  },
  searchButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
