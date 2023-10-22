import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Redirect, router } from "expo-router";
import { signOut } from "firebase/auth";
import { View, StyleSheet, Image } from "react-native";
import { ActivityIndicator, Text, Divider, Drawer } from "react-native-paper";
import { useAuth, useSigninCheck } from "reactfire";

export default function HistoryScreen() {
  const { status: signInStatus, data: signInCheckResult } = useSigninCheck();
  const auth = useAuth();

  if (signInStatus === "loading") {
    return <ActivityIndicator />;
  }

  if (!signInCheckResult.signedIn || !auth.currentUser) {
    return <Redirect href="/login" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image
          source={
            auth.currentUser.photoURL
              ? { uri: auth.currentUser.photoURL }
              : require("@/assets/images/avatar-3.png")
          }
          style={styles.avatarImage}
        />
        <View>
          <Text variant="titleMedium">{auth.currentUser.displayName}</Text>
          <Text>{auth.currentUser.email}</Text>
        </View>
      </View>
      <Divider style={{ marginVertical: 15 }} />
      <Drawer.Item
        icon="logout"
        onPress={async () => {
          if (
            (await GoogleSignin.isSignedIn()) &&
            auth.currentUser?.providerData[0].providerId === "google.com"
          ) {
            await GoogleSignin.signOut();
          }
          await signOut(auth);
          router.back(); // To clear the stack history
        }}
        label="Sign out"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  avatarContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
  },
});
