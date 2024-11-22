import { Tabs } from "expo-router";
import React from "react";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { FontAwesome, MaterialIcons, Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarStyle: { position: "absolute" },
        tabBarActiveBackgroundColor: Colors.light.cardBackground,
        tabBarInactiveBackgroundColor: Colors.light.background,
        tabBarActiveTintColor: Colors.light.tabIconSelected,
        tabBarInactiveTintColor: Colors.light.tabIconDefault,
      }}
    >
      {/* Home Tab */}
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />

      {/* Health-Metrics */}
      <Tabs.Screen
        name="metrics"
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="fitness-center" size={24} color={color} />
          ),

          title: "Health-Metrics",
        }}
      />

      {/* Chatbot Tab */}
      <Tabs.Screen
        name="chatbot"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubbles" size={24} color={color} />
          ),

          title: "AI Powered Chatbot",
        }}
      />

      {/* Diet Tab */}
      <Tabs.Screen
        name="diet"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="apple" size={24} color={color} />
          ),

          title: "Diet Analysis",
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={24} color={color} />
          ),
          title: "Profile",
        }}
      />
    </Tabs>
  );
}
