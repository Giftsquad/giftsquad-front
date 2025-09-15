import { Tabs } from "expo-router";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

export default function EventLayout() {
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
        name="./main/createEvent"
        options={{
          title: "Créer un évènement",
          tabBarIcon: ({ color }) => (
            <Ionicons name="create" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="./main/event"
        options={{
          title: "Mes évènements",
          tabBarIcon: ({ color }) => (
            <FontAwesome name="calendar" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
