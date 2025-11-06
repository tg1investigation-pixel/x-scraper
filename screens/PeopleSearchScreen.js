import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Circle } from 'react-native-progress';
import { searchService } from '../services/api';
import { COLORS, SEARCH_TYPES } from '../config/constants';

export default function PeopleSearchScreen({ navigation }) {
  const [searchType, setSearchType] = useState(SEARCH_TYPES.NAME); // 'name' or 'phone'
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      Alert.alert('Error', `Please enter a ${searchType === SEARCH_TYPES.PHONE ? 'phone number' : 'name'} to search`);
      return;
    }

    setIsSearching(true);
    try {
      const result = await searchService.searchPeople(query, searchType);
      
      if (result.success) {
        navigation.navigate('SearchResults', {
          results: result.data || [],
          total: result.total || 0,
          searchType: 'people',
          query: query.trim(),
        });
      } else {
        Alert.alert('Search Error', result.error || 'Failed to perform search');
      }
    } catch (error) {
      console.error('Search error:', error);
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
          <View style={styles.searchTypeContainer}>
            <TouchableOpacity
              style={[
                styles.typeButton,
                searchType === SEARCH_TYPES.NAME && styles.typeButtonActive,
              ]}
              onPress={() => setSearchType(SEARCH_TYPES.NAME)}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  searchType === SEARCH_TYPES.NAME && styles.typeButtonTextActive,
                ]}
              >
                Name
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.typeButton,
                searchType === SEARCH_TYPES.PHONE && styles.typeButtonActive,
              ]}
              onPress={() => setSearchType(SEARCH_TYPES.PHONE)}
            >
              <Text
                style={[
                  styles.typeButtonText,
                  searchType === SEARCH_TYPES.PHONE && styles.typeButtonTextActive,
                ]}
              >
                Phone Number
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>
              {searchType === SEARCH_TYPES.PHONE
                ? 'Phone Number'
                : 'Name'}
            </Text>
            <Text style={styles.hint}>
              {searchType === SEARCH_TYPES.PHONE
                ? 'Searches in DIAL, DIAL2, DIAL3, DIAL4 columns across all tables'
                : 'Searches in NAME columns across all tables (partial, case-insensitive)'}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={
                searchType === SEARCH_TYPES.PHONE
                  ? 'Enter phone number (e.g., 01234567890)'
                  : 'Enter name'
              }
              placeholderTextColor={COLORS.gray}
              value={query}
              onChangeText={setQuery}
              keyboardType={searchType === SEARCH_TYPES.PHONE ? 'phone-pad' : 'default'}
              autoCapitalize={searchType === SEARCH_TYPES.NAME ? 'words' : 'none'}
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
              <Text style={styles.progressText}>Searching...</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.searchButton, isSearching && styles.searchButtonDisabled]}
            onPress={handleSearch}
            disabled={isSearching}
            activeOpacity={0.8}
          >
            <Text style={styles.searchButtonText}>
              {isSearching ? 'Searching...' : 'Search'}
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
  searchTypeContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 4,
  },
  typeButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  typeButtonActive: {
    backgroundColor: COLORS.accent,
  },
  typeButtonText: {
    color: COLORS.lightGray,
    fontSize: 16,
    fontWeight: '600',
  },
  typeButtonTextActive: {
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
