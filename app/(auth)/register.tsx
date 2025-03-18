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
import { authStyles } from "../../styles/AuthStyles";
import { useRouter } from "expo-router";
import { useAuth } from "./AuthContext";

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
    lifestyleHabits: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const updateFormData = (key: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) {
        newErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is required`;
        isValid = false;
      }
    });

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    const { success, message } = await register({
      ...formData,
      age: Number(formData.age),
      height: Number(formData.height),
      weight: Number(formData.weight),
    });

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

          <View style={authStyles.inputContainer}>
            <Text style={authStyles.inputLabel}>Age</Text>
            <TextInput
              style={authStyles.input}
              placeholder="Age"
              keyboardType="numeric"
              value={formData.age}
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
              onValueChange={(itemValue) => updateFormData("gender", itemValue)}
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
              value={formData.height}
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
              value={formData.weight}
              onChangeText={(text) => updateFormData("weight", text)}
            />
            {errors.weight && (
              <Text style={authStyles.errorText}>{errors.weight}</Text>
            )}
          </View>

          <View style={authStyles.inputContainer}>
            <Text style={authStyles.inputLabel}>Lifestyle Habits</Text>
            <TextInput
              style={authStyles.input}
              placeholder="Lifestyle Habits"
              value={formData.lifestyleHabits}
              onChangeText={(text) => updateFormData("lifestyleHabits", text)}
            />
          </View>

          <View style={authStyles.inputContainer}>
            <Text style={authStyles.inputLabel}>Password</Text>
            <TextInput
              style={authStyles.input}
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={formData.password}
              onChangeText={(text) => updateFormData("password", text)}
            />
            {errors.password && (
              <Text style={authStyles.errorText}>{errors.password}</Text>
            )}
          </View>

          <View style={authStyles.inputContainer}>
            <Text style={authStyles.inputLabel}>Confirm Password</Text>
            <TextInput
              style={authStyles.input}
              placeholder="Confirm Password"
              secureTextEntry={!showConfirmPassword}
              value={formData.confirmPassword}
              onChangeText={(text) => updateFormData("confirmPassword", text)}
            />
            {errors.confirmPassword && (
              <Text style={authStyles.errorText}>{errors.confirmPassword}</Text>
            )}
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
