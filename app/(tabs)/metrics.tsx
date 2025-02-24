import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Colors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { Bar } from "react-native-progress";

const screenWidth = Dimensions.get("window").width;

const Metrics: React.FC = () => {
  const [fitnessData, setFitnessData] = useState({
    steps: 7500,
    calorieIntake: 1800,
    workoutTime: 45, // in minutes
    stepGoal: 10000,
    calorieGoal: 2000,
    workoutGoal: 60,
  });

  const progress = {
    steps: fitnessData.steps / fitnessData.stepGoal,
    calories: fitnessData.calorieIntake / fitnessData.calorieGoal,
    workout: fitnessData.workoutTime / fitnessData.workoutGoal,
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Fitness Goal Tracking</Text>

      {/* Steps Progress */}
      <View style={styles.metricCard}>
        <Ionicons name="walk" size={24} color={Colors.light.primaryButton} />
        <Text style={styles.metricLabel}>Steps Taken</Text>
        <Bar
          progress={progress.steps}
          width={screenWidth - 80}
          color={Colors.light.primaryButton}
        />
        <Text style={styles.metricValue}>
          {fitnessData.steps} / {fitnessData.stepGoal} steps
        </Text>
      </View>

      {/* Calorie Intake Progress */}
      <View style={styles.metricCard}>
        <Ionicons
          name="fast-food"
          size={24}
          color={Colors.light.primaryButton}
        />
        <Text style={styles.metricLabel}>Calorie Intake</Text>
        <Bar
          progress={progress.calories}
          width={screenWidth - 80}
          color={Colors.light.primaryButton}
        />
        <Text style={styles.metricValue}>
          {fitnessData.calorieIntake} / {fitnessData.calorieGoal} kcal
        </Text>
      </View>

      {/* Workout Time Progress */}
      <View style={styles.metricCard}>
        <Ionicons name="barbell" size={24} color={Colors.light.primaryButton} />
        <Text style={styles.metricLabel}>Workout Time</Text>
        <Bar
          progress={progress.workout}
          width={screenWidth - 80}
          color={Colors.light.primaryButton}
        />
        <Text style={styles.metricValue}>
          {fitnessData.workoutTime} / {fitnessData.workoutGoal} min
        </Text>
      </View>

      {/* Progress Chart */}
      <Text style={styles.chartTitle}>Weekly Progress</Text>
      <LineChart
        data={{
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [{ data: [4000, 6000, 7500, 8200, 9000, 10000, 10500] }],
        }}
        width={screenWidth - 40}
        height={220}
        chartConfig={{
          backgroundGradientFrom: Colors.light.background,
          backgroundGradientTo: Colors.light.background,
          color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
          strokeWidth: 2,
          decimalPlaces: 0,
        }}
        style={styles.chart}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 20,
    textAlign: "center",
  },
  metricCard: {
    backgroundColor: Colors.light.cardBackground,
    padding: 16,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: "center",
  },
  metricLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.light.text,
    marginVertical: 5,
  },
  metricValue: {
    fontSize: 14,
    color: Colors.light.text,
    marginTop: 5,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  chart: {
    alignSelf: "center",
    borderRadius: 10,
  },
});

export default Metrics;
