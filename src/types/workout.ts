export interface Exercise {
    id: string;
    name: string;
    sets?: number | string;
    time?: string;
    reps?: string;
    weight?: string;
    details?: string;
    instructions?: string;
    inclination?: string;
    incline?: string;
    speed?: string;
    completed: boolean;
}

export interface WorkoutDay {
    id: string;
    day: string;
    title: string;
    sections: WorkoutSection[];
    icon: string;
    gradient: string[];
    image?: any;
}

export interface WorkoutSection {
    name: string;
    exercises: Exercise[];
}

export interface WorkoutProgress {
    date: string;
    dayId: string;
    completedExercises: string[];
}

export interface DaySchedule {
    workoutIndex: number; // -1 for rest day, 0-3 for workout index
    enabled: boolean;
}

export interface WorkoutSchedule {
    sunday: DaySchedule;
    monday: DaySchedule;
    tuesday: DaySchedule;
    wednesday: DaySchedule;
    thursday: DaySchedule;
    friday: DaySchedule;
    saturday: DaySchedule;
}
