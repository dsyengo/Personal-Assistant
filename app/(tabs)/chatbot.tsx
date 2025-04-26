"use client";

import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../(auth)/AuthContext";
import { Colors } from "@/constants/Colors";
import { sendChatMessage, getChatLogs } from "@/services/chatbotService";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
};

const ChatbotScreen = () => {
  const { user } = useAuth();
  const userId = user?.id;
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: `Hello ${
        user?.firstName || "there"
      }! I'm your AI Health Assistant. How can I help you today?`,
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (userId) {
      getChatLogs();
    }
  }, [userId]);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSend = () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateBotResponse(message);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const formatBotMessage = (message: string): string => {
    return message
      .replace(/\\/g, "") // Remove escaped slashes
      .replace(/\r?\n|\r/g, "\n") // Normalize newlines
      .replace(/\*\*(.*?)\*\*/g, "$1") // Strip bold markdown
      .replace(/__([^_]+)__/g, "$1") // Strip italic markdown
      .replace(/\[(.*?)\]\((.*?)\)/g, "$1 ($2)") // Format links as plain text with URL
      .trim();
  };

  const generateBotResponse = async (userMessage: string): Promise<string> => {
    try {
      const botResponse = await sendChatMessage(userMessage);

      if (botResponse.errorCode) {
        return botResponse.message;
      }

      return formatBotMessage(botResponse.message);
    } catch (error) {
      console.error("Error generating bot response:", error);
      return "There was an issue processing your request. Please try again later.";
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.light.background,
    },
    chatContainer: {
      flex: 1,
      padding: 16,
    },
    messageContainer: {
      marginBottom: 16,
      maxWidth: "80%",
    },
    userMessage: {
      alignSelf: "flex-end",
      backgroundColor: Colors.light.secondaryButton,
      borderRadius: 16,
      borderBottomRightRadius: 4,
      padding: 12,
      color: Colors.light.text,
    },
    botMessage: {
      alignSelf: "flex-start",
      backgroundColor: Colors.light.tabIconSelected,
      borderRadius: 16,
      borderBottomLeftRadius: 4,
      padding: 12,
    },
    userMessageText: {
      color: "white",
      fontSize: 16,
    },
    botMessageText: {
      color: Colors.light.text,
      fontSize: 16,
    },
    timestamp: {
      fontSize: 12,
      color: Colors.light.text,
      opacity: 0.6,
      marginTop: 4,
      alignSelf: "flex-end",
    },
    inputContainer: {
      flexDirection: "row",
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: Colors.light.tint,
      backgroundColor: Colors.light.inputBackground,
    },
    input: {
      flex: 1,
      backgroundColor: Colors.light.background,
      borderRadius: 24,
      paddingHorizontal: 16,
      paddingVertical: 10,
      marginRight: 8,
      color: Colors.light.text,
    },
    sendButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: Colors.light.primaryButton,
      justifyContent: "center",
      alignItems: "center",
    },
    typingIndicator: {
      alignSelf: "flex-start",
      backgroundColor: Colors.light.cardBackground,
      borderRadius: 16,
      borderBottomLeftRadius: 4,
      padding: 12,
      marginBottom: 16,
      flexDirection: "row",
      alignItems: "center",
    },
    typingText: {
      color: Colors.light.text,
      marginLeft: 8,
    },
    suggestionContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginBottom: 16,
      justifyContent: "center",
    },
    suggestionButton: {
      backgroundColor: Colors.light.cardBackground,
      borderRadius: 16,
      paddingHorizontal: 12,
      paddingVertical: 8,
      margin: 4,
      borderWidth: 1,
      borderColor: Colors.light.secondaryButton,
    },
    suggestionText: {
      color: Colors.light.text,
      fontSize: 14,
    },
  });

  const suggestions = [
    "How can I improve my diet?",
    "Recommend a workout routine",
    "Tips for better sleep",
    "How to reduce stress",
    "Daily water intake",
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.chatContainer}>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <View style={styles.suggestionContainer}>
              {suggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionButton}
                  onPress={() => {
                    setMessage(suggestion);
                  }}
                >
                  <Text style={styles.suggestionText}>{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          }
          renderItem={({ item }) => (
            <View
              style={[
                styles.messageContainer,
                item.sender === "user" ? styles.userMessage : styles.botMessage,
              ]}
            >
              <Text
                style={
                  item.sender === "user"
                    ? styles.userMessageText
                    : styles.botMessageText
                }
              >
                {item.text}
              </Text>
              <Text style={styles.timestamp}>{formatTime(item.timestamp)}</Text>
            </View>
          )}
          ListFooterComponent={
            isTyping ? (
              <View style={styles.typingIndicator}>
                <ActivityIndicator
                  size="small"
                  color={Colors.light.primaryButton}
                />
                <Text style={styles.typingText}>AI Assistant is typing...</Text>
              </View>
            ) : null
          }
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor={Colors.light.text + "80"}
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Ionicons name="send" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatbotScreen;
