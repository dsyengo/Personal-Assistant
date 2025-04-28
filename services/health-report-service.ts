import AsyncStorage from "@react-native-async-storage/async-storage";
import { Share, Platform } from "react-native";
import * as Sharing from "expo-sharing";
import * as Print from "expo-print";

// Types
export type HealthMetric = {
  value: number;
  unit: string;
  change: number; // percentage change from previous period
  status: "improved" | "declined" | "maintained" | "no-data";
};

export type NutritionSummary = {
  averageCalories: HealthMetric;
  proteinPercentage: HealthMetric;
  carbsPercentage: HealthMetric;
  fatPercentage: HealthMetric;
  mostFrequentFoods: string[];
  nutritionScore: number; // 0-100
};

export type FitnessSummary = {
  totalWorkouts: HealthMetric;
  totalSteps: HealthMetric;
  totalDistance: HealthMetric;
  totalCaloriesBurned: HealthMetric;
  averageWorkoutDuration: HealthMetric;
  mostFrequentActivities: string[];
  fitnessScore: number; // 0-100
};

export type WeightSummary = {
  startWeight: HealthMetric;
  endWeight: HealthMetric;
  weightChange: HealthMetric;
  bmiStart: HealthMetric;
  bmiEnd: HealthMetric;
  bmiChange: HealthMetric;
  weightStatus: string;
};

export type SleepSummary = {
  averageSleepDuration: HealthMetric;
  sleepQualityScore: HealthMetric;
  sleepConsistency: HealthMetric;
  sleepScore: number; // 0-100
};

export type WaterSummary = {
  averageIntake: HealthMetric;
  daysMetTarget: HealthMetric;
  hydrationScore: number; // 0-100
};

export type GoalsSummary = {
  totalGoals: number;
  completedGoals: number;
  progressPercentage: number;
  activeGoals: { name: string; progress: number }[];
};

export type HealthInsight = {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
  actionable: boolean;
  action?: string;
};

export type HealthReport = {
  id: string;
  userId: string;
  type: "weekly" | "monthly" | "quarterly" | "annual";
  title: string;
  startDate: string;
  endDate: string;
  createdAt: string;
  overallScore: number; // 0-100
  nutrition: NutritionSummary;
  fitness: FitnessSummary;
  weight: WeightSummary;
  sleep?: SleepSummary; // Optional as sleep data might not be available
  water?: WaterSummary; // Optional as water data might not be available
  goals: GoalsSummary;
  insights: HealthInsight[];
  recommendations: string[];
};

