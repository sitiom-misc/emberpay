import { Transaction, User } from "@/types";
import {
  DocumentReference,
  Query,
  collection,
  doc,
  or,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { View, StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { ActivityIndicator, Avatar, Divider, Text } from "react-native-paper";
import {
  useAuth,
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocDataOnce,
} from "reactfire";

export default function HistoryScreen() {
  const firestore = useFirestore();
  const auth = useAuth();
  if (auth.currentUser === null) return null;

  const transactionsRef = collection(firestore, "transactions");
  const transactionsQuery = query(
    transactionsRef,
    or(
      where("senderId", "==", auth.currentUser.uid),
      where("receiverId", "==", auth.currentUser.uid)
    ),
    orderBy("date", "desc")
  ) as Query<Transaction>;
  const { status: queryStatus, data: transactions } =
    useFirestoreCollectionData(transactionsQuery, { idField: "id" });

  if (queryStatus === "loading") {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  const TransactionItem = ({ transaction }: { transaction: Transaction }) => {
    const isSender = transaction.senderId === auth.currentUser?.uid;
    const secondUserRef = doc(
      firestore,
      "users",
      isSender ? transaction.receiverId : transaction.senderId
    ) as DocumentReference<User>;
    const { status, data: secondUser } = useFirestoreDocDataOnce(
      secondUserRef,
      {
        idField: "id",
      }
    );
    if (status === "loading") {
      return <ActivityIndicator />;
    }
    if (!secondUser) {
      return null;
    }

    return (
      <View style={styles.transactionContainer}>
        <Avatar.Image
          source={
            secondUser.avatarUrl
              ? { uri: secondUser.avatarUrl }
              : require("@/assets/images/avatar-3.png")
          }
          size={48}
        />
        <View style={styles.transactionInfoContainer}>
          <View>
            <Text>
              {isSender ? "To" : "From"}: {secondUser.name}
            </Text>
            <Text variant="labelSmall">
              {transaction.date.toDate().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            </Text>
          </View>
          <Text
            variant="labelLarge"
            style={{ color: isSender ? "red" : "green" }}
          >
            {isSender ? "-" : "+"}
            {transaction.amount.toLocaleString("en-PH", {
              style: "currency",
              currency: "PHP",
            })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id!}
        ItemSeparatorComponent={() => (
          <Divider style={{ width: "100%", marginVertical: 12 }} />
        )}
        renderItem={({ item }) => <TransactionItem transaction={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 25,
    paddingHorizontal: 15,
  },
  transactionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  transactionInfoContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
