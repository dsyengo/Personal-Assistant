import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useAuth } from "../(auth)/AuthContext";
import * as ImagePicker from "expo-image-picker";

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState(user);
  const [editable, setEditable] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);

  useEffect(() => {
    if (user) {
      setUserData(user);
    }
  }, [user]);

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setProfileImage(result.uri);
    }
  };

  const handleSave = () => {
    setEditable(false);
    // Here, you can integrate an API call to update user info.
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleImagePick}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <Ionicons
              name="person-circle"
              size={100}
              color={Colors.light.primaryButton}
            />
          )}
        </TouchableOpacity>
        <Text style={styles.name}>
          {userData.firstName} {userData.lastName}
        </Text>
        <Text style={styles.email}>{userData.email}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>Personal Information</Text>
        <TextInput
          style={styles.input}
          editable={editable}
          value={userData.phone || "N/A"}
          placeholder="Phone Number"
        />
        <TextInput
          style={styles.input}
          editable={editable}
          value={userData.address || "N/A"}
          placeholder="Address"
        />
        <TextInput
          style={styles.input}
          editable={editable}
          value={userData.age?.toString() || "N/A"}
          placeholder="Age"
        />
        <TextInput
          style={styles.input}
          editable={editable}
          value={userData.gender || "N/A"}
          placeholder="Gender"
        />
        <TextInput
          style={styles.input}
          editable={editable}
          value={userData.height ? `${userData.height} cm` : "N/A"}
          placeholder="Height"
        />
        <TextInput
          style={styles.input}
          editable={editable}
          value={userData.weight ? `${userData.weight} kg` : "N/A"}
          placeholder="Weight"
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>Lifestyle & Medical</Text>
        <TextInput
          style={styles.input}
          editable={editable}
          value={userData.lifestyleHabits || "N/A"}
          placeholder="Lifestyle"
        />
        <Text style={styles.info}>Medical History:</Text>
        <Text style={styles.medicalText}>
          {JSON.stringify(userData.medicalHistory, null, 2)}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => setEditable(!editable)}
      >
        <Text style={styles.buttonText}>
          {editable ? "Cancel" : "Edit Profile"}
        </Text>
      </TouchableOpacity>
      {editable && (
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Changes</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: Colors.light.text,
  },
  email: {
    fontSize: 16,
    color: Colors.light.subText,
  },
  infoContainer: {
    backgroundColor: Colors.light.cardBackground,
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.light.primaryButton,
    marginBottom: 5,
  },
  input: {
    fontSize: 16,
    color: Colors.light.text,
    backgroundColor: "#f5f5f5",
    padding: 8,
    borderRadius: 5,
    marginBottom: 5,
  },
  info: {
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 5,
  },
  medicalText: {
    fontSize: 14,
    color: Colors.light.text,
    backgroundColor: "#f5f5f5",
    padding: 5,
    borderRadius: 5,
  },
  editButton: {
    backgroundColor: Colors.light.primaryButton,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: Colors.light.success,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "bold",
  },
});

export default Profile;
