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

type ActiveTabProps = {
  children: React.ReactNode;
  focused: boolean;
  index: number;
  translateX: Animated.Value;
  scaleValue: Animated.Value;
};

const { width } = Dimensions.get("window");
const TAB_WIDTH = width / 5;
const TAB_BAR_HEIGHT = 70;

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const translateX = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(1)).current;

  const animateTab = (index: number) => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: index * TAB_WIDTH,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }),
      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 0.9,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(scaleValue, {
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
          headerShown: true,
          tabBarStyle: [styles.tabBar],
          tabBarActiveTintColor: Colors.light.primaryButton,
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
              <ActiveTabBackground
                focused={focused}
                index={0}
                translateX={translateX}
                scaleValue={scaleValue}
              >
                <Ionicons
                  name={focused ? "home" : "home-outline"}
                  size={26}
                  color={color}
                />
              </ActiveTabBackground>
            ),
          }}
        />

        <Tabs.Screen
          name="metrics"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <ActiveTabBackground
                focused={focused}
                index={1}
                translateX={translateX}
                scaleValue={scaleValue}
              >
                <MaterialIcons
                  name={focused ? "bar-chart" : "show-chart"}
                  size={26}
                  color={color}
                />
              </ActiveTabBackground>
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
            tabBarIcon: ({ color, focused }) => (
              <ActiveTabBackground
                focused={focused}
                index={3}
                translateX={translateX}
                scaleValue={scaleValue}
              >
                <FontAwesome name="apple" size={26} color={color} />
              </ActiveTabBackground>
            ),
            title: "Diet Analysis",
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ color, focused }) => (
              <ActiveTabBackground
                focused={focused}
                index={4}
                translateX={translateX}
                scaleValue={scaleValue}
              >
                <Ionicons
                  name={focused ? "person" : "person-outline"}
                  size={26}
                  color={color}
                />
              </ActiveTabBackground>
            ),
            title: "Profile",
          }}
        />
      </Tabs>
    </KeyboardAvoidingView>
  );
}

const ActiveTabBackground: React.FC<ActiveTabProps> = ({
  children,
  focused,
}) => {
  return (
    <View style={styles.tabIconContainer}>
      {focused && <View style={styles.activeBackground} />}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: TAB_BAR_HEIGHT,
    borderRadius: 24,
    paddingHorizontal: 8,
    backgroundColor: Colors.light.background,
    shadowColor: Colors.light.tabIconDefault,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: Colors.light.background,
  },
  tabIconContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    width: TAB_WIDTH,
    height: 30,
  },
  activeBackground: {
    position: "absolute",
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    zIndex: -1,
  },
  chatbotContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light.primaryButton,
    marginTop: -20,
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
