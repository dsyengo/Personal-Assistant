import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import * as Font from "expo-font";
import Entypo from "@expo/vector-icons/Entypo";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    title: "Personalized Health Advice",
    description:
      "Get daily tips tailored to your health profile to improve your diet, exercise, and sleep.",
    image: require("../assets/images/image-1.png"),
    colors: ["#f0f0f0", "#e6e6e6"], // Light gradient for this slide
  },
  {
    title: "Track Fitness Goals",
    description:
      "Set goals, track progress, and stay motivated with smart AI insights.",
    image: require("../assets/images/image-2.png"),
    colors: ["#e0f7fa", "#b2ebf2"], // Teal gradient
  },
  {
    title: "Monitor Your Nutrition",
    description:
      "Log meals, analyze nutrition, and get healthier meal suggestions.",
    image: require("../assets/images/image-3.png"),
    colors: ["#ffccbc", "#ffab91"], // Coral gradient
  },
];

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [appIsReady, setAppIsReady] = useState(false);

  const router = useRouter();

  useEffect(() => {
    async function prepare() {
      try {
        // Pre-load fonts, make any API calls you need to do here
        await Font.loadAsync(Entypo.font);
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(() => {
    if (appIsReady) {
      SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null;
  }

  const handleSkip = () => {
    // Navigate to login screen instead of tabs
    router.push("/(auth)/login");
  };

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // Navigate to login screen on the last slide
      router.push("/(auth)/login");
    }
  };

  return (
    <View style={styles.container} onLayout={onLayoutRootView}>
      <StatusBar translucent backgroundColor="transparent" />

      {/* Background Gradient */}
      <LinearGradient
        colors={slides[currentSlide].colors}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />

      {/* Skip button positioned at top right */}
      <TouchableOpacity
        onPress={handleSkip}
        style={styles.skipButtonTop}
        hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
      >
        <Text style={styles.skipButtonText}>Skip</Text>
      </TouchableOpacity>

      {/* Slide Content */}
      <View style={styles.slideContentContainer}>
        <Image
          source={slides[currentSlide].image}
          style={styles.image}
          resizeMode="contain"
        />

        <View style={styles.textContainer}>
          <Text style={styles.title}>{slides[currentSlide].title}</Text>
          <Text style={styles.description}>
            {slides[currentSlide].description}
          </Text>
        </View>
      </View>

      {/* Bottom Navigation Area */}
      <View style={styles.bottomContainer}>
        {/* Dot Indicators */}
        <View style={styles.dotsContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentSlide === index ? styles.activeDot : null,
              ]}
            />
          ))}
        </View>

        {/* Next/Get Started Button */}
        <TouchableOpacity
          onPress={handleNext}
          style={styles.nextButton}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#0a7ea4", "#26C6DA"]}
            style={styles.gradientButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.buttonText}>
              {currentSlide < slides.length - 1 ? "Next" : "Get Started"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  skipButtonTop: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  slideContentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: height * 0.1,
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
    marginBottom: 30,
  },
  textContainer: {
    width: width * 0.85,
    alignItems: "center",
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  description: {
    fontSize: 17,
    color: "#555",
    textAlign: "center",
    lineHeight: 24,
  },
  bottomContainer: {
    width: "100%",
    paddingBottom: height * 0.08,
    alignItems: "center",
  },
  dotsContainer: {
    flexDirection: "row",
    marginBottom: 30,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "rgba(0,0,0,0.2)",
    marginHorizontal: 5,
  },
  activeDot: {
    width: 24,
    backgroundColor: "#26C6DA",
    borderRadius: 12,
  },
  nextButton: {
    width: width * 0.85,
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  gradientButton: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 0.5,
  },
});
