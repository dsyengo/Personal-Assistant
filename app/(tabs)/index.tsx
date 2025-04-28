"use client";

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  RefreshControl,
} from "react-native";
import { useAuth } from "../(auth)/AuthContext";
import { useTheme } from "../contexts/theme-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2;

export default function Home() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [greeting, setGreeting] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "Challenge ending soon",
      message: "Your 10,000 steps challenge ends tomorrow!",
      time: "2 hours ago",
      read: false,
    },
    {
      id: "2",
      title: "New message from Assistant",
      message: "I've analyzed your recent workouts and have some suggestions.",
      time: "Yesterday",
      read: false,
    },
  ]);
  const [healthTip, setHealthTip] = useState({
    tip: "Stay hydrated! Drink at least 2 liters of water today 🚰",
    icon: "water-outline",
  });
  const [metrics, setMetrics] = useState({
    steps: 6248,
    calories: 420,
    water: 4,
  });
  const [challenges, setChallenge] = useState({
    title: "Walk 10,000 steps daily",
    progress: 62,
    daysLeft: 3,
  });

  // Animation values
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good Morning");
    } else if (hour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  const handleRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  // Fix the navigation in the quick access cards
  // Replace the existing handleCardPress function with this improved version:

  const handleCardPress = (route: string) => {
    // Animation on press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      // Navigate to the route after animation completes
      router.push(route);
    });
  };

  const getUnreadNotificationsCount = () => {
    return notifications.filter((notification) => !notification.read).length;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      paddingBottom: 20,
    },
    header: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 8,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    greetingContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    profileImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 12,
      backgroundColor: colors.primary + "40",
      justifyContent: "center",
      alignItems: "center",
    },
    profileInitial: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.primary,
    },
    greetingText: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
    },
    username: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.primary,
    },
    notificationContainer: {
      position: "relative",
    },
    notificationBadge: {
      position: "absolute",
      top: -5,
      right: -5,
      backgroundColor: colors.error,
      borderRadius: 10,
      width: 20,
      height: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    notificationBadgeText: {
      color: "white",
      fontSize: 12,
      fontWeight: "bold",
    },
    section: {
      marginTop: 16,
      paddingHorizontal: 16,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 12,
    },
    metricsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    metricCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      width: (width - 48) / 3,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    metricIcon: {
      marginBottom: 8,
    },
    metricValue: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 4,
    },
    metricLabel: {
      fontSize: 12,
      color: colors.text + "80",
    },
    navCardsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    navCard: {
      width: cardWidth,
      height: 120,
      borderRadius: 16,
      marginBottom: 16,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
    navCardContent: {
      flex: 1,
      padding: 16,
      justifyContent: "space-between",
    },
    navCardTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: "white",
    },
    navCardSubtitle: {
      fontSize: 12,
      color: "white",
      opacity: 0.8,
    },
    navCardIcon: {
      position: "absolute",
      bottom: 12,
      right: 12,
    },
    challengeCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    challengeHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    challengeTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
      flex: 1,
    },
    challengeDaysLeft: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: "500",
    },
    progressBarContainer: {
      height: 8,
      backgroundColor: colors.border,
      borderRadius: 4,
      marginBottom: 8,
    },
    progressBar: {
      height: "100%",
      borderRadius: 4,
      backgroundColor: colors.primary,
    },
    progressText: {
      fontSize: 14,
      color: colors.text,
      textAlign: "right",
    },
    assistantCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    assistantHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    assistantIcon: {
      backgroundColor: colors.primary + "20",
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    assistantTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
    },
    assistantPrompt: {
      fontSize: 14,
      color: colors.text,
      marginBottom: 16,
    },
    promptSuggestions: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: 16,
    },
    promptChip: {
      backgroundColor: colors.primary + "20",
      borderRadius: 20,
      paddingHorizontal: 12,
      paddingVertical: 6,
      marginRight: 8,
      marginBottom: 8,
      flexDirection: "row",
      alignItems: "center",
    },
    promptChipText: {
      fontSize: 14,
      color: colors.primary,
      marginLeft: 4,
    },
    chatButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      paddingVertical: 12,
      alignItems: "center",
    },
    chatButtonText: {
      color: "white",
      fontWeight: "bold",
      fontSize: 16,
    },
    tipCard: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      flexDirection: "row",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    tipIcon: {
      backgroundColor: colors.primary + "20",
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    tipText: {
      fontSize: 14,
      color: colors.text,
      flex: 1,
    },
    notificationsList: {
      marginTop: 8,
    },
    notificationItem: {
      backgroundColor: colors.card,
      borderRadius: 16,
      padding: 16,
      marginBottom: 12,
      borderLeftWidth: 4,
      borderLeftColor: colors.primary,
    },
    notificationUnread: {
      borderLeftColor: colors.error,
    },
    notificationTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 4,
    },
    notificationMessage: {
      fontSize: 14,
      color: colors.text,
      marginBottom: 8,
    },
    notificationTime: {
      fontSize: 12,
      color: colors.text + "80",
      textAlign: "right",
    },
    viewAllButton: {
      alignSelf: "center",
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: colors.primary,
      marginTop: 8,
    },
    viewAllText: {
      color: colors.primary,
      fontWeight: "500",
    },
  });

  // Update the gradients object to include a reports gradient
  // Replace the existing gradients object with:

  const gradients = {
    fitness: ["#4CAF50", "#8BC34A"],
    chat: ["#03A9F4", "#00BCD4"],
    diet: ["#FF9800", "#FFEB3B"],
    profile: ["#9C27B0", "#673AB7"],
    reports: ["#3F51B5", "#2196F3"],
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.greetingContainer}>
            <TouchableOpacity onPress={() => router.push("/profile")}>
              {user?.profilePicture ? (
                <Image
                  source={{ uri: user.profilePicture }}
                  style={styles.profileImage}
                />
              ) : (
                <View style={styles.profileImage}>
                  <Text style={styles.profileInitial}>
                    {user?.firstName?.charAt(0) || "U"}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <View>
              <Text style={styles.greetingText}>
                {greeting},{" "}
                <Text style={styles.username}>
                  {user?.firstName?.split(" ")[0] || "User"}
                </Text>{" "}
                👋
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.notificationContainer}
            onPress={() => router.push("/components/notifications")}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color={colors.text}
            />
            {getUnreadNotificationsCount() > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {getUnreadNotificationsCount()}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Quick Metrics Widget */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Progress</Text>
          <View style={styles.metricsContainer}>
            <View style={styles.metricCard}>
              <Ionicons
                name="footsteps-outline"
                size={24}
                color={colors.primary}
                style={styles.metricIcon}
              />
              <Text style={styles.metricValue}>
                {metrics.steps.toLocaleString()}
              </Text>
              <Text style={styles.metricLabel}>Steps</Text>
            </View>
            <View style={styles.metricCard}>
              <Ionicons
                name="flame-outline"
                size={24}
                color="#FF9800"
                style={styles.metricIcon}
              />
              <Text style={styles.metricValue}>{metrics.calories}</Text>
              <Text style={styles.metricLabel}>Calories</Text>
            </View>
            <View style={styles.metricCard}>
              <Ionicons
                name="water-outline"
                size={24}
                color="#03A9F4"
                style={styles.metricIcon}
              />
              <Text style={styles.metricValue}>{metrics.water}</Text>
              <Text style={styles.metricLabel}>Glasses</Text>
            </View>
          </View>
        </View>

        {/* Quick Navigation Cards */}
        {/* Update the quick access cards section to properly separate each card and ensure correct navigation
        Replace the existing navCardsContainer section with this improved version: */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          <View style={styles.navCardsContainer}>
            <Animated.View
              style={[styles.navCard, { transform: [{ scale: scaleAnim }] }]}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                style={{ flex: 1 }}
                onPress={() => handleCardPress("/fitness")}
              >
                <LinearGradient colors={gradients.fitness} style={{ flex: 1 }}>
                  <View style={styles.navCardContent}>
                    <View>
                      <Text style={styles.navCardTitle}>Fitness Tracking</Text>
                      <Text style={styles.navCardSubtitle}>
                        Track your workouts
                      </Text>
                    </View>
                    <Ionicons
                      name="fitness"
                      size={28}
                      color="white"
                      style={styles.navCardIcon}
                    />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View
              style={[styles.navCard, { transform: [{ scale: scaleAnim }] }]}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                style={{ flex: 1 }}
                onPress={() => handleCardPress("/chat")}
              >
                <LinearGradient colors={gradients.chat} style={{ flex: 1 }}>
                  <View style={styles.navCardContent}>
                    <View>
                      <Text style={styles.navCardTitle}>AI Assistant</Text>
                      <Text style={styles.navCardSubtitle}>
                        Get personalized advice
                      </Text>
                    </View>
                    <Ionicons
                      name="chatbubble"
                      size={28}
                      color="white"
                      style={styles.navCardIcon}
                    />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View
              style={[styles.navCard, { transform: [{ scale: scaleAnim }] }]}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                style={{ flex: 1 }}
                onPress={() => handleCardPress("/diet")}
              >
                <LinearGradient colors={gradients.diet} style={{ flex: 1 }}>
                  <View style={styles.navCardContent}>
                    <View>
                      <Text style={styles.navCardTitle}>Diet Analysis</Text>
                      <Text style={styles.navCardSubtitle}>
                        Track your nutrition
                      </Text>
                    </View>
                    <Ionicons
                      name="nutrition"
                      size={28}
                      color="white"
                      style={styles.navCardIcon}
                    />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View
              style={[styles.navCard, { transform: [{ scale: scaleAnim }] }]}
            >
              <TouchableOpacity
                activeOpacity={0.9}
                style={{ flex: 1 }}
                onPress={() => handleCardPress("/reports")}
              >
                <LinearGradient colors={gradients.profile} style={{ flex: 1 }}>
                  <View style={styles.navCardContent}>
                    <View>
                      <Text style={styles.navCardTitle}>Health Reports</Text>
                      <Text style={styles.navCardSubtitle}>
                        View your progress
                      </Text>
                    </View>
                    <Ionicons
                      name="document-text"
                      size={28}
                      color="white"
                      style={styles.navCardIcon}
                    />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </View>

        {/* Challenges Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Challenge</Text>
          <View style={styles.challengeCard}>
            <View style={styles.challengeHeader}>
              <Text style={styles.challengeTitle}>{challenges.title}</Text>
              <Text style={styles.challengeDaysLeft}>
                {challenges.daysLeft} days left
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${challenges.progress}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {challenges.progress}% completed
            </Text>
          </View>
        </View>

        {/* Smart Assistant Highlight */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Health Assistant</Text>
          <View style={styles.assistantCard}>
            <View style={styles.assistantHeader}>
              <View style={styles.assistantIcon}>
                <Ionicons
                  name="chatbubble-ellipses"
                  size={24}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.assistantTitle}>
                Ask me anything about your fitness or diet!
              </Text>
            </View>
            <View style={styles.promptSuggestions}>
              <TouchableOpacity
                style={styles.promptChip}
                onPress={() => router.push("/chat")}
              >
                <Ionicons
                  name="body-outline"
                  size={16}
                  color={colors.primary}
                />
                <Text style={styles.promptChipText}>
                  Suggest a quick stretch routine
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.promptChip}
                onPress={() => router.push("/chat")}
              >
                <Ionicons
                  name="nutrition-outline"
                  size={16}
                  color={colors.primary}
                />
                <Text style={styles.promptChipText}>
                  Recommend a healthy snack
                </Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.chatButton}
              onPress={() => router.push("/chat")}
            >
              <Text style={styles.chatButtonText}>Chat Now</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Daily Tip or Motivation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Health Tip</Text>
          <View style={styles.tipCard}>
            <View style={styles.tipIcon}>
              <Ionicons
                name={healthTip.icon}
                size={24}
                color={colors.primary}
              />
            </View>
            <Text style={styles.tipText}>{healthTip.tip}</Text>
          </View>
        </View>

        {/* Recent Notifications */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Notifications</Text>
          <View style={styles.notificationsList}>
            {notifications.slice(0, 2).map((notification) => (
              <View
                key={notification.id}
                style={[
                  styles.notificationItem,
                  !notification.read && styles.notificationUnread,
                ]}
              >
                <Text style={styles.notificationTitle}>
                  {notification.title}
                </Text>
                <Text style={styles.notificationMessage}>
                  {notification.message}
                </Text>
                <Text style={styles.notificationTime}>{notification.time}</Text>
              </View>
            ))}
          </View>
          {notifications.length > 2 && (
            <TouchableOpacity
              style={styles.viewAllButton}
              onPress={() => router.push("/notifications")}
            >
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
