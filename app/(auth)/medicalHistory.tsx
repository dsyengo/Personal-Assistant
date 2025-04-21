import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ListRenderItemInfo,
} from "react-native";
import { authStyles } from "../../styles/AuthStyles2";

type Surgery = {
  year: number;
  procedure: string;
};

type MedicalHistory = {
  allergies: string[];
  chronicConditions: string[];
  medications: string[];
  surgeries: Surgery[];
};

type MedicalHistorySectionProps = {
  medicalHistory: MedicalHistory;
  updateMedicalHistory: (
    field: keyof MedicalHistory,
    value: string[] | Surgery[]
  ) => void;
  errors?: Record<string, string>;
};

const MedicalHistorySection: React.FC<MedicalHistorySectionProps> = ({
  medicalHistory,
  updateMedicalHistory,
  errors,
}) => {
  const [newAllergy, setNewAllergy] = useState<string>("");
  const [newCondition, setNewCondition] = useState<string>("");
  const [newMedication, setNewMedication] = useState<string>("");
  const [newSurgery, setNewSurgery] = useState<{
    year: string;
    procedure: string;
  }>({
    year: "",
    procedure: "",
  });

  const addAllergy = () => {
    if (newAllergy.trim()) {
      const updatedAllergies = [...medicalHistory.allergies, newAllergy.trim()];
      updateMedicalHistory("allergies", updatedAllergies);
      setNewAllergy("");
    }
  };

  const removeAllergy = (index: number) => {
    const updatedAllergies = [...medicalHistory.allergies];
    updatedAllergies.splice(index, 1);
    updateMedicalHistory("allergies", updatedAllergies);
  };

  const addChronicCondition = () => {
    if (newCondition.trim()) {
      const updatedConditions = [
        ...medicalHistory.chronicConditions,
        newCondition.trim(),
      ];
      updateMedicalHistory("chronicConditions", updatedConditions);
      setNewCondition("");
    }
  };

  const removeChronicCondition = (index: number) => {
    const updatedConditions = [...medicalHistory.chronicConditions];
    updatedConditions.splice(index, 1);
    updateMedicalHistory("chronicConditions", updatedConditions);
  };

  const addMedication = () => {
    if (newMedication.trim()) {
      const updatedMedications = [
        ...medicalHistory.medications,
        newMedication.trim(),
      ];
      updateMedicalHistory("medications", updatedMedications);
      setNewMedication("");
    }
  };

  const removeMedication = (index: number) => {
    const updatedMedications = [...medicalHistory.medications];
    updatedMedications.splice(index, 1);
    updateMedicalHistory("medications", updatedMedications);
  };

  const addSurgery = () => {
    if (newSurgery.year && newSurgery.procedure.trim()) {
      const updatedSurgeries = [
        ...medicalHistory.surgeries,
        {
          year: parseInt(newSurgery.year),
          procedure: newSurgery.procedure.trim(),
        },
      ];
      updateMedicalHistory("surgeries", updatedSurgeries);
      setNewSurgery({ year: "", procedure: "" });
    }
  };

  const removeSurgery = (index: number) => {
    const updatedSurgeries = [...medicalHistory.surgeries];
    updatedSurgeries.splice(index, 1);
    updateMedicalHistory("surgeries", updatedSurgeries);
  };

  return (
    <View style={authStyles.sectionContainer}>
      <Text style={authStyles.sectionTitle}>Medical History</Text>

      {/* Allergies */}
      <View style={styles.subsection}>
        <Text style={authStyles.inputLabel}>Allergies</Text>
        <View style={styles.addItemContainer}>
          <TextInput
            style={styles.addItemInput}
            placeholder="Add an allergy"
            value={newAllergy}
            onChangeText={setNewAllergy}
          />
          <TouchableOpacity style={styles.addButton} onPress={addAllergy}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={medicalHistory.allergies}
          keyExtractor={(_, index) => `allergy-${index}`}
          renderItem={({ item, index }: ListRenderItemInfo<string>) => (
            <View style={styles.listItem}>
              <Text style={styles.listItemText}>{item}</Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeAllergy(index)}
              >
                <Text style={styles.removeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyListText}>No allergies added</Text>
          }
          style={styles.list}
        />
      </View>

      {/* Chronic Conditions */}
      <View style={styles.subsection}>
        <Text style={authStyles.inputLabel}>Chronic Conditions</Text>
        <View style={styles.addItemContainer}>
          <TextInput
            style={styles.addItemInput}
            placeholder="Add a chronic condition"
            value={newCondition}
            onChangeText={setNewCondition}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={addChronicCondition}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={medicalHistory.chronicConditions}
          keyExtractor={(_, index) => `condition-${index}`}
          renderItem={({ item, index }: ListRenderItemInfo<string>) => (
            <View style={styles.listItem}>
              <Text style={styles.listItemText}>{item}</Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeChronicCondition(index)}
              >
                <Text style={styles.removeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyListText}>
              No chronic conditions added
            </Text>
          }
          style={styles.list}
        />
      </View>

      {/* Surgeries */}
      <View style={styles.subsection}>
        <Text style={authStyles.inputLabel}>Past Surgeries</Text>
        <View style={styles.surgeryInputContainer}>
          <TextInput
            style={[styles.surgeryInput, styles.yearInput]}
            placeholder="Year"
            keyboardType="numeric"
            value={newSurgery.year}
            onChangeText={(text) =>
              setNewSurgery({ ...newSurgery, year: text })
            }
          />
          <TextInput
            style={[styles.surgeryInput, styles.procedureInput]}
            placeholder="Procedure"
            value={newSurgery.procedure}
            onChangeText={(text) =>
              setNewSurgery({ ...newSurgery, procedure: text })
            }
          />
          <TouchableOpacity style={styles.addButton} onPress={addSurgery}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={medicalHistory.surgeries}
          keyExtractor={(_, index) => `surgery-${index}`}
          renderItem={({ item, index }: ListRenderItemInfo<Surgery>) => (
            <View style={styles.listItem}>
              <Text style={styles.listItemText}>
                {item.year}: {item.procedure}
              </Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeSurgery(index)}
              >
                <Text style={styles.removeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyListText}>No surgeries added</Text>
          }
          style={styles.list}
        />
      </View>

      {/* Medications */}
      <View style={styles.subsection}>
        <Text style={authStyles.inputLabel}>Current Medications</Text>
        <View style={styles.addItemContainer}>
          <TextInput
            style={styles.addItemInput}
            placeholder="Add a medication"
            value={newMedication}
            onChangeText={setNewMedication}
          />
          <TouchableOpacity style={styles.addButton} onPress={addMedication}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={medicalHistory.medications}
          keyExtractor={(_, index) => `medication-${index}`}
          renderItem={({ item, index }: ListRenderItemInfo<string>) => (
            <View style={styles.listItem}>
              <Text style={styles.listItemText}>{item}</Text>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => removeMedication(index)}
              >
                <Text style={styles.removeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyListText}>No medications added</Text>
          }
          style={styles.list}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  subsection: {
    marginBottom: 16,
  },
  addItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  addItemInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: "#4A90E2",
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  list: {
    maxHeight: 150,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 8,
    borderRadius: 6,
    marginBottom: 6,
  },
  listItemText: {
    flex: 1,
  },
  removeButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#ff6b6b",
    justifyContent: "center",
    alignItems: "center",
  },
  removeButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  emptyListText: {
    color: "#888",
    fontStyle: "italic",
    textAlign: "center",
    padding: 10,
  },
  surgeryInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  surgeryInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginRight: 8,
  },
  yearInput: {
    width: 80,
  },
  procedureInput: {
    flex: 1,
  },
});

export default MedicalHistorySection;
