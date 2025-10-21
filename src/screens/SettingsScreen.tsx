import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface SettingsScreenProps {
    onBack: () => void;
    onEditWorkouts: () => void;
    onManageDays: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack, onEditWorkouts, onManageDays }) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#0f172a', '#1e293b']} style={styles.gradient}>
                {/* Header */}
                <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
                    <TouchableOpacity onPress={onBack} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={28} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Settings ⚙️</Text>
                    <View style={{ width: 44 }} />
                </View>

                <ScrollView style={styles.scrollView}>
                    {/* Workout Management Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Workout Management</Text>

                        <TouchableOpacity
                            style={styles.settingCard}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                onEditWorkouts();
                            }}
                        >
                            <LinearGradient
                                colors={['rgba(102, 126, 234, 0.2)', 'rgba(118, 75, 162, 0.2)']}
                                style={styles.settingGradient}
                            >
                                <View style={styles.settingLeft}>
                                    <View style={styles.iconContainer}>
                                        <Ionicons name="create-outline" size={24} color="#667eea" />
                                    </View>
                                    <View>
                                        <Text style={styles.settingTitle}>Edit Workouts</Text>
                                        <Text style={styles.settingDesc}>
                                            Customize your workout program
                                        </Text>
                                    </View>
                                </View>
                                <Ionicons name="chevron-forward" size={24} color="#667eea" />
                            </LinearGradient>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.settingCard}
                            onPress={() => {
                                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                                onManageDays();
                            }}
                        >
                            <LinearGradient
                                colors={['rgba(77, 172, 254, 0.2)', 'rgba(0, 242, 254, 0.2)']}
                                style={styles.settingGradient}
                            >
                                <View style={styles.settingLeft}>
                                    <View style={styles.iconContainer}>
                                        <Ionicons name="calendar-outline" size={24} color="#4facfe" />
                                    </View>
                                    <View>
                                        <Text style={styles.settingTitle}>Manage Workout Days</Text>
                                        <Text style={styles.settingDesc}>
                                            Choose which days you work out
                                        </Text>
                                    </View>
                                </View>
                                <Ionicons name="chevron-forward" size={24} color="#4facfe" />
                            </LinearGradient>
                        </TouchableOpacity>

                        <View style={styles.infoBox}>
                            <Ionicons name="information-circle" size={20} color="#667eea" />
                            <Text style={styles.infoText}>
                                Customize your workout schedule and exercises. Choose which days to work out and
                                assign workouts to each day. All changes are saved automatically.
                            </Text>
                        </View>
                    </View>

                    {/* App Info */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>About</Text>
                        <View style={styles.infoCard}>
                            <Text style={styles.appName}>💪 Workout Planner</Text>
                            <Text style={styles.version}>Version 1.0.0</Text>
                            <Text style={styles.description}>
                                Your personal workout tracking app with animated demonstrations and progress
                                tracking.
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
    header: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    scrollView: {
        flex: 1,
    },
    section: {
        padding: 20,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    settingCard: {
        marginBottom: 16,
        borderRadius: 16,
        overflow: 'hidden',
    },
    settingGradient: {
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: 'rgba(102, 126, 234, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    settingTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    settingDesc: {
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: 14,
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(102, 126, 234, 0.3)',
    },
    infoText: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
        marginLeft: 12,
        flex: 1,
        lineHeight: 20,
    },
    infoCard: {
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    appName: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    version: {
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: 14,
        marginBottom: 12,
    },
    description: {
        color: 'rgba(255, 255, 255, 0.8)',
        fontSize: 14,
        lineHeight: 20,
    },
});

