import {
  AuthProvider,
  FirebaseAppProvider,
  FirestoreProvider,
  StorageProvider,
  useFirebaseApp,
  useInitAuth,
} from "reactfire";
import { connectAuthEmulator, getAuth, initializeAuth } from "firebase/auth";
import { getReactNativePersistence } from "firebase/auth/react-native";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { Material3ThemeProvider } from "@/lib/Material3ThemeProvider";
import { Stack } from "expo-router";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialNavBar from "@/components/material-nav-bar";

GoogleSignin.configure({
  webClientId:
    "692675967448-mi9d4ejodgar25d6hed75582f7ddh8vd.apps.googleusercontent.com",
});

export const firebaseConfig = {
  apiKey: "AIzaSyDAd_anZDfjCFs5OVhWVgYDAbi2Hy1AJ2Y",
  authDomain: "emberpay-iac.firebaseapp.com",
  projectId: "emberpay-iac",
  storageBucket: "emberpay-iac.appspot.com",
  messagingSenderId: "692675967448",
  appId: "1:692675967448:web:00d56d1233bafd64481aad",
};

export function FirebaseProviders({ children }: { children: React.ReactNode }) {
  const app = useFirebaseApp();
  const firestore = getFirestore(app);
  const storage = getStorage(app);
  const { status: authInitStatus, data: auth } = useInitAuth(async (app) => {
    try {
      return initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    } catch {
      // Already initialized
      return getAuth(app);
    }
  });

  if (authInitStatus === "loading") {
    return null;
  }

  if (__DEV__) {
    connectFirestoreEmulator(firestore, "localhost", 8080);
    connectStorageEmulator(storage, "localhost", 9199);
    // https://github.com/firebase/firebase-js-sdk/issues/6824
    // @ts-ignore
    if (!auth.config.emulator) {
      connectAuthEmulator(auth, "http://localhost:9099");
    }
  }

  return (
    <AuthProvider sdk={auth}>
      <FirestoreProvider sdk={firestore}>
        <StorageProvider sdk={storage}>{children}</StorageProvider>
      </FirestoreProvider>
    </AuthProvider>
  );
}

export default function RootLayout() {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <FirebaseProviders>
        <Material3ThemeProvider sourceColor="#fbc02d">
          <Stack
            screenOptions={{
              header: (props) => <MaterialNavBar {...props} />,
              headerShown: false,
              animation: "fade_from_bottom",
            }}
          >
            <Stack.Screen
              name="settings"
              options={{
                headerTitle: "Settings",
                headerShown: true,
              }}
            />
          </Stack>
        </Material3ThemeProvider>
      </FirebaseProviders>
    </FirebaseAppProvider>
  );
}
