import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    Alert,
    Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { workoutProgram as defaultWorkouts } from '../data/workouts';
import { loadCustomWorkouts, saveCustomWorkouts } from '../utils/storage';
import { WorkoutDay, Exercise } from '../types/workout';

interface EditWorkoutScreenProps {
    onBack: () => void;
}

export const EditWorkoutScreen: React.FC<EditWorkoutScreenProps> = ({ onBack }) => {
    const insets = useSafeAreaInsets();
    const [workouts, setWorkouts] = useState<WorkoutDay[]>([]);
    const [selectedDay, setSelectedDay] = useState<WorkoutDay | null>(null);
    const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
    const [showExerciseModal, setShowExerciseModal] = useState(false);

    useEffect(() => {
        loadWorkouts();
    }, []);

    const loadWorkouts = async () => {
        const customWorkouts = await loadCustomWorkouts();
        setWorkouts(customWorkouts.length > 0 ? customWorkouts : defaultWorkouts);
    };

    const saveWorkouts = async (updatedWorkouts: WorkoutDay[]) => {
        await saveCustomWorkouts(updatedWorkouts);
        setWorkouts(updatedWorkouts);
    };

    const resetToDefaults = () => {
        Alert.alert(
            'Reset to Default',
            'Are you sure you want to reset all workouts to default? This will remove all your customizations.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: async () => {
                        await saveCustomWorkouts([]);
                        await loadWorkouts();
                        setSelectedDay(null);
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                    },
                },
            ]
        );
    };

    const selectDay = (day: WorkoutDay) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedDay(day);
    };

    const addNewExercise = () => {
        if (!selectedDay) return;

        const newExercise: Exercise = {
            id: `custom-${Date.now()}`,
            name: 'New Exercise',
            sets: 3,
            reps: '10-12',
            instructions: 'Add instructions here',
            completed: false,
        };

        setEditingExercise(newExercise);
        setShowExerciseModal(true);
    };

    const editExercise = (exercise: Exercise) => {
        setEditingExercise({ ...exercise });
        setShowExerciseModal(true);
    };

    const saveExercise = () => {
        if (!editingExercise || !selectedDay) return;

        const updatedWorkouts = workouts.map((workout) => {
            if (workout.id === selectedDay.id) {
                const updatedSections = workout.sections.map((section) => {
                    const exerciseIndex = section.exercises.findIndex(
                        (ex) => ex.id === editingExercise.id
                    );

                    if (exerciseIndex !== -1) {
                        // Update existing exercise
                        const updatedExercises = [...section.exercises];
                        updatedExercises[exerciseIndex] = editingExercise;
                        return { ...section, exercises: updatedExercises };
                    }
                    return section;
                });

                // If exercise not found, add to first section
                if (!updatedSections.some((s) => s.exercises.some((e) => e.id === editingExercise.id))) {
                    if (updatedSections.length > 0) {
                        updatedSections[0].exercises.push(editingExercise);
                    }
                }

                return { ...workout, sections: updatedSections };
            }
            return workout;
        });

        saveWorkouts(updatedWorkouts);
        setSelectedDay(updatedWorkouts.find((w) => w.id === selectedDay.id) || null);
        setShowExerciseModal(false);
        setEditingExercise(null);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    };

    const deleteExercise = (exerciseId: string) => {
        Alert.alert(
            'Delete Exercise',
            'Are you sure you want to delete this exercise?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        if (!selectedDay) return;

                        const updatedWorkouts = workouts.map((workout) => {
                            if (workout.id === selectedDay.id) {
                                const updatedSections = workout.sections.map((section) => ({
                                    ...section,
                                    exercises: section.exercises.filter((ex) => ex.id !== exerciseId),
                                }));
                                return { ...workout, sections: updatedSections };
                            }
                            return workout;
                        });

                        saveWorkouts(updatedWorkouts);
                        setSelectedDay(updatedWorkouts.find((w) => w.id === selectedDay.id) || null);
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
                    },
                },
            ]
        );
    };

    const renderExerciseModal = () => (
        <Modal
            visible={showExerciseModal}
            transparent
            animationType="slide"
            onRequestClose={() => setShowExerciseModal(false)}
        >
            <View style={styles.modalContainer}>
                <LinearGradient colors={['#1a1a2e', '#16213e']} style={styles.modalContent}>
                    <View style={styles.modalHeader}>
                        <Text style={styles.modalTitle}>
                            {editingExercise?.id.startsWith('custom') ? 'Add Exercise' : 'Edit Exercise'}
                        </Text>
                        <TouchableOpacity onPress={() => setShowExerciseModal(false)}>
                            <Ionicons name="close-circle" size={32} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.modalScroll}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Exercise Name *</Text>
                            <TextInput
                                style={styles.input}
                                value={editingExercise?.name}
                                onChangeText={(text) =>
                                    setEditingExercise((prev) => (prev ? { ...prev, name: text } : null))
                                }
                                placeholder="e.g., Barbell Squat"
                                placeholderTextColor="rgba(255,255,255,0.3)"
                            />
                        </View>

                        <View style={styles.inputRow}>
                            <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
                                <Text style={styles.inputLabel}>Sets</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editingExercise?.sets?.toString() || ''}
                                    onChangeText={(text) =>
                                        setEditingExercise((prev) =>
                                            prev ? { ...prev, sets: parseInt(text) || undefined } : null
                                        )
                                    }
                                    keyboardType="numeric"
                                    placeholder="3"
                                    placeholderTextColor="rgba(255,255,255,0.3)"
                                />
                            </View>

                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={styles.inputLabel}>Reps</Text>
                                <TextInput
                                    style={styles.input}
                                    value={editingExercise?.reps || ''}
                                    onChangeText={(text) =>
                                        setEditingExercise((prev) => (prev ? { ...prev, reps: text } : null))
                                    }
                                    placeholder="10-12"
                                    placeholderTextColor="rgba(255,255,255,0.3)"
                                />
                            </View>
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Weight (optional)</Text>
                            <TextInput
                                style={styles.input}
                                value={editingExercise?.weight || ''}
                                onChangeText={(text) =>
                                    setEditingExercise((prev) => (prev ? { ...prev, weight: text } : null))
                                }
                                placeholder="e.g., 135 lbs"
                                placeholderTextColor="rgba(255,255,255,0.3)"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Time (optional)</Text>
                            <TextInput
                                style={styles.input}
                                value={editingExercise?.time || ''}
                                onChangeText={(text) =>
                                    setEditingExercise((prev) => (prev ? { ...prev, time: text } : null))
                                }
                                placeholder="e.g., 5 min"
                                placeholderTextColor="rgba(255,255,255,0.3)"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Speed (optional)</Text>
                            <TextInput
                                style={styles.input}
                                value={editingExercise?.speed || ''}
                                onChangeText={(text) =>
                                    setEditingExercise((prev) => (prev ? { ...prev, speed: text } : null))
                                }
                                placeholder="e.g., 6.0 mph"
                                placeholderTextColor="rgba(255,255,255,0.3)"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Incline (optional)</Text>
                            <TextInput
                                style={styles.input}
                                value={editingExercise?.incline || ''}
                                onChangeText={(text) =>
                                    setEditingExercise((prev) => (prev ? { ...prev, incline: text } : null))
                                }
                                placeholder="e.g., 5%"
                                placeholderTextColor="rgba(255,255,255,0.3)"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Instructions (optional)</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                value={editingExercise?.instructions || ''}
                                onChangeText={(text) =>
                                    setEditingExercise((prev) => (prev ? { ...prev, instructions: text } : null))
                                }
                                placeholder="Add exercise instructions..."
                                placeholderTextColor="rgba(255,255,255,0.3)"
                                multiline
                                numberOfLines={4}
                            />
                        </View>
                    </ScrollView>

                    <TouchableOpacity style={styles.saveButton} onPress={saveExercise}>
                        <LinearGradient colors={['#667eea', '#764ba2']} style={styles.saveButtonGradient}>
                            <Text style={styles.saveButtonText}>Save Exercise</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        </Modal>
    );

    if (selectedDay) {
        return (
            <View style={styles.container}>
                <LinearGradient colors={selectedDay.gradient as any} style={styles.gradient}>
                    {/* Header */}
                    <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
                        <TouchableOpacity onPress={() => setSelectedDay(null)} style={styles.backButton}>
                            <Ionicons name="arrow-back" size={28} color="#fff" />
                        </TouchableOpacity>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.dayName}>{selectedDay.day}</Text>
                            <Text style={styles.workoutTitle}>{selectedDay.title}</Text>
                        </View>
                    </View>

                    <ScrollView style={styles.scrollView}>
                        {selectedDay.sections.map((section, sectionIndex) => (
                            <View key={sectionIndex} style={styles.section}>
                                <Text style={styles.sectionTitle}>{section.name}</Text>

                                {section.exercises.map((exercise) => (
                                    <View key={exercise.id} style={styles.exerciseCard}>
                                        <View style={styles.exerciseContent}>
                                            <View style={{ flex: 1 }}>
                                                <Text style={styles.exerciseName}>{exercise.name}</Text>
                                                <View style={styles.exerciseMeta}>
                                                    {exercise.sets && (
                                                        <Text style={styles.metaText}>
                                                            {exercise.sets} sets × {exercise.reps || 'N/A'}
                                                        </Text>
                                                    )}
                                                    {exercise.weight && (
                                                        <Text style={styles.metaText}> • {exercise.weight}</Text>
                                                    )}
                                                    {exercise.time && (
                                                        <Text style={styles.metaText}> • {exercise.time}</Text>
                                                    )}
                                                </View>
                                            </View>

                                            <View style={styles.exerciseActions}>
                                                <TouchableOpacity
                                                    onPress={() => editExercise(exercise)}
                                                    style={styles.actionButton}
                                                >
                                                    <Ionicons name="create-outline" size={20} color="#fff" />
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    onPress={() => deleteExercise(exercise.id)}
                                                    style={[styles.actionButton, styles.deleteButton]}
                                                >
                                                    <Ionicons name="trash-outline" size={20} color="#f5576c" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        ))}

                        {/* Add Exercise Button */}
                        <TouchableOpacity style={styles.addButton} onPress={addNewExercise}>
                            <LinearGradient
                                colors={['rgba(102, 126, 234, 0.3)', 'rgba(118, 75, 162, 0.3)']}
                                style={styles.addButtonGradient}
                            >
                                <Ionicons name="add-circle-outline" size={24} color="#fff" />
                                <Text style={styles.addButtonText}>Add Exercise</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Bottom spacing for home indicator */}
                        <View style={{ height: Math.max(insets.bottom, 20) + 20 }} />
                    </ScrollView>

                    {/* Exercise Edit Modal */}
                    {renderExerciseModal()}
                </LinearGradient>
            </View>
        );
    }

    // Main view - list of workout days
    return (
        <View style={styles.container}>
            <LinearGradient colors={['#0f172a', '#1e293b']} style={styles.gradient}>
                {/* Header */}
                <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={28} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Edit Workouts 📝</Text>
                    <TouchableOpacity onPress={resetToDefaults} style={styles.resetButton}>
                        <Ionicons name="refresh-circle-outline" size={28} color="#fff" />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.scrollView}>
                    <View style={styles.infoCard}>
                        <Ionicons name="information-circle" size={24} color="#667eea" />
                        <Text style={styles.infoText}>
                            Tap a workout day to customize exercises. You can add, edit, or delete exercises, and
                            set custom values for sets, reps, weight, time, and speed.
                        </Text>
                    </View>

                    {workouts.map((workout) => (
                        <TouchableOpacity key={workout.id} onPress={() => selectDay(workout)}>
                            <LinearGradient
                                colors={workout.gradient as any}
                                style={styles.dayCard}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <View style={styles.dayContent}>
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.dayText}>{workout.day}</Text>
                                        <Text style={styles.dayTitle} numberOfLines={2}>{workout.title}</Text>
                                        <Text style={styles.exerciseCount}>
                                            {workout.sections.reduce(
                                                (sum, section) => sum + section.exercises.length,
                                                0
                                            )}{' '}
                                            exercises
                                        </Text>
                                    </View>
                                    <Ionicons name="chevron-forward" size={28} color="#fff" style={{ flexShrink: 0, marginLeft: 12 }} />
                                </View>
                            </LinearGradient>
                        </TouchableOpacity>
                    ))}

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
        borderRadius: 16,
        marginBottom: 16,
        overflow: 'hidden',
    },
    dayContent: {
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dayText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    dayTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    exerciseCount: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 14,
    },
    dayName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    workoutTitle: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    exerciseCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        marginBottom: 12,
        overflow: 'hidden',
    },
    exerciseContent: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    exerciseName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    exerciseMeta: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    metaText: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 14,
    },
    exerciseActions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteButton: {
        backgroundColor: 'rgba(245, 87, 108, 0.2)',
    },
    addButton: {
        marginBottom: 30,
        borderRadius: 12,
        overflow: 'hidden',
    },
    addButtonGradient: {
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        height: '90%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    modalScroll: {
        flex: 1,
    },
    inputGroup: {
        marginBottom: 20,
    },
    inputRow: {
        flexDirection: 'row',
    },
    inputLabel: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        padding: 16,
        color: '#fff',
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    saveButton: {
        marginTop: 20,
        borderRadius: 12,
        overflow: 'hidden',
    },
    saveButtonGradient: {
        padding: 18,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

