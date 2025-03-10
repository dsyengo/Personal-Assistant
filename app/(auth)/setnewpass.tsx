import React, { useState } from "react";
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
import { authStyles } from "../../styles/AuthStyles";
import { Ionicons } from "@expo/vector-icons";

const SetNewPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePasswords = (): boolean => {
    if (!password || !confirmPassword) {
      setPasswordError("Both fields are required");
      return false;
    } else if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };

  const handleChangePassword = async () => {
    if (validatePasswords()) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        // Handle successful password change (e.g., navigate to login screen)
      }, 2000);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={authStyles.scrollContainer}
        style={authStyles.container}
      >
        <View style={authStyles.cardContainer}>
          <Text style={authStyles.header}>Set New Password</Text>
          <Text style={authStyles.subHeader}>
            Enter and confirm your new password
          </Text>

          <View style={authStyles.inputContainer}>
            <Text style={authStyles.inputLabel}>New Password</Text>
            <View style={{ position: "relative" }}>
              <TextInput
                style={authStyles.input}
                placeholder="Enter new password"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={{ position: "absolute", right: 15, top: 12 }}
                onPress={() => setShowPassword(!showPassword)}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={24}
                  color="#999"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={authStyles.inputContainer}>
            <Text style={authStyles.inputLabel}>Confirm Password</Text>
            <View style={{ position: "relative" }}>
              <TextInput
                style={authStyles.input}
                placeholder="Confirm new password"
                placeholderTextColor="#999"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                style={{ position: "absolute", right: 15, top: 12 }}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={24}
                  color="#999"
                />
              </TouchableOpacity>
            </View>
            {passwordError ? (
              <Text style={authStyles.errorText}>{passwordError}</Text>
            ) : null}
          </View>

          <TouchableOpacity
            style={authStyles.button}
            onPress={handleChangePassword}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={authStyles.buttonText}>Change Password</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SetNewPassword;
