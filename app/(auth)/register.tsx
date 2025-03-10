import {
  StyleSheet,
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

const register = () => {
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
  const router = useRouter();

  const updateFormData = (key: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      if (!formData[key as keyof typeof formData]) {
        newErrors[key] = `${key} is required`;
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

  const handleRegister = () => {
    if (validateForm()) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        // Registration success logic
      }, 2000);
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

          {Object.entries(formData).map(([key, value]) => (
            <View key={key} style={authStyles.inputContainer}>
              <Text style={authStyles.inputLabel}>
                {key.replace(/([A-Z])/g, " $1").trim()}
              </Text>
              {key === "gender" ? (
                <Picker
                  selectedValue={value}
                  onValueChange={(itemValue) => updateFormData(key, itemValue)}
                  style={authStyles.pickerContainer}
                >
                  <Picker.Item label="Male" value="male" />
                  <Picker.Item label="Female" value="female" />
                  <Picker.Item label="Other" value="other" />
                </Picker>
              ) : (
                <TextInput
                  style={authStyles.input}
                  placeholder={key}
                  placeholderTextColor="#999"
                  secureTextEntry={
                    key.includes("password") && key === "password"
                      ? !showPassword
                      : !showConfirmPassword
                  }
                  keyboardType={
                    ["age", "height", "weight"].includes(key)
                      ? "numeric"
                      : "default"
                  }
                  value={value}
                  onChangeText={(text) => updateFormData(key, text)}
                />
              )}
              {errors[key] ? (
                <Text style={authStyles.errorText}>{errors[key]}</Text>
              ) : null}
            </View>
          ))}

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

export default register;

const styles = StyleSheet.create({});
