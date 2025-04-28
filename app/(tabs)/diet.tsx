"use client";

import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../contexts/theme-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../(auth)/AuthContext";
import { Picker } from "@react-native-picker/picker";

type Meal = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snacks";
};

type NutritionGoal = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type MealAnalysis = {
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  suggestions: string[];
};

type DietLog = {
  _id: string;
  userId: string;
  mealDescription: string;
  mealType: "breakfast" | "lunch" | "dinner" | "snacks";
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
  suggestions: string[];
  createdAt: string;
};

const API_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const DietScreen = () => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const userId = user?.id;

  const [meals, setMeals] = useState<Meal[]>([]);
  const [dietLogs, setDietLogs] = useState<DietLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [nutritionGoal] = useState<NutritionGoal>({
    calories: 2000,
    protein: 120,
    carbs: 200,
    fat: 65,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [analysisModalVisible, setAnalysisModalVisible] = useState(false);
  const [newMeal, setNewMeal] = useState<Partial<Meal>>({
    name: "",
    calories: undefined,
    protein: undefined,
    carbs: undefined,
    fat: undefined,
    time: "",
    mealType: "breakfast",
  });

  const [mealToAnalyze, setMealToAnalyze] = useState({
    mealType: "breakfast" as "breakfast" | "lunch" | "dinner" | "snacks",
    mealDescription: "",
  });

  const [currentAnalysis, setCurrentAnalysis] = useState<MealAnalysis | null>(
    null
  );

  useEffect(() => {
    if (userId) {
      fetchDietLogs();
    }
  }, [userId]);

  const fetchDietLogs = async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/diet/logs/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch diet logs");
      }
      const data = await response.json();
      setDietLogs(data);

      // Convert diet logs to meals for display
      const convertedMeals = data.map((log: DietLog) => ({
        id: log._id,
        name: log.mealDescription,
        calories: log.nutrition.calories,
        protein: log.nutrition.protein,
        carbs: log.nutrition.carbs,
        fat: log.nutrition.fat,
        time: new Date(log.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        mealType: log.mealType,
      }));
      setMeals(convertedMeals);
    } catch (error) {
      console.error("Error fetching diet logs:", error);
      Alert.alert("Error", "Failed to fetch your diet logs");
    } finally {
      setIsLoading(false);
    }
  };

  const getTotalNutrition = () => {
    return meals.reduce(
      (total, meal) => ({
        calories: total.calories + meal.calories,
        protein: total.protein + meal.protein,
        carbs: total.carbs + meal.carbs,
        fat: total.fat + meal.fat,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  };

  const getRemainingNutrition = () => {
    const total = getTotalNutrition();
    return {
      calories: Math.max(0, nutritionGoal.calories - total.calories),
      protein: Math.max(0, nutritionGoal.protein - total.protein),
      carbs: Math.max(0, nutritionGoal.carbs - total.carbs),
      fat: Math.max(0, nutritionGoal.fat - total.fat),
    };
  };

  const handleAddMeal = () => {
    if (!newMeal.name || !newMeal.time || !newMeal.mealType) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const meal: Meal = {
      id: Date.now().toString(),
      name: newMeal.name || "",
      calories: Number(newMeal.calories) || 0,
      protein: Number(newMeal.protein) || 0,
      carbs: Number(newMeal.carbs) || 0,
      fat: Number(newMeal.fat) || 0,
      time: newMeal.time || "",
      mealType: newMeal.mealType || "breakfast",
    };

    setMeals([...meals, meal]);
    setModalVisible(false);
    setNewMeal({
      name: "",
      calories: undefined,
      protein: undefined,
      carbs: undefined,
      fat: undefined,
      time: "",
      mealType: "breakfast",
    });
  };

  const deleteMeal = (dietLog: DietLog) => {
    Alert.alert("Delete Meal", "Are you sure you want to delete this meal?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const logId = dietLog._id;
            console.log("Deleting log with ID:", logId);
            const response = await fetch(`${API_URL}/diet/delete/${logId}`, {
              method: "DELETE",
            });

            if (!response.ok) {
              throw new Error("Failed to delete diet log");
            }

            // Update local states
            setMeals((prevMeals) =>
              prevMeals.filter((meal) => meal.id !== dietLog._id)
            );
            setDietLogs((prevLogs) =>
              prevLogs.filter((log) => log._id !== dietLog._id)
            );
          } catch (error) {
            console.error("Error deleting meal:", error);
            Alert.alert("Error", "Failed to delete meal");
          }
        },
      },
    ]);
  };

  //log meal manually
  // const logMealManually = async () => {
  //   if (!manualMeal.name.trim() || !manualMeal.calories) {
  //     Alert.alert("Error", "Please enter all meal details");
  //     return;
  //   }

  //   if (!userId) {
  //     Alert.alert("Error", "User not authenticated");
  //     return;
  //   }

  //   setIsLogging(true);
  //   try {
  //     const response = await fetch(`${API_URL}/diet/log`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         userId,
  //         mealData: {
  //           name: manualMeal.name,
  //           calories: manualMeal.calories,
  //           protein: manualMeal.protein || 0,
  //           carbs: manualMeal.carbs || 0,
  //           fat: manualMeal.fat || 0,
  //           mealType: manualMeal.mealType || "Other",
  //         },
  //       }),
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to log meal");
  //     }

  //     const data = await response.json();

  //     const newMeal = {
  //       id: data._id,
  //       name: data.name,
  //       calories: data.calories,
  //       protein: data.protein,
  //       carbs: data.carbs,
  //       fat: data.fat,
  //       time: new Date(data.createdAt).toLocaleTimeString([], {
  //         hour: "2-digit",
  //         minute: "2-digit",
  //       }),
  //       mealType: data.mealType,
  //     };

  //     setMeals([...meals, newMeal]);
  //     setDietLogs([...dietLogs, data]);

  //     Alert.alert("Success", "Meal logged successfully!");
  //   } catch (error) {
  //     console.error("Error logging meal:", error);
  //     Alert.alert("Error", "Failed to log meal");
  //   } finally {
  //     setIsLogging(false);
  //   }
  // };

  const analyzeMeal = async () => {
    if (!mealToAnalyze.mealDescription.trim()) {
      Alert.alert("Error", "Please enter a meal description");
      return;
    }

    if (!userId) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    setIsAnalyzing(true);
    try {
      const response = await fetch(`${API_URL}/diet/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          mealData: {
            mealType: mealToAnalyze.mealType,
            mealDescription: mealToAnalyze.mealDescription,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze meal");
      }

      const data = await response.json();
      setCurrentAnalysis({
        nutrition: data.nutrition,
        suggestions: data.suggestions,
      });

      console.log(data);

      // Add the analyzed meal to the meals list
      const newMeal: Meal = {
        id: data._id,
        name: data.mealDescription,
        calories: data.nutrition.calories,
        protein: data.nutrition.protein,
        carbs: data.nutrition.carbs,
        fat: data.nutrition.fat,
        time: new Date(data.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        mealType: data.mealType,
      };

      setMeals([...meals, newMeal]);
      setDietLogs([...dietLogs, data]);

      // Show analysis results
      setAnalysisModalVisible(true);
    } catch (error) {
      console.error("Error analyzing meal:", error);
      Alert.alert("Error", "Failed to analyze meal");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getMealTypeIcon = (mealType: string) => {
    switch (mealType) {
      case "breakfast":
        return "sunny-outline";
      case "lunch":
        return "restaurant-outline";
      case "dinner":
        return "moon-outline";
      case "snacks":
        return "cafe-outline";
      default:
        return "nutrition-outline";
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      padding: 16,
    },
    summaryCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
    },
    summaryTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 12,
    },
    nutritionRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 8,
    },
    nutritionLabel: {
      fontSize: 16,
      color: colors.text,
    },
    nutritionValue: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
    },
    progressContainer: {
      marginTop: 8,
    },
    progressLabel: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 4,
    },
    progressBarContainer: {
      height: 8,
      backgroundColor: colors.border,
      borderRadius: 4,
      overflow: "hidden",
      marginBottom: 12,
    },
    progressBar: {
      height: "100%",
      borderRadius: 4,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
      marginTop: 8,
      marginBottom: 12,
    },
    mealCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    },
    mealHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },
    mealTypeContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    mealTypeIcon: {
      marginRight: 8,
    },
    mealType: {
      fontSize: 14,
      color: colors.primary,
      fontWeight: "bold",
    },
    mealName: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
      flex: 1,
    },
    mealTime: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.7,
    },
    mealNutrition: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 8,
    },
    mealNutritionItem: {
      alignItems: "center",
    },
    mealNutritionValue: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
    },
    mealNutritionLabel: {
      fontSize: 12,
      color: colors.text,
      opacity: 0.7,
    },
    addButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
      marginTop: 8,
      marginBottom: 8,
    },
    addButtonText: {
      color: "white",
      fontWeight: "bold",
      fontSize: 16,
    },
    analyzeCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 20,
      marginTop: 20,
    },
    analyzeTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 12,
    },
    pickerContainer: {
      backgroundColor: colors.card,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 12,
      overflow: "hidden",
    },
    picker: {
      color: colors.text,
      height: 50,
    },
    analyzeButton: {
      backgroundColor: colors.secondary,
      borderRadius: 12,
      padding: 16,
      alignItems: "center",
      marginTop: 12,
    },
    analyzeButtonText: {
      color: "white",
      fontWeight: "bold",
      fontSize: 16,
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
      maxHeight: "80%",
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 16,
      textAlign: "center",
    },
    input: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    textArea: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 12,
      marginBottom: 12,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      height: 100,
      textAlignVertical: "top",
    },
    modalButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 16,
    },
    cancelButton: {
      backgroundColor: colors.border,
      borderRadius: 8,
      padding: 12,
      alignItems: "center",
      width: "48%",
    },
    cancelButtonText: {
      color: colors.text,
      fontWeight: "bold",
    },
    saveButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      padding: 12,
      alignItems: "center",
      width: "48%",
    },
    saveButtonText: {
      color: "white",
      fontWeight: "bold",
    },
    deleteButton: {
      padding: 8,
    },
    analysisResultsContainer: {
      marginTop: 16,
    },
    analysisSection: {
      marginBottom: 16,
    },
    analysisSectionTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 8,
    },
    nutritionGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    nutritionItem: {
      width: "48%",
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
    },
    nutritionItemLabel: {
      fontSize: 14,
      color: colors.text,
      opacity: 0.7,
    },
    nutritionItemValue: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
    },
    suggestionItem: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 12,
      marginBottom: 8,
      flexDirection: "row",
      alignItems: "center",
    },
    suggestionText: {
      fontSize: 14,
      color: colors.text,
      marginLeft: 8,
      flex: 1,
    },
    closeButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      padding: 12,
      alignItems: "center",
      marginTop: 16,
    },
    closeButtonText: {
      color: "white",
      fontWeight: "bold",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
  });

  const total = getTotalNutrition();
  const remaining = getRemainingNutrition();

  if (isLoading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ color: colors.text, marginTop: 16 }}>
          Loading your diet data...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Nutrition Summary</Text>

          <View style={styles.nutritionRow}>
            <Text style={styles.nutritionLabel}>Calories</Text>
            <Text style={styles.nutritionValue}>
              {total.calories} / {nutritionGoal.calories} kcal
            </Text>
          </View>

          <View style={styles.progressContainer}>
            <View style={styles.progressLabel}>
              <Text style={styles.nutritionLabel}>Protein</Text>
              <Text style={styles.nutritionValue}>
                {total.protein}g / {nutritionGoal.protein}g
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${Math.min(
                      100,
                      (total.protein / nutritionGoal.protein) * 100
                    )}%`,
                    backgroundColor: colors.primary,
                  },
                ]}
              />
            </View>

            <View style={styles.progressLabel}>
              <Text style={styles.nutritionLabel}>Carbs</Text>
              <Text style={styles.nutritionValue}>
                {total.carbs}g / {nutritionGoal.carbs}g
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${Math.min(
                      100,
                      (total.carbs / nutritionGoal.carbs) * 100
                    )}%`,
                    backgroundColor: colors.secondary,
                  },
                ]}
              />
            </View>

            <View style={styles.progressLabel}>
              <Text style={styles.nutritionLabel}>Fat</Text>
              <Text style={styles.nutritionValue}>
                {total.fat}g / {nutritionGoal.fat}g
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${Math.min(
                      100,
                      (total.fat / nutritionGoal.fat) * 100
                    )}%`,
                    backgroundColor: colors.accent,
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.nutritionRow}>
            <Text style={styles.nutritionLabel}>Remaining</Text>
            <Text style={styles.nutritionValue}>{remaining.calories} kcal</Text>
          </View>
        </View>

        <View style={styles.analyzeCard}>
          <Text style={styles.analyzeTitle}>Analyze Your Meal</Text>

          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={mealToAnalyze.mealType}
              style={styles.picker}
              onValueChange={(itemValue) =>
                setMealToAnalyze({
                  ...mealToAnalyze,
                  mealType: itemValue as
                    | "breakfast"
                    | "lunch"
                    | "dinner"
                    | "snacks",
                })
              }
            >
              <Picker.Item label="Breakfast" value="breakfast" />
              <Picker.Item label="Lunch" value="lunch" />
              <Picker.Item label="Dinner" value="dinner" />
              <Picker.Item label="Snacks" value="snacks" />
            </Picker>
          </View>

          <TextInput
            style={styles.textArea}
            placeholder="Describe your meal in detail (e.g., 2 eggs, 1 slice of whole wheat toast, 1 avocado)"
            placeholderTextColor={colors.text + "80"}
            value={mealToAnalyze.mealDescription}
            onChangeText={(text) =>
              setMealToAnalyze({ ...mealToAnalyze, mealDescription: text })
            }
            multiline
            numberOfLines={4}
          />

          <TouchableOpacity
            style={styles.analyzeButton}
            onPress={analyzeMeal}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.analyzeButtonText}>Analyze Meal</Text>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Today's Meals</Text>

        {meals.length === 0 ? (
          <View style={styles.mealCard}>
            <Text style={{ color: colors.text, textAlign: "center" }}>
              No meals logged today. Add a meal to get started!
            </Text>
          </View>
        ) : (
          meals.map((meal) => (
            <View key={meal.id} style={styles.mealCard}>
              <View style={styles.mealTypeContainer}>
                <Ionicons
                  name={getMealTypeIcon(meal.mealType)}
                  size={18}
                  color={colors.primary}
                  style={styles.mealTypeIcon}
                />
                <Text style={styles.mealType}>
                  {meal.mealType
                    ? meal.mealType.charAt(0).toUpperCase() +
                      meal.mealType.slice(1)
                    : "Unknown"}
                </Text>
              </View>

              <View style={styles.mealHeader}>
                <Text style={styles.mealName}>{meal.name}</Text>
                <Text style={styles.mealTime}>{meal.time}</Text>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => deleteMeal(meal.id)}
                >
                  <Ionicons
                    name="trash-outline"
                    size={20}
                    color={colors.error}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.mealNutrition}>
                <View style={styles.mealNutritionItem}>
                  <Text style={styles.mealNutritionValue}>{meal.calories}</Text>
                  <Text style={styles.mealNutritionLabel}>kcal</Text>
                </View>
                <View style={styles.mealNutritionItem}>
                  <Text style={styles.mealNutritionValue}>{meal.protein}g</Text>
                  <Text style={styles.mealNutritionLabel}>Protein</Text>
                </View>
                <View style={styles.mealNutritionItem}>
                  <Text style={styles.mealNutritionValue}>{meal.carbs}g</Text>
                  <Text style={styles.mealNutritionLabel}>Carbs</Text>
                </View>
                <View style={styles.mealNutritionItem}>
                  <Text style={styles.mealNutritionValue}>{meal.fat}g</Text>
                  <Text style={styles.mealNutritionLabel}>Fat</Text>
                </View>
              </View>
            </View>
          ))
        )}

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>Add Meal Manually</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Add Meal Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add New Meal</Text>

              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={newMeal.mealType}
                  style={styles.picker}
                  onValueChange={(itemValue) =>
                    setNewMeal({
                      ...newMeal,
                      mealType: itemValue as
                        | "breakfast"
                        | "lunch"
                        | "dinner"
                        | "snacks",
                    })
                  }
                >
                  <Picker.Item label="Breakfast" value="breakfast" />
                  <Picker.Item label="Lunch" value="lunch" />
                  <Picker.Item label="Dinner" value="dinner" />
                  <Picker.Item label="Snacks" value="snacks" />
                </Picker>
              </View>

              <TextInput
                style={styles.input}
                placeholder="Meal name"
                placeholderTextColor={colors.text + "80"}
                value={newMeal.name}
                onChangeText={(text) => setNewMeal({ ...newMeal, name: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="Time (e.g., 08:00 AM)"
                placeholderTextColor={colors.text + "80"}
                value={newMeal.time}
                onChangeText={(text) => setNewMeal({ ...newMeal, time: text })}
              />

              <TextInput
                style={styles.input}
                placeholder="Calories"
                placeholderTextColor={colors.text + "80"}
                value={newMeal.calories?.toString()}
                onChangeText={(text) =>
                  setNewMeal({
                    ...newMeal,
                    calories: Number.parseInt(text) || undefined,
                  })
                }
                keyboardType="numeric"
              />

              <TextInput
                style={styles.input}
                placeholder="Protein (g)"
                placeholderTextColor={colors.text + "80"}
                value={newMeal.protein?.toString()}
                onChangeText={(text) =>
                  setNewMeal({
                    ...newMeal,
                    protein: Number.parseInt(text) || undefined,
                  })
                }
                keyboardType="numeric"
              />

              <TextInput
                style={styles.input}
                placeholder="Carbs (g)"
                placeholderTextColor={colors.text + "80"}
                value={newMeal.carbs?.toString()}
                onChangeText={(text) =>
                  setNewMeal({
                    ...newMeal,
                    carbs: Number.parseInt(text) || undefined,
                  })
                }
                keyboardType="numeric"
              />

              <TextInput
                style={styles.input}
                placeholder="Fat (g)"
                placeholderTextColor={colors.text + "80"}
                value={newMeal.fat?.toString()}
                onChangeText={(text) =>
                  setNewMeal({
                    ...newMeal,
                    fat: Number.parseInt(text) || undefined,
                  })
                }
                keyboardType="numeric"
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleAddMeal}
                >
                  <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </Modal>

      {/* Analysis Results Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={analysisModalVisible}
        onRequestClose={() => setAnalysisModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Meal Analysis Results</Text>

              {currentAnalysis && (
                <View style={styles.analysisResultsContainer}>
                  <View style={styles.analysisSection}>
                    <Text style={styles.analysisSectionTitle}>
                      Nutritional Information
                    </Text>
                    <View style={styles.nutritionGrid}>
                      <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionItemLabel}>Calories</Text>
                        <Text style={styles.nutritionItemValue}>
                          {currentAnalysis.nutrition.calories} kcal
                        </Text>
                      </View>
                      <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionItemLabel}>Protein</Text>
                        <Text style={styles.nutritionItemValue}>
                          {currentAnalysis.nutrition.protein}g
                        </Text>
                      </View>
                      <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionItemLabel}>Carbs</Text>
                        <Text style={styles.nutritionItemValue}>
                          {currentAnalysis.nutrition.carbs}g
                        </Text>
                      </View>
                      <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionItemLabel}>Fat</Text>
                        <Text style={styles.nutritionItemValue}>
                          {currentAnalysis.nutrition.fat}g
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.analysisSection}>
                    <Text style={styles.analysisSectionTitle}>Suggestions</Text>
                    {currentAnalysis.suggestions.map((suggestion, index) => (
                      <View key={index} style={styles.suggestionItem}>
                        <Ionicons
                          name="bulb-outline"
                          size={18}
                          color={colors.secondary}
                        />
                        <Text style={styles.suggestionText}>{suggestion}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setAnalysisModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DietScreen;
