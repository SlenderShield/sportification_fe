import {
  hasRole,
  hasAnyRole,
  hasAllRoles,
  isAdmin,
  isModerator,
  isUser,
  canView,
  canCreate,
  canEdit,
  canDelete,
  canModerate,
  isOwner,
  isResourceOwner,
  canAccessFeature,
  checkPermission,
  filterByPermission,
  getRoleHierarchy,
  getRoleLevel,
  isHigherRole,
  canEditResource,
  canDeleteResource,
} from '@shared/helpers/permissionHelpers';

describe('permissionHelpers', () => {
  describe('hasRole', () => {
    it('should check if user has specific role', () => {
      expect(hasRole('admin', 'admin')).toBe(true);
      expect(hasRole('user', 'admin')).toBe(false);
    });

    it('should handle case insensitivity', () => {
      expect(hasRole('ADMIN', 'admin')).toBe(true);
    });
  });

  describe('hasAnyRole', () => {
    it('should check if user has any of the roles', () => {
      expect(hasAnyRole('admin', ['admin', 'moderator'])).toBe(true);
      expect(hasAnyRole('user', ['admin', 'moderator'])).toBe(false);
    });
  });

  describe('hasAllRoles', () => {
    it('should check if user has all roles', () => {
      expect(hasAllRoles(['admin', 'moderator'], ['admin', 'moderator'])).toBe(true);
      expect(hasAllRoles(['admin'], ['admin', 'moderator'])).toBe(false);
    });
  });

  describe('isAdmin', () => {
    it('should check if user is admin', () => {
      expect(isAdmin('admin')).toBe(true);
      expect(isAdmin('user')).toBe(false);
    });
  });

  describe('isModerator', () => {
    it('should check if user is moderator', () => {
      expect(isModerator('moderator')).toBe(true);
      expect(isModerator('user')).toBe(false);
    });
  });

  describe('isUser', () => {
    it('should check if user is regular user', () => {
      expect(isUser('user')).toBe(true);
      expect(isUser('admin')).toBe(false);
    });
  });

  describe('canView', () => {
    it('should check view permission', () => {
      expect(canView('admin')).toBe(true);
      expect(canView('user')).toBe(true);
    });
  });

  describe('canCreate', () => {
    it('should check create permission', () => {
      expect(canCreate('admin')).toBe(true);
      expect(canCreate('user')).toBe(true);
      expect(canCreate('guest')).toBe(false);
    });
  });

  describe('canEdit', () => {
    it('should check edit permission for owner', () => {
      expect(canEdit('user', '123', '123')).toBe(true);
    });

    it('should check edit permission for admin', () => {
      expect(canEdit('admin', '123', '456')).toBe(true);
    });

    it('should deny edit for non-owner non-admin', () => {
      expect(canEdit('user', '123', '456')).toBe(false);
    });
  });

  describe('canDelete', () => {
    it('should check delete permission for owner', () => {
      expect(canDelete('user', '123', '123')).toBe(true);
    });

    it('should check delete permission for admin', () => {
      expect(canDelete('admin', '123', '456')).toBe(true);
    });

    it('should deny delete for non-owner non-admin', () => {
      expect(canDelete('user', '123', '456')).toBe(false);
    });
  });

  describe('canModerate', () => {
    it('should check moderation permission', () => {
      expect(canModerate('admin')).toBe(true);
      expect(canModerate('moderator')).toBe(true);
      expect(canModerate('user')).toBe(false);
    });
  });

  describe('isOwner', () => {
    it('should check if user is owner', () => {
      expect(isOwner('123', '123')).toBe(true);
      expect(isOwner('123', '456')).toBe(false);
    });
  });

  describe('isResourceOwner', () => {
    it('should check if user owns resource', () => {
      const resource = { ownerId: '123' };
      expect(isResourceOwner('123', resource)).toBe(true);
      expect(isResourceOwner('456', resource)).toBe(false);
    });

    it('should handle resource with createdBy', () => {
      const resource = { createdBy: '123' };
      expect(isResourceOwner('123', resource)).toBe(true);
    });

    it('should handle resource with userId', () => {
      const resource = { userId: '123' };
      expect(isResourceOwner('123', resource)).toBe(true);
    });
  });

  describe('canAccessFeature', () => {
    it('should check feature access', () => {
      expect(canAccessFeature('admin', 'analytics')).toBe(true);
      expect(canAccessFeature('user', 'basic')).toBe(true);
    });
  });

  describe('checkPermission', () => {
    it('should check permission with custom function', () => {
      const checker = (role: string) => role === 'admin';
      expect(checkPermission('admin', checker)).toBe(true);
      expect(checkPermission('user', checker)).toBe(false);
    });
  });

  describe('filterByPermission', () => {
    it('should filter items by permission', () => {
      const items = [
        { id: '1', ownerId: '123' },
        { id: '2', ownerId: '456' },
        { id: '3', ownerId: '123' },
      ];
      const filtered = filterByPermission(items, 'user', '123', (item, userId) =>
        isResourceOwner(userId, item)
      );
      expect(filtered).toHaveLength(2);
    });

    it('should return all items for admin', () => {
      const items = [{ id: '1' }, { id: '2' }];
      const filtered = filterByPermission(items, 'admin', '123', () => false);
      expect(filtered).toHaveLength(2);
    });
  });

  describe('getRoleHierarchy', () => {
    it('should return role hierarchy', () => {
      const hierarchy = getRoleHierarchy();
      expect(hierarchy).toBeInstanceOf(Object);
      expect(hierarchy.admin).toBeGreaterThan(hierarchy.user);
    });
  });

  describe('getRoleLevel', () => {
    it('should get role level', () => {
      expect(getRoleLevel('admin')).toBeGreaterThan(getRoleLevel('user'));
    });
  });

  describe('isHigherRole', () => {
    it('should compare role levels', () => {
      expect(isHigherRole('admin', 'user')).toBe(true);
      expect(isHigherRole('user', 'admin')).toBe(false);
    });
  });

  describe('canEditResource', () => {
    it('should check edit permission for resource', () => {
      const resource = { ownerId: '123' };
      expect(canEditResource('user', '123', resource)).toBe(true);
      expect(canEditResource('admin', '456', resource)).toBe(true);
      expect(canEditResource('user', '456', resource)).toBe(false);
    });
  });

  describe('canDeleteResource', () => {
    it('should check delete permission for resource', () => {
      const resource = { ownerId: '123' };
      expect(canDeleteResource('user', '123', resource)).toBe(true);
      expect(canDeleteResource('admin', '456', resource)).toBe(true);
      expect(canDeleteResource('user', '456', resource)).toBe(false);
    });
  });
});
