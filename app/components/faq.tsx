"use client";

import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useTheme } from "../contexts/theme-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

// FAQ data structure
type FAQItem = {
  id: string;
  question: string;
  answer: string;
  category: string;
};

export default function FAQ() {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // FAQ data
  const faqs: FAQItem[] = [
    {
      id: "1",
      question: "How do I track my workouts?",
      answer:
        "Go to the Fitness tab and tap on 'Log Workout'. Fill in the details of your workout including type, duration, and other metrics. Your workout will be saved and contribute to your daily goals and challenges.",
      category: "fitness",
    },
    {
      id: "2",
      question: "Can I connect my fitness wearable device?",
      answer:
        "Currently, direct integration with wearable devices is under development. In the meantime, you can manually log your activities from the Fitness tab.",
      category: "fitness",
    },
    {
      id: "3",
      question: "How do I log my meals?",
      answer:
        "Navigate to the Diet tab and tap on 'Add Meal' or 'Analyze Meal'. You can either manually enter your meal details or describe your meal for AI-powered nutritional analysis.",
      category: "diet",
    },
    {
      id: "4",
      question: "How accurate is the calorie counting?",
      answer:
        "Our calorie estimates are based on standard nutritional databases. For manually entered meals, accuracy depends on the information you provide. For analyzed meals, our AI provides estimates based on your description.",
      category: "diet",
    },
    {
      id: "5",
      question: "How do I reset my password?",
      answer:
        "Go to the login screen and tap on 'Forgot Password'. Follow the instructions to receive a reset code via email, then create a new password.",
      category: "account",
    },
    {
      id: "6",
      question: "How do I update my health profile?",
      answer:
        "Go to the Profile tab and tap on any of your health metrics to edit them. Your health profile is used to personalize your experience and recommendations.",
      category: "account",
    },
    {
      id: "7",
      question: "What is the AI Health Assistant?",
      answer:
        "The AI Health Assistant is your personal health companion that can answer questions, provide recommendations, and help you achieve your health goals. Access it from the Chat tab or the Home screen.",
      category: "general",
    },
    {
      id: "8",
      question: "How do challenges work?",
      answer:
        "Challenges are goals with specific targets and timeframes. Join challenges from the Fitness tab to compete with others or track your own progress. Completing challenges can earn you badges and achievements.",
      category: "fitness",
    },
    {
      id: "9",
      question: "Is my data secure?",
      answer:
        "Yes, we take data security seriously. Your health data is encrypted and stored securely. We do not share your personal information with third parties without your consent.",
      category: "privacy",
    },
    {
      id: "10",
      question: "Can I export my health data?",
      answer:
        "Currently, data export functionality is under development. This feature will be available in a future update.",
      category: "general",
    },
  ];

  // Filter FAQs based on search query and active category
  const filteredFAQs = faqs.filter((faq) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = [
    "all",
    ...Array.from(new Set(faqs.map((faq) => faq.category))),
  ];

  // Toggle FAQ expansion
  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
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
    categoriesContainer: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    categoriesScroll: {
      flexDirection: "row",
    },
    categoryButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    activeCategoryButton: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    categoryText: {
      color: colors.text,
      fontSize: 14,
    },
    activeCategoryText: {
      color: "white",
      fontWeight: "bold",
    },
    content: {
      padding: 16,
    },
    faqItem: {
      backgroundColor: colors.card,
      borderRadius: 8,
      marginBottom: 12,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: colors.border,
    },
    faqHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 16,
    },
    faqQuestion: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
      flex: 1,
    },
    faqAnswer: {
      padding: 16,
      paddingTop: 0,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    faqAnswerText: {
      fontSize: 14,
      color: colors.text,
      lineHeight: 20,
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
    helpLink: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 20,
      padding: 16,
      backgroundColor: colors.card,
      borderRadius: 8,
    },
    helpLinkText: {
      fontSize: 16,
      color: colors.primary,
      fontWeight: "bold",
      marginLeft: 8,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Frequently Asked Questions</Text>
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
            placeholder="Search FAQs..."
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

      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                activeCategory === category && styles.activeCategoryButton,
              ]}
              onPress={() => setActiveCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  activeCategory === category && styles.activeCategoryText,
                ]}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.content}>
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map((faq) => (
            <TouchableOpacity
              key={faq.id}
              style={styles.faqItem}
              onPress={() => toggleExpand(faq.id)}
              activeOpacity={0.7}
            >
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <Ionicons
                  name={expandedId === faq.id ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={colors.text}
                />
              </View>
              {expandedId === faq.id && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.faqAnswerText}>{faq.answer}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.noResults}>
            <Ionicons
              name="search-outline"
              size={48}
              color={colors.text + "50"}
            />
            <Text style={styles.noResultsText}>
              No FAQs found matching your search.
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.helpLink}
          onPress={() => router.push("/components/help")}
        >
          <Ionicons
            name="help-circle-outline"
            size={24}
            color={colors.primary}
          />
          <Text style={styles.helpLinkText}>Visit Help Center</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
