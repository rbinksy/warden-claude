import React, { useMemo, useCallback } from 'react';
import { View, Text, FlatList, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { useArmyStore } from '../../../stores/armyStore';
import { ArmyCard } from '../../../components/army/ArmyCard';
import { EmptyState } from '../../../components/ui/EmptyState';
import { LoadingSpinner } from '../../../components/ui/LoadingSpinner';
import { FloatingActionButton } from '../../../components/ui/FloatingActionButton';
import type { Army } from '../../../types/army';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function ArmiesScreen() {
  const { 
    armies, 
    isLoading, 
    error, 
    loadArmies, 
    deleteArmy, 
    clearError 
  } = useArmyStore();

  // Memoize sorted armies for performance
  const sortedArmies = useMemo(() => 
    armies.sort((a, b) => b.updatedAt - a.updatedAt),
    [armies]
  );

  // Handle army press with haptic feedback
  const handleArmyPress = useCallback((army: Army) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(`/armies/${army.id}`);
  }, []);

  // Handle army edit
  const handleArmyEdit = useCallback((army: Army) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push(`/armies/builder?id=${army.id}`);
  }, []);

  // Handle army delete with confirmation
  const handleArmyDelete = useCallback((army: Army) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    
    Alert.alert(
      'Delete Army',
      `Are you sure you want to delete "${army.name}"? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteArmy(army.id),
        },
      ]
    );
  }, [deleteArmy]);

  // Handle create new army
  const handleCreateArmy = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push('/armies/builder');
  }, []);

  // Handle retry on error
  const handleRetry = useCallback(() => {
    clearError();
    loadArmies();
  }, [clearError, loadArmies]);

  // Render army item
  const renderArmyItem = useCallback(({ item: army, index }: { item: Army; index: number }) => (
    <AnimatedPressable
      entering={FadeInDown.delay(index * 100)}
      style={{ marginHorizontal: 16, marginBottom: 12 }}
    >
      <ArmyCard
        army={army}
        onPress={handleArmyPress}
        onEdit={handleArmyEdit}
        onDelete={handleArmyDelete}
      />
    </AnimatedPressable>
  ), [handleArmyPress, handleArmyEdit, handleArmyDelete]);

  // Show loading state
  if (isLoading && armies.length === 0) {
    return (
      <SafeAreaView className="safe-area">
        <LoadingSpinner size="large" text="Loading armies..." />
      </SafeAreaView>
    );
  }

  // Show error state
  if (error && armies.length === 0) {
    return (
      <SafeAreaView className="safe-area">
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="warning-outline" size={48} color="#ef4444" />
          <Text className="text-lg font-semibold text-secondary-900 mt-4 text-center">
            Failed to Load Armies
          </Text>
          <Text className="error-text mt-2 text-center">
            {error}
          </Text>
          <Pressable
            onPress={handleRetry}
            className="bg-primary-600 px-6 py-3 rounded-lg mt-6"
          >
            <Text className="text-white font-semibold">Try Again</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="safe-area">
      <View className="flex-1">
        {sortedArmies.length === 0 ? (
          <EmptyState
            icon="shield-outline"
            title="No Armies Yet"
            description="Create your first army to get started with roster building."
            actionLabel="Create Army"
            onAction={handleCreateArmy}
          />
        ) : (
          <>
            {/* Army Statistics Header */}
            <View className="bg-white mx-4 mt-4 p-4 rounded-lg card-shadow">
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="text-2xl font-bold text-secondary-900">
                    {sortedArmies.length}
                  </Text>
                  <Text className="text-sm text-secondary-600">
                    {sortedArmies.length === 1 ? 'Army' : 'Armies'}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-lg font-semibold text-primary-600">
                    {sortedArmies.reduce((total, army) => total + army.totalPoints, 0).toLocaleString()}
                  </Text>
                  <Text className="text-sm text-secondary-600">Total Points</Text>
                </View>
              </View>
            </View>

            {/* Army List */}
            <FlatList
              data={sortedArmies}
              renderItem={renderArmyItem}
              keyExtractor={(army) => army.id}
              contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
              showsVerticalScrollIndicator={false}
              removeClippedSubviews={true}
              maxToRenderPerBatch={10}
              windowSize={10}
              initialNumToRender={8}
            />
          </>
        )}

        {/* Floating Action Button */}
        <FloatingActionButton
          icon="add"
          onPress={handleCreateArmy}
          accessibilityLabel="Create new army"
        />

        {/* Error Toast */}
        {error && armies.length > 0 && (
          <View className="absolute bottom-20 left-4 right-4">
            <View className="bg-danger-50 border border-danger-200 rounded-lg p-4 flex-row items-center">
              <Ionicons name="warning" size={20} color="#dc2626" />
              <Text className="error-text flex-1 ml-3">{error}</Text>
              <Pressable onPress={clearError} className="ml-2">
                <Ionicons name="close" size={20} color="#dc2626" />
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}