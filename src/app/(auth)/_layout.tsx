import MaterialNavBar from "@/components/material-nav-bar";
import { Redirect, Stack } from "expo-router";
import { ActivityIndicator } from "react-native-paper";
import { useSigninCheck } from "reactfire";

export default function AuthLayout() {
  const { status: signInStatus, data: signInCheckResult } = useSigninCheck();

  if (signInStatus === "loading") {
    return <ActivityIndicator />;
  }

  return signInCheckResult.signedIn ? (
    <Redirect href="/" />
  ) : (
    <Stack
      screenOptions={{
        header: (props) => <MaterialNavBar {...props} title="" />,
        animation: "slide_from_bottom",
      }}
    />
  );
}
