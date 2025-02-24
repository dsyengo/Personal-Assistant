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
import React, { useState, useRef, useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
}

const TAB_BAR_HEIGHT = 70; // Adjust based on actual tab height

const ChatBot: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your health assistant. How can I help?",
      isBot: true,
    },
    { id: 2, text: "You can ask me about:", isBot: true },
    {
      id: 3,
      text: "• Diet and nutrition\n• Exercise tips\n• Health tracking",
      isBot: true,
    },
  ]);

  const scrollViewRef = useRef<ScrollView>(null);

  // Auto-scroll to the latest message when messages update
  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = () => {
    if (message.trim()) {
      setMessages([
        ...messages,
        { id: messages.length + 1, text: message, isBot: false },
      ]);
      setMessage("");

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            text: "I'm processing your request. Let me help.",
            isBot: true,
          },
        ]);
      }, 1000);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Health Assistant",
          headerTitleStyle: styles.headerTitle,
          headerLeft: () => (
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => router.back()}
            >
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

      {/* Keyboard Handling Wrapper */}
      <KeyboardAvoidingView
        style={styles.flexContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={TAB_BAR_HEIGHT + insets.bottom + 20}
      >
        {/* Chat Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={{
            paddingBottom: TAB_BAR_HEIGHT + insets.bottom + 40, // Increased padding to lift chat
          }}
          keyboardShouldPersistTaps="handled"
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
                    msg.isBot ? styles.botMessageText : styles.userMessageText,
                  ]}
                >
                  {msg.text}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Input Section */}
        <View
          style={[
            styles.inputContainer,
            { marginBottom: TAB_BAR_HEIGHT + insets.bottom + 10 },
          ]}
        >
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons
              name="add-circle"
              size={28}
              color={Colors.light.primaryButton}
            />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Type your message..."
            value={message}
            onChangeText={setMessage}
            multiline
            placeholderTextColor={Colors.light.tabIconDefault}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Ionicons
              name="send"
              size={28}
              color={Colors.light.primaryButton}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.light.background },
  flexContainer: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: "600", color: Colors.light.text },
  headerButton: { padding: 10 },

  messagesContainer: { flex: 1 },
  messageWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 8,
  },
  botMessageWrapper: { justifyContent: "flex-start" },
  userMessageWrapper: { justifyContent: "flex-end" },
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
  messageText: { fontSize: 14, lineHeight: 20 },
  botMessageText: { color: Colors.light.text },
  userMessageText: { color: "#fff" },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    backgroundColor: Colors.light.background,
  },
  attachButton: { padding: 8 },
  input: {
    flex: 1,
    marginHorizontal: 8,
    padding: 10,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 20,
    maxHeight: 100,
    fontSize: 14,
    color: Colors.light.text,
  },
  sendButton: { padding: 8 },
});

export default ChatBot;