// Mock data generator for development
const generateMockData = (
  userId: string,
  type: "weekly" | "monthly" | "quarterly" | "annual"
): HealthReport => {
  const now = new Date();
  const startDate = new Date();

  // Set start date based on report type
  if (type === "weekly") {
    startDate.setDate(now.getDate() - 7);
  } else if (type === "monthly") {
    startDate.setMonth(now.getMonth() - 1);
  } else if (type === "quarterly") {
    startDate.setMonth(now.getMonth() - 3);
  } else {
    startDate.setFullYear(now.getFullYear() - 1);
  }

  // Generate title based on type and date
  const formatOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
  };
  const yearFormatOptions: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };

  let title = "";
  if (type === "weekly") {
    title = `Weekly Report: ${startDate.toLocaleDateString(
      "en-US",
      formatOptions
    )} - ${now.toLocaleDateString("en-US", formatOptions)}`;
  } else if (type === "monthly") {
    title = `Monthly Report: ${startDate.toLocaleDateString("en-US", {
      month: "long",
    })} ${startDate.getFullYear()}`;
  } else if (type === "quarterly") {
    const quarter = Math.floor(startDate.getMonth() / 3) + 1;
    title = `Q${quarter} ${startDate.getFullYear()} Report`;
  } else {
    title = `Annual Report: ${startDate.getFullYear()}`;
  }

  // Generate random metrics for demonstration
  const randomMetric = (
    min: number,
    max: number,
    unit: string
  ): HealthMetric => {
    const value = Math.floor(Math.random() * (max - min + 1)) + min;
    const change = Math.floor(Math.random() * 21) - 10; // -10% to +10%
    const status =
      change > 2 ? "improved" : change < -2 ? "declined" : "maintained";

    return {
      value,
      unit,
      change,
      status,
    };
  };

  // Generate random insights
  const insightTitles = [
    "Increase Protein Intake",
    "Improve Sleep Consistency",
    "Add More Cardio Workouts",
    "Increase Water Intake",
    "Reduce Processed Foods",
    "Add Strength Training",
    "Improve Meal Timing",
    "Take More Steps Daily",
  ];

  const insights: HealthInsight[] = Array(3)
    .fill(0)
    .map((_, i) => {
      const randomIndex = Math.floor(Math.random() * insightTitles.length);
      const title = insightTitles[randomIndex];
      insightTitles.splice(randomIndex, 1); // Remove used title

      return {
        title,
        description: `Based on your data, we recommend you ${title.toLowerCase()} to improve your overall health.`,
        priority: i === 0 ? "high" : i === 1 ? "medium" : "low",
        actionable: Math.random() > 0.3,
        action: Math.random() > 0.3 ? "View suggested plan" : undefined,
      };
    });

  // Generate recommendations
  const recommendationsList = [
    "Try to get at least 7-8 hours of sleep each night",
    "Aim for 10,000 steps daily",
    "Include more vegetables in your meals",
    "Stay hydrated by drinking at least 8 glasses of water daily",
    "Add 2-3 strength training sessions per week",
    "Take short walking breaks during long periods of sitting",
    "Consider adding meditation to your daily routine",
    "Try to eat protein with each meal",
    "Limit processed foods and added sugars",
    "Schedule regular workout sessions in your calendar",
  ];

  const shuffled = [...recommendationsList].sort(() => 0.5 - Math.random());
  const recommendations = shuffled.slice(0, 5);

  // Calculate overall score (weighted average of individual scores)
  const nutritionScore = Math.floor(Math.random() * 101);
  const fitnessScore = Math.floor(Math.random() * 101);
  const sleepScore = Math.floor(Math.random() * 101);
  const hydrationScore = Math.floor(Math.random() * 101);
  const goalProgress = Math.floor(Math.random() * 101);

  const overallScore = Math.floor(
    nutritionScore * 0.25 +
      fitnessScore * 0.25 +
      sleepScore * 0.2 +
      hydrationScore * 0.1 +
      goalProgress * 0.2
  );

  return {
    id: `report-${Date.now()}`,
    userId,
    type,
    title,
    startDate: startDate.toISOString(),
    endDate: now.toISOString(),
    createdAt: now.toISOString(),
    overallScore,
    nutrition: {
      averageCalories: randomMetric(1800, 2500, "kcal"),
      proteinPercentage: randomMetric(15, 30, "%"),
      carbsPercentage: randomMetric(40, 60, "%"),
      fatPercentage: randomMetric(20, 40, "%"),
      mostFrequentFoods: ["Chicken", "Rice", "Eggs", "Spinach", "Oatmeal"],
      nutritionScore,
    },
    fitness: {
      totalWorkouts: randomMetric(
        type === "weekly"
          ? 3
          : type === "monthly"
          ? 12
          : type === "quarterly"
          ? 36
          : 144,
        type === "weekly"
          ? 7
          : type === "monthly"
          ? 20
          : type === "quarterly"
          ? 60
          : 240,
        ""
      ),
      totalSteps: randomMetric(
        type === "weekly"
          ? 30000
          : type === "monthly"
          ? 120000
          : type === "quarterly"
          ? 360000
          : 1440000,
        type === "weekly"
          ? 70000
          : type === "monthly"
          ? 280000
          : type === "quarterly"
          ? 840000
          : 3360000,
        ""
      ),
      totalDistance: randomMetric(
        type === "weekly"
          ? 15
          : type === "monthly"
          ? 60
          : type === "quarterly"
          ? 180
          : 720,
        type === "weekly"
          ? 50
          : type === "monthly"
          ? 200
          : type === "quarterly"
          ? 600
          : 2400,
        "km"
      ),
      totalCaloriesBurned: randomMetric(
        type === "weekly"
          ? 1500
          : type === "monthly"
          ? 6000
          : type === "quarterly"
          ? 18000
          : 72000,
        type === "weekly"
          ? 3500
          : type === "monthly"
          ? 14000
          : type === "quarterly"
          ? 42000
          : 168000,
        "kcal"
      ),
      averageWorkoutDuration: randomMetric(30, 60, "min"),
      mostFrequentActivities: [
        "Walking",
        "Running",
        "Cycling",
        "Strength Training",
      ],
      fitnessScore,
    },
    weight: {
      startWeight: randomMetric(65, 85, "kg"),
      endWeight: randomMetric(65, 85, "kg"),
      weightChange: randomMetric(-3, 3, "kg"),
      bmiStart: randomMetric(20, 28, ""),
      bmiEnd: randomMetric(20, 28, ""),
      bmiChange: randomMetric(-1, 1, ""),
      weightStatus: "Healthy Weight",
    },
    sleep: {
      averageSleepDuration: randomMetric(6, 9, "hours"),
      sleepQualityScore: randomMetric(60, 95, ""),
      sleepConsistency: randomMetric(60, 95, "%"),
      sleepScore,
    },
    water: {
      averageIntake: randomMetric(1.5, 3.5, "L"),
      daysMetTarget: randomMetric(
        type === "weekly"
          ? 3
          : type === "monthly"
          ? 15
          : type === "quarterly"
          ? 45
          : 180,
        type === "weekly"
          ? 7
          : type === "monthly"
          ? 30
          : type === "quarterly"
          ? 90
          : 365,
        "days"
      ),
      hydrationScore,
    },
    goals: {
      totalGoals: Math.floor(Math.random() * 5) + 1,
      completedGoals: Math.floor(Math.random() * 3),
      progressPercentage: goalProgress,
      activeGoals: [
        { name: "Lose 5kg", progress: Math.floor(Math.random() * 101) },
        { name: "Run 5km", progress: Math.floor(Math.random() * 101) },
        {
          name: "Drink 2L water daily",
          progress: Math.floor(Math.random() * 101),
        },
      ],
    },
    insights,
    recommendations,
  };
};

