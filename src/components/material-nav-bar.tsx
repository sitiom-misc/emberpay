import { Appbar } from "react-native-paper";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";

type Props = {
  title?: string;
  elevated?: boolean;
};

function MaterialNavBar({
  navigation,
  back,
  title,
  elevated,
  route,
}: NativeStackHeaderProps & Props) {
  return (
    <Appbar.Header
      elevated={elevated}
      style={{ backgroundColor: "transparent" }}
    >
      {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
      <Appbar.Content title={title ?? route.name} />
    </Appbar.Header>
  );
}

export default MaterialNavBar;
