import { Link } from "expo-router";
import { View, StyleSheet, Image, ToastAndroid } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  GoogleAuthProvider,
  signInWithCredential,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useAuth } from "reactfire";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, { message: "Required" }),
});

type LoginFormData = z.infer<typeof LoginSchema>;

export default function LoginScreen() {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });
  const auth = useAuth();

  return (
    <View style={styles.container}>
      <Image source={require("@/assets/images/icon.png")} style={styles.logo} />
      <Text variant="titleLarge" style={styles.title}>
        Welcome Back!
      </Text>
      <View style={styles.inputContainer}>
        <View>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Email"
                onBlur={() => {
                  if (value !== undefined) {
                    setValue("email", value.trim());
                  }
                  onBlur();
                }}
                keyboardType="email-address"
                onChangeText={onChange}
                value={value}
                error={errors.email && true}
                disabled={isSubmitting}
              />
            )}
            name="email"
          />
          {errors.email && (
            <HelperText type="error" visible={errors.email ? true : false}>
              {errors.email.message}
            </HelperText>
          )}
        </View>
        <View>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Password"
                secureTextEntry={true}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.password && true}
                disabled={isSubmitting}
              />
            )}
            name="password"
          />
          {errors.password && (
            <HelperText type="error" visible={errors.password ? true : false}>
              {errors.password.message}
            </HelperText>
          )}
        </View>
        <View style={{ gap: 8 }}>
          <Button
            mode="contained"
            style={{ borderRadius: 55, marginTop: 15 }}
            contentStyle={{ height: 55 }}
            loading={isSubmitting}
            disabled={isSubmitting}
            onPress={handleSubmit(async ({ email, password }) => {
              try {
                await signInWithEmailAndPassword(auth, email, password);
              } catch (e) {
                if (e instanceof Error) {
                  ToastAndroid.show(e.message, ToastAndroid.SHORT);
                }
              }
            })}
          >
            Log In
          </Button>
          <Button
            mode="outlined"
            style={{ borderRadius: 55 }}
            contentStyle={{ height: 55 }}
            loading={isSubmitting}
            disabled={isSubmitting}
            onPress={async () => {
              try {
                await GoogleSignin.hasPlayServices({
                  showPlayServicesUpdateDialog: true,
                });
                const { idToken } = await GoogleSignin.signIn();
                const googleCredential = GoogleAuthProvider.credential(idToken);
                await signInWithCredential(auth, googleCredential);
              } catch (e) {
                if (e instanceof Error) {
                  ToastAndroid.show(e.message, ToastAndroid.SHORT);
                }
              }
            }}
          >
            Log In with Google
          </Button>
        </View>
      </View>
      <View style={styles.signUpContainer}>
        <Text>Don't have an account?</Text>
        <Link href="/signup">
          <Button mode="text">Sign Up</Button>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: "5%",
  },
  logo: {
    height: 100,
    width: 100,
    borderRadius: 20,
  },
  title: {
    marginVertical: 35,
  },
  inputContainer: {
    width: "100%",
    gap: 15,
  },
  signUpContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },
});
