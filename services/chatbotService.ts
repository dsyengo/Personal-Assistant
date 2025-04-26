import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
  status?: "sending" | "sent" | "editing" | "error";
}

export interface BotResponse {
  message: string;
  suggestions?: string[];
  links?: { title: string; url: string }[];
  errorCode?: string;
}

interface GetChatLogsResponse {
  success: boolean;
  message: string;
  data: Message[];
}

// export type Message = {
//   id: string;
//   text: string;
//   sender: "user" | "bot";
//   timestamp: Date;
// };

/**
 * Sends a message to the chatbot backend and returns the structured response.
 *
 * @param userMessage - The message text sent by the user
 * @returns A promise containing the structured bot response
 */

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const sendChatMessage = async (
  userMessage: string
): Promise<BotResponse> => {
  try {
    const token = await AsyncStorage.getItem("token");

    const response = await fetch(`${API_BASE_URL}/chatbot/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ userMessage }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      // Return an error message the bot can display
      return {
        message: data.message || "Unauthorized or bad request",
        errorCode: "AUTH_FAILURE",
      };
    }

    return {
      message: data.data.assistantResponse || "No response received.",
      suggestions: data.suggestions || [],
      links: data.links || [],
    };
  } catch (error) {
    console.error("Error sending message:", error);
    return {
      message: "There was an error processing your request.",
      errorCode: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

export const getChatLogs = async (): Promise<GetChatLogsResponse> => {
  try {
    const token = await AsyncStorage.getItem("token");

    if (!token) {
      return {
        success: false,
        message: "Not authorized, please log in",
        data: [],
      };
    }

    const response = await fetch(`${API_BASE_URL}/chatbot/logs`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Response status:", response.status);
    const text = await response.text();
    console.log("Response text:", text);

    if (!response.ok) {
      console.error("Error fetching chat logs:", text);
      return {
        success: false,
        message: "Failed to fetch chat logs: " + text,
        data: [],
      };
    }

    const parsedData = JSON.parse(text);
    console.log("Chat logs data:", parsedData);

    const formattedLogs: Message[] = [];

    parsedData.data.forEach((log: any) => {
      if (log.sender) {
        formattedLogs.push({
          id: `${log.id}-user`,
          text: log.sender,
          sender: "user",
          timestamp: new Date(log.timestamp),
        });
      }
      if (log.botResponse) {
        formattedLogs.push({
          id: `${log.id}-bot`,
          text: log.botResponse,
          sender: "bot",
          timestamp: new Date(log.timestamp),
        });
      }
    });

    return {
      success: true,
      message: "Chat logs fetched successfully",
      data: formattedLogs,
    };
  } catch (error) {
    console.error("Error fetching chat logs:", error);
    return {
      success: false,
      message: "There was an error processing your request",
      data: [],
    };
  }
};
