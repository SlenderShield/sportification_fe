export interface Notification {
  id: string;
  userId: string;
  type: 
    | 'match_invitation'
    | 'match_update'
    | 'tournament_invitation'
    | 'tournament_update'
    | 'booking_confirmation'
    | 'booking_reminder'
    | 'team_invitation'
    | 'friend_request'
    | 'message'
    | 'system';
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  createdAt: string;
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
