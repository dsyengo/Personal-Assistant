import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  StatusBar,
} from "react-native";
import React from "react";
import { Stack } from "expo-router";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const HomePage = () => {
  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTitle: "",
          headerShadowVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {}}
              style={styles.iconLeft}
              activeOpacity={0.7}
            >
              <Image
                style={styles.imageTop}
                source={{
                  uri: "https://xsgames.co/randomusers/avatar.php?g=male",
                }}
              />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {}}
              style={styles.iconRight}
              activeOpacity={0.7}
            >
              <Ionicons
                name="notifications"
                size={20}
                color={Colors.light.text}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <LinearGradient
        colors={["#f8f9fa", "#ffffff"]}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 0.3 }}
      />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSpacer} />

        {/* Welcome Section with Animation Indicator */}
        <View style={styles.welcomeContainer}>
          <View>
            <Text style={styles.welcomeText}>Good Morning, Alex!</Text>
            <Text style={styles.subtitle}>
              Your personalized health insights at a glance
            </Text>
          </View>
          <LinearGradient
            colors={[Colors.light.primaryButton, "#4db6ac"]}
            style={styles.pulseContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <FontAwesome5 name="heartbeat" size={18} color="white" />
          </LinearGradient>
        </View>

        {/* Health Stats Cards */}
        <View style={styles.statsContainer}>
          <LinearGradient
            colors={["#ffffff", "#f8f9fa"]}
            style={styles.statCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            <View style={styles.iconCircle}>
              <Ionicons
                name="footsteps"
                size={22}
                color={Colors.light.primaryButton}
              />
            </View>
            <Text style={styles.statValue}>8,000</Text>
            <Text style={styles.statLabel}>Steps</Text>
          </LinearGradient>

          <LinearGradient
            colors={["#ffffff", "#f8f9fa"]}
            style={styles.statCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: "rgba(255, 152, 0, 0.1)" },
              ]}
            >
              <Ionicons name="flame" size={22} color={Colors.light.warning} />
            </View>
            <Text style={styles.statValue}>1,500</Text>
            <Text style={styles.statLabel}>Calories</Text>
          </LinearGradient>

          <LinearGradient
            colors={["#ffffff", "#f8f9fa"]}
            style={styles.statCard}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
          >
            <View style={styles.iconCircle}>
              <Ionicons
                name="water"
                size={22}
                color={Colors.light.primaryButton}
              />
            </View>
            <Text style={styles.statValue}>6/8</Text>
            <Text style={styles.statLabel}>Water</Text>
          </LinearGradient>
        </View>

        {/* Quick-Access Feature Buttons */}
        <View style={styles.featureContainer}>
          <TouchableOpacity style={styles.featureBox} activeOpacity={0.8}>
            <LinearGradient
              colors={[Colors.light.primaryButton, "#4db6ac"]}
              style={styles.featureIconContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="barbell" size={24} color="white" />
            </LinearGradient>
            <Text style={styles.featureText}>Track Fitness</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.featureBox} activeOpacity={0.8}>
            <LinearGradient
              colors={[Colors.light.secondaryButton, "#ff8a65"]}
              style={styles.featureIconContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <MaterialIcons name="fastfood" size={24} color="white" />
            </LinearGradient>
            <Text style={styles.featureText}>Log Meals</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.featureBox} activeOpacity={0.8}>
            <LinearGradient
              colors={[Colors.light.warning, "#ffa726"]}
              style={styles.featureIconContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="heart" size={24} color="white" />
            </LinearGradient>
            <Text style={styles.featureText}>Health Alerts</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.featureBox} activeOpacity={0.8}>
            <LinearGradient
              colors={[Colors.light.icon, "#9575cd"]}
              style={styles.featureIconContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="chatbubbles" size={24} color="white" />
            </LinearGradient>
            <Text style={styles.featureText}>AI Chatbot</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Goal Progress */}
        <View style={styles.cardContainer}>
          <View style={styles.goalHeader}>
            <Text style={styles.sectionTitle}>Today's Goals</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.goalProgressContainer}>
            <View style={styles.goalProgressBar}>
              <LinearGradient
                colors={[Colors.light.primaryButton, "#4db6ac"]}
                style={[styles.progressFill, { width: "75%" }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </View>
            <Text style={styles.goalText}>75% of daily goals completed</Text>
          </View>

          <View style={styles.goalDetailsContainer}>
            <View style={styles.goalDetailItem}>
              <View
                style={[
                  styles.miniCircle,
                  { backgroundColor: Colors.light.primaryButton },
                ]}
              />
              <Text style={styles.goalDetailText}>8,000 / 10,000 steps</Text>
            </View>
            <View style={styles.goalDetailItem}>
              <View
                style={[
                  styles.miniCircle,
                  { backgroundColor: Colors.light.warning },
                ]}
              />
              <Text style={styles.goalDetailText}>1,500 / 2,000 calories</Text>
            </View>
            <View style={styles.goalDetailItem}>
              <View
                style={[
                  styles.miniCircle,
                  { backgroundColor: Colors.light.secondaryButton },
                ]}
              />
              <Text style={styles.goalDetailText}>6 / 8 glasses of water</Text>
            </View>
          </View>
        </View>

        {/* Health Insights */}
        <View style={styles.cardContainer}>
          <View style={styles.goalHeader}>
            <Text style={styles.sectionTitle}>Health Insights</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>More</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.insightCard}>
            <View
              style={[
                styles.insightIconCircle,
                { backgroundColor: "rgba(38, 198, 218, 0.1)" },
              ]}
            >
              <Ionicons
                name="water"
                size={20}
                color={Colors.light.primaryButton}
              />
            </View>
            <View style={styles.insightTextContainer}>
              <Text style={styles.insightText}>
                Drink 2 more glasses of water
              </Text>
              <Text style={styles.insightTime}>15 minutes ago</Text>
            </View>
          </View>

          <View style={styles.insightCard}>
            <View
              style={[
                styles.insightIconCircle,
                { backgroundColor: "rgba(255, 152, 0, 0.1)" },
              ]}
            >
              <Ionicons name="time" size={20} color={Colors.light.warning} />
            </View>
            <View style={styles.insightTextContainer}>
              <Text style={styles.insightText}>
                Time to stretch! Been sitting for 1 hour
              </Text>
              <Text style={styles.insightTime}>30 minutes ago</Text>
            </View>
          </View>

          <View style={[styles.insightCard, { borderBottomWidth: 0 }]}>
            <View
              style={[
                styles.insightIconCircle,
                { backgroundColor: "rgba(255, 87, 34, 0.1)" },
              ]}
            >
              <Ionicons
                name="nutrition"
                size={20}
                color={Colors.light.secondaryButton}
              />
            </View>
            <View style={styles.insightTextContainer}>
              <Text style={styles.insightText}>
                Increase protein intake for recovery
              </Text>
              <Text style={styles.insightTime}>2 hours ago</Text>
            </View>
          </View>
        </View>

        {/* Weekly Summary */}
        <View style={styles.cardContainer}>
          <Text style={styles.sectionTitle}>Weekly Summary</Text>
          <View style={styles.summaryStatsContainer}>
            <LinearGradient
              colors={["#ffffff", "#f8f9fa"]}
              style={styles.summaryItem}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <Text style={styles.summaryValue}>50,000</Text>
              <Text style={styles.summaryLabel}>Total Steps</Text>
              <View style={styles.summaryTrend}>
                <Ionicons name="arrow-up" size={14} color="#4CAF50" />
                <Text style={[styles.trendText, { color: "#4CAF50" }]}>
                  12%
                </Text>
              </View>
            </LinearGradient>

            <LinearGradient
              colors={["#ffffff", "#f8f9fa"]}
              style={styles.summaryItem}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <Text style={styles.summaryValue}>3,500</Text>
              <Text style={styles.summaryLabel}>Calories Burned</Text>
              <View style={styles.summaryTrend}>
                <Ionicons name="arrow-up" size={14} color="#4CAF50" />
                <Text style={[styles.trendText, { color: "#4CAF50" }]}>8%</Text>
              </View>
            </LinearGradient>
          </View>
        </View>

        {/* Upcoming Activity */}
        <View style={styles.cardContainer}>
          <View style={styles.goalHeader}>
            <Text style={styles.sectionTitle}>Upcoming</Text>
            <TouchableOpacity>
              <Text style={styles.viewAllText}>View Calendar</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.upcomingCard} activeOpacity={0.7}>
            <LinearGradient
              colors={[Colors.light.primaryButton, "#4db6ac"]}
              style={styles.upcomingIconContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Ionicons name="fitness" size={20} color="white" />
            </LinearGradient>

            <View style={styles.upcomingInfo}>
              <Text style={styles.upcomingTitle}>Morning Workout</Text>
              <Text style={styles.upcomingTime}>Tomorrow, 7:00 AM</Text>
            </View>

            <TouchableOpacity style={styles.upcomingActionButton}>
              <Text style={styles.upcomingActionText}>Set Reminder</Text>
            </TouchableOpacity>
          </TouchableOpacity>

          <TouchableOpacity style={styles.upcomingCard} activeOpacity={0.7}>
            <LinearGradient
              colors={[Colors.light.secondaryButton, "#ff8a65"]}
              style={styles.upcomingIconContainer}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <MaterialIcons name="monitor-weight" size={20} color="white" />
            </LinearGradient>

            <View style={styles.upcomingInfo}>
              <Text style={styles.upcomingTitle}>Weekly Weigh-in</Text>
              <Text style={styles.upcomingTime}>Friday, 8:00 AM</Text>
            </View>

            <TouchableOpacity style={styles.upcomingActionButton}>
              <Text style={styles.upcomingActionText}>Set Reminder</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  gradientBackground: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: height,
  },
  headerSpacer: {
    height: 100,
  },
  welcomeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  pulseContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  imageTop: {
    width: 40,
    height: 40,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  iconLeft: {
    marginLeft: 20,
  },
  iconRight: {
    marginRight: 30,
    backgroundColor: Colors.light.background,
    padding: 10,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 5,
    color: Colors.light.text,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  statCard: {
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    width: "31%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(38, 198, 218, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 4,
    color: Colors.light.text,
  },
  statLabel: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
  featureContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  featureBox: {
    width: "48%",
    backgroundColor: Colors.light.cardBackground,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  featureText: {
    fontSize: 15,
    fontWeight: "500",
    color: Colors.light.text,
  },
  cardContainer: {
    backgroundColor: Colors.light.cardBackground,
    padding: 20,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  viewAllText: {
    fontSize: 14,
    color: Colors.light.primaryButton,
    fontWeight: "500",
  },
  goalProgressContainer: {
    marginBottom: 16,
  },
  goalProgressBar: {
    height: 10,
    backgroundColor: "#E5E7EB",
    borderRadius: 5,
    marginBottom: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 5,
  },
  goalText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  goalDetailsContainer: {
    marginTop: 5,
  },
  goalDetailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  miniCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  goalDetailText: {
    fontSize: 13,
    color: "#555",
  },
  insightCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  insightIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  insightTextContainer: {
    flex: 1,
  },
  insightText: {
    fontSize: 15,
    color: Colors.light.text,
    marginBottom: 3,
  },
  insightTime: {
    fontSize: 12,
    color: "#999",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  summaryStatsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  summaryItem: {
    width: "48%",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
  },
  summaryTrend: {
    flexDirection: "row",
    alignItems: "center",
  },
  trendText: {
    fontSize: 12,
    fontWeight: "500",
    marginLeft: 2,
  },
  upcomingCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    marginTop: 15,
  },
  upcomingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  upcomingInfo: {
    flex: 1,
    marginLeft: 12,
  },
  upcomingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.light.text,
    marginBottom: 2,
  },
  upcomingTime: {
    fontSize: 13,
    color: "#666",
  },
  upcomingActionButton: {
    backgroundColor: "rgba(38, 198, 218, 0.1)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  upcomingActionText: {
    fontSize: 12,
    color: Colors.light.primaryButton,
    fontWeight: "500",
  },
});

export default HomePage;
