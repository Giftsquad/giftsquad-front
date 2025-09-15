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
        name="./main/event"
        options={{
          title: "Mes évènements",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="calendar" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="login"
        options={{
          title: "Se connecter",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="user" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="signup"
        options={{
          title: "S'inscrire",
          tabBarIcon: ({ color }) => (
            <Octicons name="sign-in" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
