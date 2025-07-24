import { ExpoConfig, ConfigContext } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'Wargaming Roster Builder',
  slug: 'wargaming-roster-builder',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'automatic',
  scheme: 'wargaming-roster-builder',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#1f2937'
  },
  assetBundlePatterns: [
    '**/*'
  ],
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.wargaming.rosterbuilder',
    buildNumber: '1',
    infoPlist: {
      NSCameraUsageDescription: 'This app uses the camera to scan army lists and capture unit photos',
      NSPhotoLibraryUsageDescription: 'This app accesses photo library to import army list images and unit photos',
      NSMicrophoneUsageDescription: 'This app may use microphone for voice notes during army building',
      LSApplicationQueriesSchemes: ['mailto', 'tel']
    },
    config: {
      usesNonExemptEncryption: false
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#1f2937'
    },
    package: 'com.wargaming.rosterbuilder',
    versionCode: 1,
    permissions: [
      'CAMERA',
      'READ_EXTERNAL_STORAGE',
      'WRITE_EXTERNAL_STORAGE',
      'RECEIVE_BOOT_COMPLETED',
      'VIBRATE',
      'ACCESS_NETWORK_STATE',
      'INTERNET'
    ],
    allowBackup: false
  },
  web: {
    favicon: './assets/favicon.png',
    bundler: 'metro'
  },
  plugins: [
    'expo-router',
    [
      'expo-camera',
      {
        cameraPermission: 'Allow Wargaming Roster Builder to access your camera to scan army lists.',
        microphonePermission: false
      }
    ],
    [
      'expo-notifications',
      {
        icon: './assets/notification-icon.png',
        color: '#3b82f6',
        sounds: ['./assets/notification-sound.wav']
      }
    ],
    [
      'expo-image-picker',
      {
        photosPermission: 'Allow Wargaming Roster Builder to access your photos to import army lists.'
      }
    ],
    [
      'expo-build-properties',
      {
        android: {
          compileSdkVersion: 34,
          targetSdkVersion: 34,
          buildToolsVersion: '34.0.0',
          proguardMinifyEnabled: true
        },
        ios: {
          deploymentTarget: '13.0',
          useFrameworks: 'static'
        }
      }
    ],
    [
      'expo-sqlite',
      {
        enableFTS: true
      }
    ]
  ],
  extra: {
    router: {
      origin: false
    },
    eas: {
      projectId: 'your-project-id-here'
    }
  },
  updates: {
    url: 'https://u.expo.dev/your-project-id-here'
  },
  runtimeVersion: {
    policy: 'appVersion'
  },
  experiments: {
    typedRoutes: true
  }
});