import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    Animated,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getWeeklyStats, getTodayProgress, loadWorkoutSchedule } from '../utils/storage';
import { StatsCard } from '../components/StatsCard';
import { WaterReminder } from '../components/WaterReminder';
import { SplashEffect } from '../components/SplashEffect';
import { useWorkouts } from '../hooks/useWorkouts';
import { WorkoutSchedule, WorkoutDay } from '../types/workout';

// Quote API
const QUOTE_API = 'https://zenquotes.io/api/random';

interface Quote {
    q: string;
    a: string;
}

interface HomeScreenProps {
    onSelectDay: (dayId: string) => void;
    onOpenSettings: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onSelectDay, onOpenSettings }) => {
    const { workouts: workoutProgram } = useWorkouts();
    const insets = useSafeAreaInsets();
    const [stats, setStats] = useState({
        totalWorkouts: 0,
        totalExercises: 0,
        workoutsByDay: {} as Record<string, number>,
    });
    const [todayProgress, setTodayProgress] = useState<Record<string, number>>({});
    const [splashes, setSplashes] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);
    const [schedule, setSchedule] = useState<WorkoutSchedule | null>(null);
    const [quote, setQuote] = useState<Quote>({ q: "Let's crush today's workout", a: "" });
    const splashIdRef = useRef(0);

    useEffect(() => {
        loadStats();
        loadTodayProgress();
        loadSchedule();
        fetchQuote();
    }, []);

    const loadSchedule = async () => {
        const savedSchedule = await loadWorkoutSchedule();
        if (savedSchedule) {
            setSchedule(savedSchedule);
        }
    };

    const loadStats = async () => {
        const weeklyStats = await getWeeklyStats();
        setStats(weeklyStats);
    };

    const loadTodayProgress = async () => {
        const progress: Record<string, number> = {};
        for (const day of workoutProgram) {
            const completed = await getTodayProgress(day.id);
            const totalExercises = day.sections.reduce(
                (sum, section) => sum + section.exercises.length,
                0
            );
            progress[day.id] = totalExercises > 0
                ? (completed.length / totalExercises) * 100
                : 0;
        }
        setTodayProgress(progress);
    };

    const fetchQuote = async () => {
        try {
            const response = await fetch(QUOTE_API);
            const data = await response.json();
            if (data && data[0]) {
                setQuote({ q: data[0].q, a: data[0].a });
            }
        } catch (error) {
            // Fallback quotes if API fails
            const fallbackQuotes = [
                { q: "The only bad workout is the one that didn't happen.", a: "Unknown" },
                { q: "Success is the sum of small efforts repeated day in and day out.", a: "Robert Collier" },
                { q: "Your body can stand almost anything. It's your mind you have to convince.", a: "Unknown" },
                { q: "The pain you feel today will be the strength you feel tomorrow.", a: "Unknown" },
                { q: "Don't limit your challenges. Challenge your limits.", a: "Unknown" },
            ];
            const random = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
            setQuote(random);
        }
    };

    // Get workouts to display based on schedule
    const getDisplayWorkouts = () => {
        if (!schedule) {
            // No custom schedule, show default 4 days (Monday-Thursday)
            return workoutProgram.map((workout, index) => ({
                workout,
                dayOfWeek: index + 1, // Monday = 1, Tuesday = 2, etc.
                isToday: new Date().getDay() === index + 1,
            }));
        }

        // Custom schedule - show only enabled days
        const dayKeys: (keyof WorkoutSchedule)[] = [
            'sunday',
            'monday',
            'tuesday',
            'wednesday',
            'thursday',
            'friday',
            'saturday',
        ];

        const today = new Date().getDay();
        const displayWorkouts: Array<{ workout: WorkoutDay; dayOfWeek: number; isToday: boolean }> = [];

        dayKeys.forEach((dayKey, dayOfWeek) => {
            const daySchedule = schedule[dayKey];
            if (daySchedule.enabled && daySchedule.workoutIndex >= 0) {
                const workout = workoutProgram[daySchedule.workoutIndex];
                if (workout) {
                    displayWorkouts.push({
                        workout,
                        dayOfWeek,
                        isToday: today === dayOfWeek,
                    });
                }
            }
        });

        return displayWorkouts;
    };

    const displayWorkouts = getDisplayWorkouts();

    // Funky Card Component with animations
    const FunkyCard: React.FC<{
        onPress: (event: any) => void;
        style?: any;
        children: React.ReactNode;
    }> = ({ onPress, style, children }) => {
        const scaleAnim = useRef(new Animated.Value(1)).current;
        const rotateAnim = useRef(new Animated.Value(0)).current;

        const handlePressIn = () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 0.95,
                    useNativeDriver: true,
                }),
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 100,
                    useNativeDriver: true,
                }),
            ]).start();
        };

        const handlePressOut = () => {
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 3,
                    tension: 100,
                    useNativeDriver: true,
                }),
                Animated.timing(rotateAnim, {
                    toValue: 0,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();
        };

        const rotate = rotateAnim.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '-1deg'],
        });

        return (
            <TouchableOpacity
                activeOpacity={1}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                onPress={onPress}
            >
                <Animated.View
                    style={[
                        style,
                        {
                            transform: [{ scale: scaleAnim }, { rotate }],
                        },
                    ]}
                >
                    {children}
                </Animated.View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#0f172a', '#1e293b']}
                style={styles.gradient}
            >
                <ScrollView style={styles.scrollView}>
                    {/* Header */}
                    <ImageBackground
                        source={require('../assets/images/workout-hero.jpg')}
                        style={styles.heroBackground}
                        imageStyle={styles.heroImage}
                    >
                        <LinearGradient
                            colors={['rgba(15,23,42,0.7)', 'rgba(15,23,42,0.9)']}
                            style={[styles.header, { paddingTop: insets.top + 16 }]}
                        >
                            <View style={styles.headerContent}>
                                <Text style={styles.greeting}>Welcome Back! 💪</Text>
                                <Text style={styles.quoteText}>{quote.q}</Text>
                                {quote.a && <Text style={styles.authorText}>— {quote.a}</Text>}
                            </View>
                            <TouchableOpacity
                                onPress={() => {
                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                    onOpenSettings();
                                }}
                                style={styles.settingsButton}
                            >
                                <Ionicons name="settings-outline" size={28} color="#fff" />
                            </TouchableOpacity>
                        </LinearGradient>
                    </ImageBackground>

                    {/* Water Reminder */}
                    <View style={styles.waterContainer}>
                        <WaterReminder />
                    </View>

                    {/* Stats Card */}
                    <View style={styles.statsContainer}>
                        <StatsCard />
                    </View>

                    {/* Quick Stats */}
                    <View style={styles.quickStats}>
                        <View style={styles.statCard}>
                            <LinearGradient
                                colors={['#667eea', '#764ba2']}
                                style={styles.statGradient}
                            >
                                <Ionicons name="flame" size={32} color="#fff" />
                                <Text style={styles.statValue}>{stats.totalWorkouts}</Text>
                                <Text style={styles.statLabel}>Workouts</Text>
                            </LinearGradient>
                        </View>

                        <View style={styles.statCard}>
                            <LinearGradient
                                colors={['#f093fb', '#f5576c']}
                                style={styles.statGradient}
                            >
                                <Ionicons name="barbell" size={32} color="#fff" />
                                <Text style={styles.statValue}>{stats.totalExercises}</Text>
                                <Text style={styles.statLabel}>Exercises</Text>
                            </LinearGradient>
                        </View>
                    </View>

                    {/* Workout Days */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            Your Workout Program {displayWorkouts.length > 0 && `(${displayWorkouts.length} days)`}
                        </Text>

                        {displayWorkouts.map(({ workout: day, dayOfWeek, isToday }) => {
                            const progress = todayProgress[day.id] || 0;
                            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                            const dayName = dayNames[dayOfWeek];

                            return (
                                <FunkyCard
                                    key={`${day.id}-${dayOfWeek}`}
                                    onPress={(event) => {
                                        const color = day.gradient[0];
                                        const id = splashIdRef.current++;
                                        setSplashes((prev) => [
                                            ...prev,
                                            { id, x: event.nativeEvent.pageX, y: event.nativeEvent.pageY, color },
                                        ]);
                                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                        setTimeout(() => onSelectDay(day.id), 200);
                                    }}
                                    style={styles.dayCard}
                                >
                                    <ImageBackground
                                        source={day.image}
                                        style={styles.dayImageBackground}
                                        imageStyle={styles.dayImage}
                                    >
                                        <LinearGradient
                                            colors={['rgba(0,0,0,0.4)', 'rgba(0,0,0,0.7)']}
                                            style={styles.dayGradient}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 0, y: 1 }}
                                        >
                                            {isToday && (
                                                <View style={styles.todayBadge}>
                                                    <Text style={styles.todayText}>TODAY</Text>
                                                </View>
                                            )}

                                            <View style={styles.dayHeader}>
                                                <View style={styles.dayInfo}>
                                                    <Ionicons name="fitness" size={32} color="#fff" />
                                                    <View style={styles.dayTextContainer}>
                                                        <Text style={styles.dayName}>{dayName}</Text>
                                                        <Text style={styles.dayTitle}>{day.title}</Text>
                                                    </View>
                                                </View>
                                                <Ionicons name="chevron-forward" size={24} color="#fff" />
                                            </View>

                                            {/* Progress Bar */}
                                            {progress > 0 && (
                                                <View style={styles.progressContainer}>
                                                    <View style={styles.progressBar}>
                                                        <View
                                                            style={[
                                                                styles.progressFill,
                                                                { width: `${progress}%` },
                                                            ]}
                                                        />
                                                    </View>
                                                    <Text style={styles.progressText}>
                                                        {Math.round(progress)}% Complete
                                                    </Text>
                                                </View>
                                            )}

                                            {/* Exercise Count */}
                                            <View style={styles.exerciseCount}>
                                                <Ionicons name="list" size={16} color="#fff" />
                                                <Text style={styles.exerciseCountText}>
                                                    {day.sections.reduce(
                                                        (sum, section) => sum + section.exercises.length,
                                                        0
                                                    )}{' '}
                                                    exercises
                                                </Text>
                                            </View>
                                        </LinearGradient>
                                    </ImageBackground>
                                </FunkyCard>
                            );
                        })}
                    </View>

                    {/* Splash Effects */}
                    {splashes.map((splash) => (
                        <SplashEffect
                            key={splash.id}
                            x={splash.x}
                            y={splash.y}
                            color={splash.color}
                            onComplete={() => {
                                setSplashes((prev) => prev.filter((s) => s.id !== splash.id));
                            }}
                        />
                    ))}

                    {/* Tips Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>💡 Tips</Text>
                        <View style={styles.tipCard}>
                            <Text style={styles.tipText}>
                                • Stay hydrated - drink water between sets
                            </Text>
                            <Text style={styles.tipText}>
                                • Focus on form over weight
                            </Text>
                            <Text style={styles.tipText}>
                                • Rest 48 hours between muscle groups
                            </Text>
                            <Text style={styles.tipText}>
                                • Use the timer for time-based exercises
                            </Text>
                        </View>
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
    scrollView: {
        flex: 1,
    },
    heroBackground: {
        width: '100%',
    },
    heroImage: {
        resizeMode: 'cover',
    },
    header: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
    },
    headerContent: {
        flex: 1,
        paddingRight: 16,
    },
    settingsButton: {
        padding: 8,
        marginTop: -4,
    },
    greeting: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 12,
    },
    quoteText: {
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.9)',
        fontStyle: 'italic',
        lineHeight: 22,
        marginBottom: 6,
        flexWrap: 'wrap',
    },
    authorText: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.7)',
        fontWeight: '500',
    },
    waterContainer: {
        paddingHorizontal: 20,
    },
    statsContainer: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    quickStats: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        gap: 15,
        marginBottom: 32,
    },
    statCard: {
        flex: 1,
    },
    statGradient: {
        padding: 20,
        borderRadius: 16,
        alignItems: 'center',
        minHeight: 140,
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    statValue: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 8,
    },
    statLabel: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 4,
    },
    section: {
        paddingHorizontal: 20,
        marginBottom: 32,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 20,
    },
    dayCard: {
        marginBottom: 20,
        borderRadius: 20,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        transform: [{ scale: 1 }],
    },
    dayImageBackground: {
        width: '100%',
    },
    dayImage: {
        borderRadius: 20,
    },
    dayGradient: {
        padding: 24,
        position: 'relative',
        minHeight: 160,
    },
    todayBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
    },
    todayText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    dayHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    dayInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    dayTextContainer: {
        marginLeft: 12,
        flex: 1,
    },
    dayName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    dayTitle: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
    },
    progressContainer: {
        marginTop: 20,
        marginBottom: 8,
    },
    progressBar: {
        height: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#fff',
        borderRadius: 3,
    },
    progressText: {
        fontSize: 12,
        color: '#fff',
        marginTop: 6,
    },
    exerciseCount: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        gap: 6,
    },
    exerciseCountText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    tipCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    tipText: {
        fontSize: 15,
        color: '#cbd5e1',
        marginBottom: 8,
        lineHeight: 22,
    },
});

