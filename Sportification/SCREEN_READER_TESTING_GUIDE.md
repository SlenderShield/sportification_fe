# Screen Reader Testing Guide

This guide provides instructions for testing the Sportification app with screen readers on iOS and Android.

## Overview

Screen readers are assistive technologies that read aloud the content of the screen for users who are blind or have low vision. Testing with screen readers ensures the app is accessible to all users.

**Supported Screen Readers:**
- **iOS:** VoiceOver
- **Android:** TalkBack

## iOS - VoiceOver Testing

### Enabling VoiceOver

**Method 1: Settings**
1. Open **Settings** app
2. Navigate to **Accessibility**
3. Tap **VoiceOver**
4. Toggle **VoiceOver** ON

**Method 2: Siri**
- Say "Hey Siri, turn on VoiceOver"

**Method 3: Accessibility Shortcut**
1. Go to **Settings** → **Accessibility** → **Accessibility Shortcut**
2. Select **VoiceOver**
3. Triple-click the side button to toggle VoiceOver

### VoiceOver Gestures

#### Basic Navigation:
- **Swipe Right:** Move to next element
- **Swipe Left:** Move to previous element
- **Double Tap:** Activate selected element
- **Single Tap:** Read element information
- **Two-finger Single Tap:** Pause/resume speaking
- **Two-finger Swipe Up:** Read from top
- **Two-finger Swipe Down:** Read from current position
- **Three-finger Swipe Left/Right:** Scroll pages
- **Three-finger Swipe Up/Down:** Scroll content

#### Advanced Gestures:
- **Rotor:** Rotate two fingers on screen to access navigation options
- **Two-finger Double Tap:** Answer/end phone calls
- **Two-finger Triple Tap:** Item chooser
- **Three-finger Triple Tap:** Screen curtain (turns off display)

### VoiceOver Testing Checklist

#### General Navigation:
- [ ] All screens are reachable via swipe gestures
- [ ] Navigation follows a logical order (top to bottom, left to right)
- [ ] Headers are properly announced as headings
- [ ] Links are announced as links
- [ ] Buttons are announced as buttons

#### Interactive Elements:
- [ ] All buttons have clear labels
- [ ] Button actions are described (e.g., "Tap to submit")
- [ ] Disabled buttons are announced as dimmed/disabled
- [ ] Loading states are announced (e.g., "Updating, busy")
- [ ] Toggle switches announce their state (on/off)

#### Forms:
- [ ] Form labels are associated with inputs
- [ ] Required fields are announced
- [ ] Field types are clear (email, password, etc.)
- [ ] Error messages are announced
- [ ] Validation feedback is immediate
- [ ] Placeholder text provides context

#### Images:
- [ ] Decorative images are hidden from VoiceOver
- [ ] Content images have descriptive labels
- [ ] Avatar images announce user names
- [ ] Icons have meaningful descriptions

#### Lists:
- [ ] Lists are announced as lists
- [ ] Number of items is announced
- [ ] List navigation is smooth
- [ ] List items have clear descriptions

#### Dynamic Content:
- [ ] New content announcements are clear
- [ ] Updates don't interrupt current reading
- [ ] Modal dialogs announce presence
- [ ] Alerts are announced immediately
- [ ] Progress indicators announce status

### Common VoiceOver Issues

❌ **Issue:** Elements not announced  
✅ **Fix:** Ensure `accessible={true}` and proper `accessibilityLabel`

❌ **Issue:** Incorrect reading order  
✅ **Fix:** Adjust component structure or use `accessibilityViewIsModal`

❌ **Issue:** Missing button context  
✅ **Fix:** Add `accessibilityRole="button"` and `accessibilityHint`

❌ **Issue:** Images announced as "image" only  
✅ **Fix:** Add descriptive `accessibilityLabel`

## Android - TalkBack Testing

### Enabling TalkBack

