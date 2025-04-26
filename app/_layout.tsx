import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../app/(auth)/AuthContext";
import { ThemeProvider } from "./contexts/theme-context";
import RootNavigator from "./navigator";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ThemeProvider>
          <RootNavigator />
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
