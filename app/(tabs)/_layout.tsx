import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";
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
        tabBarStyle: {
          position: "absolute",
          backgroundColor: Colors.light.background,
          borderTopWidth: 0,
          elevation: 10, // Add shadow effect
          borderRadius: 20,
          height: 70, // Increase height for better touch targets
          paddingBottom: 10,
          paddingHorizontal: 10, // Add horizontal padding
        },
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
            <View style={styles.tabIconContainer}>
              <Ionicons name="home-outline" size={28} color={color} />
            </View>
          ),
        }}
      />

      {/* Health-Metrics Tab */}
      <Tabs.Screen
        name="metrics"
        options={{
          tabBarIcon: ({ color }) => (
            <View style={styles.tabIconContainer}>
              <MaterialIcons name="show-chart" size={28} color={color} />
            </View>
          ),
          title: "Health-Metrics",
        }}
      />

      {/* Chatbot Tab */}
      <Tabs.Screen
        name="chatbot"
        options={{
          tabBarIcon: ({ color }) => (
            <View style={styles.chatbotTab}>
              <Ionicons
                name="chatbubbles-outline"
                size={32}
                color={Colors.light.cardBackground}
              />
            </View>
          ),
          title: "AI Powered Chatbot",
        }}
      />

      {/* Diet Tab */}
      <Tabs.Screen
        name="diet"
        options={{
          tabBarIcon: ({ color }) => (
            <View style={styles.tabIconContainer}>
              <FontAwesome name="apple" size={28} color={color} />
            </View>
          ),
          title: "Diet Analysis",
        }}
      />

      {/* Profile Tab */}
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => (
            <View style={styles.tabIconContainer}>
              <Ionicons name="person-outline" size={28} color={color} />
            </View>
          ),
          title: "Profile",
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabIconContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10, // Add vertical padding for better touch targets
  },
  chatbotTab: {
    backgroundColor: Colors.light.primaryButton, // Distinct background color for the chatbot tab
    borderRadius: 20,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10, // Slightly lift the chatbot tab
  },
});
