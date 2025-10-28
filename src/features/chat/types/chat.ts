export interface Chat {
  _id: string;
  type: 'direct' | 'group' | 'match' | 'tournament' | 'team';
  name?: string;
  participants: ChatParticipant[];
  lastMessage?: Message;
  unreadCount: number;
  settings?: {
    notifications?: boolean;
    role?: string;
  };
  createdAt?: string;
  updatedAt: string;
}

export interface ChatParticipant {
  _id: string;
  firstName: string;
  lastName: string;
  username?: string;
  isOnline?: boolean;
  lastActiveAt?: string;
}

export interface Message {
  _id: string;
  chat: string;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
    username: string;
  };
  content: string;
  messageType: 'text' | 'image' | 'system';
  isEdited: boolean;
  reactions?: MessageReaction[];
  replyTo?: {
    _id: string;
    content: string;
    sender: {
      firstName: string;
    };
  } | null;
  readBy?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface MessageReaction {
  emoji: string;
  users: {
    _id: string;
    firstName: string;
  }[];
  count: number;
}

export interface SendMessageRequest {
  content: string;
  messageType?: 'text' | 'image';
  replyTo?: string;
}

export interface CreateChatRequest {
  type: 'direct' | 'group';
  participantIds: string[];
  name?: string;
}
