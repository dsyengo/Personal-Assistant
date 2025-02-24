import { Tabs } from "expo-router";
import {
  StyleSheet,
  View,
  Platform,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import React, { useRef } from "react";
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { FontAwesome, MaterialIcons, Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const TAB_WIDTH = width / 5;
const TAB_BAR_HEIGHT = 60; // Define tab bar height for consistent layout adjustments

const TabIndicator: React.FC<{
  tabWidth: number;
  translateX: Animated.Value;
}> = ({ tabWidth, translateX }) => (
  <Animated.View
    style={[
      styles.indicator,
      {
        transform: [{ translateX }],
        width: tabWidth - 20,
      },
    ]}
  />
);

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const translateX = useRef(new Animated.Value(0)).current;
  const scaleY = useRef(new Animated.Value(1)).current;

  const animateTab = (index: number) => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: index * TAB_WIDTH,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
      Animated.sequence([
        Animated.timing(scaleY, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.spring(scaleY, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 10,
        }),
      ]),
    ]).start();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          headerShown: true, // Preserve header properties
          tabBarStyle: [styles.tabBar],
          tabBarActiveTintColor: Colors.light.tabIconSelected,
          tabBarInactiveTintColor: Colors.light.tabIconDefault,
        }}
        screenListeners={({ navigation }) => ({
          state: () => {
            const index = navigation.getState().index;
            animateTab(index);
          },
        })}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.tabIconContainer}>
                <Ionicons
                  name={focused ? "home" : "home-outline"}
                  size={26}
                  color={color}
                />
                <TabIndicator tabWidth={TAB_WIDTH} translateX={translateX} />
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="metrics"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.tabIconContainer}>
                <MaterialIcons
                  name={focused ? "bar-chart" : "show-chart"}
                  size={26}
                  color={color}
                />
              </View>
            ),
            title: "Health-Metrics",
          }}
        />

        <Tabs.Screen
          name="chatbot"
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={styles.chatbotContainer}>
                <View style={styles.chatbotInner}>
                  <Ionicons
                    name={focused ? "chatbubbles" : "chatbubbles-outline"}
                    size={26}
                    color={Colors.light.cardBackground}
                  />
                </View>
              </View>
            ),
            title: "AI Powered Chatbot",
          }}
        />

        <Tabs.Screen
          name="diet"
          options={{
            tabBarIcon: ({ color }) => (
              <View style={styles.tabIconContainer}>
                <FontAwesome name="apple" size={26} color={color} />
              </View>
            ),
            title: "Diet Analysis",
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <View style={styles.tabIconContainer}>
                <Ionicons
                  name={focused ? "person" : "person-outline"}
                  size={26}
                  color={color}
                />
              </View>
            ),
            title: "Profile",
          }}
        />
      </Tabs>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 0, // Fix tab bar position at the bottom without unnecessary gap
    left: 0,
    right: 0,
    height: TAB_BAR_HEIGHT,
    borderRadius: 24,
    paddingHorizontal: 8,
    backgroundColor: Colors.light.background,
    shadowColor: Colors.light.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  indicator: {
    position: "absolute",
    bottom: 8,
    height: 3,
    backgroundColor: Colors.light.primaryButton,
    borderRadius: 3,
    marginHorizontal: 10,
  },
  tabIconContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  chatbotContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light.primaryButton,
    marginTop: -32,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.light.primaryButton,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 4,
    borderColor: Colors.light.background,
  },
  chatbotInner: {
    width: "100%",
    height: "100%",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
});
