import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Bar } from "react-native-progress";
import { Colors } from "@/constants/Colors";

interface CalorieTrackerProps {
  calories: number;
  calorieGoal: number;
  progress: number;
  onUpdateCalories: (key: string, value: number) => void;
  onSetGoal: () => void;
}

const CalorieTracker: React.FC<CalorieTrackerProps> = ({
  calories,
  calorieGoal,
  progress,
  onUpdateCalories,
  onSetGoal,
}) => {
  const [calorieInput, setCalorieInput] = useState("");

  const handleAddCalories = () => {
    const value = parseInt(calorieInput);
    if (!isNaN(value) && value > 0) {
      onUpdateCalories("calorieIntake", value);
      setCalorieInput("");
    }
  };

  const estimatedCaloriesBurned = Math.round(calories * 0.05);

  return (
    <View style={styles.metricCard}>
      <View style={styles.headerRow}>
        <View style={styles.iconLabelContainer}>
          <Ionicons
            name="fast-food"
            size={24}
            color={Colors.light.primaryButton}
          />
          <Text style={styles.metricLabel}>Calorie Tracking</Text>
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

      <View style={styles.calorieStats}>
        <Text style={styles.metricValue}>
          {calories} / {calorieGoal} calories consumed
        </Text>
        <Text style={styles.burnedCalories}>
          Estimated calories burned: {estimatedCaloriesBurned}
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter calories consumed"
          keyboardType="numeric"
          value={calorieInput}
          onChangeText={setCalorieInput}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddCalories}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
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
  calorieStats: {
    alignItems: "center",
    marginVertical: 8,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
  },
  burnedCalories: {
    fontSize: 14,
    color: Colors.light.text,
    marginTop: 4,
    opacity: 0.8,
  },
  inputContainer: {
    flexDirection: "row",
    marginTop: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: Colors.light.primaryButton,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "500",
  },
});

export default CalorieTracker;
