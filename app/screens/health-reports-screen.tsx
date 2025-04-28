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
  RefreshControl,
  Modal,
} from "react-native";
import { useTheme } from "../contexts/theme-context";
import { useAuth } from "../(auth)/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import HealthReportService, {
  type HealthReport,
} from "../../services/health-report-service";

const HealthReportsScreen = () => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const userId = user?.id || "";

  const [reports, setReports] = useState<HealthReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportTypeModalVisible, setReportTypeModalVisible] = useState(false);

  useEffect(() => {
    if (userId) {
      loadReports();
    }
  }, [userId]);

  const loadReports = async () => {
    setIsLoading(true);
    try {
      const userReports = await HealthReportService.getReports(userId);
      setReports(userReports);
    } catch (error) {
      console.error("Failed to load reports:", error);
      Alert.alert("Error", "Failed to load your health reports");
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReports();
    setRefreshing(false);
  };

  const handleGenerateReport = async (
    type: "weekly" | "monthly" | "quarterly" | "annual"
  ) => {
    setReportTypeModalVisible(false);
    setGeneratingReport(true);
    try {
      const newReport = await HealthReportService.generateReport(userId, type);
      setReports([newReport, ...reports]);
      router.push(`/report-detail?id=${newReport.id}`);
    } catch (error) {
      console.error("Failed to generate report:", error);
      Alert.alert("Error", "Failed to generate health report");
    } finally {
      setGeneratingReport(false);
    }
  };

  const handleDeleteReport = (reportId: string) => {
    Alert.alert(
      "Delete Report",
      "Are you sure you want to delete this report? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await HealthReportService.deleteReport(userId, reportId);
              setReports(reports.filter((report) => report.id !== reportId));
            } catch (error) {
              console.error("Failed to delete report:", error);
              Alert.alert("Error", "Failed to delete report");
            }
          },
        },
      ]
    );
  };

  const handleViewReport = (reportId: string) => {
    router.push(`/report-detail?id=${reportId}`);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return colors.success;
    if (score >= 60) return colors.accent;
    return colors.error;
  };

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case "weekly":
        return "calendar-outline";
      case "monthly":
        return "calendar";
      case "quarterly":
        return "stats-chart-outline";
      case "annual":
        return "analytics-outline";
      default:
        return "document-text-outline";
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
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.text,
    },
    subtitle: {
      fontSize: 16,
      color: colors.text,
      opacity: 0.7,
      marginTop: 4,
    },
    generateButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
      marginVertical: 16,
      flexDirection: "row",
      justifyContent: "center",
    },
    generateButtonText: {
      color: "white",
      fontWeight: "bold",
      fontSize: 16,
      marginLeft: 8,
    },
    reportCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    reportHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 12,
    },
    reportTypeContainer: {
      flexDirection: "row",
      alignItems: "center",
    },
    reportTypeIcon: {
      marginRight: 8,
      backgroundColor: colors.primary + "20",
      padding: 8,
      borderRadius: 8,
    },
    reportType: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: "bold",
    },
    reportTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 4,
    },
    reportDate: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.7,
      marginBottom: 12,
    },
    scoreContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    scoreLabel: {
      fontSize: 14,
      color: colors.text,
      marginRight: 8,
    },
    scoreValue: {
      fontSize: 18,
      fontWeight: "bold",
    },
    metricsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginBottom: 12,
    },
    metricItem: {
      width: "48%",
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
    },
    metricLabel: {
      fontSize: 12,
      color: colors.text,
      opacity: 0.7,
    },
    metricValue: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
    },
    actionsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
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
    },
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      padding: 40,
      marginTop: 40,
    },
    emptyStateText: {
      fontSize: 16,
      color: colors.text,
      textAlign: "center",
      marginTop: 16,
      marginBottom: 24,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
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
    reportTypeButton: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 16,
      marginBottom: 12,
      flexDirection: "row",
      alignItems: "center",
    },
    reportTypeButtonText: {
      fontSize: 16,
      color: colors.text,
      marginLeft: 12,
    },
    reportTypeDescription: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.7,
      marginLeft: 36,
      marginTop: 4,
      marginBottom: 8,
    },
    cancelButton: {
      backgroundColor: colors.border,
      borderRadius: 8,
      padding: 12,
      alignItems: "center",
      marginTop: 8,
    },
    cancelButtonText: {
      color: colors.text,
      fontWeight: "bold",
    },
  });

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.text, marginTop: 16 }}>
          Loading your health reports...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.title}>Health Reports</Text>
          <Text style={styles.subtitle}>
            Track your health progress over time
          </Text>
        </View>

        <TouchableOpacity
          style={styles.generateButton}
          onPress={() => setReportTypeModalVisible(true)}
          disabled={generatingReport}
        >
          {generatingReport ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <>
              <Ionicons name="add-circle-outline" size={20} color="white" />
              <Text style={styles.generateButtonText}>Generate New Report</Text>
            </>
          )}
        </TouchableOpacity>

        {reports.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons
              name="document-text-outline"
              size={64}
              color={colors.primary}
            />
            <Text style={styles.emptyStateText}>
              You don't have any health reports yet. Generate your first report
              to track your health progress!
            </Text>
          </View>
        ) : (
          reports.map((report) => (
            <View key={report.id} style={styles.reportCard}>
              <View style={styles.reportHeader}>
                <View style={styles.reportTypeContainer}>
                  <View style={styles.reportTypeIcon}>
                    <Ionicons
                      name={getReportTypeIcon(report.type)}
                      size={20}
                      color={colors.primary}
                    />
                  </View>
                  <Text style={styles.reportType}>
                    {report.type.charAt(0).toUpperCase() + report.type.slice(1)}{" "}
                    Report
                  </Text>
                </View>
                <TouchableOpacity onPress={() => handleDeleteReport(report.id)}>
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color={colors.error}
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.reportTitle}>{report.title}</Text>
              <Text style={styles.reportDate}>
                {formatDate(report.startDate)} - {formatDate(report.endDate)}
              </Text>

              <View style={styles.scoreContainer}>
                <Text style={styles.scoreLabel}>Overall Health Score:</Text>
                <Text
                  style={[
                    styles.scoreValue,
                    { color: getScoreColor(report.overallScore) },
                  ]}
                >
                  {report.overallScore}/100
                </Text>
              </View>

              <View style={styles.metricsContainer}>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Nutrition Score</Text>
                  <Text
                    style={[
                      styles.metricValue,
                      { color: getScoreColor(report.nutrition.nutritionScore) },
                    ]}
                  >
                    {report.nutrition.nutritionScore}/100
                  </Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Fitness Score</Text>
                  <Text
                    style={[
                      styles.metricValue,
                      { color: getScoreColor(report.fitness.fitnessScore) },
                    ]}
                  >
                    {report.fitness.fitnessScore}/100
                  </Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Weight Change</Text>
                  <Text style={styles.metricValue}>
                    {report.weight.weightChange.value > 0 ? "+" : ""}
                    {report.weight.weightChange.value}{" "}
                    {report.weight.weightChange.unit}
                  </Text>
                </View>
                <View style={styles.metricItem}>
                  <Text style={styles.metricLabel}>Goals Progress</Text>
                  <Text
                    style={[
                      styles.metricValue,
                      { color: getScoreColor(report.goals.progressPercentage) },
                    ]}
                  >
                    {report.goals.progressPercentage}%
                  </Text>
                </View>
              </View>

              <View style={styles.actionsContainer}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleViewReport(report.id)}
                >
                  <Ionicons
                    name="eye-outline"
                    size={18}
                    color={colors.primary}
                  />
                  <Text
                    style={[styles.actionButtonText, { color: colors.primary }]}
                  >
                    View Details
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => {
                    HealthReportService.shareReport(report);
                  }}
                >
                  <Ionicons
                    name="share-outline"
                    size={18}
                    color={colors.secondary}
                  />
                  <Text
                    style={[
                      styles.actionButtonText,
                      { color: colors.secondary },
                    ]}
                  >
                    Share
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Report Type Selection Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={reportTypeModalVisible}
        onRequestClose={() => setReportTypeModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Generate Health Report</Text>

            <TouchableOpacity
              style={styles.reportTypeButton}
              onPress={() => handleGenerateReport("weekly")}
            >
              <Ionicons
                name="calendar-outline"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.reportTypeButtonText}>Weekly Report</Text>
            </TouchableOpacity>
            <Text style={styles.reportTypeDescription}>
              Summary of your health data from the past 7 days
            </Text>

            <TouchableOpacity
              style={styles.reportTypeButton}
              onPress={() => handleGenerateReport("monthly")}
            >
              <Ionicons name="calendar" size={24} color={colors.primary} />
              <Text style={styles.reportTypeButtonText}>Monthly Report</Text>
            </TouchableOpacity>
            <Text style={styles.reportTypeDescription}>
              Comprehensive analysis of your health for the past month
            </Text>

            <TouchableOpacity
              style={styles.reportTypeButton}
              onPress={() => handleGenerateReport("quarterly")}
            >
              <Ionicons
                name="stats-chart-outline"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.reportTypeButtonText}>Quarterly Report</Text>
            </TouchableOpacity>
            <Text style={styles.reportTypeDescription}>
              Detailed trends and patterns over the past 3 months
            </Text>

            <TouchableOpacity
              style={styles.reportTypeButton}
              onPress={() => handleGenerateReport("annual")}
            >
              <Ionicons
                name="analytics-outline"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.reportTypeButtonText}>Annual Report</Text>
            </TouchableOpacity>
            <Text style={styles.reportTypeDescription}>
              Complete year-in-review of your health journey
            </Text>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setReportTypeModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HealthReportsScreen;
