import React, { useEffect, useRef } from 'react';
import {
    Modal,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    Platform,
    Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

interface ExerciseDemoProps {
    visible: boolean;
    exerciseName: string;
    onClose: () => void;
}

// Animated Exercise Visualization Component
const ExerciseAnimation: React.FC<{ type: string }> = ({ type }) => {
    const animation = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animate = Animated.loop(
            Animated.sequence([
                Animated.timing(animation, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(animation, {
                    toValue: 0,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        );
        animate.start();
        return () => animate.stop();
    }, []);

    // Animation interpolations for different exercise types
    const renderAnimation = () => {
        switch (type) {
            case 'vertical': // Pull-ups, Lat Pulldown
                const verticalY = animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -40],
                });
                return (
                    <View style={animStyles.container}>
                        <View style={animStyles.bar} />
                        <Animated.View style={[animStyles.person, { transform: [{ translateY: verticalY }] }]}>
                            <View style={animStyles.head} />
                            <View style={animStyles.body} />
                            <View style={animStyles.arms} />
                        </Animated.View>
                        <Ionicons name="arrow-up" size={20} color="#667eea" style={animStyles.arrow} />
                    </View>
                );

            case 'push': // Push-ups, Bench Press
                const pushScale = animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0.85],
                });
                return (
                    <View style={animStyles.container}>
                        <Animated.View style={[animStyles.person, { transform: [{ scaleY: pushScale }] }]}>
                            <View style={animStyles.head} />
                            <View style={animStyles.body} />
                            <View style={animStyles.arms} />
                        </Animated.View>
                        <Ionicons name="arrow-down" size={20} color="#667eea" style={animStyles.arrowDown} />
                    </View>
                );

            case 'squat': // Squats, Leg Press
                const squatY = animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 30],
                });
                return (
                    <View style={animStyles.container}>
                        <Animated.View style={[animStyles.person, { transform: [{ translateY: squatY }] }]}>
                            <View style={animStyles.head} />
                            <View style={animStyles.body} />
                            <View style={[animStyles.legs, { height: 40 }]} />
                        </Animated.View>
                        <Ionicons name="arrow-down" size={20} color="#667eea" style={animStyles.arrowDown} />
                    </View>
                );

            case 'curl': // Bicep Curl, etc.
                const curlRotate = animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '-90deg'],
                });
                return (
                    <View style={animStyles.container}>
                        <View style={animStyles.person}>
                            <View style={animStyles.head} />
                            <View style={animStyles.body} />
                            <Animated.View style={[animStyles.arm, { transform: [{ rotate: curlRotate }] }]}>
                                <View style={animStyles.dumbbell} />
                            </Animated.View>
                        </View>
                        <Ionicons name="arrow-up" size={20} color="#667eea" style={animStyles.arrow} />
                    </View>
                );

            case 'row': // Seated Row
                const rowX = animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -30],
                });
                return (
                    <View style={animStyles.container}>
                        <View style={animStyles.person}>
                            <View style={animStyles.head} />
                            <View style={animStyles.body} />
                            <Animated.View style={[animStyles.arms, { transform: [{ translateX: rowX }] }]} />
                        </View>
                        <Ionicons name="arrow-back" size={20} color="#667eea" style={animStyles.arrowSide} />
                    </View>
                );

            default: // Generic movement
                const genericRotate = animation.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '10deg'],
                });
                return (
                    <View style={animStyles.container}>
                        <Animated.View style={[animStyles.person, { transform: [{ rotate: genericRotate }] }]}>
                            <View style={animStyles.head} />
                            <View style={animStyles.body} />
                            <View style={animStyles.arms} />
                        </Animated.View>
                    </View>
                );
        }
    };

    return <View style={animStyles.animationBox}>{renderAnimation()}</View>;
};

const animStyles = StyleSheet.create({
    animationBox: {
        height: 150,
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        borderRadius: 15,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(102, 126, 234, 0.3)',
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    bar: {
        width: 80,
        height: 4,
        backgroundColor: '#667eea',
        borderRadius: 2,
        position: 'absolute',
        top: 0,
    },
    person: {
        alignItems: 'center',
    },
    head: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#667eea',
        marginBottom: 4,
    },
    body: {
        width: 30,
        height: 40,
        backgroundColor: '#667eea',
        borderRadius: 8,
        marginBottom: 4,
    },
    arms: {
        width: 50,
        height: 8,
        backgroundColor: '#667eea',
        borderRadius: 4,
    },
    arm: {
        width: 25,
        height: 8,
        backgroundColor: '#667eea',
        borderRadius: 4,
        position: 'absolute',
        left: -10,
        top: 30,
    },
    legs: {
        width: 30,
        height: 35,
        backgroundColor: '#667eea',
        borderRadius: 6,
    },
    dumbbell: {
        width: 10,
        height: 10,
        backgroundColor: '#f5576c',
        borderRadius: 5,
        position: 'absolute',
        right: -12,
        top: -1,
    },
    arrow: {
        position: 'absolute',
        right: -30,
        top: 40,
    },
    arrowDown: {
        position: 'absolute',
        bottom: -30,
    },
    arrowSide: {
        position: 'absolute',
        left: -30,
    },
});

