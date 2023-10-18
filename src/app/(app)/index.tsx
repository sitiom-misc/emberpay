import { View, StyleSheet, Image } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
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
            <Image
              source={
                user.photoURL
                  ? { uri: user.photoURL }
                  : require("@/assets/images/avatar-3.png")
              }
              style={styles.avatarImage}
            />
            <Text>User: {user.displayName}</Text>
            <Text>Email: {user.email}</Text>
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
  },
  avatarImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
});
