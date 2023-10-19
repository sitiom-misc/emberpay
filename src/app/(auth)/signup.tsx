import { View, StyleSheet, Image, ToastAndroid, Pressable } from "react-native";
import { Button, HelperText, Text, TextInput } from "react-native-paper";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useAuth, useStorage } from "reactfire";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import urlToBlob from "@/lib/urlToBlob";

const SignupSchema = z.object({
  name: z
    .string()
    .min(6)
    .regex(/^[a-zA-Z\s.]+$/, {
      message: "Must not contain special characters.",
    }),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/^[^\s]+$/, {
      message: "Must not contain whitespaces.",
    })
    .regex(/^(?=.*[A-Z])(?=.*[0-9])/, {
      message: "Must contain at least 1 number and uppercase letter.",
    }),
});

type SignupFormData = z.infer<typeof SignupSchema>;

export default function SignupScreen() {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<SignupFormData>({
    resolver: zodResolver(SignupSchema),
  });
  const auth = useAuth();
  const storage = useStorage();
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const signUp = async ({ name, email, password }: SignupFormData) => {
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      if (imageUri !== null) {
        const filename = imageUri.substring(imageUri.lastIndexOf("/") + 1);
        const avatarRef = ref(storage, `users/${user.uid}/${filename}`);
        const avatarBlob = await urlToBlob(imageUri);
        await uploadBytes(avatarRef, avatarBlob);
        const avatarUrl = await getDownloadURL(avatarRef);
        await updateProfile(user, {
          displayName: name,
          photoURL: avatarUrl,
        });
      } else {
        await updateProfile(user, {
          displayName: name,
        });
      }
      await user.reload(); // Because auth data is not synced in real-time
    } catch (e) {
      if (e instanceof Error) {
        console.log(e.message);
        ToastAndroid.show(e.message, ToastAndroid.SHORT);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Pressable
        android_ripple={{ color: "orange" }}
        onPress={pickImage}
        onLongPress={() => {
          setImageUri(null);
          ToastAndroid.show("Image cleared.", ToastAndroid.SHORT);
        }}
      >
        <Image
          source={
            imageUri
              ? { uri: imageUri }
              : require("@/assets/images/avatar-3.png")
          }
          style={styles.logo}
        />
      </Pressable>
      <Text variant="titleLarge" style={styles.title}>
        Create a new account
      </Text>
      <View style={styles.inputContainer}>
        <View>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value, disabled } }) => (
              <TextInput
                label="Name"
                onBlur={() => {
                  if (value !== undefined) {
                    setValue("name", value.trim());
                  }
                  onBlur();
                }}
                onChangeText={onChange}
                value={value}
                error={errors.email && true}
                disabled={disabled}
              />
            )}
            name="name"
            disabled={isSubmitting}
          />
          {errors.name && (
            <HelperText type="error" visible={errors.name ? true : false}>
              {errors.name.message}
            </HelperText>
          )}
        </View>
        <View>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value, disabled } }) => (
              <TextInput
                label="Email"
                keyboardType="email-address"
                onBlur={() => {
                  if (value !== undefined) {
                    setValue("email", value.trim());
                  }
                  onBlur();
                }}
                onChangeText={onChange}
                value={value}
                error={errors.email && true}
                disabled={disabled}
              />
            )}
            name="email"
            disabled={isSubmitting}
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
            render={({ field: { onChange, onBlur, value, disabled } }) => (
              <TextInput
                label="Password"
                secureTextEntry={true}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.password && true}
                disabled={disabled}
              />
            )}
            name="password"
            disabled={isSubmitting}
          />
          {errors.password && (
            <HelperText type="error" visible={errors.password ? true : false}>
              {errors.password.message}
            </HelperText>
          )}
        </View>
        <Button
          mode="contained"
          style={{ borderRadius: 55, marginTop: 15 }}
          contentStyle={{ height: 55 }}
          loading={isSubmitting}
          disabled={isSubmitting}
          onPress={handleSubmit(signUp)}
        >
          Sign Up
        </Button>
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
    height: 115,
    width: 115,
    borderRadius: 100,
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
