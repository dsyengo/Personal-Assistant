"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
  Keyboard,
  Animated,
  Switch,
  TouchableWithoutFeedback,
} from "react-native";
import { useAuth } from "./AuthContext";
import { useTheme } from "../contexts/theme-context";
import type { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

// TypeScript interfaces
interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
}

interface PhysicalInfo {
  age: string;
  gender: string;
  height: string;
  weight: string;
}

interface LifestyleHabits {
  exercise: string;
  smoking: boolean;
  alcohol: string;
  diet: string;
}

interface MedicalItem {
  id: string;
  value: string;
}

interface MedicalHistory {
  allergies: MedicalItem[];
  chronicConditions: MedicalItem[];
  surgeries: MedicalItem[];
  medications: MedicalItem[];
}

interface Security {
  password: string;
  confirmPassword: string;
}

interface FormData {
  personalInfo: PersonalInfo;
  physicalInfo: PhysicalInfo;
  lifestyleHabits: LifestyleHabits;
  medicalHistory: MedicalHistory;
  security: Security;
}

interface FormErrors {
  personalInfo: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };
  physicalInfo: {
    age?: string;
    gender?: string;
    height?: string;
    weight?: string;
  };
  lifestyleHabits: {
    general?: string;
  };
  medicalHistory: {
    general?: string;
  };
  security: {
    password?: string;
    confirmPassword?: string;
  };
}

