import React, { memo } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  text?: string;
  color?: string;
  className?: string;
}

export const LoadingSpinner = memo<LoadingSpinnerProps>(({
  size = 'small',
  text,
  color = '#3b82f6',
  className = '',
}) => {
  const spinnerSize = size === 'large' ? 'large' : 'small';

  if (text) {
    return (
      <Animated.View 
        entering={FadeIn}
        className={`flex-1 items-center justify-center ${className}`}
      >
        <ActivityIndicator size={spinnerSize} color={color} />
        <Text className="text-secondary-600 text-base mt-4 text-center">
          {text}
        </Text>
      </Animated.View>
    );
  }

  return (
    <Animated.View 
      entering={FadeIn}
      className={`items-center justify-center p-4 ${className}`}
    >
      <ActivityIndicator size={spinnerSize} color={color} />
    </Animated.View>
  );
});