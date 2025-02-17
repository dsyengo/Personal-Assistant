import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

const Profile = () => {
  return (
    <View style={styles.container}>
      {/* Profile Picture */}
      <Image
        source={{ uri: "https://xsgames.co/randomusers/avatar.php?g=male" }} // Placeholder image
        style={styles.profilePicture}
      />

      {/* User Information */}
      <Text style={styles.userName}>Alex Johnson</Text>
      <Text style={styles.userEmail}>alex.johnson@example.com</Text>

      {/* Action Buttons */}
      <TouchableOpacity style={styles.button}>
        <Ionicons name="pencil" size={20} color={Colors.light.text} />
        <Text style={styles.buttonText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Ionicons name="log-out" size={20} color={Colors.light.text} />
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.background,
    padding: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.light.text,
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.light.cardBackground,
    padding: 10,
    borderRadius: 20,
    marginVertical: 5,
    width: "100%",
    justifyContent: "center",
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 16,
    color: Colors.light.text,
  },
});

export default Profile;
