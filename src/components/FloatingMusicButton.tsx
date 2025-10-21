import React, { useState } from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    Linking,
    Alert,
    Animated,
    Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

export const FloatingMusicButton: React.FC = () => {
    const [scaleAnim] = useState(new Animated.Value(1));

    const openYouTubeMusic = async () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

        // Animate button press
        Animated.sequence([
            Animated.timing(scaleAnim, {
                toValue: 0.9,
                duration: 100,
                useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
                toValue: 1,
                duration: 100,
                useNativeDriver: true,
            }),
        ]).start();

        // Try to open YouTube Music
        const urls = {
            ios: 'youtube-music://',
            android: 'vnd.youtube.music://',
            fallback: 'https://music.youtube.com',
        };

        const url = Platform.OS === 'ios' ? urls.ios : urls.android;

        try {
            const canOpen = await Linking.canOpenURL(url);
            if (canOpen) {
                await Linking.openURL(url);
            } else {
                // Fallback to web version
                Alert.alert(
                    '🎵 YouTube Music',
                    'YouTube Music app not found. Open in browser?',
                    [
                        {
                            text: 'Cancel',
                            style: 'cancel',
                        },
                        {
                            text: 'Open Browser',
                            onPress: () => Linking.openURL(urls.fallback),
                        },
                    ]
                );
            }
        } catch (error) {
            console.error('Error opening YouTube Music:', error);
            Alert.alert(
                '🎵 YouTube Music',
                'Open YouTube Music in browser?',
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    {
                        text: 'Open',
                        onPress: () => Linking.openURL(urls.fallback),
                    },
                ]
            );
        }
    };

    return (
        <Animated.View style={[styles.container, { transform: [{ scale: scaleAnim }] }]}>
            <TouchableOpacity
                onPress={openYouTubeMusic}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={['#FF0000', '#CC0000']}
                    style={styles.button}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Ionicons
                        name="musical-notes"
                        size={28}
                        color="#fff"
                    />
                </LinearGradient>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 30,
        right: 20,
        zIndex: 1000,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    button: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
});

