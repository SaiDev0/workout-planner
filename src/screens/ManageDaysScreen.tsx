import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Switch,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { loadWorkoutSchedule, saveWorkoutSchedule } from '../utils/storage';
import { WorkoutSchedule } from '../types/workout';

interface ManageDaysScreenProps {
    onBack: () => void;
}

const DAYS_OF_WEEK = [
    { value: 0, label: 'Sunday', short: 'Sun' },
    { value: 1, label: 'Monday', short: 'Mon' },
    { value: 2, label: 'Tuesday', short: 'Tue' },
    { value: 3, label: 'Wednesday', short: 'Wed' },
    { value: 4, label: 'Thursday', short: 'Thu' },
    { value: 5, label: 'Friday', short: 'Fri' },
    { value: 6, label: 'Saturday', short: 'Sat' },
];

export const ManageDaysScreen: React.FC<ManageDaysScreenProps> = ({ onBack }) => {
    const insets = useSafeAreaInsets();
    const [schedule, setSchedule] = useState<WorkoutSchedule>({
        monday: { workoutIndex: 0, enabled: true },
        tuesday: { workoutIndex: 1, enabled: true },
        wednesday: { workoutIndex: 2, enabled: true },
        thursday: { workoutIndex: 3, enabled: true },
        friday: { workoutIndex: -1, enabled: false },
        saturday: { workoutIndex: -1, enabled: false },
        sunday: { workoutIndex: -1, enabled: false },
    });

    useEffect(() => {
        loadSchedule();
    }, []);

    const loadSchedule = async () => {
        const savedSchedule = await loadWorkoutSchedule();
        if (savedSchedule) {
            setSchedule(savedSchedule);
        }
    };

    const saveSchedule = async (newSchedule: WorkoutSchedule) => {
        await saveWorkoutSchedule(newSchedule);
        setSchedule(newSchedule);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    };

    const toggleDay = (day: keyof WorkoutSchedule) => {
        const newSchedule = {
            ...schedule,
            [day]: {
                ...schedule[day],
                enabled: !schedule[day].enabled,
            },
        };
        saveSchedule(newSchedule);
    };

    const assignWorkout = (day: keyof WorkoutSchedule, workoutIndex: number) => {
        const newSchedule = {
            ...schedule,
            [day]: {
                workoutIndex,
                enabled: true,
            },
        };
        saveSchedule(newSchedule);
    };

    const resetToDefaults = () => {
        Alert.alert(
            'Reset Schedule',
            'Reset to default 4-day program (Monday-Thursday)?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: async () => {
                        const defaultSchedule: WorkoutSchedule = {
                            monday: { workoutIndex: 0, enabled: true },
                            tuesday: { workoutIndex: 1, enabled: true },
                            wednesday: { workoutIndex: 2, enabled: true },
                            thursday: { workoutIndex: 3, enabled: true },
                            friday: { workoutIndex: -1, enabled: false },
                            saturday: { workoutIndex: -1, enabled: false },
                            sunday: { workoutIndex: -1, enabled: false },
                        };
                        await saveSchedule(defaultSchedule);
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    },
                },
            ]
        );
    };

    const getWorkoutName = (index: number) => {
        const names = [
            'Upper Body Strength',
            'Lower Body Strength',
            'Push + Core',
            'Pull + HIIT',
        ];
        return index >= 0 && index < names.length ? names[index] : 'Rest Day';
    };

    const getWorkoutColor = (index: number) => {
        const colors = [
            ['#667eea', '#764ba2'], // Purple
            ['#f093fb', '#f5576c'], // Pink
            ['#4facfe', '#00f2fe'], // Blue
            ['#fa709a', '#fee140'], // Orange
        ];
        return index >= 0 && index < colors.length ? colors[index] : ['#64748b', '#475569'];
    };

    const dayKeys: (keyof WorkoutSchedule)[] = [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
    ];

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#0f172a', '#1e293b']} style={styles.gradient}>
                {/* Header */}
                <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={28} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Workout Schedule 📅</Text>
                    <TouchableOpacity onPress={resetToDefaults} style={styles.resetButton}>
                        <Ionicons name="refresh-circle-outline" size={28} color="#fff" />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.scrollView}>
                    <View style={styles.infoCard}>
                        <Ionicons name="information-circle" size={24} color="#667eea" />
                        <Text style={styles.infoText}>
                            Choose which days you want to work out and assign workouts to each day. Toggle
                            days on/off and select which workout to do.
                        </Text>
                    </View>

                    {/* Days List */}
                    {dayKeys.map((dayKey) => {
                        const dayInfo = schedule[dayKey];
                        const dayLabel = dayKey.charAt(0).toUpperCase() + dayKey.slice(1);
                        const colors = getWorkoutColor(dayInfo.workoutIndex);

                        return (
                            <View key={dayKey} style={styles.dayCard}>
                                <LinearGradient
                                    colors={
                                        (dayInfo.enabled
                                            ? colors.map((c) => c + '40')
                                            : ['rgba(100, 116, 139, 0.2)', 'rgba(71, 85, 105, 0.2)']) as any
                                    }
                                    style={styles.dayCardGradient}
                                >
                                    {/* Day Header */}
                                    <View style={styles.dayHeader}>
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.dayLabel}>{dayLabel}</Text>
                                            <Text
                                                style={[
                                                    styles.workoutLabel,
                                                    !dayInfo.enabled && styles.workoutLabelDisabled,
                                                ]}
                                            >
                                                {dayInfo.enabled
                                                    ? getWorkoutName(dayInfo.workoutIndex)
                                                    : 'Rest Day'}
                                            </Text>
                                        </View>
                                        <Switch
                                            value={dayInfo.enabled}
                                            onValueChange={() => {
                                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                                toggleDay(dayKey);
                                            }}
                                            trackColor={{ false: '#475569', true: '#667eea' }}
                                            thumbColor={dayInfo.enabled ? '#fff' : '#cbd5e1'}
                                        />
                                    </View>

                                    {/* Workout Selection */}
                                    {dayInfo.enabled && (
                                        <View style={styles.workoutButtons}>
                                            {[0, 1, 2, 3].map((workoutIndex) => {
                                                const isSelected = dayInfo.workoutIndex === workoutIndex;
                                                return (
                                                    <TouchableOpacity
                                                        key={workoutIndex}
                                                        onPress={() => {
                                                            Haptics.impactAsync(
                                                                Haptics.ImpactFeedbackStyle.Light
                                                            );
                                                            assignWorkout(dayKey, workoutIndex);
                                                        }}
                                                        style={[
                                                            styles.workoutButton,
                                                            isSelected && styles.workoutButtonSelected,
                                                        ]}
                                                    >
                                                        <LinearGradient
                                                            colors={
                                                                (isSelected
                                                                    ? getWorkoutColor(workoutIndex)
                                                                    : [
                                                                        'rgba(255,255,255,0.1)',
                                                                        'rgba(255,255,255,0.1)',
                                                                    ]) as any
                                                            }
                                                            style={styles.workoutButtonGradient}
                                                        >
                                                            <Text
                                                                style={[
                                                                    styles.workoutButtonText,
                                                                    isSelected &&
                                                                    styles.workoutButtonTextSelected,
                                                                ]}
                                                            >
                                                                {['Upper', 'Lower', 'Push', 'Pull'][workoutIndex]}
                                                            </Text>
                                                        </LinearGradient>
                                                    </TouchableOpacity>
                                                );
                                            })}
                                        </View>
                                    )}
                                </LinearGradient>
                            </View>
                        );
                    })}

                    {/* Summary Card */}
                    <View style={styles.summaryCard}>
                        <Text style={styles.summaryTitle}>📊 Your Schedule</Text>
                        <Text style={styles.summaryText}>
                            Active Days:{' '}
                            {Object.values(schedule).filter((day) => day.enabled).length} per week
                        </Text>
                        <Text style={styles.summaryText}>
                            Rest Days:{' '}
                            {Object.values(schedule).filter((day) => !day.enabled).length} per week
                        </Text>
                    </View>

                    {/* Bottom spacing for home indicator */}
                    <View style={{ height: Math.max(insets.bottom, 20) + 20 }} />
                </ScrollView>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    gradient: {
        flex: 1,
    },
    header: {
        paddingTop: 0,
        paddingHorizontal: 20,
        paddingBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        padding: 8,
    },
    resetButton: {
        padding: 8,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 20,
    },
    infoCard: {
        flexDirection: 'row',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        padding: 16,
        borderRadius: 16,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: 'rgba(102, 126, 234, 0.3)',
    },
    infoText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
        marginLeft: 12,
        flex: 1,
        lineHeight: 20,
    },
    dayCard: {
        marginBottom: 16,
        borderRadius: 16,
        overflow: 'hidden',
    },
    dayCardGradient: {
        padding: 20,
    },
    dayHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    dayLabel: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    workoutLabel: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
    },
    workoutLabelDisabled: {
        color: 'rgba(255, 255, 255, 0.4)',
    },
    workoutButtons: {
        flexDirection: 'row',
        gap: 8,
        flexWrap: 'wrap',
    },
    workoutButton: {
        flex: 1,
        minWidth: '22%',
        borderRadius: 12,
        overflow: 'hidden',
    },
    workoutButtonSelected: {
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.5)',
    },
    workoutButtonGradient: {
        padding: 12,
        alignItems: 'center',
    },
    workoutButtonText: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 13,
        fontWeight: '600',
    },
    workoutButtonTextSelected: {
        color: '#fff',
        fontWeight: 'bold',
    },
    summaryCard: {
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        padding: 20,
        borderRadius: 16,
        marginTop: 8,
        marginBottom: 30,
        borderWidth: 1,
        borderColor: 'rgba(102, 126, 234, 0.3)',
    },
    summaryTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    summaryText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 16,
        marginBottom: 4,
    },
});

