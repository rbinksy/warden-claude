import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: Platform.OS === 'ios' ? 'transparent' : '#1f2937',
          borderTopColor: '#374151',
          borderTopWidth: 1,
          paddingBottom: Platform.OS === 'ios' ? 20 : 5,
          height: Platform.OS === 'ios' ? 85 : 60,
        },
        tabBarBackground: Platform.OS === 'ios' ? () => (
          <BlurView intensity={95} style={{ flex: 1 }} />
        ) : undefined,
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: '#1f2937',
          shadowColor: 'transparent',
          elevation: 0,
        },
        headerTintColor: '#f9fafb',
        headerTitleStyle: {
          fontWeight: '700',
          fontSize: 18,
        },
      }}
    >
      <Tabs.Screen
        name="armies"
        options={{
          title: 'Armies',
          headerTitle: 'My Armies',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? 'shield' : 'shield-outline'} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="units"
        options={{
          title: 'Units',
          headerTitle: 'Unit Browser',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? 'people' : 'people-outline'} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="tournaments"
        options={{
          title: 'Tournaments',
          headerTitle: 'Tournaments',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? 'trophy' : 'trophy-outline'} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerTitle: 'Profile & Settings',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons 
              name={focused ? 'person' : 'person-outline'} 
              size={size} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}