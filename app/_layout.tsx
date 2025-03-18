import { Stack } from "expo-router";
import { AuthProvider } from "../app/(auth)/AuthContext";
import { Colors } from "@/constants/Colors";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.light.primaryButton,
          },
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="+not-found"
          options={{ headerShown: true, title: "Page Not Found" }}
        />
      </Stack>
    </AuthProvider>
  );
}
