import {
  Material3Scheme,
  useMaterial3Theme,
} from "@pchmn/expo-material3-theme";
import { createContext, useContext, useMemo } from "react";
import { useColorScheme } from "react-native";
import {
  MD3DarkTheme,
  MD3LightTheme,
  MD3Theme,
  Provider as PaperProvider,
  ProviderProps,
  useTheme,
  adaptNavigationTheme,
} from "react-native-paper";
import {
  ThemeProvider,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";

type Material3ThemeProviderProps = {
  theme: MD3Theme & { colors: Material3Scheme };
  updateTheme: (sourceColor: string) => void;
  resetTheme: () => void;
};

const Material3ThemeProviderContext =
  createContext<Material3ThemeProviderProps>({} as Material3ThemeProviderProps);

export function Material3ThemeProvider({
  children,
  sourceColor,
  fallbackSourceColor,
  ...otherProps
}: ProviderProps & { sourceColor?: string; fallbackSourceColor?: string }) {
  const colorScheme = useColorScheme();
  const {
    theme: dynamicTheme,
    updateTheme,
    resetTheme,
  } = useMaterial3Theme({
    sourceColor,
    fallbackSourceColor,
  });
  const theme = useMemo(() => {
    const md3DarkTheme = { ...MD3DarkTheme, colors: dynamicTheme.dark };
    const md3LightTheme = { ...MD3LightTheme, colors: dynamicTheme.light };
    const { LightTheme, DarkTheme } = adaptNavigationTheme({
      reactNavigationLight: NavigationDefaultTheme,
      reactNavigationDark: NavigationDarkTheme,
      materialDark: md3DarkTheme,
      materialLight: md3LightTheme,
    });
    return colorScheme === "dark"
      ? {
          ...md3DarkTheme,
          ...DarkTheme,
          colors: {
            ...md3DarkTheme.colors,
            ...DarkTheme.colors,
          },
        }
      : {
          ...md3LightTheme,
          ...LightTheme,
          colors: {
            ...md3LightTheme.colors,
            ...LightTheme.colors,
          },
        };
  }, [colorScheme, dynamicTheme]);

  return (
    <Material3ThemeProviderContext.Provider
      value={{ theme, updateTheme, resetTheme }}
    >
      <PaperProvider theme={theme} {...otherProps}>
        <ThemeProvider value={theme}>{children}</ThemeProvider>
      </PaperProvider>
    </Material3ThemeProviderContext.Provider>
  );
}

export function useMaterial3ThemeContext() {
  const ctx = useContext(Material3ThemeProviderContext);
  if (!ctx) {
    throw new Error(
      "useMaterial3ThemeContext must be used inside Material3ThemeProvider"
    );
  }
  return ctx;
}

export const useAppTheme = useTheme<MD3Theme & { colors: Material3Scheme }>;