// Exercise demonstration data
const exerciseGuides: { [key: string]: any } = {
    'Lat Pulldown': {
        icon: '💪',
        animationType: 'vertical',
        muscles: 'Back, Lats, Biceps',
        steps: [
            'Sit at pulldown machine, grip bar wider than shoulders',
            'Pull bar down to chest level, lean slightly back',
            'Squeeze shoulder blades together at bottom',
            'Slowly return to starting position with full stretch',
        ],
        tips: 'Keep core tight. Don\'t use momentum. Focus on back muscles.',
    },
    'Seated Row': {
        icon: '🚣',
        animationType: 'row',
        muscles: 'Mid Back, Lats, Rhomboids',
        steps: [
            'Sit with feet on platform, knees slightly bent',
            'Grip handles, sit upright with chest out',
            'Pull handles to torso, squeeze shoulder blades',
            'Slowly extend arms back to start',
        ],
        tips: 'Don\'t round your back. Think about pulling your elbows back.',
    },
    'DB Shoulder Press': {
        icon: '🏋️',
        animationType: 'push',
        muscles: 'Shoulders, Triceps',
        steps: [
            'Sit with dumbbells at shoulder height',
            'Press weights overhead until arms are straight',
            'Lower slowly back to shoulders',
            'Keep core engaged throughout',
        ],
        tips: 'Don\'t arch your back. Control the weight on the way down.',
    },
    'DB Bicep Curl': {
        icon: '💪',
        animationType: 'curl',
        muscles: 'Biceps, Forearms',
        steps: [
            'Stand with dumbbells at your sides, palms forward',
            'Curl weights up toward shoulders',
            'Squeeze at the top for 1 second',
            'Lower slowly back to start',
        ],
        tips: 'Keep elbows at your sides. No swinging or momentum.',
    },
    'Triceps Pushdown': {
        icon: '🔻',
        animationType: 'push',
        muscles: 'Triceps',
        steps: [
            'Stand at cable machine, grip bar overhead',
            'Push bar down until arms are fully extended',
            'Squeeze triceps at bottom',
            'Slowly return to start position',
        ],
        tips: 'Keep elbows close to body. Don\'t lean forward.',
    },
    'Barbell Squat': {
        icon: '🦵',
        animationType: 'squat',
        muscles: 'Quads, Glutes, Hamstrings',
        steps: [
            'Bar on upper back, feet shoulder-width apart',
            'Lower hips back and down, chest up',
            'Squat until thighs parallel to ground',
            'Drive through heels to stand back up',
        ],
        tips: 'Keep knees tracking over toes. Don\'t let knees cave in.',
    },
    'Romanian Deadlift': {
        icon: '🏋️‍♂️',
        animationType: 'squat',
        muscles: 'Hamstrings, Lower Back, Glutes',
        steps: [
            'Hold barbell in front of thighs, feet hip-width',
            'Hinge at hips, lower bar down legs',
            'Feel stretch in hamstrings',
            'Drive hips forward to return to standing',
        ],
        tips: 'Keep back straight. Feel the stretch in hamstrings.',
    },
    'Leg Press': {
        icon: '🦿',
        animationType: 'squat',
        muscles: 'Quads, Glutes, Hamstrings',
        steps: [
            'Sit in machine, feet on platform shoulder-width',
            'Lower weight by bending knees',
            'Push through heels to extend legs',
            'Don\'t lock knees at top',
        ],
        tips: 'Full range of motion. Keep lower back against pad.',
    },
    'Incline BB Press': {
        icon: '🏋️',
        animationType: 'push',
        muscles: 'Upper Chest, Shoulders, Triceps',
        steps: [
            'Lie on incline bench (30-45 degrees)',
            'Lower bar to upper chest',
            'Press bar up until arms extended',
            'Control the weight on the way down',
        ],
        tips: 'Don\'t bounce bar off chest. Keep feet planted.',
    },
    'Arnold Press': {
        icon: '💪',
        animationType: 'push',
        muscles: 'Shoulders, Deltoids',
        steps: [
            'Start with dumbbells at shoulders, palms facing you',
            'Rotate palms forward while pressing overhead',
            'Reverse the motion on the way down',
            'Control the rotation throughout',
        ],
        tips: 'Smooth rotation. Don\'t use momentum.',
    },
    'Assisted Pull-ups': {
        icon: '⬆️',
        animationType: 'vertical',
        muscles: 'Back, Lats, Biceps',
        steps: [
            'Set assist weight, grip pull-up bar',
            'Hang with arms extended',
            'Pull yourself up until chin over bar',
            'Lower yourself slowly',
        ],
        tips: 'Focus on pulling with your back, not just arms.',
    },
    'Face Pulls': {
        icon: '🎭',
        animationType: 'row',
        muscles: 'Rear Delts, Upper Back',
        steps: [
            'Set cable at face height with rope attachment',
            'Pull rope toward face, split the rope',
            'Squeeze shoulder blades together',
            'Slowly return to start',
        ],
        tips: 'Keep elbows high. Focus on rear deltoids.',
    },
    'Plank': {
        icon: '🧘',
        animationType: 'generic',
        muscles: 'Core, Abs, Shoulders',
        steps: [
            'Forearms on ground, elbows under shoulders',
            'Extend legs, balance on toes',
            'Keep body in straight line',
            'Hold position, breathe steadily',
        ],
        tips: 'Don\'t let hips sag. Engage core throughout.',
    },
    'Warm Up': {
        icon: '🏃',
        animationType: 'generic',
        muscles: 'Cardiovascular, Full Body',
        steps: [
            'Start at comfortable walking pace',
            'Gradually increase speed',
            'Maintain steady rhythm',
            'Breathe normally throughout',
        ],
        tips: 'Warm up muscles to prevent injury. Don\'t skip this!',
    },
    'Cardio': {
        icon: '❤️',
        animationType: 'generic',
        muscles: 'Cardiovascular',
        steps: [
            'Maintain steady walking/jogging pace',
            'Keep heart rate elevated',
            'Focus on breathing',
            'Cool down gradually',
        ],
        tips: 'Good for fat burning and heart health.',
    },
};

