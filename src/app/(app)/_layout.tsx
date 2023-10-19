import MaterialTabBar from "@/components/material-tab-bar";
import { Redirect, Tabs } from "expo-router";
import { BottomTabHeaderProps } from "@react-navigation/bottom-tabs";
import { ActivityIndicator, Appbar } from "react-native-paper";
import { useSigninCheck } from "reactfire";
import { getHeaderTitle } from "@react-navigation/elements";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

function Navbar({
  route,
  options,
  elevated,
}: BottomTabHeaderProps & { elevated?: boolean }) {
  const title = getHeaderTitle(options, route.name);

  return (
    <Appbar.Header elevated={elevated}>
      <Appbar.Content title={title} />
    </Appbar.Header>
  );
}

export default function HomeLayout() {
  const { status: signInStatus, data: signInCheckResult } = useSigninCheck();

  if (signInStatus === "loading") {
    return <ActivityIndicator />;
  }

  return signInCheckResult.signedIn ? (
    <Tabs
      screenOptions={{
        header: (props) => <Navbar {...props} elevated={true} />,
      }}
      tabBar={(props) => <MaterialTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          headerTitle: "Home",
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size, focused }) => {
            return (
              <Icon
                name={focused ? "home" : "home-outline"}
                size={size}
                color={color}
              />
            );
          },
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          headerTitle: "Transaction History",
          tabBarLabel: "History",
          tabBarIcon: ({ color, size, focused }) => {
            return (
              <Icon
                name={focused ? "book" : "book-outline"}
                size={size}
                color={color}
              />
            );
          },
        }}
      />
    </Tabs>
  ) : (
    <Redirect href="/login" />
  );
}