**Method 1: Settings**
1. Open **Settings** app
2. Navigate to **Accessibility**
3. Tap **TalkBack**
4. Toggle **Use TalkBack** ON
5. Confirm in the dialog

**Method 2: Volume Keys**
1. Press and hold both **Volume Up** and **Volume Down** keys for 3 seconds
2. Confirm in the dialog

**Method 3: Google Assistant**
- Say "Hey Google, turn on TalkBack"

### TalkBack Gestures

#### Basic Navigation:
- **Swipe Right:** Move to next element
- **Swipe Left:** Move to previous element
- **Double Tap:** Activate selected element
- **Single Tap:** Focus on element
- **Two-finger Single Tap:** Pause/resume speaking
- **Swipe Down then Up:** Read from top (continuous reading)
- **Swipe Up then Down:** Read from current position
- **Two-finger Swipe Down:** Stop speaking

#### Advanced Gestures:
- **Local Context Menu:** Swipe up then right (one motion)
- **Global Context Menu:** Swipe down then right (one motion)
- **Reading Controls:** Swipe left then right or right then left
- **Two-finger Scroll:** Scroll content

### TalkBack Testing Checklist

#### General Navigation:
- [ ] All screens are reachable via swipe gestures
- [ ] Navigation order is logical
- [ ] Headings are properly announced
- [ ] Roles are correct (button, link, checkbox, etc.)
- [ ] Focus indicators are visible

#### Interactive Elements:
- [ ] All buttons have clear labels
- [ ] Button purposes are clear
- [ ] Disabled elements are announced
- [ ] Loading states are announced
- [ ] Switch states are clear (on/off, checked/unchecked)

#### Forms:
- [ ] Labels describe inputs clearly
- [ ] Required fields are indicated
- [ ] Input types are announced
- [ ] Errors are announced immediately
- [ ] Success feedback is provided

#### Images:
- [ ] Content images have descriptions
- [ ] Decorative images are ignored
- [ ] Complex images have detailed descriptions
- [ ] Image loading states are announced

#### Lists:
- [ ] Lists announce count
- [ ] Items are clearly labeled
- [ ] Position in list is announced
- [ ] List navigation is smooth

#### Dynamic Content:
- [ ] Live regions announce updates
- [ ] Announcements don't interrupt
- [ ] Modal focus is trapped
- [ ] Alerts are announced
- [ ] Toasts are announced

### Common TalkBack Issues

❌ **Issue:** Element not focusable  
✅ **Fix:** Add `accessible={true}` and `accessibilityLabel`

❌ **Issue:** Confusing navigation  
✅ **Fix:** Check component hierarchy and reading order

❌ **Issue:** No feedback on action  
✅ **Fix:** Use `AccessibilityInfo.announceForAccessibility()`

❌ **Issue:** Complex components not described  
✅ **Fix:** Group related elements with `accessibilityRole="none"`

## Testing the Sportification App

### Test Scenarios

#### 1. Authentication Flow
- [ ] Launch app with VoiceOver/TalkBack enabled
- [ ] Navigate to login screen
- [ ] Verify form labels are clear
- [ ] Test login process
- [ ] Verify success/error messages

#### 2. Main Navigation
- [ ] Navigate bottom tabs
- [ ] Verify tab labels are clear
- [ ] Test navigation between screens
- [ ] Verify back buttons work
- [ ] Check screen titles are announced

#### 3. Match Creation
- [ ] Navigate to create match
- [ ] Test all form inputs
- [ ] Verify sport selection
- [ ] Test date/time pickers
- [ ] Verify submission feedback

#### 4. Profile Settings
- [ ] Navigate to settings
- [ ] Test toggle switches
- [ ] Navigate to accessibility settings
- [ ] Test font size options
- [ ] Verify high contrast toggle
- [ ] Test reduced motion toggle

#### 5. Lists and Cards
- [ ] Navigate matches list
- [ ] Test card interactions
- [ ] Verify empty states
- [ ] Test pull to refresh
- [ ] Check loading indicators

