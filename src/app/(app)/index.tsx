import { User as FireStoreUser } from "@/types";
import { User } from "firebase/auth";
import { DocumentReference, doc } from "firebase/firestore";
import { View, StyleSheet, Image } from "react-native";
import { ActivityIndicator, Button, Surface, Text } from "react-native-paper";
import { useAuth, useFirestore, useFirestoreDocData, useUser } from "reactfire";
import QRCode from "react-native-qrcode-svg";
import { useAppTheme } from "@/lib/Material3ThemeProvider";
import { useState } from "react";
import { router } from "expo-router";
import { FirebaseError } from "firebase/app";

export default function IndexScreen() {
  const { status: userStatus, data: user } = useUser();

  if (userStatus === "loading" || !user) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }
  return <Home user={user} />;
}

function Home({ user }: { user: User }) {
  const firestore = useFirestore();
  const theme = useAppTheme();
  const userDocRef = doc(
    firestore,
    "users",
    user.uid
  ) as DocumentReference<FireStoreUser>;
  try {
    const { status: userDocStatus, data: userData } =
      useFirestoreDocData(userDocRef);
    const [isReceiveVisible, setIsReceiveVisible] = useState(false);
    if (userDocStatus === "loading" || !userData) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.userContainer}>
          <Image
            source={
              user.photoURL
                ? { uri: user.photoURL }
                : require("@/assets/images/avatar-3.png")
            }
            style={styles.avatarImage}
          />
          <Text variant="headlineSmall">
            Welcome back, {user.displayName?.split(" ")[0]}!
          </Text>
        </View>
        {!isReceiveVisible ? (
          <Surface style={styles.walletCard}>
            <View>
              <Text variant="headlineLarge">
                {userData.balance.toLocaleString("en-PH", {
                  style: "currency",
                  currency: "PHP",
                })}
              </Text>
              <Text variant="labelMedium">Wallet Balance</Text>
            </View>
            <View style={styles.walletCardActions}>
              <Button
                mode="contained-tonal"
                style={{ flex: 1 }}
                icon="qrcode"
                contentStyle={{ height: 50 }}
                onPress={() => {
                  setIsReceiveVisible(true);
                }}
              >
                Receive
              </Button>
              <Button
                mode="contained-tonal"
                style={{ flex: 1 }}
                icon="qrcode-scan"
                contentStyle={{ height: 50 }}
                onPress={() => {
                  router.push("/scan");
                }}
              >
                Send
              </Button>
            </View>
          </Surface>
        ) : (
          <Surface style={[styles.walletCard, { alignItems: "center" }]}>
            <Text variant="titleLarge">Receive Money</Text>
            <QRCode
              value={`emberpay:${user.uid}`}
              logo={require("@/assets/images/icon.png")}
              backgroundColor="transparent"
              color={theme.colors.inverseSurface}
              size={180}
            />
            <View style={styles.walletCardActions}>
              <Button
                mode="contained-tonal"
                style={{ flex: 1 }}
                icon="eye"
                contentStyle={{ height: 50 }}
                onPress={() => {
                  setIsReceiveVisible(false);
                }}
              >
                Hide
              </Button>
            </View>
          </Surface>
        )}
      </View>
    );
  } catch (e) {
    if (e instanceof FirebaseError) {
      console.log(e);
    } else {
      throw e;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: "6%",
  },
  userContainer: {
    alignItems: "center",
    marginBottom: 25,
    gap: 10,
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  walletCard: {
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 10,
    gap: 20,
  },
  walletCardActions: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
});
