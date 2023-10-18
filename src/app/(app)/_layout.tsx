import { Redirect, Slot } from "expo-router";
import { ActivityIndicator } from "react-native-paper";
import { useSigninCheck } from "reactfire";

export default function HomeLayout() {
  const { status: signInStatus, data: signInCheckResult } = useSigninCheck();

  if (signInStatus === "loading") {
    return <ActivityIndicator />;
  }

  return signInCheckResult.signedIn ? <Slot /> : <Redirect href="/login" />;
}
