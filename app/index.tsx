import React, { useState, useEffect, useCallback } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import Entypo from "@expo/vector-icons/Entypo";

const slides = [
  {
    title: "Personalized Health Advice",
    description:
      "Get daily tips tailored to your health profile to improve your diet, exercise, and sleep.",
    image: require("../assets/images/image-1.png"),
    backgroundColor: "#f0f0f0", // Light background color for this slide
  },
  {
    title: "Track Fitness Goals",
    description:
      "Set goals, track progress, and stay motivated with smart AI insights.",
    image: require("../assets/images/image-2.png"),
    backgroundColor: "#e0f7fa", // Soft teal background
  },
  {
    title: "Monitor Your Nutrition",
    description:
      "Log meals, analyze nutrition, and get healthier meal suggestions.",
    image: require("../assets/images/image-3.png"),
    backgroundColor: "#ffccbc", // Coral background
  },
];

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const router = useRouter(); // Access the router

  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync(Entypo.font);
        // Artificially delay for two seconds to simulate a slow loading
        // experience. Please remove this if you copy and paste the code!
        // await new Promise((resolve) => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the application to render
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(() => {
    if (appIsReady) {
      // This tells the splash screen to hide immediately! If we call this after
      // `setAppIsReady`, then we may see a blank screen while the app is
      // loading its initial state and rendering its first pixels. So instead,
      // we hide the splash screen once we know the root view has already
      // performed layout.
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  const handleSkip = () => {
    router.push("/(tabs)"); // Navigate to the home screen using Expo Router
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      router.push("/(tabs)"); // Navigate to the home screen on the last slide
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: slides[currentSlide].backgroundColor },
      ]}
      onLayout={onLayoutRootView} // Ensure splash screen hides after layout
    >
      <View style={styles.slide}>
        <Image source={slides[currentSlide].image} style={styles.image} />
        <Text style={styles.title}>{slides[currentSlide].title}</Text>
        <Text style={styles.description}>
          {slides[currentSlide].description}
        </Text>
      </View>

      {/* Dot Component */}
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentSlide === index && styles.activeDot]}
          />
        ))}
      </View>

      {/* Button Container */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.buttonText}>Skip</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
          <Text style={styles.buttonText}>
            {currentSlide < slides.length - 1 ? "Next" : "Get Started"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 20,
  },
  slide: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  dotsContainer: {
    flexDirection: "row",
    marginBottom: 10, // Adjusted to slightly above the buttons
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#ddd",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#26C6DA",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    position: "absolute",
    bottom: 30, // Adjusted for better positioning at the bottom
    paddingHorizontal: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    color: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  skipButton: {
    backgroundColor: "#999",
    borderRadius: 20,
    flex: 1,
    marginRight: 10,
  },
  nextButton: {
    backgroundColor: "#0a7ea4", // Calm Blue
    borderRadius: 20,
    flex: 1,
    marginLeft: 10,
  },
});
