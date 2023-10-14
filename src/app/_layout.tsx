import { Material3ThemeProvider } from "@/lib/Material3ThemeProvider";
import { Stack } from "expo-router";
import { Appbar } from "react-native-paper";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import {
  AuthProvider,
  FirebaseAppProvider,
  FirestoreProvider,
  StorageProvider,
  useFirebaseApp,
  useInitAuth,
} from "reactfire";
import { connectAuthEmulator, initializeAuth } from "firebase/auth";
import { reactNativeLocalPersistence } from "firebase/auth/react-native";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDAd_anZDfjCFs5OVhWVgYDAbi2Hy1AJ2Y",
  authDomain: "emberpay-iac.firebaseapp.com",
  projectId: "emberpay-iac",
  storageBucket: "emberpay-iac.appspot.com",
  messagingSenderId: "692675967448",
  appId: "1:692675967448:web:00d56d1233bafd64481aad",
};

function Navbar({ navigation, back }: NativeStackHeaderProps) {
  return (
    <Appbar.Header elevated={true}>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title="EmberPay" />
    </Appbar.Header>
  );
}

function FirebaseProviders({ children }: { children: React.ReactNode }) {
  const app = useFirebaseApp();
  const firestore = getFirestore(app);
  const storage = getStorage(app);
  const { status: authInitStatus, data: auth } = useInitAuth(async (app) =>
    initializeAuth(app, {
      persistence: reactNativeLocalPersistence,
    })
  );

  if (authInitStatus === "loading") {
    return null;
  }

  if (__DEV__) {
    connectFirestoreEmulator(firestore, "localhost", 8080);
    connectAuthEmulator(auth, "http://localhost:9099");
    connectStorageEmulator(storage, "localhost", 9199);
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
              header: (props) => <Navbar {...props} />,
            }}
          />
        </Material3ThemeProvider>
      </FirebaseProviders>
    </FirebaseAppProvider>
  );
}
