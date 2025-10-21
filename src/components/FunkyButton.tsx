import React, { useRef } from 'react';
import { TouchableOpacity, Animated, StyleSheet, Text, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';

interface FunkyButtonProps {
    onPress: () => void;
    title: string;
    colors?: string[];
    style?: ViewStyle;
    icon?: React.ReactNode;
}

export const FunkyButton: React.FC<FunkyButtonProps> = ({
    onPress,
    title,
    colors = ['#667eea', '#764ba2'],
    style,
    icon,
}) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;

    const handlePressIn = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 0.92,
                useNativeDriver: true,
            }),
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(glowAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: false,
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
            Animated.timing(glowAnim, {
                toValue: 0,
                duration: 200,
                useNativeDriver: false,
            }),
        ]).start();
    };

    const rotate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '2deg'],
    });

    const shadowOpacity = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.8],
    });

    return (
        <TouchableOpacity
            activeOpacity={1}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={onPress}
            style={style}
        >
            <Animated.View
                style={[
                    styles.container,
                    {
                        transform: [{ scale: scaleAnim }, { rotate }],
                        shadowOpacity,
                    },
                ]}
            >
                <LinearGradient colors={colors} style={styles.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                    {icon && <>{icon}</>}
                    <Text style={styles.text}>{title}</Text>
                </LinearGradient>
            </Animated.View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 15,
        shadowColor: '#667eea',
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 20,
        elevation: 10,
    },
    gradient: {
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    text: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0,0,0,0.3)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 4,
    },
});

