export interface Chat {
  id: string;
  type: 'direct' | 'match' | 'tournament' | 'team';
  participants: ChatParticipant[];
  lastMessage?: Message;
  unreadCount: number;
  createdAt: string;
  updatedAt: string;
  metadata?: {
    matchId?: string;
    tournamentId?: string;
    teamId?: string;
  };
}

export interface ChatParticipant {
  userId: string;
  username: string;
  avatar?: string;
  role?: 'admin' | 'member';
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: 'text' | 'image' | 'system';
  readBy: string[];
  createdAt: string;
}

export interface SendMessageRequest {
  chatId: string;
  content: string;
  type?: 'text' | 'image';
}

export interface CreateChatRequest {
  type: 'direct' | 'match' | 'tournament' | 'team';
  participantIds: string[];
  metadata?: {
    matchId?: string;
    tournamentId?: string;
    teamId?: string;
  };
}
