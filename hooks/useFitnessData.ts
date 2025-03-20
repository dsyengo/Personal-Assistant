import { useState, useEffect, useCallback } from "react";

interface FitnessData {
  steps: number;
  stepGoal: number;
  calorieIntake: number;
  calorieGoal: number;
  workoutTime: number;
  workoutGoal: number;
}

interface Progress {
  steps: number;
  calories: number;
  workout: number;
}

interface WeeklyData {
  day: string;
  steps: number;
  calories: number;
  workoutTime: number;
}

/**
 * Custom hook for managing fitness data and progress tracking.
 */
export const useFitnessData = () => {
  const [fitnessData, setFitnessData] = useState<FitnessData>({
    steps: 0,
    stepGoal: 10000,
    calorieIntake: 0,
    calorieGoal: 2000,
    workoutTime: 0,
    workoutGoal: 60,
  });

  const [progress, setProgress] = useState<Progress>({
    steps: 0,
    calories: 0,
    workout: 0,
  });

  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);

  useEffect(() => {
    setProgress({
      steps: fitnessData.steps / fitnessData.stepGoal,
      calories: fitnessData.calorieIntake / fitnessData.calorieGoal,
      workout: fitnessData.workoutTime / fitnessData.workoutGoal,
    });
  }, [fitnessData]);

  /**
   * Updates the fitness goals for steps, calories, or workout time.
   * @param type - The type of goal to update ("steps", "calories", or "workout").
   * @param value - The new goal value.
   */
  const updateGoal = useCallback((type: keyof FitnessData, value: number) => {
    setFitnessData((prev) => ({ ...prev, [`${type}Goal`]: value }));
  }, []);

  /**
   * Updates progress for steps, calories, or workout time.
   * @param type - The type of fitness data to update ("steps", "calories", "workoutTime").
   * @param value - The new value.
   */
  const updateProgress = useCallback(
    (type: keyof FitnessData, value: number) => {
      setFitnessData((prev) => ({ ...prev, [type]: value }));
    },
    []
  );

  return { fitnessData, progress, updateGoal, updateProgress, weeklyData };
};
