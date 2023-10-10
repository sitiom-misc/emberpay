import { Material3ThemeProvider } from "@/lib/Material3ThemeProvider";
import { Stack } from "expo-router";
import { Appbar } from "react-native-paper";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";

function Navbar({ navigation, back }: NativeStackHeaderProps) {
  return (
    <Appbar.Header elevated={true}>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title="EmberPay" />
    </Appbar.Header>
  );
}

export default function RootLayout() {
  return (
    <Material3ThemeProvider sourceColor="#fbc02d">
      <Stack
        screenOptions={{
          header: (props) => <Navbar {...props} />,
        }}
      />
    </Material3ThemeProvider>
  );
}
