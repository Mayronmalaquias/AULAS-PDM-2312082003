import { useEffect } from "react";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { colors } from "../constants/colors";
import GlobalState from "../contexts/GlobalState";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

function NavigationGuard() {
  const { user } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const inLogin = segments[0] === "login";
      if (!user && !inLogin) {
        router.replace("/login");
      } else if (user && inLogin) {
        router.replace("/(tabs)");
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [user, segments]);

  return null;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <GlobalState>
        <StatusBar backgroundColor={colors.primary} style="light" />
        <NavigationGuard />
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </GlobalState>
    </AuthProvider>
  );
}
