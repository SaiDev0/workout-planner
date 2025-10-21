import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

interface WaterSplashEffectProps {
    show: boolean;
}

export const WaterSplashEffect: React.FC<WaterSplashEffectProps> = ({ show }) => {
    const droplets = useRef(
        Array.from({ length: 30 }, () => ({
            translateY: useRef(new Animated.Value(-50)).current,
            translateX: useRef(new Animated.Value(0)).current,
            opacity: useRef(new Animated.Value(1)).current,
            scale: useRef(new Animated.Value(1)).current,
            left: Math.random() * width,
            size: Math.random() * 20 + 15,
            duration: Math.random() * 1500 + 1500,
            delay: Math.random() * 400,
            rotation: Math.random() * 360,
        }))
    ).current;

    useEffect(() => {
        if (show) {
            // Animate all droplets
            droplets.forEach((droplet) => {
                // Reset values
                droplet.translateY.setValue(-50);
                droplet.translateX.setValue(0);
                droplet.opacity.setValue(1);
                droplet.scale.setValue(1);

                // Start animations
                Animated.parallel([
                    // Fall down
                    Animated.timing(droplet.translateY, {
                        toValue: height + 100,
                        duration: droplet.duration,
                        delay: droplet.delay,
                        useNativeDriver: true,
                    }),
                    // Slight horizontal movement
                    Animated.timing(droplet.translateX, {
                        toValue: (Math.random() - 0.5) * 100,
                        duration: droplet.duration,
                        delay: droplet.delay,
                        useNativeDriver: true,
                    }),
                    // Fade out
                    Animated.timing(droplet.opacity, {
                        toValue: 0,
                        duration: droplet.duration * 0.8,
                        delay: droplet.delay + droplet.duration * 0.2,
                        useNativeDriver: true,
                    }),
                    // Splash effect (grow slightly then shrink)
                    Animated.sequence([
                        Animated.timing(droplet.scale, {
                            toValue: 1.3,
                            duration: droplet.duration * 0.3,
                            delay: droplet.delay,
                            useNativeDriver: true,
                        }),
                        Animated.timing(droplet.scale, {
                            toValue: 0.5,
                            duration: droplet.duration * 0.7,
                            useNativeDriver: true,
                        }),
                    ]),
                ]).start();
            });
        }
    }, [show]);

    if (!show) return null;

    return (
        <View style={styles.container} pointerEvents="none">
            {droplets.map((droplet, index) => (
                <Animated.View
                    key={index}
                    style={[
                        styles.droplet,
                        {
                            left: droplet.left,
                            width: droplet.size,
                            height: droplet.size * 1.3, // Teardrop shape
                            transform: [
                                { translateY: droplet.translateY },
                                { translateX: droplet.translateX },
                                { scale: droplet.scale },
                                { rotate: `${droplet.rotation}deg` },
                            ],
                            opacity: droplet.opacity,
                        },
                    ]}
                >
                    {/* Water droplet shape */}
                    <View style={styles.dropletInner} />

                    {/* Splash ripple effect */}
                    {index % 3 === 0 && (
                        <View style={styles.ripple} />
                    )}
                </Animated.View>
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
    droplet: {
        position: 'absolute',
        top: 0,
        borderRadius: 100,
        backgroundColor: 'rgba(96, 165, 250, 0.7)',
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
    },
    dropletInner: {
        flex: 1,
        borderRadius: 100,
        backgroundColor: 'rgba(147, 197, 253, 0.3)',
        margin: 3,
    },
    ripple: {
        position: 'absolute',
        bottom: -5,
        left: -5,
        right: -5,
        height: 10,
        borderRadius: 50,
        backgroundColor: 'rgba(191, 219, 254, 0.5)',
        borderWidth: 2,
        borderColor: 'rgba(96, 165, 250, 0.6)',
    },
});

