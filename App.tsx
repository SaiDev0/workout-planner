import React, { useState, useEffect } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as Notifications from 'expo-notifications';
import { HomeScreen } from './src/screens/HomeScreen';
import { WorkoutScreen } from './src/screens/WorkoutScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { EditWorkoutScreen } from './src/screens/EditWorkoutScreen';
import { ManageDaysScreen } from './src/screens/ManageDaysScreen';

type Screen = 'home' | 'workout' | 'settings' | 'edit-workouts' | 'manage-days';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('home');
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  useEffect(() => {
    requestNotificationPermissions();
  }, []);

  const requestNotificationPermissions = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.log('Notification permissions not granted');
    }
  };

  const handleSelectDay = (dayId: string) => {
    setSelectedDay(dayId);
    setCurrentScreen('workout');
  };

  const handleBack = () => {
    setCurrentScreen('home');
    setSelectedDay(null);
  };

  const handleOpenSettings = () => {
    setCurrentScreen('settings');
  };

  const handleEditWorkouts = () => {
    setCurrentScreen('edit-workouts');
  };

  const handleManageDays = () => {
    setCurrentScreen('manage-days');
  };

  const handleBackToSettings = () => {
    setCurrentScreen('settings');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'workout':
        return selectedDay ? (
          <WorkoutScreen dayId={selectedDay} onBack={handleBack} />
        ) : null;
      case 'settings':
        return <SettingsScreen onBack={handleBack} onEditWorkouts={handleEditWorkouts} onManageDays={handleManageDays} />;
      case 'edit-workouts':
        return <EditWorkoutScreen onBack={handleBackToSettings} />;
      case 'manage-days':
        return <ManageDaysScreen onBack={handleBackToSettings} />;
      default:
        return <HomeScreen onSelectDay={handleSelectDay} onOpenSettings={handleOpenSettings} />;
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <SafeAreaView style={styles.container} edges={[]}>
        {renderScreen()}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
});
