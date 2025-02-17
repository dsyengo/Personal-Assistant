import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

const ChatBot = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your health assistant. How can I help you today?",
      isBot: true,
    },
    {
      id: 2,
      text: "You can ask me about:",
      isBot: true,
    },
    {
      id: 3,
      text: "• Diet and nutrition advice\n• Exercise recommendations\n• Health tracking\n• General wellness tips",
      isBot: true,
    },
  ]);

  const sendMessage = () => {
    if (message.trim()) {
      setMessages([
        ...messages,
        { id: messages.length + 1, text: message, isBot: false },
      ]);
      setMessage("");
      // Simulate bot response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            text: "I'm processing your request. Let me help you with that.",
            isBot: true,
          },
        ]);
      }, 1000);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Health Assistant",
          headerTitleStyle: styles.headerTitle,
          headerLeft: () => (
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons
                name="information-circle"
                size={24}
                color={Colors.light.text}
              />
            </TouchableOpacity>
          ),
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {/* Quick Action Buttons */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.quickActions}
            contentContainerStyle={styles.quickActionsContent}
          >
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Track Symptoms</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Diet Advice</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Exercise Tips</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Mental Wellness</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Chat Messages */}
          <ScrollView
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            keyboardShouldPersistTaps="handled" // Ensure taps are handled
          >
            {messages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.messageWrapper,
                  msg.isBot
                    ? styles.botMessageWrapper
                    : styles.userMessageWrapper,
                ]}
              >
                {msg.isBot && (
                  <View style={styles.botAvatar}>
                    <Ionicons name="medical" size={16} color="#fff" />
                  </View>
                )}
                <View
                  style={[
                    styles.message,
                    msg.isBot ? styles.botMessage : styles.userMessage,
                  ]}
                >
                  <Text
                    style={[
                      styles.messageText,
                      msg.isBot
                        ? styles.botMessageText
                        : styles.userMessageText,
                    ]}
                  >
                    {msg.text}
                  </Text>
                </View>
              </View>
            ))}
          </ScrollView>

          {/* Input Section */}
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.attachButton}>
              <Ionicons
                name="add-circle"
                size={28} // Increased size for better visibility
                color={Colors.light.primaryButton}
              />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="Type your message..."
              value={message}
              onChangeText={setMessage}
              multiline
              placeholderTextColor={Colors.light.tabIconDefault} // Added placeholder color
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Ionicons
                name="send"
                size={28} // Increased size for better visibility
                color={Colors.light.primaryButton}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  contentContainer: {
    flexGrow: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
  },
  headerButton: {
    padding: 10,
  },
  quickActions: {
    maxHeight: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  quickActionsContent: {
    padding: 10,
    gap: 10,
  },
  actionButton: {
    backgroundColor: Colors.light.cardBackground,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  actionButtonText: {
    color: Colors.light.text,
    fontSize: 14,
    fontWeight: "500",
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 16,
  },
  messageWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 8,
  },
  botMessageWrapper: {
    justifyContent: "flex-start",
  },
  userMessageWrapper: {
    justifyContent: "flex-end",
  },
  botAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.light.primaryButton,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  message: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  botMessage: {
    backgroundColor: Colors.light.cardBackground,
    borderTopLeftRadius: 4,
  },
  userMessage: {
    backgroundColor: Colors.light.primaryButton,
    borderTopRightRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  botMessageText: {
    color: Colors.light.text,
  },
  userMessageText: {
    color: "#fff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: Colors.light.background,
  },
  attachButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    marginHorizontal: 8,
    padding: 10, // Increased padding for better touch area
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 20,
    maxHeight: 100, // Ensure there's enough height for multiline
    fontSize: 14,
    color: Colors.light.text, // Ensure text color is visible
  },
  sendButton: {
    padding: 8,
  },
});

export default ChatBot;
