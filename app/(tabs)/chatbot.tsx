import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { Stack, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { sendChatMessage, Message, BotResponse } from "./logics/chatbotService";

const TAB_BAR_HEIGHT = 70;

const ChatBot: React.FC = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState<string>("");
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your health assistant. How can I help?",
      isBot: true,
      timestamp: new Date(),
    },
    {
      id: 2,
      text: "You can ask me about:",
      isBot: true,
      timestamp: new Date(),
    },
    {
      id: 3,
      text: "• Diet and nutrition\n• Exercise tips\n• Health tracking",
      isBot: true,
      timestamp: new Date(),
    },
  ]);

  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const sendMessage = async () => {
    if (message.trim()) {
      // If editing an existing message
      if (editingMessageId !== null) {
        setMessages(
          messages.map((msg) =>
            msg.id === editingMessageId
              ? { ...msg, text: message, status: "sent" }
              : msg
          )
        );
        setEditingMessageId(null);
        setMessage("");
        return;
      }

      // Sending a new message
      const newMessageId = messages.length + 1;
      setMessages([
        ...messages,
        {
          id: newMessageId,
          text: message,
          isBot: false,
          timestamp: new Date(),
          status: "sending",
        },
      ]);
      const userMessage = message;
      setMessage("");
      setIsTyping(true);

      try {
        // Get structured response from backend using the service
        const response = await sendChatMessage(userMessage);

        // Update message status to sent
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newMessageId ? { ...msg, status: "sent" } : msg
          )
        );

        // Add bot response with main message
        const botMessageId = messages.length + 2;
        setMessages((prev) => [
          ...prev,
          {
            id: botMessageId,
            text: response.message,
            isBot: true,
            timestamp: new Date(),
          },
        ]);

        // If there are suggestions, add them as a separate message
        if (response.suggestions && response.suggestions.length > 0) {
          setTimeout(() => {
            const suggestionText = response
              .suggestions!.map((s) => `• ${s}`)
              .join("\n");
            setMessages((prev) => [
              ...prev,
              {
                id: prev.length + 1,
                text: suggestionText,
                isBot: true,
                timestamp: new Date(),
              },
            ]);
          }, 500);
        }

        // If there are links, add them as a separate message
        if (response.links && response.links.length > 0) {
          setTimeout(() => {
            const linksText =
              "Helpful resources:\n" +
              response.links!.map((l) => `• ${l.title}`).join("\n");
            setMessages((prev) => [
              ...prev,
              {
                id: prev.length + 1,
                text: linksText,
                isBot: true,
                timestamp: new Date(),
              },
            ]);
          }, 1000);
        }
      } catch (error) {
        // Handle error
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === newMessageId ? { ...msg, status: "error" } : msg
          )
        );

        Alert.alert("Error", "Failed to send message. Please try again.", [
          { text: "OK" },
        ]);
      } finally {
        setIsTyping(false);
      }
    }
  };

  const editMessage = (id: number) => {
    const messageToEdit = messages.find((msg) => msg.id === id);
    if (messageToEdit && !messageToEdit.isBot) {
      setEditingMessageId(id);
      setMessage(messageToEdit.text);

      // Update status to editing
      setMessages(
        messages.map((msg) =>
          msg.id === id ? { ...msg, status: "editing" } : msg
        )
      );
    }
  };

  const cancelEditing = () => {
    setEditingMessageId(null);
    setMessage("");

    // Reset status
    setMessages(
      messages.map((msg) =>
        msg.id === editingMessageId ? { ...msg, status: "sent" } : msg
      )
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const renderMessageStatus = (status?: string) => {
    switch (status) {
      case "sending":
        return <Text style={styles.messageStatus}>Sending...</Text>;
      case "error":
        return (
          <Text style={[styles.messageStatus, styles.errorStatus]}>
            Failed to send
          </Text>
        );
      case "editing":
        return <Text style={styles.messageStatus}>Editing...</Text>;
      default:
        return null;
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

      <KeyboardAvoidingView
        style={styles.flexContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={TAB_BAR_HEIGHT + insets.bottom + 20}
      >
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={{
            paddingBottom: TAB_BAR_HEIGHT + insets.bottom + 40,
          }}
          keyboardShouldPersistTaps="handled"
        >
          {messages.map((msg) => (
            <Animated.View
              key={msg.id}
              entering={FadeInDown.duration(300)}
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
                  msg.status === "editing" && styles.editingMessage,
                  msg.status === "error" && styles.errorMessage,
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
                <View style={styles.messageFooter}>
                  {renderMessageStatus(msg.status)}
                  <Text style={styles.timestamp}>
                    {formatTime(msg.timestamp)}
                  </Text>
                </View>
              </View>

              {!msg.isBot && !msg.status?.includes("editing") && (
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => editMessage(msg.id)}
                >
                  <Ionicons
                    name="pencil"
                    size={16}
                    color={Colors.light.tabIconDefault}
                  />
                </TouchableOpacity>
              )}
            </Animated.View>
          ))}

          {isTyping && (
            <Animated.View
              entering={FadeInUp.duration(300)}
              style={[styles.messageWrapper, styles.botMessageWrapper]}
            >
              <View style={styles.botAvatar}>
                <Ionicons name="medical" size={16} color="#fff" />
              </View>
              <View
                style={[
                  styles.message,
                  styles.botMessage,
                  styles.typingIndicator,
                ]}
              >
                <ActivityIndicator
                  size="small"
                  color={Colors.light.primaryButton}
                />
              </View>
            </Animated.View>
          )}
        </ScrollView>

        <Animated.View
          entering={FadeInUp.duration(300)}
          style={[
            styles.inputContainer,
            { marginBottom: TAB_BAR_HEIGHT + insets.bottom + 10 },
          ]}
        >
          {editingMessageId === null ? (
            <TouchableOpacity style={styles.attachButton}>
              <Ionicons
                name="add-circle"
                size={28}
                color={Colors.light.primaryButton}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.attachButton}
              onPress={cancelEditing}
            >
              <Ionicons
                name="close-circle"
                size={28}
                color={Colors.light.tint}
              />
            </TouchableOpacity>
          )}

          <TextInput
            style={styles.input}
            placeholder={
              editingMessageId !== null
                ? "Edit your message..."
                : "Type your message..."
            }
            value={message}
            onChangeText={setMessage}
            multiline
            placeholderTextColor={Colors.light.tabIconDefault}
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              !message.trim() && styles.disabledButton,
            ]}
            onPress={sendMessage}
            disabled={!message.trim()}
          >
            <Ionicons
              name={editingMessageId !== null ? "checkmark" : "send"}
              size={28}
              color={
                message.trim()
                  ? Colors.light.primaryButton
                  : Colors.light.tabIconDefault
              }
            />
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  flexContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.light.text,
  },
  headerButton: {
    padding: 10,
  },
  messagesContainer: {
    flex: 1,
  },
  messageWrapper: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 8,
    paddingHorizontal: 12,
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
    elevation: 1,
  },
  botMessage: {
    backgroundColor: Colors.light.cardBackground,
    borderTopLeftRadius: 4,
  },
  userMessage: {
    backgroundColor: Colors.light.primaryButton,
    borderTopRightRadius: 4,
  },
  editingMessage: {
    borderWidth: 2,
    borderColor: Colors.light.tint,
    opacity: 0.8,
  },
  errorMessage: {
    borderWidth: 1,
    borderColor: "#ff6b6b",
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
  messageFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
    alignItems: "center",
  },
  messageStatus: {
    fontSize: 11,
    color: Colors.light.tabIconDefault,
    fontStyle: "italic",
  },
  errorStatus: {
    color: "#ff6b6b",
  },
  timestamp: {
    fontSize: 10,
    color: Colors.light.tabIconDefault,
    textAlign: "right",
  },
  editButton: {
    padding: 8,
    marginLeft: 4,
  },
  typingIndicator: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    height: 40,
    justifyContent: "center",
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
    padding: 10,
    backgroundColor: Colors.light.cardBackground,
    borderRadius: 20,
    maxHeight: 100,
    fontSize: 14,
    color: Colors.light.text,
  },
  sendButton: {
    padding: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default ChatBot;
