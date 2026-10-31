import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.tilawah.app',
  appName: 'Tilawah',
  webDir: 'out',

  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: true,
  },

  ios: {
    contentInset: 'always',
    scrollEnabled: true,
  },

  plugins: {
    LocalNotifications: {
      // White crescent (android/app/src/main/res/drawable/ic_stat_prayer.xml);
      // the adhan sound is set per notification channel in nativeNotifications.ts
      smallIcon: 'ic_stat_prayer',
      iconColor: '#10b981',
    },
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: '#0a0a0a',
      showSpinner: false,
      androidSplashResourceName: 'splash',
    },
  },
};

export default config;
