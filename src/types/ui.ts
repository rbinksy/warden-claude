// UI-specific types for the mobile wargaming app

import type { ComponentProps } from 'react';
import type { Ionicons } from '@expo/vector-icons';

// Icon types
export type IoniconsName = ComponentProps<typeof Ionicons>['name'];

// Theme colors
export interface ThemeColors {
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
  secondary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
  danger: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
  success: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
  warning: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
    950: string;
  };
}

// Component size variants
export type ComponentSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Component variants
export type ComponentVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger';

// Button types
export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ComponentVariant;
  size?: ComponentSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: IoniconsName;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  className?: string;
}

// Input types
export interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  numberOfLines?: number;
  icon?: IoniconsName;
  className?: string;
}

// Card types
export interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: ComponentSize;
  className?: string;
}

// Modal types
export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  position?: 'center' | 'bottom';
  animated?: boolean;
  backdrop?: boolean;
  backdropOpacity?: number;
}

// Toast types
export interface ToastProps {
  message: string;
  type?: ComponentVariant;
  duration?: number;
  position?: 'top' | 'bottom';
  action?: {
    label: string;
    onPress: () => void;
  };
}

// List types
export interface ListItemProps {
  title: string;
  subtitle?: string;
  description?: string;
  leftIcon?: IoniconsName;
  rightIcon?: IoniconsName;
  onPress?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  selected?: boolean;
  className?: string;
}

// Swipe action types
export interface SwipeAction {
  id: string;
  label: string;
  icon: IoniconsName;
  color: string;
  backgroundColor: string;
  onPress: () => void;
}

export interface SwipeableProps {
  children: React.ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  threshold?: number;
}

// Progress types
export interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  backgroundColor?: string;
  height?: number;
  animated?: boolean;
  showLabel?: boolean;
  className?: string;
}

// Badge types
export interface BadgeProps {
  text: string;
  variant?: ComponentVariant;
  size?: ComponentSize;
  icon?: IoniconsName;
  className?: string;
}

// Avatar types
export interface AvatarProps {
  source?: { uri: string } | number;
  name?: string;
  size?: ComponentSize;
  backgroundColor?: string;
  textColor?: string;
  className?: string;
}

// Chip types
export interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  onDelete?: () => void;
  icon?: IoniconsName;
  variant?: ComponentVariant;
  size?: ComponentSize;
  className?: string;
}

// Search types
export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSubmit?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  autoFocus?: boolean;
  showCancel?: boolean;
  onCancel?: () => void;
  className?: string;
}

// Tab types
export interface TabItem {
  id: string;
  label: string;
  icon?: IoniconsName;
  badge?: number;
}

export interface TabBarProps {
  items: TabItem[];
  activeTab: string;
  onTabPress: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  className?: string;
}

// Accordion types
export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: IoniconsName;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpen?: string[];
  className?: string;
}

// Skeleton types
export interface SkeletonProps {
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
  animated?: boolean;
  className?: string;
}

// Divider types
export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  thickness?: number;
  color?: string;
  className?: string;
}

// Layout types
export interface SpacingProps {
  margin?: ComponentSize;
  marginTop?: ComponentSize;
  marginRight?: ComponentSize;
  marginBottom?: ComponentSize;
  marginLeft?: ComponentSize;
  marginHorizontal?: ComponentSize;
  marginVertical?: ComponentSize;
  padding?: ComponentSize;
  paddingTop?: ComponentSize;
  paddingRight?: ComponentSize;
  paddingBottom?: ComponentSize;
  paddingLeft?: ComponentSize;
  paddingHorizontal?: ComponentSize;
  paddingVertical?: ComponentSize;
}

// Animation types
export type AnimationType = 
  | 'fadeIn' 
  | 'fadeOut' 
  | 'slideInLeft' 
  | 'slideInRight' 
  | 'slideInUp' 
  | 'slideInDown'
  | 'slideOutLeft' 
  | 'slideOutRight' 
  | 'slideOutUp' 
  | 'slideOutDown'
  | 'scaleIn' 
  | 'scaleOut'
  | 'bounce'
  | 'pulse';

export interface AnimationProps {
  type: AnimationType;
  duration?: number;
  delay?: number;
  easing?: 'linear' | 'easeIn' | 'easeOut' | 'easeInOut';
  loop?: boolean;
}

// Gesture types
export interface GestureProps {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  onPinch?: (scale: number) => void;
  onRotate?: (rotation: number) => void;
  swipeThreshold?: number;
}

// Accessibility types
export interface AccessibilityProps {
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: 'button' | 'link' | 'text' | 'image' | 'header' | 'search' | 'none';
  accessibilityState?: {
    disabled?: boolean;
    selected?: boolean;
    checked?: boolean | 'mixed';
    busy?: boolean;
    expanded?: boolean;
  };
  accessibilityValue?: {
    min?: number;
    max?: number;
    now?: number;
    text?: string;
  };
}

// Form types
export interface FormFieldProps extends AccessibilityProps {
  name: string;
  required?: boolean;
  validation?: (value: any) => string | undefined;
}

// Data display types
export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: IoniconsName;
  color?: ComponentVariant;
  trend?: {
    value: number;
    direction: 'up' | 'down';
    label?: string;
  };
  className?: string;
}