export const ExerciseDemo: React.FC<ExerciseDemoProps> = ({
    visible,
    exerciseName,
    onClose,
}) => {
    const guide = exerciseGuides[exerciseName] || {
        icon: '💪',
        muscles: 'Multiple muscle groups',
        steps: ['Perform exercise as instructed', 'Maintain proper form', 'Breathe steadily'],
        tips: 'Focus on form over weight. Start light if unsure.',
    };

    const handleClose = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={handleClose}
        >
            <View style={styles.modalContainer}>
                <LinearGradient
                    colors={['#1a1a2e', '#16213e']}
                    style={styles.modalContent}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <Text style={styles.icon}>{guide.icon}</Text>
                            <View>
                                <Text style={styles.title}>{exerciseName}</Text>
                                <Text style={styles.muscles}>Targets: {guide.muscles}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
                            <Ionicons name="close-circle" size={32} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        {/* Animated Exercise Demonstration */}
                        {guide.animationType && <ExerciseAnimation type={guide.animationType} />}

                        {/* How to Perform */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Ionicons name="fitness" size={20} color="#667eea" />
                                <Text style={styles.sectionTitle}>How to Perform</Text>
                            </View>
                            {guide.steps.map((step: string, index: number) => (
                                <View key={index} style={styles.stepContainer}>
                                    <View style={styles.stepNumber}>
                                        <Text style={styles.stepNumberText}>{index + 1}</Text>
                                    </View>
                                    <Text style={styles.stepText}>{step}</Text>
                                </View>
                            ))}
                        </View>

                        {/* Pro Tips */}
                        <View style={styles.section}>
                            <View style={styles.sectionHeader}>
                                <Ionicons name="bulb" size={20} color="#f5576c" />
                                <Text style={styles.sectionTitle}>Pro Tips</Text>
                            </View>
                            <View style={styles.tipBox}>
                                <Text style={styles.tipText}>{guide.tips}</Text>
                            </View>
                        </View>

                        {/* Safety Note */}
                        <View style={styles.safetyBox}>
                            <Ionicons name="shield-checkmark" size={24} color="#4facfe" />
                            <Text style={styles.safetyText}>
                                Start with lighter weight to master form. Increase gradually.
                            </Text>
                        </View>
                    </ScrollView>

                    <TouchableOpacity onPress={handleClose} style={styles.gotItButton}>
                        <LinearGradient
                            colors={['#667eea', '#764ba2']}
                            style={styles.gotItGradient}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                        >
                            <Text style={styles.gotItText}>Got it! 💪</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        height: '85%',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingTop: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    icon: {
        fontSize: 50,
        marginRight: 15,
    },
    title: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    muscles: {
        color: '#888',
        fontSize: 14,
    },
    closeButton: {
        padding: 5,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    section: {
        marginBottom: 25,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    sectionTitle: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    stepContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 15,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 12,
        padding: 12,
    },
    stepNumber: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#667eea',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        marginTop: 2,
    },
    stepNumberText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    stepText: {
        color: '#fff',
        fontSize: 15,
        lineHeight: 22,
        flex: 1,
    },
    tipBox: {
        backgroundColor: 'rgba(245, 87, 108, 0.1)',
        borderLeftWidth: 3,
        borderLeftColor: '#f5576c',
        borderRadius: 8,
        padding: 15,
    },
    tipText: {
        color: '#fff',
        fontSize: 15,
        lineHeight: 22,
    },
    safetyBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(79, 172, 254, 0.1)',
        borderRadius: 12,
        padding: 15,
        marginTop: 10,
    },
    safetyText: {
        color: '#4facfe',
        fontSize: 14,
        marginLeft: 12,
        flex: 1,
    },
    gotItButton: {
        marginHorizontal: 20,
        marginTop: 15,
        borderRadius: 15,
        overflow: 'hidden',
    },
    gotItGradient: {
        paddingVertical: 16,
        alignItems: 'center',
    },
    gotItText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

