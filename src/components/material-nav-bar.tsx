import { Appbar } from "react-native-paper";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { ViewStyle } from "react-native";
import { getHeaderTitle } from "@react-navigation/elements";

type Props = {
  elevated?: boolean;
  style?: ViewStyle;
};

function MaterialNavBar({
  navigation,
  back,
  elevated,
  route,
  style,
  options,
}: NativeStackHeaderProps & Props) {
  const title = getHeaderTitle(options, route.name);

  return (
    <Appbar.Header elevated={elevated} style={style}>
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={title ?? route.name} />
    </Appbar.Header>
  );
}

export default MaterialNavBar;
