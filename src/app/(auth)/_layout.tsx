import MaterialNavBar from "@/components/material-nav-bar";
import { Redirect, Stack } from "expo-router";
import { ActivityIndicator } from "react-native-paper";
import { useSigninCheck } from "reactfire";

export default function AuthLayout() {
  const { status: signInStatus, data: signInCheckResult } = useSigninCheck();

  if (signInStatus === "loading") {
    return <ActivityIndicator />;
  }

  if (signInCheckResult.signedIn) {
    return <Redirect href="/" />;
  }

  return (
    <Stack
      screenOptions={{
        header: (props) => (
          <MaterialNavBar
            {...props}
            style={{ backgroundColor: "transparent" }}
          />
        ),
        headerTitle: "",
        animation: "slide_from_bottom",
      }}
    />
  );
}
