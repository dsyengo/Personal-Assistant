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

const ConfirmCode = () => {
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateCode = (): boolean => {
    if (!code) {
      setCodeError("Code is required");
      return false;
    } else {
      setCodeError("");
      return true;
    }
  };

  const handleConfirmCode = async () => {
    if (validateCode()) {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        // Handle successful code confirmation (e.g., navigate to set new password screen)
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
          <Text style={authStyles.header}>Enter Verification Code</Text>
          <Text style={authStyles.subHeader}>
            Enter the code sent to your email to proceed
          </Text>

          <View style={authStyles.inputContainer}>
            <Text style={authStyles.inputLabel}>Verification Code</Text>
            <TextInput
              style={authStyles.input}
              placeholder="Enter code"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={code}
              onChangeText={setCode}
            />
            {codeError ? (
              <Text style={authStyles.errorText}>{codeError}</Text>
            ) : null}
          </View>

          <TouchableOpacity
            style={authStyles.button}
            onPress={handleConfirmCode}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={authStyles.buttonText}>Confirm Code</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ConfirmCode;
