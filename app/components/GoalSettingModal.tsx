import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

interface GoalSettingModalProps {
  visible: boolean;
  goalType: "steps" | "calories" | "workout";
  currentValue?: number;
  onClose: () => void;
  onSave: (goalType: string, value: number) => void;
}

const GoalSettingModal: React.FC<GoalSettingModalProps> = ({
  visible,
  goalType,
  currentValue,
  onClose,
  onSave,
}) => {
  const [goalValue, setGoalValue] = useState<string>("");

  useEffect(() => {
    if (visible && currentValue !== undefined) {
      setGoalValue(currentValue.toString());
    }
  }, [visible, currentValue]);

  const handleSave = () => {
    const value = parseInt(goalValue, 10);
    if (!isNaN(value) && value > 0) {
      onSave(goalType, value);
    } else {
      onClose(); // Close without saving if invalid input
    }
  };

  const getGoalTypeLabel = (): string => {
    switch (goalType) {
      case "steps":
        return "Steps";
      case "calories":
        return "Calorie Intake";
      case "workout":
        return "Workout Time (minutes)";
      default:
        return "Goal";
    }
  };

  const getGoalTypeIcon = (): keyof typeof Ionicons.glyphMap => {
    switch (goalType) {
      case "steps":
        return "walk";
      case "calories":
        return "fast-food";
      case "workout":
        return "barbell";
      default:
        return "fitness";
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Ionicons
              name={getGoalTypeIcon()}
              size={24}
              color={Colors.light.primaryButton}
            />
            <Text style={styles.modalTitle}>Set {getGoalTypeLabel()} Goal</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={Colors.light.text} />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Enter your daily goal:</Text>

          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={goalValue}
            onChangeText={setGoalValue}
            placeholder={`Enter ${getGoalTypeLabel().toLowerCase()} target`}
          />

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSave}
            >
              <Text style={[styles.buttonText, styles.saveButtonText]}>
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: Colors.light.text,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#f1f1f1",
  },
  saveButton: {
    backgroundColor: Colors.light.primaryButton,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.light.text,
  },
  saveButtonText: {
    color: "#fff",
  },
});

export default GoalSettingModal;
