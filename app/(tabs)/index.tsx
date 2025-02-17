import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

const HomePage = () => {
  return (
    <>
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTitle: "",
          headerLeft: () => (
            <TouchableOpacity onPress={() => {}} style={styles.iconLeft}>
              <Image
                style={styles.imageTop}
                source={{
                  uri: "https://xsgames.co/randomusers/avatar.php?g=male",
                }}
              />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={() => {}} style={styles.iconRight}>
              <Ionicons
                name="notifications"
                size={20}
                color={Colors.light.text}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerSpacer} />

        {/* Welcome Section */}
        <Text style={styles.welcomeText}>Good Morning, Alex!</Text>
        <Text style={styles.subtitle}>
          Your personalized health insights at a glance
        </Text>

        {/* Health Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons
              name="footsteps"
              size={24}
              color={Colors.light.primaryButton}
            />
            <Text style={styles.statValue}>8,000</Text>
            <Text style={styles.statLabel}>Steps</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="flame" size={24} color={Colors.light.warning} />
            <Text style={styles.statValue}>1,500</Text>
            <Text style={styles.statLabel}>Calories</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons
              name="water"
              size={24}
              color={Colors.light.primaryButton}
            />
            <Text style={styles.statValue}>6/8</Text>
            <Text style={styles.statLabel}>Water</Text>
          </View>
        </View>

        {/* Quick-Access Feature Buttons */}
        <View style={styles.featureContainer}>
          <TouchableOpacity style={styles.featureBox}>
            <Ionicons
              name="barbell"
              size={30}
              color={Colors.light.primaryButton}
            />
            <Text style={styles.featureText}>Track Fitness</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.featureBox}>
            <MaterialIcons
              name="fastfood"
              size={30}
              color={Colors.light.secondaryButton}
            />
            <Text style={styles.featureText}>Log Meals</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.featureBox}>
            <Ionicons name="heart" size={30} color={Colors.light.warning} />
            <Text style={styles.featureText}>Health Alerts</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.featureBox}>
            <Ionicons name="chatbubbles" size={30} color={Colors.light.icon} />
            <Text style={styles.featureText}>AI Chatbot</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Goal Progress */}
        <View style={styles.goalContainer}>
          <Text style={styles.sectionTitle}>Today's Goals</Text>
          <View style={styles.goalProgressBar}>
            <View style={[styles.progressFill, { width: "75%" }]} />
          </View>
          <Text style={styles.goalText}>75% of daily goals completed</Text>
        </View>

        {/* Health Insights */}
        <View style={styles.insightContainer}>
          <Text style={styles.sectionTitle}>Health Insights</Text>
          <View style={styles.insightCard}>
            <Ionicons
              name="water"
              size={24}
              color={Colors.light.primaryButton}
            />
            <Text style={styles.insightText}>
              Drink 2 more glasses of water
            </Text>
          </View>
          <View style={styles.insightCard}>
            <Ionicons name="time" size={24} color={Colors.light.warning} />
            <Text style={styles.insightText}>
              Time to stretch! Been sitting for 1 hour
            </Text>
          </View>
          <View style={styles.insightCard}>
            <Ionicons
              name="nutrition"
              size={24}
              color={Colors.light.secondaryButton}
            />
            <Text style={styles.insightText}>
              Increase protein intake for recovery
            </Text>
          </View>
        </View>

        {/* Weekly Summary */}
        <View style={styles.summaryContainer}>
          <Text style={styles.sectionTitle}>Weekly Summary</Text>
          <View style={styles.summaryStats}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>50,000</Text>
              <Text style={styles.summaryLabel}>Total Steps</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>3,500</Text>
              <Text style={styles.summaryLabel}>Calories Burned</Text>
            </View>
          </View>
        </View>

        {/* Upcoming Activity */}
        <View style={styles.upcomingContainer}>
          <Text style={styles.sectionTitle}>Upcoming</Text>
          <TouchableOpacity style={styles.upcomingCard}>
            <Ionicons
              name="fitness"
              size={24}
              color={Colors.light.primaryButton}
            />
            <View style={styles.upcomingInfo}>
              <Text style={styles.upcomingTitle}>Morning Workout</Text>
              <Text style={styles.upcomingTime}>Tomorrow, 7:00 AM</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={24}
              color={Colors.light.text}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    backgroundColor: Colors.light.background,
    paddingBottom: 30,
  },
  headerSpacer: {
    height: 100,
  },
  imageTop: {
    width: 40,
    height: 40,
    borderRadius: 10,
  },
  iconLeft: {
    marginLeft: 20,
  },
  iconRight: {
    marginRight: 30,
    backgroundColor: Colors.light.background,
    padding: 10,
    borderRadius: 10,
    shadowColor: "#171717",
    shadowOffset: { width: 2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
    color: Colors.light.text,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: Colors.light.cardBackground,
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    width: "31%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
    color: Colors.light.text,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  featureContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  featureBox: {
    width: "48%",
    backgroundColor: Colors.light.cardBackground,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  featureText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "500",
    color: Colors.light.text,
  },
  goalContainer: {
    backgroundColor: Colors.light.cardBackground,
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  goalProgressBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    marginVertical: 10,
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.light.primaryButton,
    borderRadius: 4,
  },
  goalText: {
    fontSize: 14,
    color: "#666",
  },
  insightContainer: {
    backgroundColor: Colors.light.cardBackground,
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  insightCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  insightText: {
    marginLeft: 12,
    fontSize: 14,
    color: Colors.light.text,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: Colors.light.text,
  },
  summaryContainer: {
    backgroundColor: Colors.light.cardBackground,
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
  },
  summaryStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 4,
  },
  upcomingContainer: {
    backgroundColor: Colors.light.cardBackground,
    padding: 15,
    borderRadius: 12,
  },
  upcomingCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
  },
  upcomingInfo: {
    flex: 1,
    marginLeft: 12,
  },
  upcomingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.light.text,
  },
  upcomingTime: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
});

export default HomePage;
