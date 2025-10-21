import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Animated,
    Modal,
    TextInput,
    ScrollView,
    AppState,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WaterSplashEffect } from './WaterSplashEffect';

const WATER_KEY = '@water_intake';
const WATER_GOAL_KEY = '@water_daily_goal';
const DEFAULT_DAILY_GOAL = 8; // 8 glasses
const OZ_PER_GLASS = 8; // 8 oz per glass (standard)

export const WaterReminder: React.FC = () => {
    const [glasses, setGlasses] = useState(0);
    const [dailyGoal, setDailyGoal] = useState(DEFAULT_DAILY_GOAL);
    const [scaleAnim] = useState(new Animated.Value(1));
    const [fillAnim] = useState(new Animated.Value(0));
    const [waveAnim] = useState(new Animated.Value(0));
    const [showSplash, setShowSplash] = useState(false);
    const [showGoalModal, setShowGoalModal] = useState(false);
    const [tempGoal, setTempGoal] = useState(DEFAULT_DAILY_GOAL.toString());
    const currentDateRef = useRef(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        loadWaterIntake();
        loadDailyGoal();
    }, []);

    // Check for date change (daily reset)
    useEffect(() => {
        const checkDateChange = async () => {
            const today = new Date().toISOString().split('T')[0];
            if (today !== currentDateRef.current) {
                // New day detected - reset water intake
                currentDateRef.current = today;
                setGlasses(0);
                await AsyncStorage.setItem(
                    WATER_KEY,
                    JSON.stringify({ date: today, glasses: 0 })
                );
                console.log('Water intake reset for new day:', today);
            }
        };

        // Check when app comes to foreground
        const subscription = AppState.addEventListener('change', (nextAppState) => {
            if (nextAppState === 'active') {
                checkDateChange();
            }
        });

        // Check every minute while app is active
        const interval = setInterval(checkDateChange, 60000); // Check every 60 seconds

        return () => {
            subscription.remove();
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        // Animate fill level
        Animated.spring(fillAnim, {
            toValue: glasses / dailyGoal,
            useNativeDriver: false,
            friction: 8,
        }).start();

        // Continuous wave animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(waveAnim, {
                    toValue: 1,
                    duration: 2000,
                    useNativeDriver: true,
                }),
                Animated.timing(waveAnim, {
                    toValue: 0,
                    duration: 2000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [glasses, dailyGoal]);

    const loadWaterIntake = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            currentDateRef.current = today; // Update current date ref
            const data = await AsyncStorage.getItem(WATER_KEY);
            if (data) {
                const parsed = JSON.parse(data);
                if (parsed.date === today) {
                    setGlasses(parsed.glasses);
                } else {
                    // Reset for new day
                    setGlasses(0);
                    await AsyncStorage.setItem(
                        WATER_KEY,
                        JSON.stringify({ date: today, glasses: 0 })
                    );
                }
            }
        } catch (error) {
            console.error('Error loading water intake:', error);
        }
    };

    const loadDailyGoal = async () => {
        try {
            const data = await AsyncStorage.getItem(WATER_GOAL_KEY);
            if (data) {
                const goal = parseInt(data, 10);
                if (goal > 0) {
                    setDailyGoal(goal);
                    setTempGoal(goal.toString());
                }
            }
        } catch (error) {
            console.error('Error loading daily goal:', error);
        }
    };

    const saveDailyGoal = async () => {
        try {
            const goal = parseInt(tempGoal, 10);
            if (goal > 0 && goal <= 20) {
                setDailyGoal(goal);
                await AsyncStorage.setItem(WATER_GOAL_KEY, goal.toString());
                setShowGoalModal(false);
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
        } catch (error) {
            console.error('Error saving daily goal:', error);
        }
    };

    const addGlass = async () => {
        if (glasses >= dailyGoal) return;

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // Animation
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 1.2,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();

        const newGlasses = glasses + 1;
        setGlasses(newGlasses);

        if (newGlasses === dailyGoal) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            // Trigger water splash celebration!
            setShowSplash(true);
            setTimeout(() => setShowSplash(false), 3000);
        }

        try {
            const today = new Date().toISOString().split('T')[0];
            await AsyncStorage.setItem(
                WATER_KEY,
                JSON.stringify({ date: today, glasses: newGlasses })
            );
        } catch (error) {
            console.error('Error saving water intake:', error);
        }
    };

    const removeGlass = async () => {
        if (glasses <= 0) return;

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        const newGlasses = glasses - 1;
        setGlasses(newGlasses);

        try {
            const today = new Date().toISOString().split('T')[0];
            await AsyncStorage.setItem(
                WATER_KEY,
                JSON.stringify({ date: today, glasses: newGlasses })
            );
        } catch (error) {
            console.error('Error saving water intake:', error);
        }
    };

    const percentage = (glasses / dailyGoal) * 100;
    const totalOz = dailyGoal * OZ_PER_GLASS;

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={['#3b82f6', '#2563eb']}
                style={styles.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.header}>
                    <Ionicons name="water" size={24} color="#fff" />
                    <Text style={styles.title}>Stay Hydrated</Text>
                    <TouchableOpacity
                        style={styles.settingsButton}
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                            setShowGoalModal(true);
                        }}
                    >
                        <Ionicons name="settings-outline" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    <Text style={styles.glassCount}>
                        {glasses} / {dailyGoal} glasses
                    </Text>
                    <Text style={styles.ozInfo}>
                        ({glasses * OZ_PER_GLASS} / {totalOz} oz) • {OZ_PER_GLASS}oz per glass
                    </Text>

                    {/* Tumbler Container */}
                    <View style={styles.tumblerContainer}>
                        {/* Glass Container */}
                        <View style={styles.glassContainer}>
                            {/* Glass Rim (Top) */}
                            <View style={styles.glassRim} />

                            {/* Glass Body */}
                            <View style={styles.tumbler}>
                                {/* Water Fill */}
                                <Animated.View
                                    style={[
                                        styles.waterFill,
                                        {
                                            height: fillAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: ['0%', '100%'],
                                            }),
                                        },
                                    ]}
                                >
                                    <LinearGradient
                                        colors={['#60a5fa', '#3b82f6', '#2563eb']}
                                        style={styles.waterGradient}
                                    >
                                        {/* Water Surface Wave */}
                                        <Animated.View
                                            style={[
                                                styles.wave,
                                                {
                                                    transform: [
                                                        {
                                                            translateY: waveAnim.interpolate({
                                                                inputRange: [0, 1],
                                                                outputRange: [0, -4],
                                                            }),
                                                        },
                                                    ],
                                                },
                                            ]}
                                        />

                                        {/* Bubbles */}
                                        {glasses > 0 && (
                                            <>
                                                <View style={[styles.bubble, { left: '20%', bottom: '30%' }]} />
                                                <View style={[styles.bubble, { left: '70%', bottom: '50%', width: 8, height: 8 }]} />
                                                <View style={[styles.bubble, { left: '45%', bottom: '70%', width: 6, height: 6 }]} />
                                            </>
                                        )}
                                    </LinearGradient>
                                </Animated.View>

                                {/* Left Glass Shine */}
                                <View style={styles.glassShineLeft} />

                                {/* Right Glass Reflection */}
                                <View style={styles.glassReflection} />
                            </View>

                            {/* Glass Base */}
                            <View style={styles.glassBase} />
                        </View>

                        {/* Percentage Badge */}
                        {glasses > 0 && (
                            <Animated.View style={[styles.percentageBadge, { transform: [{ scale: scaleAnim }] }]}>
                                <Text style={styles.percentageText}>{Math.round(percentage)}%</Text>
                            </Animated.View>
                        )}
                    </View>

                    <View style={styles.controls}>
                        <TouchableOpacity
                            onPress={removeGlass}
                            style={styles.button}
                            disabled={glasses === 0}
                        >
                            <Ionicons name="remove-circle" size={40} color={glasses === 0 ? 'rgba(255,255,255,0.3)' : '#fff'} />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={addGlass}
                            style={[styles.button, styles.addButton]}
                            disabled={glasses >= dailyGoal}
                        >
                            <Ionicons
                                name="add-circle"
                                size={48}
                                color={glasses >= dailyGoal ? 'rgba(255,255,255,0.3)' : '#fff'}
                            />
                        </TouchableOpacity>

                        <View style={styles.button} />
                    </View>

                    {glasses >= dailyGoal && (
                        <Text style={styles.completeText}>Great job! You hit your goal! 🎉</Text>
                    )}
                </View>
            </LinearGradient>

            {/* Water Splash Celebration Effect */}
            <WaterSplashEffect show={showSplash} />

            {/* Goal Settings Modal */}
            <Modal
                visible={showGoalModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowGoalModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <LinearGradient
                            colors={['#3b82f6', '#2563eb']}
                            style={styles.modalGradient}
                        >
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={styles.modalHeader}>
                                    <Ionicons name="water" size={40} color="#fff" />
                                    <Text style={styles.modalTitle}>Set Daily Water Goal</Text>
                                </View>

                                <View style={styles.infoBox}>
                                    <Text style={styles.infoTitle}>💡 Hydration Guide</Text>
                                    <Text style={styles.infoText}>
                                        • Standard recommendation: 8 glasses (64 oz) per day
                                    </Text>
                                    <Text style={styles.infoText}>
                                        • Active individuals: 10-12 glasses (80-96 oz)
                                    </Text>
                                    <Text style={styles.infoText}>
                                        • Athletes/Intense workouts: 12-15 glasses (96-120 oz)
                                    </Text>
                                    <Text style={styles.infoText}>
                                        • Each glass = {OZ_PER_GLASS} oz (240 ml)
                                    </Text>
                                </View>

                                <View style={styles.inputContainer}>
                                    <Text style={styles.inputLabel}>Number of Glasses Per Day</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={tempGoal}
                                        onChangeText={setTempGoal}
                                        keyboardType="number-pad"
                                        placeholder="8"
                                        placeholderTextColor="rgba(255,255,255,0.5)"
                                        maxLength={2}
                                    />
                                    <Text style={styles.ozPreview}>
                                        = {(parseInt(tempGoal, 10) || 0) * OZ_PER_GLASS} oz total
                                    </Text>
                                </View>

                                <View style={styles.presetContainer}>
                                    <Text style={styles.presetTitle}>Quick Presets:</Text>
                                    <View style={styles.presetButtons}>
                                        {[
                                            { label: 'Standard', value: 8 },
                                            { label: 'Active', value: 10 },
                                            { label: 'Athlete', value: 12 },
                                        ].map((preset) => (
                                            <TouchableOpacity
                                                key={preset.value}
                                                style={[
                                                    styles.presetButton,
                                                    tempGoal === preset.value.toString() && styles.presetButtonActive,
                                                ]}
                                                onPress={() => {
                                                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                                    setTempGoal(preset.value.toString());
                                                }}
                                            >
                                                <Text style={styles.presetButtonText}>{preset.label}</Text>
                                                <Text style={styles.presetButtonValue}>
                                                    {preset.value} glasses
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>

                                <View style={styles.modalButtons}>
                                    <TouchableOpacity
                                        style={[styles.modalButton, styles.cancelButton]}
                                        onPress={() => {
                                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                                            setShowGoalModal(false);
                                            setTempGoal(dailyGoal.toString());
                                        }}
                                    >
                                        <Text style={styles.cancelButtonText}>Cancel</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.modalButton, styles.saveButton]}
                                        onPress={saveDailyGoal}
                                    >
                                        <Text style={styles.saveButtonText}>Save Goal</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        </LinearGradient>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 24,
    },
    gradient: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        flex: 1,
    },
    settingsButton: {
        padding: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 20,
    },
    content: {
        alignItems: 'center',
    },
    glassCount: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 8,
    },
    ozInfo: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginBottom: 16,
        textAlign: 'center',
    },
    tumblerContainer: {
        width: 180,
        height: 240,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        position: 'relative',
    },
    glassContainer: {
        alignItems: 'center',
    },
    glassRim: {
        width: 130,
        height: 12,
        borderRadius: 65,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        borderBottomWidth: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
        zIndex: 2,
    },
    tumbler: {
        width: 120,
        height: 200,
        borderLeftWidth: 3,
        borderRightWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
        overflow: 'hidden',
        position: 'relative',
        marginTop: -6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    glassBase: {
        width: 140,
        height: 16,
        borderRadius: 70,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        borderTopWidth: 1,
        marginTop: -4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 4,
    },
    waterFill: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
    },
    waterGradient: {
        flex: 1,
        width: '100%',
        height: '100%',
        position: 'relative',
    },
    wave: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 4,
    },
    bubble: {
        position: 'absolute',
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.6)',
    },
    glassShineLeft: {
        position: 'absolute',
        top: 20,
        left: 8,
        width: 25,
        height: 120,
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        borderRadius: 12,
        transform: [{ rotate: '-5deg' }],
    },
    glassReflection: {
        position: 'absolute',
        top: 40,
        right: 12,
        width: 15,
        height: 80,
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 8,
        transform: [{ rotate: '5deg' }],
    },
    percentageBadge: {
        position: 'absolute',
        top: -10,
        right: -10,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    percentageText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2563eb',
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        width: '100%',
    },
    button: {
        width: 48,
        alignItems: 'center',
    },
    addButton: {
        transform: [{ scale: 1.1 }],
    },
    completeText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginTop: 16,
        textAlign: 'center',
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    modalContent: {
        width: '100%',
        maxWidth: 400,
        maxHeight: '85%',
        borderRadius: 24,
        overflow: 'hidden',
    },
    modalGradient: {
        padding: 24,
    },
    modalHeader: {
        alignItems: 'center',
        marginBottom: 24,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 12,
        textAlign: 'center',
    },
    infoBox: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 12,
    },
    infoText: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.9)',
        marginBottom: 6,
        lineHeight: 20,
    },
    inputContainer: {
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 12,
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 12,
        padding: 16,
        fontSize: 18,
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    ozPreview: {
        fontSize: 14,
        color: 'rgba(255, 255, 255, 0.8)',
        marginTop: 8,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    presetContainer: {
        marginBottom: 24,
    },
    presetTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 12,
    },
    presetButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    presetButton: {
        flex: 1,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    presetButtonActive: {
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        borderColor: '#fff',
    },
    presetButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
        marginBottom: 4,
    },
    presetButtonValue: {
        fontSize: 12,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    modalButton: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    saveButton: {
        backgroundColor: '#fff',
    },
    cancelButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2563eb',
    },
});

