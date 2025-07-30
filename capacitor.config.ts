import * as dotenv from "dotenv";
import { resolve } from "path";
dotenv.config({ path: resolve(__dirname, ".env") });
import { CapacitorConfig } from "@capacitor/cli";
import { KeyboardResize } from "@capacitor/keyboard";

// const isDevelopment = process.env.NODE_ENV === "development";

// const serverConfig =
//   isDevelopment && process.env.VITE_DEV_SERVER_IP
//     ? {
//         url: process.env.VITE_DEV_SERVER_IP,
//         cleartext: true,
//       }
//     : undefined;

const config: CapacitorConfig = {
  appId: "com.mysalahapp.app",
  appName: "My Salah App",
  webDir: "dist",
  // server: serverConfig,
  server: {
    // url: isDevelopment ? process.env.VITE_DEV_SERVER_IP : undefined,
    url: process.env.VITE_DEV_SERVER_IP,
    cleartext: true,
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "res:///ic_stat_name",
      iconColor: "#26a1d5",
    },
    keyboard: {
      // resize: "none",
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
