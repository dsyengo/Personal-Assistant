import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { authStyles } from "../../styles/AuthStyles2";

interface MedicalHistory {
  allergies: string[];
  chronicConditions: string[];
  surgeries: string[];
  medications: string[];
}

interface Props {
  medicalHistory: MedicalHistory;
  updateMedicalHistory: (key: keyof MedicalHistory, value: string[]) => void;
  errors: any; // Using any for simplicity
}

const MedicalHistorySection: React.FC<Props> = ({
  medicalHistory,
  updateMedicalHistory,
  errors,
}) => {
  const [newAllergy, setNewAllergy] = useState("");
  const [newCondition, setNewCondition] = useState("");
  const [newSurgery, setNewSurgery] = useState("");
  const [newMedication, setNewMedication] = useState("");

  const addItem = (
    key: keyof MedicalHistory,
    item: string,
    clearFunction: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (!item.trim()) return;

    const newArray = [...medicalHistory[key], item.trim()];
    updateMedicalHistory(key, newArray);
    clearFunction("");
  };

  const removeItem = (key: keyof MedicalHistory, index: number) => {
    const newArray = [...medicalHistory[key]];
    newArray.splice(index, 1);
    updateMedicalHistory(key, newArray);
  };

  const renderChips = (items: string[], type: keyof MedicalHistory) => {
    return (
      <View style={authStyles.chipContainer}>
        {items.map((item, index) => (
          <View key={index} style={authStyles.chip}>
            <Text style={authStyles.chipText}>{item}</Text>
            <TouchableOpacity onPress={() => removeItem(type, index)}>
              <Text style={authStyles.chipRemove}>✕</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={authStyles.sectionContainer}>
      <Text style={authStyles.sectionTitle}>Medical History</Text>

      {/* Allergies */}
      <View style={authStyles.inputContainer}>
        <Text style={authStyles.inputLabel}>Allergies</Text>
        <View style={{ flexDirection: "row" }}>
          <TextInput
            style={[authStyles.input, { flex: 1, marginRight: 8 }]}
            placeholder="Add an allergy"
            value={newAllergy}
            onChangeText={setNewAllergy}
          />
          <TouchableOpacity
            style={[authStyles.button, { marginTop: 0, padding: 10 }]}
            onPress={() => addItem("allergies", newAllergy, setNewAllergy)}
          >
            <Text style={authStyles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>
        {renderChips(medicalHistory.allergies, "allergies")}
      </View>

      {/* Chronic Conditions */}
      <View style={authStyles.inputContainer}>
        <Text style={authStyles.inputLabel}>Chronic Conditions</Text>
        <View style={{ flexDirection: "row" }}>
          <TextInput
            style={[authStyles.input, { flex: 1, marginRight: 8 }]}
            placeholder="Add a condition"
            value={newCondition}
            onChangeText={setNewCondition}
          />
          <TouchableOpacity
            style={[authStyles.button, { marginTop: 0, padding: 10 }]}
            onPress={() =>
              addItem("chronicConditions", newCondition, setNewCondition)
            }
          >
            <Text style={authStyles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>
        {renderChips(medicalHistory.chronicConditions, "chronicConditions")}
      </View>

      {/* Surgeries */}
      <View style={authStyles.inputContainer}>
        <Text style={authStyles.inputLabel}>Surgeries</Text>
        <View style={{ flexDirection: "row" }}>
          <TextInput
            style={[authStyles.input, { flex: 1, marginRight: 8 }]}
            placeholder="Add a surgery"
            value={newSurgery}
            onChangeText={setNewSurgery}
          />
          <TouchableOpacity
            style={[authStyles.button, { marginTop: 0, padding: 10 }]}
            onPress={() => addItem("surgeries", newSurgery, setNewSurgery)}
          >
            <Text style={authStyles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>
        {renderChips(medicalHistory.surgeries, "surgeries")}
      </View>

      {/* Medications */}
      <View style={authStyles.inputContainer}>
        <Text style={authStyles.inputLabel}>Medications</Text>
        <View style={{ flexDirection: "row" }}>
          <TextInput
            style={[authStyles.input, { flex: 1, marginRight: 8 }]}
            placeholder="Add a medication"
            value={newMedication}
            onChangeText={setNewMedication}
          />
          <TouchableOpacity
            style={[authStyles.button, { marginTop: 0, padding: 10 }]}
            onPress={() =>
              addItem("medications", newMedication, setNewMedication)
            }
          >
            <Text style={authStyles.buttonText}>Add</Text>
          </TouchableOpacity>
        </View>
        {renderChips(medicalHistory.medications, "medications")}
      </View>
    </View>
  );
};

export default MedicalHistorySection;
