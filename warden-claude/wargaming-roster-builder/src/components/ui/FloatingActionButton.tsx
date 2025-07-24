import React, { memo, useCallback } from 'react';
import { Pressable, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring,
  SlideInDown
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import type { IoniconsName } from '../../types/ui';

interface FloatingActionButtonProps {
  icon: IoniconsName;
  onPress: () => void;
  accessibilityLabel: string;
  backgroundColor?: string;
  iconColor?: string;
  position?: 'bottom-right' | 'bottom-center';
  size?: 'normal' | 'large';
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const FloatingActionButton = memo<FloatingActionButtonProps>(({
  icon,
  onPress,
  accessibilityLabel,
  backgroundColor = '#3b82f6',
  iconColor = '#ffffff',
  position = 'bottom-right',
  size = 'normal',
}) => {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.9);
    rotate.value = withSpring(15);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, []);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1);
    rotate.value = withSpring(0);
  }, []);

  const handlePress = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  }, [onPress]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  const sizeClass = size === 'large' ? 'w-16 h-16' : 'w-14 h-14';
  const iconSize = size === 'large' ? 28 : 24;
  
  const positionClass = position === 'bottom-center' 
    ? 'bottom-6 self-center' 
    : 'bottom-6 right-6';

  return (
    <AnimatedPressable
      entering={SlideInDown.delay(600)}
      style={[
        animatedStyle,
        {
          position: 'absolute',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }
      ]}
      className={`${sizeClass} ${positionClass} rounded-full overflow-hidden`}
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      {Platform.OS === 'ios' ? (
        <BlurView 
          intensity={95} 
          style={{ 
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center',
            backgroundColor: `${backgroundColor}cc`,
          }}
        >
          <Ionicons name={icon} size={iconSize} color={iconColor} />
        </BlurView>
      ) : (
        <Animated.View 
          style={{ 
            flex: 1, 
            backgroundColor,
            justifyContent: 'center', 
            alignItems: 'center',
          }}
        >
          <Ionicons name={icon} size={iconSize} color={iconColor} />
        </Animated.View>
      )}
    </AnimatedPressable>
  );
});