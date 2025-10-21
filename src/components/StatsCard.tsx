import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    ImageBackground,
    Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { loadWorkoutHistory } from '../utils/storage';

const { width } = Dimensions.get('window');

export const StatsCard: React.FC = () => {
    const [weeklyData, setWeeklyData] = useState<{
        dates: string[];
        counts: number[];
    }>({
        dates: [],
        counts: [],
    });
    const [totalExercises, setTotalExercises] = useState(0);
    const [currentStreak, setCurrentStreak] = useState(0);
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        loadStats();
        startPulseAnimation();
    }, []);

    const startPulseAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    };

    const loadStats = async () => {
        const history = await loadWorkoutHistory();

        // Get last 7 days
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return date.toISOString().split('T')[0];
        });

        const counts = last7Days.map(date => {
            const dayWorkouts = history.filter(h => h.date === date);
            return dayWorkouts.reduce((sum, w) => sum + w.completedExercises.length, 0);
        });

        setWeeklyData({
            dates: last7Days,
            counts,
        });

        // Calculate total exercises this week
        const weekTotal = counts.reduce((sum, count) => sum + count, 0);
        setTotalExercises(weekTotal);

        // Calculate current streak
        let streak = 0;
        const sortedDates = [...new Set(history.map(h => h.date))].sort().reverse();
        const today = new Date().toISOString().split('T')[0];

        for (let i = 0; i < sortedDates.length; i++) {
            const expectedDate = new Date();
            expectedDate.setDate(expectedDate.getDate() - i);
            const expected = expectedDate.toISOString().split('T')[0];

            if (sortedDates[i] === expected) {
                streak++;
            } else {
                break;
            }
        }
        setCurrentStreak(streak);
    };

    const maxCount = Math.max(...weeklyData.counts, 1);
    const chartHeight = 120;

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require('../assets/images/stats-bg.jpg')}
                style={styles.imageBackground}
                imageStyle={styles.backgroundImage}
            >
                <LinearGradient
                    colors={['rgba(79, 172, 254, 0.9)', 'rgba(0, 242, 254, 0.9)']}
                    style={styles.gradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.header}>
                        <Text style={styles.title}>This Week's Progress</Text>
                        <Animated.View style={[styles.streakBadge, { transform: [{ scale: pulseAnim }] }]}>
                            <Ionicons name="flame" size={16} color="#fff" />
                            <Text style={styles.streakText}>{currentStreak} day streak</Text>
                        </Animated.View>
                    </View>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>{totalExercises}</Text>
                            <Text style={styles.statLabel}>Total Exercises</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statValue}>
                                {weeklyData.counts.filter(c => c > 0).length}
                            </Text>
                            <Text style={styles.statLabel}>Active Days</Text>
                        </View>
                    </View>

                    <View style={styles.chartContainer}>
                        <View style={styles.chart}>
                            {weeklyData.counts.map((count, index) => {
                                const barHeight = maxCount > 0 ? (count / maxCount) * chartHeight : 0;
                                const date = new Date(weeklyData.dates[index]);
                                const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });

                                return (
                                    <View key={index} style={styles.barContainer}>
                                        <View style={styles.barWrapper}>
                                            <View
                                                style={[
                                                    styles.bar,
                                                    {
                                                        height: barHeight || 4,
                                                        opacity: count > 0 ? 1 : 0.3,
                                                    },
                                                ]}
                                            />
                                        </View>
                                        <Text style={styles.barLabel}>{dayName}</Text>
                                        {count > 0 && (
                                            <Text style={styles.barCount}>{count}</Text>
                                        )}
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                </LinearGradient>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 20,
    },
    imageBackground: {
        width: '100%',
    },
    backgroundImage: {
        borderRadius: 20,
    },
    gradient: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        gap: 12,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        flex: 1,
    },
    streakBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 12,
        gap: 4,
        flexShrink: 0,
    },
    streakText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
    },
    statsRow: {
        flexDirection: 'row',
        gap: 20,
        marginBottom: 24,
    },
    statItem: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    statValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.9)',
    },
    chartContainer: {
        marginTop: 8,
    },
    chart: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 140,
    },
    barContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    barWrapper: {
        width: '70%',
        height: 120,
        justifyContent: 'flex-end',
    },
    bar: {
        backgroundColor: '#fff',
        borderRadius: 4,
        minHeight: 4,
    },
    barLabel: {
        fontSize: 11,
        color: '#fff',
        marginTop: 6,
        fontWeight: '600',
    },
    barCount: {
        fontSize: 10,
        color: '#fff',
        marginTop: 2,
        fontWeight: 'bold',
    },
});

