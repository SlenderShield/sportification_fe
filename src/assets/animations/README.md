# Lottie Animations

This directory is for Lottie animation JSON files used throughout the app.

## Getting Animation Files

You can find free Lottie animations at:
- [LottieFiles](https://lottiefiles.com/)
- [Lottie by Airbnb](https://airbnb.design/lottie/)

## Recommended Animations to Add

### 1. Loading Animation (`loading.json`)
**Use**: Loading states, data fetching, processing
**Suggested search**: "loading", "spinner", "waiting"
**Recommended**: Simple, continuous loop animation

### 2. Success Animation (`success.json`)
**Use**: Successful operations, confirmations
**Suggested search**: "success", "checkmark", "done"
**Recommended**: Short animation with checkmark or celebration

### 3. Error Animation (`error.json`)
**Use**: Error states, failed operations
**Suggested search**: "error", "warning", "alert"
**Recommended**: Short animation with X or warning symbol

### 4. Empty State Animations

#### No Matches (`empty-matches.json`)
**Use**: Empty matches list
**Suggested search**: "empty box", "no data", "sports ball"

#### No Teams (`empty-teams.json`)
**Use**: Empty teams list
**Suggested search**: "empty group", "no people", "team"

#### No Tournaments (`empty-tournaments.json`)
**Use**: Empty tournaments list
**Suggested search**: "trophy", "competition", "empty"

#### No Venues (`empty-venues.json`)
**Use**: Empty venues list
**Suggested search**: "location", "map pin", "empty location"

#### No Chats (`empty-chats.json`)
**Use**: Empty chats list
**Suggested search**: "empty chat", "no messages", "conversation"

#### No Friends (`empty-friends.json`)
**Use**: Empty friends list
**Suggested search**: "no friends", "lonely", "add friends"

#### No Notifications (`empty-notifications.json`)
**Use**: Empty notifications list
**Suggested search**: "bell", "no notifications", "all clear"

### 5. Celebration Animation (`celebration.json`)
**Use**: Achievements, milestones, special moments
**Suggested search**: "celebration", "confetti", "achievement"
**Recommended**: Energetic animation with confetti or fireworks

### 6. Onboarding Animations

#### Welcome (`onboarding-welcome.json`)
**Use**: First screen of onboarding
**Suggested search**: "welcome", "hello", "wave"

#### Features (`onboarding-features.json`)
**Use**: Feature highlights
**Suggested search**: "features", "showcase", "presentation"

#### Setup (`onboarding-setup.json`)
**Use**: Profile/account setup
**Suggested search**: "setup", "profile", "configuration"

## How to Use

1. Download Lottie JSON files from LottieFiles or create custom animations
2. Place the JSON files in this directory
3. Update the component imports to use these files

### Example: Using in LottieLoader

```typescript
// In LottieLoader.tsx
const getAnimationSource = () => {
  switch (type) {
    case 'success':
      return require('../../assets/animations/success.json');
    case 'error':
      return require('../../assets/animations/error.json');
    case 'loading':
    default:
      return require('../../assets/animations/loading.json');
  }
};
```

### Example: Using in EmptyState

```typescript
// In a screen component
<EmptyState
  title="No matches found"
  message="Create your first match to get started"
  lottieSource={require('../assets/animations/empty-matches.json')}
  lottieSize={200}
  lottieLoop={true}
/>
```

## File Size Considerations

- Keep animation file sizes under 50KB when possible
- Optimize animations using LottieFiles' built-in optimizer
- Test on actual devices to ensure smooth performance
- Consider providing a fallback icon for older devices

## Animation Guidelines

- **Duration**: Keep animations between 1-3 seconds
- **Loop**: Loading animations should loop, success/error should play once
- **Color**: Try to match the app's color scheme (primary, secondary colors)
- **Complexity**: Simpler animations perform better on lower-end devices
- **Framerate**: 30fps is usually sufficient for most animations

## Current Implementation Status

✅ Infrastructure ready:
- EmptyState component supports Lottie animations via `lottieSource` prop
- LottieLoader component can display loading/success/error animations
- AnimatedToast can show animated icons

🎨 Ready to add:
- Animation JSON files (download from LottieFiles)
- Update component imports to use the animation files
- Test animations on device

## Notes

- Animation files are not included by default to keep the repository size small
- Teams can choose their own animation style that matches their brand
- Fallback to icon-based display is automatic if no Lottie source is provided
