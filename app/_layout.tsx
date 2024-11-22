import { Stack } from "expo-router";
import { useEffect } from "react";
import { Colors } from "@/constants/Colors";


// Keep the splash screen visible while we fetch resources

export default function RootLayout() {
  
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.light.success,
        },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="+not-found"
        options={{ headerShown: true, title: "Page Not Found" }}
      />
    </Stack>
  );
}
