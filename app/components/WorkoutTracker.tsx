import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Bar } from "react-native-progress";
import { Colors } from "@/constants/Colors";

interface WorkoutTrackerProps {
  workoutTime: number;
  workoutGoal: number;
  progress: number;
  onUpdateWorkoutTime: (type: string, minutes: number) => void;
  onSetGoal: () => void;
}

const WorkoutTracker: React.FC<WorkoutTrackerProps> = ({
  workoutTime,
  workoutGoal,
  progress,
  onUpdateWorkoutTime,
  onSetGoal,
}) => {
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startTimer = () => {
    setIsTracking(true);
    const startTime = Date.now() - elapsedSeconds * 1000;

    timerRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setElapsedSeconds(elapsed);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsTracking(false);

    const minutes = Math.floor(elapsedSeconds / 60);
    if (minutes > 0) {
      onUpdateWorkoutTime("workoutTime", minutes);
    }

    setElapsedSeconds(0);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <View style={styles.metricCard}>
      <View style={styles.headerRow}>
        <View style={styles.iconLabelContainer}>
          <Ionicons
            name="barbell"
            size={24}
            color={Colors.light.primaryButton}
          />
          <Text style={styles.metricLabel}>Workout Time</Text>
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
        {workoutTime} / {workoutGoal} minutes
      </Text>

      {isTracking && (
        <Text style={styles.currentTimer}>
          Current session: {formatTime(elapsedSeconds)}
        </Text>
      )}

      <View style={styles.actionButtonsContainer}>
        {!isTracking ? (
          <TouchableOpacity
            style={[styles.actionButton, styles.startButton]}
            onPress={startTimer}
          >
            <Ionicons name="play" size={16} color="#fff" />
            <Text style={styles.buttonText}>Start Workout</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.actionButton, styles.stopButton]}
            onPress={stopTimer}
          >
            <Ionicons name="stop" size={16} color="#fff" />
            <Text style={styles.buttonText}>End Workout</Text>
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
  currentTimer: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.light.primaryButton,
    textAlign: "center",
    marginBottom: 8,
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

export default WorkoutTracker;
