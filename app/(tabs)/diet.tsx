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
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

interface Nutrition {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

interface MealLog {
  id: number;
  mealType: string;
  mealDescription: string;
  nutrition: Nutrition;
  suggestions: string[];
  date: string;
}

const DietAnalysis: React.FC = () => {
  const [mealType, setMealType] = useState<string>("breakfast");
  const [mealDescription, setMealDescription] = useState<string>("");
  const [mealLogs, setMealLogs] = useState<MealLog[]>([]);

  const analyzeMeal = () => {
    if (!mealDescription) return;

    // Mock nutrition data (Replace with API call)
    const newMeal: MealLog = {
      id: mealLogs.length + 1,
      mealType,
      mealDescription,
      nutrition: {
        calories: Math.floor(Math.random() * 500) + 100,
        protein: Math.floor(Math.random() * 50) + 10,
        fat: Math.floor(Math.random() * 30) + 5,
        carbs: Math.floor(Math.random() * 100) + 20,
      },
      suggestions: [
        "Consider adding more vegetables",
        "Try reducing sugar intake",
        "Increase protein for better muscle recovery",
      ],
      date: new Date().toLocaleDateString(),
    };

    setMealLogs([...mealLogs, newMeal]);
    setMealDescription("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Text style={styles.title}>Diet Analysis</Text>

      {/* Input Section */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Select Meal Type</Text>
        <Picker
          selectedValue={mealType}
          onValueChange={(itemValue) => setMealType(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Breakfast" value="breakfast" />
          <Picker.Item label="Lunch" value="lunch" />
          <Picker.Item label="Dinner" value="dinner" />
          <Picker.Item label="Snacks" value="snacks" />
        </Picker>

        <Text style={styles.label}>Describe Your Meal</Text>
        <TextInput
          style={styles.input}
          placeholder="E.g. Rice, Chicken, Vegetables..."
          value={mealDescription}
          onChangeText={setMealDescription}
        />

        <TouchableOpacity style={styles.addButton} onPress={analyzeMeal}>
          <Ionicons
            name="checkmark-circle"
            size={40}
            color={Colors.light.primaryButton}
          />
        </TouchableOpacity>
      </View>

      {/* Output Section */}
      <FlatList
        data={mealLogs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.resultContainer}>
            <Text style={styles.mealType}>{item.mealType.toUpperCase()}</Text>
            <Text style={styles.mealDesc}>{item.mealDescription}</Text>
            <Text style={styles.nutritionText}>
              Calories: {item.nutrition.calories} kcal
            </Text>
            <Text style={styles.nutritionText}>
              Protein: {item.nutrition.protein}g
            </Text>
            <Text style={styles.nutritionText}>
              Carbs: {item.nutrition.carbs}g
            </Text>
            <Text style={styles.nutritionText}>Fat: {item.nutrition.fat}g</Text>

            <Text style={styles.suggestionTitle}>Suggestions:</Text>
            {item.suggestions.map((suggestion, index) => (
              <Text key={index} style={styles.suggestionText}>
                - {suggestion}
              </Text>
            ))}
          </View>
        )}
      />
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
  inputContainer: {
    backgroundColor: Colors.light.cardBackground,
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 5,
  },
  picker: {
    height: 50,
    backgroundColor: Colors.light.background,
    borderRadius: 8,
    marginBottom: 10,
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
  addButton: {
    alignItems: "center",
    marginTop: 10,
  },
  resultContainer: {
    backgroundColor: Colors.light.cardBackground,
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  mealType: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.primaryButton,
    marginBottom: 5,
  },
  mealDesc: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
    marginBottom: 5,
  },
  nutritionText: {
    fontSize: 14,
    color: Colors.light.text,
    marginBottom: 2,
  },
  suggestionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.light.text,
    marginTop: 5,
  },
  suggestionText: {
    fontSize: 14,
    color: Colors.light.text,
  },
});

export default DietAnalysis;
