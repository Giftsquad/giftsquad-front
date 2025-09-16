import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { theme } from '../../styles/theme';

export default function AuthLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.components.tabBar.activeTintColor,
        tabBarInactiveTintColor: theme.components.tabBar.inactiveTintColor,
        tabBarStyle: {
          backgroundColor: theme.components.tabBar.backgroundColor,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name='signup'
        options={{
          title: "S\'inscrire",
          tabBarIcon: ({ color }) => (
            <Ionicons name='person-add' size={24} color={color} />
          ),
        }}
      />
      
      <Tabs.Screen
        name='login'
        options={{
          title: 'Se connecter',
          tabBarIcon: ({ color }) => (
            <Ionicons name='person' size={24} color={color} />
          ),
        }}
      />
      
    </Tabs>
  );
}
