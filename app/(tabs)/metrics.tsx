"use client";

import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Dimensions,
  Modal,
} from "react-native";
import { useTheme } from "../contexts/theme-context";
import { useAuth } from "../(auth)/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { LineChart, BarChart } from "react-native-chart-kit";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

// API URL - replace with your actual API endpoint
const API_URL = "https://your-api-url.com/api";

// Types
type Workout = {
  id: string;
  userId: string;
  date: string;
  activityType: string;
  duration: number;
  distance?: number;
  caloriesBurned?: number;
  notes?: string;
  createdAt: string;
};

type Goal = {
  id: string;
  userId: string;
  type: "steps" | "calories" | "workouts";
  target: number;
  current: number;
  period: "daily" | "weekly" | "monthly";
  startDate: string;
  endDate: string;
  completed: boolean;
};

type Challenge = {
  id: string;
  title: string;
  description: string;
  type: "steps" | "calories" | "workouts" | "distance";
  target: number;
  period: "daily" | "weekly" | "monthly";
  duration: number; // in days
  startDate: string;
  endDate: string;
  participants: number;
  joined: boolean;
  progress: number;
  completed: boolean;
};

type Badge = {
  id: string;
  title: string;
  description: string;
  icon: string;
  dateEarned: string;
  category: "goals" | "challenges" | "consistency" | "milestone";
};

type Report = {
  period: "weekly" | "monthly";
  startDate: string;
  endDate: string;
  totalSteps: number;
  totalCalories: number;
  totalWorkouts: number;
  totalDistance: number;
  averageStepsPerDay: number;
  mostFrequentActivity: string;
  longestWorkout: number;
  achievements: string[];
};

type ActivitySummary = {
  date: string;
  steps: number;
  calories: number;
  workouts: number;
  distance: number;
};

