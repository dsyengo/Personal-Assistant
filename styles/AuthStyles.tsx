// styles/AuthStyles.ts
import { StyleSheet, Dimensions, Platform } from "react-native";
import { Colors } from "../constants/Colors";

// Get device dimensions for responsive design
const { width } = Dimensions.get("window");
const isSmallDevice = width < 375;

// Use your provided colors
const {
  primaryButton,
  secondaryButton,
  text,
  background,
  inputBackground,
  cardBackground,
  link,
  error,
} = Colors.light;

export const authStyles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor: background,
    padding: width * 0.05, // Responsive padding based on screen width
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  cardContainer: {
    backgroundColor: cardBackground,
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },

  // Typography
  header: {
    fontSize: isSmallDevice ? 24 : 28,
    fontWeight: "bold",
    color: text,
    marginBottom: 16,
    textAlign: "center",
    letterSpacing: 0.3,
  },
  subHeader: {
    fontSize: isSmallDevice ? 14 : 16,
    color: text,
    marginBottom: 24,
    textAlign: "center",
    lineHeight: 22,
    opacity: 0.85,
  },

  // Form elements
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: text,
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  input: {
    backgroundColor: inputBackground,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: text,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
    }),
  },
  inputFocused: {
    borderColor: primaryButton,
    borderWidth: 1.5,
  },
  pickerContainer: {
    backgroundColor: inputBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 20,
    height: 50, // Fixed height improves consistency across devices
  },
  errorText: {
    color: error,
    fontSize: 13,
    marginTop: 6,
    fontWeight: "500",
  },

  // Interactive elements
  forgotPassword: {
    color: link,
    textAlign: "right",
    marginBottom: 24,
    fontSize: 14,
    fontWeight: "500",
  },
  button: {
    backgroundColor: primaryButton,
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: primaryButton,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonSecondary: {
    backgroundColor: "transparent",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: secondaryButton,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  buttonTextSecondary: {
    color: secondaryButton,
    fontSize: 16,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  buttonDisabled: {
    backgroundColor: primaryButton,
    opacity: 0.6,
  },

  // Links and navigation
  linkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  linkText: {
    color: text,
    fontSize: 14,
    opacity: 0.8,
  },
  link: {
    color: link,
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 5,
  },

  // Utility styles
  confirmationMessage: {
    textAlign: "center",
    fontSize: 16,
    color: text,
    marginBottom: 24,
    lineHeight: 22,
    backgroundColor: "rgba(39, 174, 96, 0.1)",
    padding: 12,
    borderRadius: 8,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  column: {
    flex: 1,
    minWidth: width > 500 ? width * 0.35 : width * 0.42,
  },
  rightColumn: {
    marginLeft: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 24,
    width: "100%",
  },
  socialButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 8,
    paddingVertical: 12,
    marginHorizontal: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  socialButtonIcon: {
    marginRight: 8,
  },
});