type RegisterScreenProps = {
  navigation: StackNavigationProp<any>;
};

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const { register } = useAuth();
  const { colors } = useTheme();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [newMedicalItem, setNewMedicalItem] = useState("");
  const [currentMedicalCategory, setCurrentMedicalCategory] =
    useState<keyof MedicalHistory>("allergies");
  const progressAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  // Form data state
  const [formData, setFormData] = useState<FormData>({
    personalInfo: {
      firstName: "",
      lastName: "",
      email: "",
    },
    physicalInfo: {
      age: "",
      gender: "male",
      height: "",
      weight: "",
    },
    lifestyleHabits: {
      exercise: "moderate",
      smoking: false,
      alcohol: "occasional",
      diet: "balanced",
    },
    medicalHistory: {
      allergies: [],
      chronicConditions: [],
      surgeries: [],
      medications: [],
    },
    security: {
      password: "",
      confirmPassword: "",
    },
  });

  // Form errors state
  const [errors, setErrors] = useState<FormErrors>({
    personalInfo: {},
    physicalInfo: {},
    lifestyleHabits: {},
    medicalHistory: {},
    security: {},
  });

  // Update progress bar animation when step changes
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (currentStep / 5) * 100,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentStep, progressAnim]);

  // Validation functions
  const validatePersonalInfo = (): boolean => {
    const { firstName, lastName, email } = formData.personalInfo;
    const newErrors = { ...errors };
    newErrors.personalInfo = {};
    let isValid = true;

    if (!firstName.trim()) {
      newErrors.personalInfo.firstName = "First name is required";
      isValid = false;
    }

    if (!lastName.trim()) {
      newErrors.personalInfo.lastName = "Last name is required";
      isValid = false;
    }

    if (!email.trim()) {
      newErrors.personalInfo.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.personalInfo.email = "Email is invalid";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validatePhysicalInfo = (): boolean => {
    const { age, height, weight } = formData.physicalInfo;
    const newErrors = { ...errors };
    newErrors.physicalInfo = {};
    let isValid = true;

    if (!age.trim()) {
      newErrors.physicalInfo.age = "Age is required";
      isValid = false;
    } else if (isNaN(Number(age)) || Number(age) <= 0 || Number(age) > 120) {
      newErrors.physicalInfo.age =
        "Age must be a valid number between 1 and 120";
      isValid = false;
    }

    if (!height.trim()) {
      newErrors.physicalInfo.height = "Height is required";
      isValid = false;
    } else if (isNaN(Number(height)) || Number(height) <= 0) {
      newErrors.physicalInfo.height = "Height must be a valid number";
      isValid = false;
    }

    if (!weight.trim()) {
      newErrors.physicalInfo.weight = "Weight is required";
      isValid = false;
    } else if (isNaN(Number(weight)) || Number(weight) <= 0) {
      newErrors.physicalInfo.weight = "Weight must be a valid number";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateLifestyleHabits = (): boolean => {
    const { exercise, diet } = formData.lifestyleHabits;
    const newErrors = { ...errors };
    newErrors.lifestyleHabits = {};
    let isValid = true;

    if (!exercise && !diet) {
      newErrors.lifestyleHabits.general =
        "At least one lifestyle habit must be provided";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const validateMedicalHistory = (): boolean => {
    // No specific validation for medical history as it's optional
    return true;
  };

  const validateSecurity = (): boolean => {
    const { password, confirmPassword } = formData.security;
    const newErrors = { ...errors };
    newErrors.security = {};
    let isValid = true;

    if (!password) {
      newErrors.security.password = "Password is required";
      isValid = false;
    } else if (password.length < 6) {
      newErrors.security.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (!confirmPassword) {
      newErrors.security.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.security.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle next step
  const handleNext = () => {
    let isValid = false;

    switch (currentStep) {
      case 0:
        isValid = validatePersonalInfo();
        break;
      case 1:
        isValid = validatePhysicalInfo();
        break;
      case 2:
        isValid = validateLifestyleHabits();
        break;
      case 3:
        isValid = validateMedicalHistory();
        break;
      case 4:
        isValid = validateSecurity();
        break;
      default:
        isValid = true;
    }

    if (isValid) {
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        Keyboard.dismiss();
      }
    }
  };

  // Handle previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      Keyboard.dismiss();
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (validateSecurity()) {
      setIsSubmitting(true);
      try {
        // Prepare user data for registration
        const { firstName, lastName, email } = formData.personalInfo;
        const { password } = formData.security;

        // Call the signUp function from auth context
        await register(email, password, `${firstName} ${lastName}`);

        // After successful registration, you might want to update the health profile
        // This would be handled in the onboarding screen, but we can prepare the data here

        Alert.alert(
          "Registration Successful",
          "Your account has been created successfully. Please complete your health profile.",
          [{ text: "OK" }]
        );
      } catch (error) {
        console.error("Registration failed", error);
        Alert.alert(
          "Registration Failed",
          "Could not create account. Please try again."
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Handle adding a new medical item
  const handleAddMedicalItem = () => {
    if (!newMedicalItem.trim()) {
      return;
    }

    const updatedMedicalHistory = { ...formData.medicalHistory };
    updatedMedicalHistory[currentMedicalCategory] = [
      ...updatedMedicalHistory[currentMedicalCategory],
      { id: Date.now().toString(), value: newMedicalItem.trim() },
    ];

    setFormData({
      ...formData,
      medicalHistory: updatedMedicalHistory,
    });
    setNewMedicalItem("");
  };

  // Handle removing a medical item
  const handleRemoveMedicalItem = (
    category: keyof MedicalHistory,
    id: string
  ) => {
    const updatedMedicalHistory = { ...formData.medicalHistory };
    updatedMedicalHistory[category] = updatedMedicalHistory[category].filter(
      (item) => item.id !== id
    );

    setFormData({
      ...formData,
      medicalHistory: updatedMedicalHistory,
    });
  };

  // Update form data
  const updateFormData = (
    section: keyof FormData,
    field: string,
    value: any
  ) => {
    setFormData({
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value,
      },
    });
  };

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return renderPersonalInfo();
      case 1:
        return renderPhysicalInfo();
      case 2:
        return renderLifestyleHabits();
      case 3:
        return renderMedicalHistory();
      case 4:
        return renderSecurity();
      case 5:
        return renderSummary();
      default:
        return null;
    }
  };

  // Render personal information step
  const renderPersonalInfo = () => {
    const { firstName, lastName, email } = formData.personalInfo;
    const {
      firstName: firstNameError,
      lastName: lastNameError,
      email: emailError,
    } = errors.personalInfo;

    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Personal Information</Text>
        <Text style={styles.stepDescription}>
          Please provide your basic personal information.
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>First Name</Text>
          <TextInput
            style={[styles.input, firstNameError && styles.inputError]}
            placeholder="Enter your first name"
            placeholderTextColor={colors.text + "80"}
            value={firstName}
            onChangeText={(text) =>
              updateFormData("personalInfo", "firstName", text)
            }
          />
          {firstNameError && (
            <Text style={styles.errorText}>{firstNameError}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Last Name</Text>
          <TextInput
            style={[styles.input, lastNameError && styles.inputError]}
            placeholder="Enter your last name"
            placeholderTextColor={colors.text + "80"}
            value={lastName}
            onChangeText={(text) =>
              updateFormData("personalInfo", "lastName", text)
            }
          />
          {lastNameError && (
            <Text style={styles.errorText}>{lastNameError}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Email</Text>
          <TextInput
            style={[styles.input, emailError && styles.inputError]}
            placeholder="Enter your email address"
            placeholderTextColor={colors.text + "80"}
            value={email}
            onChangeText={(text) =>
              updateFormData("personalInfo", "email", text)
            }
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {emailError && <Text style={styles.errorText}>{emailError}</Text>}
        </View>
      </View>
    );
  };

  // Render physical information step
  const renderPhysicalInfo = () => {
    const { age, gender, height, weight } = formData.physicalInfo;
    const {
      age: ageError,
      height: heightError,
      weight: weightError,
    } = errors.physicalInfo;

    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Physical Information</Text>
        <Text style={styles.stepDescription}>
          Please provide your physical details.
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Age</Text>
          <TextInput
            style={[styles.input, ageError && styles.inputError]}
            placeholder="Enter your age"
            placeholderTextColor={colors.text + "80"}
            value={age}
            onChangeText={(text) => updateFormData("physicalInfo", "age", text)}
            keyboardType="numeric"
          />
          {ageError && <Text style={styles.errorText}>{ageError}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Gender</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={[
                styles.radioButton,
                gender === "male" && styles.radioButtonSelected,
              ]}
              onPress={() => updateFormData("physicalInfo", "gender", "male")}
            >
              <View
                style={[
                  styles.radioCircle,
                  gender === "male" && styles.radioCircleSelected,
                ]}
              />
              <Text style={styles.radioText}>Male</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioButton,
                gender === "female" && styles.radioButtonSelected,
              ]}
              onPress={() => updateFormData("physicalInfo", "gender", "female")}
            >
              <View
                style={[
                  styles.radioCircle,
                  gender === "female" && styles.radioCircleSelected,
                ]}
              />
              <Text style={styles.radioText}>Female</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.radioButton,
                gender === "other" && styles.radioButtonSelected,
              ]}
              onPress={() => updateFormData("physicalInfo", "gender", "other")}
            >
              <View
                style={[
                  styles.radioCircle,
                  gender === "other" && styles.radioCircleSelected,
                ]}
              />
              <Text style={styles.radioText}>Other</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Height (cm)</Text>
          <TextInput
            style={[styles.input, heightError && styles.inputError]}
            placeholder="Enter your height in cm"
            placeholderTextColor={colors.text + "80"}
            value={height}
            onChangeText={(text) =>
              updateFormData("physicalInfo", "height", text)
            }
            keyboardType="numeric"
          />
          {heightError && <Text style={styles.errorText}>{heightError}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Weight (kg)</Text>
          <TextInput
            style={[styles.input, weightError && styles.inputError]}
            placeholder="Enter your weight in kg"
            placeholderTextColor={colors.text + "80"}
            value={weight}
            onChangeText={(text) =>
              updateFormData("physicalInfo", "weight", text)
            }
            keyboardType="numeric"
          />
          {weightError && <Text style={styles.errorText}>{weightError}</Text>}
        </View>
      </View>
    );
  };

  // Render lifestyle habits step
  const renderLifestyleHabits = () => {
    const { exercise, smoking, alcohol, diet } = formData.lifestyleHabits;
    const { general: generalError } = errors.lifestyleHabits;

    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Lifestyle Habits</Text>
        <Text style={styles.stepDescription}>
          Please provide information about your lifestyle habits.
        </Text>

        {generalError && <Text style={styles.errorText}>{generalError}</Text>}

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Exercise Frequency</Text>
          <View style={styles.selectContainer}>
            <TouchableOpacity
              style={[
                styles.selectOption,
                exercise === "sedentary" && styles.selectOptionSelected,
              ]}
              onPress={() =>
                updateFormData("lifestyleHabits", "exercise", "sedentary")
              }
            >
              <Text
                style={[
                  styles.selectOptionText,
                  exercise === "sedentary" && styles.selectOptionTextSelected,
                ]}
              >
                Sedentary
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.selectOption,
                exercise === "light" && styles.selectOptionSelected,
              ]}
              onPress={() =>
                updateFormData("lifestyleHabits", "exercise", "light")
              }
            >
              <Text
                style={[
                  styles.selectOptionText,
                  exercise === "light" && styles.selectOptionTextSelected,
                ]}
              >
                Light
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.selectOption,
                exercise === "moderate" && styles.selectOptionSelected,
              ]}
              onPress={() =>
                updateFormData("lifestyleHabits", "exercise", "moderate")
              }
            >
              <Text
                style={[
                  styles.selectOptionText,
                  exercise === "moderate" && styles.selectOptionTextSelected,
                ]}
              >
                Moderate
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.selectOption,
                exercise === "active" && styles.selectOptionSelected,
              ]}
              onPress={() =>
                updateFormData("lifestyleHabits", "exercise", "active")
              }
            >
              <Text
                style={[
                  styles.selectOptionText,
                  exercise === "active" && styles.selectOptionTextSelected,
                ]}
              >
                Active
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Smoking</Text>
          <View style={styles.switchContainer}>
            <Text style={styles.switchLabel}>Do you smoke?</Text>
            <Switch
              value={smoking}
              onValueChange={(value) =>
                updateFormData("lifestyleHabits", "smoking", value)
              }
              trackColor={{ false: colors.border, true: colors.primary + "80" }}
              thumbColor={smoking ? colors.primary : "#f4f3f4"}
            />
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Alcohol Consumption</Text>
          <View style={styles.selectContainer}>
            <TouchableOpacity
              style={[
                styles.selectOption,
                alcohol === "none" && styles.selectOptionSelected,
              ]}
              onPress={() =>
                updateFormData("lifestyleHabits", "alcohol", "none")
              }
            >
              <Text
                style={[
                  styles.selectOptionText,
                  alcohol === "none" && styles.selectOptionTextSelected,
                ]}
              >
                None
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.selectOption,
                alcohol === "occasional" && styles.selectOptionSelected,
              ]}
              onPress={() =>
                updateFormData("lifestyleHabits", "alcohol", "occasional")
              }
            >
              <Text
                style={[
                  styles.selectOptionText,
                  alcohol === "occasional" && styles.selectOptionTextSelected,
                ]}
              >
                Occasional
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.selectOption,
                alcohol === "moderate" && styles.selectOptionSelected,
              ]}
              onPress={() =>
                updateFormData("lifestyleHabits", "alcohol", "moderate")
              }
            >
              <Text
                style={[
                  styles.selectOptionText,
                  alcohol === "moderate" && styles.selectOptionTextSelected,
                ]}
              >
                Moderate
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.selectOption,
                alcohol === "frequent" && styles.selectOptionSelected,
              ]}
              onPress={() =>
                updateFormData("lifestyleHabits", "alcohol", "frequent")
              }
            >
              <Text
                style={[
                  styles.selectOptionText,
                  alcohol === "frequent" && styles.selectOptionTextSelected,
                ]}
              >
                Frequent
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Diet Type</Text>
          <View style={styles.selectContainer}>
            <TouchableOpacity
              style={[
                styles.selectOption,
                diet === "balanced" && styles.selectOptionSelected,
              ]}
              onPress={() =>
                updateFormData("lifestyleHabits", "diet", "balanced")
              }
            >
              <Text
                style={[
                  styles.selectOptionText,
                  diet === "balanced" && styles.selectOptionTextSelected,
                ]}
              >
                Balanced
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.selectOption,
                diet === "vegetarian" && styles.selectOptionSelected,
              ]}
              onPress={() =>
                updateFormData("lifestyleHabits", "diet", "vegetarian")
              }
            >
              <Text
                style={[
                  styles.selectOptionText,
                  diet === "vegetarian" && styles.selectOptionTextSelected,
                ]}
              >
                Vegetarian
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.selectOption,
                diet === "vegan" && styles.selectOptionSelected,
              ]}
              onPress={() => updateFormData("lifestyleHabits", "diet", "vegan")}
            >
              <Text
                style={[
                  styles.selectOptionText,
                  diet === "vegan" && styles.selectOptionTextSelected,
                ]}
              >
                Vegan
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.selectOption,
                diet === "keto" && styles.selectOptionSelected,
              ]}
              onPress={() => updateFormData("lifestyleHabits", "diet", "keto")}
            >
              <Text
                style={[
                  styles.selectOptionText,
                  diet === "keto" && styles.selectOptionTextSelected,
                ]}
              >
                Keto
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  // Render medical history step
  const renderMedicalHistory = () => {
    const { allergies, chronicConditions, surgeries, medications } =
      formData.medicalHistory;

    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Medical History</Text>
        <Text style={styles.stepDescription}>
          Please provide information about your medical history.
        </Text>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              currentMedicalCategory === "allergies" && styles.activeTab,
            ]}
            onPress={() => setCurrentMedicalCategory("allergies")}
          >
            <Text
              style={[
                styles.tabText,
                currentMedicalCategory === "allergies" && styles.activeTabText,
              ]}
            >
              Allergies
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              currentMedicalCategory === "chronicConditions" &&
                styles.activeTab,
            ]}
            onPress={() => setCurrentMedicalCategory("chronicConditions")}
          >
            <Text
              style={[
                styles.tabText,
                currentMedicalCategory === "chronicConditions" &&
                  styles.activeTabText,
              ]}
            >
              Conditions
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              currentMedicalCategory === "surgeries" && styles.activeTab,
            ]}
            onPress={() => setCurrentMedicalCategory("surgeries")}
          >
            <Text
              style={[
                styles.tabText,
                currentMedicalCategory === "surgeries" && styles.activeTabText,
              ]}
            >
              Surgeries
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              currentMedicalCategory === "medications" && styles.activeTab,
            ]}
            onPress={() => setCurrentMedicalCategory("medications")}
          >
            <Text
              style={[
                styles.tabText,
                currentMedicalCategory === "medications" &&
                  styles.activeTabText,
              ]}
            >
              Medications
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.medicalItemInputContainer}>
          <TextInput
            style={styles.medicalItemInput}
            placeholder={`Add ${currentMedicalCategory
              .replace(/([A-Z])/g, " $1")
              .toLowerCase()}`}
            placeholderTextColor={colors.text + "80"}
            value={newMedicalItem}
            onChangeText={setNewMedicalItem}
          />
          <TouchableOpacity
            style={styles.addMedicalItemButton}
            onPress={handleAddMedicalItem}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.medicalItemsContainer}>
          {formData.medicalHistory[currentMedicalCategory].length === 0 ? (
            <Text style={styles.emptyMedicalItems}>
              No{" "}
              {currentMedicalCategory.replace(/([A-Z])/g, " $1").toLowerCase()}{" "}
              added yet.
            </Text>
          ) : (
            formData.medicalHistory[currentMedicalCategory].map((item) => (
              <View key={item.id} style={styles.medicalItem}>
                <Text style={styles.medicalItemText}>{item.value}</Text>
                <TouchableOpacity
                  style={styles.removeMedicalItemButton}
                  onPress={() =>
                    handleRemoveMedicalItem(currentMedicalCategory, item.id)
                  }
                >
                  <Ionicons name="close" size={16} color="white" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </View>
    );
  };

  // Render security step
  const renderSecurity = () => {
    const { password, confirmPassword } = formData.security;
    const { password: passwordError, confirmPassword: confirmPasswordError } =
      errors.security;

    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Security</Text>
        <Text style={styles.stepDescription}>
          Create a secure password for your account.
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.passwordInput, passwordError && styles.inputError]}
              placeholder="Create a password"
              placeholderTextColor={colors.text + "80"}
              value={password}
              onChangeText={(text) =>
                updateFormData("security", "password", text)
              }
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              style={styles.passwordVisibilityButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={24}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>
          {passwordError && (
            <Text style={styles.errorText}>{passwordError}</Text>
          )}
          <Text style={styles.passwordRequirements}>
            Password must be at least 6 characters long
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Confirm Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[
                styles.passwordInput,
                confirmPasswordError && styles.inputError,
              ]}
              placeholder="Confirm your password"
              placeholderTextColor={colors.text + "80"}
              value={confirmPassword}
              onChangeText={(text) =>
                updateFormData("security", "confirmPassword", text)
              }
              secureTextEntry={!showConfirmPassword}
            />
            <TouchableOpacity
              style={styles.passwordVisibilityButton}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off" : "eye"}
                size={24}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>
          {confirmPasswordError && (
            <Text style={styles.errorText}>{confirmPasswordError}</Text>
          )}
        </View>
      </View>
    );
  };

  // Render summary step
  const renderSummary = () => {
    const { firstName, lastName, email } = formData.personalInfo;
    const { age, gender, height, weight } = formData.physicalInfo;
    const { exercise, smoking, alcohol, diet } = formData.lifestyleHabits;
    const { allergies, chronicConditions, surgeries, medications } =
      formData.medicalHistory;

    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Review Your Information</Text>
        <Text style={styles.stepDescription}>
          Please review your information before submitting.
        </Text>

        <View style={styles.summarySection}>
          <Text style={styles.summarySectionTitle}>Personal Information</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Name:</Text>
            <Text
              style={styles.summaryValue}
            >{`${firstName} ${lastName}`}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Email:</Text>
            <Text style={styles.summaryValue}>{email}</Text>
          </View>
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.summarySectionTitle}>Physical Information</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Age:</Text>
            <Text style={styles.summaryValue}>{age}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Gender:</Text>
            <Text style={styles.summaryValue}>
              {gender.charAt(0).toUpperCase() + gender.slice(1)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Height:</Text>
            <Text style={styles.summaryValue}>{height} cm</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Weight:</Text>
            <Text style={styles.summaryValue}>{weight} kg</Text>
          </View>
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.summarySectionTitle}>Lifestyle Habits</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Exercise:</Text>
            <Text style={styles.summaryValue}>
              {exercise.charAt(0).toUpperCase() + exercise.slice(1)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Smoking:</Text>
            <Text style={styles.summaryValue}>{smoking ? "Yes" : "No"}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Alcohol:</Text>
            <Text style={styles.summaryValue}>
              {alcohol.charAt(0).toUpperCase() + alcohol.slice(1)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Diet:</Text>
            <Text style={styles.summaryValue}>
              {diet.charAt(0).toUpperCase() + diet.slice(1)}
            </Text>
          </View>
        </View>

        <View style={styles.summarySection}>
          <Text style={styles.summarySectionTitle}>Medical History</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Allergies:</Text>
            <Text style={styles.summaryValue}>
              {allergies.length > 0
                ? allergies.map((item) => item.value).join(", ")
                : "None"}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Chronic Conditions:</Text>
            <Text style={styles.summaryValue}>
              {chronicConditions.length > 0
                ? chronicConditions.map((item) => item.value).join(", ")
                : "None"}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Surgeries:</Text>
            <Text style={styles.summaryValue}>
              {surgeries.length > 0
                ? surgeries.map((item) => item.value).join(", ")
                : "None"}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Medications:</Text>
            <Text style={styles.summaryValue}>
              {medications.length > 0
                ? medications.map((item) => item.value).join(", ")
                : "None"}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollContent: {
      flexGrow: 1,
      padding: 20,
    },
    progressContainer: {
      marginBottom: 20,
    },
    progressBar: {
      height: 8,
      backgroundColor: colors.border,
      borderRadius: 4,
      marginBottom: 8,
    },
    progressFill: {
      height: "100%",
      borderRadius: 4,
      backgroundColor: colors.primary,
    },
    progressText: {
      color: colors.text,
      fontSize: 14,
      textAlign: "center",
    },
    stepContainer: {
      marginBottom: 20,
    },
    stepTitle: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 8,
    },
    stepDescription: {
      fontSize: 16,
      color: colors.text,
      marginBottom: 20,
    },
    inputGroup: {
      marginBottom: 16,
    },
    inputLabel: {
      fontSize: 16,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 15,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    inputError: {
      borderColor: colors.error,
    },
    errorText: {
      color: colors.error,
      fontSize: 14,
      marginTop: 4,
    },
    radioGroup: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    radioButton: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      flex: 1,
      marginHorizontal: 4,
    },
    radioButtonSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + "10",
    },
    radioCircle: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.border,
      marginRight: 8,
      justifyContent: "center",
      alignItems: "center",
    },
    radioCircleSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primary,
    },
    radioText: {
      color: colors.text,
      fontSize: 14,
    },
    selectContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginHorizontal: -4,
    },
    selectOption: {
      flex: 1,
      minWidth: "48%",
      margin: 4,
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: "center",
    },
    selectOptionSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + "10",
    },
    selectOptionText: {
      color: colors.text,
      fontSize: 14,
    },
    selectOptionTextSelected: {
      color: colors.primary,
      fontWeight: "bold",
    },
    switchContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 12,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    switchLabel: {
      color: colors.text,
      fontSize: 16,
    },
    tabContainer: {
      flexDirection: "row",
      marginBottom: 16,
      borderRadius: 8,
      backgroundColor: colors.card,
      overflow: "hidden",
    },
    tab: {
      flex: 1,
      paddingVertical: 12,
      alignItems: "center",
    },
    activeTab: {
      backgroundColor: colors.primary,
    },
    tabText: {
      color: colors.text,
      fontSize: 12,
    },
    activeTabText: {
      color: "white",
      fontWeight: "bold",
    },
    medicalItemInputContainer: {
      flexDirection: "row",
      marginBottom: 16,
    },
    medicalItemInput: {
      flex: 1,
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 15,
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
      marginRight: 8,
    },
    addMedicalItemButton: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      width: 50,
      justifyContent: "center",
      alignItems: "center",
    },
    medicalItemsContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: 16,
    },
    medicalItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.primary + "20",
      borderRadius: 20,
      paddingVertical: 6,
      paddingHorizontal: 12,
      margin: 4,
    },
    medicalItemText: {
      color: colors.text,
      marginRight: 8,
    },
    removeMedicalItemButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      width: 20,
      height: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    emptyMedicalItems: {
      color: colors.text + "80",
      fontStyle: "italic",
      textAlign: "center",
      padding: 16,
    },
    passwordContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    passwordInput: {
      flex: 1,
      padding: 15,
      color: colors.text,
      borderWidth: 0,
    },
    passwordVisibilityButton: {
      padding: 15,
    },
    passwordRequirements: {
      color: colors.text + "80",
      fontSize: 12,
      marginTop: 4,
    },
    summarySection: {
      backgroundColor: colors.card,
      borderRadius: 8,
      padding: 16,
      marginBottom: 16,
    },
    summarySectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 12,
    },
    summaryRow: {
      flexDirection: "row",
      marginBottom: 8,
    },
    summaryLabel: {
      flex: 1,
      fontSize: 16,
      color: colors.text,
      fontWeight: "500",
    },
    summaryValue: {
      flex: 2,
      fontSize: 16,
      color: colors.text,
    },
    navigationContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 20,
    },
    backButton: {
      padding: 15,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.primary,
      width: "48%",
      alignItems: "center",
    },
    backButtonText: {
      color: colors.primary,
      fontWeight: "bold",
      fontSize: 16,
    },
    nextButton: {
      backgroundColor: colors.primary,
      padding: 15,
      borderRadius: 8,
      width: "48%",
      alignItems: "center",
    },
    nextButtonText: {
      color: "white",
      fontWeight: "bold",
      fontSize: 16,
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 100],
                      outputRange: ["0%", "100%"],
                    }),
                  },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              Step {currentStep + 1} of {currentStep >= 5 ? 5 : 5}
            </Text>
          </View>

          {renderStepContent()}

          <View style={styles.navigationContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handlePrevious}
              disabled={currentStep === 0 || isSubmitting}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

            {currentStep < 5 ? (
              <TouchableOpacity
                style={styles.nextButton}
                onPress={handleNext}
                disabled={isSubmitting}
              >
                <Text style={styles.nextButtonText}>Next</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.nextButton}
                onPress={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.nextButtonText}>Submit</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
