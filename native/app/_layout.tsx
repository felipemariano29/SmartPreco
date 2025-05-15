import { ClerkProvider } from "@clerk/clerk-expo";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import Constants from "expo-constants";
import { useFonts } from "expo-font";
import { Slot, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import "react-native-reanimated";
import * as Notifications from "expo-notifications";

const { EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY } = Constants.expoConfig?.extra || {};

import { NotificationsManager } from "@/components/NotificationManager";
import theme from "@/constants/theme";
import {
  NotificationProvider,
  useNotification,
} from "@/contexts/NotificationContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import { tokenCache } from "@/utils/secureToken";
import { PaperProvider } from "react-native-paper";

SplashScreen.preventAutoHideAsync();

function AppContent() {
  const router = useRouter();
  const { lastNotification } = useNotification();

  // Handle navigation when a new notification comes in and app is in foreground
  useEffect(() => {
    if (lastNotification && lastNotification.screen) {
      switch (lastNotification.screen) {
        case "product-details":
          if (lastNotification.productId) {
            router.push({
              pathname: "/product-details",
              params: { id: lastNotification.productId },
            });
          }
          break;
        case "market-details":
          if (lastNotification.marketId) {
            router.push({
              pathname: "/market-details",
              params: { id: lastNotification.marketId },
            });
          }
          break;
      }
    }
  }, [lastNotification, router]);

  return <Slot />;
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ClerkProvider
      publishableKey={EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ?? ""}
      tokenCache={tokenCache}
    >
      <PaperProvider theme={theme}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <NotificationProvider>
            <NotificationsManager />
            <AppContent />
          </NotificationProvider>
        </ThemeProvider>
      </PaperProvider>
    </ClerkProvider>
  );
}
