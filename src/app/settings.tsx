import { Redirect, router } from "expo-router";
import { signOut } from "firebase/auth";
import { View, StyleSheet, Image } from "react-native";
import { ActivityIndicator, Text, Divider, Drawer } from "react-native-paper";
import { useAuth, useSigninCheck, useUser } from "reactfire";

export default function HistoryScreen() {
  const { status: signInStatus, data: signInCheckResult } = useSigninCheck();
  const { status: userStatus, data: user } = useUser();
  const auth = useAuth();

  if (signInStatus === "loading" || userStatus === "loading") {
    return <ActivityIndicator />;
  }

  if (!signInCheckResult.signedIn || !user) {
    return <Redirect href="/login" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image
          source={
            user.photoURL
              ? { uri: user.photoURL }
              : require("@/assets/images/avatar-3.png")
          }
          style={styles.avatarImage}
        />
        <View>
          <Text variant="titleMedium">{user.displayName}</Text>
          <Text>{user.email}</Text>
        </View>
      </View>
      <Divider style={{ marginVertical: 15 }} />
      <Drawer.Item
        icon="logout"
        onPress={async () => {
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
