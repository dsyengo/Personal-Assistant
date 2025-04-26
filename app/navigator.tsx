"use client";
import { Stack } from "expo-router";
import { useAuth } from "./(auth)/AuthContext";
import { ActivityIndicator, View } from "react-native";
import { useTheme } from "../app/contexts/theme-context";

const RootNavigator = () => {
  const { user, isLoading } = useAuth();
  const { colors } = useTheme();

  // Show a loading indicator while loading the user state
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // After loading, navigate to (tabs) if user is logged in or (auth) if not
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {user ? <Stack.Screen name="(tabs)" /> : <Stack.Screen name="(auth)" />}
    </Stack>
  );
};

export default RootNavigator;