const FitnessScreen = () => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const userId = user?.id;
  const screenWidth = Dimensions.get("window").width - 32; // Full width minus padding

  // State variables
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(false);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [activitySummary, setActivitySummary] = useState<ActivitySummary[]>([]);

  // Modal states
  const [workoutModalVisible, setWorkoutModalVisible] = useState(false);
  const [goalModalVisible, setGoalModalVisible] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Form states
  const [newWorkout, setNewWorkout] = useState({
    date: new Date(),
    activityType: "walking",
    duration: "",
    distance: "",
    caloriesBurned: "",
    notes: "",
  });

  const [newGoal, setNewGoal] = useState({
    type: "steps" as "steps" | "calories" | "workouts",
    target: "",
    period: "daily" as "daily" | "weekly" | "monthly",
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [historyFilter, setHistoryFilter] = useState("all");

  // Chart data
  const [stepsData, setStepsData] = useState({
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }],
  });

  const [caloriesData, setCaloriesData] = useState({
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }],
  });

  const [workoutFrequencyData, setWorkoutFrequencyData] = useState({
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }],
  });

  // Fetch data on component mount
  useEffect(() => {
    if (userId) {
      fetchWorkouts();
      fetchGoals();
      fetchChallenges();
      fetchBadges();
      fetchReports();
      fetchActivitySummary();
    }
  }, [userId]);

  // Update chart data when activity summary changes
  useEffect(() => {
    if (activitySummary.length > 0) {
      updateChartData();
    }
  }, [activitySummary]);

  // API calls
  const fetchWorkouts = async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/fitness/workouts/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch workouts");
      }
      const data = await response.json();
      setWorkouts(data);
    } catch (error) {
      console.error("Error fetching workouts:", error);
      Alert.alert("Error", "Failed to fetch your workouts");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchGoals = async () => {
    if (!userId) return;

    try {
      const response = await fetch(`${API_URL}/fitness/goals/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch goals");
      }
      const data = await response.json();
      setGoals(data);
    } catch (error) {
      console.error("Error fetching goals:", error);
    }
  };

  const fetchChallenges = async () => {
    if (!userId) return;

    try {
      const response = await fetch(`${API_URL}/fitness/challenges/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch challenges");
      }
      const data = await response.json();
      setChallenges(data);
    } catch (error) {
      console.error("Error fetching challenges:", error);
    }
  };

  const fetchBadges = async () => {
    if (!userId) return;

    try {
      const response = await fetch(`${API_URL}/fitness/badges/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch badges");
      }
      const data = await response.json();
      setBadges(data);
    } catch (error) {
      console.error("Error fetching badges:", error);
    }
  };

  const fetchReports = async () => {
    if (!userId) return;

    try {
      const response = await fetch(`${API_URL}/fitness/reports/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch reports");
      }
      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const fetchActivitySummary = async () => {
    if (!userId) return;

    try {
      const response = await fetch(
        `${API_URL}/fitness/summary/${userId}?period=weekly`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch activity summary");
      }
      const data = await response.json();
      setActivitySummary(data);
    } catch (error) {
      console.error("Error fetching activity summary:", error);
    }
  };

  const addWorkout = async () => {
    if (!userId) return;

    if (!newWorkout.activityType || !newWorkout.duration) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const workoutData = {
        userId,
        date: newWorkout.date.toISOString(),
        activityType: newWorkout.activityType,
        duration: Number.parseInt(newWorkout.duration),
        distance: newWorkout.distance
          ? Number.parseFloat(newWorkout.distance)
          : undefined,
        caloriesBurned: newWorkout.caloriesBurned
          ? Number.parseInt(newWorkout.caloriesBurned)
          : undefined,
        notes: newWorkout.notes,
      };

      const response = await fetch(`${API_URL}/fitness/workouts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(workoutData),
      });

      if (!response.ok) {
        throw new Error("Failed to add workout");
      }

      const savedWorkout = await response.json();
      setWorkouts([...workouts, savedWorkout]);
      setWorkoutModalVisible(false);
      resetWorkoutForm();

      // Refresh data after adding a workout
      fetchActivitySummary();
      fetchGoals(); // To update goal progress
      fetchChallenges(); // To update challenge progress
      fetchBadges(); // To check for new badges
    } catch (error) {
      console.error("Error adding workout:", error);
      Alert.alert("Error", "Failed to add workout");
    } finally {
      setIsLoading(false);
    }
  };

  const addGoal = async () => {
    if (!userId) return;

    if (!newGoal.type || !newGoal.target || !newGoal.period) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      const today = new Date();
      const endDate = new Date();

      if (newGoal.period === "daily") {
        endDate.setDate(today.getDate() + 1);
      } else if (newGoal.period === "weekly") {
        endDate.setDate(today.getDate() + 7);
      } else if (newGoal.period === "monthly") {
        endDate.setMonth(today.getMonth() + 1);
      }

      const goalData = {
        userId,
        type: newGoal.type,
        target: Number.parseInt(newGoal.target),
        period: newGoal.period,
        startDate: today.toISOString(),
        endDate: endDate.toISOString(),
        current: 0,
        completed: false,
      };

      const response = await fetch(`${API_URL}/fitness/goals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(goalData),
      });

      if (!response.ok) {
        throw new Error("Failed to add goal");
      }

      const savedGoal = await response.json();
      setGoals([...goals, savedGoal]);
      setGoalModalVisible(false);
      resetGoalForm();
    } catch (error) {
      console.error("Error adding goal:", error);
      Alert.alert("Error", "Failed to add goal");
    } finally {
      setIsLoading(false);
    }
  };

  const joinChallenge = async (challengeId: string) => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/fitness/challenges/${challengeId}/join`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to join challenge");
      }

      // Update the challenge in the state
      setChallenges(
        challenges.map((challenge) =>
          challenge.id === challengeId
            ? { ...challenge, joined: true }
            : challenge
        )
      );

      Alert.alert("Success", "You've joined the challenge!");
    } catch (error) {
      console.error("Error joining challenge:", error);
      Alert.alert("Error", "Failed to join challenge");
    } finally {
      setIsLoading(false);
    }
  };

  const deleteWorkout = async (workoutId: string) => {
    if (!userId) return;

    Alert.alert(
      "Delete Workout",
      "Are you sure you want to delete this workout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsLoading(true);
            try {
              const response = await fetch(
                `${API_URL}/fitness/workouts/${workoutId}`,
                {
                  method: "DELETE",
                }
              );

              if (!response.ok) {
                throw new Error("Failed to delete workout");
              }

              setWorkouts(
                workouts.filter((workout) => workout.id !== workoutId)
              );

              // Refresh data after deleting a workout
              fetchActivitySummary();
              fetchGoals(); // To update goal progress
              fetchChallenges(); // To update challenge progress
            } catch (error) {
              console.error("Error deleting workout:", error);
              Alert.alert("Error", "Failed to delete workout");
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  const deleteGoal = async (goalId: string) => {
    if (!userId) return;

    Alert.alert("Delete Goal", "Are you sure you want to delete this goal?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          setIsLoading(true);
          try {
            const response = await fetch(`${API_URL}/fitness/goals/${goalId}`, {
              method: "DELETE",
            });

            if (!response.ok) {
              throw new Error("Failed to delete goal");
            }

            setGoals(goals.filter((goal) => goal.id !== goalId));
          } catch (error) {
            console.error("Error deleting goal:", error);
            Alert.alert("Error", "Failed to delete goal");
          } finally {
            setIsLoading(false);
          }
        },
      },
    ]);
  };

  // Helper functions
  const updateChartData = () => {
    // Process activity summary data for charts
    const last7Days = activitySummary.slice(-7);

    // Steps data
    const stepsLabels = last7Days.map((day) => {
      const date = new Date(day.date);
      return date.toLocaleDateString("en-US", { weekday: "short" });
    });
    const stepsValues = last7Days.map((day) => day.steps);

    // Calories data
    const caloriesValues = last7Days.map((day) => day.calories);

    // Workout frequency data
    const workoutValues = last7Days.map((day) => day.workouts);

    setStepsData({
      labels: stepsLabels,
      datasets: [{ data: stepsValues }],
    });

    setCaloriesData({
      labels: stepsLabels,
      datasets: [{ data: caloriesValues }],
    });

    setWorkoutFrequencyData({
      labels: stepsLabels,
      datasets: [{ data: workoutValues }],
    });
  };

  const resetWorkoutForm = () => {
    setNewWorkout({
      date: new Date(),
      activityType: "walking",
      duration: "",
      distance: "",
      caloriesBurned: "",
      notes: "",
    });
  };

  const resetGoalForm = () => {
    setNewGoal({
      type: "steps",
      target: "",
      period: "daily",
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getGoalTypeIcon = (type: string) => {
    switch (type) {
      case "steps":
        return "footsteps-outline";
      case "calories":
        return "flame-outline";
      case "workouts":
        return "fitness-outline";
      default:
        return "analytics-outline";
    }
  };

  const getActivityTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "walking":
        return "walk-outline";
      case "running":
        return "bicycle-outline";
      case "cycling":
        return "bicycle-outline";
      case "swimming":
        return "water-outline";
      case "yoga":
        return "body-outline";
      case "weightlifting":
        return "barbell-outline";
      case "hiit":
        return "timer-outline";
      default:
        return "fitness-outline";
    }
  };

  const getBadgeIcon = (category: string) => {
    switch (category) {
      case "goals":
        return "trophy-outline";
      case "challenges":
        return "flag-outline";
      case "consistency":
        return "calendar-outline";
      case "milestone":
        return "star-outline";
      default:
        return "ribbon-outline";
    }
  };

  const getFilteredWorkouts = () => {
    if (historyFilter === "all") {
      return workouts;
    }

    const today = new Date();
    const startDate = new Date();

    if (historyFilter === "today") {
      startDate.setHours(0, 0, 0, 0);
      return workouts.filter((workout) => new Date(workout.date) >= startDate);
    } else if (historyFilter === "week") {
      startDate.setDate(today.getDate() - 7);
      return workouts.filter((workout) => new Date(workout.date) >= startDate);
    } else if (historyFilter === "month") {
      startDate.setMonth(today.getMonth() - 1);
      return workouts.filter((workout) => new Date(workout.date) >= startDate);
    }

    return workouts;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setNewWorkout({ ...newWorkout, date: selectedDate });
    }
  };

  const openReportModal = (report: Report) => {
    setSelectedReport(report);
    setReportModalVisible(true);
  };

  // Render functions
  const renderDashboard = () => {
    return (
      <View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Today's Activity</Text>
          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {activitySummary.length > 0
                  ? activitySummary[activitySummary.length - 1].steps
                  : 0}
              </Text>
              <Text style={styles.statLabel}>Steps</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {activitySummary.length > 0
                  ? activitySummary[activitySummary.length - 1].calories
                  : 0}
              </Text>
              <Text style={styles.statLabel}>Calories</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {activitySummary.length > 0
                  ? activitySummary[activitySummary.length - 1].workouts
                  : 0}
              </Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Your Fitness Goals</Text>
        {goals.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>
              No goals set yet. Add a goal to get started!
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setGoalModalVisible(true)}
            >
              <Text style={styles.addButtonText}>Add Goal</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {goals.slice(0, 3).map((goal) => {
              const progressPercentage = Math.min(
                100,
                (goal.current / goal.target) * 100
              );
              const progressColor =
                progressPercentage < 30
                  ? colors.error
                  : progressPercentage < 70
                  ? colors.accent
                  : colors.success;

              return (
                <View key={goal.id} style={styles.goalCard}>
                  <View style={styles.goalHeader}>
                    <View style={styles.goalTitleContainer}>
                      <Ionicons
                        name={getGoalTypeIcon(goal.type)}
                        size={20}
                        color={colors.primary}
                        style={styles.goalIcon}
                      />
                      <View>
                        <Text style={styles.goalName}>
                          {goal.target} {goal.type} {goal.period}
                        </Text>
                        <Text style={styles.goalPeriod}>
                          {formatDate(goal.startDate)} -{" "}
                          {formatDate(goal.endDate)}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity onPress={() => deleteGoal(goal.id)}>
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color={colors.error}
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={styles.goalProgress}>
                    <Text style={styles.goalProgressText}>
                      {goal.current} / {goal.target} {goal.type}
                    </Text>
                    <Text style={styles.goalProgressPercentage}>
                      {Math.round(progressPercentage)}%
                    </Text>
                  </View>
                  <View style={styles.progressBarContainer}>
                    <View
                      style={[
                        styles.progressBar,
                        {
                          width: `${progressPercentage}%`,
                          backgroundColor: progressColor,
                        },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
            {goals.length > 3 && (
              <TouchableOpacity
                style={styles.viewMoreButton}
                onPress={() => setActiveTab("goals")}
              >
                <Text style={styles.viewMoreButtonText}>View All Goals</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setGoalModalVisible(true)}
            >
              <Text style={styles.addButtonText}>Add New Goal</Text>
            </TouchableOpacity>
          </>
        )}

        <Text style={styles.sectionTitle}>Active Challenges</Text>
        {challenges.filter((c) => c.joined && !c.completed).length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>
              No active challenges. Join a challenge to get started!
            </Text>
            <TouchableOpacity
              style={styles.viewMoreButton}
              onPress={() => setActiveTab("challenges")}
            >
              <Text style={styles.viewMoreButtonText}>Browse Challenges</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {challenges
              .filter((c) => c.joined && !c.completed)
              .slice(0, 2)
              .map((challenge) => {
                const progressPercentage = Math.min(
                  100,
                  (challenge.progress / challenge.target) * 100
                );
                return (
                  <View key={challenge.id} style={styles.challengeCard}>
                    <Text style={styles.challengeTitle}>{challenge.title}</Text>
                    <Text style={styles.challengeDescription}>
                      {challenge.description}
                    </Text>
                    <View style={styles.challengeDetails}>
                      <Text style={styles.challengeTarget}>
                        Target: {challenge.target} {challenge.type}
                      </Text>
                      <Text style={styles.challengePeriod}>
                        {formatDate(challenge.startDate)} -{" "}
                        {formatDate(challenge.endDate)}
                      </Text>
                    </View>
                    <View style={styles.progressBarContainer}>
                      <View
                        style={[
                          styles.progressBar,
                          {
                            width: `${progressPercentage}%`,
                            backgroundColor: colors.secondary,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.challengeProgress}>
                      Progress: {challenge.progress} / {challenge.target} (
                      {Math.round(progressPercentage)}%)
                    </Text>
                  </View>
                );
              })}
            {challenges.filter((c) => c.joined && !c.completed).length > 2 && (
              <TouchableOpacity
                style={styles.viewMoreButton}
                onPress={() => setActiveTab("challenges")}
              >
                <Text style={styles.viewMoreButtonText}>
                  View All Challenges
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}

        <Text style={styles.sectionTitle}>Recent Workouts</Text>
        {workouts.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>
              No workouts logged yet. Add a workout to get started!
            </Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setWorkoutModalVisible(true)}
            >
              <Text style={styles.addButtonText}>Log Workout</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {workouts.slice(0, 3).map((workout) => (
              <View key={workout.id} style={styles.workoutCard}>
                <View style={styles.workoutHeader}>
                  <View style={styles.workoutTitleContainer}>
                    <Ionicons
                      name={getActivityTypeIcon(workout.activityType)}
                      size={24}
                      color={colors.primary}
                      style={styles.workoutIcon}
                    />
                    <View>
                      <Text style={styles.workoutTitle}>
                        {workout.activityType.charAt(0).toUpperCase() +
                          workout.activityType.slice(1)}
                      </Text>
                      <Text style={styles.workoutDate}>
                        {formatDate(workout.date)}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => deleteWorkout(workout.id)}>
                    <Ionicons
                      name="trash-outline"
                      size={20}
                      color={colors.error}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.workoutDetails}>
                  <View style={styles.workoutDetail}>
                    <Ionicons
                      name="time-outline"
                      size={16}
                      color={colors.text}
                    />
                    <Text style={styles.workoutDetailText}>
                      {workout.duration} min
                    </Text>
                  </View>
                  {workout.distance && (
                    <View style={styles.workoutDetail}>
                      <Ionicons
                        name="map-outline"
                        size={16}
                        color={colors.text}
                      />
                      <Text style={styles.workoutDetailText}>
                        {workout.distance} km
                      </Text>
                    </View>
                  )}
                  {workout.caloriesBurned && (
                    <View style={styles.workoutDetail}>
                      <Ionicons
                        name="flame-outline"
                        size={16}
                        color={colors.text}
                      />
                      <Text style={styles.workoutDetailText}>
                        {workout.caloriesBurned} cal
                      </Text>
                    </View>
                  )}
                </View>
                {workout.notes && (
                  <Text style={styles.workoutNotes}>{workout.notes}</Text>
                )}
              </View>
            ))}
            {workouts.length > 3 && (
              <TouchableOpacity
                style={styles.viewMoreButton}
                onPress={() => setActiveTab("history")}
              >
                <Text style={styles.viewMoreButtonText}>View All Workouts</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setWorkoutModalVisible(true)}
            >
              <Text style={styles.addButtonText}>Log New Workout</Text>
            </TouchableOpacity>
          </>
        )}

        {reports.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Reports</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.reportsScrollView}
            >
              {reports.map((report) => (
                <TouchableOpacity
                  key={report.startDate}
                  style={styles.reportCard}
                  onPress={() => openReportModal(report)}
                >
                  <Text style={styles.reportTitle}>
                    {report.period.charAt(0).toUpperCase() +
                      report.period.slice(1)}{" "}
                    Report
                  </Text>
                  <Text style={styles.reportPeriod}>
                    {formatDate(report.startDate)} -{" "}
                    {formatDate(report.endDate)}
                  </Text>
                  <View style={styles.reportStats}>
                    <View style={styles.reportStat}>
                      <Text style={styles.reportStatValue}>
                        {report.totalWorkouts}
                      </Text>
                      <Text style={styles.reportStatLabel}>Workouts</Text>
                    </View>
                    <View style={styles.reportStat}>
                      <Text style={styles.reportStatValue}>
                        {report.totalSteps}
                      </Text>
                      <Text style={styles.reportStatLabel}>Steps</Text>
                    </View>
                    <View style={styles.reportStat}>
                      <Text style={styles.reportStatValue}>
                        {report.totalCalories}
                      </Text>
                      <Text style={styles.reportStatLabel}>Calories</Text>
                    </View>
                  </View>
                  <View style={styles.viewReportButton}>
                    <Text style={styles.viewReportButtonText}>
                      View Details
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        <Text style={styles.sectionTitle}>Activity Trends</Text>
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Steps (Last 7 Days)</Text>
          <LineChart
            data={stepsData}
            width={screenWidth}
            height={220}
            chartConfig={{
              backgroundColor: colors.card,
              backgroundGradientFrom: colors.card,
              backgroundGradientTo: colors.card,
              decimalPlaces: 0,
              color: (opacity = 1) => colors.primary,
              labelColor: (opacity = 1) => colors.text,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: colors.primary,
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Calories Burned (Last 7 Days)</Text>
          <LineChart
            data={caloriesData}
            width={screenWidth}
            height={220}
            chartConfig={{
              backgroundColor: colors.card,
              backgroundGradientFrom: colors.card,
              backgroundGradientTo: colors.card,
              decimalPlaces: 0,
              color: (opacity = 1) => colors.secondary,
              labelColor: (opacity = 1) => colors.text,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: colors.secondary,
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>

        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Workout Frequency (Last 7 Days)</Text>
          <BarChart
            data={workoutFrequencyData}
            width={screenWidth}
            height={220}
            chartConfig={{
              backgroundColor: colors.card,
              backgroundGradientFrom: colors.card,
              backgroundGradientTo: colors.card,
              decimalPlaces: 0,
              color: (opacity = 1) => colors.accent,
              labelColor: (opacity = 1) => colors.text,
              style: {
                borderRadius: 16,
              },
            }}
            style={styles.chart}
          />
        </View>
      </View>
    );
  };

  const renderWorkoutHistory = () => {
    const filteredWorkouts = getFilteredWorkouts();

    return (
      <View>
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Filter:</Text>
          <View style={styles.filterButtons}>
            <TouchableOpacity
              style={[
                styles.filterButton,
                historyFilter === "all" && styles.activeFilterButton,
              ]}
              onPress={() => setHistoryFilter("all")}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  historyFilter === "all" && styles.activeFilterButtonText,
                ]}
              >
                All
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                historyFilter === "today" && styles.activeFilterButton,
              ]}
              onPress={() => setHistoryFilter("today")}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  historyFilter === "today" && styles.activeFilterButtonText,
                ]}
              >
                Today
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                historyFilter === "week" && styles.activeFilterButton,
              ]}
              onPress={() => setHistoryFilter("week")}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  historyFilter === "week" && styles.activeFilterButtonText,
                ]}
              >
                This Week
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                historyFilter === "month" && styles.activeFilterButton,
              ]}
              onPress={() => setHistoryFilter("month")}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  historyFilter === "month" && styles.activeFilterButtonText,
                ]}
              >
                This Month
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {filteredWorkouts.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>
              No workouts found for the selected period.
            </Text>
          </View>
        ) : (
          filteredWorkouts.map((workout) => (
            <View key={workout.id} style={styles.workoutCard}>
              <View style={styles.workoutHeader}>
                <View style={styles.workoutTitleContainer}>
                  <Ionicons
                    name={getActivityTypeIcon(workout.activityType)}
                    size={24}
                    color={colors.primary}
                    style={styles.workoutIcon}
                  />
                  <View>
                    <Text style={styles.workoutTitle}>
                      {workout.activityType.charAt(0).toUpperCase() +
                        workout.activityType.slice(1)}
                    </Text>
                    <Text style={styles.workoutDate}>
                      {formatDate(workout.date)}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => deleteWorkout(workout.id)}>
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color={colors.error}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.workoutDetails}>
                <View style={styles.workoutDetail}>
                  <Ionicons name="time-outline" size={16} color={colors.text} />
                  <Text style={styles.workoutDetailText}>
                    {workout.duration} min
                  </Text>
                </View>
                {workout.distance && (
                  <View style={styles.workoutDetail}>
                    <Ionicons
                      name="map-outline"
                      size={16}
                      color={colors.text}
                    />
                    <Text style={styles.workoutDetailText}>
                      {workout.distance} km
                    </Text>
                  </View>
                )}
                {workout.caloriesBurned && (
                  <View style={styles.workoutDetail}>
                    <Ionicons
                      name="flame-outline"
                      size={16}
                      color={colors.text}
                    />
                    <Text style={styles.workoutDetailText}>
                      {workout.caloriesBurned} cal
                    </Text>
                  </View>
                )}
              </View>
              {workout.notes && (
                <Text style={styles.workoutNotes}>{workout.notes}</Text>
              )}
            </View>
          ))
        )}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setWorkoutModalVisible(true)}
        >
          <Text style={styles.addButtonText}>Log New Workout</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderGoals = () => {
    return (
      <View>
        <Text style={styles.sectionTitle}>Your Fitness Goals</Text>

        {goals.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>
              No goals set yet. Add a goal to get started!
            </Text>
          </View>
        ) : (
          goals.map((goal) => {
            const progressPercentage = Math.min(
              100,
              (goal.current / goal.target) * 100
            );
            const progressColor =
              progressPercentage < 30
                ? colors.error
                : progressPercentage < 70
                ? colors.accent
                : colors.success;

            return (
              <View key={goal.id} style={styles.goalCard}>
                <View style={styles.goalHeader}>
                  <View style={styles.goalTitleContainer}>
                    <Ionicons
                      name={getGoalTypeIcon(goal.type)}
                      size={20}
                      color={colors.primary}
                      style={styles.goalIcon}
                    />
                    <View>
                      <Text style={styles.goalName}>
                        {goal.target} {goal.type} {goal.period}
                      </Text>
                      <Text style={styles.goalPeriod}>
                        {formatDate(goal.startDate)} -{" "}
                        {formatDate(goal.endDate)}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => deleteGoal(goal.id)}>
                    <Ionicons
                      name="trash-outline"
                      size={20}
                      color={colors.error}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.goalProgress}>
                  <Text style={styles.goalProgressText}>
                    {goal.current} / {goal.target} {goal.type}
                  </Text>
                  <Text style={styles.goalProgressPercentage}>
                    {Math.round(progressPercentage)}%
                  </Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: `${progressPercentage}%`,
                        backgroundColor: progressColor,
                      },
                    ]}
                  />
                </View>
                {goal.completed && (
                  <View style={styles.completedBadge}>
                    <Ionicons name="checkmark-circle" size={16} color="white" />
                    <Text style={styles.completedBadgeText}>Completed</Text>
                  </View>
                )}
              </View>
            );
          })
        )}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setGoalModalVisible(true)}
        >
          <Text style={styles.addButtonText}>Add New Goal</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderChallenges = () => {
    const activeJoinedChallenges = challenges.filter(
      (c) => c.joined && !c.completed
    );
    const completedChallenges = challenges.filter(
      (c) => c.joined && c.completed
    );
    const availableChallenges = challenges.filter((c) => !c.joined);

    return (
      <View>
        <Text style={styles.sectionTitle}>Active Challenges</Text>

        {activeJoinedChallenges.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>
              No active challenges. Join a challenge below!
            </Text>
          </View>
        ) : (
          activeJoinedChallenges.map((challenge) => {
            const progressPercentage = Math.min(
              100,
              (challenge.progress / challenge.target) * 100
            );
            return (
              <View key={challenge.id} style={styles.challengeCard}>
                <Text style={styles.challengeTitle}>{challenge.title}</Text>
                <Text style={styles.challengeDescription}>
                  {challenge.description}
                </Text>
                <View style={styles.challengeDetails}>
                  <Text style={styles.challengeTarget}>
                    Target: {challenge.target} {challenge.type}
                  </Text>
                  <Text style={styles.challengePeriod}>
                    {formatDate(challenge.startDate)} -{" "}
                    {formatDate(challenge.endDate)}
                  </Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: `${progressPercentage}%`,
                        backgroundColor: colors.secondary,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.challengeProgress}>
                  Progress: {challenge.progress} / {challenge.target} (
                  {Math.round(progressPercentage)}%)
                </Text>
                <View style={styles.challengeParticipants}>
                  <Ionicons
                    name="people-outline"
                    size={16}
                    color={colors.text}
                  />
                  <Text style={styles.challengeParticipantsText}>
                    {challenge.participants} participants
                  </Text>
                </View>
              </View>
            );
          })
        )}

        <Text style={styles.sectionTitle}>Available Challenges</Text>

        {availableChallenges.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>
              No available challenges at the moment. Check back later!
            </Text>
          </View>
        ) : (
          availableChallenges.map((challenge) => (
            <View key={challenge.id} style={styles.challengeCard}>
              <Text style={styles.challengeTitle}>{challenge.title}</Text>
              <Text style={styles.challengeDescription}>
                {challenge.description}
              </Text>
              <View style={styles.challengeDetails}>
                <Text style={styles.challengeTarget}>
                  Target: {challenge.target} {challenge.type}
                </Text>
                <Text style={styles.challengePeriod}>
                  {formatDate(challenge.startDate)} -{" "}
                  {formatDate(challenge.endDate)}
                </Text>
              </View>
              <View style={styles.challengeParticipants}>
                <Ionicons name="people-outline" size={16} color={colors.text} />
                <Text style={styles.challengeParticipantsText}>
                  {challenge.participants} participants
                </Text>
              </View>
              <TouchableOpacity
                style={styles.joinChallengeButton}
                onPress={() => joinChallenge(challenge.id)}
              >
                <Text style={styles.joinChallengeButtonText}>
                  Join Challenge
                </Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        {completedChallenges.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Completed Challenges</Text>
            {completedChallenges.map((challenge) => (
              <View key={challenge.id} style={styles.challengeCard}>
                <View style={styles.completedChallengeBadge}>
                  <Ionicons name="trophy" size={16} color="white" />
                  <Text style={styles.completedChallengeBadgeText}>
                    Completed
                  </Text>
                </View>
                <Text style={styles.challengeTitle}>{challenge.title}</Text>
                <Text style={styles.challengeDescription}>
                  {challenge.description}
                </Text>
                <View style={styles.challengeDetails}>
                  <Text style={styles.challengeTarget}>
                    Target: {challenge.target} {challenge.type}
                  </Text>
                  <Text style={styles.challengePeriod}>
                    {formatDate(challenge.startDate)} -{" "}
                    {formatDate(challenge.endDate)}
                  </Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: "100%",
                        backgroundColor: colors.success,
                      },
                    ]}
                  />
                </View>
                <View style={styles.challengeParticipants}>
                  <Ionicons
                    name="people-outline"
                    size={16}
                    color={colors.text}
                  />
                  <Text style={styles.challengeParticipantsText}>
                    {challenge.participants} participants
                  </Text>
                </View>
              </View>
            ))}
          </>
        )}
      </View>
    );
  };

  const renderAchievements = () => {
    const badgesByCategory = {
      goals: badges.filter((b) => b.category === "goals"),
      challenges: badges.filter((b) => b.category === "challenges"),
      consistency: badges.filter((b) => b.category === "consistency"),
      milestone: badges.filter((b) => b.category === "milestone"),
    };

    return (
      <View>
        <View style={styles.achievementsSummary}>
          <Text style={styles.achievementsCount}>{badges.length}</Text>
          <Text style={styles.achievementsLabel}>Total Achievements</Text>
        </View>

        {Object.entries(badgesByCategory).map(
          ([category, categoryBadges]) =>
            categoryBadges.length > 0 && (
              <View key={category}>
                <Text style={styles.sectionTitle}>
                  {category.charAt(0).toUpperCase() + category.slice(1)} Badges
                </Text>
                <View style={styles.badgesContainer}>
                  {categoryBadges.map((badge) => (
                    <View key={badge.id} style={styles.badgeCard}>
                      <View style={styles.badgeIconContainer}>
                        <Ionicons
                          name={badge.icon || getBadgeIcon(badge.category)}
                          size={32}
                          color={colors.primary}
                        />
                      </View>
                      <Text style={styles.badgeTitle}>{badge.title}</Text>
                      <Text style={styles.badgeDescription}>
                        {badge.description}
                      </Text>
                      <Text style={styles.badgeDate}>
                        Earned on {formatDate(badge.dateEarned)}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )
        )}

        {badges.length === 0 && (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>
              No achievements yet. Complete goals and challenges to earn badges!
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderReports = () => {
    return (
      <View>
        <Text style={styles.sectionTitle}>Your Fitness Reports</Text>

        {reports.length === 0 ? (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>
              No reports available yet. Reports are generated weekly and monthly
              as you log workouts.
            </Text>
          </View>
        ) : (
          reports.map((report) => (
            <TouchableOpacity
              key={report.startDate}
              style={styles.reportCardFull}
              onPress={() => openReportModal(report)}
            >
              <Text style={styles.reportTitle}>
                {report.period.charAt(0).toUpperCase() + report.period.slice(1)}{" "}
                Report
              </Text>
              <Text style={styles.reportPeriod}>
                {formatDate(report.startDate)} - {formatDate(report.endDate)}
              </Text>
              <View style={styles.reportStatsGrid}>
                <View style={styles.reportStatItem}>
                  <Ionicons
                    name="footsteps-outline"
                    size={20}
                    color={colors.primary}
                  />
                  <Text style={styles.reportStatLabel}>Total Steps</Text>
                  <Text style={styles.reportStatValue}>
                    {report.totalSteps}
                  </Text>
                </View>
                <View style={styles.reportStatItem}>
                  <Ionicons
                    name="flame-outline"
                    size={20}
                    color={colors.primary}
                  />
                  <Text style={styles.reportStatLabel}>Calories Burned</Text>
                  <Text style={styles.reportStatValue}>
                    {report.totalCalories}
                  </Text>
                </View>
                <View style={styles.reportStatItem}>
                  <Ionicons
                    name="fitness-outline"
                    size={20}
                    color={colors.primary}
                  />
                  <Text style={styles.reportStatLabel}>Workouts</Text>
                  <Text style={styles.reportStatValue}>
                    {report.totalWorkouts}
                  </Text>
                </View>
                <View style={styles.reportStatItem}>
                  <Ionicons
                    name="map-outline"
                    size={20}
                    color={colors.primary}
                  />
                  <Text style={styles.reportStatLabel}>Distance</Text>
                  <Text style={styles.reportStatValue}>
                    {report.totalDistance} km
                  </Text>
                </View>
              </View>
              <View style={styles.viewReportButton}>
                <Text style={styles.viewReportButtonText}>
                  View Full Report
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      padding: 16,
    },
    tabsContainer: {
      flexDirection: "row",
      marginBottom: 16,
      borderRadius: 8,
      backgroundColor: colors.card,
      overflow: "hidden",
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      alignItems: "center",
    },
    activeTab: {
      backgroundColor: colors.primary,
    },
    tabText: {
      color: colors.text,
      fontWeight: "500",
    },
    activeTabText: {
      color: "white",
      fontWeight: "bold",
    },
    summaryCard: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
    },
    summaryTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "white",
      marginBottom: 12,
    },
    summaryStats: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
    statItem: {
      alignItems: "center",
    },
    statValue: {
      fontSize: 24,
      fontWeight: "bold",
      color: "white",
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 14,
      color: "white",
      opacity: 0.8,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
      marginTop: 16,
      marginBottom: 12,
    },
    goalCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      position: "relative",
    },
    goalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    goalTitleContainer: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    goalIcon: {
      marginRight: 12,
    },
    goalName: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
    },
    goalPeriod: {
      fontSize: 12,
      color: colors.text,
      opacity: 0.7,
    },
    goalProgress: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    goalProgressText: {
      fontSize: 14,
      color: colors.text,
    },
    goalProgressPercentage: {
      fontSize: 14,
      fontWeight: "bold",
      color: colors.text,
    },
    progressBarContainer: {
      height: 8,
      backgroundColor: colors.border,
      borderRadius: 4,
      overflow: "hidden",
    },
    progressBar: {
      height: "100%",
      borderRadius: 4,
    },
    completedBadge: {
      position: "absolute",
      top: 12,
      right: 12,
      backgroundColor: colors.success,
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 4,
      flexDirection: "row",
      alignItems: "center",
    },
    completedBadgeText: {
      color: "white",
      fontSize: 12,
      fontWeight: "bold",
      marginLeft: 4,
    },
    workoutCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    },
    workoutHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    workoutTitleContainer: {
      flexDirection: "row",
      alignItems: "center",
      flex: 1,
    },
    workoutIcon: {
      marginRight: 12,
    },
    workoutTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
    },
    workoutDate: {
      fontSize: 12,
      color: colors.text,
      opacity: 0.7,
    },
    workoutDetails: {
      flexDirection: "row",
      marginBottom: 8,
    },
    workoutDetail: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: 16,
    },
    workoutDetailText: {
      fontSize: 14,
      color: colors.text,
      marginLeft: 4,
    },
    workoutNotes: {
      fontSize: 14,
      color: colors.text,
      fontStyle: "italic",
    },
    challengeCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      position: "relative",
    },
    challengeTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 4,
    },
    challengeDescription: {
      fontSize: 14,
      color: colors.text,
      marginBottom: 8,
    },
    challengeDetails: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    challengeTarget: {
      fontSize: 14,
      color: colors.text,
    },
    challengePeriod: {
      fontSize: 14,
      color: colors.text,
    },
    challengeProgress: {
      fontSize: 14,
      color: colors.text,
      marginTop: 8,
    },
    challengeParticipants: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 8,
    },
    challengeParticipantsText: {
      fontSize: 14,
      color: colors.text,
      marginLeft: 4,
    },
    completedChallengeBadge: {
      position: "absolute",
      top: 12,
      right: 12,
      backgroundColor: colors.success,
      borderRadius: 12,
      paddingHorizontal: 8,
      paddingVertical: 4,
      flexDirection: "row",
      alignItems: "center",
    },
    completedChallengeBadgeText: {
      color: "white",
      fontSize: 12,
      fontWeight: "bold",
      marginLeft: 4,
    },
    joinChallengeButton: {
      backgroundColor: colors.secondary,
      borderRadius: 8,
      padding: 12,
      alignItems: "center",
      marginTop: 12,
    },
    joinChallengeButtonText: {
      color: "white",
      fontWeight: "bold",
    },
    badgesContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    badgeCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      width: "48%",
      alignItems: "center",
    },
    badgeIconContainer: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: colors.card,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 8,
      borderWidth: 2,
      borderColor: colors.primary,
    },
    badgeTitle: {
      fontSize: 14,
      fontWeight: "bold",
      color: colors.text,
      textAlign: "center",
      marginBottom: 4,
    },
    badgeDescription: {
      fontSize: 12,
      color: colors.text,
      textAlign: "center",
      marginBottom: 4,
    },
    badgeDate: {
      fontSize: 10,
      color: colors.text,
      opacity: 0.7,
      textAlign: "center",
    },
    achievementsSummary: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      alignItems: "center",
    },
    achievementsCount: {
      fontSize: 36,
      fontWeight: "bold",
      color: "white",
    },
    achievementsLabel: {
      fontSize: 16,
      color: "white",
    },
    reportCardFull: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    },
    reportCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginRight: 12,
      width: 250,
    },
    reportTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 4,
    },
    reportPeriod: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.7,
      marginBottom: 12,
    },
    reportStats: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    reportStat: {
      alignItems: "center",
    },
    reportStatValue: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
    },
    reportStatLabel: {
      fontSize: 12,
      color: colors.text,
      opacity: 0.7,
    },
    reportStatsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    reportStatItem: {
      width: "48%",
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
      alignItems: "center",
    },
    viewReportButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      padding: 8,
      alignItems: "center",
    },
    viewReportButtonText: {
      color: "white",
      fontWeight: "bold",
      fontSize: 14,
    },
    reportsScrollView: {
      marginBottom: 16,
    },
    chartCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    chartTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 8,
      textAlign: "center",
    },
    chart: {
      borderRadius: 12,
      marginVertical: 8,
    },
    addButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
      marginTop: 8,
      marginBottom: 16,
    },
    addButtonText: {
      color: "white",
      fontWeight: "bold",
      fontSize: 16,
    },
    viewMoreButton: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 12,
      alignItems: "center",
      marginBottom: 16,
    },
    viewMoreButtonText: {
      color: colors.primary,
      fontWeight: "bold",
    },
    emptyStateContainer: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 24,
      alignItems: "center",
      marginBottom: 16,
    },
    emptyStateText: {
      color: colors.text,
      textAlign: "center",
      marginBottom: 16,
    },
    filterContainer: {
      marginBottom: 16,
    },
    filterLabel: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 8,
    },
    filterButtons: {
      flexDirection: "row",
      flexWrap: "wrap",
    },
    filterButton: {
      backgroundColor: colors.card,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginRight: 8,
      marginBottom: 8,
    },
    activeFilterButton: {
      backgroundColor: colors.primary,
    },
    filterButtonText: {
      color: colors.text,
    },
    activeFilterButtonText: {
      color: "white",
      fontWeight: "bold",
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
      marginBottom: 12,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    textArea: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      height: 100,
      textAlignVertical: "top",
    },
    pickerContainer: {
      backgroundColor: colors.card,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 12,
      overflow: "hidden",
    },
    picker: {
      color: colors.text,
      height: 50,
    },
    datePickerButton: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: colors.border,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    datePickerButtonText: {
      color: colors.text,
    },
    modalButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 16,
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
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
  });

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.text, marginTop: 16 }}>
          Loading your fitness data...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "dashboard" && styles.activeTab]}
          onPress={() => setActiveTab("dashboard")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "dashboard" && styles.activeTabText,
            ]}
          >
            Dashboard
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "history" && styles.activeTab]}
          onPress={() => setActiveTab("history")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "history" && styles.activeTabText,
            ]}
          >
            History
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "goals" && styles.activeTab]}
          onPress={() => setActiveTab("goals")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "goals" && styles.activeTabText,
            ]}
          >
            Goals
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "challenges" && styles.activeTab]}
          onPress={() => setActiveTab("challenges")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "challenges" && styles.activeTabText,
            ]}
          >
            Challenges
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "achievements" && styles.activeTab]}
          onPress={() => setActiveTab("achievements")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "achievements" && styles.activeTabText,
            ]}
          >
            Badges
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === "dashboard" && renderDashboard()}
        {activeTab === "history" && renderWorkoutHistory()}
        {activeTab === "goals" && renderGoals()}
        {activeTab === "challenges" && renderChallenges()}
        {activeTab === "achievements" && renderAchievements()}
      </ScrollView>

      {/* Add Workout Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={workoutModalVisible}
        onRequestClose={() => setWorkoutModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Log Workout</Text>

            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.datePickerButtonText}>
                Date: {newWorkout.date.toLocaleDateString()}
              </Text>
              <Ionicons name="calendar-outline" size={20} color={colors.text} />
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={newWorkout.date}
                mode="date"
                display="default"
                onChange={handleDateChange}
                maximumDate={new Date()}
              />
            )}

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={newWorkout.activityType}
                style={styles.picker}
                onValueChange={(itemValue) =>
                  setNewWorkout({ ...newWorkout, activityType: itemValue })
                }
              >
                <Picker.Item label="Walking" value="walking" />
                <Picker.Item label="Running" value="running" />
                <Picker.Item label="Cycling" value="cycling" />
                <Picker.Item label="Swimming" value="swimming" />
                <Picker.Item label="Yoga" value="yoga" />
                <Picker.Item label="Weight Lifting" value="weightlifting" />
                <Picker.Item label="HIIT" value="hiit" />
                <Picker.Item label="Other" value="other" />
              </Picker>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Duration (minutes)"
              placeholderTextColor={colors.text + "80"}
              value={newWorkout.duration}
              onChangeText={(text) =>
                setNewWorkout({ ...newWorkout, duration: text })
              }
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Distance (km, optional)"
              placeholderTextColor={colors.text + "80"}
              value={newWorkout.distance}
              onChangeText={(text) =>
                setNewWorkout({ ...newWorkout, distance: text })
              }
              keyboardType="numeric"
            />

            <TextInput
              style={styles.input}
              placeholder="Calories Burned (optional)"
              placeholderTextColor={colors.text + "80"}
              value={newWorkout.caloriesBurned}
              onChangeText={(text) =>
                setNewWorkout({ ...newWorkout, caloriesBurned: text })
              }
              keyboardType="numeric"
            />

            <TextInput
              style={styles.textArea}
              placeholder="Notes (optional)"
              placeholderTextColor={colors.text + "80"}
              value={newWorkout.notes}
              onChangeText={(text) =>
                setNewWorkout({ ...newWorkout, notes: text })
              }
              multiline
              numberOfLines={4}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setWorkoutModalVisible(false);
                  resetWorkoutForm();
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={addWorkout}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.saveButtonText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Goal Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={goalModalVisible}
        onRequestClose={() => setGoalModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Goal</Text>

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={newGoal.type}
                style={styles.picker}
                onValueChange={(itemValue) =>
                  setNewGoal({
                    ...newGoal,
                    type: itemValue as "steps" | "calories" | "workouts",
                  })
                }
              >
                <Picker.Item label="Steps" value="steps" />
                <Picker.Item label="Calories" value="calories" />
                <Picker.Item label="Workouts" value="workouts" />
              </Picker>
            </View>

            <TextInput
              style={styles.input}
              placeholder={`Target (${newGoal.type})`}
              placeholderTextColor={colors.text + "80"}
              value={newGoal.target}
              onChangeText={(text) => setNewGoal({ ...newGoal, target: text })}
              keyboardType="numeric"
            />

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={newGoal.period}
                style={styles.picker}
                onValueChange={(itemValue) =>
                  setNewGoal({
                    ...newGoal,
                    period: itemValue as "daily" | "weekly" | "monthly",
                  })
                }
              >
                <Picker.Item label="Daily" value="daily" />
                <Picker.Item label="Weekly" value="weekly" />
                <Picker.Item label="Monthly" value="monthly" />
              </Picker>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setGoalModalVisible(false);
                  resetGoalForm();
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={addGoal}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Text style={styles.saveButtonText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Report Details Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={reportModalVisible}
        onRequestClose={() => setReportModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView>
            <View style={styles.modalContent}>
              {selectedReport && (
                <>
                  <Text style={styles.modalTitle}>
                    {selectedReport.period.charAt(0).toUpperCase() +
                      selectedReport.period.slice(1)}{" "}
                    Report
                  </Text>
                  <Text
                    style={{
                      color: colors.text,
                      textAlign: "center",
                      marginBottom: 16,
                    }}
                  >
                    {formatDate(selectedReport.startDate)} -{" "}
                    {formatDate(selectedReport.endDate)}
                  </Text>

                  <View style={styles.reportStatsGrid}>
                    <View style={styles.reportStatItem}>
                      <Ionicons
                        name="footsteps-outline"
                        size={20}
                        color={colors.primary}
                      />
                      <Text style={styles.reportStatLabel}>Total Steps</Text>
                      <Text style={styles.reportStatValue}>
                        {selectedReport.totalSteps}
                      </Text>
                    </View>
                    <View style={styles.reportStatItem}>
                      <Ionicons
                        name="flame-outline"
                        size={20}
                        color={colors.primary}
                      />
                      <Text style={styles.reportStatLabel}>
                        Calories Burned
                      </Text>
                      <Text style={styles.reportStatValue}>
                        {selectedReport.totalCalories}
                      </Text>
                    </View>
                    <View style={styles.reportStatItem}>
                      <Ionicons
                        name="fitness-outline"
                        size={20}
                        color={colors.primary}
                      />
                      <Text style={styles.reportStatLabel}>Workouts</Text>
                      <Text style={styles.reportStatValue}>
                        {selectedReport.totalWorkouts}
                      </Text>
                    </View>
                    <View style={styles.reportStatItem}>
                      <Ionicons
                        name="map-outline"
                        size={20}
                        color={colors.primary}
                      />
                      <Text style={styles.reportStatLabel}>Distance</Text>
                      <Text style={styles.reportStatValue}>
                        {selectedReport.totalDistance} km
                      </Text>
                    </View>
                  </View>

                  <View style={{ marginTop: 16, marginBottom: 16 }}>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "bold",
                        color: colors.text,
                        marginBottom: 8,
                      }}
                    >
                      Highlights
                    </Text>
                    <View
                      style={{
                        backgroundColor: colors.card,
                        borderRadius: 8,
                        padding: 12,
                      }}
                    >
                      <Text style={{ color: colors.text, marginBottom: 4 }}>
                        • Average Steps Per Day:{" "}
                        {selectedReport.averageStepsPerDay}
                      </Text>
                      <Text style={{ color: colors.text, marginBottom: 4 }}>
                        • Most Frequent Activity:{" "}
                        {selectedReport.mostFrequentActivity}
                      </Text>
                      <Text style={{ color: colors.text, marginBottom: 4 }}>
                        • Longest Workout: {selectedReport.longestWorkout}{" "}
                        minutes
                      </Text>
                    </View>
                  </View>

                  {selectedReport.achievements.length > 0 && (
                    <View style={{ marginBottom: 16 }}>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "bold",
                          color: colors.text,
                          marginBottom: 8,
                        }}
                      >
                        Achievements
                      </Text>
                      <View
                        style={{
                          backgroundColor: colors.card,
                          borderRadius: 8,
                          padding: 12,
                        }}
                      >
                        {selectedReport.achievements.map(
                          (achievement, index) => (
                            <Text
                              key={index}
                              style={{ color: colors.text, marginBottom: 4 }}
                            >
                              • {achievement}
                            </Text>
                          )
                        )}
                      </View>
                    </View>
                  )}

                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => setReportModalVisible(false)}
                  >
                    <Text style={styles.saveButtonText}>Close</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

export default FitnessScreen;
