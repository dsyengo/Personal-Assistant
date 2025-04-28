"use client";

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import { useTheme } from "../contexts/theme-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

// Help section type
type HelpSection = {
  id: string;
  title: string;
  icon: string;
  content: string;
  route?: string;
};

export default function Help() {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: "",
  });

  // Help sections data
  const helpSections: HelpSection[] = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: "rocket-outline",
      content: `Welcome to Health Assistant! Here's how to get started:

1. Complete your health profile to get personalized recommendations
2. Set your fitness and health goals
3. Start tracking your workouts and meals
4. Use the AI assistant for personalized advice
5. Join challenges to stay motivated

Tap on each tab to explore different features of the app.`,
    },
    {
      id: "fitness-tracking",
      title: "Fitness Tracking",
      icon: "fitness-outline",
      content: `The Fitness tab allows you to:

• Log your workouts with details like type, duration, and intensity
• Set fitness goals for steps, calories, and workouts
• Join challenges to compete with others
• View your workout history and progress
• Earn badges for your achievements

To log a workout, go to the Fitness tab and tap "Log Workout".`,
      route: "/fitness",
    },
    {
      id: "diet-monitoring",
      title: "Diet Monitoring",
      icon: "nutrition-outline",
      content: `The Diet tab helps you:

• Log your meals manually or using AI analysis
• Track your calorie intake and nutritional balance
• Get personalized meal recommendations
• Set dietary goals
• View your eating patterns and history

To log a meal, go to the Diet tab and tap "Add Meal" or "Analyze Meal".`,
      route: "/diet",
    },
    {
      id: "ai-assistant",
      title: "AI Health Assistant",
      icon: "chatbubble-ellipses-outline",
      content: `Your AI Health Assistant can:

• Answer health and fitness questions
• Provide personalized advice based on your profile
• Suggest workouts and meal plans
• Help you stay on track with your goals
• Offer motivation and support

Access the assistant from the Chat tab or the Home screen.`,
      route: "/chat",
    },
    {
      id: "account-settings",
      title: "Account & Settings",
      icon: "settings-outline",
      content: `Manage your account and app settings:

• Update your health profile
• Change your password
• Adjust notification preferences
• Toggle dark/light mode
• Manage privacy settings

Access these options from the Profile tab.`,
      route: "/profile",
    },
    {
      id: "troubleshooting",
      title: "Troubleshooting",
      icon: "build-outline",
      content: `Common issues and solutions:

• App crashes: Ensure your app is updated to the latest version
• Login problems: Use the "Forgot Password" option to reset
• Data not saving: Check your internet connection
• Syncing issues: Try logging out and back in
• Performance issues: Close other apps running in the background

If problems persist, please contact our support team.`,
    },
  ];

  // Filter help sections based on search query
  const filteredSections = helpSections.filter((section) => {
    return (
      section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      section.content.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Toggle section expansion
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // Handle navigation to specific routes
  const navigateToSection = (route?: string) => {
    if (route) {
      router.push(route);
    }
  };

  // Handle contact form submission
  const handleContactSubmit = () => {
    if (!contactForm.subject.trim() || !contactForm.message.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    // In a real app, you would send this to your backend
    Alert.alert(
      "Message Sent",
      "Thank you for contacting us. We'll get back to you as soon as possible.",
      [
        {
          text: "OK",
          onPress: () => {
            setContactForm({ subject: "", message: "" });
          },
        },
      ]
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
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
      marginLeft: 16,
    },
    searchContainer: {
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    searchInput: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 12,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: "row",
      alignItems: "center",
    },
    searchIcon: {
      marginRight: 8,
    },
    input: {
      flex: 1,
      color: colors.text,
      fontSize: 16,
    },
    content: {
      padding: 16,
    },
    welcomeCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      alignItems: "center",
      borderWidth: 1,
      borderColor: colors.border,
    },
    welcomeTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      marginTop: 12,
      marginBottom: 8,
    },
    welcomeText: {
      fontSize: 14,
      color: colors.text,
      textAlign: "center",
      lineHeight: 20,
    },
    faqLink: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 16,
      padding: 12,
      backgroundColor: colors.primary + "20",
      borderRadius: 8,
    },
    faqLinkText: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: "bold",
      marginLeft: 8,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      marginTop: 20,
      marginBottom: 12,
    },
    helpSection: {
      backgroundColor: colors.card,
      borderRadius: 8,
      marginBottom: 12,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.border,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      padding: 16,
    },
    sectionIcon: {
      marginRight: 12,
      backgroundColor: colors.primary + "20",
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: "center",
      alignItems: "center",
    },
    sectionHeaderContent: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    sectionHeaderTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
    },
    sectionContent: {
      padding: 16,
      paddingTop: 0,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    sectionText: {
      fontSize: 14,
      color: colors.text,
      lineHeight: 20,
    },
    goToButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 12,
      marginTop: 12,
      alignSelf: "flex-start",
      flexDirection: "row",
      alignItems: "center",
    },
    goToButtonText: {
      color: "white",
      fontWeight: "bold",
      fontSize: 14,
      marginRight: 4,
    },
    contactContainer: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginTop: 20,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    contactTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 16,
    },
    inputLabel: {
      fontSize: 14,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 8,
    },
    textInput: {
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 12,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 16,
    },
    textArea: {
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 12,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 16,
      height: 120,
      textAlignVertical: "top",
    },
    submitButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      padding: 12,
      alignItems: "center",
    },
    submitButtonText: {
      color: "white",
      fontWeight: "bold",
      fontSize: 16,
    },
    noResults: {
      padding: 20,
      alignItems: "center",
    },
    noResultsText: {
      fontSize: 16,
      color: colors.text,
      textAlign: "center",
      marginTop: 10,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Center</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInput}>
          <Ionicons
            name="search"
            size={20}
            color={colors.text}
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Search for help..."
            placeholderTextColor={colors.text + "80"}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color={colors.text} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={styles.content}>
        {searchQuery.length === 0 && (
          <View style={styles.welcomeCard}>
            <Ionicons name="help-buoy" size={48} color={colors.primary} />
            <Text style={styles.welcomeTitle}>Welcome to the Help Center</Text>
            <Text style={styles.welcomeText}>
              Find answers to common questions, learn how to use the app, and
              get in touch with our support team.
            </Text>
            <TouchableOpacity
              style={styles.faqLink}
              onPress={() => router.push("/components/faq")}
            >
              <Ionicons name="list" size={20} color={colors.primary} />
              <Text style={styles.faqLinkText}>
                View Frequently Asked Questions
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {filteredSections.length > 0 ? (
          <>
            <Text style={styles.sectionTitle}>Help Topics</Text>
            {filteredSections.map((section) => (
              <View key={section.id} style={styles.helpSection}>
                <TouchableOpacity
                  style={styles.sectionHeader}
                  onPress={() => toggleExpand(section.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.sectionIcon}>
                    <Ionicons
                      name={section.icon as any}
                      size={20}
                      color={colors.primary}
                    />
                  </View>
                  <View style={styles.sectionHeaderContent}>
                    <Text style={styles.sectionHeaderTitle}>
                      {section.title}
                    </Text>
                    <Ionicons
                      name={
                        expandedId === section.id
                          ? "chevron-up"
                          : "chevron-down"
                      }
                      size={20}
                      color={colors.text}
                    />
                  </View>
                </TouchableOpacity>
                {expandedId === section.id && (
                  <View style={styles.sectionContent}>
                    <Text style={styles.sectionText}>{section.content}</Text>
                    {section.route && (
                      <TouchableOpacity
                        style={styles.goToButton}
                        onPress={() => navigateToSection(section.route)}
                      >
                        <Text style={styles.goToButtonText}>
                          Go to {section.title}
                        </Text>
                        <Ionicons
                          name="arrow-forward"
                          size={16}
                          color="white"
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            ))}
          </>
        ) : (
          <View style={styles.noResults}>
            <Ionicons
              name="search-outline"
              size={48}
              color={colors.text + "50"}
            />
            <Text style={styles.noResultsText}>
              No help topics found matching your search.
            </Text>
          </View>
        )}

        <View style={styles.contactContainer}>
          <Text style={styles.contactTitle}>Contact Support</Text>
          <Text style={styles.inputLabel}>Subject</Text>
          <TextInput
            style={styles.textInput}
            placeholder="What do you need help with?"
            placeholderTextColor={colors.text + "80"}
            value={contactForm.subject}
            onChangeText={(text) =>
              setContactForm({ ...contactForm, subject: text })
            }
          />
          <Text style={styles.inputLabel}>Message</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Describe your issue or question in detail..."
            placeholderTextColor={colors.text + "80"}
            value={contactForm.message}
            onChangeText={(text) =>
              setContactForm({ ...contactForm, message: text })
            }
            multiline
            numberOfLines={4}
          />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleContactSubmit}
          >
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
