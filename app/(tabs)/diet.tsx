import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

interface Meal {
  id: number;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

const DietAnalysis: React.FC = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [mealName, setMealName] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");

  const addMeal = () => {
    if (!mealName || !calories || !protein || !carbs || !fat) return;
    const newMeal: Meal = {
      id: meals.length + 1,
      name: mealName,
      calories: parseInt(calories),
      protein: parseInt(protein),
      carbs: parseInt(carbs),
      fat: parseInt(fat),
    };
    setMeals([...meals, newMeal]);
    setMealName("");
    setCalories("");
    setProtein("");
    setCarbs("");
    setFat("");
  };

  const totalNutrients = meals.reduce(
    (acc, meal) => {
      acc.calories += meal.calories;
      acc.protein += meal.protein;
      acc.carbs += meal.carbs;
      acc.fat += meal.fat;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView>
        <Text style={styles.title}>Diet Analysis</Text>

        {/* Summary Insights */}
        {meals.length > 0 && (
          <View style={styles.summaryContainer}>
            <Text style={styles.summaryTitle}>Daily Intake Summary</Text>
            <Text style={styles.summaryText}>
              Calories: {totalNutrients.calories} kcal
            </Text>
            <Text style={styles.summaryText}>
              Protein: {totalNutrients.protein}g
            </Text>
            <Text style={styles.summaryText}>
              Carbs: {totalNutrients.carbs}g
            </Text>
            <Text style={styles.summaryText}>Fat: {totalNutrients.fat}g</Text>
          </View>
        )}

        {/* Meal List */}
        <FlatList
          data={meals}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.mealItem}>
              <View style={styles.mealHeader}>
                <Text style={styles.mealName}>{item.name}</Text>
                <Ionicons
                  name="restaurant"
                  size={20}
                  color={Colors.light.primaryButton}
                />
              </View>
              <Text style={styles.mealDetails}>
                {item.calories} kcal | {item.protein}g Protein | {item.carbs}g
                Carbs | {item.fat}g Fat
              </Text>
            </View>
          )}
        />

        {/* Input Form */}
        <View style={styles.inputContainer}>
          <Text style={styles.sectionTitle}>Log Your Meal</Text>
          <TextInput
            style={styles.input}
            placeholder="Meal Name"
            value={mealName}
            onChangeText={setMealName}
          />
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.smallInput]}
              placeholder="Calories"
              value={calories}
              onChangeText={setCalories}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, styles.smallInput]}
              placeholder="Protein (g)"
              value={protein}
              onChangeText={setProtein}
              keyboardType="numeric"
            />
          </View>
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.smallInput]}
              placeholder="Carbs (g)"
              value={carbs}
              onChangeText={setCarbs}
              keyboardType="numeric"
            />
            <TextInput
              style={[styles.input, styles.smallInput]}
              placeholder="Fat (g)"
              value={fat}
              onChangeText={setFat}
              keyboardType="numeric"
            />
          </View>
          <TouchableOpacity style={styles.addButton} onPress={addMeal}>
            <Ionicons
              name="add-circle"
              size={40}
              color={Colors.light.primaryButton}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: Colors.light.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.text,
    textAlign: "center",
    marginBottom: 20,
  },
  summaryContainer: {
    backgroundColor: Colors.light.cardBackground,
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 5,
  },
  summaryText: {
    fontSize: 16,
    color: Colors.light.text,
  },
  mealItem: {
    backgroundColor: Colors.light.cardBackground,
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mealHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mealName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
  },
  mealDetails: {
    fontSize: 14,
    color: Colors.light.text,
    marginTop: 5,
  },
  inputContainer: {
    marginTop: 20,
    padding: 16,
    borderRadius: 10,
    backgroundColor: Colors.light.cardBackground,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 10,
    textAlign: "center",
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 8,
    fontSize: 14,
    backgroundColor: Colors.light.background,
  },
  smallInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  addButton: {
    alignItems: "center",
    marginTop: 10,
  },
});

export default DietAnalysis;
