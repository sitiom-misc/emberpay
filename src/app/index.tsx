import { signInWithEmailAndPassword } from "firebase/auth";
import { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { useAuth, useSigninCheck, useUser } from "reactfire";

export default function IndexScreen() {
  const { status: signInStatus, data: signInCheckResult } = useSigninCheck();
  const auth = useAuth();

  useEffect(() => {
    // Test authentication
    signInWithEmailAndPassword(auth, "john@gmail.com", "john123");
  }, []);

  return (
    <View style={styles.container}>
      {signInStatus === "loading" ? (
        <Text>Loading...</Text>
      ) : (
        <>
          <Text>Signed in: {signInCheckResult.signedIn ? "Yes" : "No"}</Text>
          {signInCheckResult.signedIn && (
            <Text>User: {signInCheckResult.user.displayName}</Text>
          )}
        </>
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
});
