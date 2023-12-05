import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.mysalah.app',
  appName: 'My Salah App',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
