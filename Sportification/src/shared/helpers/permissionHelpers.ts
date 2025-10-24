/**
 * Permission helper functions for role-based access control
 */

export type UserRole = 'admin' | 'user' | 'moderator' | 'guest';

export interface Permission {
  resource: string;
  action: 'create' | 'read' | 'update' | 'delete' | 'manage';
}

/**
 * Role hierarchy (higher index = more permissions)
 */
const ROLE_HIERARCHY: UserRole[] = ['guest', 'user', 'moderator', 'admin'];

/**
 * Check if user has specific role
 */
export const hasRole = (userRole: UserRole | undefined, requiredRole: UserRole): boolean => {
  if (!userRole) return false;
  
  const userRoleIndex = ROLE_HIERARCHY.indexOf(userRole);
  const requiredRoleIndex = ROLE_HIERARCHY.indexOf(requiredRole);
  
  return userRoleIndex >= requiredRoleIndex;
};

/**
 * Check if user is admin
 */
export const isAdmin = (userRole: UserRole | undefined): boolean => {
  return userRole === 'admin';
};

/**
 * Check if user is moderator or higher
 */
export const isModerator = (userRole: UserRole | undefined): boolean => {
  return hasRole(userRole, 'moderator');
};

/**
 * Check if user is authenticated (not guest)
 */
export const isAuthenticated = (userRole: UserRole | undefined): boolean => {
  return userRole !== undefined && userRole !== 'guest';
};

/**
 * Check if user can perform action on resource
 */
export const canPerformAction = (
  userRole: UserRole | undefined,
  resource: string,
  action: Permission['action']
): boolean => {
  if (!userRole) return false;
  
  // Admin can do everything
  if (userRole === 'admin') return true;
  
  // Moderator permissions
  if (userRole === 'moderator') {
    if (action === 'delete' || action === 'manage') {
      // Moderators can't delete or fully manage some resources
      return ['comment', 'report', 'flag'].includes(resource);
    }
    return true;
  }
  
  // Regular user permissions
  if (userRole === 'user') {
    if (action === 'read') return true;
    if (action === 'create') return true;
    // Users can update/delete only their own resources
    return false;
  }
  
  // Guest permissions
  if (userRole === 'guest') {
    return action === 'read';
  }
  
  return false;
};

/**
 * Check if user owns a resource
 */
export const ownsResource = (userId: string | undefined, resourceOwnerId: string | undefined): boolean => {
  if (!userId || !resourceOwnerId) return false;
  return userId === resourceOwnerId;
};

/**
 * Check if user can edit resource
 */
export const canEdit = (
  userRole: UserRole | undefined,
  userId: string | undefined,
  resourceOwnerId: string | undefined
): boolean => {
  if (isAdmin(userRole)) return true;
  if (isModerator(userRole)) return true;
  return ownsResource(userId, resourceOwnerId);
};

/**
 * Check if user can delete resource
 */
export const canDelete = (
  userRole: UserRole | undefined,
  userId: string | undefined,
  resourceOwnerId: string | undefined
): boolean => {
  if (isAdmin(userRole)) return true;
  return ownsResource(userId, resourceOwnerId);
};

/**
 * Check if user can view private resource
 */
export const canViewPrivate = (
  userRole: UserRole | undefined,
  userId: string | undefined,
  resourceOwnerId: string | undefined,
  allowedUsers?: string[]
): boolean => {
  if (isAdmin(userRole)) return true;
  if (ownsResource(userId, resourceOwnerId)) return true;
  if (allowedUsers && userId && allowedUsers.includes(userId)) return true;
  return false;
};

/**
 * Check if user can join a team/match
 */
export const canJoin = (
  userRole: UserRole | undefined,
  currentParticipants: number,
  maxParticipants: number,
  isPrivate: boolean = false
): boolean => {
  if (!isAuthenticated(userRole)) return false;
  if (currentParticipants >= maxParticipants) return false;
  if (isPrivate && !isModerator(userRole)) return false;
  return true;
};

/**
 * Check if user can moderate content
 */
export const canModerate = (userRole: UserRole | undefined): boolean => {
  return isModerator(userRole);
};

/**
 * Check if user can manage users
 */
export const canManageUsers = (userRole: UserRole | undefined): boolean => {
  return isAdmin(userRole);
};

/**
 * Check if user can access admin panel
 */
export const canAccessAdminPanel = (userRole: UserRole | undefined): boolean => {
  return isAdmin(userRole);
};

/**
 * Check if user can create tournament
 */
export const canCreateTournament = (userRole: UserRole | undefined): boolean => {
  return hasRole(userRole, 'user');
};

/**
 * Check if user can start match
 */
export const canStartMatch = (
  userRole: UserRole | undefined,
  userId: string | undefined,
  matchCreatorId: string | undefined
): boolean => {
  if (isAdmin(userRole)) return true;
  return ownsResource(userId, matchCreatorId);
};

/**
 * Check if user can update score
 */
export const canUpdateScore = (
  userRole: UserRole | undefined,
  userId: string | undefined,
  participantIds: string[]
): boolean => {
  if (isModerator(userRole)) return true;
  if (!userId) return false;
  return participantIds.includes(userId);
};

/**
 * Check if user can send message in chat
 */
export const canSendMessage = (
  userRole: UserRole | undefined,
  userId: string | undefined,
  chatParticipantIds: string[]
): boolean => {
  if (!isAuthenticated(userRole)) return false;
  if (!userId) return false;
  if (isAdmin(userRole)) return true;
  return chatParticipantIds.includes(userId);
};

/**
 * Check if user can invite others
 */
export const canInvite = (
  userRole: UserRole | undefined,
  userId: string | undefined,
  resourceOwnerId: string | undefined
): boolean => {
  if (!isAuthenticated(userRole)) return false;
  if (isAdmin(userRole)) return true;
  return ownsResource(userId, resourceOwnerId);
};

/**
 * Get available actions for user
 */
export const getAvailableActions = (
  userRole: UserRole | undefined,
  userId: string | undefined,
  resourceOwnerId: string | undefined
): Permission['action'][] => {
  const actions: Permission['action'][] = ['read'];
  
  if (isAdmin(userRole)) {
    return ['create', 'read', 'update', 'delete', 'manage'];
  }
  
  if (isModerator(userRole)) {
    return ['create', 'read', 'update', 'delete'];
  }
  
  if (isAuthenticated(userRole)) {
    actions.push('create');
    
    if (ownsResource(userId, resourceOwnerId)) {
      actions.push('update', 'delete');
    }
  }
  
  return actions;
};

/**
 * Filter items based on user permissions
 */
export const filterByPermission = <T extends { ownerId?: string; isPrivate?: boolean }>(
  items: T[],
  userRole: UserRole | undefined,
  userId: string | undefined
): T[] => {
  return items.filter(item => {
    // Public items are visible to all
    if (!item.isPrivate) return true;
    
    // Private items only visible to owner, moderators, and admins
    return canViewPrivate(userRole, userId, item.ownerId);
  });
};

/**
 * Check feature flag access
 */
export const hasFeatureAccess = (
  userRole: UserRole | undefined,
  feature: string,
  betaFeatures: string[] = []
): boolean => {
  // Admin has access to all features
  if (isAdmin(userRole)) return true;
  
  // Beta features only for authenticated users
  if (betaFeatures.includes(feature)) {
    return isAuthenticated(userRole);
  }
  
  return true;
};
