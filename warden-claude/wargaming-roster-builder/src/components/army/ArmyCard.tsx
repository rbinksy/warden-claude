import React, { memo, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  interpolate
} from 'react-native-reanimated';
import { PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

import type { Army } from '../../types/army';
import { formatDate, formatPoints } from '../../utils/formatters';

interface ArmyCardProps {
  army: Army;
  onPress: (army: Army) => void;
  onEdit: (army: Army) => void;
  onDelete: (army: Army) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const ArmyCard = memo<ArmyCardProps>(({ 
  army, 
  onPress, 
  onEdit, 
  onDelete 
}) => {
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  // Handle main card press
  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress(army);
  }, [army, onPress]);

  // Handle press in animation
  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.98);
  }, []);

  // Handle press out animation
  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1);
  }, []);

  // Handle swipe gestures
  const gestureHandler = useCallback((event: PanGestureHandlerGestureEvent) => {
    'worklet';
    
    const { translationX } = event.nativeEvent;
    translateX.value = translationX;
    
    // Fade out as swiping
    opacity.value = interpolate(
      Math.abs(translationX),
      [0, 100],
      [1, 0.7],
      'clamp'
    );
  }, []);

  const gestureEnd = useCallback((event: PanGestureHandlerGestureEvent) => {
    'worklet';
    
    const { translationX, velocityX } = event.nativeEvent;
    const shouldTriggerAction = Math.abs(translationX) > 80 || Math.abs(velocityX) > 500;
    
    if (shouldTriggerAction) {
      if (translationX > 0) {
        // Swipe right - Edit
        translateX.value = withSpring(0);
        opacity.value = withSpring(1);
        // Trigger haptic feedback and edit action
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onEdit(army);
      } else {
        // Swipe left - Delete
        translateX.value = withSpring(-300, undefined, () => {
          // Trigger haptic feedback and delete action
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          onDelete(army);
        });
        opacity.value = withSpring(0);
      }
    } else {
      // Snap back
      translateX.value = withSpring(0);
      opacity.value = withSpring(1);
    }
  }, [army, onEdit, onDelete]);

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { scale: scale.value }
    ],
    opacity: opacity.value,
  }));

  // Calculate completion percentage
  const completionPercentage = (army.totalPoints / army.pointsLimit) * 100;
  const isOverLimit = army.totalPoints > army.pointsLimit;

  return (
    <PanGestureHandler
      onGestureEvent={gestureHandler}
      onEnded={gestureEnd}
      activeOffsetX={[-10, 10]}
    >
      <AnimatedPressable
        style={animatedStyle}
        onPress={handlePress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className="bg-white rounded-lg card-shadow overflow-hidden"
      >
        {/* Swipe Action Hints */}
        <View className="absolute inset-0 flex-row">
          {/* Edit action (right swipe) */}
          <View className="bg-primary-100 flex-1 items-start justify-center pl-6">
            <Ionicons name="create-outline" size={24} color="#2563eb" />
            <Text className="text-primary-700 text-xs font-semibold mt-1">Edit</Text>
          </View>
          
          {/* Delete action (left swipe) */}
          <View className="bg-danger-100 flex-1 items-end justify-center pr-6">
            <Ionicons name="trash-outline" size={24} color="#dc2626" />
            <Text className="text-danger-700 text-xs font-semibold mt-1">Delete</Text>
          </View>
        </View>

        {/* Main Card Content */}
        <View className="p-4 bg-white">
          {/* Header */}
          <View className="flex-row justify-between items-start mb-3">
            <View className="flex-1 mr-3">
              <Text className="text-lg font-bold text-secondary-900" numberOfLines={1}>
                {army.name}
              </Text>
              <Text className="text-sm text-secondary-600">
                {army.gameSystemName || 'Warhammer 40,000'}
              </Text>
            </View>
            
            <View className="items-end">
              <Text className={`text-lg font-bold ${isOverLimit ? 'text-danger-600' : 'text-primary-600'}`}>
                {formatPoints(army.totalPoints)}
              </Text>
              <Text className="text-xs text-secondary-500">
                of {formatPoints(army.pointsLimit)}
              </Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View className="mb-3">
            <View className="bg-secondary-200 h-2 rounded-full overflow-hidden">
              <View 
                className={`h-full rounded-full ${isOverLimit ? 'bg-danger-500' : 'bg-primary-500'}`}
                style={{ width: `${Math.min(completionPercentage, 100)}%` }}
              />
            </View>
            <Text className={`text-xs mt-1 ${isOverLimit ? 'text-danger-600' : 'text-secondary-600'}`}>
              {completionPercentage.toFixed(1)}% complete
              {isOverLimit && ' (Over limit!)'}
            </Text>
          </View>

          {/* Army Stats */}
          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center">
              <Ionicons name="people-outline" size={16} color="#64748b" />
              <Text className="text-sm text-secondary-600 ml-1">
                {army.units.length} units
              </Text>
            </View>
            
            <View className="flex-row items-center">
              <Ionicons name="time-outline" size={16} color="#64748b" />
              <Text className="text-sm text-secondary-600 ml-1">
                {formatDate(army.updatedAt)}
              </Text>
            </View>
          </View>

          {/* Validation Status */}
          {army.validationErrors && army.validationErrors.length > 0 && (
            <View className="mt-3 bg-warning-50 border border-warning-200 rounded-lg p-2">
              <View className="flex-row items-center">
                <Ionicons name="warning" size={16} color="#d97706" />
                <Text className="text-warning-700 text-xs font-medium ml-2">
                  {army.validationErrors.length} validation issue{army.validationErrors.length !== 1 ? 's' : ''}
                </Text>
              </View>
            </View>
          )}
        </View>
      </AnimatedPressable>
    </PanGestureHandler>
  );
});