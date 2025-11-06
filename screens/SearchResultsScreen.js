import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../config/constants';

export default function SearchResultsScreen({ route, navigation }) {
  // Validate route params with defaults
  const { results = [], total = 0, searchType = 'unknown', query = '' } = route.params || {};

  const renderResultItem = ({ item, index }) => {
    if (!item || typeof item !== 'object') {
      return null;
    }

    return (
      <TouchableOpacity
        style={styles.resultCard}
        onPress={() => {
          if (item) {
            navigation.navigate('Detail', { record: item, searchType });
          }
        }}
        activeOpacity={0.7}
      >
        <View style={styles.resultHeader}>
          <Text style={styles.resultNumber}>#{index + 1}</Text>
          <Text style={styles.resultTable}>
            Table: {item.table_name || 'Unknown'}
          </Text>
        </View>

        <View style={styles.resultContent}>
          {Object.entries(item).map(([key, value]) => {
            // Skip internal fields
            if (key === 'table_name' || key === 'id' || key === '_id') {
              return null;
            }
            return (
              <View key={key} style={styles.resultRow}>
                <Text style={styles.resultKey}>{key}:</Text>
                <Text style={styles.resultValue}>
                  {value !== null && value !== undefined ? String(value) : 'N/A'}
                </Text>
              </View>
            );
          })}
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🔍</Text>
      <Text style={styles.emptyTitle}>No Results Found</Text>
      <Text style={styles.emptyText}>
        No records found matching "{query}". Try a different search term.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {total} {total === 1 ? 'Result' : 'Results'} Found
          </Text>
          <Text style={styles.headerSubtitle}>
            Search: "{query}" ({searchType})
          </Text>
        </View>

        <FlatList
          data={Array.isArray(results) ? results : []}
          renderItem={renderResultItem}
          keyExtractor={(item, index) => {
            if (item && typeof item === 'object') {
              return `${item.id || item._id || index}-${item.table_name || ''}`;
            }
            return `item-${index}`;
          }}
          contentContainerStyle={[
            styles.listContent,
            (!Array.isArray(results) || results.length === 0) && styles.listContentEmpty,
          ]}
          ListEmptyComponent={renderEmptyState}
          showsVerticalScrollIndicator={false}
        />
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.lightGray,
  },
  listContent: {
    padding: 16,
  },
  listContentEmpty: {
    flex: 1,
  },
  resultCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  resultNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.accent,
  },
  resultTable: {
    fontSize: 12,
    color: COLORS.lightGray,
    fontStyle: 'italic',
  },
  resultContent: {
    gap: 8,
  },
  resultRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  resultKey: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.lightGray,
    marginRight: 8,
    minWidth: 100,
  },
  resultValue: {
    fontSize: 14,
    color: COLORS.white,
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.lightGray,
    textAlign: 'center',
    lineHeight: 20,
  },
});
