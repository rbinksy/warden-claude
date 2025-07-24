import React, { memo } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import type { IoniconsName } from '../../types/ui';

interface EmptyStateProps {
  icon: IoniconsName;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export const EmptyState = memo<EmptyStateProps>(({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
}) => {
  return (
    <View className="flex-1 items-center justify-center px-8">
      <Animated.View 
        entering={FadeIn.delay(200)}
        className="items-center"
      >
        {/* Icon */}
        <View className="w-24 h-24 bg-secondary-100 rounded-full items-center justify-center mb-6">
          <Ionicons name={icon} size={48} color="#64748b" />
        </View>

        {/* Title */}
        <Text className="text-2xl font-bold text-secondary-900 text-center mb-3">
          {title}
        </Text>

        {/* Description */}
        <Text className="text-base text-secondary-600 text-center leading-6 mb-8">
          {description}
        </Text>
      </Animated.View>

      {/* Actions */}
      {(actionLabel || secondaryActionLabel) && (
        <Animated.View 
          entering={SlideInDown.delay(400)}
          className="w-full max-w-xs"
        >
          {/* Primary Action */}
          {actionLabel && onAction && (
            <Pressable
              onPress={onAction}
              className="bg-primary-600 py-4 px-6 rounded-lg items-center mb-3 active:bg-primary-700"
            >
              <Text className="text-white font-semibold text-base">
                {actionLabel}
              </Text>
            </Pressable>
          )}

          {/* Secondary Action */}
          {secondaryActionLabel && onSecondaryAction && (
            <Pressable
              onPress={onSecondaryAction}
              className="bg-secondary-100 py-4 px-6 rounded-lg items-center active:bg-secondary-200"
            >
              <Text className="text-secondary-700 font-medium text-base">
                {secondaryActionLabel}
              </Text>
            </Pressable>
          )}
        </Animated.View>
      )}
    </View>
  );
});