import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Modal,
    StyleSheet,
    Vibration,
    ImageBackground,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Notifications from 'expo-notifications';

interface TimerProps {
    visible: boolean;
    duration: number; // in seconds
    exerciseName: string;
    onClose: () => void;
    onComplete: () => void;
}

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

export const Timer: React.FC<TimerProps> = ({
    visible,
    duration,
    exerciseName,
    onClose,
    onComplete,
}) => {
    const [timeRemaining, setTimeRemaining] = useState(duration);
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (visible) {
            setTimeRemaining(duration);
            setIsRunning(false);
            setIsPaused(false);
        }
    }, [visible, duration]);

    useEffect(() => {
        if (isRunning && timeRemaining > 0) {
            intervalRef.current = setInterval(() => {
                setTimeRemaining((prev) => {
                    if (prev <= 1) {
                        handleTimerComplete();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isRunning, timeRemaining]);

    const handleTimerComplete = async () => {
        setIsRunning(false);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Vibration.vibrate([0, 500, 200, 500]);

        await Notifications.scheduleNotificationAsync({
            content: {
                title: '🎉 Timer Complete!',
                body: `Great job completing ${exerciseName}!`,
                sound: true,
            },
            trigger: null,
        });

        setTimeout(() => {
            onComplete();
        }, 1000);
    };

    const handleStartPause = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        if (isRunning) {
            setIsRunning(false);
            setIsPaused(true);
        } else {
            setIsRunning(true);
            setIsPaused(false);
        }
    };

    const handleReset = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setTimeRemaining(duration);
        setIsRunning(false);
        setIsPaused(false);
    };

    const handleClose = () => {
        setIsRunning(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        onClose();
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = ((duration - timeRemaining) / duration) * 100;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={true}
            onRequestClose={handleClose}
        >
            <ImageBackground
                source={require('../assets/images/timer-bg.jpg')}
                style={styles.modalContainer}
                imageStyle={styles.backgroundImage}
            >
                <LinearGradient
                    colors={['rgba(102, 126, 234, 0.85)', 'rgba(118, 75, 162, 0.85)']}
                    style={styles.gradient}
                >
                    <View style={styles.header}>
                        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                            <Ionicons name="close" size={32} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.content}>
                        <Text style={styles.exerciseName}>{exerciseName}</Text>

                        <View style={styles.timerContainer}>
                            <View style={styles.progressRing}>
                                <View
                                    style={[
                                        styles.progressFill,
                                        { height: `${progress}%` },
                                    ]}
                                />
                            </View>
                            <Text style={styles.timerText}>{formatTime(timeRemaining)}</Text>
                        </View>

                        <View style={styles.controls}>
                            <TouchableOpacity
                                onPress={handleReset}
                                style={styles.controlButton}
                            >
                                <Ionicons name="refresh" size={32} color="#fff" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleStartPause}
                                style={styles.mainControlButton}
                            >
                                <Ionicons
                                    name={isRunning ? 'pause' : 'play'}
                                    size={48}
                                    color="#fff"
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleTimerComplete}
                                style={styles.controlButton}
                            >
                                <Ionicons name="checkmark" size={32} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </LinearGradient>
            </ImageBackground>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
    },
    backgroundImage: {
        resizeMode: 'cover',
    },
    gradient: {
        flex: 1,
    },
    header: {
        paddingTop: 60,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    closeButton: {
        padding: 8,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    exerciseName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 60,
    },
    timerContainer: {
        width: 280,
        height: 280,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 80,
        position: 'relative',
    },
    progressRing: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 140,
        overflow: 'hidden',
    },
    progressFill: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    timerText: {
        fontSize: 72,
        fontWeight: 'bold',
        color: '#fff',
        textShadowColor: 'rgba(0, 0, 0, 0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
    controls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 30,
    },
    controlButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    mainControlButton: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

