/**
 * useEntityActions Hook
 * Reusable hook for common entity actions (join, leave, delete)
 * Reduces code duplication across detail screens
 */

import { Alert } from 'react-native';
import { useConfirmation } from './useConfirmation';

interface EntityActionsConfig {
  entityType: 'match' | 'team' | 'tournament';
  navigation: any;
  refetch?: () => void;
}

interface EntityActions {
  handleJoin: (joinMutation: any, entityId: string) => Promise<void>;
  handleLeave: (leaveMutation: any, entityId: string, goBack?: boolean) => void;
  handleDelete: (deleteMutation: any, entityId: string) => void;
}

export const useEntityActions = (config: EntityActionsConfig): EntityActions => {
  const { entityType, navigation, refetch } = config;
  const { showConfirmation } = useConfirmation();

  const capitalizedType = entityType.charAt(0).toUpperCase() + entityType.slice(1);

  const handleJoin = async (joinMutation: any, entityId: string): Promise<void> => {
    try {
      await joinMutation(entityId).unwrap();
      Alert.alert('Success', `You have joined the ${entityType}!`);
      if (refetch) refetch();
    } catch (error: any) {
      Alert.alert('Error', error?.data?.message || `Failed to join ${entityType}`);
    }
  };

  const handleLeave = (
    leaveMutation: any,
    entityId: string,
    goBack: boolean = true
  ): void => {
    showConfirmation(
      {
        title: `Leave ${capitalizedType}`,
        message: `Are you sure you want to leave this ${entityType}?`,
        confirmText: 'Leave',
        destructive: true,
      },
      async () => {
        try {
          await leaveMutation(entityId).unwrap();
          Alert.alert('Success', `You have left the ${entityType}`);
          if (goBack) {
            navigation.goBack();
          } else if (refetch) {
            refetch();
          }
        } catch (error: any) {
          Alert.alert('Error', error?.data?.message || `Failed to leave ${entityType}`);
        }
      }
    );
  };

  const handleDelete = (deleteMutation: any, entityId: string): void => {
    showConfirmation(
      {
        title: `Delete ${capitalizedType}`,
        message: `Are you sure you want to delete this ${entityType}? This action cannot be undone.`,
        confirmText: 'Delete',
        destructive: true,
      },
      async () => {
        try {
          await deleteMutation(entityId).unwrap();
          Alert.alert('Success', `${capitalizedType} deleted successfully`);
          navigation.goBack();
        } catch (error: any) {
          Alert.alert('Error', error?.data?.message || `Failed to delete ${entityType}`);
        }
      }
    );
  };

  return {
    handleJoin,
    handleLeave,
    handleDelete,
  };
};
