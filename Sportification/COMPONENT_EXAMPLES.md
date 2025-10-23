# Component Library - Usage Examples

This document provides practical examples of how to use each component in the redesigned UI library.

## Table of Contents
1. [Button](#button)
2. [Input](#input)
3. [Card](#card)
4. [FAB](#fab)
5. [Badge](#badge)
6. [Avatar](#avatar)
7. [Toast](#toast)
8. [BottomSheet](#bottomsheet)
9. [SkeletonLoader](#skeletonloader)
10. [ParticipantList](#participantlist)
11. [EmptyState](#emptystate)
12. [SportSelector](#sportselector)
13. [DetailRow](#detailrow)
14. [SectionHeader](#sectionheader)

---

## Button

### Basic Usage
```tsx
import Button from '../components/common/Button';

// Primary button
<Button
  title="Submit"
  onPress={handleSubmit}
/>

// Button with icon
<Button
  title="Add Match"
  icon="plus"
  onPress={handleAddMatch}
/>

// Loading state
<Button
  title="Saving..."
  loading={isSaving}
  onPress={handleSave}
/>
```

### Variants
```tsx
// Primary (default)
<Button title="Primary" variant="primary" />

// Secondary
<Button title="Secondary" variant="secondary" />

// Outline
<Button title="Outline" variant="outline" />

// Text button
<Button title="Text" variant="text" />
```

### Sizes
```tsx
<Button title="Small" size="small" />
<Button title="Medium" size="medium" />
<Button title="Large" size="large" />
```

### With Icons
```tsx
// Icon on left
<Button
  title="Login"
  icon="login"
  iconPosition="left"
/>

// Icon on right
<Button
  title="Next"
  icon="arrow-right"
  iconPosition="right"
/>
```

### Full Width
```tsx
<Button
  title="Continue"
  fullWidth
  onPress={handleContinue}
/>
```

---

## Input

### Basic Usage
```tsx
import Input from '../components/common/Input';

<Input
  label="Email"
  value={email}
  onChangeText={setEmail}
  placeholder="Enter your email"
/>
```

### With Icons
```tsx
// Left icon
<Input
  label="Email"
  value={email}
  onChangeText={setEmail}
  leftIcon="email"
/>

// Right icon (clickable)
<Input
  label="Password"
  value={password}
  onChangeText={setPassword}
  leftIcon="lock"
  rightIcon={showPassword ? "eye-off" : "eye"}
  onRightIconPress={() => setShowPassword(!showPassword)}
  secureTextEntry={!showPassword}
/>
```

### Variants
```tsx
// Outlined (default)
<Input
  label="Name"
  variant="outlined"
/>

// Filled
<Input
  label="Name"
  variant="filled"
/>
```

### With Validation
```tsx
<Input
  label="Email"
  value={email}
  onChangeText={setEmail}
  error={errors.email}
  helperText="We'll never share your email"
/>
```

### Keyboard Types
```tsx
// Email
<Input
  label="Email"
  keyboardType="email-address"
  autoCapitalize="none"
/>

// Phone
<Input
  label="Phone"
  keyboardType="phone-pad"
/>

// Number
<Input
  label="Age"
  keyboardType="number-pad"
/>
```

---

## Card

### Basic Usage
```tsx
import { Card } from '../components/ui';

<Card>
  <View style={{ padding: 16 }}>
    <Text>Card content here</Text>
  </View>
</Card>
```

### Variants
```tsx
// Elevated (default)
<Card variant="elevated">
  <Text>Elevated card</Text>
</Card>

// Outlined
<Card variant="outlined">
  <Text>Outlined card</Text>
</Card>

// Filled
<Card variant="filled">
  <Text>Filled card</Text>
</Card>
```

### Elevation Levels
```tsx
<Card elevation="sm">Small shadow</Card>
<Card elevation="md">Medium shadow</Card>
<Card elevation="lg">Large shadow</Card>
```

### Pressable Card
```tsx
<Card
  onPress={() => navigation.navigate('Details')}
  animated
>
  <View style={{ padding: 16 }}>
    <Text>Tap me!</Text>
  </View>
</Card>
```

### Real-World Example
```tsx
<Card
  onPress={() => navigation.navigate('MatchDetail', { matchId: item.id })}
  style={{ marginBottom: 12 }}
>
  <View style={{ padding: 16 }}>
    <Text style={theme.typography.titleLarge}>
      {item.title}
    </Text>
    <Text style={theme.typography.bodySmall}>
      {item.venue.name}
    </Text>
  </View>
</Card>
```

---

## FAB

### Basic Usage
```tsx
import { FAB } from '../components/ui';

<FAB
  icon="plus"
  onPress={handleCreate}
/>
```

### Variants
```tsx
<FAB variant="primary" />
<FAB variant="secondary" />
<FAB variant="tertiary" />
```

### Sizes
```tsx
<FAB size="small" />
<FAB size="medium" />
<FAB size="large" />
```

### Positioning
```tsx
<FAB position="bottom-right" />
<FAB position="bottom-center" />
<FAB position="bottom-left" />
```

### Real-World Example
```tsx
<FAB
  icon="plus"
  onPress={() => navigation.navigate('CreateMatch')}
  variant="primary"
  position="bottom-right"
/>
```

---

## Badge

### Basic Usage
```tsx
import { Badge } from '../components/ui';

<Badge label="New" />
```

### Variants
```tsx
<Badge label="Default" variant="default" />
<Badge label="Success" variant="success" />
<Badge label="Error" variant="error" />
<Badge label="Warning" variant="warning" />
<Badge label="Info" variant="info" />
```

### Sizes
```tsx
<Badge label="Small" size="small" />
<Badge label="Medium" size="medium" />
<Badge label="Large" size="large" />
```

### Real-World Examples
```tsx
// Status indicator
<Badge label={match.status} variant={getStatusVariant(match.status)} />

// Count indicator
<Badge label={`${notifications.length}`} variant="error" size="small" />

// Category tag
<Badge label={venue.sport} variant="info" />
```

---

## Avatar

### Basic Usage
```tsx
import { Avatar } from '../components/ui';

// With name (shows initials)
<Avatar name="John Doe" />

// With image
<Avatar source={{ uri: user.avatarUrl }} />
```

### Sizes
```tsx
<Avatar name="John" size="small" />
<Avatar name="Jane" size="medium" />
<Avatar name="Jack" size="large" />
<Avatar name="Jill" size="xlarge" />
```

### Variants
```tsx
<Avatar name="John" variant="circular" />
<Avatar name="Jane" variant="rounded" />
<Avatar name="Jack" variant="square" />
```

### Custom Color
```tsx
<Avatar
  name="Team Alpha"
  backgroundColor="#FF5722"
/>
```

### Real-World Examples
```tsx
// User profile
<Avatar
  source={{ uri: user.profilePicture }}
  size="xlarge"
  variant="circular"
/>

// Team avatar
<Avatar
  name={team.name}
  size="large"
  variant="rounded"
  backgroundColor={theme.colors.secondary}
/>

// List item avatar
<Avatar
  name={member.username}
  size="medium"
  variant="circular"
/>
```

---

## Toast

### Basic Usage
```tsx
import { Toast } from '../components/ui';

const [showToast, setShowToast] = useState(false);

{showToast && (
  <Toast
    message="Operation successful!"
    type="success"
    onDismiss={() => setShowToast(false)}
  />
)}
```

### Types
```tsx
<Toast message="Information" type="info" />
<Toast message="Success!" type="success" />
<Toast message="Warning" type="warning" />
<Toast message="Error occurred" type="error" />
```

### Custom Duration
```tsx
<Toast
  message="Will dismiss in 5 seconds"
  duration={5000}
  onDismiss={handleDismiss}
/>
```

### Real-World Example
```tsx
const handleSave = async () => {
  try {
    await saveData();
    setToastMessage('Saved successfully!');
    setToastType('success');
    setShowToast(true);
  } catch (error) {
    setToastMessage('Failed to save');
    setToastType('error');
    setShowToast(true);
  }
};

return (
  <>
    {/* Your content */}
    {showToast && (
      <Toast
        message={toastMessage}
        type={toastType}
        onDismiss={() => setShowToast(false)}
      />
    )}
  </>
);
```

---

## BottomSheet

### Basic Usage
```tsx
import { BottomSheet } from '../components/ui';

const [visible, setVisible] = useState(false);

<BottomSheet
  visible={visible}
  onClose={() => setVisible(false)}
>
  <View>
    <Text>Sheet content here</Text>
  </View>
</BottomSheet>
```

### Custom Height
```tsx
<BottomSheet
  visible={visible}
  onClose={handleClose}
  height={400}
>
  {/* Content */}
</BottomSheet>
```

### Real-World Example - Filter Sheet
```tsx
const FilterSheet = () => {
  const [visible, setVisible] = useState(false);
  const [sport, setSport] = useState('');

  return (
    <>
      <Button
        title="Filters"
        onPress={() => setVisible(true)}
        icon="filter"
      />

      <BottomSheet
        visible={visible}
        onClose={() => setVisible(false)}
        height={500}
      >
        <View style={{ padding: 16 }}>
          <Text style={theme.typography.titleLarge}>
            Filter Matches
          </Text>

          <Input
            label="Sport"
            value={sport}
            onChangeText={setSport}
          />

          <Button
            title="Apply Filters"
            onPress={handleApplyFilters}
            fullWidth
          />
        </View>
      </BottomSheet>
    </>
  );
};
```

---

## SkeletonLoader

### Basic Usage
```tsx
import { SkeletonLoader, SkeletonCard } from '../components/ui';

// Simple skeleton
<SkeletonLoader width="100%" height={20} />
```

### Variants
```tsx
// Text line
<SkeletonLoader variant="text" width="80%" height={16} />

// Circular (for avatars)
<SkeletonLoader variant="circular" height={48} />

// Rectangular (for images)
<SkeletonLoader variant="rectangular" width="100%" height={200} />
```

### Pre-built Card Skeleton
```tsx
import { SkeletonCard } from '../components/ui';

// Loading state for list
{isLoading ? (
  <>
    <SkeletonCard />
    <SkeletonCard />
    <SkeletonCard />
  </>
) : (
  data.map(item => <ItemCard key={item.id} item={item} />)
)}
```

### Custom Skeleton Layout
```tsx
const CustomSkeleton = () => (
  <View style={{ padding: 16 }}>
    {/* Avatar + Name */}
    <View style={{ flexDirection: 'row', marginBottom: 12 }}>
      <SkeletonLoader variant="circular" height={48} />
      <View style={{ marginLeft: 12, flex: 1 }}>
        <SkeletonLoader height={16} width="60%" style={{ marginBottom: 8 }} />
        <SkeletonLoader height={12} width="40%" />
      </View>
    </View>

    {/* Image */}
    <SkeletonLoader height={200} width="100%" style={{ marginBottom: 12 }} />

    {/* Text lines */}
    <SkeletonLoader height={12} width="100%" style={{ marginBottom: 8 }} />
    <SkeletonLoader height={12} width="90%" style={{ marginBottom: 8 }} />
    <SkeletonLoader height={12} width="75%" />
  </View>
);
```

### Real-World Example - List Loading
```tsx
const MatchesList = () => {
  const { data, isLoading } = useGetMatchesQuery();

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <MatchCard item={item} />}
      ListHeaderComponent={() => (
        isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : null
      )}
    />
  );
};
```

---

## Theme Usage

### Accessing Theme
```tsx
import { useTheme } from '../theme';

const MyComponent = () => {
  const { theme, themeMode, setThemeMode, toggleTheme } = useTheme();

  return (
    <View style={{ backgroundColor: theme.colors.background }}>
      <Text style={[
        theme.typography.headlineLarge,
        { color: theme.colors.text }
      ]}>
        Hello World
      </Text>
    </View>
  );
};
```

### Using Theme Values
```tsx
const { theme } = useTheme();

// Colors
backgroundColor: theme.colors.primary
color: theme.colors.onPrimary
borderColor: theme.colors.outline

// Typography
...theme.typography.titleLarge
...theme.typography.bodyMedium

// Spacing
padding: theme.spacing.base
marginTop: theme.spacing.md
gap: theme.spacing.sm

// Elevation
...theme.elevation.md

// Border Radius
borderRadius: theme.borderRadius.lg

// Animations
withTiming(value, { duration: theme.animations.duration.normal })
withSpring(value, theme.animations.spring.smooth)
```

### Theme Toggle Button
```tsx
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      title={theme.isDark ? "Light Mode" : "Dark Mode"}
      icon={theme.isDark ? "white-balance-sunny" : "moon-waning-crescent"}
      onPress={toggleTheme}
      variant="outline"
    />
  );
};
```

---

## Complete Screen Example

Here's how all these components work together in a real screen:

```tsx
import React, { useState } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useTheme } from '../theme';
import { Card, FAB, Badge, Avatar, Toast, BottomSheet, SkeletonCard } from '../components/ui';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

const MatchesScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { data, isLoading, refetch } = useGetMatchesQuery();
  const [showToast, setShowToast] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const renderMatch = ({ item, index }) => (
    <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
      <Card
        onPress={() => navigation.navigate('MatchDetail', { id: item.id })}
        style={{ marginBottom: theme.spacing.md }}
      >
        <View style={{ padding: theme.spacing.base }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={theme.typography.titleLarge}>{item.title}</Text>
            <Badge label={item.status} variant="success" />
          </View>
          
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: theme.spacing.sm }}>
            <Avatar name={item.host.username} size="small" />
            <Text style={[theme.typography.bodySmall, { marginLeft: theme.spacing.sm }]}>
              {item.host.username}
            </Text>
          </View>
        </View>
      </Card>
    </Animated.View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <FlatList
        data={data}
        renderItem={renderMatch}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : (
            <EmptyState />
          )
        }
      />

      <FAB
        icon="plus"
        onPress={() => navigation.navigate('CreateMatch')}
        variant="primary"
      />

      <BottomSheet
        visible={showFilters}
        onClose={() => setShowFilters(false)}
      >
        <View style={{ padding: theme.spacing.base }}>
          <Text style={theme.typography.titleLarge}>Filters</Text>
          <Input label="Sport" />
          <Button title="Apply" fullWidth />
        </View>
      </BottomSheet>

      {showToast && (
        <Toast
          message="Match created successfully!"
          type="success"
          onDismiss={() => setShowToast(false)}
        />
      )}
    </View>
  );
};
```

---

## Best Practices

### 1. Always Use Theme Values
```tsx
// ❌ Bad
<View style={{ backgroundColor: '#007AFF', padding: 16 }}>

// ✅ Good
<View style={{ 
  backgroundColor: theme.colors.primary,
  padding: theme.spacing.base 
}}>
```

### 2. Use Typography Styles
```tsx
// ❌ Bad
<Text style={{ fontSize: 24, fontWeight: 'bold' }}>

// ✅ Good
<Text style={theme.typography.headlineMedium}>
```

### 3. Combine Styles Properly
```tsx
<Text style={[
  theme.typography.bodyLarge,
  { color: theme.colors.textSecondary, marginTop: theme.spacing.md }
]}>
```

### 4. Use Semantic Color Names
```tsx
// ❌ Bad
backgroundColor: theme.colors.blue

// ✅ Good
backgroundColor: theme.colors.primary
```

### 5. Leverage Component Props
```tsx
// Use variant, size, and other props instead of custom styles
<Button variant="outline" size="large" fullWidth />
```

---

## ParticipantList

The `ParticipantList` component provides a reusable interface for displaying participants, members, or team rosters with consistent styling.

### Basic Usage
```tsx
import { ParticipantList } from '../components/ui';

<ParticipantList
  participants={match.participants}
  title="Participants"
  organizerId={match.createdBy}
/>
```

### With Empty State
```tsx
<ParticipantList
  participants={tournament.participants}
  title="Participants"
  organizerId={tournament.createdBy}
  emptyIcon="account-group-outline"
  emptyTitle="No participants yet"
  emptyMessage="Be the first to join this tournament!"
/>
```

### With Seed Display (Tournaments)
```tsx
<ParticipantList
  participants={tournament.participants}
  title="Tournament Bracket"
  organizerId={tournament.createdBy}
  showSeed={true}
/>
```

### Props
- `participants`: Array of participant objects with `userId`, `username`/`name`, `joinedAt`, `role`, `seed`
- `title`: Header title (default: "Participants")
- `organizerId`: ID to mark organizer with crown badge
- `emptyIcon`: Icon for empty state
- `emptyTitle`: Title for empty state
- `emptyMessage`: Message for empty state
- `showSeed`: Display tournament seeds (default: false)

---

## EmptyState

The `EmptyState` component displays a consistent empty state across all list views.

### Basic Usage
```tsx
import { EmptyState } from '../components/ui';

<EmptyState
  icon="soccer-field"
  title="No matches found"
  message="Create your first match to get started"
/>
```

### In FlatList
```tsx
<FlatList
  data={items}
  renderItem={renderItem}
  ListEmptyComponent={
    <EmptyState
      icon="account-group-outline"
      title="No teams yet"
      message="Create your first team"
    />
  }
/>
```

### Props
- `icon`: Material Community Icon name
- `title`: Main heading text
- `message`: Optional descriptive text
- `iconSize`: Icon size in pixels (default: 64)

---

## SportSelector

The `SportSelector` component provides a chip-based interface for selecting sports.

### Basic Usage
```tsx
import { SportSelector } from '../components/ui';

<SportSelector
  selectedSport={formData.sport}
  onSelect={(sport) => setFormData({...formData, sport})}
  error={errors.sport}
/>
```

### Features
- Displays all available sports from `SPORTS` constant
- Chip-based selection with icons
- Selected state highlighting
- Error message display
- Wraps automatically for responsive layout

---

## DetailRow

The `DetailRow` component displays key-value pairs with icons in detail screens.

### Basic Usage
```tsx
import { DetailRow } from '../components/ui';

<DetailRow
  icon="calendar"
  label="Date"
  value={format(new Date(match.date), 'MMM dd, yyyy')}
/>
```

### Multiple Details
```tsx
<View>
  <DetailRow
    icon="map-marker"
    label="Location"
    value={venue.address}
  />
  <DetailRow
    icon="clock-outline"
    label="Time"
    value={format(new Date(match.time), 'HH:mm')}
  />
  <DetailRow
    icon="account-group"
    label="Participants"
    value={`${match.participants.length} / ${match.maxParticipants}`}
  />
</View>
```

### Props
- `icon`: Material Community Icon name
- `label`: Field label text
- `value`: Field value text or React node

---

## SectionHeader

The `SectionHeader` component provides consistent section titles with optional actions.

### Basic Usage
```tsx
import { SectionHeader } from '../components/ui';

<SectionHeader title="Match Details" />
```

### With Icon
```tsx
<SectionHeader
  title="Team Members"
  icon="account-group"
/>
```

### With Action Button
```tsx
<SectionHeader
  title="Participants"
  rightElement={
    <Button
      title="Invite"
      size="small"
      variant="text"
      onPress={handleInvite}
    />
  }
/>
```

---

This component library provides everything needed to build modern, consistent, and accessible React Native UIs. All components are theme-aware and work seamlessly in both light and dark modes.
