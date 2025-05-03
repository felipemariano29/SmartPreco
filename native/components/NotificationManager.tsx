import { useUser } from "@clerk/clerk-expo";
import { useEffect, useRef, useState } from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import * as Device from "expo-device";

async function registerForPushNotificationsAsync() {
  let token;
  console.log(token);
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#db36347b",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      console.log("Falha ao obter permissão para notificações!");
      return;
    }

    try {
      const projectId = process.env.EXPO_PUBLIC_PROJECT_ID;
      if (projectId) {
        const pushToken = await Notifications.getExpoPushTokenAsync({
          projectId: projectId,
        });
        token = pushToken.data;
      } else {
        console.log("EXPO_PUBLIC_PROJECT_ID não configurado");
      }
    } catch (error) {
      console.log("Erro ao obter token de push:", error);
    }
  } else {
    console.log("As notificações push requerem um dispositivo físico.");
  }

  return token;
}

export function NotificationsManager() {
  const { user, isSignedIn } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [expoPushToken, setExpoPushToken] = useState("");

  const notificationListener = useRef<any | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  const saveTokenToClerk = async (token: string) => {
    try {
      if (user && isSignedIn) {
        const currentMetadata = user.unsafeMetadata || {};

        if (currentMetadata.pushToken === token) {
          console.log("Token já está atualizado no Clerk");
          return;
        }

        await user.update({
          unsafeMetadata: {
            ...currentMetadata,
            pushToken: token,
            platform: Platform.OS,
            lastTokenUpdate: new Date().toISOString(),
          },
        });

        console.log("Token salvo no Clerk com sucesso");
      }
    } catch (error) {
      console.error("Erro ao salvar token no Clerk:", error);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const getNotificationToken = async () => {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        setExpoPushToken(token);
        console.log("Expo Push Token:", token);

        if (isSignedIn && user) {
          await saveTokenToClerk(token);
        }
      }
    };

    getNotificationToken();

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("Notificação recebida:", notification);
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [isSignedIn, user]);

  return null;
}
