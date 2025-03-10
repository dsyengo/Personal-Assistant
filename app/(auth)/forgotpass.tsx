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
import { authStyles } from "../../styles/AuthStyles";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (): boolean => {
    if (!email) {
      setEmailError("Email is required");
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Email is invalid");
      return false;
    } else {
      setEmailError("");
      return true;
    }
  };

  const handleResetPassword = async () => {
    if (validateEmail()) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        // Handle successful password reset (e.g., navigate to confirmation screen)
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
          <Text style={authStyles.header}>Reset Password</Text>
          <Text style={authStyles.subHeader}>
            Enter your email address and we'll send you a code to reset your
            password
          </Text>

          <View style={authStyles.inputContainer}>
            <Text style={authStyles.inputLabel}>Email</Text>
            <TextInput
              style={authStyles.input}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            {emailError ? (
              <Text style={authStyles.errorText}>{emailError}</Text>
            ) : null}
          </View>

          <TouchableOpacity
            style={authStyles.button}
            onPress={handleResetPassword}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={authStyles.buttonText}>Send Reset Code</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword;