// Service class for health reports
class HealthReportService {
  // Get all reports for a user
  async getReports(userId: string): Promise<HealthReport[]> {
    try {
      const reportsJson = await AsyncStorage.getItem(`reports-${userId}`);
      if (reportsJson) {
        return JSON.parse(reportsJson);
      }
      return [];
    } catch (error) {
      console.error("Failed to get reports:", error);
      return [];
    }
  }

  // Get a specific report by ID
  async getReportById(
    userId: string,
    reportId: string
  ): Promise<HealthReport | null> {
    try {
      const reports = await this.getReports(userId);
      return reports.find((report) => report.id === reportId) || null;
    } catch (error) {
      console.error("Failed to get report:", error);
      return null;
    }
  }

  // Generate a new report
  async generateReport(
    userId: string,
    type: "weekly" | "monthly" | "quarterly" | "annual"
  ): Promise<HealthReport> {
    try {
      // In a real app, this would analyze actual user data
      // For now, we'll use mock data
      const newReport = generateMockData(userId, type);

      // Save the report
      const reports = await this.getReports(userId);
      reports.unshift(newReport); // Add to beginning of array

      // Limit to 20 reports for storage efficiency
      const limitedReports = reports.slice(0, 20);

      await AsyncStorage.setItem(
        `reports-${userId}`,
        JSON.stringify(limitedReports)
      );

      return newReport;
    } catch (error) {
      console.error("Failed to generate report:", error);
      throw error;
    }
  }

  // Delete a report
  async deleteReport(userId: string, reportId: string): Promise<boolean> {
    try {
      const reports = await this.getReports(userId);
      const filteredReports = reports.filter(
        (report) => report.id !== reportId
      );

      await AsyncStorage.setItem(
        `reports-${userId}`,
        JSON.stringify(filteredReports)
      );

      return true;
    } catch (error) {
      console.error("Failed to delete report:", error);
      return false;
    }
  }

  // Share a report
  async shareReport(report: HealthReport): Promise<boolean> {
    try {
      // Generate HTML for the report
      const htmlContent = this.generateReportHTML(report);

      // Create a PDF
      const { uri } = await Print.printToFileAsync({ html: htmlContent });

      // On iOS, we need to share the file
      if (Platform.OS === "ios") {
        await Sharing.shareAsync(uri);
      } else {
        // On Android, we can use the Share API
        const fileUri = `file://${uri}`;
        await Share.share({
          title: report.title,
          message: `Check out my ${report.type} health report!`,
          url: fileUri,
        });
      }

      return true;
    } catch (error) {
      console.error("Failed to share report:", error);
      return false;
    }
  }

