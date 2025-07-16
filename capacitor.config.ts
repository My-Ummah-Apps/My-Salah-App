import * as dotenv from "dotenv";
import { resolve } from "path";
dotenv.config({ path: resolve(__dirname, ".env") });
import { CapacitorConfig } from "@capacitor/cli";
import { KeyboardResize } from "@capacitor/keyboard";

const isProd = process.env.NODE_ENV === "production";

const serverConfig =
  !isProd && process.env.DEV_SERVER_IP
    ? {
        url: process.env.DEV_SERVER_IP,
        cleartext: true,
      }
    : undefined;

// const serverConfig = { url: process.env.DEV_SERVER_IP, cleartext: true };

const config: CapacitorConfig = {
  appId: "com.mysalahapp.app",
  appName: "My Salah App",
  webDir: "dist",
  // server: serverConfig,
  plugins: {
    LocalNotifications: {
      smallIcon: "res:///ic_stat_name",
      iconColor: "#26a1d5",
    },
    keyboard: {
      // resize: "none"
      // resize: KeyboardResize.Native,
      resizeOnFullScreen: false,
    },
    // EdgeToEdge: {
    //   backgroundColor: "#ffffff",
    // },
    SplashScreen: {
      launchAutoHide: false,
      // backgroundColor: "#1010101010",
    },
    CapacitorSQLite: {
      iosIsEncryption: true,
      iosKeychainPrefix: "my-salah-app-data",
      iosBiometric: {
        biometricAuth: false,
      },
      androidIsEncryption: true,
      androidBiometric: {
        biometricAuth: false,
      },
    },
  },
};

export default config;
