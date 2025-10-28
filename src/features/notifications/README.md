# Notifications Feature

## Purpose
Manage push notifications and in-app notification delivery across all features.

## Key Components

### Services
- **NotificationService.ts**: Notification handling, permissions, and Firebase integration

### Screens
- **NotificationsScreen.tsx**: Notification history and management

### State Management
- **notificationApi.ts**: RTK Query API for notification operations

### Repositories
- **NotificationRepository.ts**: Data access layer for notification API calls

### Types
- **notification.ts**: Notification, NotificationType, NotificationPreferences interfaces

## Features Implemented

✅ Firebase Cloud Messaging (FCM) integration  
✅ Local push notifications (Notifee)  
✅ Notification history  
✅ Mark as read/unread  
✅ Delete notifications  
✅ Notification preferences  
✅ Permission handling  
✅ Notification categories (matches, teams, tournaments, chat, etc.)  
✅ Deep linking from notifications  
✅ Badge counts

## Dependencies

### External
- `@react-native-firebase/messaging` - Firebase Cloud Messaging
- `@notifee/react-native` - Local push notifications

### Internal
- `src/shared/services/notificationService` - Centralized notification service
- Navigation for deep linking

## Integration Points

### Used By
- **All features** - Every feature triggers notifications

### Notification Types
- Match invitations and updates
- Team invitations and announcements
- Tournament registrations and results
- Chat messages
- Friend requests
- Venue booking confirmations
- System announcements

## Usage Example

```typescript
// Request notification permissions
import { notificationService } from '../../../shared/services/notificationService';

const granted = await notificationService.requestPermission();

// Show local notification
await notificationService.showNotification({
  title: 'Match Starting Soon',
  body: 'Your match starts in 30 minutes',
  data: { matchId: '123', type: 'match_reminder' }
});

// Listen for notification taps
useEffect(() => {
  const unsubscribe = notificationService.onNotificationOpened((notification) => {
    // Navigate to relevant screen
    if (notification.data?.matchId) {
      navigation.navigate('MatchDetail', { id: notification.data.matchId });
    }
  });
  
  return unsubscribe;
}, []);

// Get notification history
import { useGetNotificationsQuery } from '../store/notificationApi';

const { data: notifications } = useGetNotificationsQuery();
```

## Business Rules

- Notifications require user permission
- Users can configure notification preferences per category
- Notifications expire after 30 days
- Maximum 100 notifications stored locally
- Read notifications can be bulk deleted
- System notifications cannot be disabled

## Reusability Notes

- **Centralized Service**: `notificationService` used by all features
- **Deep Linking**: Navigation pattern reusable for other entry points
- **Permission Handling**: Permission patterns applicable to other permissions (location, camera, etc.)

## Best Practices

### Triggering Notifications
Always use the shared `notificationService`:
```typescript
import { notificationService } from '@shared/services';

// Don't create notification logic in features
// Always use the centralized service
```

### Notification Categories
Register categories in `notificationService.ts`:
- match_invitation
- match_reminder
- team_invitation
- tournament_update
- chat_message
- friend_request
- booking_confirmation

### Deep Linking
Map notification types to navigation:
```typescript
const navigationMap = {
  match_invitation: 'MatchDetail',
  team_invitation: 'TeamDetail',
  chat_message: 'ChatDetail',
  // etc.
};
```
