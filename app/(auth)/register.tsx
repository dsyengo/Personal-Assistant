import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import { authStyles } from "../../styles/AuthStyles2";
import { useRouter } from "expo-router";
import { useAuth } from "./AuthContext";
import MedicalHistorySection from "./medicalHistory";

const RegisterScreen = () => {
  const { register } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    gender: "male",
    height: "",
    weight: "",
    lifestyleHabits: {
      exercise: "",
      smoking: false,
      alcohol: "",
      diet: "",
    },
    medicalHistory: {
      allergies: [],
      chronicConditions: [],
      surgeries: [],
      medications: [],
    },
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const updateFormData = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const updateLifestyleHabit = (habitKey, value) => {
    setFormData((prevData) => ({
      ...prevData,
      lifestyleHabits: {
        ...prevData.lifestyleHabits,
        [habitKey]: value,
      },
    }));
  };

  const updateMedicalHistory = (historyKey, value) => {
    setFormData((prevData) => ({
      ...prevData,
      medicalHistory: {
        ...prevData.medicalHistory,
        [historyKey]: value,
      },
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    // Basic required field validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Age validation
    if (!formData.age) {
      newErrors.age = "Age is required";
      isValid = false;
    } else if (isNaN(Number(formData.age)) || Number(formData.age) <= 0) {
      newErrors.age = "Please enter a valid age";
      isValid = false;
    }

    // Height validation
    if (!formData.height) {
      newErrors.height = "Height is required";
      isValid = false;
    } else if (isNaN(Number(formData.height)) || Number(formData.height) <= 0) {
      newErrors.height = "Please enter a valid height";
      isValid = false;
    }

    // Weight validation
    if (!formData.weight) {
      newErrors.weight = "Weight is required";
      isValid = false;
    } else if (isNaN(Number(formData.weight)) || Number(formData.weight) <= 0) {
      newErrors.weight = "Please enter a valid weight";
      isValid = false;
    }

    // Password validation
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    // Lifestyle validation - at least some info should be provided
    if (
      !formData.lifestyleHabits.exercise &&
      !formData.lifestyleHabits.alcohol &&
      !formData.lifestyleHabits.diet
    ) {
      newErrors.lifestyleHabits = "Please provide some lifestyle information";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    // Transform form data for API
    const apiFormData = {
      ...formData,
      age: Number(formData.age),
      height: Number(formData.height),
      weight: Number(formData.weight),
      // Stringify the lifestyleHabits object to match API format
      lifestyleHabits: JSON.stringify(formData.lifestyleHabits),
    };

    delete apiFormData.confirmPassword;

    const { success, message } = await register(apiFormData);

    setIsLoading(false);

    if (success) {
      router.push("/login");
    } else {
      setErrors({ general: message || "Registration failed. Try again." });
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView style={authStyles.container}>
        <View style={authStyles.cardContainer}>
          <Text style={authStyles.header}>Create Account</Text>
          <Text style={authStyles.subHeader}>Please fill in your details</Text>

          {errors.general && (
            <Text style={[authStyles.errorText, { textAlign: "center" }]}>
              {errors.general}
            </Text>
          )}

          {/* Personal Information Section */}
          <View style={authStyles.sectionContainer}>
            <Text style={authStyles.sectionTitle}>Personal Information</Text>

            <View style={authStyles.inputContainer}>
              <Text style={authStyles.inputLabel}>First Name</Text>
              <TextInput
                style={authStyles.input}
                placeholder="First Name"
                value={formData.firstName}
                onChangeText={(text) => updateFormData("firstName", text)}
              />
              {errors.firstName && (
                <Text style={authStyles.errorText}>{errors.firstName}</Text>
              )}
            </View>

            <View style={authStyles.inputContainer}>
              <Text style={authStyles.inputLabel}>Last Name</Text>
              <TextInput
                style={authStyles.input}
                placeholder="Last Name"
                value={formData.lastName}
                onChangeText={(text) => updateFormData("lastName", text)}
              />
              {errors.lastName && (
                <Text style={authStyles.errorText}>{errors.lastName}</Text>
              )}
            </View>

            <View style={authStyles.inputContainer}>
              <Text style={authStyles.inputLabel}>Email</Text>
              <TextInput
                style={authStyles.input}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={formData.email}
                onChangeText={(text) => updateFormData("email", text)}
              />
              {errors.email && (
                <Text style={authStyles.errorText}>{errors.email}</Text>
              )}
            </View>
          </View>

          {/* Physical Information Section */}
          <View style={authStyles.sectionContainer}>
            <Text style={authStyles.sectionTitle}>Physical Information</Text>

            <View style={authStyles.inputContainer}>
              <Text style={authStyles.inputLabel}>Age</Text>
              <TextInput
                style={authStyles.input}
                placeholder="Age"
                keyboardType="numeric"
                value={formData.age.toString()}
                onChangeText={(text) => updateFormData("age", text)}
              />
              {errors.age && (
                <Text style={authStyles.errorText}>{errors.age}</Text>
              )}
            </View>

            <View style={authStyles.inputContainer}>
              <Text style={authStyles.inputLabel}>Gender</Text>
              <Picker
                selectedValue={formData.gender}
                onValueChange={(itemValue) =>
                  updateFormData("gender", itemValue)
                }
                style={authStyles.pickerContainer}
              >
                <Picker.Item label="Male" value="male" />
                <Picker.Item label="Female" value="female" />
                <Picker.Item label="Other" value="other" />
              </Picker>
            </View>

            <View style={authStyles.inputContainer}>
              <Text style={authStyles.inputLabel}>Height (cm)</Text>
              <TextInput
                style={authStyles.input}
                placeholder="Height in cm"
                keyboardType="numeric"
                value={formData.height.toString()}
                onChangeText={(text) => updateFormData("height", text)}
              />
              {errors.height && (
                <Text style={authStyles.errorText}>{errors.height}</Text>
              )}
            </View>

            <View style={authStyles.inputContainer}>
              <Text style={authStyles.inputLabel}>Weight (kg)</Text>
              <TextInput
                style={authStyles.input}
                placeholder="Weight in kg"
                keyboardType="numeric"
                value={formData.weight.toString()}
                onChangeText={(text) => updateFormData("weight", text)}
              />
              {errors.weight && (
                <Text style={authStyles.errorText}>{errors.weight}</Text>
              )}
            </View>
          </View>

          {/* Lifestyle Habits Section */}
          <View style={authStyles.sectionContainer}>
            <Text style={authStyles.sectionTitle}>Lifestyle Habits</Text>

            <View style={authStyles.inputContainer}>
              <Text style={authStyles.inputLabel}>Exercise Frequency</Text>
              <TextInput
                style={authStyles.input}
                placeholder="e.g., 3 times a week"
                value={formData.lifestyleHabits.exercise}
                onChangeText={(text) => updateLifestyleHabit("exercise", text)}
              />
            </View>

            <View style={authStyles.inputContainer}>
              <Text style={authStyles.inputLabel}>Alcohol Consumption</Text>
              <Picker
                selectedValue={formData.lifestyleHabits.alcohol}
                onValueChange={(itemValue) =>
                  updateLifestyleHabit("alcohol", itemValue)
                }
                style={authStyles.pickerContainer}
              >
                <Picker.Item label="Select..." value="" />
                <Picker.Item label="None" value="none" />
                <Picker.Item label="Occasional" value="occasional" />
                <Picker.Item label="Regular" value="regular" />
                <Picker.Item label="Heavy" value="heavy" />
              </Picker>
            </View>

            <View style={authStyles.inputContainer}>
              <Text style={authStyles.inputLabel}>Diet Type</Text>
              <Picker
                selectedValue={formData.lifestyleHabits.diet}
                onValueChange={(itemValue) =>
                  updateLifestyleHabit("diet", itemValue)
                }
                style={authStyles.pickerContainer}
              >
                <Picker.Item label="Select..." value="" />
                <Picker.Item label="Balanced" value="balanced" />
                <Picker.Item label="Vegetarian" value="vegetarian" />
                <Picker.Item label="Vegan" value="vegan" />
                <Picker.Item label="Keto" value="keto" />
                <Picker.Item label="Other" value="other" />
              </Picker>
            </View>

            <View style={authStyles.inputContainer}>
              <Text style={authStyles.inputLabel}>Smoking</Text>
              <Picker
                selectedValue={formData.lifestyleHabits.smoking}
                onValueChange={(itemValue) =>
                  updateLifestyleHabit("smoking", itemValue === "true")
                }
                style={authStyles.pickerContainer}
              >
                <Picker.Item label="No" value="false" />
                <Picker.Item label="Yes" value="true" />
              </Picker>
            </View>

            {errors.lifestyleHabits && (
              <Text style={authStyles.errorText}>{errors.lifestyleHabits}</Text>
            )}
          </View>

          {/* Medical History Section */}
          <MedicalHistorySection
            medicalHistory={formData.medicalHistory}
            updateMedicalHistory={updateMedicalHistory}
            errors={errors}
          />

          {/* Security Section */}
          <View style={authStyles.sectionContainer}>
            <Text style={authStyles.sectionTitle}>Security</Text>

            <View style={authStyles.inputContainer}>
              <Text style={authStyles.inputLabel}>Password</Text>
              <View style={authStyles.passwordContainer}>
                <TextInput
                  style={authStyles.passwordInput}
                  placeholder="Password"
                  secureTextEntry={!showPassword}
                  value={formData.password}
                  onChangeText={(text) => updateFormData("password", text)}
                />
                <TouchableOpacity
                  style={authStyles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text>{showPassword ? "👁️" : "👁️‍🗨️"}</Text>
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text style={authStyles.errorText}>{errors.password}</Text>
              )}
            </View>

            <View style={authStyles.inputContainer}>
              <Text style={authStyles.inputLabel}>Confirm Password</Text>
              <View style={authStyles.passwordContainer}>
                <TextInput
                  style={authStyles.passwordInput}
                  placeholder="Confirm Password"
                  secureTextEntry={!showConfirmPassword}
                  value={formData.confirmPassword}
                  onChangeText={(text) =>
                    updateFormData("confirmPassword", text)
                  }
                />
                <TouchableOpacity
                  style={authStyles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <Text>{showConfirmPassword ? "👁️" : "👁️‍🗨️"}</Text>
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Text style={authStyles.errorText}>
                  {errors.confirmPassword}
                </Text>
              )}
            </View>
          </View>

          <TouchableOpacity
            style={authStyles.button}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={authStyles.buttonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <View style={authStyles.linkContainer}>
            <Text style={authStyles.linkText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={authStyles.link}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;
