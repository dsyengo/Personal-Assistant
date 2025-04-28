"use client";
import { Stack } from "expo-router";
import { useAuth } from "./(auth)/AuthContext";
import { ActivityIndicator, View } from "react-native";
import { useTheme } from "../app/contexts/theme-context";
import { useState, useEffect } from "react";

const RootNavigator = () => {
  const { user, isLoading } = useAuth();
  const { colors } = useTheme();
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowWelcome(false);
    }, 3000); // show welcome screen for 3 seconds (adjust if you want)

    return () => clearTimeout(timer);
  }, []);

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

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {showWelcome ? (
        <Stack.Screen name="index" />
      ) : user ? (
        <Stack.Screen name="(tabs)" />
      ) : (
        <Stack.Screen name="(auth)" />
      )}
    </Stack>
  );
};

export default RootNavigator;
