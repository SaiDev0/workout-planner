import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';

interface SplashEffectProps {
    x: number;
    y: number;
    color?: string;
    onComplete: () => void;
}

export const SplashEffect: React.FC<SplashEffectProps> = ({ x, y, color = '#667eea', onComplete }) => {
    const splashes = useRef(
        Array.from({ length: 8 }).map(() => ({
            scale: new Animated.Value(0),
            opacity: new Animated.Value(1),
            translateX: new Animated.Value(0),
            translateY: new Animated.Value(0),
        }))
    ).current;

    useEffect(() => {
        const animations = splashes.map((splash, index) => {
            const angle = (index * Math.PI * 2) / 8;
            const distance = 50;

            return Animated.parallel([
                Animated.timing(splash.scale, {
                    toValue: 1,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(splash.opacity, {
                    toValue: 0,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(splash.translateX, {
                    toValue: Math.cos(angle) * distance,
                    duration: 400,
                    useNativeDriver: true,
                }),
                Animated.timing(splash.translateY, {
                    toValue: Math.sin(angle) * distance,
                    duration: 400,
                    useNativeDriver: true,
                }),
            ]);
        });

        Animated.parallel(animations).start(() => {
            onComplete();
        });
    }, []);

    return (
        <View style={[styles.container, { left: x - 15, top: y - 15 }]}>
            {splashes.map((splash, index) => (
                <Animated.View
                    key={index}
                    style={[
                        styles.splash,
                        {
                            backgroundColor: color,
                            transform: [
                                { scale: splash.scale },
                                { translateX: splash.translateX },
                                { translateY: splash.translateY },
                            ],
                            opacity: splash.opacity,
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
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
    },
    splash: {
        position: 'absolute',
        width: 15,
        height: 15,
        borderRadius: 7.5,
    },
});

