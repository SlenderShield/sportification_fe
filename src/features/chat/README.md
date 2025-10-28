# Chat Feature

## Purpose
Provide real-time messaging capabilities for users, teams, and match participants.

## Key Components

### Services
- **ChatService.ts**: Message handling and real-time communication logic

### Screens
- **ChatsScreen.tsx**: List of conversations with unread indicators
- **ChatDetailScreen.tsx**: Message thread with real-time updates

### State Management
- **chatApi.ts**: RTK Query API for message CRUD operations

### Repositories
- **ChatRepository.ts**: Data access layer for chat API calls

### Types
- **chat.ts**: Chat, Message, Conversation interfaces

## Features Implemented

✅ One-on-one messaging  
✅ Group chat support  
✅ Real-time message delivery via Socket.IO  
✅ Typing indicators  
✅ Read receipts  
✅ Message history and persistence  
✅ Unread message counts  
✅ Chat notifications  
✅ Message timestamps

## Dependencies

### External
- `socket.io-client` - Real-time messaging

### Internal
- `src/shared/services/socketService` - WebSocket connection management
- `src/shared/utils/dateUtils` - Message timestamp formatting

## Integration Points

### Used By
- Match participants for match coordination
- Team members for team communication
- Direct user-to-user messaging

### Uses
- Auth feature for user identification
- Socket service for real-time updates
- Notifications for message alerts

## Usage Example

```typescript
// Get conversations
import { useGetChatsQuery } from '../store/chatApi';

const { data: chats } = useGetChatsQuery();

// Send a message
import { useSendMessageMutation } from '../store/chatApi';

const [sendMessage] = useSendMessageMutation();
await sendMessage({
  chatId: chat.id,
  content: 'Hello!',
  type: 'text'
}).unwrap();

// Listen for real-time messages
import { socketService } from '../../../shared/services/socketService';

useEffect(() => {
  socketService.on('message:received', (message) => {
    // Handle incoming message
  });
  
  return () => {
    socketService.off('message:received');
  };
}, []);
```

## Business Rules

- Messages cannot be edited (append-only)
- Users can only access chats they're part of
- Group chats require minimum 2 participants
- Message history retained indefinitely
- Deleted messages show as "[Message deleted]"

## Reusability Notes

- **Real-time Pattern**: Socket.IO integration reusable for other real-time features
- **Message UI**: Chat components could be reused for comments/forums
- **Typing Indicators**: Pattern applicable to collaborative features
