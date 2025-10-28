export interface Notification {
  _id: string;
  type: 
    | 'match_invitation'
    | 'match_update'
    | 'tournament_invitation'
    | 'tournament_update'
    | 'new_message'
    | 'friend_request'
    | 'booking_confirmation'
    | 'booking_reminder'
    | 'team_invitation'
    | 'system';
  title: string;
  message: string;
  data?: {
    matchId?: string;
    tournamentId?: string;
    chatId?: string;
    inviterId?: string;
    senderId?: string;
    matchTitle?: string;
    messagePreview?: string;
    [key: string]: any;
  };
  isRead: boolean;
  actionRequired?: boolean;
  actions?: NotificationAction[];
  priority?: 'low' | 'medium' | 'high';
  expiresAt?: string;
  createdAt: string;
  readAt?: string;
}

export interface NotificationAction {
  type: string;
  label: string;
  endpoint: string;
}

export interface NotificationSummary {
  total: number;
  unread: number;
  actionRequired: number;
}

export interface NotificationPreferences {
  pushEnabled: boolean;
  emailEnabled: boolean;
  matchUpdates: boolean;
  tournamentUpdates: boolean;
  bookingReminders: boolean;
  chatMessages: boolean;
  friendRequests: boolean;
}
