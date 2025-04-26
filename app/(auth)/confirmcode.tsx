"use client";

import type React from "react";
import { useState } from "react";
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
} from "react-native";
import { useTheme } from "../contexts/theme-context";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RouteProp } from "@react-navigation/native";

type ConfirmCodeScreenProps = {
  navigation: StackNavigationProp<any>;
  route: RouteProp<{ params: { email: string } }, "params">;
};

const ConfirmCodeScreen: React.FC<ConfirmCodeScreenProps> = ({
  navigation,
  route,
}) => {
  const { email } = route.params;
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { colors } = useTheme();

  const validateCode = (): boolean => {
    if (!code) {
      setCodeError("Code is required");
      return false;
    } else if (code.length < 4) {
      setCodeError("Please enter a valid code");
      return false;
    } else {
      setCodeError("");
      return true;
    }
  };

  const handleConfirmCode = async () => {
    if (validateCode()) {
      setIsSubmitting(true);
      try {
        // In a real app, you would verify the code with your API
        // This is a mock implementation
        setTimeout(() => {
          // Navigate to the set new password screen
          navigation.navigate("SetNewPassword", { email, code });
        }, 1500);
      } catch (error) {
        Alert.alert("Error", "Failed to verify code. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleResendCode = () => {
    Alert.alert(
      "Code Resent",
      `A new verification code has been sent to ${email}`
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
      justifyContent: "center",
    },
    card: {
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 24,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    title: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 10,
      textAlign: "center",
    },
    subtitle: {
      fontSize: 16,
      color: colors.text,
      marginBottom: 30,
      textAlign: "center",
    },
    emailText: {
      fontSize: 16,
      color: colors.primary,
      fontWeight: "500",
      textAlign: "center",
      marginBottom: 20,
    },
    inputGroup: {
      marginBottom: 20,
    },
    inputLabel: {
      fontSize: 16,
      fontWeight: "500",
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.background,
      borderRadius: 8,
      padding: 15,
      color: colors.text,
      borderWidth: 1,
      borderColor: codeError ? colors.error : colors.border,
      fontSize: 18,
      textAlign: "center",
      letterSpacing: 8,
    },
    errorText: {
      color: colors.error,
      fontSize: 14,
      marginTop: 4,
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: 8,
      padding: 15,
      alignItems: "center",
      marginTop: 10,
    },
    buttonText: {
      color: "white",
      fontWeight: "bold",
      fontSize: 16,
    },
    resendContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 20,
    },
    resendText: {
      color: colors.text,
      fontSize: 14,
    },
    resendButton: {
      marginLeft: 5,
    },
    resendButtonText: {
      color: colors.primary,
      fontSize: 14,
      fontWeight: "bold",
    },
    backButton: {
      marginTop: 20,
      alignSelf: "center",
    },
    backButtonText: {
      color: colors.primary,
      fontSize: 16,
    },
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.title}>Enter Verification Code</Text>
          <Text style={styles.subtitle}>
            Enter the code sent to your email to proceed
          </Text>
          <Text style={styles.emailText}>{email}</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Verification Code</Text>
            <TextInput
              style={styles.input}
              placeholder="• • • •"
              placeholderTextColor={colors.text + "80"}
              keyboardType="numeric"
              maxLength={6}
              value={code}
              onChangeText={setCode}
            />
            {codeError ? (
              <Text style={styles.errorText}>{codeError}</Text>
            ) : null}
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleConfirmCode}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.buttonText}>Verify Code</Text>
            )}
          </TouchableOpacity>

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Didn't receive the code?</Text>
            <TouchableOpacity
              style={styles.resendButton}
              onPress={handleResendCode}
            >
              <Text style={styles.resendButtonText}>Resend</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ConfirmCodeScreen;
