"use client";

import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  useWindowDimensions,
} from "react-native";
import { useTheme } from "../contexts/theme-context";
import { useAuth } from "../(auth)/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import HealthReportService, {
  type HealthReport,
  type HealthMetric,
} from "../../services/health-report-service";
import { BarChart, PieChart } from "react-native-chart-kit";

const ReportDetailScreen = () => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const userId = user?.id || "";
  const { id } = useLocalSearchParams<{ id: string }>();
  const { width: screenWidth } = useWindowDimensions();

  const [report, setReport] = useState<HealthReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (userId && id) {
      loadReport();
    }
  }, [userId, id]);

  const loadReport = async () => {
    setIsLoading(true);
    try {
      const reportData = await HealthReportService.getReportById(userId, id);
      if (reportData) {
        setReport(reportData);
      } else {
        Alert.alert("Error", "Report not found");
        router.back();
      }
    } catch (error) {
      console.error("Failed to load report:", error);
      Alert.alert("Error", "Failed to load the health report");
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const handleShareReport = async () => {
    if (!report) return;

    try {
      await HealthReportService.shareReport(report);
    } catch (error) {
      console.error("Failed to share report:", error);
      Alert.alert("Error", "Failed to share the report");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return colors.success;
    if (score >= 60) return colors.accent;
    return colors.error;
  };

  const getChangeIcon = (change: number) => {
    if (change > 0) return "arrow-up";
    if (change < 0) return "arrow-down";
    return "remove";
  };

  const getChangeColor = (change: number, inverse = false) => {
    if (change > 0) return inverse ? colors.error : colors.success;
    if (change < 0) return inverse ? colors.success : colors.error;
    return colors.text;
  };

  const renderMetricRow = (
    label: string,
    metric: HealthMetric,
    inverse = false
  ) => {
    return (
      <View style={styles.metricRow}>
        <Text style={styles.metricLabel}>{label}</Text>
        <View style={styles.metricValueContainer}>
          <Text style={styles.metricValue}>
            {metric.value} {metric.unit}
          </Text>
          {metric.change !== 0 && (
            <View style={styles.changeContainer}>
              <Ionicons
                name={getChangeIcon(metric.change)}
                size={14}
                color={getChangeColor(metric.change, inverse)}
              />
              <Text
                style={[
                  styles.changeText,
                  { color: getChangeColor(metric.change, inverse) },
                ]}
              >
                {Math.abs(metric.change)}%
              </Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderOverviewTab = () => {
    if (!report) return null;

    // Prepare data for the score chart
    const scoreData = {
      labels: ["Nutrition", "Fitness", "Sleep", "Hydration", "Goals"],
      datasets: [
        {
          data: [
            report.nutrition.nutritionScore,
            report.fitness.fitnessScore,
            report.sleep?.sleepScore || 0,
            report.water?.hydrationScore || 0,
            report.goals.progressPercentage,
          ],
        },
      ],
    };

    // Filter out zero values (for categories that might not have data)
    scoreData.labels = scoreData.labels.filter(
      (_, i) => scoreData.datasets[0].data[i] > 0
    );
    scoreData.datasets[0].data = scoreData.datasets[0].data.filter(
      (val) => val > 0
    );

    return (
      <View>
        <View style={styles.scoreCard}>
          <Text style={styles.sectionTitle}>Overall Health Score</Text>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreValue}>{report.overallScore}</Text>
            <Text style={styles.scoreLabel}>/100</Text>
          </View>
          <Text style={styles.scoreDescription}>
            {report.overallScore >= 80
              ? "Excellent"
              : report.overallScore >= 60
              ? "Good"
              : report.overallScore >= 40
              ? "Fair"
              : "Needs Improvement"}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Category Scores</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chartContainer}
        >
          <BarChart
            data={scoreData}
            width={Math.max(screenWidth - 40, scoreData.labels.length * 80)}
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
              barPercentage: 0.7,
            }}
            style={styles.chart}
            fromZero
          />
        </ScrollView>

        <Text style={styles.sectionTitle}>Key Insights</Text>
        {report.insights.map((insight, index) => (
          <View
            key={index}
            style={[
              styles.insightCard,
              {
                backgroundColor:
                  insight.priority === "high"
                    ? colors.error + "20"
                    : insight.priority === "medium"
                    ? colors.accent + "20"
                    : colors.primary + "20",
              },
            ]}
          >
            <View style={styles.insightHeader}>
              <Ionicons
                name={
                  insight.priority === "high"
                    ? "alert-circle"
                    : insight.priority === "medium"
                    ? "information-circle"
                    : "bulb-outline"
                }
                size={24}
                color={
                  insight.priority === "high"
                    ? colors.error
                    : insight.priority === "medium"
                    ? colors.accent
                    : colors.primary
                }
              />
              <Text style={styles.insightTitle}>{insight.title}</Text>
            </View>
            <Text style={styles.insightDescription}>{insight.description}</Text>
            {insight.actionable && (
              <TouchableOpacity style={styles.insightAction}>
                <Text style={styles.insightActionText}>
                  {insight.action || "Learn more"}
                </Text>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={colors.primary}
                />
              </TouchableOpacity>
            )}
          </View>
        ))}

        <Text style={styles.sectionTitle}>Recommendations</Text>
        <View style={styles.recommendationsCard}>
          {report.recommendations.map((recommendation, index) => (
            <View key={index} style={styles.recommendationItem}>
              <Ionicons
                name="checkmark-circle"
                size={20}
                color={colors.primary}
                style={styles.recommendationIcon}
              />
              <Text style={styles.recommendationText}>{recommendation}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderNutritionTab = () => {
    if (!report) return null;

    // Prepare data for the macros pie chart
    const macrosData = [
      {
        name: "Protein",
        population: report.nutrition.proteinPercentage.value,
        color: colors.primary,
        legendFontColor: colors.text,
        legendFontSize: 12,
      },
      {
        name: "Carbs",
        population: report.nutrition.carbsPercentage.value,
        color: colors.secondary,
        legendFontColor: colors.text,
        legendFontSize: 12,
      },
      {
        name: "Fat",
        population: report.nutrition.fatPercentage.value,
        color: colors.accent,
        legendFontColor: colors.text,
        legendFontSize: 12,
      },
    ];

    return (
      <View>
        <View style={styles.scoreCard}>
          <Text style={styles.sectionTitle}>Nutrition Score</Text>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreValue}>
              {report.nutrition.nutritionScore}
            </Text>
            <Text style={styles.scoreLabel}>/100</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Macronutrient Distribution</Text>
        <View style={styles.chartCard}>
          <PieChart
            data={macrosData}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundColor: colors.card,
              backgroundGradientFrom: colors.card,
              backgroundGradientTo: colors.card,
              color: (opacity = 1) => colors.primary,
              labelColor: (opacity = 1) => colors.text,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
          />
        </View>

        <Text style={styles.sectionTitle}>Nutrition Metrics</Text>
        <View style={styles.metricsCard}>
          {renderMetricRow(
            "Average Daily Calories",
            report.nutrition.averageCalories
          )}
          {renderMetricRow("Protein", report.nutrition.proteinPercentage)}
          {renderMetricRow("Carbs", report.nutrition.carbsPercentage)}
          {renderMetricRow("Fat", report.nutrition.fatPercentage)}
        </View>

        <Text style={styles.sectionTitle}>Most Frequent Foods</Text>
        <View style={styles.foodsCard}>
          {report.nutrition.mostFrequentFoods.map((food, index) => (
            <View key={index} style={styles.foodItem}>
              <Ionicons
                name="nutrition-outline"
                size={20}
                color={colors.primary}
                style={styles.foodIcon}
              />
              <Text style={styles.foodText}>{food}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderFitnessTab = () => {
    if (!report) return null;

    return (
      <View>
        <View style={styles.scoreCard}>
          <Text style={styles.sectionTitle}>Fitness Score</Text>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreValue}>{report.fitness.fitnessScore}</Text>
            <Text style={styles.scoreLabel}>/100</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Fitness Metrics</Text>
        <View style={styles.metricsCard}>
          {renderMetricRow("Total Workouts", report.fitness.totalWorkouts)}
          {renderMetricRow("Total Steps", report.fitness.totalSteps)}
          {renderMetricRow("Total Distance", report.fitness.totalDistance)}
          {renderMetricRow(
            "Calories Burned",
            report.fitness.totalCaloriesBurned
          )}
          {renderMetricRow(
            "Avg. Workout Duration",
            report.fitness.averageWorkoutDuration
          )}
        </View>

        <Text style={styles.sectionTitle}>Most Frequent Activities</Text>
        <View style={styles.activitiesCard}>
          {report.fitness.mostFrequentActivities.map((activity, index) => (
            <View key={index} style={styles.activityItem}>
              <Ionicons
                name={
                  activity.toLowerCase() === "walking"
                    ? "walk-outline"
                    : activity.toLowerCase() === "running"
                    ? "bicycle-outline"
                    : activity.toLowerCase() === "cycling"
                    ? "bicycle-outline"
                    : activity.toLowerCase() === "strength training"
                    ? "barbell-outline"
                    : "fitness-outline"
                }
                size={20}
                color={colors.primary}
                style={styles.activityIcon}
              />
              <Text style={styles.activityText}>{activity}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderWeightTab = () => {
    if (!report) return null;

    return (
      <View>
        <Text style={styles.sectionTitle}>Weight Summary</Text>
        <View style={styles.metricsCard}>
          {renderMetricRow("Starting Weight", report.weight.startWeight)}
          {renderMetricRow("Ending Weight", report.weight.endWeight)}
          {renderMetricRow("Weight Change", report.weight.weightChange, true)}
          <View style={styles.divider} />
          {renderMetricRow("Starting BMI", report.weight.bmiStart)}
          {renderMetricRow("Ending BMI", report.weight.bmiEnd)}
          {renderMetricRow("BMI Change", report.weight.bmiChange, true)}
        </View>

        <View style={styles.weightStatusCard}>
          <Text style={styles.weightStatusLabel}>Weight Status:</Text>
          <Text style={styles.weightStatusValue}>
            {report.weight.weightStatus}
          </Text>
        </View>
      </View>
    );
  };

  const renderOtherTab = () => {
    if (!report) return null;

    return (
      <View>
        {report.sleep && (
          <>
            <View style={styles.scoreCard}>
              <Text style={styles.sectionTitle}>Sleep Score</Text>
              <View style={styles.scoreCircle}>
                <Text style={styles.scoreValue}>{report.sleep.sleepScore}</Text>
                <Text style={styles.scoreLabel}>/100</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Sleep Metrics</Text>
            <View style={styles.metricsCard}>
              {renderMetricRow(
                "Average Sleep Duration",
                report.sleep.averageSleepDuration
              )}
              {renderMetricRow("Sleep Quality", report.sleep.sleepQualityScore)}
              {renderMetricRow(
                "Sleep Consistency",
                report.sleep.sleepConsistency
              )}
            </View>
          </>
        )}

        {report.water && (
          <>
            <View style={styles.scoreCard}>
              <Text style={styles.sectionTitle}>Hydration Score</Text>
              <View style={styles.scoreCircle}>
                <Text style={styles.scoreValue}>
                  {report.water.hydrationScore}
                </Text>
                <Text style={styles.scoreLabel}>/100</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Hydration Metrics</Text>
            <View style={styles.metricsCard}>
              {renderMetricRow(
                "Average Daily Intake",
                report.water.averageIntake
              )}
              {renderMetricRow("Days Met Target", report.water.daysMetTarget)}
            </View>
          </>
        )}

        <Text style={styles.sectionTitle}>Goals Progress</Text>
        <View style={styles.goalsCard}>
          <View style={styles.goalsSummary}>
            <Text style={styles.goalsSummaryText}>
              Completed {report.goals.completedGoals} of{" "}
              {report.goals.totalGoals} goals ({report.goals.progressPercentage}
              %)
            </Text>
          </View>

          {report.goals.activeGoals.map((goal, index) => (
            <View key={index} style={styles.goalItem}>
              <Text style={styles.goalName}>{goal.name}</Text>
              <View style={styles.goalProgressContainer}>
                <View style={styles.goalProgressBarBackground}>
                  <View
                    style={[
                      styles.goalProgressBar,
                      {
                        width: `${goal.progress}%`,
                        backgroundColor:
                          goal.progress >= 100
                            ? colors.success
                            : colors.primary,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.goalProgressText}>{goal.progress}%</Text>
              </View>
            </View>
          ))}
        </View>
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
    header: {
      marginBottom: 20,
    },
    backButton: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 16,
    },
    backButtonText: {
      fontSize: 16,
      color: colors.primary,
      marginLeft: 4,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.text,
    },
    dateRange: {
      fontSize: 16,
      color: colors.text,
      opacity: 0.7,
      marginTop: 4,
    },
    actionsContainer: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginTop: 8,
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      padding: 8,
      borderRadius: 8,
    },
    actionButtonText: {
      fontSize: 14,
      marginLeft: 4,
      color: colors.secondary,
    },
    tabsContainer: {
      flexDirection: "row",
      marginVertical: 16,
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
    scoreCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      alignItems: "center",
    },
    scoreCircle: {
      width: 120,
      height: 120,
      borderRadius: 60,
      backgroundColor: colors.background,
      justifyContent: "center",
      alignItems: "center",
      marginVertical: 16,
      borderWidth: 8,
      borderColor: getScoreColor(report?.overallScore || 0),
    },
    scoreValue: {
      fontSize: 36,
      fontWeight: "bold",
      color: getScoreColor(report?.overallScore || 0),
    },
    scoreLabel: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.7,
    },
    scoreDescription: {
      fontSize: 16,
      fontWeight: "bold",
      color: getScoreColor(report?.overallScore || 0),
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 12,
    },
    chartContainer: {
      marginBottom: 16,
    },
    chart: {
      borderRadius: 12,
      paddingRight: 16,
    },
    chartCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      alignItems: "center",
    },
    insightCard: {
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    },
    insightHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    insightTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
      marginLeft: 8,
    },
    insightDescription: {
      fontSize: 14,
      color: colors.text,
      marginBottom: 8,
    },
    insightAction: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
    },
    insightActionText: {
      fontSize: 14,
      color: colors.primary,
      marginRight: 4,
    },
    recommendationsCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    recommendationItem: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 12,
    },
    recommendationIcon: {
      marginRight: 8,
      marginTop: 2,
    },
    recommendationText: {
      fontSize: 14,
      color: colors.text,
      flex: 1,
    },
    metricsCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    metricRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    metricLabel: {
      fontSize: 14,
      color: colors.text,
    },
    metricValueContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    metricValue: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
    },
    changeContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginLeft: 8,
    },
    changeText: {
      fontSize: 12,
      marginLeft: 2,
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginVertical: 8,
    },
    foodsCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    foodItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    foodIcon: {
      marginRight: 12,
    },
    foodText: {
      fontSize: 14,
      color: colors.text,
    },
    activitiesCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    activityItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    activityIcon: {
      marginRight: 12,
    },
    activityText: {
      fontSize: 14,
      color: colors.text,
    },
    weightStatusCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      flexDirection: "row",
      alignItems: "center",
    },
    weightStatusLabel: {
      fontSize: 14,
      color: colors.text,
      marginRight: 8,
    },
    weightStatusValue: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
    },
    goalsCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    goalsSummary: {
      marginBottom: 16,
      padding: 8,
      backgroundColor: colors.background,
      borderRadius: 8,
    },
    goalsSummaryText: {
      fontSize: 14,
      color: colors.text,
      textAlign: "center",
    },
    goalItem: {
      marginBottom: 16,
    },
    goalName: {
      fontSize: 14,
      color: colors.text,
      marginBottom: 8,
    },
    goalProgressContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    goalProgressBarBackground: {
      flex: 1,
      height: 8,
      backgroundColor: colors.border,
      borderRadius: 4,
      overflow: "hidden",
      marginRight: 8,
    },
    goalProgressBar: {
      height: "100%",
      borderRadius: 4,
    },
    goalProgressText: {
      fontSize: 12,
      color: colors.text,
      width: 40,
      textAlign: "right",
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
          Loading report details...
        </Text>
      </View>
    );
  }

  if (!report) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={{ color: colors.text }}>Report not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color={colors.primary} />
            <Text style={styles.backButtonText}>Back to Reports</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{report.title}</Text>
          <Text style={styles.dateRange}>
            {formatDate(report.startDate)} - {formatDate(report.endDate)}
          </Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleShareReport}
            >
              <Ionicons
                name="share-outline"
                size={20}
                color={colors.secondary}
              />
              <Text style={styles.actionButtonText}>Share Report</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "overview" && styles.activeTab]}
            onPress={() => setActiveTab("overview")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "overview" && styles.activeTabText,
              ]}
            >
              Overview
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "nutrition" && styles.activeTab]}
            onPress={() => setActiveTab("nutrition")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "nutrition" && styles.activeTabText,
              ]}
            >
              Nutrition
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "fitness" && styles.activeTab]}
            onPress={() => setActiveTab("fitness")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "fitness" && styles.activeTabText,
              ]}
            >
              Fitness
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "weight" && styles.activeTab]}
            onPress={() => setActiveTab("weight")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "weight" && styles.activeTabText,
              ]}
            >
              Weight
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "other" && styles.activeTab]}
            onPress={() => setActiveTab("other")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "other" && styles.activeTabText,
              ]}
            >
              Other
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === "overview" && renderOverviewTab()}
        {activeTab === "nutrition" && renderNutritionTab()}
        {activeTab === "fitness" && renderFitnessTab()}
        {activeTab === "weight" && renderWeightTab()}
        {activeTab === "other" && renderOtherTab()}
      </ScrollView>
    </View>
  );
};

export default ReportDetailScreen;
