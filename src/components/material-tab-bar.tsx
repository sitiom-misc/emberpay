import { BottomNavigation } from "react-native-paper";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { CommonActions } from "@react-navigation/native";
import { Href } from "expo-router/src/link/href";
import { router } from "expo-router";
import Icon from "@expo/vector-icons/MaterialCommunityIcons";

function MaterialTabBar({
  navigation,
  state,
  descriptors,
  insets,
}: BottomTabBarProps) {
  // https://github.com/expo/router/discussions/546
  const filteredRoutes = state.routes.filter(
    (route) =>
      descriptors[route.key].options.tabBarButton?.({
        children: undefined,
      }) !== null
  );
  const index = filteredRoutes.findIndex(
    (route) => state.history[state.history.length - 1].key === route.key
  );

  return (
    <BottomNavigation.Bar
      navigationState={{
        index: index,
        routes: filteredRoutes,
      }}
      safeAreaInsets={insets}
      onTabPress={({ route, preventDefault }) => {
        const event = navigation.emit({
          type: "tabPress",
          target: route.key,
          canPreventDefault: true,
        });

        if (event.defaultPrevented) {
          preventDefault();
          return;
        }

        const tabBarButton = descriptors[route.key].options.tabBarButton?.({
          children: undefined,
        }) as React.ReactElement;
        const href: Href = tabBarButton?.props.href;

        if (href !== undefined) {
          router.push(href);
          return;
        }

        navigation.dispatch({
          ...CommonActions.navigate(route.name, route.params),
          target: state.key,
        });
      }}
      renderIcon={({ route, focused, color }) => {
        const { options } = descriptors[route.key];
        if (options.tabBarIcon) {
          return options.tabBarIcon({ focused, color, size: 24 });
        }

        return <Icon name="help-rhombus-outline" size={24} color={color} />;
      }}
      // @ts-ignore
      getLabelText={({ route }) => {
        const { options } = descriptors[route.key];
        return options.tabBarLabel ?? options.title ?? route.name;
      }}
    />
  );
}

export default MaterialTabBar;
