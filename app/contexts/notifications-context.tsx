"use client";

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  TextInput,
  Modal,
  Linking,
} from "react-native";
import { useAuth } from "../(auth)/AuthContext";
import { useTheme } from "../contexts/theme-context";
import { useNotifications } from "../contexts/notifications-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const ProfileScreen = () => {
  const { user, signOut, updateHealthProfile } = useAuth();
  const { colors, isDark, setTheme, theme } = useTheme();
  const { hasPermission } = useNotifications();

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editField, setEditField] = useState<string>("");
  const [editValue, setEditValue] = useState<string>("");
  const [editLabel, setEditLabel] = useState<string>("");

  const handleThemeChange = () => {
    setTheme(isDark ? "light" : "dark");
  };

  const handleEditField = (field: string, value: any, label: string) => {
    setEditField(field);
    setEditValue(value ? value.toString() : "");
    setEditLabel(label);
    setEditModalVisible(true);
  };

  const handleSaveEdit = () => {
    if (!editValue.trim()) {
      Alert.alert("Error", "Please enter a value");
      return;
    }

    let updatedValue: any = editValue;

    // Convert to number if needed
    if (["age", "weight", "height"].includes(editField)) {
      updatedValue = Number(editValue);
      if (isNaN(updatedValue) || updatedValue <= 0) {
        Alert.alert("Error", "Please enter a valid number");
        return;
      }
    }

    // Update the health profile
    updateHealthProfile({
      ...user?.healthProfile,
      [editField]: updatedValue,
    });

    setEditModalVisible(false);
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => signOut(),
      },
    ]);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      padding: 16,
    },
    profileHeader: {
      alignItems: "center",
      marginBottom: 24,
    },
    profileAvatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: colors.primary,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 16,
    },
    profileInitial: {
      fontSize: 40,
      fontWeight: "bold",
      color: "white",
    },
    profileName: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 4,
    },
    profileEmail: {
      fontSize: 16,
      color: colors.text,
      opacity: 0.7,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
      marginTop: 16,
      marginBottom: 12,
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    lastRow: {
      borderBottomWidth: 0,
    },
    rowLabel: {
      fontSize: 16,
      color: colors.text,
    },
    rowValue: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
    },
    editButton: {
      marginLeft: 8,
    },
    settingRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    settingLabel: {
      fontSize: 16,
      color: colors.text,
    },
    logoutButton: {
      backgroundColor: colors.error,
      borderRadius: 8,
      padding: 16,
      alignItems: "center",
      marginTop: 16,
    },
    logoutButtonText: {
      color: "white",
      fontWeight: "bold",
      fontSize: 16,
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      backgroundColor: colors.background,
      margin: 20,
      borderRadius: 12,
      padding: 20,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 16,
      textAlign: "center",
    },
    input: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    modalButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    cancelButton: {
      backgroundColor: colors.border,
      borderRadius: 8,
      padding: 12,
      alignItems: "center",
      width: "48%",
    },
    cancelButtonText: {
      color: colors.text,
      fontWeight: "bold",
    },
    saveButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      padding: 12,
      alignItems: "center",
      width: "48%",
    },
    saveButtonText: {
      color: "white",
      fontWeight: "bold",
    },
    helpRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    notificationStatusText: {
      fontSize: 14,
      color: hasPermission ? colors.success : colors.error,
      marginLeft: 8,
    },
  });

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.profileHeader}>
        <View style={styles.profileAvatar}>
          <Text style={styles.profileInitial}>
            {user?.name?.charAt(0) || "U"}
          </Text>
        </View>
        <Text style={styles.profileName}>{user?.name || "User"}</Text>
        <Text style={styles.profileEmail}>
          {user?.email || "user@example.com"}
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Health Profile</Text>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Age</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.rowValue}>
              {user?.healthProfile?.age || "-"}
            </Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() =>
                handleEditField("age", user?.healthProfile?.age, "Age")
              }
            >
              <Ionicons
                name="pencil-outline"
                size={18}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Weight</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.rowValue}>
              {user?.healthProfile?.weight || "-"} kg
            </Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() =>
                handleEditField(
                  "weight",
                  user?.healthProfile?.weight,
                  "Weight (kg)"
                )
              }
            >
              <Ionicons
                name="pencil-outline"
                size={18}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={[styles.row, styles.lastRow]}>
          <Text style={styles.rowLabel}>Height</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.rowValue}>
              {user?.healthProfile?.height || "-"} cm
            </Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() =>
                handleEditField(
                  "height",
                  user?.healthProfile?.height,
                  "Height (cm)"
                )
              }
            >
              <Ionicons
                name="pencil-outline"
                size={18}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Notifications</Text>
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.settingRow}
          onPress={() => router.push("/notification-settings")}
        >
          <Text style={styles.settingLabel}>Notification Settings</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.notificationStatusText}>
              {hasPermission ? "Enabled" : "Disabled"}
            </Text>
            <Ionicons name="chevron-forward" size={20} color={colors.text} />
          </View>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Settings</Text>
      <View style={styles.card}>
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Dark Mode</Text>
          <Switch
            value={isDark}
            onValueChange={handleThemeChange}
            trackColor={{ false: colors.border, true: colors.primary + "80" }}
            thumbColor={isDark ? colors.primary : "#f4f3f4"}
          />
        </View>

        <View style={[styles.settingRow, styles.lastRow]}>
          <Text style={styles.settingLabel}>Theme</Text>
          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              style={{ marginRight: 16 }}
              onPress={() => setTheme("light")}
            >
              <Ionicons
                name="sunny"
                size={24}
                color={theme === "light" ? colors.primary : colors.text}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{ marginRight: 16 }}
              onPress={() => setTheme("dark")}
            >
              <Ionicons
                name="moon"
                size={24}
                color={theme === "dark" ? colors.primary : colors.text}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTheme("system")}>
              <Ionicons
                name="phone-portrait"
                size={24}
                color={theme === "system" ? colors.primary : colors.text}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Help & Support</Text>
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.helpRow}
          onPress={() => router.push("/faq")}
        >
          <Text style={styles.settingLabel}>Frequently Asked Questions</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.helpRow}
          onPress={() => router.push("/help")}
        >
          <Text style={styles.settingLabel}>Help Center</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.helpRow, styles.lastRow]}
          onPress={() => Linking.openURL("mailto:support@healthassistant.com")}
        >
          <Text style={styles.settingLabel}>Contact Support</Text>
          <Ionicons name="mail-outline" size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit {editLabel}</Text>

            <TextInput
              style={styles.input}
              placeholder={`Enter ${editLabel.toLowerCase()}`}
              placeholderTextColor={colors.text + "80"}
              value={editValue}
              onChangeText={setEditValue}
              keyboardType={
                ["age", "weight", "height"].includes(editField)
                  ? "numeric"
                  : "default"
              }
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveEdit}
              >
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

export default ProfileScreen;
