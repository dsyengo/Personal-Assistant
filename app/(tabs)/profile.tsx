import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
  StatusBar,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

const Profile = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  // For demonstration - these would come from your auth system
  const user = {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    title: "Software Developer",
    location: "San Francisco, CA",
    bio: "Passionate about React Native and creating beautiful mobile experiences.",
    stats: {
      projects: 12,
      followers: 248,
      following: 186,
    },
    profileImage: "https://xsgames.co/randomusers/avatar.php?g=male",
  };

  // Dynamic theme based on dark mode state
  const theme = darkMode
    ? {
        background: "#121212",
        card: "#1E1E1E",
        text: "#FFFFFF",
        subtext: "#AAAAAA",
        accent: "#7B68EE",
        border: "#333333",
        statusBar: "light-content",
      }
    : {
        background: "#F8F9FA",
        card: "#FFFFFF",
        text: "#333333",
        subtext: "#757575",
        accent: "#6C63FF",
        border: "#EEEEEE",
        statusBar: "dark-content",
      };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StatusBar barStyle={theme.statusBar} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Profile</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
      >
        {/* Profile Card */}
        <View
          style={[
            styles.profileCard,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <View style={styles.coverPhoto}>
            <TouchableOpacity style={styles.editCoverButton}>
              <Ionicons name="camera" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: user.profileImage }}
              style={styles.profilePicture}
            />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.userInfoContainer}>
            <Text style={[styles.userName, { color: theme.text }]}>
              {user.name}
            </Text>
            <Text style={[styles.userTitle, { color: theme.subtext }]}>
              {user.title}
            </Text>

            <View style={styles.locationContainer}>
              <Ionicons
                name="location-outline"
                size={16}
                color={theme.subtext}
              />
              <Text style={[styles.locationText, { color: theme.subtext }]}>
                {user.location}
              </Text>
            </View>

            <Text style={[styles.userBio, { color: theme.text }]}>
              {user.bio}
            </Text>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: theme.text }]}>
                  {user.stats.projects}
                </Text>
                <Text style={[styles.statLabel, { color: theme.subtext }]}>
                  Projects
                </Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: theme.text }]}>
                  {user.stats.followers}
                </Text>
                <Text style={[styles.statLabel, { color: theme.subtext }]}>
                  Followers
                </Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: theme.text }]}>
                  {user.stats.following}
                </Text>
                <Text style={[styles.statLabel, { color: theme.subtext }]}>
                  Following
                </Text>
              </View>
            </View>

            <View style={styles.actionButtonsContainer}>
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  { backgroundColor: theme.accent },
                ]}
              >
                <Text style={styles.primaryButtonText}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.secondaryButton, { borderColor: theme.accent }]}
              >
                <Text
                  style={[styles.secondaryButtonText, { color: theme.accent }]}
                >
                  Share Profile
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <View
          style={[
            styles.sectionCard,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Settings
          </Text>

          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Ionicons name="moon-outline" size={22} color={theme.text} />
              <Text style={[styles.settingLabel, { color: theme.text }]}>
                Dark Mode
              </Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: "#767577", true: theme.accent }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Ionicons
                name="notifications-outline"
                size={22}
                color={theme.text}
              />
              <Text style={[styles.settingLabel, { color: theme.text }]}>
                Notifications
              </Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: "#767577", true: theme.accent }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={22}
                color={theme.text}
              />
              <Text style={[styles.settingLabel, { color: theme.text }]}>
                Privacy
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={theme.subtext} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Ionicons
                name="help-circle-outline"
                size={22}
                color={theme.text}
              />
              <Text style={[styles.settingLabel, { color: theme.text }]}>
                Help & Support
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={theme.subtext} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <TouchableOpacity style={styles.settingRow}>
            <View style={styles.settingLabelContainer}>
              <Ionicons
                name="information-circle-outline"
                size={22}
                color={theme.text}
              />
              <Text style={[styles.settingLabel, { color: theme.text }]}>
                About
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={theme.subtext} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={[
            styles.logoutButton,
            { backgroundColor: theme.card, borderColor: theme.border },
          ]}
        >
          <Ionicons name="log-out-outline" size={20} color="#FF3B30" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: theme.subtext }]}>
            App Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  settingsButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  profileCard: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 8,
    overflow: "hidden",
    borderWidth: 1,
  },
  coverPhoto: {
    height: 120,
    backgroundColor: "#6C63FF",
    position: "relative",
  },
  editCoverButton: {
    position: "absolute",
    right: 12,
    top: 12,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 8,
  },
  profileImageContainer: {
    alignItems: "center",
    marginTop: -50,
    position: "relative",
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  editAvatarButton: {
    position: "absolute",
    right: "32%",
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 15,
    padding: 6,
  },
  userInfoContainer: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 12,
  },
  userTitle: {
    fontSize: 16,
    marginTop: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  locationText: {
    fontSize: 14,
    marginLeft: 4,
  },
  userBio: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 12,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: "row",
    marginTop: 20,
    width: "100%",
    justifyContent: "space-evenly",
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    marginTop: 2,
  },
  statDivider: {
    height: 30,
    width: 1,
    backgroundColor: "#EEEEEE",
    alignSelf: "center",
  },
  actionButtonsContainer: {
    flexDirection: "row",
    marginTop: 24,
    width: "100%",
    justifyContent: "space-evenly",
  },
  primaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    minWidth: 120,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    minWidth: 120,
    alignItems: "center",
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontWeight: "600",
  },
  sectionCard: {
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  settingLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingLabel: {
    fontSize: 16,
    marginLeft: 12,
  },
  divider: {
    height: 1,
    width: "100%",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  logoutText: {
    color: "#FF3B30",
    fontWeight: "600",
    marginLeft: 8,
  },
  versionContainer: {
    alignItems: "center",
    marginTop: 24,
    marginBottom: 32,
  },
  versionText: {
    fontSize: 12,
  },
});

export default Profile;
