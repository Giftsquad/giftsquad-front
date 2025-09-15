import { Tabs } from "expo-router";
import { FontAwesome, Octicons } from "@expo/vector-icons";

export default function AuthLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#999",
        tabBarStyle: {
          backgroundColor: "#6fd34e",
        },
      }}
    >
      <Tabs.Screen
        name="signup" // correspond au fichier app/auth/signup.js
        options={{
          title: "S'inscrire",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="login" // correspond au fichier app/auth/login.js
        options={{
          title: "Se connecter",
          tabBarIcon: ({ color }) => (
            <Octicons name="sign-in" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
