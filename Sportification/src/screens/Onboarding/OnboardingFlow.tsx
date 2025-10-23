/**
 * Onboarding Flow Container
 * Manages the onboarding screens and navigation
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import OnboardingWelcomeScreen from './OnboardingWelcomeScreen';
import OnboardingFeaturesScreen from './OnboardingFeaturesScreen';
import OnboardingPermissionsScreen from './OnboardingPermissionsScreen';
import OnboardingCompleteScreen from './OnboardingCompleteScreen';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [currentScreen, setCurrentScreen] = useState(0);

  const handleNext = () => {
    setCurrentScreen(prev => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentScreen(prev => Math.max(prev - 1, 0));
  };

  const handleSkip = () => {
    onComplete();
  };

  const handleComplete = () => {
    onComplete();
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 0:
        return (
          <OnboardingWelcomeScreen
            onNext={handleNext}
            onSkip={handleSkip}
          />
        );
      case 1:
        return (
          <OnboardingFeaturesScreen
            onNext={handleNext}
            onBack={handleBack}
            onSkip={handleSkip}
          />
        );
      case 2:
        return (
          <OnboardingPermissionsScreen
            onNext={handleNext}
            onBack={handleBack}
            onSkip={handleSkip}
          />
        );
      case 3:
        return (
          <OnboardingCompleteScreen
            onComplete={handleComplete}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  return <View style={styles.container}>{renderScreen()}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default OnboardingFlow;
