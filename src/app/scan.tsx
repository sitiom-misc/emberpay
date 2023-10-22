import { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  useWindowDimensions,
  ToastAndroid,
} from "react-native";
import {
  ActivityIndicator,
  Avatar,
  Button,
  Dialog,
  HelperText,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useAuth, useFirestore } from "reactfire";
import {
  DocumentReference,
  DocumentSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { User } from "@/types";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { runTransaction } from "firebase/firestore";

const AmountSchema = z.object({
  amount: z.coerce
    .number({ invalid_type_error: "Must be a valid number." })
    .positive()
    .multipleOf(0.01, {
      message: "Number must only have a maximum of 2 decimal places.",
    }),
});

type AmountFormData = z.infer<typeof AmountSchema>;

export default function ScanScreen() {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AmountFormData>({
    resolver: zodResolver(AmountSchema),
  });

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const { width, height } = useWindowDimensions();
  const [receiver, setReceiver] = useState<DocumentSnapshot<User> | null>(null);
  const firestore = useFirestore();
  const auth = useAuth();

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };

    getBarCodeScannerPermissions();
  }, []);

  if (auth.currentUser === null) return null;

  const currentUser = auth.currentUser; // To make TS stop complaining about currentUser being null

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No access to camera.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Portal>
        <Dialog
          visible={scanned}
          onDismiss={() => {
            if (isSubmitting) return;
            reset();
            setScanned(false);
          }}
        >
          <View style={{ alignItems: "center", margin: 20, gap: 5 }}>
            <Avatar.Image
              size={48}
              source={
                receiver?.data()?.avatarUrl
                  ? { uri: receiver?.data()?.avatarUrl }
                  : require("@/assets/images/avatar-3.png")
              }
            />
            <Text>Sending to {receiver?.data()?.name}</Text>
          </View>
          <Dialog.Content>
            {!isSubmitting ? (
              <>
                <Controller
                  control={control}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label="Amount"
                      onBlur={onBlur}
                      keyboardType="numeric"
                      onChangeText={onChange}
                      value={value?.toString()}
                      error={errors.amount && true}
                    />
                  )}
                  name="amount"
                />
                {errors.amount && (
                  <HelperText
                    type="error"
                    visible={errors.amount ? true : false}
                  >
                    {errors.amount.message}
                  </HelperText>
                )}
              </>
            ) : (
              <ActivityIndicator />
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={handleSubmit(async ({ amount }) => {
                if (receiver === null) return;

                const senderDocRef = doc(
                  firestore,
                  "users",
                  currentUser.uid
                ) as DocumentReference<User>;
                const receiverDocRef = doc(
                  firestore,
                  "users",
                  receiver.id
                ) as DocumentReference<User>;
                try {
                  await runTransaction(firestore, async (transaction) => {
                    const senderDoc = await transaction.get(senderDocRef);
                    const receiverDoc = await transaction.get(receiverDocRef);
                    if (!senderDoc.exists() || !receiverDoc.exists()) {
                      throw "Document does not exist!";
                    }
                    transaction.update(senderDocRef, {
                      balance: senderDoc.data()?.balance - amount,
                    });
                    transaction.update(receiverDocRef, {
                      balance: receiverDoc.data()?.balance + amount,
                    });
                  });
                } catch (e) {
                  if (e instanceof Error) {
                    ToastAndroid.show(e.message, ToastAndroid.SHORT);
                  }
                }
                reset();
                setScanned(false);
              })}
              disabled={isSubmitting}
            >
              Ok
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      {!scanned && (
        <BarCodeScanner
          onBarCodeScanned={async ({ data }) => {
            if (!data.startsWith("emberpay:")) return;
            const receiverId = data.replace(/^emberpay:/, "");
            const receiverDoc = await getDoc(
              doc(firestore, "users", receiverId) as DocumentReference<User>
            );
            if (receiverDoc.id === currentUser.uid) {
              ToastAndroid.show(
                "You can't send money to yourself!",
                ToastAndroid.SHORT
              );
              return;
            }
            if (!receiverDoc.exists()) return;
            setScanned(true);
            setReceiver(receiverDoc);
          }}
          style={{
            position: "absolute",
            top: 0,
            transform: [{ translateX: width / 2 }],
            right: 0,
            bottom: 0,
            width: width * 2.5,
            height: height * 1.5,
          }}
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
