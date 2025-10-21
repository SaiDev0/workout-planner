import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Alert,
    Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Timer } from '../components/Timer';
import { useWorkouts } from '../hooks/useWorkouts';
import { RestTimer } from '../components/RestTimer';
import { FloatingMusicButton } from '../components/FloatingMusicButton';
import { ExerciseDemo } from '../components/ExerciseDemo';
import { ConfettiEffect } from '../components/ConfettiEffect';
import { getTodayProgress, saveWorkoutHistory } from '../utils/storage';
import { Exercise } from '../types/workout';

interface WorkoutScreenProps {
    dayId: string;
    onBack: () => void;
}

export const WorkoutScreen: React.FC<WorkoutScreenProps> = ({
    dayId,
    onBack,
}) => {
    const { workouts } = useWorkouts();
    const insets = useSafeAreaInsets();
    const workout = workouts.find((w) => w.id === dayId);
    const [completedExercises, setCompletedExercises] = useState<Set<string>>(
        new Set()
    );
    const [timerVisible, setTimerVisible] = useState(false);
    const [restTimerVisible, setRestTimerVisible] = useState(false);
    const [currentExercise, setCurrentExercise] = useState<Exercise | null>(null);
    const [demoVisible, setDemoVisible] = useState(false);
    const [demoExerciseName, setDemoExerciseName] = useState('');
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        loadProgress();
    }, [dayId]);

    useEffect(() => {
        const totalExercises = workout?.sections.reduce(
            (sum, section) => sum + section.exercises.length,
            0
        ) || 0;
        if (totalExercises > 0 && completedExercises.size === totalExercises) {
            setShowConfetti(true);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    }, [completedExercises, workout]);

    const loadProgress = async () => {
        const progress = await getTodayProgress(dayId);
        setCompletedExercises(new Set(progress));
    };

    const toggleExercise = async (exerciseId: string) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        const newCompleted = new Set(completedExercises);
        if (newCompleted.has(exerciseId)) {
            newCompleted.delete(exerciseId);
        } else {
            newCompleted.add(exerciseId);
        }

        setCompletedExercises(newCompleted);
        await saveWorkoutHistory(dayId, Array.from(newCompleted));
    };

    const startTimer = (exercise: Exercise) => {
        if (!exercise.time) return;

        // Parse time string (e.g., "10 min", "8 min", "18 min")
        const timeMatch = exercise.time.match(/(\d+)/);
        if (timeMatch) {
            const minutes = parseInt(timeMatch[1], 10);
            setCurrentExercise(exercise);
            setTimerVisible(true);
        }
    };

    const handleTimerComplete = async () => {
        if (currentExercise) {
            await toggleExercise(currentExercise.id);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
        setTimerVisible(false);
        setCurrentExercise(null);
    };

    const resetProgress = () => {
        Alert.alert(
            'Reset Progress',
            'Are you sure you want to reset all progress for today?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: async () => {
                        setCompletedExercises(new Set());
                        await saveWorkoutHistory(dayId, []);
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                    },
                },
            ]
        );
    };

    if (!workout) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Workout not found</Text>
            </View>
        );
    }

    const totalExercises = workout.sections.reduce(
        (sum, section) => sum + section.exercises.length,
        0
    );
    const completedCount = completedExercises.size;
    const progress = totalExercises > 0 ? (completedCount / totalExercises) * 100 : 0;

    const parseTimeToSeconds = (timeStr: string): number => {
        const match = timeStr.match(/(\d+)/);
        return match ? parseInt(match[1], 10) * 60 : 0;
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={workout.gradient as any} style={styles.gradient}>
                {/* Header */}
                <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={28} color="#fff" />
                    </TouchableOpacity>

                    <View style={styles.headerContent}>
                        <Text style={styles.dayName}>{workout.day}</Text>
                        <Text style={styles.workoutTitle}>{workout.title}</Text>
                    </View>

                    <View style={styles.headerButtons}>
                        <TouchableOpacity
                            onPress={() => setRestTimerVisible(true)}
                            style={styles.restButton}
                        >
                            <Ionicons name="timer-outline" size={24} color="#fff" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={resetProgress} style={styles.resetButton}>
                            <Ionicons name="refresh" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressSection}>
                    <View style={styles.progressInfo}>
                        <Text style={styles.progressText}>
                            {completedCount} / {totalExercises} completed
                        </Text>
                        <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
                    </View>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${progress}%` }]} />
                    </View>
                </View>

                {/* Exercises */}
                <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                    {workout.sections.map((section, sectionIndex) => (
                        <View key={sectionIndex} style={styles.section}>
                            <Text style={styles.sectionTitle}>{section.name}</Text>

                            {section.exercises.map((exercise) => {
                                const isCompleted = completedExercises.has(exercise.id);
                                const hasTimer = exercise.time !== undefined;

                                return (
                                    <View key={exercise.id} style={styles.exerciseCard}>
                                        <TouchableOpacity
                                            onPress={() => toggleExercise(exercise.id)}
                                            style={styles.exerciseContent}
                                        >
                                            <View style={styles.exerciseLeft}>
                                                <View
                                                    style={[
                                                        styles.checkbox,
                                                        isCompleted && styles.checkboxCompleted,
                                                    ]}
                                                >
                                                    {isCompleted && (
                                                        <Ionicons name="checkmark" size={20} color="#fff" />
                                                    )}
                                                </View>

                                                <View style={styles.exerciseInfo}>
                                                    <Text
                                                        style={[
                                                            styles.exerciseName,
                                                            isCompleted && styles.exerciseNameCompleted,
                                                        ]}
                                                    >
                                                        {exercise.name}
                                                    </Text>

                                                    <View style={styles.exerciseMeta}>
                                                        {exercise.sets && (
                                                            <View style={styles.metaItem}>
                                                                <Ionicons name="repeat" size={14} color="#fff" />
                                                                <Text style={styles.metaText}>{exercise.sets}</Text>
                                                            </View>
                                                        )}

                                                        {exercise.time && (
                                                            <View style={styles.metaItem}>
                                                                <Ionicons name="time" size={14} color="#fff" />
                                                                <Text style={styles.metaText}>{exercise.time}</Text>
                                                            </View>
                                                        )}

                                                        {exercise.weight && (
                                                            <View style={styles.metaItem}>
                                                                <Ionicons name="barbell" size={14} color="#fff" />
                                                                <Text style={styles.metaText}>{exercise.weight}</Text>
                                                            </View>
                                                        )}
                                                    </View>

                                                    <Text style={styles.exerciseDetails}>{exercise.details}</Text>
                                                </View>
                                            </View>

                                            <View style={styles.exerciseActions}>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        setDemoExerciseName(exercise.name);
                                                        setDemoVisible(true);
                                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                                    }}
                                                    style={styles.infoButton}
                                                >
                                                    <Ionicons name="information-circle" size={24} color="#fff" />
                                                </TouchableOpacity>

                                                {hasTimer && (
                                                    <TouchableOpacity
                                                        onPress={() => startTimer(exercise)}
                                                        style={styles.timerButton}
                                                    >
                                                        <Ionicons name="timer" size={24} color="#fff" />
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                );
                            })}
                        </View>
                    ))}

                    {progress === 100 && (
                        <View style={styles.congratsCard}>
                            <Text style={styles.congratsEmoji}>🎉</Text>
                            <Text style={styles.congratsTitle}>Workout Complete!</Text>
                            <Text style={styles.congratsText}>
                                Amazing job! You've completed all exercises for today.
                            </Text>
                        </View>
                    )}

                    {/* Bottom spacing for home indicator */}
                    <View style={{ height: Math.max(insets.bottom, 20) + 20 }} />
                </ScrollView>
            </LinearGradient>

            {/* Timer Modal */}
            {currentExercise && (
                <Timer
                    visible={timerVisible}
                    duration={parseTimeToSeconds(currentExercise.time || '0')}
                    exerciseName={currentExercise.name}
                    onClose={() => {
                        setTimerVisible(false);
                        setCurrentExercise(null);
                    }}
                    onComplete={handleTimerComplete}
                />
            )}

            {/* Rest Timer */}
            <RestTimer
                visible={restTimerVisible}
                onClose={() => setRestTimerVisible(false)}
            />

            {/* Exercise Demo */}
            <ExerciseDemo
                visible={demoVisible}
                exerciseName={demoExerciseName}
                onClose={() => setDemoVisible(false)}
            />

            {/* Floating Music Button */}
            <FloatingMusicButton />

            {/* Confetti Effect */}
            <ConfettiEffect
                show={showConfetti}
                onComplete={() => setShowConfetti(false)}
            />
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
        paddingHorizontal: 20,
        paddingBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        padding: 8,
        marginRight: 12,
    },
    headerContent: {
        flex: 1,
    },
    dayName: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
        fontWeight: '600',
    },
    workoutTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 4,
    },
    headerButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    restButton: {
        padding: 8,
    },
    resetButton: {
        padding: 8,
    },
    progressSection: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    progressInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    progressText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    progressPercentage: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
    },
    progressBar: {
        height: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#fff',
        borderRadius: 4,
    },
    scrollView: {
        flex: 1,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 28,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 16,
    },
    exerciseCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
    },
    exerciseContent: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    exerciseLeft: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        flex: 1,
    },
    checkbox: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 2,
        borderColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        marginTop: 2,
    },
    checkboxCompleted: {
        backgroundColor: '#fff',
    },
    exerciseInfo: {
        flex: 1,
    },
    exerciseName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 6,
    },
    exerciseNameCompleted: {
        textDecorationLine: 'line-through',
        opacity: 0.7,
    },
    exerciseMeta: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 6,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '600',
    },
    exerciseDetails: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        lineHeight: 20,
    },
    exerciseActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    infoButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    timerButton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    congratsCard: {
        marginHorizontal: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 24,
        borderRadius: 20,
        alignItems: 'center',
    },
    congratsEmoji: {
        fontSize: 48,
        marginBottom: 12,
    },
    congratsTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    congratsText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        lineHeight: 22,
    },
    errorText: {
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
    },
});

