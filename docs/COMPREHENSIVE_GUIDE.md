# 💪 Workout Planner App - Complete Guide

A beautiful personal workout tracking app built with React Native and Expo.

---

## 📋 Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [Usage](#usage)
4. [Workout Program](#workout-program)
5. [Technical Details](#technical-details)
6. [Customization](#customization)
7. [Troubleshooting](#troubleshooting)

---

## ✨ Features

### Core Features
- 📅 **4-Day Workout Program** - Monday through Thursday with rest days
- ✅ **Exercise Tracking** - Check off exercises as you complete them
- ⏱️ **Built-in Timers** - Exercise timer and rest timer (30s-120s)
- 🔔 **Notifications** - Get alerted when timers complete
- 💾 **Auto-Save Progress** - All data saved locally on your device
- 🎨 **Beautiful UI** - Gradient backgrounds and smooth animations

### Advanced Features
- 💬 **Daily Motivational Quotes** - Fitness inspiration using free ZenQuotes API
- 💧 **Water Intake Tracker** - Track 8 glasses per day with visual progress
- 📊 **Weekly Statistics** - Track workouts completed, exercises done, and streaks
- 📈 **7-Day Activity Chart** - Visual history of your workout week
- 🔥 **Streak Counter** - Track consecutive workout days with pulsing animation
- 🎵 **YouTube Music Integration** - One-tap access to your workout music
- 📸 **Exercise Demonstrations** - Animated visual guides for proper form
- ℹ️ **Exercise Instructions** - Detailed step-by-step guides with pro tips

### Design Features
- 🌈 **Unique Day Gradients** - Each workout day has its own color scheme
- ✨ **Smooth Animations** - Pulsing badges, bouncing buttons, scale transitions
- 😎 **Fun Emojis** - Throughout the app for motivation
- 💪 **3D Effects** - Deep shadows and dramatic blur effects

---

## 📱 Installation

### Quick Start (Development Mode)

1. **Start the Development Server:**
   ```bash
   cd /Users/s0d0fds/Documents/Mini-apps/workout-planner
   npm start
   ```

2. **Run on iOS:**
   ```bash
   npm run ios
   ```

3. **Run on Android:**
   ```bash
   npm run android
   ```

### Build for Your Phone

#### For iOS (Internal Distribution):
```bash
npx eas build --platform ios --profile production
```

**Installation:**
- After build completes, open the link on your iPhone
- Tap "Install" button
- App installs directly to your device
- No App Store or TestFlight needed!

**Note:** Requires EAS Build configured with internal distribution

#### For Android (APK):
```bash
npx eas build --platform android --profile production
```

**Installation:**
1. Open the build link on your Android phone
2. Download the APK
3. Tap to install
4. Allow "Install from Unknown Sources" if prompted
5. Done!

### Using Expo Go (Quick Testing)

1. Install Expo Go from App Store or Google Play
2. Run `npm start --tunnel` on your laptop
3. Scan the QR code with Expo Go
4. App opens instantly!

**Pros:** Fast, easy updates  
**Cons:** Requires Expo Go app and laptop to be running

---

## 🎯 Usage

### Home Screen

**Features:**
- **Motivational Quote** - Daily fitness inspiration at the top
- **Water Tracker** - Tap glasses to track daily hydration (8 glasses goal)
- **Weekly Stats** - See workouts completed, exercises done, and current streak
- **Activity Chart** - Visual 7-day history of your workouts
- **Workout Days** - Four color-coded cards for Monday-Thursday
- **Today Indicator** - Current day is highlighted
- **Progress Bars** - See completion percentage for active workouts

**How to Use:**
1. Read the motivational quote for inspiration
2. Check your weekly stats and streak
3. Add water glasses throughout the day
4. Tap any workout day to start exercising

### Workout Screen

**Features:**
- **Progress Bar** - Real-time completion percentage
- **Exercise List** - All exercises with checkboxes
- **Exercise Details** - Sets, reps, weight, time
- **Info Button (ℹ️)** - Tap to see animated demonstration and instructions
- **Timer Button (⏱️)** - For time-based exercises
- **Rest Timer** - In header for rest between sets
- **Music Button (🎵)** - Floating red button to open YouTube Music
- **Reset Button** - Clear today's progress with confirmation

**How to Use:**
1. Tap the **ℹ️ icon** next to any exercise to see:
   - Animated demonstration of the movement
   - Target muscles
   - Step-by-step instructions
   - Pro tips for proper form
   - Safety reminders
2. Check off exercises as you complete them
3. Use the **music button** to start your workout playlist
4. Use the **rest timer** between sets (30s, 60s, 90s, or 120s)
5. Tap **timer icon** on time-based exercises (cardio, HIIT)
6. Progress saves automatically
7. See completion celebration when done!

### Exercise Demonstrations

**What You Get:**
- **Animated Stick Figures** - Visual representation of the movement
- **Movement Types:**
  - Vertical (Pull-ups, Lat Pulldown) - Up and down motion
  - Push (Shoulder Press, Bench Press) - Pressing motion
  - Squat (Squats, Leg Press) - Squatting motion
  - Curl (Bicep Curls) - Curling motion with dumbbell
  - Row (Seated Row, Face Pulls) - Pulling motion
  - Generic (Plank, Cardio) - Subtle movement

**How to Access:**
1. Go to any workout day
2. Tap the **ℹ️ info button** next to an exercise
3. Watch the looping animation
4. Read the step-by-step instructions
5. Check out the pro tips
6. Close when ready to start

### Timers

**Exercise Timer:**
- For time-based exercises (cardio, HIIT, warm-up)
- Play/pause control
- Visual countdown
- Notification when complete
- Haptic feedback

**Rest Timer:**
- Quick select: 30s, 60s, 90s, 120s
- Play/pause control
- Visual progress indicator
- Haptic feedback
- Green gradient design
- Access from workout screen header

### YouTube Music Integration

**How It Works:**
1. During workout, see floating red music button (bottom-right)
2. Tap button to open YouTube Music app
3. Select your workout playlist
4. Return to app - music keeps playing!
5. Continue tracking exercises with music

**Features:**
- One-tap access
- Deep linking to YouTube Music app
- Fallback to web version if app not installed
- Works with free YouTube Music accounts
- Music plays in background
- Smooth bounce animation

### Water Tracking

**Daily Goal:** 8 glasses

**How to Use:**
- Tap empty glass to add
- Tap filled glass to remove
- Progress bar shows completion
- Resets daily at midnight
- Celebration when goal reached

---

## 🏋️ Workout Program

### Monday - Upper Body Strength + Belly Finisher
1. Warm Up - 5-10 min (treadmill)
2. Lat Pulldown - 3 sets × 10-12 reps
3. Seated Row - 3 sets × 10-12 reps
4. DB Shoulder Press - 3 sets × 10-12 reps
5. DB Bicep Curl - 3 sets × 10-12 reps
6. Triceps Pushdown - 3 sets × 10-12 reps
7. Cardio - 15-20 min
8. Belly Finisher

### Tuesday - Lower Body Strength + Belly Finisher
1. Warm Up - 5-10 min
2. Barbell Squat - 4 sets × 8-10 reps
3. Romanian Deadlift - 3 sets × 10-12 reps
4. Leg Press - 3 sets × 12-15 reps
5. Lying Leg Curls - 3 sets × 12-15 reps
6. Standing Calf Raise - 3 sets × 15-20 reps
7. Glute Plug - 3 sets × 12-15 reps
8. Cardio - 15-20 min
9. Belly Finisher

### Wednesday - Push + Core + Belly Finisher
1. Warm Up - 5-10 min
2. Incline BB Press - 3 sets × 10-12 reps
3. Arnold Press - 3 sets × 10-12 reps
4. Cable Chest Fly - 3 sets × 12-15 reps
5. Lateral Raises - 3 sets × 12-15 reps
6. Rope Pushdown - 3 sets × 12-15 reps
7. Core Work - 3 sets
8. Cardio - 15-20 min
9. Belly Finisher

### Thursday - Pull + HIIT + Belly Finisher
1. Warm Up - 5-10 min
2. Assisted Pull-ups - 3 sets × 8-10 reps
3. Seated Row - 3 sets × 10-12 reps
4. Face Pulls - 3 sets × 12-15 reps
5. Barbell Curl - 3 sets × 10-12 reps
6. Plank - 3 sets × 30-60 sec
7. HIIT Treadmill - 20 min
8. Cooldown - 5 min
9. Belly Finisher

**Rest Days:** Friday, Saturday, Sunday

---

## 🔧 Technical Details

### Technology Stack

**Framework:**
- React Native
- Expo SDK
- TypeScript
- Bun (package manager)

**Key Libraries:**
- `@expo/vector-icons` - Icon library
- `expo-linear-gradient` - Gradient backgrounds
- `expo-notifications` - Push notifications
- `expo-haptics` - Haptic feedback
- `expo-status-bar` - Status bar styling
- `react-native-reanimated` - Smooth animations
- `@react-native-async-storage/async-storage` - Local storage

**APIs (All Free!):**
- ZenQuotes API - Motivational quotes
- Deep Linking - YouTube Music integration

**Native Modules:**
- iOS Info.plist configured for YouTube Music URL schemes
- Notifications permissions
- Haptics support

### Project Structure

```
workout-planner/
├── src/
│   ├── components/
│   │   ├── Timer.tsx                  # Exercise & rest timers
│   │   ├── StatsCard.tsx              # Weekly statistics
│   │   ├── ExerciseDemo.tsx           # Animated exercise guide
│   │   └── FloatingMusicButton.tsx    # YouTube Music button
│   ├── screens/
│   │   ├── HomeScreen.tsx             # Main dashboard
│   │   └── WorkoutScreen.tsx          # Exercise tracking
│   ├── data/
│   │   └── workouts.ts                # Workout program data
│   ├── utils/
│   │   └── storage.ts                 # AsyncStorage utilities
│   └── types/
│       └── workout.ts                 # TypeScript types
├── docs/
│   └── COMPREHENSIVE_GUIDE.md         # This file
├── ios/
│   └── WorkoutPlanner/
│       └── Info.plist                 # iOS configuration
├── App.tsx                            # Root component
├── app.json                           # Expo configuration
├── eas.json                           # Build configuration
├── package.json                       # Dependencies
└── tsconfig.json                      # TypeScript config
```

### Data Storage

**All data is stored locally using AsyncStorage:**
- Workout completion status
- Exercise check-offs
- Water intake count
- Weekly statistics
- Workout streak
- Historical activity data

**Data Privacy:**
- No external servers
- No user tracking
- No analytics
- All data stays on your device
- No internet required (except for quotes API)

### Build Configuration (eas.json)

**Development Profile:**
- For testing on physical devices
- Includes debugging tools
- Fast rebuilds

**Production Profile:**
- Internal distribution for iOS
- Direct installation without App Store
- Optimized build
- Auto-increment build number

**Preview Profile:**
- APK for Android
- Quick testing builds

---

## 🎨 Customization

### Modifying Workouts

Edit `src/data/workouts.ts`:

```typescript
{
  id: 'exercise-1',
  name: 'Your Exercise Name',
  sets: 3,
  reps: '10-12',
  weight: '20-25 lbs',
  time: '15 min', // For cardio
  instructions: 'Detailed instructions here',
  completed: false,
}
```

### Adding New Exercises

1. Open `src/data/workouts.ts`
2. Add new exercise object to the appropriate day
3. Include: name, sets, reps, instructions
4. Save and reload app

### Changing Colors

Edit gradient colors in screen files:
- Monday: Purple gradient
- Tuesday: Pink gradient
- Wednesday: Blue gradient
- Thursday: Orange gradient

### Modifying Timers

Edit default rest timer durations in `WorkoutScreen.tsx`:
```typescript
const restOptions = [30, 60, 90, 120]; // seconds
```

---

## 🆘 Troubleshooting

### Build Issues

**Error: "Cannot find module"**
```bash
rm -rf node_modules
npm install
```

**Build fails on EAS:**
```bash
npx eas build --platform ios --profile production --clear-cache
```

### Installation Issues

**iOS: "Unable to Install"**
- Make sure build profile is set to "internal" distribution
- Check that device is registered in Apple Developer
- Try rebuilding with `--clear-cache`

**Android: "Install from Unknown Sources"**
1. Settings → Security
2. Enable "Install Unknown Apps"
3. Allow for your browser
4. Try installing again

### Runtime Issues

**App crashes on startup:**
- Clear app data
- Reinstall the app
- Check for console errors with `npm start`

**Progress not saving:**
- Grant storage permissions
- Check available device storage
- Reinstall if necessary

**Timer notifications not working:**
- Grant notification permissions
- Check system notification settings
- Test with app in foreground first

**YouTube Music button doesn't work:**
- Install YouTube Music app
- Check iOS Info.plist for URL schemes
- Rebuild app if you modified Info.plist

**Exercise animations not showing:**
- Check that exercise name exactly matches data in workouts.ts
- Animations are defined for main exercises
- Generic animation shows for unlisted exercises

### Performance Issues

**App is slow:**
- Close other apps
- Restart your phone
- Rebuild with production profile

**Animations are laggy:**
- Reduce transparency in phone settings
- Close background apps
- Ensure phone has adequate storage

---

## 💡 Pro Tips

### Workout Tips
- **Check exercises as you go** - Don't wait until the end
- **Use the info button** - Learn proper form before starting
- **Watch the animations** - Visual guide helps with technique
- **Start music first** - Get pumped before your first set
- **Use rest timer** - Consistent rest periods = better gains
- **Track water intake** - Stay hydrated between sets
- **Review weekly stats** - See your progress and stay motivated
- **Maintain your streak** - Consistency is key!

### App Usage Tips
- **Add to home screen** - Quick access before workouts
- **Keep phone charged** - Don't let battery die mid-workout
- **Use landscape mode** - Better view of exercise instructions
- **Enable notifications** - Get alerted when timers complete
- **Screenshot stats** - Track long-term progress
- **Reset thoughtfully** - Only reset if you really need to start over

### Music Tips
- **Create workout playlists** - Different energy for different days
- **Start music before opening app** - Then return to app
- **Use offline playlists** - Save data and ensure playback
- **Match tempo to workout** - Faster for HIIT, slower for strength

### Customization Tips
- **Adjust rest times** - Find what works for your fitness level
- **Modify exercises** - Edit workouts.ts for your program
- **Add notes** - Include personal records in instructions
- **Take progress photos** - External tracking alongside app

---

## 📊 Features at a Glance

| Feature | Description | Location |
|---------|-------------|----------|
| 4-Day Program | Monday-Thursday workouts | Home Screen |
| Exercise Tracking | Check off as you complete | Workout Screen |
| Exercise Demos | Animated visual guides | Info button (ℹ️) |
| Exercise Timer | For timed exercises | Timer icon (⏱️) |
| Rest Timer | Between sets | Header in Workout |
| Music Button | YouTube Music access | Floating button |
| Motivational Quotes | Daily inspiration | Home Screen top |
| Water Tracker | 8 glasses daily | Home Screen |
| Weekly Stats | Workouts & exercises | Home Screen |
| Activity Chart | 7-day history | Home Screen |
| Streak Counter | Consecutive days | Home Screen |
| Progress Bars | Completion percentage | Workout Cards |
| Auto-Save | Progress saved automatically | All screens |
| Notifications | Timer completion alerts | Timers |
| Haptic Feedback | Button press feedback | All interactions |

---

## 🎉 What Makes This App Special

### For You
- 🎯 **Personalized** - Built for YOUR specific workout program
- 🔒 **Private** - All data stays on your device, no tracking
- 💰 **Free** - No subscriptions, no in-app purchases
- 📱 **Offline** - Works without internet (except quote API)
- 🎨 **Beautiful** - Professional gradient UI with animations
- 💪 **Motivating** - Quotes, streaks, stats keep you going
- 😎 **Fun** - Pulsing animations, emojis, smooth interactions

### For Your Workouts
- ✅ **Easy Tracking** - Simple checkboxes during exercises
- ℹ️ **Visual Guides** - Animated demonstrations for proper form
- ⏱️ **Built-in Timers** - No app switching needed
- 💧 **Hydration Tracking** - Remember to drink water
- 🎵 **Music Integration** - One-tap access to your tunes
- 📊 **Progress Visualization** - See your achievements
- 🔥 **Streak Motivation** - Keep your consistency going
- 💬 **Daily Inspiration** - Start each day motivated

---

## 🚀 Quick Reference

### Common Commands

```bash
# Start development server
npm start

# Run on iOS
npm run ios

# Run on Android  
npm run android

# Build for iOS
npx eas build --platform ios --profile production

# Build for Android
npx eas build --platform android --profile production

# Clear cache and reinstall
rm -rf node_modules
npm install
```

### File Locations

- **Workout Data:** `src/data/workouts.ts`
- **Home Screen:** `src/screens/HomeScreen.tsx`
- **Workout Screen:** `src/screens/WorkoutScreen.tsx`
- **Exercise Demos:** `src/components/ExerciseDemo.tsx`
- **Timer:** `src/components/Timer.tsx`
- **Music Button:** `src/components/FloatingMusicButton.tsx`
- **Storage Utils:** `src/utils/storage.ts`
- **iOS Config:** `ios/WorkoutPlanner/Info.plist`

### Key Features Access

- **Exercise Demonstrations:** Tap ℹ️ icon next to exercise
- **Exercise Timer:** Tap ⏱️ icon on time-based exercise
- **Rest Timer:** Tap timer icon in workout screen header
- **YouTube Music:** Tap floating red button during workout
- **Water Tracking:** Tap glasses on home screen
- **Reset Workout:** Use reset button in workout screen
- **View Stats:** Scroll down on home screen

---

## 🏆 Conclusion

You now have a complete, professional workout tracking app with:

✅ **4-day structured program**  
✅ **Animated exercise demonstrations**  
✅ **Step-by-step instructions**  
✅ **Built-in timers**  
✅ **Music integration**  
✅ **Progress tracking**  
✅ **Streak motivation**  
✅ **Hydration tracking**  
✅ **Beautiful design**  
✅ **Offline functionality**  
✅ **Privacy-first**  
✅ **Completely free**

### Ready to Start?

1. ✅ Build the app for your phone
2. ✅ Install it
3. ✅ Read today's motivational quote
4. ✅ Start your workout
5. ✅ Tap ℹ️ to learn proper form
6. ✅ Play your music
7. ✅ Track your progress
8. ✅ Build that streak!

---

**Now go crush those workouts!** 🏋️‍♂️🔥💪🎵

*Built with ❤️ using React Native, Expo, and free open-source tools*

**Your fitness journey starts now!** 🌟

