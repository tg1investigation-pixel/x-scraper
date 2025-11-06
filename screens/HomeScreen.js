import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { authService } from '../services/api';
import { COLORS } from '../config/constants';

export default function HomeScreen({ navigation }) {
  const handleLogout = async () => {
    try {
      await authService.logout();
      // Navigation will be handled by App.js based on auth state
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'Failed to logout. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        style={styles.gradient}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Text style={styles.welcomeText}>Welcome</Text>
            <Text style={styles.departmentText}>
              Investigation Unit Search System
            </Text>
          </View>

          <View style={styles.cardsContainer}>
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('PeopleSearch')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[COLORS.accent, COLORS.light]}
                style={styles.cardGradient}
              >
                <Text style={styles.cardIcon}>👤</Text>
                <Text style={styles.cardTitle}>People Search</Text>
                <Text style={styles.cardDescription}>
                  Search by name or phone number across all database records
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.card}
              onPress={() => navigation.navigate('VehicleSearch')}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={[COLORS.light, COLORS.accent]}
                style={styles.cardGradient}
              >
                <Text style={styles.cardIcon}>🚗</Text>
                <Text style={styles.cardTitle}>Vehicle Search</Text>
                <Text style={styles.cardDescription}>
                  Search vehicles by plate number or other identifiers
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
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
  content: {
    padding: 24,
    paddingTop: 16,
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  departmentText: {
    fontSize: 16,
    color: COLORS.lightGray,
    textAlign: 'center',
  },
  cardsContainer: {
    marginBottom: 24,
  },
  card: {
    marginBottom: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardGradient: {
    padding: 24,
    alignItems: 'center',
  },
  cardIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: COLORS.lightGray,
    textAlign: 'center',
    lineHeight: 20,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  logoutButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
