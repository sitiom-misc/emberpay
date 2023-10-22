import { useAppTheme } from "@/lib/Material3ThemeProvider";
import { View, StyleSheet } from "react-native";
import { Avatar, Divider, Text } from "react-native-paper";

export default function HistoryScreen() {
  const theme = useAppTheme();
  return (
    <View style={styles.container}>
      <View style={styles.transactionContainer}>
        <Avatar.Image
          source={{
            uri: "https://lh3.googleusercontent.com/a/ACg8ocLKw_O_yDWrPOj9fzFNDOv3TtAGh_mo6kST3OnU4d48YJY=s96-c",
          }}
          size={48}
        />
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text>To: iACADEMY COMPILE</Text>
            <Text variant="labelSmall">
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </Text>
          </View>
          <Text variant="labelLarge">-₱500.13</Text>
        </View>
      </View>
      <Divider style={{ width: "100%" }} />
      {/* Next */}
      <View style={styles.transactionContainer}>
        <Avatar.Image
          source={require("@/assets/images/avatar-3.png")}
          size={48}
        />
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text>From: Nikos Pasion</Text>
            <Text variant="labelSmall">
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </Text>
          </View>
          <Text variant="labelLarge" style={{ color: "green" }}>
            ₱500.13
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 25,
    paddingHorizontal: 15,
    gap: 12,
  },
  transactionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
});
