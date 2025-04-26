"use client";

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../contexts/theme-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Notifications() {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "Challenge ending soon",
      message: "Your 10,000 steps challenge ends tomorrow!",
      time: "2 hours ago",
      read: false,
      type: "challenge",
    },
    {
      id: "2",
      title: "New message from Assistant",
      message: "I've analyzed your recent workouts and have some suggestions.",
      time: "Yesterday",
      read: false,
      type: "chat",
    },
    {
      id: "3",
      title: "Weekly Report Available",
      message: "Your fitness summary for last week is ready to view.",
      time: "2 days ago",
      read: true,
      type: "report",
    },
    {
      id: "4",
      title: "Goal Achieved!",
      message: "Congratulations! You've reached your daily step goal.",
      time: "3 days ago",
      read: true,
      type: "achievement",
    },
    {
      id: "5",
      title: "New Diet Recommendation",
      message:
        "Based on your recent meals, I've prepared some healthy recipe suggestions.",
      time: "4 days ago",
      read: true,
      type: "diet",
    },
  ]);

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setIsLoading(true);
    setTimeout(() => {
      setNotifications(
        notifications.map((notification) => ({ ...notification, read: true }))
      );
      setIsLoading(false);
    }, 500);
  };

  const deleteNotification = (id) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  const getIconForType = (type) => {
    switch (type) {
      case "challenge":
        return "trophy-outline";
      case "chat":
        return "chatbubble-outline";
      case "report":
        return "document-text-outline";
      case "achievement":
        return "ribbon-outline";
      case "diet":
        return "nutrition-outline";
      default:
        return "notifications-outline";
    }
  };

  const getColorForType = (type) => {
    switch (type) {
      case "challenge":
        return "#FF9800";
      case "chat":
        return "#03A9F4";
      case "report":
        return "#9C27B0";
      case "achievement":
        return "#4CAF50";
      case "diet":
        return "#F44336";
      default:
        return colors.primary;
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
    },
    markAllButton: {
      padding: 8,
    },
    markAllText: {
      color: colors.primary,
      fontWeight: "500",
    },
    emptyContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    emptyText: {
      fontSize: 16,
      color: colors.text,
      textAlign: "center",
      marginTop: 16,
    },
    notificationItem: {
      flexDirection: "row",
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.card,
    },
    unread: {
      backgroundColor: colors.primary + "10",
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },
    contentContainer: {
      flex: 1,
    },
    notificationTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 4,
    },
    notificationMessage: {
      fontSize: 14,
      color: colors.text + "CC",
      marginBottom: 4,
    },
    notificationTime: {
      fontSize: 12,
      color: colors.text + "80",
    },
    actionsContainer: {
      flexDirection: "row",
      marginLeft: 8,
    },
    actionButton: {
      padding: 8,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
  });

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        {notifications.some((n) => !n.read) && (
          <TouchableOpacity
            style={styles.markAllButton}
            onPress={markAllAsRead}
          >
            <Text style={styles.markAllText}>Mark all as read</Text>
          </TouchableOpacity>
        )}
      </View>

      {notifications.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="notifications-off-outline"
            size={64}
            color={colors.text + "50"}
          />
          <Text style={styles.emptyText}>No notifications yet</Text>
        </View>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.notificationItem, !item.read && styles.unread]}
              onPress={() => markAsRead(item.id)}
            >
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: getColorForType(item.type) + "20" },
                ]}
              >
                <Ionicons
                  name={getIconForType(item.type)}
                  size={20}
                  color={getColorForType(item.type)}
                />
              </View>
              <View style={styles.contentContainer}>
                <Text style={styles.notificationTitle}>{item.title}</Text>
                <Text style={styles.notificationMessage}>{item.message}</Text>
                <Text style={styles.notificationTime}>{item.time}</Text>
              </View>
              <View style={styles.actionsContainer}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => deleteNotification(item.id)}
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color={colors.text + "80"}
                  />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}
