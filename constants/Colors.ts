const calmBlue = '#4A90E2'; // Calm Blue
const flashGreen = '#4CAF50'; // Flash Green
const softTeal = '#26C6DA'; // Soft Teal
const lightGray = '#F2F2F2'; // Light Gray
const darkGray = '#333333'; // Dark Gray
const coral = '#FF6F61'; // Coral
const white = '#FFFFFF'; // White

export const Colors = {
  light: {
    text: darkGray, // Main Body Text
    background: lightGray, // Background for Content Areas
    tint: calmBlue, // App Bar/Navigation Bar
    icon: softTeal, // Selected Tabs or Icons
    tabIconDefault: darkGray, // Default Icons
    tabIconSelected: softTeal, // Selected Tabs or Icons
    primaryButton: calmBlue, // Primary Buttons
    secondaryButton: flashGreen, // Secondary Buttons/Interactive Elements
    success: flashGreen, // Success States
    warning: coral, // Critical Alerts/Warnings
    error: coral, // Error Messages
    inputBackground: white, // Input Fields and Forms
    cardBackground: white, // Cards and Containers
    link: softTeal, // Links and Hyperlinks
  },
  dark: {
    text: '#ECEDEE', // Main Body Text in Dark Mode
    background: '#151718', // Dark Background
    tint: white, // App Bar/Navigation Bar in Dark Mode
    icon: flashGreen, // Selected Tabs or Icons in Dark Mode
    tabIconDefault: '#9BA1A6', // Default Icons in Dark Mode
    tabIconSelected: white, // Selected Tabs or Icons in Dark Mode
    primaryButton: calmBlue, // Primary Buttons
    secondaryButton: flashGreen, // Secondary Buttons/Interactive Elements
    success: flashGreen, // Success States
    warning: coral, // Critical Alerts/Warnings
    error: coral, // Error Messages
    inputBackground: '#1E1E1E', // Input Fields in Dark Mode
    cardBackground: '#242424', // Cards and Containers in Dark Mode
    link: softTeal, // Links and Hyperlinks
  },
};

export type ThemeColors = typeof Colors.light | typeof Colors.dark;
