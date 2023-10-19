import { View, StyleSheet, Image, ToastAndroid } from "react-native";
import { ActivityIndicator, Button, Surface, Text } from "react-native-paper";
import { useUser } from "reactfire";

export default function IndexScreen() {
  const { status: userStatus, data: user } = useUser();
  return (
    <View style={styles.container}>
      {userStatus === "loading" ? (
        <ActivityIndicator />
      ) : (
        user && (
          <>
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
            <Surface style={styles.walletCard}>
              <View>
                <Text variant="headlineLarge">₱2,168.00</Text>
                <Text variant="labelMedium">Wallet Balance</Text>
              </View>
              <View style={styles.walletCardActions}>
                <Button
                  mode="contained-tonal"
                  style={{ flex: 1 }}
                  icon="qrcode"
                  contentStyle={{ height: 50 }}
                  onPress={() => {
                    ToastAndroid.show("Coming soon!", ToastAndroid.SHORT);
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
                    ToastAndroid.show("Coming soon!", ToastAndroid.SHORT);
                  }}
                >
                  Send
                </Button>
              </View>
            </Surface>
          </>
        )
      )}
    </View>
  );
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
    marginBottom: 50,
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
    paddingVertical: 30,
    borderRadius: 10,
    gap: 10,
  },
  walletCardActions: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    gap: 10,
  },
});
