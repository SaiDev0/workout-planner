import { useState, useEffect } from 'react';
import { workoutProgram as defaultWorkouts } from '../data/workouts';
import { loadCustomWorkouts } from '../utils/storage';
import { WorkoutDay } from '../types/workout';

export const useWorkouts = () => {
    const [workouts, setWorkouts] = useState<WorkoutDay[]>(defaultWorkouts);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadWorkouts();
    }, []);

    const loadWorkouts = async () => {
        try {
            const customWorkouts = await loadCustomWorkouts();
            if (customWorkouts.length > 0) {
                setWorkouts(customWorkouts);
            } else {
                setWorkouts(defaultWorkouts);
            }
        } catch (error) {
            console.error('Error loading workouts:', error);
            setWorkouts(defaultWorkouts);
        } finally {
            setLoading(false);
        }
    };

    const refreshWorkouts = () => {
        loadWorkouts();
    };

    return { workouts, loading, refreshWorkouts };
};

