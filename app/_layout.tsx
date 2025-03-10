import { Stack } from "expo-router";
import { useEffect } from "react";
import { Colors } from "@/constants/Colors";


export default function RootLayout() {
  return (
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
  );
}
