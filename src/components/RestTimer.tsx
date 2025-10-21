import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface RestTimerProps {
    visible: boolean;
    onClose: () => void;
}

const REST_DURATIONS = [30, 60, 90, 120]; // seconds

export const RestTimer: React.FC<RestTimerProps> = ({ visible, onClose }) => {
    const [selectedDuration, setSelectedDuration] = useState(60);
    const [timeRemaining, setTimeRemaining] = useState(60);
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRunning && timeRemaining > 0) {
            interval = setInterval(() => {
                setTimeRemaining((prev) => {
                    if (prev <= 1) {
                        setIsRunning(false);
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning, timeRemaining]);

    useEffect(() => {
        if (visible) {
            setTimeRemaining(selectedDuration);
            setIsRunning(false);
        }
    }, [visible, selectedDuration]);

    const handleSelectDuration = (duration: number) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedDuration(duration);
        setTimeRemaining(duration);
        setIsRunning(false);
    };

    const toggleTimer = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setIsRunning(!isRunning);
    };

    const handleSkip = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setIsRunning(false);
        onClose();
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = ((selectedDuration - timeRemaining) / selectedDuration) * 100;

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <LinearGradient
                        colors={['#34d399', '#10b981']}
                        style={styles.gradient}
                    >
                        <View style={styles.header}>
                            <Text style={styles.title}>Rest Timer ⏱️</Text>
                            <TouchableOpacity onPress={handleSkip}>
                                <Ionicons name="close-circle" size={32} color="#fff" />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.durationSelector}>
                            {REST_DURATIONS.map((duration) => (
                                <TouchableOpacity
                                    key={duration}
                                    onPress={() => handleSelectDuration(duration)}
                                    style={[
                                        styles.durationButton,
                                        selectedDuration === duration && styles.durationButtonActive,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.durationText,
                                            selectedDuration === duration && styles.durationTextActive,
                                        ]}
                                    >
                                        {duration}s
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.timerDisplay}>
                            <View style={styles.progressRing}>
                                <View style={[styles.progressFill, { height: `${progress}%` }]} />
                            </View>
                            <Text style={styles.timeText}>{formatTime(timeRemaining)}</Text>
                        </View>

                        <TouchableOpacity
                            onPress={toggleTimer}
                            style={styles.playButton}
                        >
                            <Ionicons
                                name={isRunning ? 'pause-circle' : 'play-circle'}
                                size={80}
                                color="#fff"
                            />
                        </TouchableOpacity>

                        {timeRemaining === 0 && (
                            <Text style={styles.doneText}>Rest Complete! Let's go! 💪</Text>
                        )}
                    </LinearGradient>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '85%',
        borderRadius: 24,
        overflow: 'hidden',
    },
    gradient: {
        padding: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    durationSelector: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 32,
    },
    durationButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    durationButtonActive: {
        backgroundColor: '#fff',
    },
    durationText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    durationTextActive: {
        color: '#10b981',
    },
    timerDisplay: {
        alignItems: 'center',
        marginBottom: 32,
        position: 'relative',
    },
    progressRing: {
        width: 200,
        height: 200,
        borderRadius: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        overflow: 'hidden',
        position: 'absolute',
    },
    progressFill: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    timeText: {
        fontSize: 64,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 70,
    },
    playButton: {
        alignItems: 'center',
        marginTop: 16,
    },
    doneText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        textAlign: 'center',
        marginTop: 16,
    },
});