  // Generate HTML for PDF export
  private generateReportHTML(report: HealthReport): string {
    // Helper function to create a metric row
    const metricRow = (label: string, metric: HealthMetric) => {
      const changeColor =
        metric.change > 0
          ? "#4CAF50"
          : metric.change < 0
          ? "#F44336"
          : "#757575";
      const changeIcon =
        metric.change > 0 ? "▲" : metric.change < 0 ? "▼" : "•";
      const changeText =
        metric.change !== 0 ? `${changeIcon} ${Math.abs(metric.change)}%` : "";

      return `
        <tr>
          <td>${label}</td>
          <td>${metric.value} ${metric.unit}</td>
          <td style="color: ${changeColor};">${changeText}</td>
        </tr>
      `;
    };

    // Generate score gauge
    const scoreGauge = (score: number, label: string) => {
      const color =
        score >= 80 ? "#4CAF50" : score >= 60 ? "#FF9800" : "#F44336";

      return `
        <div style="text-align: center; margin: 10px 0;">
          <div style="position: relative; width: 100px; height: 100px; margin: 0 auto;">
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#E0E0E0" stroke-width="10" />
              <circle cx="50" cy="50" r="45" fill="none" stroke="${color}" stroke-width="10" 
                stroke-dasharray="${
                  score * 2.83
                }" stroke-dashoffset="0" transform="rotate(-90 50 50)" />
              <text x="50" y="55" font-family="Arial" font-size="20" text-anchor="middle" fill="${color}">${score}</text>
            </svg>
          </div>
          <div style="margin-top: 5px; font-weight: bold;">${label}</div>
        </div>
      `;
    };

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${report.title}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
            }
            h1, h2, h3 {
              color: #2196F3;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 1px solid #eee;
            }
            .date-range {
              color: #757575;
              font-size: 16px;
              margin-top: 5px;
            }
            .score-container {
              display: flex;
              justify-content: space-around;
              flex-wrap: wrap;
              margin: 20px 0;
              padding: 15px;
              background-color: #f5f5f5;
              border-radius: 8px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th, td {
              padding: 12px 15px;
              text-align: left;
              border-bottom: 1px solid #ddd;
            }
            th {
              background-color: #f5f5f5;
            }
            .section {
              margin: 30px 0;
              padding-bottom: 20px;
              border-bottom: 1px solid #eee;
            }
            .insight {
              padding: 15px;
              margin: 10px 0;
              border-radius: 8px;
              background-color: #E3F2FD;
            }
            .insight.high {
              background-color: #FFEBEE;
            }
            .insight.medium {
              background-color: #FFF8E1;
            }
            .insight-title {
              font-weight: bold;
              margin-bottom: 5px;
            }
            .recommendations {
              background-color: #E8F5E9;
              padding: 15px;
              border-radius: 8px;
            }
            .recommendation-item {
              margin: 10px 0;
            }
            .footer {
              text-align: center;
              margin-top: 40px;
              color: #757575;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${report.title}</h1>
            <div class="date-range">
              ${new Date(report.startDate).toLocaleDateString()} - ${new Date(
      report.endDate
    ).toLocaleDateString()}
            </div>
          </div>
          
          <div class="section">
            <h2>Overall Health Score: ${report.overallScore}/100</h2>
            <div class="score-container">
              ${scoreGauge(report.nutrition.nutritionScore, "Nutrition")}
              ${scoreGauge(report.fitness.fitnessScore, "Fitness")}
              ${
                report.sleep ? scoreGauge(report.sleep.sleepScore, "Sleep") : ""
              }
              ${
                report.water
                  ? scoreGauge(report.water.hydrationScore, "Hydration")
                  : ""
              }
              ${scoreGauge(report.goals.progressPercentage, "Goals")}
            </div>
          </div>
          
          <div class="section">
            <h2>Nutrition Summary</h2>
            <table>
              <tr>
                <th>Metric</th>
                <th>Value</th>
                <th>Change</th>
              </tr>
              ${metricRow(
                "Average Daily Calories",
                report.nutrition.averageCalories
              )}
              ${metricRow("Protein", report.nutrition.proteinPercentage)}
              ${metricRow("Carbs", report.nutrition.carbsPercentage)}
              ${metricRow("Fat", report.nutrition.fatPercentage)}
            </table>
            <p>Most frequent foods: ${report.nutrition.mostFrequentFoods.join(
              ", "
            )}</p>
          </div>
          
          <div class="section">
            <h2>Fitness Summary</h2>
            <table>
              <tr>
                <th>Metric</th>
                <th>Value</th>
                <th>Change</th>
              </tr>
              ${metricRow("Total Workouts", report.fitness.totalWorkouts)}
              ${metricRow("Total Steps", report.fitness.totalSteps)}
              ${metricRow("Total Distance", report.fitness.totalDistance)}
              ${metricRow(
                "Calories Burned",
                report.fitness.totalCaloriesBurned
              )}
              ${metricRow(
                "Avg. Workout Duration",
                report.fitness.averageWorkoutDuration
              )}
            </table>
            <p>Most frequent activities: ${report.fitness.mostFrequentActivities.join(
              ", "
            )}</p>
          </div>
          
          <div class="section">
            <h2>Weight Summary</h2>
            <table>
              <tr>
                <th>Metric</th>
                <th>Value</th>
                <th>Change</th>
              </tr>
              ${metricRow("Starting Weight", report.weight.startWeight)}
              ${metricRow("Ending Weight", report.weight.endWeight)}
              ${metricRow("Weight Change", report.weight.weightChange)}
              ${metricRow("Starting BMI", report.weight.bmiStart)}
              ${metricRow("Ending BMI", report.weight.bmiEnd)}
            </table>
            <p>Weight Status: ${report.weight.weightStatus}</p>
          </div>
          
          ${
            report.sleep
              ? `
          <div class="section">
            <h2>Sleep Summary</h2>
            <table>
              <tr>
                <th>Metric</th>
                <th>Value</th>
                <th>Change</th>
              </tr>
              ${metricRow(
                "Average Sleep Duration",
                report.sleep.averageSleepDuration
              )}
              ${metricRow(
                "Sleep Quality Score",
                report.sleep.sleepQualityScore
              )}
              ${metricRow("Sleep Consistency", report.sleep.sleepConsistency)}
            </table>
          </div>
          `
              : ""
          }
          
          ${
            report.water
              ? `
          <div class="section">
            <h2>Hydration Summary</h2>
            <table>
              <tr>
                <th>Metric</th>
                <th>Value</th>
                <th>Change</th>
              </tr>
              ${metricRow("Average Daily Intake", report.water.averageIntake)}
              ${metricRow("Days Met Target", report.water.daysMetTarget)}
            </table>
          </div>
          `
              : ""
          }
          
          <div class="section">
            <h2>Goals Progress</h2>
            <p>Completed ${report.goals.completedGoals} of ${
      report.goals.totalGoals
    } goals (${report.goals.progressPercentage}%)</p>
            <table>
              <tr>
                <th>Goal</th>
                <th>Progress</th>
              </tr>
              ${report.goals.activeGoals
                .map(
                  (goal) => `
                <tr>
                  <td>${goal.name}</td>
                  <td>${goal.progress}%</td>
                </tr>
              `
                )
                .join("")}
            </table>
          </div>
          
          <div class="section">
            <h2>Health Insights</h2>
            ${report.insights
              .map(
                (insight) => `
              <div class="insight ${insight.priority}">
                <div class="insight-title">${insight.title}</div>
                <p>${insight.description}</p>
              </div>
            `
              )
              .join("")}
          </div>
          
          <div class="section">
            <h2>Recommendations</h2>
            <div class="recommendations">
              ${report.recommendations
                .map(
                  (rec) => `
                <div class="recommendation-item">• ${rec}</div>
              `
                )
                .join("")}
            </div>
          </div>
          
          <div class="footer">
            <p>Generated by Health Assistant on ${new Date(
              report.createdAt
            ).toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;
  }
}

export default new HealthReportService();
