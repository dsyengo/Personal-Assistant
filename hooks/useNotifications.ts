import { useCallback } from "react";
import { Alert } from "react-native";

/**
 * Custom hook for handling notifications related to fitness goals.
 */
export const useNotifications = () => {
  /**
   * Sends a notification when a goal is achieved.
   * @param type - The type of goal (e.g., "Steps", "Calories", "Workout Time").
   * @param value - The achieved value of the goal.
   */
  const sendGoalAchievedNotification = useCallback(
    (type: string, value: number) => {
      Alert.alert(
        "Goal Achieved!",
        `Congratulations! You've reached your ${type} goal of ${value}. Keep going!`
      );
    },
    []
  );

  return { sendGoalAchievedNotification };
};