#### 6. Search and Filters
- [ ] Test search input
- [ ] Verify search results
- [ ] Test filter chips
- [ ] Verify filter modal
- [ ] Test clear filters

### Testing Template

Use this template for systematic testing:

```
Screen: _________________
Date: ___________________
Tester: _________________
Device: _________________
OS Version: _____________
Screen Reader: __________

Navigation:
[ ] Can reach all elements
[ ] Order is logical
[ ] No focus traps

Interactive Elements:
[ ] Buttons labeled clearly
[ ] Actions described
[ ] States announced

Forms:
[ ] Labels present
[ ] Required fields marked
[ ] Errors announced

Content:
[ ] Headings clear
[ ] Images described
[ ] Lists announced

Issues Found:
1. ____________________
2. ____________________
3. ____________________

Notes:
_______________________
_______________________
```

## Announcement Testing

Test dynamic announcements using the app's feedback system:

```typescript
import { AccessibilityInfo } from 'react-native';

// Test in various scenarios
AccessibilityInfo.announceForAccessibility('Match created successfully');
AccessibilityInfo.announceForAccessibility('Error: Please fill all required fields');
AccessibilityInfo.announceForAccessibility('Loading matches');
```

### Announcement Guidelines:
- Keep messages concise and clear
- Use consistent terminology
- Announce errors immediately
- Provide context for success messages
- Don't interrupt ongoing speech unnecessarily

## Automated Testing

While manual testing is essential, you can also add automated checks:

```typescript
// Example test
import { render } from '@testing-library/react-native';
import { ProfileCard } from './ProfileCard';

test('has proper accessibility attributes', () => {
  const { getByRole, getByLabelText } = render(
    <ProfileCard name="John Doe" bio="Test bio" />
  );

  // Check role
  const button = getByRole('button');
  expect(button).toBeTruthy();

  // Check label
  const profileButton = getByLabelText("John Doe's profile");
  expect(profileButton).toBeTruthy();

  // Check hint is set
  expect(profileButton.props.accessibilityHint).toBe('Tap to view full profile');
});
```

## Resources

### Official Documentation:
- [Apple VoiceOver Guide](https://www.apple.com/accessibility/voiceover/)
- [iOS Accessibility API](https://developer.apple.com/accessibility/)
- [Android TalkBack Guide](https://support.google.com/accessibility/android/answer/6283677)
- [Android Accessibility API](https://developer.android.com/guide/topics/ui/accessibility)

### React Native:
- [React Native Accessibility](https://reactnative.dev/docs/accessibility)
- [Testing Accessibility](https://reactnative.dev/docs/accessibility#testing-accessibility)

### Standards:
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Mobile Accessibility Guide](https://www.w3.org/WAI/standards-guidelines/mobile/)

### Communities:
- [A11y Project](https://www.a11yproject.com/)
- [React Native A11y](https://github.com/FormidableLabs/react-native-app-auth)

## Tips for Better Accessibility

1. **Test Early and Often:** Don't wait until the end to test accessibility
2. **Use Real Devices:** Simulators don't fully represent the screen reader experience
3. **Get User Feedback:** If possible, have users with disabilities test the app
4. **Document Issues:** Keep a log of accessibility issues and fixes
5. **Stay Updated:** Accessibility features evolve with OS updates

## Reporting Issues

When reporting accessibility issues, include:
- Screen/component affected
- Expected behavior
- Actual behavior
- Steps to reproduce
- Screen reader used
- Device and OS version
- Screenshots/videos if helpful

## Summary

Screen reader testing ensures the app is usable by everyone. Key points:

✅ Test with both VoiceOver and TalkBack  
✅ Navigate using only swipe gestures  
✅ Verify all interactive elements are reachable  
✅ Check labels, hints, and roles are appropriate  
✅ Test with real devices when possible  
✅ Document and fix issues promptly  

---

**Last Updated:** January 2025  
**Next Review:** Quarterly or after major updates
