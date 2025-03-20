import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Bar } from "react-native-progress";
import { Colors } from "@/constants/Colors";

interface StepTrackerProps {
  steps: number;
  stepGoal: number;
  progress: number;
  onUpdateSteps: (goalType: string, value: number) => void;
  onSetGoal: () => void;
}

const StepTracker: React.FC<StepTrackerProps> = ({
  steps,
  stepGoal,
  progress,
  onUpdateSteps,
  onSetGoal,
}) => {
  const [isTracking, setIsTracking] = useState<boolean>(false);

  const handleStartTracking = () => {
    setIsTracking(true);
    const interval = setInterval(() => {
      onUpdateSteps("steps", 100);
    }, 5000);
    return () => clearInterval(interval);
  };

  const handleStopTracking = () => {
    setIsTracking(false);
  };

  return (
    <View style={styles.metricCard}>
      <View style={styles.headerRow}>
        <View style={styles.iconLabelContainer}>
          <Ionicons name="walk" size={24} color={Colors.light.primaryButton} />
          <Text style={styles.metricLabel}>Steps Taken</Text>
        </View>
        <TouchableOpacity onPress={onSetGoal} style={styles.settingsButton}>
          <Ionicons
            name="settings-outline"
            size={20}
            color={Colors.light.text}
          />
        </TouchableOpacity>
      </View>

      <Bar
        progress={progress}
        width={null}
        height={10}
        color={Colors.light.primaryButton}
        unfilledColor="#e0e0e0"
        borderWidth={0}
        style={styles.progressBar}
      />

      <Text style={styles.metricValue}>
        {steps} / {stepGoal} steps
      </Text>

      <View style={styles.actionButtonsContainer}>
        {!isTracking ? (
          <TouchableOpacity
            style={[styles.actionButton, styles.startButton]}
            onPress={handleStartTracking}
          >
            <Ionicons name="play" size={16} color="#fff" />
            <Text style={styles.buttonText}>Start Tracking</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.actionButton, styles.stopButton]}
            onPress={handleStopTracking}
          >
            <Ionicons name="stop" size={16} color="#fff" />
            <Text style={styles.buttonText}>Stop Tracking</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  iconLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  metricLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.light.text,
    marginLeft: 8,
  },
  settingsButton: {
    padding: 5,
  },
  progressBar: {
    marginVertical: 8,
    width: "100%",
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    textAlign: "center",
    marginVertical: 8,
  },
  actionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 5,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    justifyContent: "center",
  },
  startButton: {
    backgroundColor: Colors.light.primaryButton,
  },
  stopButton: {
    backgroundColor: "#ff3b30",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "500",
    marginLeft: 5,
  },
});

export default StepTracker;
