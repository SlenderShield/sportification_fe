/**
 * Lottie Animation Sources
 * Central location for managing Lottie animation file references
 * 
 * To add animations:
 * 1. Download Lottie JSON files and place them in src/assets/animations/
 * 2. Uncomment the corresponding require() statement below
 * 3. The app will automatically use the animations
 */

// Loading Animations
export const loadingAnimation = null;
// Uncomment when animation file is added:
// export const loadingAnimation = require('./loading.json');

// Notification Animations  
export const successAnimation = null;
// Uncomment when animation file is added:
// export const successAnimation = require('./success.json');

export const errorAnimation = null;
// Uncomment when animation file is added:
// export const errorAnimation = require('./error.json');

// Empty State Animations
export const emptyMatchesAnimation = null;
// Uncomment when animation file is added:
// export const emptyMatchesAnimation = require('./empty-matches.json');

export const emptyTeamsAnimation = null;
// Uncomment when animation file is added:
// export const emptyTeamsAnimation = require('./empty-teams.json');

export const emptyTournamentsAnimation = null;
// Uncomment when animation file is added:
// export const emptyTournamentsAnimation = require('./empty-tournaments.json');

export const emptyVenuesAnimation = null;
// Uncomment when animation file is added:
// export const emptyVenuesAnimation = require('./empty-venues.json');

export const emptyChatsAnimation = null;
// Uncomment when animation file is added:
// export const emptyChatsAnimation = require('./empty-chats.json');

export const emptyFriendsAnimation = null;
// Uncomment when animation file is added:
// export const emptyFriendsAnimation = require('./empty-friends.json');

export const emptyNotificationsAnimation = null;
// Uncomment when animation file is added:
// export const emptyNotificationsAnimation = require('./empty-notifications.json');

// Special Animations
export const celebrationAnimation = null;
// Uncomment when animation file is added:
// export const celebrationAnimation = require('./celebration.json');

// Onboarding Animations
export const onboardingWelcomeAnimation = null;
// Uncomment when animation file is added:
// export const onboardingWelcomeAnimation = require('./onboarding-welcome.json');

export const onboardingFeaturesAnimation = null;
// Uncomment when animation file is added:
// export const onboardingFeaturesAnimation = require('./onboarding-features.json');

export const onboardingSetupAnimation = null;
// Uncomment when animation file is added:
// export const onboardingSetupAnimation = require('./onboarding-setup.json');

/**
 * Helper function to check if an animation is available
 */
export const hasAnimation = (animation: any): boolean => {
  return animation !== null && animation !== undefined;
};
