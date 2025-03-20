// Types
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

/**
 * Sends a message to the chatbot backend and returns the structured response.
 *
 * @param userMessage - The message text sent by the user
 * @returns A promise containing the structured bot response
 */
export const sendChatMessage = async (
  userMessage: string
): Promise<BotResponse> => {
  try {
    const response = await fetch("http://192.168.81.93:3000/api/chatbot/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userMessage }),
    });
    console.log(userMessage);
    if (!response.ok) {
      throw new Error(`Server responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Bot response: ", data);
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
