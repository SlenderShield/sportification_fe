import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SectionHeader } from '../molecules/SectionHeader';
import { LoadingSpinner } from '../atoms/LoadingSpinner';
import { Badge } from '../atoms/Badge';
import { Button } from '../atoms/Button';
import { EmptyState } from '../molecules/EmptyState';
import { ActionButtons } from '../organisms/ActionButtons';

/**
 * DetailScreenTemplate
 * 
 * Reusable template for detail/view screens with common features:
 * - Header with title and subtitle
 * - Status badge
 * - Action buttons (primary/secondary)
 * - Tab navigation support
 * - Loading states
 * - Error handling
 * 
 * @example
 * ```tsx
 * <DetailScreenTemplate
 *   title="Match Details"
 *   subtitle="Basketball • Today at 5 PM"
 *   status="scheduled"
 *   primaryAction={{ label: 'Join Match', onPress: handleJoin }}
 *   secondaryAction={{ label: 'Share', onPress: handleShare }}
 * >
 *   <MatchDetails match={match} />
 * </DetailScreenTemplate>
 * ```
 */

export interface Tab {
  key: string;
  label: string;
}

export interface Action {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
}

export interface DetailScreenTemplateProps {
  /** Screen title */
  title: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Status badge */
  status?: 'active' | 'inactive' | 'pending' | 'completed' | 'cancelled';
  /** Loading state */
  isLoading?: boolean;
  /** Error message */
  error?: string;
  /** Primary action button */
  primaryAction?: Action;
  /** Secondary action button */
  secondaryAction?: Action;
  /** Additional actions */
  actions?: Action[];
  /** Tab navigation */
  tabs?: Tab[];
  /** Active tab key */
  activeTab?: string;
  /** Tab change callback */
  onTabChange?: (tabKey: string) => void;
  /** Content to display */
  children: React.ReactNode;
}

export const DetailScreenTemplate: React.FC<DetailScreenTemplateProps> = ({
  title,
  subtitle,
  status,
  isLoading = false,
  error,
  primaryAction,
  secondaryAction,
  actions = [],
  tabs,
  activeTab,
  onTabChange,
  children,
}) => {
  const [currentTab, setCurrentTab] = useState(activeTab || tabs?.[0]?.key || '');

  const handleTabChange = (tabKey: string) => {
    setCurrentTab(tabKey);
    onTabChange?.(tabKey);
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'active':
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
      case 'inactive':
        return 'error';
      default:
        return 'default';
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <SectionHeader title={title} subtitle={subtitle} />
        {status && (
          <Badge
            label={status}
            variant={getStatusVariant(status)}
          />
        )}
      </View>

      {tabs && tabs.length > 0 && (
        <View style={styles.tabs}>
          {tabs.map((tab) => (
            <Button
              key={tab.key}
              label={tab.label}
              onPress={() => handleTabChange(tab.key)}
              variant={currentTab === tab.key ? 'primary' : 'secondary'}
              style={styles.tabButton}
            />
          ))}
        </View>
      )}
    </View>
  );

  const renderActions = () => {
    const allActions = [];
    
    if (primaryAction) {
      allActions.push({ ...primaryAction, variant: 'primary' as const });
    }
    
    if (secondaryAction) {
      allActions.push({ ...secondaryAction, variant: 'secondary' as const });
    }
    
    allActions.push(...actions);

    if (allActions.length === 0) {
      return null;
    }

    return (
      <View style={styles.actionsContainer}>
        <ActionButtons actions={allActions} />
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <LoadingSpinner />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        {renderHeader()}
        <EmptyState
          message={error}
          icon="alert-circle"
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {renderHeader()}
      
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        {children}
      </ScrollView>
      
      {renderActions()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tabs: {
    flexDirection: 'row',
    gap: 8,
  },
  tabButton: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
});
