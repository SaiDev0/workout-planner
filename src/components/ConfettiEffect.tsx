import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

interface ConfettiEffectProps {
    show: boolean;
    onComplete?: () => void;
}

const CONFETTI_COLORS = ['#667eea', '#764ba2', '#f5576c', '#4facfe', '#00f2fe', '#ffd89b', '#19547b'];

export const ConfettiEffect: React.FC<ConfettiEffectProps> = ({ show, onComplete }) => {
    const confettiPieces = useRef(
        Array.from({ length: 50 }).map(() => ({
            translateY: new Animated.Value(-50),
            translateX: new Animated.Value((Math.random() - 0.5) * width),
            rotate: new Animated.Value(0),
            opacity: new Animated.Value(1),
            color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
            size: Math.random() * 8 + 6,
        }))
    ).current;

    useEffect(() => {
        if (show) {
            const animations = confettiPieces.map((piece) =>
                Animated.parallel([
                    Animated.timing(piece.translateY, {
                        toValue: height + 100,
                        duration: 2000 + Math.random() * 1000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(piece.rotate, {
                        toValue: Math.random() * 10,
                        duration: 2000,
                        useNativeDriver: true,
                    }),
                    Animated.timing(piece.opacity, {
                        toValue: 0,
                        duration: 2000,
                        useNativeDriver: true,
                    }),
                ])
            );

            Animated.stagger(30, animations).start(() => {
                if (onComplete) onComplete();
            });
        }
    }, [show]);

    if (!show) return null;

    return (
        <View style={styles.container} pointerEvents="none">
            {confettiPieces.map((piece, index) => (
                <Animated.View
                    key={index}
                    style={[
                        styles.confetti,
                        {
                            backgroundColor: piece.color,
                            width: piece.size,
                            height: piece.size,
                            transform: [
                                { translateX: piece.translateX },
                                { translateY: piece.translateY },
                                {
                                    rotate: piece.rotate.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: ['0deg', '360deg'],
                                    }),
                                },
                            ],
                            opacity: piece.opacity,
                        },
                    ]}
                />
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
    },
    confetti: {
        position: 'absolute',
        borderRadius: 2,
        top: 0,
        left: width / 2,
    },
});

