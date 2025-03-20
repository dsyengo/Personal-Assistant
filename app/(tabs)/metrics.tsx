import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Dimensions } from "react-native";
import { Colors } from "@/constants/Colors";
import StepTracker from "../components/StepTracker";
import CalorieTracker from "../components/CalorieTracker";
import WorkoutTracker from "../components/WorkoutTracker";
import ProgressChart from "../components/ProgressChart";
import GoalSettingModal from "../components/GoalSettingModal";
import { useNotifications } from "../../hooks/useNotifications";
import { useFitnessData } from "../../hooks/useFitnessData";

const screenWidth = Dimensions.get("window").width;

type GoalType = "steps" | "calories" | "workout" | null;

const Metrics: React.FC = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [activeGoalSetting, setActiveGoalSetting] = useState<GoalType>(null);

  const { fitnessData, progress, updateGoal, updateProgress, weeklyData } =
    useFitnessData();

  const { sendGoalAchievedNotification } = useNotifications();

  useEffect(() => {
    if (progress.steps >= 1 && progress.steps < 1.01) {
      sendGoalAchievedNotification("Steps", fitnessData.steps);
    }
    if (progress.calories >= 1 && progress.calories < 1.01) {
      sendGoalAchievedNotification("Calories", fitnessData.calorieIntake);
    }
    if (progress.workout >= 1 && progress.workout < 1.01) {
      sendGoalAchievedNotification("Workout Time", fitnessData.workoutTime);
    }
  }, [progress, fitnessData, sendGoalAchievedNotification]);

  const openGoalSetting = (type: GoalType) => {
    setActiveGoalSetting(type);
    setModalVisible(true);
  };

  const handleGoalUpdate = (type: GoalType, value: number) => {
    if (type) {
      updateGoal(type, value);
    }
    setModalVisible(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Fitness Goal Tracking</Text>

      <StepTracker
        steps={fitnessData.steps}
        stepGoal={fitnessData.stepGoal}
        progress={progress.steps}
        onUpdateSteps={updateProgress}
        onSetGoal={() => openGoalSetting("steps")}
      />

      <CalorieTracker
        calories={fitnessData.calorieIntake}
        calorieGoal={fitnessData.calorieGoal}
        progress={progress.calories}
        onUpdateCalories={updateProgress}
        onSetGoal={() => openGoalSetting("calories")}
      />

      <WorkoutTracker
        workoutTime={fitnessData.workoutTime}
        workoutGoal={fitnessData.workoutGoal}
        progress={progress.workout}
        onUpdateWorkoutTime={updateProgress}
        onSetGoal={() => openGoalSetting("workout")}
      />

      <ProgressChart weeklyData={weeklyData} screenWidth={screenWidth} />

      <GoalSettingModal
        visible={modalVisible}
        goalType={activeGoalSetting}
        currentValue={
          activeGoalSetting ? fitnessData[`${activeGoalSetting}Goal`] : 0
        }
        onClose={() => setModalVisible(false)}
        onSave={handleGoalUpdate}
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
});

export default Metrics;
