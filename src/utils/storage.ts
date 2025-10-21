import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutProgress, WorkoutDay, WorkoutSchedule } from '../types/workout';

const PROGRESS_KEY = '@workout_progress';
const HISTORY_KEY = '@workout_history';
const CUSTOM_WORKOUTS_KEY = '@custom_workouts';
const WORKOUT_SCHEDULE_KEY = '@workout_schedule';

export const saveWorkoutProgress = async (progress: WorkoutProgress[]) => {
    try {
        await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
    } catch (error) {
        console.error('Error saving workout progress:', error);
    }
};

export const loadWorkoutProgress = async (): Promise<WorkoutProgress[]> => {
    try {
        const data = await AsyncStorage.getItem(PROGRESS_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error loading workout progress:', error);
        return [];
    }
};

export const saveWorkoutHistory = async (dayId: string, completedExercises: string[]) => {
    try {
        const history = await loadWorkoutHistory();
        const today = new Date().toISOString().split('T')[0];

        const existingEntry = history.find(
            entry => entry.date === today && entry.dayId === dayId
        );

        if (existingEntry) {
            existingEntry.completedExercises = completedExercises;
        } else {
            history.push({
                date: today,
                dayId,
                completedExercises,
            });
        }

        await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    } catch (error) {
        console.error('Error saving workout history:', error);
    }
};

export const loadWorkoutHistory = async (): Promise<WorkoutProgress[]> => {
    try {
        const data = await AsyncStorage.getItem(HISTORY_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error loading workout history:', error);
        return [];
    }
};

export const getTodayProgress = async (dayId: string): Promise<string[]> => {
    try {
        const history = await loadWorkoutHistory();
        const today = new Date().toISOString().split('T')[0];

        const todayEntry = history.find(
            entry => entry.date === today && entry.dayId === dayId
        );

        return todayEntry ? todayEntry.completedExercises : [];
    } catch (error) {
        console.error('Error getting today progress:', error);
        return [];
    }
};

export const getWeeklyStats = async () => {
    try {
        const history = await loadWorkoutHistory();
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        const weeklyWorkouts = history.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate >= weekAgo;
        });

        return {
            totalWorkouts: weeklyWorkouts.length,
            totalExercises: weeklyWorkouts.reduce(
                (sum, entry) => sum + entry.completedExercises.length,
                0
            ),
            workoutsByDay: weeklyWorkouts.reduce((acc, entry) => {
                acc[entry.dayId] = (acc[entry.dayId] || 0) + 1;
                return acc;
            }, {} as Record<string, number>),
        };
    } catch (error) {
        console.error('Error getting weekly stats:', error);
        return {
            totalWorkouts: 0,
            totalExercises: 0,
            workoutsByDay: {},
        };
    }
};

// Custom workouts management
export const saveCustomWorkouts = async (workouts: WorkoutDay[]) => {
    try {
        await AsyncStorage.setItem(CUSTOM_WORKOUTS_KEY, JSON.stringify(workouts));
    } catch (error) {
        console.error('Error saving custom workouts:', error);
    }
};

export const loadCustomWorkouts = async (): Promise<WorkoutDay[]> => {
    try {
        const data = await AsyncStorage.getItem(CUSTOM_WORKOUTS_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Error loading custom workouts:', error);
        return [];
    }
};

// Workout schedule management
export const saveWorkoutSchedule = async (schedule: WorkoutSchedule) => {
    try {
        await AsyncStorage.setItem(WORKOUT_SCHEDULE_KEY, JSON.stringify(schedule));
    } catch (error) {
        console.error('Error saving workout schedule:', error);
    }
};

export const loadWorkoutSchedule = async (): Promise<WorkoutSchedule | null> => {
    try {
        const data = await AsyncStorage.getItem(WORKOUT_SCHEDULE_KEY);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error loading workout schedule:', error);
        return null;
    }
};
